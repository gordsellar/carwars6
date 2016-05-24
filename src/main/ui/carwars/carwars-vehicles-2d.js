/*
 Car Wars is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games.
 All rights are reserved by Steve Jackson Games.

 This game aid is the original creation of Aaron Mulder and is released for free distribution, and not for resale,
 under the permissions granted in the Steve Jackson Games Online Policy.

 Application code for this game aid (except for the Car Wars rules as noted above) copyright 2013 Aaron Mulder.
 */
/* global CW, CWD */
(function() {
    "use strict";
    CWD.semiTrailerBody = {
        tongue: false,
        hoverHitch: CWD.createShape("Hitch", "editAddHitch"),
        contains: function (car, mx, my) {
            if (car.car.hitch && (mx >= car.widthToBody - 48 && mx <= car.widthToBody - 10)
                && (my >= car.heightToBody + car.bodyHeight * 0.4 && my <= car.heightToBody + car.bodyHeight * 0.6)) {
                return this.hoverHitch;
            }
            return null;
        },
        width: function (car) {
            var min, max;
            if (car.car.isFlatbed()) {
                min = car.widthToBody - 5;
                max = car.widthToBody + car.bodyWidth + 100 + (this.tongue ? 50 : 0);
            } else {
                min = car.widthToBody;
                max = car.widthToBody + car.bodyWidth + (this.tongue ? 50 : 0);
            }
            if (car.backWheelguards.length > 0) min = car.widthToBody - 10;
            if (car.car.hitch) min = car.widthToBody - 63;
            return {width: max, offset: min};
        },
        getMinimumX: function(car, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            if(car.car.hitch) return widthToBody - 63;
            if(car.backWheelguards.length > 0) return widthToBody - 10;
            if(car.car.isFlatbed()) return widthToBody - 5;
            return widthToBody;
        },
        frontHoverPadding: function(car) {return (car.car.isFlatbed() ? 105 : 0) + (this.tongue ? 50 : 0);},
        layoutTires: function (shape, flatbed, compress) {
            var offset = shape.widthToBody, frontLeft;
            var j, voffset = flatbed ? 0 : 5;
            for (j = 0; j < 2; j++) {
                shape.leftTires[j].layout(offset, shape.heightToBody - CWD.tireHeight + voffset, CWD.tireWidth, CWD.tireHeight);
                shape.rightTires[j].layout(offset, shape.heightToBody + shape.bodyHeight - voffset, CWD.tireWidth, CWD.tireHeight);
                offset += CWD.tireWidth + (compress ? 21 : 25);
            }
            offset = shape.widthToBody;
            for (j = 2; j < 4; j++) {
                shape.leftTires[j].layout(offset, shape.heightToBody - CWD.tireHeight * 2 + voffset, CWD.tireWidth, CWD.tireHeight);
                shape.rightTires[j].layout(offset, shape.heightToBody + shape.bodyHeight + CWD.tireHeight - voffset, CWD.tireWidth, CWD.tireHeight);
                offset += CWD.tireWidth + (compress ? 21 : 25);
            }
            if (shape.leftTires.length > 4) {
                frontLeft = shape.widthToBody + shape.bodyWidth - CWD.tireWidth - (compress ? 0 : 10);
                if (shape.car.isFlatbed()) frontLeft += 110;
                shape.leftTires[4].layout(frontLeft, shape.heightToBody - CWD.tireHeight + voffset,
                    CWD.tireWidth, CWD.tireHeight);
                shape.rightTires[4].layout(frontLeft, shape.heightToBody + shape.bodyHeight - voffset,
                    CWD.tireWidth, CWD.tireHeight);
                if (shape.leftTires.length > 5) {
                    shape.leftTires[5].layout(frontLeft, shape.heightToBody - CWD.tireHeight * 2 + voffset,
                        CWD.tireWidth, CWD.tireHeight);
                    shape.rightTires[5].layout(frontLeft, shape.heightToBody + shape.bodyHeight + CWD.tireHeight - voffset,
                        CWD.tireWidth, CWD.tireHeight);
                }
            }
            var result = offset;
            offset = shape.widthToBody;
            if (shape.backWheelhubs.length > 0) {
                voffset = CWD.tireHeight;
                if (!flatbed) voffset -= 5;
                for (j = 0; j < 2; j++) {
                    shape.backWheelhubs[j * 2].layout(
                        offset, shape.heightToBody + shape.bodyHeight + CWD.tireHeight + voffset, CWD.tireWidth, CWD.whHeight);
                    shape.backWheelhubs[j * 2 + 1].layout(
                        offset, shape.heightToBody - CWD.tireHeight - CWD.whHeight - voffset, CWD.tireWidth, CWD.whHeight);
                    offset += CWD.tireWidth + (compress ? 21 : 25);
                }
            }
            offset = shape.widthToBody;
            if (shape.backWheelguards.length > 0) {
                voffset = CWD.tireHeight + (shape.backWheelhubs.length > 0 ? CWD.whHeight : 0);
                if (!flatbed) voffset -= 5;
                for (j = 0; j < 2; j++) {
                    shape.backWheelguards[j * 2].layout(
                        offset, shape.heightToBody + shape.bodyHeight + CWD.tireHeight + voffset,
                        CWD.tireWidth, CWD.wgHeight);
                    shape.backWheelguards[j * 2 + 1].layout(
                        offset, shape.heightToBody - CWD.tireHeight - CWD.wgHeight - voffset,
                        CWD.tireWidth, CWD.wgHeight);
                    offset += CWD.tireWidth + (compress ? 21 : 25);
                }
            }
            if (shape.frontWheelhubs.length > 0) {
                voffset = shape.car.fullTrailerTires === 4 ? CWD.tireHeight : 0;
                if (!flatbed) voffset -= 5;
                shape.frontWheelhubs[0].layout(shape.widthToBody + shape.bodyWidth - CWD.tireWidth - (compress ? 0 : 10),
                        shape.heightToBody + shape.bodyHeight + CWD.tireHeight + voffset, CWD.tireWidth, CWD.whHeight);
                shape.frontWheelhubs[1].layout(shape.widthToBody + shape.bodyWidth - CWD.tireWidth - (compress ? 0 : 10),
                        shape.heightToBody - CWD.tireHeight - CWD.whHeight - voffset, CWD.tireWidth, CWD.whHeight);
            }
            if (shape.frontWheelguards.length > 0) {
                voffset = (shape.car.fullTrailerTires === 4 ? CWD.tireHeight : 0) + (shape.frontWheelhubs.length > 0 ? CWD.whHeight : 0);
                if (!flatbed) voffset -= 5;
                shape.frontWheelguards[0].layout(shape.widthToBody + shape.bodyWidth - CWD.tireWidth - (compress ? 0 : 10),
                        shape.heightToBody + shape.bodyHeight + CWD.tireHeight + voffset, CWD.tireWidth, CWD.wgHeight);
                shape.frontWheelguards[1].layout(shape.widthToBody + shape.bodyWidth - CWD.tireWidth - (compress ? 0 : 10),
                        shape.heightToBody - CWD.tireHeight - CWD.wgHeight - voffset, CWD.tireWidth, CWD.wgHeight);
            }
            return result;
        },
        drawLowerBody: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            var i, dp, dpSize;
            for (i = 0; i < car.leftTires.length; i++) car.leftTires[i].draw(ctx, car.leftTires[i] === hoverShape ? CWD.hoverStroke : borderColor);
            for (i = 0; i < car.rightTires.length; i++) car.rightTires[i].draw(ctx, car.rightTires[i] === hoverShape ? CWD.hoverStroke : borderColor);
            if (this.tongue) {
                ctx.strokeStyle = borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                if (car.car.isFlatbed())
                    this.drawTongue(ctx, car.car.totalTongueDP(), widthToBody + bodyWidth + 100, heightToBody, bodyHeight);
                else
                    this.drawTongue(ctx, car.car.totalTongueDP(), widthToBody + bodyWidth, heightToBody, bodyHeight);
            }
            if (car.car.hitch) {
                dp = car.car.hitch ? car.car.hitch.totalDP() : 1;
                dpSize = dp < 5 ? 13.5 : 10;
                this.hitchEnd = (dp <= 5 ? 30 : dp <= 10 ? 30 + dpSize : 30 + dpSize + dpSize);

                ctx.strokeStyle = hoverShape === this.hoverHitch ? CWD.hoverStroke : borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.beginPath();
                ctx.moveTo(widthToBody, heightToBody + 25);
                ctx.lineTo(widthToBody - 10, heightToBody + 25);
                ctx.lineTo(widthToBody - 10, heightToBody + bodyHeight / 2 - 31);
                ctx.lineTo(widthToBody - this.hitchEnd, heightToBody + bodyHeight / 2 - 31);
                ctx.lineTo(widthToBody - this.hitchEnd, heightToBody + bodyHeight / 2 - 4);
                ctx.lineTo(widthToBody - this.hitchEnd - 8, heightToBody + bodyHeight / 2 - 4);
                ctx.lineTo(widthToBody - this.hitchEnd - 8, heightToBody + bodyHeight / 2 + 4);
                ctx.lineTo(widthToBody - this.hitchEnd, heightToBody + bodyHeight / 2 + 4);
                ctx.lineTo(widthToBody - this.hitchEnd, heightToBody + bodyHeight / 2 + 31);
                ctx.lineTo(widthToBody - 10, heightToBody + bodyHeight / 2 + 31);
                ctx.lineTo(widthToBody - 10, heightToBody + bodyHeight - 25);
                ctx.lineTo(widthToBody, heightToBody + bodyHeight - 25);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(widthToBody - this.hitchEnd - 3, heightToBody + bodyHeight / 2);
                ctx.arc(widthToBody - this.hitchEnd - 8, heightToBody + bodyHeight / 2, 5, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // DP
                ctx.fillStyle = CWD.dpFill;
                if (dp <= 5) {
                    for (i = 0; i < dp; i++) {
                        ctx.fillRect(widthToBody - 26, heightToBody + bodyHeight / 2 - dp * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 26, heightToBody + bodyHeight / 2 - dp * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                } else if (dp <= 10) {
                    for (i = 0; i < 5; i++) {
                        ctx.fillRect(widthToBody - 26, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 26, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                    for (i = 0; i < dp - 5; i++) {
                        ctx.fillRect(widthToBody - 26 - dpSize, heightToBody + bodyHeight / 2 - (dp - 5) * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 26 - dpSize, heightToBody + bodyHeight / 2 - (dp - 5) * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                } else {
                    for (i = 0; i < 5; i++) {
                        ctx.fillRect(widthToBody - 26, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 26, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                    for (i = 0; i < 5; i++) {
                        ctx.fillRect(widthToBody - 26 - dpSize, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 26 - dpSize, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                    for (i = 0; i < dp - 10; i++) {
                        ctx.fillRect(widthToBody - 26 - dpSize - dpSize, heightToBody + bodyHeight / 2 - (dp - 10) * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 26 - dpSize - dpSize, heightToBody + bodyHeight / 2 - (dp - 10) * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                }
            }
            ctx.beginPath();
            ctx.closePath();
        },
        draw: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;
            if (car.car.isFlatbed())
                this.drawFlatbed(car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly);
            else
                this.drawVan(car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly);
        },
        drawFlatbed: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            // Trailer Body
            ctx.fillStyle = CWD.backgroundColor;
            ctx.fillRect(widthToBody - 5, heightToBody - 5, bodyWidth + 110, bodyHeight + 10);
            ctx.strokeRect(widthToBody - 5, heightToBody - 5, bodyWidth + 110, bodyHeight + 10);
            // Armored Box
            ctx.beginPath();
            ctx.moveTo(widthToBody, heightToBody + 10);
            ctx.arcTo(widthToBody, heightToBody, widthToBody + 10, heightToBody, 10);
            ctx.lineTo(widthToBody + 20, heightToBody);
            ctx.arcTo(widthToBody + bodyWidth, heightToBody, widthToBody + bodyWidth, heightToBody + 10, 10);
            ctx.lineTo(widthToBody + bodyWidth, heightToBody + 20);
            ctx.arcTo(widthToBody + bodyWidth, heightToBody + bodyHeight, widthToBody + bodyWidth - 10, heightToBody + bodyHeight, 10);
            ctx.lineTo(widthToBody + bodyWidth - 20, heightToBody + bodyHeight);
            ctx.arcTo(widthToBody, heightToBody + bodyHeight, widthToBody, heightToBody + bodyHeight - 10, 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        },
        drawVan: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            // Trailer Body
            ctx.beginPath();
            ctx.moveTo(widthToBody, heightToBody + 10);
            ctx.arcTo(widthToBody, heightToBody, widthToBody + 10, heightToBody, 10);
            ctx.lineTo(widthToBody + 20, heightToBody);
            ctx.arcTo(widthToBody + bodyWidth, heightToBody, widthToBody + bodyWidth, heightToBody + 10, 10);
            ctx.lineTo(widthToBody + bodyWidth, heightToBody + 20);
            ctx.arcTo(widthToBody + bodyWidth, heightToBody + bodyHeight, widthToBody + bodyWidth - 10, heightToBody + bodyHeight, 10);
            ctx.lineTo(widthToBody + bodyWidth - 20, heightToBody + bodyHeight);
            ctx.arcTo(widthToBody, heightToBody + bodyHeight, widthToBody, heightToBody + bodyHeight - 10, 10);
            ctx.closePath();
        }
    };
    CWD.carTrailerBody = {
        tongue: true,
        contains: CWD.semiTrailerBody.contains,
        width: CWD.semiTrailerBody.width,
        getMinimumX: CWD.semiTrailerBody.getMinimumX,
        frontHoverPadding: CWD.semiTrailerBody.frontHoverPadding,
        drawLowerBody: CWD.semiTrailerBody.drawLowerBody,
        draw: CWD.semiTrailerBody.draw,
        drawFlatbed: CWD.semiTrailerBody.drawFlatbed,
        drawVan: CWD.semiTrailerBody.drawVan,
        layoutTires: function (shape, size, flatbed) {
            var j, offset = shape.widthToBody;
            var voffset = flatbed ? 0 : 5;
            for (j = 0; j < Math.min(2, shape.leftTires.length); j++) {
                shape.leftTires[j].layout(offset, shape.heightToBody - CWD.tireHeight + voffset, CWD.tireWidth, CWD.tireHeight);
                shape.rightTires[j].layout(offset, shape.heightToBody + shape.bodyHeight - voffset, CWD.tireWidth, CWD.tireHeight);
                offset += CWD.tireWidth + 25;
            }
            if (shape.leftTires.length > 2) {
                offset = shape.widthToBody;
                for (j = 2; j < shape.leftTires.length; j++) {
                    shape.leftTires[j].layout(offset, shape.heightToBody - CWD.tireHeight * 2 + voffset, CWD.tireWidth, CWD.tireHeight);
                    shape.rightTires[j].layout(offset, shape.heightToBody + shape.bodyHeight + CWD.tireHeight - voffset, CWD.tireWidth, CWD.tireHeight);
                    offset += CWD.tireWidth + 25;
                }
            }
            var result = offset;
            offset = shape.widthToBody;
            if (shape.backWheelhubs.length > 0) {
                voffset = shape.car.body.tirePairs > 2 ? CWD.tireHeight : 0;
                if (!flatbed) voffset -= 5;
                for (j = 0; j < Math.min(2, shape.leftTires.length); j++) {
                    shape.backWheelhubs[j * 2].layout(
                        offset, shape.heightToBody + shape.bodyHeight + CWD.tireHeight + voffset, CWD.tireWidth, CWD.whHeight);
                    shape.backWheelhubs[j * 2 + 1].layout(
                        offset, shape.heightToBody - CWD.tireHeight - CWD.whHeight - voffset, CWD.tireWidth, CWD.whHeight);
                    offset += CWD.tireWidth + 25;
                }
            }
            offset = shape.widthToBody;
            if (shape.backWheelguards.length > 0) {
                voffset = shape.car.body.tirePairs > 2 ? CWD.tireHeight : 0;
                voffset += shape.backWheelhubs.length > 0 ? CWD.whHeight : 0;
                if (!flatbed) voffset -= 5;
                for (j = 0; j < Math.min(2, shape.leftTires.length); j++) {
                    shape.backWheelguards[j * 2].layout(
                        offset, shape.heightToBody + shape.bodyHeight + CWD.tireHeight + voffset,
                        CWD.tireWidth, CWD.wgHeight);
                    shape.backWheelguards[j * 2 + 1].layout(
                        offset, shape.heightToBody - CWD.tireHeight - CWD.wgHeight - voffset,
                        CWD.tireWidth, CWD.wgHeight);
                    offset += CWD.tireWidth + 25;
                }
            }
            return result;
        },
        drawTongue: function (ctx, dp, left, heightToBody, bodyHeight) {
            var i;
            ctx.beginPath();
            ctx.moveTo(left, heightToBody + bodyHeight / 4);
            ctx.lineTo(left + 50, heightToBody + bodyHeight / 2 - 5);
            var slope = (bodyHeight / 4 - 5) / 50;
            ctx.lineTo(left + 50, heightToBody + bodyHeight / 2 + 5);
            ctx.lineTo(left, heightToBody + bodyHeight * 3 / 4);
            ctx.lineTo(left, heightToBody + bodyHeight * 3 / 4 - 10);
            ctx.lineTo(left + 20, heightToBody + bodyHeight * 3 / 4 - 20 * slope - 10);
            ctx.lineTo(left + 20, heightToBody + bodyHeight / 4 + 20 * slope + 10);
            ctx.lineTo(left, heightToBody + bodyHeight / 4 + 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Tongue DP
            var dpSize = bodyHeight < 300 ? dp < 7 ? bodyHeight * 0.05 - 2 : bodyHeight * 0.04 - 2 : bodyHeight * 0.04 - 2;
            ctx.fillStyle = CWD.dpFill;
            if (dp <= 4) {
                for (i = 0; i < dp; i++) {
                    ctx.fillRect(left + 22, heightToBody + bodyHeight / 2 - dp * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    ctx.strokeRect(left + 22, heightToBody + bodyHeight / 2 - dp * dpSize / 2 + i * dpSize, dpSize, dpSize);
                }
            } else {
                for (i = 0; i < 4; i++) {
                    ctx.fillRect(left + 22, heightToBody + bodyHeight / 2 - 4 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    ctx.strokeRect(left + 22, heightToBody + bodyHeight / 2 - 4 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                }
                for (i = 0; i < dp - 4; i++) {
                    ctx.fillRect(left + 22 + dpSize, heightToBody + bodyHeight / 2 - (dp - 4) * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    ctx.strokeRect(left + 22 + dpSize, heightToBody + bodyHeight / 2 - (dp - 4) * dpSize / 2 + i * dpSize, dpSize, dpSize);
                }
            }
        }
    };
    CWD.carBody1 = {
        hoverSpoiler: CWD.createShape("Spoiler", "editAddSpoiler"),
        hoverAirdam: CWD.createShape("Airdam", "editAddAirdam"),
        hoverRamplate: CWD.createShape("Ramplate", "editAddRamplate"),
        hoverFrontSpikes: CWD.createShape("Bumper Spikes", "editBodyMods"),
        hoverHitch: CWD.createShape("Hitch", "editAddHitch"),
        ramplateWidth: 40,
        contains: function (car, mx, my) {
            if ((mx >= car.widthToBody - 30 && mx <= car.widthToBody - 10) && (my >= car.heightToBody + 20 && my <= car.heightToBody + car.bodyHeight - 20)) {
                this.hoverSpoiler.hoverText = car.car.spoiler ? "Spoiler" : "Add Spoiler";
                return this.hoverSpoiler;
            }
            if ((mx >= car.widthToBody - 48 && mx <= car.widthToBody - 10)
                && (my >= car.heightToBody + car.bodyHeight * 0.4 && my <= car.heightToBody + car.bodyHeight * 0.6)) {
                this.hoverHitch.hoverText = car.car.hitch ? "Hitch" : "Add Hitch";
                return this.hoverHitch;
            }
            if (mx >= car.widthToBody + car.bodyWidth + 8 && mx <= car.widthToBody + car.bodyWidth + (car.car.ramplate || car.car.fakeRamplate || car.car.bumperSpikes ? 30 : 37)
                && my >= car.heightToBody + car.bodyHeight * 0.13 && my <= car.heightToBody + car.bodyHeight * 0.87) {
                this.hoverAirdam.hoverText = car.car.airdam ? "Airdam" : "Add Airdam";
                return this.hoverAirdam;
            }
            if (car.car.bumperSpikes || car.car.ramplate || car.car.fakeRamplate) {
                if (mx >= car.widthToBody + car.bodyWidth + 8 && mx <= car.widthToBody + car.bodyWidth + 40
                    && my >= car.heightToBody + car.bodyHeight * 0.1 && my <= car.heightToBody + car.bodyHeight * 0.9) {
                    if (car.car.bumperSpikes) {
                        return this.hoverFrontSpikes;
                    } else {
                        this.hoverRamplate.hoverText = car.car.ramplate ? "Ramplate" : "Fake Ramplate";
                        return this.hoverRamplate;
                    }
                }
            } else { // Give some space between an airdam and a hypothetical ramplate
                if (mx >= car.widthToBody + car.bodyWidth + 40 && mx <= car.widthToBody + car.bodyWidth + 50
                    && my >= car.heightToBody + car.bodyHeight * 0.1 && my <= car.heightToBody + car.bodyHeight * 0.9) {
                    this.hoverRamplate.hoverText = "Add Ramplate";
                    return this.hoverRamplate;
                }
            }
            return null;
        },
        width: function (car) {
            var min = car.widthToBody - 25;
            var max = car.widthToBody + car.bodyWidth + 25;
            if (car.car.airdam) max = car.widthToBody + car.bodyWidth + 37;
            if (car.car.ramplate || car.car.fakeRamplate || car.car.bumperSpikes) max = car.widthToBody + car.bodyWidth + 40;
            if (car.car.spoiler) min = car.widthToBody - 35;
            if (car.car.hitch) min = car.widthToBody - this.hitchEnd - 8 - 5;
            return {width: max, offset: min};
        },
        getMinimumX: function(car, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            return -40-(bodyHeight * 0.04 - 2)-(bodyHeight * 0.04 - 2)-8-5; // Hitch with 10 DP
        },
        frontHoverPadding: function() {
            return 50;
        },
        layoutTires: function (car) {
            var offset;
            var widthToBody = car.widthToBody, bodyWidth = car.bodyWidth, heightToBody = car.heightToBody, bodyHeight = car.bodyHeight;
            car.frontRightTire.layout(
                    widthToBody + bodyWidth - CWD.tireWidth - 20, heightToBody + bodyHeight - 10,
                CWD.tireWidth, CWD.tireHeight + 10);
            car.frontLeftTire.layout(
                    widthToBody + bodyWidth - CWD.tireWidth - 20, heightToBody - CWD.tireHeight,
                CWD.tireWidth, CWD.tireHeight + 10);
            if (car.frontWheelhubs.length > 0) {
                car.frontWheelhubs[0].layout(
                        widthToBody + bodyWidth - CWD.tireWidth - 20, heightToBody + bodyHeight + CWD.tireHeight,
                    CWD.tireWidth, CWD.whHeight);
                car.frontWheelhubs[1].layout(
                        widthToBody + bodyWidth - CWD.tireWidth - 20, heightToBody - CWD.tireHeight - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
            }
            if (car.frontWheelguards.length > 0) {
                offset = car.frontWheelhubs.length > 0 ? CWD.whHeight : 0;
                car.frontWheelguards[0].layout(
                        widthToBody + bodyWidth - CWD.tireWidth - 20, heightToBody + bodyHeight + CWD.tireHeight + offset,
                    CWD.tireWidth, CWD.wgHeight);
                car.frontWheelguards[1].layout(
                        widthToBody + bodyWidth - CWD.tireWidth - 20, heightToBody - CWD.tireHeight - CWD.wgHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
            }
            if (car.middleLeftTire) {
                if (car.thirdRowTiresInMiddle) {
                    car.middleRightTire.layout(widthToBody + CWD.tireWidth, heightToBody + bodyHeight,
                        CWD.tireWidth, CWD.tireHeight); // TODO: make space for wheelguards in this layout
                    car.middleLeftTire.layout(widthToBody + CWD.tireWidth, heightToBody - CWD.tireHeight,
                        CWD.tireWidth, CWD.tireHeight);
                } else {
                    car.middleRightTire.layout(widthToBody + 20, heightToBody + bodyHeight + CWD.tireHeight,
                        CWD.tireWidth, CWD.tireHeight);
                    car.middleLeftTire.layout(widthToBody + 20, heightToBody - CWD.tireHeight * 2,
                        CWD.tireWidth, CWD.tireHeight);
                }
                // TODO: middle wheelhubs, middle wheelguards
            }
            car.backRightTire.layout(widthToBody + 20, heightToBody + bodyHeight - 10,
                CWD.tireWidth, CWD.tireHeight + 10);
            car.backLeftTire.layout(widthToBody + 20, heightToBody - CWD.tireHeight,
                CWD.tireWidth, CWD.tireHeight + 10);
            if (car.backWheelhubs.length > 0) {
                car.backWheelhubs[0].layout(
                        widthToBody + 20, heightToBody + bodyHeight + CWD.tireHeight + (car.middleLeftTire === null || car.thirdRowTiresInMiddle ? 0 : CWD.tireHeight),
                    CWD.tireWidth, CWD.whHeight);
                car.backWheelhubs[1].layout(
                        widthToBody + 20, heightToBody - CWD.tireHeight - CWD.whHeight - (car.middleLeftTire === null || car.thirdRowTiresInMiddle ? 0 : CWD.tireHeight),
                    CWD.tireWidth, CWD.whHeight);
            }
            if (car.backWheelguards.length > 0) {
                offset = car.backWheelhubs.length > 0 ? CWD.whHeight : 0;
                if (car.middleLeftTire && !car.thirdRowTiresInMiddle) offset += CWD.tireHeight;
                car.backWheelguards[0].layout(
                        widthToBody + 20, heightToBody + bodyHeight + CWD.tireHeight + offset,
                    CWD.tireWidth, CWD.wgHeight);
                car.backWheelguards[1].layout(
                        widthToBody + 20, heightToBody - CWD.tireHeight - CWD.wgHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
            }
        },
        drawLowerBody: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            var i, dp, dpSize;
            // Draw the tires
            if (car.frontRightTire) car.frontRightTire.draw(ctx, car.frontRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            if (car.frontLeftTire) car.frontLeftTire.draw(ctx, car.frontLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            if (car.backRightTire) car.backRightTire.draw(ctx, car.backRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            if (car.backLeftTire) car.backLeftTire.draw(ctx, car.backLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            if (car.middleLeftTire) car.middleLeftTire.draw(ctx, car.middleLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            if (car.middleRightTire) car.middleRightTire.draw(ctx, car.middleRightTire === hoverShape ? CWD.hoverStroke : borderColor);

            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;

            // Draw accessories that render below the body
            if (car.car.airdam || hoverShape === this.hoverAirdam) {
                if (!carOnly) {
                    // Fill in black underneath
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.moveTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.89);
                    ctx.quadraticCurveTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.8,
                            widthToBody + bodyWidth + 37, heightToBody + bodyHeight / 2);
                    ctx.quadraticCurveTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.2,
                            widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.11);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = CWD.backgroundColor;
                }
                ctx.strokeStyle = hoverShape === this.hoverAirdam ? CWD.hoverStroke : borderColor;
                // Outer Ring
                ctx.beginPath();
                ctx.moveTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.13);
                ctx.quadraticCurveTo(widthToBody + bodyWidth + 32, heightToBody + bodyHeight * 0.2,
                        widthToBody + bodyWidth + 32, heightToBody + bodyHeight / 2);
                ctx.quadraticCurveTo(widthToBody + bodyWidth + 32, heightToBody + bodyHeight * 0.8,
                        widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.87);
                ctx.moveTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.89);
                ctx.quadraticCurveTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.8,
                        widthToBody + bodyWidth + 37, heightToBody + bodyHeight / 2);
                ctx.quadraticCurveTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.2,
                        widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.11);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // Inner Ring
                ctx.beginPath();
                ctx.moveTo(widthToBody + bodyWidth + 10, heightToBody + bodyHeight * 0.15);
                ctx.quadraticCurveTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.2,
                        widthToBody + bodyWidth + 30, heightToBody + bodyHeight / 2);
                ctx.quadraticCurveTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.8,
                        widthToBody + bodyWidth + 10, heightToBody + bodyHeight * 0.85);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            if (car.car.ramplate || car.car.fakeRamplate || hoverShape === this.hoverRamplate) {
                ctx.strokeStyle = hoverShape === this.hoverRamplate ? CWD.hoverStroke : borderColor;
                ctx.beginPath();

                ctx.moveTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.1);
                ctx.arcTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.1,
                        widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.1 + 10, 5);
                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.17);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.17);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.22);
                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.22);

                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.29);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.29);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.34);
                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.34);

                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.41);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.41);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.46);
                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.46);

                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.54);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.54);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.59);
                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.59);

                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.66);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.66);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.71);
                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.71);

                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.78);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.78);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.83);
                ctx.lineTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.83);

                ctx.arcTo(widthToBody + bodyWidth + 37, heightToBody + bodyHeight * 0.9,
                        widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.9, 5);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.9);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.9 - 7);
                ctx.arcTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.9 - 7,
                        widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.9 - 15, 5);

                ctx.lineTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.72 + 5);
                ctx.arcTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.72,
                        widthToBody + bodyWidth + 20, heightToBody + bodyHeight * 0.72, 5);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.72);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.68);
                ctx.arcTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.68,
                        widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.68 - 5, 5);
                ctx.lineTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.68 - 10);

                ctx.lineTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.52 + 5);
                ctx.arcTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.52,
                        widthToBody + bodyWidth + 20, heightToBody + bodyHeight * 0.52, 5);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.52);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.48);
                ctx.arcTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.48,
                        widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.48 - 5, 5);
                ctx.lineTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.48 - 10);

                ctx.lineTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.32 + 5);
                ctx.arcTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.32,
                        widthToBody + bodyWidth + 20, heightToBody + bodyHeight * 0.32, 5);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.32);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.28);
                ctx.arcTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.28,
                        widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.28 - 5, 5);
                ctx.lineTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.28 - 10);


                ctx.arcTo(widthToBody + bodyWidth + 30, heightToBody + bodyHeight * 0.1 + 7,
                        widthToBody + bodyWidth + 20, heightToBody + bodyHeight * 0.1 + 7, 5);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.1 + 7);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            if (car.car.bumperSpikes || hoverShape === this.hoverFrontSpikes) {
                ctx.strokeStyle = hoverShape === this.hoverFrontSpikes ? CWD.hoverStroke : borderColor;
                ctx.beginPath();

                ctx.moveTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.1);
                ctx.lineTo(widthToBody + bodyWidth + 24, heightToBody + bodyHeight * 0.12);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.14);

                ctx.lineTo(widthToBody + bodyWidth + 16, heightToBody + bodyHeight * 0.22);
                ctx.lineTo(widthToBody + bodyWidth + 34, heightToBody + bodyHeight * 0.24);
                ctx.lineTo(widthToBody + bodyWidth + 16, heightToBody + bodyHeight * 0.26);

                ctx.lineTo(widthToBody + bodyWidth + 20, heightToBody + bodyHeight * 0.34);
                ctx.lineTo(widthToBody + bodyWidth + 38, heightToBody + bodyHeight * 0.36);
                ctx.lineTo(widthToBody + bodyWidth + 20, heightToBody + bodyHeight * 0.38);

                ctx.lineTo(widthToBody + bodyWidth + 24, heightToBody + bodyHeight * 0.48);
                ctx.lineTo(widthToBody + bodyWidth + 40, heightToBody + bodyHeight * 0.5);
                ctx.lineTo(widthToBody + bodyWidth + 24, heightToBody + bodyHeight * 0.52);

                ctx.lineTo(widthToBody + bodyWidth + 20, heightToBody + bodyHeight * 0.62);
                ctx.lineTo(widthToBody + bodyWidth + 38, heightToBody + bodyHeight * 0.64);
                ctx.lineTo(widthToBody + bodyWidth + 20, heightToBody + bodyHeight * 0.66);

                ctx.lineTo(widthToBody + bodyWidth + 16, heightToBody + bodyHeight * 0.74);
                ctx.lineTo(widthToBody + bodyWidth + 34, heightToBody + bodyHeight * 0.76);
                ctx.lineTo(widthToBody + bodyWidth + 16, heightToBody + bodyHeight * 0.78);

                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.86);
                ctx.lineTo(widthToBody + bodyWidth + 24, heightToBody + bodyHeight * 0.88);
                ctx.lineTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight * 0.9);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            if (car.car.hitch || hoverShape === this.hoverHitch) {
                dp = car.car.hitch ? car.car.hitch.totalDP() : 1;
                dpSize = dp < 5 ? bodyHeight * 0.05 - 2 : bodyHeight * 0.04 - 2;
                this.hitchEnd = (dp <= 5 ? 40 : dp <= 10 ? 40 + dpSize : 40 + dpSize + dpSize);

                ctx.strokeStyle = hoverShape === this.hoverHitch ? CWD.hoverStroke : borderColor;
                ctx.beginPath();
                ctx.moveTo(widthToBody, heightToBody + 25);
                ctx.lineTo(widthToBody - 10, heightToBody + 25);
                ctx.lineTo(widthToBody - 10, heightToBody + bodyHeight * 0.4);
                ctx.lineTo(widthToBody - this.hitchEnd, heightToBody + bodyHeight * 0.4);
                ctx.lineTo(widthToBody - this.hitchEnd, heightToBody + bodyHeight / 2 - 4);
                ctx.lineTo(widthToBody - this.hitchEnd - 8, heightToBody + bodyHeight / 2 - 4);
                ctx.lineTo(widthToBody - this.hitchEnd - 8, heightToBody + bodyHeight / 2 + 4);
                ctx.lineTo(widthToBody - this.hitchEnd, heightToBody + bodyHeight / 2 + 4);
                ctx.lineTo(widthToBody - this.hitchEnd, heightToBody + bodyHeight * 0.6);
                ctx.lineTo(widthToBody - 10, heightToBody + bodyHeight * 0.6);
                ctx.lineTo(widthToBody - 10, heightToBody + bodyHeight - 25);
                ctx.lineTo(widthToBody, heightToBody + bodyHeight - 25);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(widthToBody - this.hitchEnd - 3, heightToBody + bodyHeight / 2);
                ctx.arc(widthToBody - this.hitchEnd - 8, heightToBody + bodyHeight / 2, 5, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // DP
                ctx.fillStyle = CWD.dpFill;
                if (dp <= 5) {
                    for (i = 0; i < dp; i++) {
                        ctx.fillRect(widthToBody - 38, heightToBody + bodyHeight / 2 - dp * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 38, heightToBody + bodyHeight / 2 - dp * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                } else if (dp <= 10) {
                    for (i = 0; i < 5; i++) {
                        ctx.fillRect(widthToBody - 38, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 38, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                    for (i = 0; i < dp - 5; i++) {
                        ctx.fillRect(widthToBody - 38 - dpSize, heightToBody + bodyHeight / 2 - (dp - 5) * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 38 - dpSize, heightToBody + bodyHeight / 2 - (dp - 5) * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                } else {
                    for (i = 0; i < 5; i++) {
                        ctx.fillRect(widthToBody - 38, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 38, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                    for (i = 0; i < 5; i++) {
                        ctx.fillRect(widthToBody - 38 - dpSize, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 38 - dpSize, heightToBody + bodyHeight / 2 - 5 * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                    for (i = 0; i < dp - 10; i++) {
                        ctx.fillRect(widthToBody - 38 - dpSize - dpSize, heightToBody + bodyHeight / 2 - (dp - 10) * dpSize / 2 + i * dpSize, dpSize, dpSize);
                        ctx.strokeRect(widthToBody - 38 - dpSize - dpSize, heightToBody + bodyHeight / 2 - (dp - 10) * dpSize / 2 + i * dpSize, dpSize, dpSize);
                    }
                }
            }
            ctx.strokeStyle = borderColor;
            if (car.car.backBumperSpikes) {
            }
            if (car.car.bodyBlades || car.car.fakeBodyBlades) {
            }
            ctx.beginPath();
            ctx.closePath();
        },
        draw: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;

            // Draw the vehicle body
            ctx.beginPath();

            ctx.moveTo(widthToBody + bodyWidth / 2, heightToBody);
            ctx.lineTo(widthToBody + bodyWidth * 0.6, heightToBody);
            // Mirror
            ctx.lineTo(widthToBody + bodyWidth * 0.6 - 7, heightToBody - 15);
            ctx.quadraticCurveTo(widthToBody + bodyWidth * 0.6 + 5, heightToBody - 15, widthToBody + bodyWidth * 0.6 + 15, heightToBody);
            // Tire Hump
            ctx.lineTo(widthToBody + bodyWidth - 120, heightToBody);
            ctx.quadraticCurveTo(widthToBody + bodyWidth - 100, heightToBody - 5, widthToBody + bodyWidth - 70, heightToBody - 5);
            ctx.quadraticCurveTo(widthToBody + bodyWidth - 30, heightToBody - 5, widthToBody + bodyWidth - 20, heightToBody + 4);
            // Headlight curve
            ctx.quadraticCurveTo(widthToBody + bodyWidth + 10, heightToBody + bodyHeight * 0.05,
                    widthToBody + bodyWidth + 10, heightToBody + bodyHeight * 0.15);
            // Grille curve
            ctx.quadraticCurveTo(widthToBody + bodyWidth + 25, heightToBody + bodyHeight * 0.2,
                    widthToBody + bodyWidth + 25, heightToBody + bodyHeight / 2);
            // Grille curve
            ctx.quadraticCurveTo(widthToBody + bodyWidth + 25, heightToBody + bodyHeight * 0.8,
                    widthToBody + bodyWidth + 10, heightToBody + bodyHeight * 0.85);
            // Headlight Curve
            ctx.quadraticCurveTo(widthToBody + bodyWidth + 10, heightToBody + bodyHeight * 0.95,
                    widthToBody + bodyWidth - 20, heightToBody + bodyHeight - 4);
            // Tire Hump
            ctx.quadraticCurveTo(widthToBody + bodyWidth - 30, heightToBody + bodyHeight + 5,
                    widthToBody + bodyWidth - 70, heightToBody + bodyHeight + 5);
            ctx.quadraticCurveTo(widthToBody + bodyWidth - 100, heightToBody + bodyHeight + 5,
                    widthToBody + bodyWidth - 120, heightToBody + bodyHeight);
            ctx.lineTo(widthToBody + bodyWidth * 0.6 + 15, heightToBody + bodyHeight);
            // Mirror
            ctx.quadraticCurveTo(widthToBody + bodyWidth * 0.6 + 5, heightToBody + bodyHeight + 15,
                    widthToBody + bodyWidth * 0.6 - 7, heightToBody + bodyHeight + 15);
            ctx.lineTo(widthToBody + bodyWidth * 0.6, heightToBody + bodyHeight);
            // Side
            ctx.lineTo(widthToBody + 120, heightToBody + bodyHeight);
            // Back Tire curve
            ctx.quadraticCurveTo(widthToBody + 100, heightToBody + bodyHeight + 8,
                    widthToBody + 70, heightToBody + bodyHeight + 8);
            ctx.quadraticCurveTo(widthToBody + 50, heightToBody + bodyHeight + 8,
                widthToBody, heightToBody + bodyHeight * 0.92);
            // Trunk curve
            ctx.quadraticCurveTo(widthToBody - 22, heightToBody + bodyHeight * 0.7,
                    widthToBody - 25, heightToBody + bodyHeight * 0.5);
            // Trunk curve
            ctx.quadraticCurveTo(widthToBody - 22, heightToBody + bodyHeight * 0.3,
                widthToBody, heightToBody + bodyHeight * 0.08);
            // Back Tire Curve
            ctx.quadraticCurveTo(widthToBody + 50, heightToBody - 8,
                    widthToBody + 70, heightToBody - 8);
            ctx.quadraticCurveTo(widthToBody + 100, heightToBody - 8,
                    widthToBody + 120, heightToBody);
            ctx.closePath();
        },

        drawUpperAccessories: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            ctx.strokeStyle = hoverShape === this.hoverSpoiler ? CWD.hoverStroke : borderColor;
            ctx.fillStyle = CWD.backgroundColor;
            if (car.car.spoiler || hoverShape === this.hoverSpoiler) {
                ctx.beginPath();

                // Legs
                ctx.moveTo(widthToBody - 20, heightToBody + bodyHeight / 4);
                ctx.lineTo(widthToBody - 10, heightToBody + bodyHeight / 4);
                ctx.lineTo(widthToBody - 9, heightToBody + bodyHeight / 4 + 7);
                ctx.lineTo(widthToBody - 20, heightToBody + bodyHeight / 4 + 7);
                ctx.lineTo(widthToBody - 20, heightToBody + bodyHeight * 3 / 4 - 7);
                ctx.lineTo(widthToBody - 9, heightToBody + bodyHeight * 3 / 4 - 7);
                ctx.lineTo(widthToBody - 10, heightToBody + bodyHeight * 3 / 4);
                ctx.lineTo(widthToBody - 20, heightToBody + bodyHeight * 3 / 4);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Airfoil
                ctx.beginPath();
                ctx.moveTo(widthToBody - 10, heightToBody + bodyHeight / 2);
                ctx.lineTo(widthToBody - 20, heightToBody + bodyHeight - 23);
                ctx.lineTo(widthToBody - 15, heightToBody + bodyHeight - 20);
                ctx.lineTo(widthToBody - 35, heightToBody + bodyHeight - 20);
                ctx.lineTo(widthToBody - 30, heightToBody + bodyHeight / 2);
                ctx.lineTo(widthToBody - 35, heightToBody + 20);
                ctx.lineTo(widthToBody - 15, heightToBody + 20);
                ctx.lineTo(widthToBody - 20, heightToBody + 23);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
    };

    CWD.semiTractorBody1 = {
        hoverFifthWheel: CWD.createShape("Fifth Wheel", "editBody"),
        hoverRamplate: CWD.createShape("Ramplate", "editAddRamplate"),
        ramplateWidth: 15,

        contains: function (car, mx, my) {
            if ((mx >= 60 && mx <= 200) && (my >= car.heightToBody + car.bodyHeight / 2 - 70 && my <= car.heightToBody + car.bodyHeight / 2 + 70)) {
                return this.hoverFifthWheel;
            }
            if (mx >= car.widthToBody + car.bodyWidth + 5 && mx <= car.widthToBody + car.bodyWidth + 15 &&
                my >= car.heightToBody && my <= car.heightToBody + car.bodyHeight) {
                return this.hoverRamplate;
            }
            return null;
        },
        width: function (car) {
            var min = 0;
            var max = car.widthToBody + car.bodyWidth + (car.car.ramplate || car.car.fakeRamplate ? 15 : 0);
            return {width: max, offset: min};
        },
        getMinimumX: function(car, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            return widthToBody-3;
        },
        frontHoverPadding: function() {return 15;},
        layoutTires: function (shape) {
            var offset;
            shape.frontRightTire.layout(
                    shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody + shape.bodyHeight - 10,
                CWD.tireWidth, CWD.tireHeight + 10);
            shape.frontLeftTire.layout(
                    shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody - CWD.tireHeight,
                CWD.tireWidth, CWD.tireHeight + 10);
            if (shape.frontWheelhubs.length > 0) {
                shape.frontWheelhubs[0].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody + shape.bodyHeight + CWD.tireHeight,
                    CWD.tireWidth, CWD.whHeight);
                shape.frontWheelhubs[1].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody - CWD.tireHeight - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
            }
            if (shape.frontWheelguards.length > 0) {
                offset = shape.frontWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.frontWheelguards[0].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody + shape.bodyHeight + CWD.tireHeight + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.frontWheelguards[1].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody - CWD.tireHeight - CWD.wgHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
            }
            shape.backRightTire.layout(30, shape.heightToBody + shape.bodyHeight * 3 / 4 - 10, CWD.tireWidth, CWD.tireHeight + 10);
            shape.backLeftTire.layout(30, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight, CWD.tireWidth, CWD.tireHeight + 10);
            shape.backRightOuterTire.layout(30, shape.heightToBody + shape.bodyHeight * 3 / 4 + CWD.tireHeight, CWD.tireWidth, CWD.tireHeight);
            shape.backLeftOuterTire.layout(30, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight - CWD.tireHeight, CWD.tireWidth, CWD.tireHeight);
            shape.middleRightTire.layout(53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight * 3 / 4 - 10, CWD.tireWidth, CWD.tireHeight + 10);
            shape.middleLeftTire.layout(53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight, CWD.tireWidth, CWD.tireHeight + 10);
            shape.middleRightOuterTire.layout(53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight * 3 / 4 + CWD.tireHeight, CWD.tireWidth, CWD.tireHeight);
            shape.middleLeftOuterTire.layout(53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight - CWD.tireHeight, CWD.tireWidth, CWD.tireHeight);
            if (shape.backWheelhubs.length > 0) {
                shape.backWheelhubs[0].layout(
                    30, shape.heightToBody + shape.bodyHeight * 3 / 4 + CWD.tireHeight * 2,
                    CWD.tireWidth, CWD.whHeight);
                shape.backWheelhubs[1].layout(
                    30, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight * 2 - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
                shape.backWheelhubs[2].layout(
                        53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight * 3 / 4 + CWD.tireHeight * 2,
                    CWD.tireWidth, CWD.whHeight);
                shape.backWheelhubs[3].layout(
                        53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight * 2 - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
            }
            if (shape.backWheelguards.length > 0) {
                offset = shape.backWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.backWheelguards[0].layout(
                    30, shape.heightToBody + shape.bodyHeight * 3 / 4 + CWD.tireHeight * 2 + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.backWheelguards[1].layout(
                    30, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight * 2 - CWD.whHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.backWheelguards[2].layout(
                        53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight * 3 / 4 + CWD.tireHeight * 2 + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.backWheelguards[3].layout(
                        53 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight / 4 - CWD.tireHeight * 2 - CWD.whHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
            }
        },
        drawLowerBody: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            // Draw the tires
            car.frontRightTire.draw(ctx, car.frontRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.frontLeftTire.draw(ctx, car.frontLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backRightTire.draw(ctx, car.backRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backLeftTire.draw(ctx, car.backLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backRightOuterTire.draw(ctx, car.backRightOuterTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backLeftOuterTire.draw(ctx, car.backLeftOuterTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.middleLeftTire.draw(ctx, car.middleLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.middleRightTire.draw(ctx, car.middleRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.middleLeftOuterTire.draw(ctx, car.middleLeftOuterTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.middleRightOuterTire.draw(ctx, car.middleRightOuterTire === hoverShape ? CWD.hoverStroke : borderColor);

            if (car.car.ramplate || car.car.fakeRamplate || hoverShape === this.hoverRamplate) {
                ctx.strokeStyle = hoverShape === this.hoverRamplate ? CWD.hoverStroke : borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.beginPath();

                ctx.moveTo(widthToBody + bodyWidth + 5, heightToBody + 10);
                ctx.lineTo(widthToBody + bodyWidth + 5, heightToBody + bodyHeight - 10);
                ctx.lineTo(widthToBody + bodyWidth - 8, heightToBody + bodyHeight + 25);
                ctx.lineTo(widthToBody + bodyWidth + 1, heightToBody + bodyHeight + 28);
                ctx.lineTo(widthToBody + bodyWidth + 15, heightToBody + bodyHeight - 10);
                ctx.lineTo(widthToBody + bodyWidth + 15, heightToBody + 10);
                ctx.lineTo(widthToBody + bodyWidth + 1, heightToBody - 28);
                ctx.lineTo(widthToBody + bodyWidth - 8, heightToBody - 25);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;

            ctx.beginPath();
            // Tire Guards
            ctx.rect(widthToBody + bodyWidth - 30 - CWD.tireWidth, heightToBody - 3, CWD.tireWidth + 20, 30);
            ctx.rect(widthToBody + bodyWidth - 30 - CWD.tireWidth, heightToBody + bodyHeight - 27, CWD.tireWidth + 20, 30);

            // Left Mirror
            var offset = bodyWidth < 250 ? 125 : 170;
            ctx.moveTo(widthToBody + bodyWidth - offset - 10, heightToBody);
            ctx.lineTo(widthToBody + bodyWidth - offset - 10, heightToBody - 15);
            ctx.lineTo(widthToBody + bodyWidth - offset - 20, heightToBody - 30);
            ctx.lineTo(widthToBody + bodyWidth - offset - 15, heightToBody - 32);
            ctx.lineTo(widthToBody + bodyWidth - offset - 4, heightToBody - 15);
            ctx.lineTo(widthToBody + bodyWidth - offset - 4, heightToBody);
            ctx.closePath();

            // Right Mirror
            ctx.moveTo(widthToBody + bodyWidth - offset - 10, heightToBody + bodyHeight);
            ctx.lineTo(widthToBody + bodyWidth - offset - 10, heightToBody + bodyHeight + 15);
            ctx.lineTo(widthToBody + bodyWidth - offset - 20, heightToBody + bodyHeight + 30);
            ctx.lineTo(widthToBody + bodyWidth - offset - 15, heightToBody + bodyHeight + 32);
            ctx.lineTo(widthToBody + bodyWidth - offset - 4, heightToBody + bodyHeight + 15);
            ctx.lineTo(widthToBody + bodyWidth - offset - 4, heightToBody + bodyHeight);
            ctx.closePath();
        },
        draw: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;

            ctx.strokeStyle = borderColor;

            // Draw the vehicle body
            ctx.beginPath();

            ctx.moveTo(0, heightToBody);
            ctx.lineTo(10, heightToBody);
            ctx.lineTo(10, heightToBody + bodyHeight / 4);
            ctx.lineTo(widthToBody-3, heightToBody + bodyHeight / 4);
            ctx.lineTo(widthToBody-3, heightToBody + bodyHeight * 3 / 4);
            ctx.lineTo(10, heightToBody + bodyHeight * 3 / 4);
            ctx.lineTo(10, heightToBody + bodyHeight);
            ctx.lineTo(0, heightToBody + bodyHeight);
            ctx.closePath();

            ctx.moveTo(widthToBody-3, heightToBody);
            ctx.arcTo(widthToBody-3, heightToBody - 10, widthToBody + 4, heightToBody - 10, 7);
            ctx.lineTo(widthToBody + bodyWidth - 200, heightToBody - 10);
            ctx.quadraticCurveTo(widthToBody + bodyWidth * 0.9, heightToBody, widthToBody + bodyWidth + 3, heightToBody + 10);
            ctx.lineTo(widthToBody + bodyWidth + 3, heightToBody + bodyHeight - 10);
            ctx.quadraticCurveTo(widthToBody + bodyWidth * 0.9, heightToBody + bodyHeight, widthToBody + bodyWidth - 200, heightToBody + bodyHeight + 10);

            ctx.lineTo(widthToBody + 4, heightToBody + bodyHeight + 10);
            ctx.arcTo(widthToBody - 3, heightToBody + bodyHeight + 10, widthToBody-3, heightToBody + bodyHeight - 7, 7);
            ctx.closePath();
        },

        drawUpperAccessories: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            var dp = car.car.fifthWheelDP();
            var dims = CWD.dpDimensions(dp), r, c;
            var dpWidth = 15;
            var dpHeight = 15;
            if (dims.cols * dpWidth > 85) dpWidth = Math.floor(85 / dims.cols);
            if (dims.rows * dpHeight > 36) dpHeight = Math.floor(36 / dims.rows);
            var offset = 40 + (85 - dims.cols * dpWidth);
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.dpFill;
            for (r = 0; r < dims.rows; r++) {
                for (c = 0; c < dims.cols; c++) {
                    if (r * dims.cols + c < dp) {
                        ctx.fillRect(offset + c * dpWidth, heightToBody + bodyHeight / 2 - dims.rows * dpHeight / 2 + r * dpHeight, dpWidth, dpHeight);
                        ctx.strokeRect(offset + c * dpWidth, heightToBody + bodyHeight / 2 - dims.rows * dpHeight / 2 + r * dpHeight, dpWidth, dpHeight);
                    }
                }
            }

            ctx.strokeStyle = hoverShape === this.hoverFifthWheel ? CWD.hoverStroke : borderColor;
            ctx.fillStyle = CWD.backgroundColor;

            ctx.beginPath();
            if (car.car.fifthWheelArmor) {
                ctx.moveTo(200, heightToBody + bodyHeight / 2);
                ctx.arc(130, heightToBody + bodyHeight / 2, 70, 0, Math.PI * 3 / 2, true);
                ctx.quadraticCurveTo(100, heightToBody + bodyHeight / 2 - 70, 20, heightToBody + bodyHeight / 2 - 32);
                ctx.lineTo(20, heightToBody + bodyHeight / 2 - 20);
                ctx.lineTo(130, heightToBody + bodyHeight / 2 - 20);
                ctx.arc(130, heightToBody + bodyHeight / 2, 20, Math.PI * 3 / 2, Math.PI / 2, false);
                ctx.lineTo(20, heightToBody + bodyHeight / 2 + 20);
                ctx.lineTo(20, heightToBody + bodyHeight / 2 + 32);
                ctx.quadraticCurveTo(100, heightToBody + bodyHeight / 2 + 70, 130, heightToBody + bodyHeight / 2 + 70);
                ctx.arc(130, heightToBody + bodyHeight / 2, 70, Math.PI / 2, 0, true);
            } else {
                ctx.moveTo(200, heightToBody + bodyHeight / 2);
                ctx.arc(130, heightToBody + bodyHeight / 2, 70, 0, Math.PI * 3 / 2, true);
                ctx.quadraticCurveTo(100, heightToBody + bodyHeight / 2 - 70, 80, heightToBody + bodyHeight / 2 - 45);
                ctx.lineTo(110, heightToBody + bodyHeight / 2 - 20);
                ctx.quadraticCurveTo(120, heightToBody + bodyHeight / 2 - 30, 130, heightToBody + bodyHeight / 2 - 30);
                ctx.arc(130, heightToBody + bodyHeight / 2, 30, Math.PI * 3 / 2, Math.PI / 2, false);
                ctx.quadraticCurveTo(120, heightToBody + bodyHeight / 2 + 30, 110, heightToBody + bodyHeight / 2 + 20);
                ctx.lineTo(80, heightToBody + bodyHeight / 2 + 45);
                ctx.quadraticCurveTo(100, heightToBody + bodyHeight / 2 + 70, 130, heightToBody + bodyHeight / 2 + 70);
                ctx.arc(130, heightToBody + bodyHeight / 2, 70, Math.PI / 2, 0, true);
            }
            ctx.closePath();

            ctx.fill();
            ctx.stroke();
        }
    };

    CWD.tenWheelerBody1 = {
        hoverRamplate: CWD.createShape("Ramplate", "editAddRamplate"),
        ramplateWidth: 15,

        contains: function (car, mx, my) {
            if (mx >= car.widthToBody + car.bodyWidth + 5 && mx <= car.widthToBody + car.bodyWidth + 15 &&
                my >= car.heightToBody && my <= car.heightToBody + car.bodyHeight) {
                return this.hoverRamplate;
            }
            return null;
        },
        width: function (car) {
            var min = 0;
            var max = car.widthToBody + car.bodyWidth + (car.car.ramplate || car.car.fakeRamplate ? 15 : 0);
            return {width: max, offset: min};
        },
        getMinimumX: function(car, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            return widthToBody;
        },
        frontHoverPadding: function() {return 15;},
        layoutTires: function (shape) {
            var offset;
            shape.frontRightTire.layout(
                    shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody + shape.bodyHeight - 10,
                CWD.tireWidth, CWD.tireHeight + 10);
            shape.frontLeftTire.layout(
                    shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody - CWD.tireHeight,
                CWD.tireWidth, CWD.tireHeight + 10);
            if (shape.frontWheelhubs.length > 0) {
                shape.frontWheelhubs[0].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody + shape.bodyHeight + CWD.tireHeight,
                    CWD.tireWidth, CWD.whHeight);
                shape.frontWheelhubs[1].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody - CWD.tireHeight - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
            }
            if (shape.frontWheelguards.length > 0) {
                offset = shape.frontWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.frontWheelguards[0].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody + shape.bodyHeight + CWD.tireHeight + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.frontWheelguards[1].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody - CWD.tireHeight - CWD.wgHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
            }
        },
        drawLowerBody: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            // Draw the tires
            car.frontRightTire.draw(ctx, car.frontRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.frontLeftTire.draw(ctx, car.frontLeftTire === hoverShape ? CWD.hoverStroke : borderColor);

            if (car.car.ramplate || car.car.fakeRamplate || hoverShape === this.hoverRamplate) {
                ctx.strokeStyle = hoverShape === this.hoverRamplate ? CWD.hoverStroke : borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.beginPath();

                ctx.moveTo(widthToBody + bodyWidth + 5, heightToBody + 10);
                ctx.lineTo(widthToBody + bodyWidth + 5, heightToBody + bodyHeight - 10);
                ctx.lineTo(widthToBody + bodyWidth - 8, heightToBody + bodyHeight + 25);
                ctx.lineTo(widthToBody + bodyWidth + 1, heightToBody + bodyHeight + 28);
                ctx.lineTo(widthToBody + bodyWidth + 15, heightToBody + bodyHeight - 10);
                ctx.lineTo(widthToBody + bodyWidth + 15, heightToBody + 10);
                ctx.lineTo(widthToBody + bodyWidth + 1, heightToBody - 28);
                ctx.lineTo(widthToBody + bodyWidth - 8, heightToBody - 25);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;

            ctx.beginPath();
            // Tire Guards
            ctx.rect(widthToBody + bodyWidth - 30 - CWD.tireWidth, heightToBody - 3, CWD.tireWidth + 20, 30);
            ctx.rect(widthToBody + bodyWidth - 30 - CWD.tireWidth, heightToBody + bodyHeight - 27, CWD.tireWidth + 20, 30);

            var offset = bodyWidth < 250 ? 125 : 170;

            // Left Mirror
            ctx.moveTo(widthToBody + bodyWidth - offset - 10, heightToBody);
            ctx.lineTo(widthToBody + bodyWidth - offset - 10, heightToBody - 15);
            ctx.lineTo(widthToBody + bodyWidth - offset - 20, heightToBody - 30);
            ctx.lineTo(widthToBody + bodyWidth - offset - 15, heightToBody - 32);
            ctx.lineTo(widthToBody + bodyWidth - offset - 4, heightToBody - 15);
            ctx.lineTo(widthToBody + bodyWidth - offset - 4, heightToBody);
            ctx.closePath();

            // Right Mirror
            ctx.moveTo(widthToBody + bodyWidth - offset - 10, heightToBody + bodyHeight);
            ctx.lineTo(widthToBody + bodyWidth - offset - 10, heightToBody + bodyHeight + 15);
            ctx.lineTo(widthToBody + bodyWidth - offset - 20, heightToBody + bodyHeight + 30);
            ctx.lineTo(widthToBody + bodyWidth - offset - 15, heightToBody + bodyHeight + 32);
            ctx.lineTo(widthToBody + bodyWidth - offset - 4, heightToBody + bodyHeight + 15);
            ctx.lineTo(widthToBody + bodyWidth - offset - 4, heightToBody + bodyHeight);
            ctx.closePath();
        },
        draw: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;

            ctx.strokeStyle = borderColor;

            // Draw the vehicle body
            ctx.beginPath();

            ctx.moveTo(widthToBody-3, heightToBody);
            ctx.arcTo(widthToBody-3, heightToBody - 10, widthToBody + 4, heightToBody - 10, 7);
            ctx.lineTo(widthToBody + bodyWidth - 200, heightToBody - 10);
            ctx.quadraticCurveTo(widthToBody + bodyWidth * 0.9, heightToBody, widthToBody + bodyWidth + 3, heightToBody + 10);
            ctx.lineTo(widthToBody + bodyWidth + 3, heightToBody + bodyHeight - 10);
            ctx.quadraticCurveTo(widthToBody + bodyWidth * 0.9, heightToBody + bodyHeight, widthToBody + bodyWidth - 200, heightToBody + bodyHeight + 10);

            ctx.lineTo(widthToBody + 4, heightToBody + bodyHeight + 10);
            ctx.arcTo(widthToBody-3, heightToBody + bodyHeight + 10, widthToBody-3, heightToBody + bodyHeight - 7, 7);
            ctx.closePath();
        }
    };

    CWD.busBody1 = {
        hoverRamplate: CWD.createShape("Ramplate", "editAddRamplate"),
        ramplateWidth: 15,
        contains: function (car, mx, my) {
            if (mx >= car.widthToBody + car.bodyWidth + 5 && mx <= car.widthToBody + car.bodyWidth + 17 &&
                my >= car.heightToBody && my <= car.heightToBody + car.bodyHeight) {
                return this.hoverRamplate;
            }
            return null;
        },
        width: function (car) {
            var min = car.widthToBody;
            var max = car.widthToBody + car.bodyWidth+(car.car.ramplate || car.car.fakeRamplate ? 20 : 7);
            return {width: max, offset: min};
        },
        getMinimumX: function(car, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            return widthToBody;
        },
        frontHoverPadding: function() {return 20;},
        layoutTires: function (shape) {
            var offset;
            shape.frontRightTire.layout(
                    shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 40, shape.heightToBody + shape.bodyHeight - 10,
                CWD.tireWidth, CWD.tireHeight + 10);
            shape.frontLeftTire.layout(
                    shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 40, shape.heightToBody - CWD.tireHeight,
                CWD.tireWidth, CWD.tireHeight + 10);
            if (shape.frontWheelhubs.length > 0) {
                shape.frontWheelhubs[0].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 40, shape.heightToBody + shape.bodyHeight + CWD.tireHeight,
                    CWD.tireWidth, CWD.whHeight);
                shape.frontWheelhubs[1].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 40, shape.heightToBody - CWD.tireHeight - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
            }
            if (shape.frontWheelguards.length > 0) {
                offset = shape.frontWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.frontWheelguards[0].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 40, shape.heightToBody + shape.bodyHeight + CWD.tireHeight + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.frontWheelguards[1].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 40, shape.heightToBody - CWD.tireHeight - CWD.wgHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
            }
            shape.backRightTire.layout(shape.widthToBody + 5, shape.heightToBody + shape.bodyHeight - 10, CWD.tireWidth, CWD.tireHeight + 10);
            shape.backLeftTire.layout(shape.widthToBody + 5, shape.heightToBody - CWD.tireHeight, CWD.tireWidth, CWD.tireHeight + 10);
            shape.backRightOuterTire.layout(shape.widthToBody + 5, shape.heightToBody + shape.bodyHeight + CWD.tireHeight, CWD.tireWidth, CWD.tireHeight);
            shape.backLeftOuterTire.layout(shape.widthToBody + 5, shape.heightToBody - CWD.tireHeight - CWD.tireHeight, CWD.tireWidth, CWD.tireHeight);
            shape.middleRightTire.layout(shape.widthToBody + 28 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight - 10, CWD.tireWidth, CWD.tireHeight + 10);
            shape.middleLeftTire.layout(shape.widthToBody + 28 + CWD.tireWidth, shape.heightToBody - CWD.tireHeight, CWD.tireWidth, CWD.tireHeight + 10);
            shape.middleRightOuterTire.layout(shape.widthToBody + 28 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight + CWD.tireHeight, CWD.tireWidth, CWD.tireHeight);
            shape.middleLeftOuterTire.layout(shape.widthToBody + 28 + CWD.tireWidth, shape.heightToBody - CWD.tireHeight - CWD.tireHeight, CWD.tireWidth, CWD.tireHeight);


            if (shape.backWheelhubs.length > 0) {
                shape.backWheelhubs[0].layout(
                        shape.widthToBody + 5, shape.heightToBody + shape.bodyHeight + CWD.tireHeight * 2,
                    CWD.tireWidth, CWD.whHeight);
                shape.backWheelhubs[1].layout(
                        shape.widthToBody + 5, shape.heightToBody - CWD.tireHeight * 2 - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
                shape.backWheelhubs[2].layout(
                        shape.widthToBody + 28 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight + CWD.tireHeight * 2,
                    CWD.tireWidth, CWD.whHeight);
                shape.backWheelhubs[3].layout(
                        shape.widthToBody + 28 + CWD.tireWidth, shape.heightToBody - CWD.tireHeight * 2 - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
            }
            if (shape.backWheelguards.length > 0) {
                offset = shape.backWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.backWheelguards[0].layout(
                        shape.widthToBody + 5, shape.heightToBody + shape.bodyHeight + CWD.tireHeight * 2 + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.backWheelguards[1].layout(
                        shape.widthToBody + 5, shape.heightToBody - CWD.tireHeight * 2 - CWD.whHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.backWheelguards[2].layout(
                        shape.widthToBody + 28 + CWD.tireWidth, shape.heightToBody + shape.bodyHeight + CWD.tireHeight * 2 + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.backWheelguards[3].layout(
                        shape.widthToBody + 28 + CWD.tireWidth, shape.heightToBody - CWD.tireHeight * 2 - CWD.whHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
            }
        },
        drawLowerBody: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            // Draw the tires
            car.frontRightTire.draw(ctx, car.frontRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.frontLeftTire.draw(ctx, car.frontLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backRightTire.draw(ctx, car.backRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backLeftTire.draw(ctx, car.backLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backRightOuterTire.draw(ctx, car.backRightOuterTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backLeftOuterTire.draw(ctx, car.backLeftOuterTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.middleLeftTire.draw(ctx, car.middleLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.middleRightTire.draw(ctx, car.middleRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.middleLeftOuterTire.draw(ctx, car.middleLeftOuterTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.middleRightOuterTire.draw(ctx, car.middleRightOuterTire === hoverShape ? CWD.hoverStroke : borderColor);

            if (car.car.ramplate || car.car.fakeRamplate || hoverShape === this.hoverRamplate) {
                ctx.strokeStyle = hoverShape === this.hoverRamplate ? CWD.hoverStroke : borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.beginPath();

                ctx.moveTo(widthToBody + bodyWidth - 7, heightToBody);
                ctx.bezierCurveTo(widthToBody + bodyWidth + 8, heightToBody + 5,
                                  widthToBody + bodyWidth + 8, heightToBody + bodyHeight / 2 - 20,
                                  widthToBody + bodyWidth + 8, heightToBody + bodyHeight / 2);
                ctx.bezierCurveTo(widthToBody + bodyWidth + 8, heightToBody + bodyHeight / 2 + 20,
                                  widthToBody + bodyWidth + 8, heightToBody + bodyHeight - 5,
                                  widthToBody + bodyWidth - 7, heightToBody + bodyHeight);
                ctx.lineTo(widthToBody + bodyWidth - 2, heightToBody + bodyHeight);
                ctx.bezierCurveTo(widthToBody + bodyWidth + 15, heightToBody + bodyHeight - 5,
                                  widthToBody + bodyWidth + 15, heightToBody + bodyHeight / 2 + 20,
                                  widthToBody + bodyWidth + 15, heightToBody + bodyHeight / 2 + 20);
                ctx.bezierCurveTo(widthToBody + bodyWidth + 15, heightToBody + bodyHeight / 2 - 20,
                                  widthToBody + bodyWidth + 15, heightToBody + 5,
                                  widthToBody + bodyWidth - 2, heightToBody);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

            ctx.beginPath();

            // Mirrors
            ctx.moveTo(widthToBody + bodyWidth - 19, heightToBody);
            ctx.lineTo(widthToBody + bodyWidth - 19, heightToBody - 15);
            ctx.lineTo(widthToBody + bodyWidth - 29, heightToBody - 30);
            ctx.lineTo(widthToBody + bodyWidth - 24, heightToBody - 32);
            ctx.lineTo(widthToBody + bodyWidth - 13, heightToBody - 15);
            ctx.lineTo(widthToBody + bodyWidth - 13, heightToBody);
            ctx.closePath();

            ctx.moveTo(widthToBody + bodyWidth - 19, heightToBody + bodyHeight);
            ctx.lineTo(widthToBody + bodyWidth - 19, heightToBody + bodyHeight + 15);
            ctx.lineTo(widthToBody + bodyWidth - 29, heightToBody + bodyHeight + 30);
            ctx.lineTo(widthToBody + bodyWidth - 24, heightToBody + bodyHeight + 32);
            ctx.lineTo(widthToBody + bodyWidth - 13, heightToBody + bodyHeight + 15);
            ctx.lineTo(widthToBody + bodyWidth - 13, heightToBody + bodyHeight);
            ctx.closePath();
        },
        draw: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;

            // Draw the vehicle body
            ctx.beginPath();

            ctx.moveTo(widthToBody, heightToBody + 7);
            ctx.arcTo(widthToBody, heightToBody, widthToBody + 7, heightToBody, 7);
            ctx.lineTo(widthToBody + bodyWidth - 15, heightToBody);
            ctx.bezierCurveTo(widthToBody + bodyWidth + 5, heightToBody - 5, widthToBody + bodyWidth + 5, heightToBody + bodyHeight / 2 - 20,
                    widthToBody + bodyWidth + 5, heightToBody + bodyHeight / 2);
            ctx.bezierCurveTo(widthToBody + bodyWidth + 5, heightToBody + bodyHeight / 2 + 20, widthToBody + bodyWidth + 5, heightToBody + bodyHeight + 5,
                    widthToBody + bodyWidth - 15, heightToBody + bodyHeight);
            ctx.lineTo(widthToBody + 7, heightToBody + bodyHeight);
            ctx.arcTo(widthToBody, heightToBody + bodyHeight, widthToBody, heightToBody + bodyHeight - 7, 7);

            ctx.closePath();
        }
    };

    CWD.cycleBody1 = {
        hoverSpoiler: CWD.createShape("Spoiler", "editAddSpoiler"),
        contains: function (car, mx, my) {
            var start = car.widthToBody+car.bodyWidth/8-50;
            var end = car.widthToBody+car.bodyWidth*3/16-30;
            if ((mx >= start && mx <= end) &&
                ((my >= car.heightToBody && my <= car.heightToBody + car.bodyHeight/4) ||
                    (my >= car.heightToBody+car.bodyHeight*3/4 && my <= car.heightToBody + car.bodyHeight))) {
                this.hoverSpoiler.hoverText = car.car.spoiler ? "Spoiler" : "Add Spoiler";
                return this.hoverSpoiler;
            }

            return null;
        },
        width: function (car) {
            var min = car.widthToBody - CWD.tireWidth + 35;
            var max = car.widthToBody + car.bodyWidth + 5 + CWD.tireWidth - 30;
            if(car.backWheelguards.length > 0) min = car.widthToBody - CWD.tireWidth + 11;
            if(car.frontWheelguards.length > 0) max = car.widthToBody + car.bodyWidth + CWD.tireWidth - 35 + 24;
            return {width: max, offset: min};
        },
        getMinimumX: function(car, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            return car.backWheelguards.length > 0 ? widthToBody - CWD.tireWidth + 11 : widthToBody - CWD.tireWidth + 35;
        },
        frontHoverPadding: function() {return 0;},
        tireWidth: CWD.tireWidth-30,
        wheelguardWidth: 24,
        layoutTires: function (shape) {
            var offset;
            shape.frontTire.layout(shape.widthToBody + shape.bodyWidth + 5, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2,
                    CWD.tireWidth - 30, CWD.tireHeight);
            shape.backTire.layout(shape.widthToBody - CWD.tireWidth + 35, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2,
                    CWD.tireWidth - 30, CWD.tireHeight);

            if (shape.frontWheelhubs.length > 0) {
                shape.frontWheelhubs[0].layout(
                        shape.widthToBody + shape.bodyWidth, shape.heightToBody + shape.bodyHeight / 2 + CWD.tireHeight / 2,
                        CWD.tireWidth - 30, CWD.whHeight);
                shape.frontWheelhubs[1].layout(
                        shape.widthToBody + shape.bodyWidth, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2 - CWD.whHeight,
                        CWD.tireWidth - 30, CWD.whHeight);
            }
            if (shape.frontWheelguards.length > 0) {
                offset = shape.frontWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.frontWheelguards[0].layout(
                        shape.widthToBody + shape.bodyWidth + CWD.tireWidth - 35, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2 - offset - 3,
                    24, CWD.tireHeight + 2 * offset + 6);
            }
            if (shape.backWheelhubs.length > 0) {
                shape.backWheelhubs[0].layout(
                        shape.widthToBody - CWD.tireWidth + 30, shape.heightToBody + shape.bodyHeight / 2 + CWD.tireHeight / 2,
                        CWD.tireWidth - 30, CWD.whHeight);
                shape.backWheelhubs[1].layout(
                        shape.widthToBody - CWD.tireWidth + 30, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2 - CWD.whHeight,
                        CWD.tireWidth - 30, CWD.whHeight);
            }
            if (shape.backWheelguards.length > 0) {
                offset = shape.backWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.backWheelguards[0].layout(
                        shape.widthToBody - CWD.tireWidth + 11, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2 - offset - 3,
                    24, CWD.tireHeight + 2 * offset + 6);
            }
        },
        drawLowerBody: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            var i, start, end;
            // Draw the tires
            car.frontTire.draw(ctx, car.frontTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backTire.draw(ctx, car.backTire === hoverShape ? CWD.hoverStroke : borderColor);
            // Wheelhubs should be clipped by the body
            for (i = 0; i < car.frontWheelhubs.length; i++) car.frontWheelhubs[i].draw(ctx, car.frontWheelhubs[i] === hoverShape ? CWD.hoverStroke : borderColor);
            for (i = 0; i < car.backWheelhubs.length; i++) car.backWheelhubs[i].draw(ctx, car.backWheelhubs[i] === hoverShape ? CWD.hoverStroke : borderColor);
            ctx.fillStyle = CWD.backgroundColor;
            if (car.car.spoiler || hoverShape === this.hoverSpoiler) {
                ctx.beginPath();
                ctx.strokeStyle = hoverShape === this.hoverSpoiler ? CWD.hoverStroke : borderColor;
                start = widthToBody+bodyWidth/8-30;
                end = widthToBody+bodyWidth*3/16-30;
                ctx.moveTo(start, heightToBody+bodyHeight/2);
                ctx.lineTo(start-20, heightToBody+15);
                ctx.lineTo(start, heightToBody+15);
                ctx.lineTo(end, heightToBody+bodyHeight/2);
                ctx.lineTo(start, heightToBody+bodyHeight-15);
                ctx.lineTo(start-20, heightToBody+bodyHeight-15);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.closePath();
        },
        draw: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            var i;

            ctx.beginPath();
            ctx.strokeStyle = borderColor;

            if (car.car.windshell) {
                ctx.fillStyle = CWD.backgroundColor;
                ctx.moveTo(widthToBody - 15, heightToBody + bodyHeight / 2 + 5);
                ctx.lineTo(widthToBody - 15, heightToBody + bodyHeight / 2 - 5);
                ctx.lineTo(widthToBody - 5, heightToBody + bodyHeight * 3 / 8);
                ctx.quadraticCurveTo(widthToBody + 50, heightToBody, widthToBody + bodyWidth * 3 / 4 - 20, heightToBody + 30);
                ctx.lineTo(widthToBody + bodyWidth * 3 / 4 + 25, heightToBody + 30);
                ctx.quadraticCurveTo(widthToBody + bodyWidth, heightToBody + 50, widthToBody + bodyWidth, heightToBody + bodyHeight / 2);
                ctx.quadraticCurveTo(widthToBody + bodyWidth, heightToBody + bodyHeight - 50, widthToBody + bodyWidth * 3 / 4 + 25, heightToBody + bodyHeight - 30);
                ctx.lineTo(widthToBody + bodyWidth * 3 / 4 - 20, heightToBody + bodyHeight - 30);
                ctx.quadraticCurveTo(widthToBody + 50, heightToBody + bodyHeight, widthToBody - 5, heightToBody + bodyHeight * 5 / 8);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.font = '15px sans-serif';
                ctx.fillStyle = CWD.mainStroke;
                ctx.fillText("Windshell", widthToBody + 3 * bodyWidth / 8 + 30, heightToBody + 38);
                ctx.fillStyle = CWD.dpFill;
                var left = widthToBody + 3 * bodyWidth / 8 + 60 - car.car.windshell.totalDP() * 5;
                for (i = 0; i < car.car.windshell.totalDP(); i++) {
                    ctx.fillRect(left + i * 10, heightToBody + bodyHeight - 40, 10, 10);
                    ctx.strokeRect(left + i * 10, heightToBody + bodyHeight - 40, 10, 10);
                }

                ctx.beginPath();
            }

            ctx.moveTo(widthToBody - 15, heightToBody + bodyHeight / 2 + 5);
            ctx.lineTo(widthToBody - 15, heightToBody + bodyHeight / 2 - 5);
            ctx.lineTo(widthToBody - 5, heightToBody + bodyHeight * 3 / 8);
            ctx.lineTo(widthToBody + bodyWidth / 4, heightToBody + bodyHeight / 5);
            ctx.lineTo(widthToBody + bodyWidth / 2 - 10, heightToBody + bodyHeight * 5 / 16);
            ctx.lineTo(widthToBody + bodyWidth / 2 + 10, heightToBody + bodyHeight * 5 / 16);
            ctx.lineTo(widthToBody + bodyWidth * 3 / 4 - 20, heightToBody + 30);
            ctx.lineTo(widthToBody + bodyWidth * 3 / 4 + 15, heightToBody + 30);
            ctx.lineTo(widthToBody + bodyWidth * 3 / 4 + 0, heightToBody);
            ctx.lineTo(widthToBody + bodyWidth * 3 / 4 + 8, heightToBody - 3);
            ctx.lineTo(widthToBody + bodyWidth * 3 / 4 + 25, heightToBody + 30);
            ctx.quadraticCurveTo(widthToBody + bodyWidth + 15, heightToBody + 50, widthToBody + bodyWidth + 15, heightToBody + bodyHeight / 2);
            ctx.quadraticCurveTo(widthToBody + bodyWidth + 15, heightToBody + bodyHeight - 50, widthToBody + bodyWidth * 3 / 4 + 25, heightToBody + bodyHeight - 30);
            ctx.lineTo(widthToBody + bodyWidth * 3 / 4 + 8, heightToBody + bodyHeight + 3);
            ctx.lineTo(widthToBody + bodyWidth * 3 / 4 + 0, heightToBody + bodyHeight);
            ctx.lineTo(widthToBody + bodyWidth * 3 / 4 + 15, heightToBody + bodyHeight - 30);
            ctx.lineTo(widthToBody + bodyWidth * 3 / 4 - 20, heightToBody + bodyHeight - 30);
            ctx.lineTo(widthToBody + bodyWidth / 2 + 10, heightToBody + bodyHeight * 11 / 16);
            ctx.lineTo(widthToBody + bodyWidth / 2 - 10, heightToBody + bodyHeight * 11 / 16);
            ctx.lineTo(widthToBody + bodyWidth / 4, heightToBody + bodyHeight * 4 / 5);
            ctx.lineTo(widthToBody - 5, heightToBody + bodyHeight * 5 / 8);

            ctx.closePath();
        }
    };

    CWD.sidecarBody1 = {
        drawLowerBody: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            car.rightTire.draw(ctx, car.rightTire === hoverShape ? CWD.hoverStroke : borderColor);
            if (car.leftTire)
                car.leftTire.draw(ctx, car.leftTire === hoverShape ? CWD.hoverStroke : borderColor);
            if (car.backWheelhubs.length > 0) car.backWheelhubs[0].draw(ctx, car.backWheelhubs[0] === hoverShape ? CWD.hoverStroke : borderColor);
            if (car.backWheelhubs.length > 1) car.backWheelhubs[1].draw(ctx, car.backWheelhubs[1] === hoverShape ? CWD.hoverStroke : borderColor);
            if (car.backWheelguards.length > 0) car.backWheelguards[0].draw(ctx, car.backWheelguards[0] === hoverShape ? CWD.hoverStroke : borderColor);
            if (car.backWheelguards.length > 1) car.backWheelguards[1].draw(ctx, car.backWheelguards[1] === hoverShape ? CWD.hoverStroke : borderColor);
            ctx.beginPath();
            ctx.closePath();
        },
        draw: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            ctx.beginPath();
            ctx.strokeStyle = car.phantomShapes.sidecar === hoverShape ? CWD.hoverStroke : borderColor;
            ctx.moveTo(widthToBody, heightToBody + bodyHeight / 2);
            ctx.quadraticCurveTo(widthToBody, heightToBody, widthToBody + bodyWidth / 4, heightToBody);
            ctx.quadraticCurveTo(widthToBody + bodyWidth, heightToBody + bodyHeight / 3, widthToBody + bodyWidth, heightToBody + bodyHeight / 2);
            ctx.quadraticCurveTo(widthToBody + bodyWidth, heightToBody + bodyHeight * 2 / 3, widthToBody + bodyWidth / 4, heightToBody + bodyHeight);
            ctx.quadraticCurveTo(widthToBody, heightToBody + bodyHeight, widthToBody, heightToBody + bodyHeight / 2);

            ctx.closePath();
        }
    };

    CWD.reversedTrikeBody1 = {
        hoverRamplate: CWD.createShape("Ramplate", "editAddRamplate"),
        ramplateWidth: 32,
        contains: function (car, mx, my) {
            if (mx >= car.widthToBody + car.bodyWidth + 20 && mx <= car.widthToBody + car.bodyWidth + 32
                    && my >= car.heightToBody + car.bodyHeight * 0.1 && my <= car.heightToBody + car.bodyHeight * 0.9) {
                this.hoverRamplate.hoverText = car.car.ramplate ? "Ramplate" : car.car.fakeRamplate ? "Fake Ramplate"
                    : "Add Ramplate";
                return this.hoverRamplate;
            }
            return null;
        },
        width: function (car) {
            var min = car.widthToBody - CWD.tireWidth + 35;
            var max = car.widthToBody + car.bodyWidth + 10;
            if (car.backWheelguards.length > 0) min = car.widthToBody - CWD.tireWidth + 11;
            return {width: max, offset: min};
        },
        getMinimumX: function(car, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            return car.backWheelguards.length > 0 ? widthToBody - CWD.tireWidth + 11 : widthToBody - CWD.tireWidth + 35;
        },
        frontHoverPadding: function() {return 35;},
        layoutTires: function (shape) {
            var offset;
            shape.frontRightTire.layout(
                    shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody + shape.bodyHeight - 10,
                CWD.tireWidth, CWD.tireHeight + 10);
            shape.frontLeftTire.layout(
                    shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody - CWD.tireHeight,
                CWD.tireWidth, CWD.tireHeight + 10);
            if (shape.frontWheelhubs.length > 0) {
                shape.frontWheelhubs[0].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody + shape.bodyHeight + CWD.tireHeight,
                    CWD.tireWidth, CWD.whHeight);
                shape.frontWheelhubs[1].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody - CWD.tireHeight - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
            }
            if (shape.frontWheelguards.length > 0) {
                offset = shape.frontWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.frontWheelguards[0].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody + shape.bodyHeight + CWD.tireHeight + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.frontWheelguards[1].layout(
                        shape.widthToBody + shape.bodyWidth - CWD.tireWidth - 20, shape.heightToBody - CWD.tireHeight - CWD.wgHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
            }
            shape.backTire.layout(shape.widthToBody - CWD.tireWidth + 35, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2,
                    CWD.tireWidth - 30, CWD.tireHeight);
            if (shape.backWheelhubs.length > 0) {
                shape.backWheelhubs[0].layout(
                        shape.widthToBody - CWD.tireWidth + 30, shape.heightToBody + shape.bodyHeight / 2 + CWD.tireHeight / 2,
                        CWD.tireWidth - 30, CWD.whHeight);
                shape.backWheelhubs[1].layout(
                        shape.widthToBody - CWD.tireWidth + 30, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2 - CWD.whHeight,
                        CWD.tireWidth - 30, CWD.whHeight);
            }
            if (shape.backWheelguards.length > 0) {
                offset = shape.backWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.backWheelguards[0].layout(
                        shape.widthToBody - CWD.tireWidth + 11, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2 - offset - 3,
                    24, CWD.tireHeight + 2 * offset + 6);
            }
        },
        drawLowerBody: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            var i;
            // Draw the tires
            car.backTire.draw(ctx, car.backTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.frontLeftTire.draw(ctx, car.frontLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.frontRightTire.draw(ctx, car.frontRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            // Back wheelhubs should be clipped by the body
            for (i = 0; i < car.backWheelhubs.length; i++) car.backWheelhubs[i].draw(ctx, car.backWheelhubs[i] === hoverShape ? CWD.hoverStroke : borderColor);

            if (car.car.ramplate || car.car.fakeRamplate || hoverShape === this.hoverRamplate) {
                ctx.strokeStyle = hoverShape === this.hoverRamplate ? CWD.hoverStroke : borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.beginPath();
                var offset = widthToBody + bodyWidth - 8;

                ctx.moveTo(offset - 2, heightToBody + bodyHeight * 0.1);
                ctx.arcTo(offset + 37, heightToBody + bodyHeight * 0.1,
                        offset + 37, heightToBody + bodyHeight * 0.1 + 10, 5);
                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.17);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.17);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.22);
                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.22);

                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.29);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.29);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.34);
                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.34);

                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.41);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.41);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.46);
                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.46);

                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.54);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.54);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.59);
                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.59);

                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.66);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.66);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.71);
                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.71);

                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.78);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.78);
                ctx.lineTo(offset + 40, heightToBody + bodyHeight * 0.83);
                ctx.lineTo(offset + 37, heightToBody + bodyHeight * 0.83);

                ctx.arcTo(offset + 37, heightToBody + bodyHeight * 0.9,
                        offset + 30, heightToBody + bodyHeight * 0.9, 5);
                ctx.lineTo(offset - 2, heightToBody + bodyHeight * 0.9);
                ctx.lineTo(offset - 2, heightToBody + bodyHeight * 0.9 - 7);
                ctx.arcTo(offset + 30, heightToBody + bodyHeight * 0.9 - 7,
                        offset + 30, heightToBody + bodyHeight * 0.9 - 15, 5);

                ctx.lineTo(offset + 30, heightToBody + bodyHeight * 0.72 + 5);
                ctx.arcTo(offset + 30, heightToBody + bodyHeight * 0.72,
                        offset + 20, heightToBody + bodyHeight * 0.72, 5);
                ctx.lineTo(offset + 8, heightToBody + bodyHeight * 0.72);
                ctx.lineTo(offset + 8, heightToBody + bodyHeight * 0.68);
                ctx.arcTo(offset + 30, heightToBody + bodyHeight * 0.68,
                        offset + 30, heightToBody + bodyHeight * 0.68 - 5, 5);
                ctx.lineTo(offset + 30, heightToBody + bodyHeight * 0.68 - 10);

                ctx.lineTo(offset + 30, heightToBody + bodyHeight * 0.52 + 5);
                ctx.arcTo(offset + 30, heightToBody + bodyHeight * 0.52,
                        offset + 20, heightToBody + bodyHeight * 0.52, 5);
                ctx.lineTo(offset + 8, heightToBody + bodyHeight * 0.52);
                ctx.lineTo(offset + 8, heightToBody + bodyHeight * 0.48);
                ctx.arcTo(offset + 30, heightToBody + bodyHeight * 0.48,
                        offset + 30, heightToBody + bodyHeight * 0.48 - 5, 5);
                ctx.lineTo(offset + 30, heightToBody + bodyHeight * 0.48 - 10);

                ctx.lineTo(offset + 30, heightToBody + bodyHeight * 0.32 + 5);
                ctx.arcTo(offset + 30, heightToBody + bodyHeight * 0.32,
                        offset + 20, heightToBody + bodyHeight * 0.32, 5);
                ctx.lineTo(offset + 8, heightToBody + bodyHeight * 0.32);
                ctx.lineTo(offset + 8, heightToBody + bodyHeight * 0.28);
                ctx.arcTo(offset + 30, heightToBody + bodyHeight * 0.28,
                        offset + 30, heightToBody + bodyHeight * 0.28 - 5, 5);
                ctx.lineTo(offset + 30, heightToBody + bodyHeight * 0.28 - 10);


                ctx.arcTo(offset + 30, heightToBody + bodyHeight * 0.1 + 7,
                        offset + 20, heightToBody + bodyHeight * 0.1 + 7, 5);
                ctx.lineTo(offset - 2, heightToBody + bodyHeight * 0.1 + 7);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.closePath();
        },
        draw: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            ctx.beginPath();
            ctx.strokeStyle = borderColor;

            ctx.moveTo(widthToBody - 15, heightToBody + bodyHeight / 2 + 5);
            // Back Tip
            ctx.lineTo(widthToBody - 15, heightToBody + bodyHeight / 2 - 5);
            // Back
            ctx.lineTo(widthToBody - 5, heightToBody + bodyHeight * 5 / 16);
            // Forward Gentle
            ctx.lineTo(widthToBody + bodyWidth / 6, heightToBody + bodyHeight / 4);
            // Forward Rise
            ctx.lineTo(widthToBody + bodyWidth / 6 + 20, heightToBody + bodyHeight / 4 - 20);
            // Forward Gentle
            ctx.lineTo(widthToBody + bodyWidth * 0.4 - 20, heightToBody + bodyHeight / 6 - 10);
            // Down to Seat
            ctx.lineTo(widthToBody + bodyWidth * 0.4, heightToBody + bodyHeight / 5);
            // Seat
            ctx.lineTo(widthToBody + bodyWidth * 0.5 + 40, heightToBody + bodyHeight / 5);
            // Up Steep
            ctx.bezierCurveTo(widthToBody + bodyWidth * 0.5 + 50, heightToBody + bodyHeight / 5, widthToBody + bodyWidth * 0.5 + 50, heightToBody + bodyHeight / 20 + 10,
                    widthToBody + bodyWidth * 0.5 + 60, heightToBody + bodyHeight / 20);
            // Up Gentle
            ctx.bezierCurveTo(widthToBody + bodyWidth * 0.5 + 70, heightToBody + bodyHeight / 20 - 10, widthToBody + bodyWidth * 0.7 + 10, heightToBody,
                    widthToBody + bodyWidth * 0.7 + 30, heightToBody);
            // Tire
            ctx.lineTo(widthToBody + bodyWidth - 20, heightToBody);
            // Front
            ctx.bezierCurveTo(widthToBody + bodyWidth, heightToBody, widthToBody + bodyWidth + 10, heightToBody + bodyHeight / 2 - 20,
                    widthToBody + bodyWidth + 10, heightToBody + bodyHeight / 2);
            // Repeat all on the other side
            ctx.bezierCurveTo(widthToBody + bodyWidth + 10, heightToBody + bodyHeight / 2 + 20, widthToBody + bodyWidth, heightToBody + bodyHeight,
                    widthToBody + bodyWidth - 20, heightToBody + bodyHeight);
            ctx.lineTo(widthToBody + bodyWidth * 0.7 + 30, heightToBody + bodyHeight);
            ctx.bezierCurveTo(widthToBody + bodyWidth * 0.7 + 10, heightToBody + bodyHeight, widthToBody + bodyWidth * 0.5 + 70, heightToBody + bodyHeight * 19 / 20 + 10,
                    widthToBody + bodyWidth * 0.5 + 60, heightToBody + bodyHeight * 19 / 20);
            ctx.bezierCurveTo(widthToBody + bodyWidth * 0.5 + 50, heightToBody + bodyHeight * 19 / 20 - 10, widthToBody + bodyWidth * 0.5 + 50, heightToBody + bodyHeight * 4 / 5,
                    widthToBody + bodyWidth * 0.5 + 40, heightToBody + bodyHeight * 4 / 5);

            ctx.lineTo(widthToBody + bodyWidth * 0.4, heightToBody + bodyHeight * 4 / 5);
            ctx.lineTo(widthToBody + bodyWidth * 0.4 - 20, heightToBody + bodyHeight * 5 / 6 + 10);
            ctx.lineTo(widthToBody + bodyWidth / 6 + 20, heightToBody + bodyHeight * 3 / 4 + 20);
            ctx.lineTo(widthToBody + bodyWidth / 6, heightToBody + bodyHeight * 3 / 4);
            ctx.lineTo(widthToBody - 5, heightToBody + bodyHeight * 11 / 16);
            ctx.lineTo(widthToBody - 15, heightToBody + bodyHeight / 2 + 5);

            ctx.closePath();
        }
    };

    CWD.trikeBody1 = {
        humpForward: false,

        contains: function (car, mx, my) {
            return null;
        },
        width: function (car) {
            var min = car.widthToBody - 5;
            var max = car.widthToBody + car.bodyWidth - 10 + CWD.tireWidth - 30;
            if (car.frontWheelguards.length > 0)
                max = car.widthToBody + car.bodyWidth + CWD.tireWidth - 37 + 24;
            return {width: max, offset: min};
        },
        getMinimumX: function(car, widthToBody, bodyWidth, heightToBody, bodyHeight) {
            return widthToBody - 5;
        },
        frontHoverPadding: function() {return 0;},
        tireWidth: CWD.tireWidth-30,
        wheelguardWidth: 24,
        layoutTires: function (shape) {
            var offset;
            shape.frontTire.layout(shape.widthToBody + shape.bodyWidth - 10, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2,
                    CWD.tireWidth - 30, CWD.tireHeight);
            if (shape.frontWheelhubs.length > 0) {
                shape.frontWheelhubs[0].layout(
                        shape.widthToBody + shape.bodyWidth - 10, shape.heightToBody + shape.bodyHeight / 2 + CWD.tireHeight / 2,
                        CWD.tireWidth - 30, CWD.whHeight);
                shape.frontWheelhubs[1].layout(
                        shape.widthToBody + shape.bodyWidth - 10, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2 - CWD.whHeight,
                        CWD.tireWidth - 30, CWD.whHeight);
            }
            if (shape.frontWheelguards.length > 0) {
                offset = shape.frontWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.frontWheelguards[0].layout(
                        shape.widthToBody + shape.bodyWidth + CWD.tireWidth - 37, shape.heightToBody + shape.bodyHeight / 2 - CWD.tireHeight / 2 - offset - 3,
                    24, CWD.tireHeight + 2 * offset + 6);
            }
            shape.backRightTire.layout(shape.widthToBody + 20, shape.heightToBody + shape.bodyHeight - 10,
                CWD.tireWidth, CWD.tireHeight + 10);
            shape.backLeftTire.layout(shape.widthToBody + 20, shape.heightToBody - CWD.tireHeight,
                CWD.tireWidth, CWD.tireHeight + 10);
            if (shape.backWheelhubs.length > 0) {
                shape.backWheelhubs[0].layout(
                        shape.widthToBody + 20, shape.heightToBody + shape.bodyHeight + CWD.tireHeight,
                    CWD.tireWidth, CWD.whHeight);
                shape.backWheelhubs[1].layout(
                        shape.widthToBody + 20, shape.heightToBody - CWD.tireHeight - CWD.whHeight,
                    CWD.tireWidth, CWD.whHeight);
            }
            if (shape.backWheelguards.length > 0) {
                offset = shape.backWheelhubs.length > 0 ? CWD.whHeight : 0;
                shape.backWheelguards[0].layout(
                        shape.widthToBody + 20, shape.heightToBody + shape.bodyHeight + CWD.tireHeight + offset,
                    CWD.tireWidth, CWD.wgHeight);
                shape.backWheelguards[1].layout(
                        shape.widthToBody + 20, shape.heightToBody - CWD.tireHeight - CWD.wgHeight - offset,
                    CWD.tireWidth, CWD.wgHeight);
            }
        },
        drawLowerBody: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            var i;
            // Draw the tires
            car.frontTire.draw(ctx, car.frontTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backLeftTire.draw(ctx, car.backLeftTire === hoverShape ? CWD.hoverStroke : borderColor);
            car.backRightTire.draw(ctx, car.backRightTire === hoverShape ? CWD.hoverStroke : borderColor);
            // Front wheelhubs should be clipped by the body
            for (i = 0; i < car.frontWheelhubs.length; i++) car.frontWheelhubs[i].draw(ctx, car.frontWheelhubs[i] === hoverShape ? CWD.hoverStroke : borderColor);
            ctx.beginPath();
            ctx.closePath();
        },
        draw: function (car, ctx, hoverShape, borderColor, widthToBody, bodyWidth, heightToBody, bodyHeight, carOnly) {
            var one = this.humpForward ? 0.5 : 1 / 3;
            var two = this.humpForward ? 2 / 3 : 0.5;
            ctx.beginPath();
            ctx.strokeStyle = borderColor;

            ctx.moveTo(widthToBody - 5, heightToBody + bodyHeight / 2);
            // Very Back
            ctx.bezierCurveTo(widthToBody - 5, heightToBody + bodyHeight / 2 - 20, widthToBody - 5, heightToBody + bodyHeight / 5 + 5,
                widthToBody, heightToBody + bodyHeight / 5);
            ctx.bezierCurveTo(widthToBody + 5, heightToBody + bodyHeight / 5 - 5, widthToBody + 5, heightToBody + 5,
                    widthToBody + 10, heightToBody);
            // Back Tire Hump
            ctx.bezierCurveTo(widthToBody + 15, heightToBody - 5, widthToBody + bodyWidth * one - 20, heightToBody - 2,
                    widthToBody + bodyWidth * one, heightToBody);
            // Front of tire hump
            ctx.bezierCurveTo(widthToBody + bodyWidth * one + 20, heightToBody + 2, widthToBody + bodyWidth * two - 20, heightToBody + bodyHeight / 8 - 8,
                    widthToBody + bodyWidth * two, heightToBody + bodyHeight / 8);
            // To front of vehicle
            ctx.bezierCurveTo(widthToBody + bodyWidth * two + 20, heightToBody + bodyHeight / 8 + 8, widthToBody + bodyWidth - 30, heightToBody + bodyHeight / 5 - 15,
                    widthToBody + bodyWidth - 15, heightToBody + bodyHeight / 5);
            // To front middle
            ctx.bezierCurveTo(widthToBody + bodyWidth, heightToBody + bodyHeight / 5 + 15, widthToBody + bodyWidth, heightToBody + bodyHeight / 2 - 25,
                    widthToBody + bodyWidth, heightToBody + bodyHeight / 2);
            // Reverse all that
            ctx.bezierCurveTo(widthToBody + bodyWidth, heightToBody + bodyHeight / 2 + 25, widthToBody + bodyWidth, heightToBody + bodyHeight * 4 / 5 - 15,
                    widthToBody + bodyWidth - 15, heightToBody + bodyHeight * 4 / 5);
            ctx.bezierCurveTo(widthToBody + bodyWidth - 30, heightToBody + bodyHeight * 4 / 5 + 15, widthToBody + bodyWidth * two + 20, heightToBody + bodyHeight * 7 / 8 - 8,
                    widthToBody + bodyWidth * two, heightToBody + bodyHeight * 7 / 8);
            ctx.bezierCurveTo(widthToBody + bodyWidth * two - 20, heightToBody + bodyHeight * 7 / 8 + 8, widthToBody + bodyWidth * one + 20, heightToBody + bodyHeight - 2,
                    widthToBody + bodyWidth * one, heightToBody + bodyHeight);
            ctx.bezierCurveTo(widthToBody + bodyWidth * one - 20, heightToBody + bodyHeight + 2, widthToBody + 15, heightToBody + bodyHeight + 5,
                    widthToBody + 10, heightToBody + bodyHeight);
            ctx.bezierCurveTo(widthToBody + 5, heightToBody + bodyHeight - 5, widthToBody + 5, heightToBody + bodyHeight * 4 / 5 + 5,
                widthToBody, heightToBody + bodyHeight * 4 / 5);
            ctx.bezierCurveTo(widthToBody - 5, heightToBody + bodyHeight * 4 / 5 - 5, widthToBody - 5, heightToBody + bodyHeight / 2 + 20,
                    widthToBody - 5, heightToBody + bodyHeight / 2);
            ctx.closePath();
        }
    };
})();