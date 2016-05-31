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

    if (!CWD.globalTransform) CWD.globalTransform = [1, 0, 0, 1, 0, 0];
    CWD.createShape = function (text, link) {
        var shape = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            topRow: 0,
            topColumn: 0,
            rowHeight: 2,
            manuallyPlaced: false,
            maxRowHeight: 2,
            minRowHeight: 1
        };

        if (text) {
            shape.hoverText = text;
        }
        if (link) {
            shape.hoverLink = link;
        }

        shape.layout = function (x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        };

        shape.contains = function (mx, my) {
            if ((this.x <= mx) && (this.x + this.w >= mx) &&
                (this.y <= my) && (this.y + this.h >= my)) {
                return this;
            }
            return null;
        };

        return shape;
    };
    CWD.createDischargerPlace = function (first) {
        var tmp = {
            type: 'dischargers',
            rowHeight: 1,
            minRowHeight: 1,
            maxRowHeight: 2,
            top: [],
            under: [],
            checkHeight: function () {
                if (this.top.length > 0 && this.under.length > 0) {
                    this.rowHeight = 2;
                    this.minRowHeight = 2;
                } else {
                    this.minRowHeight = 1;
                }
            }
        };
        if (first.location === 'Top') tmp.top.push(first);
        else tmp.under.push(first);
        return tmp;
    };
    CWD.createWeaponPlace = function (weapons, frontOrBack) {
        var items = weapons.length ? weapons : [weapons];
        var height = items.length === 1 ? 1 : items.length > 1 ? 2 : 0;
        var max = 0;
        for (var i = 0; i < weapons.length; i++) max += weapons[i].maxRowHeight;
        return {
            type: 'weapons',
            rowHeight: height,
            minRowHeight: height,
            maxRowHeight: frontOrBack ? max : 2,
            weapons: items,
            sideCA: false
        };
    };
    CWD.createCornerPlace = function (left, right) {
        var height = left.length > 0 || right.length > 0 ? 2 : 0;
        return {
            type: 'weapons',
            rowHeight: height,
            minRowHeight: height,
            maxRowHeight: 4,
            leftWeapons: left,
            rightWeapons: right
        };
    };

    CWD.padding = 5;
    CWD.tireWidth = 100;
    CWD.tireHeight = 30;
    CWD.wgHeight = 15;
    CWD.whHeight = 15;
    CWD.dpFill = '#B8860B';
    CWD.mainStroke = '#FFD700';
    CWD.hoverStroke = '#008000';
    CWD.roadColor = '#000000';
    CWD.backgroundColor = '#808080';
    CWD.toolbarTextColor = '#D3D3D3';
    CWD.toolbarDisabledColor = '#808080';

    CWD.createIconShape = function (imageOrText, hoverText, hoverLink) {
        var shape = CWD.createShape(hoverText, hoverLink);
        shape.uiWidget = true;
        shape.visible = true;
        shape.enabled = true;

        if (typeof imageOrText === 'string') {
            shape.image = null;
            shape.text = imageOrText;
            shape.font = "bold 24px sans-serif";
            shape.drawBorder = false;
            shape.centered = false;
        } else if (imageOrText.length) {
            shape.image = imageOrText[0];
            shape.text = null;
            shape.font = "bold 10px sans-serif";
            shape.drawBorder = true;
            shape.centered = false;
        }

        shape.draw = function (ctx, borderColor) {
            var x, y;
            if (!shape.visible) return;
            if (this.drawBorder && borderColor !== CWD.mainStroke) {
                ctx.strokeStyle = borderColor;
                x = this.image && this.text ? 4 : 2;
                y = this.image && this.text ? 0 : 2;
                ctx.strokeRect(this.x - x, this.y - y, this.w + x * 2, this.h + y * 2);
            } else {
                if (this.image) ctx.drawImage(this.image, this.x, this.y);
                if (this.text) {
                    ctx.fillStyle = shape.enabled ? borderColor : CWD.toolbarDisabledColor;
                    ctx.font = shape.font;
                    if (this.centered && ctx.measureText) {
                        if (this.textWidth) x = this.textWidth;
                        else {
                            x = ctx.measureText(this.text).width;
                            x = this.w / 2 - x / 2;
                            if (this.image) this.textWidth = x;
                        }
                        ctx.fillText(this.text, this.x + x, this.y + this.h - 5, this.w - x);
                    } else {
                        ctx.fillText(this.text, this.x, this.y + this.h - 5, this.w);
                    }
                }
            }
        };

        var oldContains = shape.contains;
        shape.contains = function (mx, my) {
            if (!this.visible || !this.enabled) return null;
            if (!this.text) {
                if ((this.x - 2 <= mx) && (this.x + this.w + 2 >= mx) &&
                    (this.y - 2 <= my) && (this.y + this.h + 2 >= my)) {
                    return this;
                } else return null;
            }
            return oldContains.apply(this, [mx, my]);
        };

        return shape;
    };

    CWD.createToolbarShape = function (image, buttonText, hoverText, hoverLink) {
        var shape = CWD.createShape(hoverText, hoverLink);
        shape.enabled = true;
        shape.uiWidget = true;

        shape.draw = function (ctx, borderColor) {
            if (borderColor !== CWD.mainStroke) {
                ctx.strokeStyle = borderColor;
                ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
            } else {
                ctx.font = "bold 10px sans-serif";
                if (!shape.iconWidth) shape.iconWidth = image.attr('width');
                if (!shape.iconWidth) return;
                if (!shape.textWidth) {
                    if (ctx.measureText) shape.textWidth = ctx.measureText(buttonText).width;
                    else shape.textWidth = buttonText.length * 6;
                }

                ctx.strokeStyle = borderColor;
                ctx.fillStyle = shape.enabled ? CWD.toolbarTextColor : CWD.toolbarDisabledColor;
                ctx.drawImage(image[0], this.x + this.w / 2 - shape.iconWidth / 2, this.y + 4);
                ctx.fillText(buttonText, this.x + this.w / 2 - shape.textWidth / 2, this.y + 44);
                ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
            }
        };

        shape.contains = function (mx, my) {
            if (shape.enabled && (this.x <= mx) && (this.x + this.w >= mx) &&
                (this.y <= my) && (this.y + this.h >= my)) {
                return this;
            }
            return null;
        };

        return shape;
    };

    CWD.createTurretShape = function (turret, link) {
        var shape = CWD.createShape(turret.name, link);
        shape.turret = turret;
        shape.minRowHeight = 2;

        shape.draw = function (ctx, borderColor) {
            ctx.beginPath();
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;
            ctx.moveTo(this.x + this.w, this.y + this.h / 2);
            ctx.arc(this.x + this.w / 2, this.y + this.h / 2, Math.min(this.w / 2, this.h / 2), 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();

            if (this.turret.weapons.length === 0 && this.turret.boosters.length === 0) {
                ctx.font = '15px sans-serif';
                ctx.fillStyle = CWD.mainStroke;
                var name = shape.turret.name;
                if (name === 'Rocket Platform') name = 'Rkt. Platform';
                ctx.fillText(name, this.x + 2, this.y + this.h / 2 + 6);
            }
        };

        return shape;
    };

    CWD.createTireShape = function (tire, text, link, left, inner) {
        var shape = CWD.createShape(text, link);
        shape.tire = tire;
        shape.offset = 0;
        shape.left = left;
        shape.inner = inner;
        shape.damage = 0;
        shape.type = "Tire";

        shape.draw = function (ctx, borderColor) {
            // Draw outline of tire
            var useY = !this.inner || this.left ? this.y : this.y + 12;
            var useH = !this.inner ? this.h : this.h - 12;

            ctx.beginPath();
            ctx.strokeStyle = borderColor;
            ctx.moveTo(this.x + 8, this.y);
            ctx.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h - 10, 8);
            ctx.lineTo(this.x + this.w, this.y + this.h - 8);
            ctx.arcTo(this.x + this.w, this.y + this.h, this.x + 10, this.y + this.h, 8);
            ctx.lineTo(this.x + 8, this.y + this.h);
            ctx.arcTo(this.x, this.y + this.h, this.x, this.y + 10, 8);
            ctx.lineTo(this.x, this.y + 8);
            ctx.arcTo(this.x, this.y, this.x + 8, this.y, 8);
            ctx.closePath();
            ctx.fillStyle = CWD.backgroundColor;
            ctx.fill();
            ctx.stroke();
            // Name and DP
            ctx.font = '15px sans-serif';
            ctx.strokeStyle = CWD.mainStroke;
            ctx.fillStyle = CWD.mainStroke;
            if (!this.textWidth || this.oldAbbv !== this.tire.abbv) {
                if (ctx.measureText) this.textWidth = ctx.measureText(this.tire.abbv).width;
                else this.textWidth = 22;
                this.oldAbbv = this.tire.abbv;
            }
            ctx.fillText(this.tire.abbv, this.x + 5 + this.offset, this.left ? useY + 15 : useY + useH - 5);
            ctx.fillStyle = CWD.dpFill;
            var dp = this.tire.totalDP();
            var dpStart = (dp > 20 ? 10 : 20) + shape.textWidth + this.offset;
            var dpWidth = 10;
            var dpHeight = 10;
            var dims = CWD.dpDimensions(dp);
            if (dims.cols * dpWidth > this.w - dpStart - 4) dpWidth = Math.floor((this.w - dpStart - 4) / dims.cols);
            if (dims.rows * dpHeight > useH - 6) dpHeight = Math.floor((useH - 6) / dims.rows);
            if (this.left) CWD.drawDP(ctx, this.x + dpStart, useY + 3, dpWidth, dpHeight, dp, dims, this.damage);
            else CWD.drawDP(ctx, this.x + dpStart, useY + useH - 3 - dpHeight, dpWidth, -dpHeight, dp, dims, this.damage);
        };

        return shape;
    };

    CWD.createSingleTireShape = function (tire, text, link, front) {
        var shape = CWD.createShape(text, link);
        shape.tire = tire;
        shape.damage = 0;
        shape.type = "Tire";

        shape.draw = function (ctx, borderColor) {
            var textStart = front ? this.x + 13 : this.x + 3;
            // Draw outline of tire
            ctx.beginPath();
            ctx.strokeStyle = borderColor;
            ctx.moveTo(this.x + 8, this.y);
            ctx.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h - 10, 8);
            ctx.lineTo(this.x + this.w, this.y + this.h - 8);
            ctx.arcTo(this.x + this.w, this.y + this.h, this.x + 10, this.y + this.h, 8);
            ctx.lineTo(this.x + 8, this.y + this.h);
            ctx.arcTo(this.x, this.y + this.h, this.x, this.y + 10, 8);
            ctx.lineTo(this.x, this.y + 8);
            ctx.arcTo(this.x, this.y, this.x + 8, this.y, 8);
            ctx.closePath();
            ctx.fillStyle = CWD.backgroundColor;
            ctx.fill();
            ctx.stroke();
            // Name and DP
            ctx.font = '15px sans-serif';
            ctx.strokeStyle = CWD.mainStroke;
            ctx.fillStyle = CWD.mainStroke;
            if (!shape.textWidth || shape.oldAbbv !== shape.tire.abbv) {
                if (ctx.measureText) shape.textWidth = ctx.measureText(shape.tire.abbv).width;
                else shape.textWidth = 22;
                shape.oldAbbv = shape.tire.abbv;
            }
            ctx.fillText(shape.tire.abbv, textStart, this.y + this.h / 2 + 7);
            ctx.fillStyle = CWD.dpFill;
            var dp = shape.tire.totalDP();
            var dpStart = 3 + shape.textWidth;
            var dpWidth = 10;
            var dpHeight = 10;
            var dims = CWD.dpDimensions(dp);
            if (dims.cols * dpWidth > this.w - dpStart - 22) dpWidth = Math.floor((this.w - dpStart - 22) / dims.cols);
            if (dims.rows * dpHeight > this.h - 8) dpHeight = Math.floor((this.h - 8) / dims.rows);
            CWD.drawDP(ctx, textStart + dpStart, this.y + 4, dpWidth, dpHeight, dp, dims, this.damage);
        };

        return shape;
    };

    CWD.createCrewShape = function (crew) {
        var shape = CWD.createShape();
        shape.crew = crew;
        shape.minRowHeight = 2; // TODO: 1.5 for cycles/trikes?
        shape.type = "Crew";
        shape.damage = 0;
        shape.caDamage = 0;
        shape.baDamage = 0;

        shape.draw = function (ctx, borderColor) {
            var x = 0;
            var y = 0;
            var w = 100;
            var h = 100;
            var rFactor = ctx.type === 'pdf' ? -1 : 1;
            if (!ctx.cwLineTo) {
                ctx.cwMoveTo = function (rf, x, y) {
                    ctx.moveTo(x, rf * y);
                };
                ctx.cwLineTo = function (rf, x, y) {
                    ctx.lineTo(x, rf * y);
                };
                ctx.cwQuadraticCurveTo = function (rf, x1, y1, x2, y2) {
                    ctx.quadraticCurveTo(x1, rf * y1, x2, rf * y2);
                };
                ctx.cwArc = function (rf, x, y, r, a1, a2, dir) {
                    ctx.arc(x, rf * y, r, a1, a2, dir);
                };
            }

            ctx.transform(shape.w / 100, 0, 0, shape.h / 100, shape.x, shape.y);

            // Crew body
            ctx.beginPath();
            ctx.fillStyle = CWD.backgroundColor;
            ctx.strokeStyle = borderColor;
            ctx.cwMoveTo(rFactor, x + w / 2, y); // Middle top of head
            ctx.cwQuadraticCurveTo(rFactor, x + w, y, x + w, y + 20); // right shoulder
            ctx.cwLineTo(rFactor, x + w, y + h / 2);        // outside of arm
            ctx.cwLineTo(rFactor, x + w - 10, y + h / 2);     // horiz wrist
            ctx.cwLineTo(rFactor, x + w - 10, y + h / 2 - 20);  // Up to armpit
            ctx.cwLineTo(rFactor, x + w - 10, y + h - 10);    // Down to ankle
            ctx.cwLineTo(rFactor, x + w / 2, y + h - 10);     // Across right ankle to middle
            ctx.cwLineTo(rFactor, x + w / 2, y + h - 20);     // Up pants leg
            ctx.cwLineTo(rFactor, x + w / 2, y + h - 10);     // Back down pants leg
            ctx.cwLineTo(rFactor, x + 10, y + h - 10);            // Across to left ankle
            ctx.cwLineTo(rFactor, x + 10, y + h / 2 - 20);          // Up to armpit
            ctx.cwLineTo(rFactor, x + 10, y + h / 2);             // Down to wrist
            ctx.cwLineTo(rFactor, x, y + h / 2);                // Across left wrist
            ctx.cwLineTo(rFactor, x, y + 20);                       // outside of left arm
            ctx.cwQuadraticCurveTo(rFactor, x, y, x + w / 2, y);  // Back to top of head
            ctx.closePath();
            // Eyes
            ctx.cwMoveTo(rFactor, x + w / 2 - 10, y + 8);
            ctx.cwArc(rFactor, x + w / 2 - 15, y + 8, 5, 0, Math.PI * 2, false); // set to true to show background through
            ctx.closePath();
            ctx.cwMoveTo(rFactor, x + w / 2 + 20, y + 8);
            ctx.cwArc(rFactor, x + w / 2 + 15, y + 8, 5, 0, Math.PI * 2, false);
            ctx.closePath();


            // Shoes
            ctx.cwMoveTo(rFactor, x + w / 2 + 10, y + h - 10);
            ctx.cwLineTo(rFactor, x + w / 2 + 10, y + h);
            ctx.cwLineTo(rFactor, x + w, y + h);
            ctx.cwQuadraticCurveTo(rFactor, x + w, y + h - 10, x + w / 2 + 20, y + h - 10);
            ctx.closePath();
            ctx.cwMoveTo(rFactor, x + w / 2 - 10, y + h - 10);
            ctx.cwLineTo(rFactor, x + w / 2 - 10, y + h);
            ctx.cwLineTo(rFactor, x, y + h);
            ctx.cwQuadraticCurveTo(rFactor, x, y + h - 10, x + w / 2 - 20, y + h - 10);
            ctx.closePath();

            // Hands
            ctx.cwMoveTo(rFactor, x + w, y + h / 2);
            ctx.cwArc(rFactor, x + w - 5, y + h / 2 + 5, 5, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.cwMoveTo(rFactor, x + 10, y + h / 2);
            ctx.cwArc(rFactor, x + 5, y + h / 2 + 5, 5, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.cwMoveTo(rFactor, x + w / 2 - 15, y + 16);
            ctx.cwQuadraticCurveTo(rFactor, x + w / 2 - 15, y + 21, x + w / 2, y + 21);
            ctx.cwQuadraticCurveTo(rFactor, x + w / 2 + 15, y + 21, x + w / 2 + 15, y + 16);

            ctx.stroke();
            // Name and DP
            ctx.font = '15px sans-serif';
            ctx.strokeStyle = CWD.mainStroke;
            ctx.fillStyle = CWD.mainStroke;
            var text = shape.crew.name;
            ctx.fillText(text, x + 15, rFactor * (y + 35));
            ctx.fillStyle = CWD.dpFill;


            var dims = CWD.dpDimensions(shape.crew.totalDP());
            var dpWidth = 15, dpHeight = 15;
            if (dpWidth * dims.cols > w - 30) dpWidth = Math.floor((w - 30) / dims.cols);
            if (dpHeight * dims.rows > h - 50) dpHeight = Math.floor((h - 50) / dims.rows);
            CWD.drawDP(ctx, x + 15, rFactor * (y + 38), dpWidth, rFactor * dpHeight, shape.crew.totalDP(), dims, this.damage);
            ctx.setTransform.apply(ctx, CWD.globalTransform);
        };

        shape.hoverText = shape.crew.name;
        shape.hoverLink = "editCrew";

        return shape;
    };

    CWD.setEngineHoverText = function (shape, engine) {
        var buf = [];
        var first = true;
        if (engine.blueprinted) buf.push("BP ");
        buf.push(engine.name);
        if (engine.carburetor || engine.multibarrelCarburetor || engine.turbocharger
            || engine.variablePitchTurbocharger || engine.supercharger
            || engine.tubularHeaders || engine.superconductors || engine.platinumCatalysts) {
            buf.push(" w/");
        } else {
            buf.push(engine.electric ? " Power Plant" : " Engine");
        }
        first = CW.writeAccessory(buf, engine.carburetor, "Carb", first, ',');
        first = CW.writeAccessory(buf, engine.multibarrelCarburetor, "MB Carb", first, ',');
        first = CW.writeAccessory(buf, engine.tubularHeaders, "TH", first, ',');
        first = CW.writeAccessory(buf, engine.turbocharger, "Turbo", first, ',');
        first = CW.writeAccessory(buf, engine.variablePitchTurbocharger, "VP Turbo", first, ',');
        first = CW.writeAccessory(buf, engine.supercharger, "SC", first, ',');
        first = CW.writeAccessory(buf, engine.platinumCatalysts, "PC", first, ',');
        first = CW.writeAccessory(buf, engine.superconductors, "SC", first, ',');
        shape.hoverText = buf.join('');
    };

    CWD.createEngineShape = function (car) {
        var shape = CWD.createShape();
        shape.car = car;
        shape.minRowHeight = 2;
        shape.type = "Engine";
        shape.damage = 0;
        shape.caDamage = 0;

        shape.updateHoverText = function () {
            CWD.setEngineHoverText(shape, this.car.engine);
        };
        shape.updateHoverText();
        shape.hoverLink = "editEngineList";

        shape.draw = function (ctx, borderColor) {
            var dpMaxWidth = this.w - 15;
            var dpMaxHeight = this.h - 52;
            var dpWidth = 15, dpHeight = 15;
            var r, c;
            var dp = shape.car.engine.totalDP();
            var dims = CWD.dpDimensions(dp);
            if (dims.cols * dpWidth > dpMaxWidth) dpWidth = Math.floor(dpMaxWidth / dims.cols);
            if (dims.rows * dpHeight > dpMaxHeight) dpHeight = Math.floor(dpMaxHeight / dims.rows);

            // Draw outline of engine
            ctx.beginPath();
            ctx.strokeStyle = borderColor;
            ctx.moveTo(this.x, this.y + 10);         // Left fan
            ctx.lineTo(this.x, this.y + this.h - 10);
            ctx.moveTo(this.x, this.y + this.h / 2);
            ctx.lineTo(this.x + 5, this.y + this.h / 2);
            ctx.moveTo(this.x + 30, this.y);         // Top fan
            ctx.lineTo(this.x + this.w - 30, this.y);
            ctx.moveTo(this.x + this.w / 2, this.y);
            ctx.lineTo(this.x + this.w / 2, this.y + 5);
            ctx.moveTo(this.x + 5, this.y + this.h / 2); // Left side
            ctx.arcTo(this.x + 5, this.y + 10, this.x + 30, this.y + 10, 5); // top left
            ctx.lineTo(this.x + 25, this.y + 10); // horizontal
            ctx.lineTo(this.x + 30, this.y + 5);  // diag up
            ctx.lineTo(this.x + this.w - 30, this.y + 5);  // horiz
            ctx.lineTo(this.x + this.w - 25, this.y + 15); // diag down
            ctx.lineTo(this.x + this.w - 20, this.y + 15); // horiz
            ctx.lineTo(this.x + this.w - 20, this.y + 20); // down
            ctx.lineTo(this.x + this.w - 15, this.y + 20); // horiz
            ctx.lineTo(this.x + this.w - 15, this.y + 15); // up
            ctx.lineTo(this.x + this.w - 5, this.y + 15);  // horiz
            ctx.lineTo(this.x + this.w, this.y + 20);    // diag down
            ctx.lineTo(this.x + this.w, this.y + this.h - 10);    // down
            ctx.lineTo(this.x + this.w - 5, this.y + this.h - 5);   // diag left
            ctx.lineTo(this.x + this.w - 15, this.y + this.h - 5);  // horiz
            ctx.lineTo(this.x + this.w - 15, this.y + this.h - 10); // up
            ctx.lineTo(this.x + this.w - 20, this.y + this.h - 10); // horiz
            ctx.lineTo(this.x + this.w - 20, this.y + this.h - 5);  // down
            ctx.arcTo(this.x + this.w - 20, this.y + this.h, this.x + 30, this.y + this.h, 5);
            ctx.lineTo(this.x + 40, this.y + this.h);
            ctx.lineTo(this.x + 30, this.y + this.h - 15);
            ctx.lineTo(this.x + 10, this.y + this.h - 15);
            ctx.arcTo(this.x + 5, this.y + this.h - 15, this.x + 5, this.y + this.h / 2, 5);
            ctx.closePath();
            ctx.fillStyle = CWD.backgroundColor;
            ctx.fill();
            ctx.stroke();
            // Name and DP
            ctx.font = '15px sans-serif';
            ctx.strokeStyle = CWD.mainStroke;
            ctx.fillStyle = CWD.mainStroke;
            ctx.fillText(shape.car.engine.name === "Medium Cycle" ? "Med. Cycle" : shape.car.engine.name, this.x + 10, this.y + 32);
            ctx.fillStyle = CWD.dpFill;
            for (r = 0; r < dims.rows; r++) {
                for (c = 0; c < dims.cols; c++) {
                    if (r * dims.cols + c < dp) {
                        ctx.fillRect(this.x + 10 + c * dpWidth, this.y + 35 + r * dpHeight, dpWidth, dpHeight);
                        ctx.strokeRect(this.x + 10 + c * dpWidth, this.y + 35 + r * dpHeight, dpWidth, dpHeight);
                    }
                }
            }
            // Damage
            if (this.damage > 0) {
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                for (r = 0; r < dims.rows; r++) {
                    for (c = 0; c < dims.cols; c++) {
                        var now = r * dims.cols + c;
                        if (now < this.damage && now < dp) {
                            ctx.moveTo(this.x + 10 + c * dpWidth, this.y + 35 + r * dpHeight);
                            ctx.lineTo(this.x + 10 + c * dpWidth + dpWidth, this.y + 35 + r * dpHeight + dpHeight);
                            ctx.moveTo(this.x + 10 + c * dpWidth, this.y + 35 + r * dpHeight + dpHeight);
                            ctx.lineTo(this.x + 10 + c * dpWidth + dpWidth, this.y + 35 + r * dpHeight);
                        }
                    }
                }
                ctx.moveTo(-1, -1);
                ctx.closePath();
                ctx.stroke();
            }
        };

        return shape;
    };

    CWD.createGasTankShape = function (tank) {
        var shape = CWD.createShape();
        shape.tank = tank;
        shape.minRowHeight = 2; // TODO: could be 1.5?  Maybe 1?

        shape.draw = function (ctx, borderColor) {
            // Draw outline of gas tank
            ctx.beginPath();
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;
            ctx.moveTo(this.x + 10, this.y + this.h);
            ctx.lineTo(this.x, this.y + this.h - 10);
            ctx.lineTo(this.x, this.y + 10);
            ctx.lineTo(this.x + 10, this.y);
            ctx.lineTo(this.x + this.w - 25, this.y);
            ctx.lineTo(this.x + this.w, this.y + 25);
            ctx.lineTo(this.x + this.w, this.y + this.h - 10);
            ctx.lineTo(this.x + this.w - 10, this.y + this.h);
            ctx.closePath();
            // Interior of handle -- will not be filled due to non-zero-winding rule
            ctx.moveTo(this.x + 8, this.y + 30);
            ctx.lineTo(this.x + 23, this.y + 15);
            ctx.lineTo(this.x + this.w - 23, this.y + 15);
            ctx.lineTo(this.x + this.w - 30, this.y + 8);
            ctx.lineTo(this.x + 15, this.y + 8);
            ctx.lineTo(this.x + 8, this.y + 15);
            ctx.lineTo(this.x + 8, this.y + 30);
            ctx.fill();
            ctx.stroke();

            // Nozzle
            ctx.beginPath();
            ctx.moveTo(this.x + this.w - 10, this.y + 15);
            ctx.lineTo(this.x + this.w, this.y + 5);
            ctx.lineTo(this.x + this.w - 5, this.y);
            ctx.lineTo(this.x + this.w - 15, this.y + 10);
            ctx.fill();
            ctx.stroke();

            // Name and DP
            ctx.font = '15px sans-serif';
            ctx.strokeStyle = CWD.mainStroke;
            ctx.fillStyle = CWD.mainStroke;
            var text = this.tank.capacity + "-gal Tank";
            if (!shape.textWidth || shape.oldText !== text) {
                shape.textWidth = ctx.measureText(text).width;
                shape.oldText = text;
            }
            ctx.fillText(text, this.x + this.w / 2 - shape.textWidth / 2, this.y + 43);
            ctx.fillStyle = CWD.dpFill;
            var dims = this.h > 82 ? CWD.dpDimensions(this.tank.totalDP()) : {rows: 1, cols: this.tank.totalDP()}, r, c;
            var size = 15;
            if (size * dims.cols > this.w - 20) size = (this.w - 20) / dims.cols;
            if (size * dims.rows > this.h - 55) size = (this.h - 55) / dims.rows;
            for (r = 0; r < dims.rows; r++) {
                for (c = 0; c < dims.cols; c++) {
                    if (r * dims.cols + c < this.tank.totalDP()) {
                        ctx.fillRect(this.x + 10 + c * size, this.y + 50 + r * size, size, size);
                        ctx.strokeRect(this.x + 10 + c * size, this.y + 50 + r * size, size, size);
                    }
                }
            }
        };

        shape.hoverText = "Gas Tank";
        shape.hoverLink = "editGasTank";

        return shape;
    };

    CWD.createWeaponShape = function (weapon, location, rotation) {
        var name = weapon.name + " " + weapon.displayLocation;
        if (name.length > 29) name = weapon.abbv + " " + weapon.displayLocation;
        var shape = CWD.createShape(name, "edit" + location + "Weapons");
        shape.weapon = weapon;
        shape.drawFullBarrel = !/Turret/.test(location);
        shape.location = location;
        shape.rotation = rotation || location;
        shape.singleShotRocket = shape.weapon.isSingleShotRocket();
        if (shape.rotation.indexOf('Sidecar') === 0) shape.rotation = shape.rotation.substring(7);
        shape.matrix = null;
        shape.rotatedXRange = null;
        shape.rotatedYRange = null;
        shape.type = "Weapon";
        shape.damage = 0;
        shape.caDamage = 0;
        shape.ammoUsed = [];

        shape.projectionDistance = function() {
            if(this.weapon.isDropped() || this.singleShotRocket) return 5;
            if(this.weapon.isRocket()) return this.drawFullBarrel ? 44 : 4;
            if(this.weapon.isLaser() || this.weapon.isFlamethrower()) return this.drawFullBarrel ? 30 : 0;
            if(this.weapon.isLargeBore()) return this.drawFullBarrel ? 50 : 0;
            if(this.weapon.isSmallBore()) return this.drawFullBarrel ? 60 : 0;
            return 0;
        };

        shape.configureSize = function () {
            if (shape.singleShotRocket || (!shape.weapon.fake && shape.weapon.totalCapacity() === 0)) {
                if (shape.singleShotRocket && shape.weapon.componentArmor && shape.weapon.count > 1) {
                    shape.maxHeight = 70;
                    shape.minRowHeight = 2;
                    shape.maxRowHeight = 2;
                } else {
                    shape.maxHeight = 50;
                    shape.minRowHeight = 1;
                    shape.maxRowHeight = 1;
                }
            } else {
                shape.maxHeight = 100;
                shape.minRowHeight = 1;
                shape.maxRowHeight = 2;
            }
        };
        shape.configureSize();

        shape.updateHoverText = function () {
            if (this.singleShotRocket) {
                if (this.weapon.count > 1 && this.combineAllRockets) this.hoverText = this.weapon.count + " " + this.weapon.abbv + "s " + this.weapon.displayLocation;
                else this.hoverText = this.weapon.abbv + " " + this.weapon.displayLocation;
            } else {
                var name = this.weapon.name + " " + this.weapon.displayLocation;
                if (name.length > 29) this.hoverText = this.weapon.abbv + " " + this.weapon.displayLocation;
                else this.hoverText = name;
            }
        };

        var superContains = shape.contains;
        shape.contains = function (mx, my) {
            if (shape.matrix) { // If there's a rotation on this weapon, apply it to the dimensions before checking the point
                if ((mx >= shape.rotatedXRange[0] && mx <= shape.rotatedXRange[1])
                    && (my >= shape.rotatedYRange[0] && my <= shape.rotatedYRange[1])) return this;
                return null;
            } else return superContains.apply(this, [mx, my]);
        };

        shape.totalAmmoUsed = function () {
            if (!this.ammoUsed) return 0;
            var i, total = 0;
            for (i = 0; i < this.ammoUsed.length; i++) total += this.ammoUsed[i];
            return total;
        };

        shape.draw = function (ctx, borderColor) {
            var i;
            // Check whether we should rotate the weapon to a different facing
            shape.matrix = null;
            var backRotation = shape.rotation === 'Back' || shape.rotation === 'BackRight'
                || shape.rotation === 'BackLeft' || shape.rotation === 'Top' || shape.rotation === 'Underbody'
                || shape.rotation === 'TopBack' || shape.rotation === 'UnderbodyBack';
            if (backRotation) {
                shape.matrix = [-1, 0, 0, 1, shape.x * 2 + shape.w, 0];
            } else if (shape.rotation === 'Left' || shape.rotation === 'LeftBack') {
                shape.matrix = [0, -1, 1, 0, shape.x - shape.y, shape.x + shape.w + shape.y];
            } else if (shape.rotation === 'Right' || shape.rotation === 'RightBack') {
                shape.matrix = [0, 1, -1, 0, shape.y + shape.x + shape.h, shape.y - shape.x];
            }
            if (shape.matrix) {
                ctx.transform.apply(ctx, shape.matrix);
                // Store rotated bounding box because we get a lot of contains() calls for every draw() call
                var xmin = this.x * shape.matrix[0] + this.y * shape.matrix[2] + shape.matrix[4];
                var ymin = this.x * shape.matrix[1] + this.y * shape.matrix[3] + shape.matrix[5];
                var xmax = (this.x + this.w) * shape.matrix[0] + (this.y + this.h) * shape.matrix[2] + shape.matrix[4];
                var ymax = (this.x + this.w) * shape.matrix[1] + (this.y + this.h) * shape.matrix[3] + shape.matrix[5];
                if (xmin > xmax) {
                    i = xmin;
                    xmin = xmax;
                    xmax = i;
                }
                if (ymin > ymax) {
                    i = ymin;
                    ymin = ymax;
                    ymax = i;
                }
                shape.rotatedXRange = [xmin, xmax];
                shape.rotatedYRange = [ymin, ymax];
            }
            // End of initial rotation logic

            var drawAmmo = shape.h > 60;
            var nameOffset = 0, useH, barrelEnd, textLeft, offset;

            // DP Calculations
            var dp = shape.weapon.totalDP();
            var dims = CWD.dpDimensions(dp);
            var textOffsetY = 21;
            var dpStartX = 22;
            var dpEndX = 22;
            var dpStartY = 25;
            var dpEndY = drawAmmo ? Math.min(43, shape.h - 28 - dims.rows * 7) : 0; // offset from bottom of box
            if (drawAmmo && dpEndY <= 18 && !shape.weapon.isRocket()) {
                drawAmmo = false;
                dpEndY = 0;
            }
            var dpWidth = 15;
            var dpHeight = 15;
            var ammoStartX = null, ammoStartY = null;
            if (dims.cols * dpWidth > this.w - dpStartX - dpEndX - 3) dpWidth = Math.floor((this.w - dpStartX - dpEndX - 3) / dims.cols);
            if (dims.rows * dpHeight > this.h - dpStartY - dpEndY - 3) dpHeight = Math.floor((this.h - dpStartY - dpEndY - 3) / dims.rows);

            // Main body of weapon: effective top = y+7, effective left = x+16, barrel bottom = y+25
            //   With full barrel, right= x+w+60
            ctx.beginPath();
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;

            if (this.singleShotRocket) {
                nameOffset = 11;
                if (this.weapon.abbv.length > 3) nameOffset = 8;
                if (backRotation) nameOffset = this.w - 48;
                useH = Math.min(50, this.h);
                ctx.moveTo(this.x + 10, this.y + useH - 8);
                ctx.quadraticCurveTo(this.x + 5, this.y + useH / 2, this.x + 10, this.y + 8); // back curve
                //            if(this.weapon.abbv.length > 3)
                //                ctx.quadraticCurveTo(this.x+5, this.y+useH/2, this.x+10, this.y+8);
                //            else
                //                ctx.quadraticCurveTo(this.x+15, this.y+useH/2, this.x+10, this.y+8);
                ctx.lineTo(this.x, this.y); // Back fin
                ctx.lineTo(this.x + 20, this.y);
                ctx.quadraticCurveTo(this.x + 18, this.y + 3, this.x + 15, this.y + 3);
                ctx.lineTo(this.x + 30, this.y + 8);
                ctx.lineTo(this.x + this.w - 30, this.y + 8);
                ctx.quadraticCurveTo(this.x + this.w - 20, this.y + 4, this.x + this.w + 5, this.y + useH / 2);
                ctx.quadraticCurveTo(this.x + this.w - 20, this.y + useH - 4, this.x + this.w - 30, this.y + useH - 8);
                ctx.lineTo(this.x + 30, this.y + useH - 8);
                ctx.lineTo(this.x + 15, this.y + useH - 3);
                ctx.quadraticCurveTo(this.x + 18, this.y + useH - 3, this.x + 20, this.y + useH);
                ctx.lineTo(this.x, this.y + useH);
                ctx.lineTo(this.x + 10, this.y + useH - 8);
                //            ctx.quadraticCurveTo(this.x+5, this.y+useH/2, this.x+10, this.y+8);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                textOffsetY = useH / 2 + 7;
                dpStartX = 50;
                dpStartY = 10;
                dpEndY = this.h - useH + 8;
                dpEndX = 15;
                if (this.combineAllRockets) dp = this.weapon.totalDP() * this.weapon.count;
                dims = CWD.dpDimensions(dp);
                dpWidth = 15;
                dpHeight = 15;
                if (dims.cols * dpWidth > this.w - dpStartX - dpEndX - 3) dpWidth = Math.floor((this.w - dpStartX - dpEndX - 3) / dims.cols);
                if (dims.rows * dpHeight > this.h - dpStartY - dpEndY - 3) dpHeight = Math.floor((this.h - dpStartY - dpEndY - 3) / dims.rows);

                drawAmmo = false;
            } else if (shape.weapon.isRocket()) {
                offset = this.h < 40 ? (40 - this.h) / 2 : 0;
                textOffsetY = this.h - 14 + offset;
                nameOffset = 3;
                dpStartX = 40;
                dpEndX = 35;
                dpStartY = this.h - 38 + offset * 2;
                dpEndY = 2;
                dpWidth = 15;
                dpHeight = 15;
                if (dims.cols * dpWidth > this.w - dpStartX - dpEndX - 3) dpWidth = Math.floor((this.w - dpStartX - dpEndX - 3) / dims.cols);
                if (dims.rows * dpHeight > this.h - dpStartY - dpEndY - 3) dpHeight = Math.floor((this.h - dpStartY - dpEndY - 3) / dims.rows);
                ctx.moveTo(this.x + 3, this.y + this.h - 28 + offset);
                ctx.quadraticCurveTo(this.x - 1, this.y + this.h - 20 + offset, this.x + 3, this.y + this.h - 12 + offset);
                ctx.lineTo(this.x + 15, this.y + this.h - 6 + offset);
                ctx.lineTo(this.x + 18, this.y + this.h - 12 + offset);
                ctx.lineTo(this.x + 23, this.y + this.h);
                ctx.lineTo(this.x + 30, this.y + this.h);
                ctx.quadraticCurveTo(this.x + this.w / 2, this.y + this.h - 8, this.x + this.w - 40, this.y + this.h);
                ctx.lineTo(this.x + this.w - 37, this.y + this.h);
                ctx.lineTo(this.x + this.w - 33, this.y + this.h - 12 + offset);
                ctx.lineTo(this.x + this.w - 30, this.y + this.h - 12 + offset);
                ctx.lineTo(this.x + this.w - 26, this.y + this.h - 4 + offset);
                ctx.lineTo(this.x + this.w, this.y + this.h - 12 + offset);
                ctx.quadraticCurveTo(this.x + this.w - 4, this.y + this.h - 20 + offset, this.x + this.w, this.y + this.h - 28 + offset);
                if (!this.drawFullBarrel) {
                    ctx.quadraticCurveTo(this.x + this.w + 4, this.y + this.h - 20 + offset, this.x + this.w, this.y + this.h - 12 + offset);
                    ctx.quadraticCurveTo(this.x + this.w - 4, this.y + this.h - 20 + offset, this.x + this.w, this.y + this.h - 28 + offset);
                }
                ctx.lineTo(this.x + this.w - 26, this.y + this.h - 36 + offset);
                ctx.lineTo(this.x + this.w - 30, this.y + this.h - 28 + offset);
                ctx.lineTo(this.x + this.w - 33, this.y + this.h - 28 + offset);
                ctx.lineTo(this.x + this.w - 37, this.y + this.h - 40 + offset * 2);
                ctx.lineTo(this.x + 23, this.y + this.h - 40 + offset * 2);
                ctx.lineTo(this.x + 18, this.y + this.h - 28 + offset);
                ctx.lineTo(this.x + 15, this.y + this.h - 34 + offset);
                ctx.lineTo(this.x + 3, this.y + this.h - 28 + offset);
                ctx.closePath();
                if (this.drawFullBarrel) {
                    ctx.moveTo(this.x + this.w, this.y + this.h - 12 + offset);
                    ctx.quadraticCurveTo(this.x + this.w - 4, this.y + this.h - 20 + offset, this.x + this.w, this.y + this.h - 28 + offset);
                    ctx.lineTo(this.x + this.w + 40, this.y + this.h - 28 + offset);
                    ctx.quadraticCurveTo(this.x + this.w + 36, this.y + this.h - 20 + offset, this.x + this.w + 40, this.y + this.h - 12 + offset);
                    ctx.quadraticCurveTo(this.x + this.w + 44, this.y + this.h - 20 + offset, this.x + this.w + 40, this.y + this.h - 28 + offset);
                    ctx.quadraticCurveTo(this.x + this.w + 36, this.y + this.h - 20 + offset, this.x + this.w + 40, this.y + this.h - 12 + offset);
                    ctx.lineTo(this.x + this.w, this.y + this.h - 12 + offset);
                    ctx.closePath();
                }
                ctx.fill();
                ctx.stroke();
                if (drawAmmo) {
                    var rFactor = ctx.type === 'pdf' ? -1 : 1;
                    var useWidth = this.w - 40;
                    // Rocket 1
                    ctx.transform(1, 0, 0, 1, this.x + 15, this.y + this.h - 50);
                    ctx.moveTo(useWidth / 4, 0);
                    ctx.lineTo(useWidth * 3 / 4, 0);
                    ctx.quadraticCurveTo(useWidth * 7 / 8, 0, useWidth, rFactor * 5);
                    ctx.quadraticCurveTo(useWidth * 7 / 8, rFactor * 10, useWidth * 3 / 4, rFactor * 10);
                    ctx.lineTo(0, rFactor * 10);
                    ctx.lineTo(5, rFactor * 5);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(useWidth / 4, 0);
                    ctx.fill();
                    ctx.stroke();
                    ctx.setTransform.apply(ctx, CWD.globalTransform);
                    if (shape.matrix) ctx.transform.apply(ctx, shape.matrix);
                    // Rocket 2
                    if (this.h >= 75) {
                        ctx.transform(Math.cos(rFactor * Math.PI / 18), Math.sin(rFactor * Math.PI / 18), -Math.sin(rFactor * Math.PI / 18), Math.cos(rFactor * Math.PI / 18), this.x + 18, this.y + this.h - 72);
                        ctx.moveTo(useWidth / 4, 0);
                        ctx.lineTo(useWidth * 3 / 4, 0);
                        ctx.quadraticCurveTo(useWidth * 7 / 8, 0, useWidth, rFactor * 5);
                        ctx.quadraticCurveTo(useWidth * 7 / 8, rFactor * 10, useWidth * 3 / 4, rFactor * 10);
                        ctx.lineTo(0, rFactor * 10);
                        ctx.lineTo(5, rFactor * 5);
                        ctx.lineTo(0, 0);
                        ctx.lineTo(useWidth / 4, 0);
                        ctx.fill();
                        ctx.stroke();
                        ctx.setTransform.apply(ctx, CWD.globalTransform);
                        if (shape.matrix) ctx.transform.apply(ctx, shape.matrix);
                    }
                    // Rocket 3
                    if (this.h >= 95) {
                        ctx.transform(Math.cos(rFactor * Math.PI / 9), Math.sin(rFactor * Math.PI / 9), -Math.sin(rFactor * Math.PI / 9), Math.cos(rFactor * Math.PI / 9), this.x + 25, this.y + this.h - 93);
                        ctx.moveTo(useWidth / 4, 0);
                        ctx.lineTo(useWidth * 3 / 4, 0);
                        ctx.quadraticCurveTo(useWidth * 7 / 8, 0, useWidth, rFactor * 5);
                        ctx.quadraticCurveTo(useWidth * 7 / 8, rFactor * 10, useWidth * 3 / 4, rFactor * 10);
                        ctx.lineTo(0, rFactor * 10);
                        ctx.lineTo(5, rFactor * 5);
                        ctx.lineTo(0, 0);
                        ctx.lineTo(useWidth / 4, 0);
                        ctx.fill();
                        ctx.stroke();
                        ctx.setTransform.apply(ctx, CWD.globalTransform);
                        if (shape.matrix) ctx.transform.apply(ctx, shape.matrix);
                    }
                    // Clip
                    ctx.beginPath();
                    ctx.moveTo(this.x + 23, this.y + this.h - 40); // Back bottom of clip
                    ctx.quadraticCurveTo(this.x + 23, this.y + (this.h - 45) / 2, this.x + 35, this.y + 5);
                    ctx.lineTo(this.x + this.w - 27, this.h >= 80 ? this.y + 20 : this.y + 12);
                    ctx.quadraticCurveTo(this.x + this.w - 37, this.y + 20 + (this.h - 60) / 2, this.x + this.w - 37, this.y + this.h - 40);
                    ctx.lineTo(this.x + 23, this.y + this.h - 40);
                    // Hole to see rockets -- hidden so we can put the ammo count there instead
                    //                ctx.moveTo(this.x+this.w/2+11, this.y+37);
                    //                ctx.arc(this.x+this.w/2-5, this.y+37, 16, 0, Math.PI*2, true);

                    ctx.fill();
                    ctx.stroke();
                    // Ammo Count
                    if (shape.rotation === 'Front' || /Turret/.test(shape.rotation)) {
                        ammoStartX = this.x + 30;
                        ammoStartY = this.y + 27 - (this.h < 75 ? 5 : 0);
                    } else if (shape.rotation === 'Back') {
                        ammoStartX = this.x + 31 + (this.h < 75 ? 5 : 0);
                        ammoStartY = this.y + 29 - (this.h < 75 ? 7 : 0);
                    } else if (shape.rotation === 'Left' || shape.rotation === 'LeftBack') {
                        ammoStartX = this.x + 10;
                        ammoStartY = this.y + this.h - 35;
                    } else if (shape.rotation === 'Right' || shape.rotation === 'RightBack') {
                        ammoStartX = this.x + 42;
                        ammoStartY = this.y + 41;
                    }
                }
            } else if (shape.weapon.isLaser()) {
                useH = Math.min(40, this.h);
                ctx.moveTo(this.x, this.y + 5);
                ctx.lineTo(this.x + 3, this.y);
                ctx.lineTo(this.x + 13, this.y);
                ctx.lineTo(this.x + 16, this.y + 3);
                ctx.lineTo(this.x + 22, this.y + 6);
                ctx.lineTo(this.x + 25, this.y + 6);
                ctx.lineTo(this.x + 30, this.y);
                ctx.lineTo(this.x + 40, this.y);
                ctx.lineTo(this.x + 45, this.y + 6);
                ctx.lineTo(this.x + 55, this.y + 6);
                ctx.lineTo(this.x + 60, this.y + 12);
                ctx.lineTo(this.x + 65, this.y + 4);
                ctx.lineTo(this.x + 68, this.y + 4);
                ctx.lineTo(this.x + 68, this.y + useH * 2 / 3);
                ctx.lineTo(this.x + 68 - useH / 3, this.y + useH - 4);
                ctx.lineTo(this.x + 30, this.y + useH - 4);
                ctx.lineTo(this.x + 26, this.y + useH);
                ctx.lineTo(this.x + 16, this.y + useH);
                ctx.lineTo(this.x + 10, this.y + useH - 4);
                ctx.lineTo(this.x + 3, this.y + useH - 4);
                ctx.lineTo(this.x, this.y + useH - 9);
                ctx.closePath();
                var barrelHeight = Math.min(useH * 2 / 3 - 8, 10);
                var barrelTop = this.y + useH * 2 / 3 - barrelHeight - (useH * 2 / 3 - barrelHeight >= 8 ? 4 : 0);
                barrelEnd = this.drawFullBarrel ? this.x + this.w + 30 : this.x + this.w;
                ctx.moveTo(this.x + 68, barrelTop);
                ctx.lineTo(barrelEnd - 15, barrelTop);
                ctx.lineTo(barrelEnd - 15, barrelTop + barrelHeight);
                ctx.lineTo(this.x + 68, barrelTop + barrelHeight);
                ctx.closePath();
                ctx.moveTo(barrelEnd - 15, barrelTop + 2);
                ctx.lineTo(barrelEnd, barrelTop + 2);
                ctx.lineTo(barrelEnd, barrelTop + barrelHeight - 2);
                ctx.lineTo(barrelEnd - 15, barrelTop + barrelHeight - 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
                if (barrelEnd - 16 >= this.x + 71) {
                    ctx.moveTo(this.x + 68, barrelTop - 4);
                    ctx.lineTo(this.x + 71, barrelTop - 4);
                    ctx.lineTo(this.x + 71, barrelTop + barrelHeight + 4);
                    ctx.lineTo(this.x + 68, barrelTop + barrelHeight + 4);
                    ctx.closePath();
                }
                if (barrelEnd - 16 >= this.x + 76) {
                    ctx.moveTo(this.x + 73, barrelTop - 4);
                    ctx.lineTo(this.x + 76, barrelTop - 4);
                    ctx.lineTo(this.x + 76, barrelTop + barrelHeight + 4);
                    ctx.lineTo(this.x + 73, barrelTop + barrelHeight + 4);
                    ctx.closePath();
                }
                if (barrelEnd - 16 >= this.x + 81) {
                    ctx.moveTo(this.x + 78, barrelTop - 4);
                    ctx.lineTo(this.x + 81, barrelTop - 4);
                    ctx.lineTo(this.x + 81, barrelTop + barrelHeight + 4);
                    ctx.lineTo(this.x + 78, barrelTop + barrelHeight + 4);
                    ctx.closePath();
                }
                if (barrelEnd - 16 >= this.x + 68) {
                    ctx.moveTo(barrelEnd - 16, barrelTop - 2);
                    ctx.lineTo(barrelEnd - 2, barrelTop - 2);
                    ctx.lineTo(barrelEnd - 13, barrelTop + barrelHeight + 2);
                    ctx.lineTo(barrelEnd - 16, barrelTop + barrelHeight + 2);
                    ctx.closePath();
                }
                ctx.fill();
                ctx.stroke();

                nameOffset = 38;
                textOffsetY = 24;
                dpStartX = 2;
                dpEndX = this.w - 40;
                dpStartY = 8;
                dpEndY = 5 + this.h - useH;
                dpWidth = 15;
                dpHeight = 15;
                if (dims.cols * dpWidth > this.w - dpStartX - dpEndX - 3) dpWidth = Math.floor((this.w - dpStartX - dpEndX - 3) / dims.cols);
                if (dims.rows * dpHeight > this.h - dpStartY - dpEndY - 3) dpHeight = Math.floor((this.h - dpStartY - dpEndY - 3) / dims.rows);
                drawAmmo = false;
            } else if (shape.weapon.category === 'Dropped Solids') {
                textLeft = backRotation ? this.w / 2 + 2 : 10;
                textOffsetY = 13;
                nameOffset = textLeft;
                ammoStartY = this.y + (shape.rotation === 'Right' || shape.rotation === 'RightBack' ? 15 : this.h / 2 + 13);
                ammoStartX = this.x + (shape.rotation === 'Left' || shape.rotation === 'LeftBack' ? this.h / 2 :
                        shape.rotation === 'Right' || shape.rotation === 'RightBack' ? 18 : textLeft);
                dpStartX = 10;
                dpStartY = this.h > 60 ? 18 : 16;
                dpEndX = this.w / 2;
                dpEndY = this.h > 60 ? this.h / 2 : 18;
                dpWidth = 15;
                dpHeight = 15;
                if (dims.cols * dpWidth > this.w - dpStartX - dpEndX - 3) dpWidth = Math.floor((this.w - dpStartX - dpEndX - 3) / dims.cols);
                if (dims.rows * dpHeight > this.h - dpStartY - dpEndY - 3) dpHeight = Math.floor((this.h - dpStartY - dpEndY - 3) / dims.rows);

                var mineCount = 5;
                var mineHeight = (this.h - 32) / mineCount;
                if (mineHeight < 9) {
                    mineCount = Math.max(1, Math.floor((this.h - 32) / 9 + 0.0001));
                    mineHeight = Math.max(9, (this.h - 32) / mineCount);
                }
                // Outer Frame
                ctx.moveTo(this.x, this.y + 10);
                ctx.lineTo(this.x, this.y + this.h - 10);
                ctx.lineTo(this.x + 10, this.y + this.h);
                ctx.lineTo(this.x + this.w / 2 - 5, this.y + this.h);
                ctx.lineTo(this.x + this.w / 2 - 5, this.y + this.h - 10);
                ctx.lineTo(this.x + this.w / 4 - 10, this.y + this.h - 10);
                ctx.lineTo(this.x + this.w / 4 - 10, this.y + this.h - 15);
                ctx.lineTo(this.x + this.w / 2 - 10, this.y + this.h - 15);
                ctx.lineTo(this.x + this.w / 2, this.y + this.h - 25);
                ctx.lineTo(this.x + this.w / 2, this.y + 15);
                ctx.lineTo(this.x + this.w - 8 - this.w / 4, this.y + 15);
                ctx.lineTo(this.x + this.w - 8 - this.w / 4, this.y + 20);
                ctx.lineTo(this.x + this.w - 8 - this.w / 4 + 10, this.y + 20);
                ctx.lineTo(this.x + this.w - 8 - this.w / 4 + 10, this.y + 15);
                ctx.lineTo(this.x + this.w - 6, this.y + 15);
                ctx.lineTo(this.x + this.w - 6, this.y + this.h - 12 - mineHeight);
                ctx.lineTo(this.x + this.w, this.y + this.h - 12 - mineHeight);
                ctx.lineTo(this.x + this.w, this.y + 10);
                ctx.lineTo(this.x + this.w - 10, this.y);
                ctx.lineTo(this.x + 10, this.y);
                ctx.closePath();
                // Reserve Ammo
                for (i = 1; i <= mineCount - 1; i++) {
                    //                if(this.weapon.name === 'Spikedropper') {
                    //                    ctx.moveTo(this.x+this.w-8, this.y+20+mineHeight*i);
                    //                    ctx.lineTo(this.x+this.w/2+2, this.y+20+mineHeight*i);
                    //                    ctx.lineTo(this.x+this.w/2+2+this.w/20-1, this.y+20+mineHeight*i-mineHeight/10);
                    //                    ctx.lineTo(this.x+this.w/2+2, this.y+20+mineHeight*i-mineHeight/2);
                    //                    ctx.lineTo(this.x+this.w/2+2+this.w/10-2, this.y+20+mineHeight*i-mineHeight/8);
                    //                    ctx.lineTo(this.x+this.w/2+2+this.w/20-1, this.y+20+mineHeight*i-mineHeight*0.75);
                    //                    ctx.lineTo(this.x+this.w/2+2+3*this.w/20-3, this.y+20+mineHeight*i-mineHeight/6);
                    //                    ctx.lineTo(this.x+this.w/2+2+3*this.w/20-3, this.y+20+mineHeight*i-mineHeight*0.85);
                    //                    ctx.lineTo(this.x+this.w/2+2+4*this.w/20-3, this.y+20+mineHeight*i-mineHeight/4);
                    //                    ctx.lineTo(this.x+this.w/2+2+this.w/4-5, this.y+20+mineHeight*i-mineHeight);
                    //                    ctx.lineTo(this.x+this.w-8-4*this.w/20+3, this.y+20+mineHeight*i-mineHeight/4);
                    //                    ctx.lineTo(this.x+this.w-8-3*this.w/20+3, this.y+20+mineHeight*i-mineHeight*0.85);
                    //                    ctx.lineTo(this.x+this.w-8-3*this.w/20+3, this.y+20+mineHeight*i-mineHeight/6);
                    //                    ctx.lineTo(this.x+this.w-8-this.w/20+1, this.y+20+mineHeight*i-mineHeight*0.75);
                    //                    ctx.lineTo(this.x+this.w-8-this.w/10+2, this.y+20+mineHeight*i-mineHeight/8);
                    //                    ctx.lineTo(this.x+this.w-8, this.y+20+mineHeight*i-mineHeight/2);
                    //                    ctx.lineTo(this.x+this.w/2+2+this.w/20-1, this.y+20+mineHeight*i-mineHeight/10);
                    //                    ctx.closePath();
                    //                } else {
                    ctx.moveTo(this.x + this.w / 2 + 2, this.y + 20 + mineHeight * i);
                    ctx.lineTo(this.x + this.w - 8, this.y + 20 + mineHeight * i);
                    ctx.quadraticCurveTo(this.x + this.w - 12, this.y + 20 + mineHeight * (i - 1), this.x + this.w - 8 - this.w / 4 + 5, this.y + 20 + mineHeight * (i - 1));
                    ctx.quadraticCurveTo(this.x + this.w / 2 + 8, this.y + 20 + mineHeight * (i - 1), this.x + this.w / 2 + 2, this.y + 20 + mineHeight * i);
                    //                }
                }
                // Link to active shot
                //            if(mineCount > 1) {
                ctx.moveTo(this.x + this.w - 8 - this.w / 4, this.y + 20 + mineHeight * (mineCount - 1));
                ctx.lineTo(this.x + this.w - 8 - this.w / 4 + 10, this.y + 20 + mineHeight * (mineCount - 1));
                ctx.lineTo(this.x + this.w - 8 - this.w / 4 + 10, this.y + this.h - 6 - mineHeight);
                ctx.lineTo(this.x + this.w - 8 - this.w / 4, this.y + this.h - 6 - mineHeight);
                ctx.closePath();
                //            }
                // Active shot
                var interval = (this.w / 2 - 10 - 12) / 4;
                ctx.moveTo(this.x + this.w / 2 + 2, this.y + this.h - 6);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval + 2, this.y + this.h - 6);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval - 4, this.y + this.h);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval, this.y + this.h);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval + 6, this.y + this.h - 6);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval + 4 + interval, this.y + this.h - 6);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval + 4 + interval, this.y + this.h - 2);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval + 4 + interval + 4, this.y + this.h - 2);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval + 4 + interval + 4, this.y + this.h - 6);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval + 4 + interval + 4 + interval - 2, this.y + this.h - 6);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval + 4 + interval + 4 + interval + 4, this.y + this.h);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval + 4 + interval + 4 + interval + 8, this.y + this.h);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval + 4 + interval + 4 + interval + 2, this.y + this.h - 6);
                ctx.lineTo(this.x + this.w - 8, this.y + this.h - 6);
                ctx.quadraticCurveTo(this.x + this.w - 12, this.y + this.h - 6 - mineHeight, this.x + this.w - 8 - this.w / 4 + 5, this.y + this.h - 6 - mineHeight);
                ctx.quadraticCurveTo(this.x + this.w / 2 + 8, this.y + this.h - 6 - mineHeight, this.x + this.w / 2 + 2, this.y + this.h - 6);
                // Pusher Arm
                ctx.moveTo(this.x + this.w / 2 - 5, this.y + this.h - 2);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval / 3, this.y + this.h - 2);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval / 3, this.y + this.h - 4);
                ctx.lineTo(this.x + this.w / 2, this.y + this.h - 4);
                ctx.lineTo(this.x + this.w / 2, this.y + this.h - 8);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval / 2, this.y + this.h - 8 - mineHeight / 2);
                ctx.lineTo(this.x + this.w / 2 + 2 + interval / 2 - 4, this.y + this.h - 8 - mineHeight / 2);
                ctx.lineTo(this.x + this.w / 2 - 5, this.y + this.h - 8);
                //            ctx.lineTo(this.x+this.w/2-5, this.y+this.h-8);
                ctx.closePath();

                ctx.fill();
                ctx.stroke();
            } else if (shape.weapon.category === 'Dropped Gasses' || shape.weapon.category === 'Dropped Liquids') {
                var center = this.h / 2;
                var single = false;
                var cylinder = (this.h - 12) / 2;
                var excess = (cylinder - 8) / 4;
                if (this.h < 50) {
                    single = true;
                    center = 9;
                    cylinder = Math.max(1, (this.h - 15));
                    excess = Math.max(1, (cylinder - 8) / 4);
                }
                var leftEnd = 8 + excess;
                textLeft = backRotation ? cylinder / 2 : leftEnd + cylinder / 2;
                textOffsetY = drawAmmo || (single && this.weapon.abbv.length > 2) || this.h < 30 ? 13 : this.h - 3;
                nameOffset = textLeft;
                ammoStartY = this.y + (shape.rotation === 'Left' || shape.rotation === 'LeftBack' ? cylinder / 2 + 13 :
                        shape.rotation === 'Right' || shape.rotation === 'RightBack' ? 8 + excess + 3 + cylinder / 2 + 13 : this.h / 2 + 6 + 14);
                ammoStartX = this.x + (shape.rotation === 'Left' || shape.rotation === 'LeftBack' ? cylinder + 15 :
                        shape.rotation === 'Right' || shape.rotation === 'RightBack' ? 3 : textLeft);
                dpStartX = this.h > 80 || backRotation ? leftEnd + cylinder / 2 : this.w / 2;
                dpStartY = this.h > 80 ? 23 : single ? 18 : 3;
                dpEndX = cylinder / 2;
                dpEndY = single ? 0 : this.h - cylinder;
                dpWidth = 15;
                dpHeight = 15;
                if (dims.cols * dpWidth > this.w - dpStartX - dpEndX - 3) dpWidth = Math.floor((this.w - dpStartX - dpEndX - 3) / dims.cols);
                if (dims.rows * dpHeight > this.h - dpStartY - dpEndY - 3) dpHeight = Math.floor((this.h - dpStartY - dpEndY - 3) / dims.rows);
                // Central Tube
                ctx.moveTo(this.x + this.w - 14, this.y + center - 6); // right top before nozzle flare
                if (!single) {
                    ctx.lineTo(this.x + leftEnd + cylinder / 3, this.y + center - 6);
                    ctx.lineTo(this.x + leftEnd + cylinder / 6, this.y + center - 10);
                    ctx.lineTo(this.x + leftEnd, this.y + center - 10);
                }
                ctx.lineTo(this.x + leftEnd, this.y + center - 6);
                if (single) {
                    ctx.arc(this.x + leftEnd, this.y + center - 6 + excess + 8, excess + 8, 3 * Math.PI / 2, Math.PI, true);
                } else {
                    ctx.arc(this.x + leftEnd, this.y + center - 6 - excess, excess, Math.PI / 2, 3 * Math.PI / 2, false);
                    ctx.lineTo(this.x + leftEnd + 3, this.y + center - 6 - excess * 2);
                    ctx.lineTo(this.x + leftEnd + 3, this.y + center - 6 - excess * 2 - 8);
                    ctx.lineTo(this.x + leftEnd, this.y + center - 6 - excess * 2 - 8);
                    ctx.arc(this.x + leftEnd, this.y + center - 6 - excess, excess + 8, 3 * Math.PI / 2, Math.PI, true);
                }
                ctx.lineTo(this.x, this.y + center + 6 + excess);
                ctx.arc(this.x + leftEnd, this.y + center + 6 + excess, excess + 8, Math.PI, Math.PI / 2, true);
                ctx.lineTo(this.x + leftEnd + 3, this.y + center + 6 + excess * 2 + 8);
                ctx.lineTo(this.x + leftEnd + 3, this.y + center + 6 + excess * 2);
                ctx.lineTo(this.x + leftEnd, this.y + center + 6 + excess * 2);
                ctx.arc(this.x + leftEnd, this.y + center + 6 + excess, excess, Math.PI / 2, 3 * Math.PI / 2, false);
                ctx.lineTo(this.x + leftEnd, this.y + center + 10);
                ctx.lineTo(this.x + leftEnd + cylinder / 6, this.y + center + 10);
                ctx.lineTo(this.x + leftEnd + cylinder / 3, this.y + center + 6);
                ctx.lineTo(this.x + this.w - 14, this.y + center + 6);
                // Nozzle
                ctx.lineTo(this.x + this.w, this.y + center + 9);
                ctx.quadraticCurveTo(this.x + this.w - 5, this.y + center, this.x + this.w, this.y + center - 9);
                ctx.closePath();
                ctx.moveTo(this.x + this.w, this.y + center + 9);
                ctx.quadraticCurveTo(this.x + this.w - 5, this.y + center, this.x + this.w, this.y + center - 9);
                ctx.quadraticCurveTo(this.x + this.w + 5, this.y + center, this.x + this.w, this.y + center + 9);
                ctx.closePath();

                // Top Cylinder
                if (!single) {
                    ctx.moveTo(this.x + leftEnd + 3 + cylinder / 2, this.y);
                    ctx.arc(this.x + leftEnd + 3 + cylinder / 2, this.y + cylinder / 2, cylinder / 2, 3 * Math.PI / 2, Math.PI / 2, true);
                    ctx.lineTo(this.x + this.w - cylinder / 2, this.y + this.h / 2 - 6);
                    ctx.arc(this.x + this.w - cylinder / 2, this.y + cylinder / 2, cylinder / 2, Math.PI / 2, 3 * Math.PI / 2, true);
                    ctx.closePath();
                }
                // Bottom Cylinder
                ctx.moveTo(this.x + leftEnd + 3 + cylinder / 2, this.y + center + 6);
                ctx.arc(this.x + leftEnd + 3 + cylinder / 2, this.y + center + 6 + cylinder / 2, cylinder / 2, 3 * Math.PI / 2, Math.PI / 2, true);
                ctx.lineTo(this.x + this.w - cylinder / 2, this.y + this.h);
                ctx.arc(this.x + this.w - cylinder / 2, this.y + center + 6 + cylinder / 2, cylinder / 2, Math.PI / 2, 3 * Math.PI / 2, true);
                ctx.closePath();

                ctx.fill();
                ctx.stroke();

            } else if (shape.weapon.isFlamethrower()) {
                textOffsetY = 13;
                nameOffset = (this.weapon.abbv.length >= 4 ? 10 : 15) + (backRotation ? 45 : 0);
                dpStartX = 4;
                dpStartY = 23;
                dpEndX = 42;
                dpEndY = this.h - 42;
                dpWidth = 15;
                dpHeight = 15;
                if (dims.cols * dpWidth > this.w - dpStartX - dpEndX - 3) dpWidth = Math.floor((this.w - dpStartX - dpEndX - 3) / dims.cols);
                if (dims.rows * dpHeight > this.h - dpStartY - dpEndY - 3) dpHeight = Math.floor((this.h - dpStartY - dpEndY - 3) / dims.rows);
                barrelEnd = this.drawFullBarrel ? this.x + this.w + 30 : this.x + this.w;
                var tankHeight = (this.h - 42) / 2;
                var halfHeight = tankHeight / 2;
                // Tubing
                if (drawAmmo) {
                    ctx.moveTo(this.x + this.w - 40 + halfHeight, this.y + 40 + halfHeight);
                    ctx.lineTo(this.x + this.w - 35 + halfHeight, this.y + 40 + halfHeight);
                    ctx.lineTo(this.x + this.w - 35 + halfHeight, this.y + 36 + halfHeight);
                    ctx.lineTo(this.x + this.w - 31 + halfHeight, this.y + 36 + halfHeight);
                    ctx.lineTo(this.x + this.w - 31 + halfHeight, this.y + 48 + halfHeight);
                    ctx.lineTo(this.x + this.w - 35 + halfHeight, this.y + 48 + halfHeight);
                    ctx.lineTo(this.x + this.w - 35 + halfHeight, this.y + 44 + halfHeight);
                    ctx.lineTo(this.x + this.w - 40 + halfHeight, this.y + 44 + halfHeight);
                    ctx.closePath();
                    ctx.moveTo(this.x + this.w - 40 + halfHeight, this.y + 40 + tankHeight + halfHeight);
                    ctx.lineTo(this.x + this.w - 35 + halfHeight, this.y + 40 + tankHeight + halfHeight);
                    ctx.lineTo(this.x + this.w - 35 + halfHeight, this.y + 36 + tankHeight + halfHeight);
                    ctx.lineTo(this.x + this.w - 31 + halfHeight, this.y + 36 + tankHeight + halfHeight);
                    ctx.lineTo(this.x + this.w - 31 + halfHeight, this.y + 48 + tankHeight + halfHeight);
                    ctx.lineTo(this.x + this.w - 35 + halfHeight, this.y + 48 + tankHeight + halfHeight);
                    ctx.lineTo(this.x + this.w - 35 + halfHeight, this.y + 44 + tankHeight + halfHeight);
                    ctx.lineTo(this.x + this.w - 40 + halfHeight, this.y + 44 + tankHeight + halfHeight);
                    ctx.closePath();
                    ctx.moveTo(this.x + this.w - 35 + halfHeight, this.y + 36 + tankHeight + halfHeight);
                    ctx.lineTo(this.x + this.w - 35 + halfHeight, this.y + 48 + halfHeight);
                    ctx.lineTo(this.x + this.w - 31 + halfHeight, this.y + 48 + halfHeight);
                    ctx.lineTo(this.x + this.w - 31 + halfHeight, this.y + 36 + tankHeight + halfHeight);
                    ctx.closePath();
                    ctx.moveTo(this.x + this.w - 35 + halfHeight, this.y + 36 + halfHeight);
                    ctx.quadraticCurveTo(this.x + this.w - 35 + halfHeight, this.y + 20 + halfHeight, this.x + this.w - 65, this.y + 26);
                    ctx.lineTo(this.x + this.w - 61, this.y + 26);
                    ctx.quadraticCurveTo(this.x + this.w - 31 + halfHeight, this.y + 20 + halfHeight, this.x + this.w - 31 + halfHeight, this.y + 36 + halfHeight);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                }
                // Pilot Light
                ctx.moveTo(this.x + this.w - 47, this.y + 38);
                ctx.lineTo(barrelEnd - 5, this.y + 38);
                ctx.lineTo(barrelEnd - 3, this.y + 35);
                ctx.lineTo(barrelEnd, this.y + 37);
                ctx.lineTo(barrelEnd - 3, this.y + 41);
                ctx.lineTo(this.x + this.w - 47, this.y + 41);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // Basic Body
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + 20);
                ctx.lineTo(this.x + 5, this.y + 15);
                ctx.lineTo(this.x + 15, this.y + 15);
                ctx.lineTo(this.x + 20, this.y + 20);
                ctx.lineTo(this.x + this.w - 60, this.y + 20);
                ctx.lineTo(this.x + this.w - 55, this.y + 15);
                ctx.lineTo(this.x + this.w - 40, this.y + 15);
                ctx.lineTo(this.x + this.w - 30, this.y + 23); // top of rear barrel
                ctx.lineTo(this.x + this.w - 17, this.y + 23);
                ctx.lineTo(this.x + this.w - 15, this.y + 25); // top of mid barrel
                ctx.lineTo(this.x + this.w - 15, this.y + 35);
                ctx.lineTo(this.x + this.w - 17, this.y + 37);
                ctx.lineTo(this.x + this.w - 20, this.y + 37);
                ctx.lineTo(this.x + this.w - 32, this.y + 45);
                ctx.lineTo(this.x + this.w - 35, this.y + 45);
                ctx.lineTo(this.x + this.w - 38, this.y + 42);
                ctx.lineTo(this.x + 15, this.y + 42);
                ctx.lineTo(this.x + 12, this.y + 45);
                ctx.lineTo(this.x + 5, this.y + 45);
                ctx.lineTo(this.x, this.y + 40);
                ctx.closePath();
                // Extended Barrel
                ctx.moveTo(this.x + this.w - 15, this.y + 25);
                ctx.lineTo(barrelEnd - 12, this.y + 25);
                ctx.lineTo(barrelEnd - 12, this.y + 35);
                ctx.lineTo(this.x + this.w - 15, this.y + 35);
                ctx.closePath();
                ctx.moveTo(barrelEnd - 12, this.y + 25);
                ctx.lineTo(barrelEnd - 10, this.y + 24);
                ctx.lineTo(barrelEnd - 4, this.y + 26);
                ctx.lineTo(barrelEnd - 4, this.y + 34);
                ctx.lineTo(barrelEnd - 10, this.y + 36);
                ctx.lineTo(barrelEnd - 12, this.y + 35);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // Heat Shield
                ctx.beginPath();
                ctx.moveTo(this.x + this.w - 50, this.y + 13);
                ctx.lineTo(this.x + this.w - 35, this.y + 8);
                ctx.lineTo(this.x + this.w - 20, this.y + 18);
                ctx.lineTo(this.x + this.w - 25, this.y + 23);
                ctx.lineTo(this.x + this.w - 25, this.y + 40);
                ctx.lineTo(this.x + this.w - 30, this.y + 40);
                ctx.lineTo(this.x + this.w - 42, this.y + 18);
                ctx.lineTo(this.x + this.w - 47, this.y + 18);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // Tanks
                if (drawAmmo) {
                    ctx.beginPath();
                    ctx.moveTo(this.x + 15, this.y + 42);
                    ctx.lineTo(this.x + this.w - 38, this.y + 42);
                    ctx.arc(this.x + this.w - 38, this.y + 42 + halfHeight, halfHeight, 3 * Math.PI / 2, Math.PI / 2, false);
                    ctx.arc(this.x + this.w - 38, this.y + 42 + tankHeight + halfHeight, halfHeight, 3 * Math.PI / 2, Math.PI / 2, false);
                    ctx.lineTo(this.x + 15, this.y + this.h);
                    ctx.arc(this.x + 15, this.y + 42 + tankHeight + halfHeight, halfHeight, Math.PI / 2, 3 * Math.PI / 2, false);
                    ctx.arc(this.x + 15, this.y + 42 + halfHeight, halfHeight, Math.PI / 2, 3 * Math.PI / 2, false);

                    if (shape.rotation === 'Front' || /Turret/.test(shape.rotation)) {
                        ammoStartX = this.x + 5;
                    } else if (shape.rotation === 'Back') {
                        ammoStartX = this.x + 28;
                    } else if (shape.rotation === 'Left' || shape.rotation === 'LeftBack') {
                        ammoStartX = this.x + 45;
                        ammoStartY = this.y + 50;
                    } else if (shape.rotation === 'Right' || shape.rotation === 'RightBack') {
                        ammoStartX = this.x + 3;
                        ammoStartY = this.y + 30;
                    }

                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            } else if (shape.weapon.isLargeBore()) {
                nameOffset = 37;
                if (shape.weapon.abbv.length > 3) nameOffset -= 8;
                // Main body of weapon
                ctx.moveTo(this.x + 5, this.y + 19);
                ctx.lineTo(this.x + 5, this.y + 7);
                ctx.lineTo(this.x, this.y + 4);
                ctx.lineTo(this.x, this.y + 2);
                ctx.lineTo(this.x + 2, this.y);
                ctx.lineTo(this.x + 8, this.y);
                ctx.lineTo(this.x + 15, this.y + 7);
                ctx.lineTo(this.x + 17, this.y + 2);
                ctx.lineTo(this.x + 35, this.y + 2);
                ctx.lineTo(this.x + 37, this.y);
                ctx.lineTo(this.x + 45, this.y);
                ctx.lineTo(this.x + 50, this.y + 5);
                ctx.lineTo(this.x + 60, this.y + 5);
                ctx.lineTo(this.x + 62, this.y + 7);
                ctx.lineTo(this.x + 70, this.y + 7);
                if (this.drawFullBarrel) {
                    ctx.lineTo(this.x + this.w + 40, this.y + 7);
                    ctx.lineTo(this.x + this.w + 41, this.y + 9);
                    ctx.lineTo(this.x + this.w + 50, this.y + 7);
                    ctx.lineTo(this.x + this.w + 50, this.y + 19);
                    ctx.lineTo(this.x + this.w + 41, this.y + 17);
                    ctx.lineTo(this.x + this.w + 40, this.y + 19);
                    ctx.lineTo(this.x + this.w - 10, this.y + 19);
                } else {
                    ctx.lineTo(this.x + this.w - 10, this.y + 7);
                    ctx.lineTo(this.x + this.w - 9, this.y + 9);
                    ctx.lineTo(this.x + this.w, this.y + 7);
                    ctx.lineTo(this.x + this.w, this.y + 19);
                    ctx.lineTo(this.x + this.w - 9, this.y + 17);
                    ctx.lineTo(this.x + this.w - 10, this.y + 19);
                }
                ctx.lineTo(this.x + this.w - 11, this.y + 24);
                ctx.lineTo(this.x + this.w - 15, this.y + 22);
                ctx.lineTo(this.x + this.w - 16, this.y + 20);
                ctx.lineTo(this.x + this.w - 19, this.y + 20);
                ctx.lineTo(this.x + this.w - 20, this.y + 25);
                // Bottom of weapon + DP
                ctx.lineTo(this.x + this.w - 20, this.y + dpStartY + dims.rows * dpHeight + 3);
                ctx.lineTo(this.x + 20, this.y + dpStartY + dims.rows * dpHeight + 3);
                ctx.lineTo(this.x + 20, this.y + 25);
                ctx.lineTo(this.x + 15, this.y + 19);
                // Bottom fin
                ctx.lineTo(this.x + 8, this.y + 26);
                ctx.lineTo(this.x + 2, this.y + 26);
                ctx.lineTo(this.x, this.y + 24);
                ctx.lineTo(this.x, this.y + 22);
                ctx.closePath();
                // Cutout
                ctx.moveTo(this.x + 18, this.y + 10);
                ctx.lineTo(this.x + 37, this.y + 10);
                ctx.lineTo(this.x + 35, this.y + 7);
                ctx.lineTo(this.x + 35, this.y + 5);
                ctx.lineTo(this.x + 20, this.y + 5);
                ctx.closePath();
                // Accents
                var end = this.drawFullBarrel ? this.x + this.w + 30 : this.x + this.w - 12;
                ctx.moveTo(this.x + 70, this.y + 7);
                ctx.lineTo(end, this.y + 7);
                ctx.lineTo(end, this.y + 15);
                ctx.lineTo(this.x + 73, this.y + 15);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // TODO: Why do these blend sometimes but not always?!?
                ctx.strokeRect(this.x + 70, this.y + 9, end - this.x - 70, 0);
                ctx.strokeRect(this.x + 71, this.y + 11, end - this.x - 71, 0);
                ctx.strokeRect(this.x + 72, this.y + 13, end - this.x - 72, 0);
                // Ammo area
                if (drawAmmo) {
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.w - 20, this.y + dpStartY + dims.rows * dpHeight + 3);
                    ctx.lineTo(this.x + 20, this.y + dpStartY + dims.rows * dpHeight + 3);
                    for (i = dpStartY + dims.rows * dpHeight + 3; i <= this.h - 11; i += 10) {
                        ctx.lineTo(this.x + 18, this.y + i + 2);
                        ctx.lineTo(this.x + 13, this.y + i);
                        ctx.lineTo(this.x + 10, this.y + i);
                        ctx.lineTo(this.x + 15, this.y + i + 5);
                        ctx.lineTo(this.x + 10, this.y + i + 10);
                        ctx.lineTo(this.x + 13, this.y + i + 10);
                        ctx.lineTo(this.x + 18, this.y + i + 8);
                        ctx.lineTo(this.x + 20, this.y + i + 10);
                    }
                    ctx.lineTo(this.x + 20, this.y + this.h);
                    ctx.lineTo(this.x + this.w - 20, this.y + this.h);
                    ctx.moveTo(this.x + this.w - 20, this.y + dpStartY + dims.rows * dpHeight + 3);
                    for (i = dpStartY + dims.rows * dpHeight + 3; i <= this.h - 11; i += 10) {
                        ctx.lineTo(this.x + this.w - 20, this.y + i + 2);
                        ctx.lineTo(this.x + this.w - 17, this.y + i + 2);
                        ctx.lineTo(this.x + this.w - 15, this.y + i);
                        ctx.lineTo(this.x + this.w, this.y + i + 5);
                        ctx.lineTo(this.x + this.w - 15, this.y + i + 10);
                        ctx.lineTo(this.x + this.w - 17, this.y + i + 8);
                        ctx.lineTo(this.x + this.w - 20, this.y + i + 8);
                    }
                    ctx.lineTo(this.x + this.w - 20, this.y + this.h);
                    ctx.fill();
                    ctx.stroke();
                }
                // DP
            } else { // Small-bore projectile Weapons
                nameOffset = 20;
                // Main body of weapon
                ctx.moveTo(this.x, this.y + 30);
                ctx.lineTo(this.x, this.y + 7);
                ctx.lineTo(this.x + 7, this.y + 7);
                ctx.bezierCurveTo(this.x + 7, this.y, this.x + 12, this.y, this.x + 21, this.y + 7);
                ctx.lineTo(this.x + 26, this.y + 7);
                ctx.lineTo(this.x + 26, this.y + 2);
                ctx.lineTo(this.x + 31, this.y + 2);
                ctx.lineTo(this.x + 31, this.y + 7);
                ctx.lineTo(this.x + 36, this.y + 7);
                ctx.lineTo(this.x + 36, this.y + 2);
                ctx.lineTo(this.x + 41, this.y + 2);
                ctx.lineTo(this.x + 41, this.y + 7);
                ctx.lineTo(this.x + 46, this.y + 7);
                ctx.lineTo(this.x + 46, this.y + 2);
                ctx.lineTo(this.x + 51, this.y + 2);
                ctx.lineTo(this.x + 51, this.y + 7);
                ctx.lineTo(this.x + 56, this.y + 7);
                ctx.lineTo(this.x + 56, this.y + 2);
                ctx.lineTo(this.x + 61, this.y + 2);
                ctx.lineTo(this.x + 61, this.y + 7);
                ctx.lineTo(this.x + this.w, this.y + 7);
                ctx.lineTo(this.x + this.w - 10, this.y + 10);
                ctx.lineTo(this.x + this.w - 10, this.y + 20);
                ctx.quadraticCurveTo(this.x + this.w - 10, this.y + 25, this.x + this.w - 20, this.y + 25);
                // Bottom of Weapon + DP
                ctx.lineTo(this.x + this.w - 20, this.y + dpStartY + dims.rows * dpHeight + 3);
                ctx.lineTo(this.x + 20, this.y + dpStartY + dims.rows * dpHeight + 3);
                ctx.lineTo(this.x + 20, this.y + 25);

                ctx.lineTo(this.x + 16, this.y + 25);
                ctx.lineTo(this.x + 16, this.y + 20);
                ctx.lineTo(this.x + 11, this.y + 20);
                ctx.closePath();
                // Inner Barrel
                ctx.moveTo(this.x + this.w - 10, this.y + 12);
                if (!this.drawFullBarrel) {
                    ctx.lineTo(this.x + this.w, this.y + 12);
                    ctx.lineTo(this.x + this.w, this.y + 18);
                    ctx.lineTo(this.x + this.w - 10, this.y + 18);
                } else {
                    ctx.lineTo(this.x + this.w + 5, this.y + 12);
                    // Venting Assembly
                    ctx.lineTo(this.x + this.w + 5, this.y + 7);
                    ctx.lineTo(this.x + this.w + 40, this.y + 7);
                    ctx.lineTo(this.x + this.w + 40, this.y + 23);
                    ctx.lineTo(this.x + this.w + 5, this.y + 23);
                    ctx.lineTo(this.x + this.w + 5, this.y + 18);
                    ctx.lineTo(this.x + this.w - 10, this.y + 18);
                    //                ctx.fill();
                    // Vents
                    ctx.moveTo(this.x + this.w + 8, this.y + 19);
                    ctx.lineTo(this.x + this.w + 16, this.y + 11);
                    ctx.arc(this.x + this.w + 19, this.y + 11, 3, Math.PI, 2 * Math.PI, false);
                    ctx.lineTo(this.x + this.w + 14, this.y + 19);
                    ctx.arc(this.x + this.w + 11, this.y + 19, 3, 0, Math.PI, false);
                    ctx.moveTo(this.x + this.w + 16, this.y + 19);
                    ctx.lineTo(this.x + this.w + 24, this.y + 11);
                    ctx.arc(this.x + this.w + 27, this.y + 11, 3, Math.PI, 2 * Math.PI, false);
                    ctx.lineTo(this.x + this.w + 22, this.y + 19);
                    ctx.arc(this.x + this.w + 19, this.y + 19, 3, 0, Math.PI, false);
                    ctx.moveTo(this.x + this.w + 24, this.y + 19);
                    ctx.lineTo(this.x + this.w + 32, this.y + 11);
                    ctx.arc(this.x + this.w + 35, this.y + 11, 3, Math.PI, 2 * Math.PI, false);
                    ctx.lineTo(this.x + this.w + 30, this.y + 19);
                    ctx.arc(this.x + this.w + 27, this.y + 19, 3, 0, Math.PI, false);
                    // Outer Barrel
                    ctx.moveTo(this.x + this.w + 5, this.y + 18);
                    ctx.lineTo(this.x + this.w + 5, this.y + 12);
                    ctx.moveTo(this.x + this.w + 40, this.y + 12);
                    ctx.lineTo(this.x + this.w + 50, this.y + 12);
                    ctx.lineTo(this.x + this.w + 50, this.y + 10);
                    ctx.lineTo(this.x + this.w + 60, this.y + 10);
                    ctx.lineTo(this.x + this.w + 60, this.y + 20);
                    ctx.lineTo(this.x + this.w + 50, this.y + 20);
                    ctx.lineTo(this.x + this.w + 50, this.y + 18);
                    ctx.lineTo(this.x + this.w + 40, this.y + 18);
                    ctx.moveTo(this.x + this.w + 57, this.y + 15);
                    ctx.arc(this.x + this.w + 55, this.y + 15, 2, 0, 2 * Math.PI, true);
                }
                ctx.fill();
                ctx.stroke();
                // Ammo
                if (drawAmmo) {
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.w - 20, this.y + dpStartY + dims.rows * dpHeight + 3);
                    ctx.lineTo(this.x + 20, this.y + dpStartY + dims.rows * dpHeight + 3);
                    for (i = dpStartY + dims.rows * dpHeight + 3; i <= this.h - 6;) {
                        ctx.lineTo(this.x + 20, this.y + i + 1);
                        ctx.lineTo(this.x + 10, this.y + i + 1);
                        ctx.lineTo(this.x + 10, this.y + i);
                        ctx.lineTo(this.x + 8, this.y + i);
                        i += 6;
                        ctx.lineTo(this.x + 8, this.y + i);
                        ctx.lineTo(this.x + 10, this.y + i);
                        ctx.lineTo(this.x + 10, this.y + i - 1);
                        ctx.lineTo(this.x + 20, this.y + i - 1);
                    }
                    ctx.lineTo(this.x + 20, this.y + this.h);
                    ctx.lineTo(this.x + this.w - 20, this.y + this.h);
                    ctx.moveTo(this.x + this.w - 20, this.y + dpStartY + dims.rows * dpHeight + 3);
                    for (i = dpStartY + dims.rows * dpHeight + 3; i <= this.h - 6;) {
                        ctx.quadraticCurveTo(this.x + this.w - 13, this.y + i, this.x + this.w, this.y + i + 3);
                        i += 6;
                        ctx.quadraticCurveTo(this.x + this.w - 13, this.y + i, this.x + this.w - 20, this.y + i);
                    }
                    ctx.lineTo(this.x + this.w - 20, this.y + this.h);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            // DP
            ctx.strokeStyle = CWD.mainStroke;
            ctx.fillStyle = CWD.dpFill;
            CWD.drawDP(ctx, this.x + dpStartX, this.y + dpStartY, dpWidth, dpHeight, dp, dims, this.damage);
            if (backRotation) { // Name is not reversed for back weapons
                ctx.setTransform.apply(ctx, CWD.globalTransform);
            }
            // Name
            ctx.font = '15px sans-serif';
            ctx.strokeStyle = CWD.mainStroke;
            ctx.fillStyle = CWD.mainStroke;
            ctx.fillText(weapon.abbv + (this.singleShotRocket && (this.weapon.ammoTotal() > 1 || (this.combineAllRockets && this.weapon.count > 1)) ? "s" : ""), this.x + nameOffset, this.y + textOffsetY);
            if (shape.rotation === 'Left' || shape.rotation === 'Right' || shape.rotation === 'LeftBack' || shape.rotation === 'RightBack') { // Ammo count is not rotated for side weapons
                ctx.setTransform.apply(ctx, CWD.globalTransform);
            }
            // Ammo Count
            if (drawAmmo && (weapon.fake || weapon.totalCapacity() > 0)) {
                ctx.fillStyle = CWD.mainStroke;
                if (shape.rotation === 'Front' || shape.rotation === 'Back' || /Turret/.test(shape.rotation)) {
                    if (!ammoStartX) ammoStartX = this.x + dpStartX + 2;
                    if (!ammoStartY) ammoStartY = this.y + dpStartY + dims.rows * dpHeight + 20;
                    ctx.fillText(weapon.fake ? 'Fake' : weapon.ammoTotal() + ":", ammoStartX, ammoStartY);
                } else if (shape.rotation === 'Left' || shape.rotation === 'LeftBack') {
                    if (!ammoStartX) ammoStartX = this.x + dpStartY + dims.rows * dpHeight + 5;
                    if (!ammoStartY) ammoStartY = this.y + 37;
                    ctx.fillText(weapon.fake ? 'Fake' : weapon.ammoTotal() + ":", ammoStartX, ammoStartY);
                } else if (shape.rotation === 'Right' || shape.rotation === 'RightBack') {
                    if (!ammoStartX) ammoStartX = this.x + 2;
                    if (!ammoStartY) ammoStartY = this.y + 37;
                    ctx.fillText(weapon.fake ? 'Fake' : weapon.ammoTotal() + ":", ammoStartX, ammoStartY);
                }
                var used = this.totalAmmoUsed();
                if (!this.fake && used > 0) {
                    ctx.fillStyle = 'black';
                    ctx.strokeStyle = 'black';
                    var width = ctx.measureText(weapon.ammoTotal() + ":").width;
                    ctx.beginPath();
                    ctx.moveTo(ammoStartX, ammoStartY);
                    ctx.lineTo(ammoStartX + width - 2, ammoStartY - 11);
                    ctx.stroke();
                    ctx.fillText(weapon.ammoTotal() - used, ammoStartX + width + 3, ammoStartY);
                }
            }


            // TODO: Other weapon types???
        };

        return shape;
    };

    CWD.createAccessoryShape = function (item, hoverText, hoverLink) {
        var shape = CWD.createShape(hoverText, hoverLink);
        shape.item = item;
        shape.minRowHeight = 2;
        shape.damage = 0;
        shape.type = 'Accessory';

        shape.draw = function (ctx, borderColor) {
            var nameX, nameY, dpX, dpY;
            var dpWidth = 15, dpHeight = 15, dpMaxX = this.w - 10, dpMaxY = this.h - 30;
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;
            ctx.beginPath();
            if (this.item.type === 'Tire' && false) {
                ctx.moveTo(this.x + this.w, this.y + this.h / 2);
                ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, 0, Math.PI * 2, false);
                ctx.moveTo(this.x + this.w - 13, this.y + this.h / 2);
                ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2 - 13, 0, Math.PI * 2, true);
                ctx.moveTo(this.x + this.w / 2 + 5, this.y + 17);
                ctx.bezierCurveTo(this.x + this.w / 2 + 6, this.y + 35,
                        this.x + this.w - 36, this.y + this.h / 2 - 7,
                        this.x + this.w - 20, this.y + this.h / 2 - 15);
                ctx.bezierCurveTo(this.x + this.w - 24, this.y + this.h / 2 - 23,
                        this.x + this.w / 2 + 15, this.y + 19,
                        this.x + this.w / 2 + 5, this.y + 17);

                ctx.moveTo(this.x + this.w - 16, this.y + this.h / 2 - 7);
                ctx.bezierCurveTo(this.x + this.w - 32, this.y + this.h / 2 - 3,
                        this.x + this.w - 36, this.y + this.h - 41,
                        this.x + this.w - 26, this.y + this.h - 26);
                ctx.bezierCurveTo(this.x + this.w - 17, this.y + this.h - 34,
                        this.x + this.w - 16, this.y + this.h / 2 + 8,
                        this.x + this.w - 16, this.y + this.h / 2 - 7);

                ctx.fill();
                ctx.stroke();
                nameX = this.x + this.w / 2 - 10 - 1000;
                nameY = this.y + this.h / 2 - 5;
                dpX = this.x + this.w / 2 - 10 - 1000;
                dpY = this.y + this.h / 2;
                dpWidth = 10;
                dpHeight = 10;
                dpMaxX = 20;
                dpMaxY = 20;
            } else {
                // Boring box
                ctx.moveTo(this.x + this.w / 2, this.y);
                ctx.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + 10, 7);
                ctx.lineTo(this.x + this.w, this.y + this.h / 2);
                ctx.arcTo(this.x + this.w, this.y + this.h, this.x + this.w - 10, this.y + this.h, 7);
                ctx.lineTo(this.x + this.w / 2, this.y + this.h);
                ctx.arcTo(this.x, this.y + this.h, this.x, this.y + this.h - 10, 7);
                ctx.lineTo(this.x, this.y + this.h / 2);
                ctx.arcTo(this.x, this.y, this.x + 10, this.y, 7);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                nameX = this.x + 5;
                nameY = this.y + 20;
                dpX = this.x + 5;
                dpY = this.y + 25;
            }
            // Name
            ctx.font = '15px sans-serif';
            ctx.fillStyle = CWD.mainStroke;
            ctx.fillText(item.abbv, nameX, nameY);
            ctx.strokeStyle = CWD.mainStroke;
            ctx.fillStyle = CWD.dpFill;
            // DP
            var dims = CWD.dpDimensions(item.singleItemDP());
            if (dpWidth * dims.cols > dpMaxX) dpWidth = Math.floor(dpMaxX / dims.cols);
            if (dpHeight * dims.rows > dpMaxY) dpHeight = Math.floor(dpMaxY / dims.rows);
            CWD.drawDP(ctx, dpX, dpY, dpWidth, dpHeight, item.singleItemDP(), dims, this.damage);
        };

        return shape;
    };

    CWD.createWheelhubShape = function (wheelArmor, hoverText, hoverLink, isLeft) {
        var shape = CWD.createShape(hoverText, hoverLink);
        shape.wheelArmor = wheelArmor;
        shape.damage = 0;

        shape.draw = function (ctx, borderColor) {
            var dp = 0;
            if(shape.wheelArmor.plasticType) dp = shape.wheelArmor.plasticPoints;
            else if(shape.wheelArmor.metalType) dp = shape.wheelArmor.metalPoints;
            var dpWidth = 8;
            if (dpWidth * dp > this.w - 30) dpWidth = Math.floor((this.w - 30) / dp);
            var dpStart = this.x + this.w / 2 - dpWidth * dp / 2;
            if (isLeft) {
                ctx.beginPath();
                ctx.strokeStyle = borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.moveTo(this.x + 5, this.y + this.h);
                // Side close to tire
                ctx.quadraticCurveTo(this.x + 5, this.y + this.h - 5, this.x + this.w / 2, this.y + this.h - 5);
                ctx.quadraticCurveTo(this.x + this.w - 5, this.y + this.h - 5, this.x + this.w - 5, this.y + this.h);
                // Side away from tire
                ctx.quadraticCurveTo(this.x + this.w + 5, this.y, this.x + this.w / 2, this.y);
                ctx.quadraticCurveTo(this.x - 5, this.y, this.x + 5, this.y + this.h);
                ctx.fill();
                ctx.stroke();
                if (!shape.wheelArmor.fake && dp > 0) {
                    ctx.fillStyle = CWD.dpFill;
                    ctx.strokeStyle = CWD.mainStroke;
                    CWD.drawDP(ctx, dpStart, this.y + 2, dpWidth, this.h - 7, dp, {rows: 1, cols: dp}, this.damage);
                }
            } else {
                ctx.beginPath();
                ctx.strokeStyle = borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.moveTo(this.x + 5, this.y);
                // Side close to tire
                ctx.quadraticCurveTo(this.x + 5, this.y + 5, this.x + this.w / 2, this.y + 5);
                ctx.quadraticCurveTo(this.x + this.w - 5, this.y + 5, this.x + this.w - 5, this.y);
                // Side away from tire
                ctx.quadraticCurveTo(this.x + this.w + 5, this.y + this.h, this.x + this.w / 2, this.y + this.h);
                ctx.quadraticCurveTo(this.x - 5, this.y + this.h, this.x + 5, this.y);
                ctx.fill();
                ctx.stroke();
                if (!shape.wheelArmor.fake && dp > 0) {
                    ctx.fillStyle = CWD.dpFill;
                    ctx.strokeStyle = CWD.mainStroke;
                    CWD.drawDP(ctx, dpStart, this.y + 5, dpWidth, this.h - 7, dp, {rows: 1, cols: dp}, this.damage);
                }
            }
        };

        return shape;
    };

    CWD.createWheelguardShape = function (wheelArmor, hoverText, hoverLink, isLeft) {
        var shape = CWD.createShape(hoverText, hoverLink);
        shape.wheelArmor = wheelArmor;
        shape.damage = 0;

        shape.draw = function (ctx, borderColor) {
            var dp = 0;
            if(shape.wheelArmor.plasticType) dp = shape.wheelArmor.plasticPoints;
            else if(shape.wheelArmor.metalType) dp = shape.wheelArmor.metalPoints;
            var dpWidth = 8;
            if (dpWidth * dp > this.w - 30) dpWidth = Math.floor((this.w - 30) / dp);
            var dpStart = this.x + this.w / 2 - dpWidth * dp / 2;
            if (isLeft) {
                ctx.beginPath();
                ctx.strokeStyle = borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.moveTo(this.x - 10, this.y + this.h + 20);
                // Side close to tire
                ctx.quadraticCurveTo(this.x - 10, this.y + this.h - 10, this.x + this.w / 2, this.y + this.h - 4);
                ctx.quadraticCurveTo(this.x + this.w + 10, this.y + this.h - 10, this.x + this.w + 10, this.y + this.h + 20);
                // Side away from tire
                ctx.quadraticCurveTo(this.x + this.w + 15, this.y - 3, this.x + this.w / 2, this.y);
                ctx.quadraticCurveTo(this.x - 15, this.y - 3, this.x - 10, this.y + this.h + 20);
                ctx.fill();
                ctx.stroke();
                if (!shape.wheelArmor.fake && dp > 0) {
                    ctx.fillStyle = CWD.dpFill;
                    ctx.strokeStyle = CWD.mainStroke;
                    CWD.drawDP(ctx, dpStart, this.y + 2, dpWidth, this.h - 7, dp, {rows: 1, cols: dp}, this.damage);
                }
            } else {
                ctx.beginPath();
                ctx.strokeStyle = borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.moveTo(this.x - 10, this.y - 20);
                // Side close to tire
                ctx.quadraticCurveTo(this.x - 10, this.y + 10, this.x + this.w / 2, this.y + 4);
                ctx.quadraticCurveTo(this.x + this.w + 10, this.y + 10, this.x + this.w + 10, this.y - 20);
                // Side away from tire
                ctx.quadraticCurveTo(this.x + this.w + 15, this.y + this.h + 3, this.x + this.w / 2, this.y + this.h);
                ctx.quadraticCurveTo(this.x - 15, this.y + this.h + 3, this.x - 10, this.y - 20);
                ctx.fill();
                ctx.stroke();
                if (!shape.wheelArmor.fake && dp > 0) {
                    ctx.fillStyle = CWD.dpFill;
                    ctx.strokeStyle = CWD.mainStroke;
                    CWD.drawDP(ctx, dpStart, this.y + 5, dpWidth, this.h - 7, dp, {rows: 1, cols: dp}, this.damage);
                }
            }
        };

        return shape;
    };

    CWD.createComponentArmorShape = function (armor, hoverText, hoverLink) {
//        var shape = CWD.createShape(hoverText, hoverLink);
        var shape = CWD.createShape();
        shape.armor = armor;
        shape.weapon = (armor.item.type === 'Weapon' ? armor.item : null);
        shape.topText = false;
        shape.rotated = false;
        shape.damage = 0;

        shape.update = function (armor) {
            shape.armor = armor;
            shape.weapon = (armor.item.type === 'Weapon' ? armor.item : null);
        };

        shape.draw = function (ctx, borderColor) {
            var i, height = this.h, width = this.w;
            ctx.strokeStyle = borderColor;
            ctx.strokeRect(this.x, this.y, width, height);

            ctx.fillStyle = CWD.mainStroke;
            ctx.font = '15px sans-serif';
            ctx.fillText("CA", shape.x + 2, shape.y + (shape.topText ? 13 : height - 2));

            ctx.fillStyle = CWD.dpFill;
            ctx.strokeStyle = CWD.mainStroke;
            if (this.weapon && this.rotated && this.w < 28 + this.armor.totalDP() * 7) { // Mainly 4+ single-shot rockets
                for (i = 0; i < Math.min(5, shape.armor.totalDP()); i++) {
                    ctx.fillRect(this.x + 26 + i * 6, this.y + (shape.topText ? 2 : height - 14), 6, 6);
                    ctx.strokeRect(this.x + 26 + i * 6, this.y + (shape.topText ? 2 : height - 14), 6, 6);
                }
                for (i = 0; i < shape.armor.totalDP() - 5; i++) {
                    ctx.fillRect(this.x + 26 + i * 6, this.y + (shape.topText ? 8 : height - 8), 6, 6);
                    ctx.strokeRect(this.x + 26 + i * 6, this.y + (shape.topText ? 8 : height - 8), 6, 6);
                }
            } else {
                for (i = 0; i < shape.armor.totalDP(); i++) {
                    ctx.fillRect(this.x + 26 + i * 7, this.y + (shape.topText ? 3 : height - 10), 7, 7);
                    ctx.strokeRect(this.x + 26 + i * 7, this.y + (shape.topText ? 3 : height - 10), 7, 7);
                }
            }
        };

        return shape;
    };

    CWD.createDischargerShape = function (weapon, location) {
        var name = weapon.name + " " + weapon.displayLocation;
        if (name.length > 29) name = weapon.abbv + " " + weapon.displayLocation;
        var shape = CWD.createShape(name, "edit" + location + "Weapons");
        shape.weapon = weapon;
        shape.location = location;
        shape.type = 'Discharger';
        shape.destroyed = false;

        shape.draw = function (ctx, borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;
            ctx.beginPath();
            if (location === 'Left') {
                ctx.moveTo(this.x, this.y + this.h);
                ctx.arcTo(this.x, this.y, this.x + this.w / 2, this.y, 7);
                ctx.lineTo(this.x + this.w / 2, this.y);
                ctx.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h / 2, 7);
                ctx.lineTo(this.x + this.w, this.y + this.h);
                ctx.closePath();
            } else if (location === 'Right') {
                ctx.moveTo(this.x + this.w, this.y);
                ctx.arcTo(this.x + this.w, this.y + this.h, this.x + this.w / 2, this.y + this.h, 7);
                ctx.lineTo(this.x + this.w / 2, this.y + this.h);
                ctx.arcTo(this.x, this.y + this.h, this.x, this.y + this.h / 2, 7);
                ctx.lineTo(this.x, this.y);
                ctx.closePath();
            } else if (location === 'Front') {
                ctx.moveTo(this.x, this.y);
                ctx.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h / 2, 7);
                ctx.lineTo(this.x + this.w, this.y + this.h / 2);
                ctx.arcTo(this.x + this.w, this.y + this.h, this.x + this.w / 2, this.y + this.h, 7);
                ctx.lineTo(this.x, this.y + this.h);
                ctx.closePath();
            } else if (location === 'Back' || location === 'Top' || location === 'Underbody') {
                ctx.moveTo(this.x + this.w, this.y + this.h);
                ctx.arcTo(this.x, this.y + this.h, this.x, this.y + this.h / 2, 7);
                ctx.lineTo(this.x, this.y + this.h / 2);
                ctx.arcTo(this.x, this.y, this.x + this.w / 2, this.y, 7);
                ctx.lineTo(this.x + this.w, this.y);
                ctx.closePath();
            }
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = CWD.mainStroke;
            ctx.font = '15px sans-serif';
            if (location === 'Front' || location === 'Back' || location === 'Top' || location === 'Underbody') {
                ctx.transform(0, 1, -1, 0, shape.y + shape.x + shape.h, shape.y - shape.x);
            }
            ctx.fillText(shape.weapon.abbv, shape.x + 2, shape.y + shape.h - 2);
            if (location === 'Front' || location === 'Back' || location === 'Top' || location === 'Underbody') {
                ctx.setTransform.apply(ctx, CWD.globalTransform);
            }

            if (this.destroyed) {
                ctx.strokeStyle = 'black';
                if (location === 'Left' || location === 'Right') {
                    ctx.moveTo(this.x + 7, this.y);
                    ctx.lineTo(this.x + this.w - 7, this.y + this.h);
                    ctx.moveTo(this.x + this.w - 7, this.y);
                    ctx.lineTo(this.x + 7, this.y + this.h);
                } else {
                    ctx.moveTo(this.x, this.y + 7);
                    ctx.lineTo(this.x + this.w, this.y + this.h - 7);
                    ctx.moveTo(this.x + this.w, this.y + 7);
                    ctx.lineTo(this.x, this.y + this.h - 7);
                }
                ctx.moveTo(-1, -1);
                ctx.closePath();
                ctx.stroke();
            }
        };

        return shape;
    };

    CWD.createEWPShape = function (ewp, isLeft) {
        var shape = CWD.createShape(ewp.name + " " + (isLeft ? "Left" : "Right"), "edit" + (isLeft ? "Left" : "Right") + "Turret");
        shape.turret = ewp;
        shape.location = isLeft ? 'leftTurret' : 'rightTurret';

        shape.draw = function (ctx, borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;
            ctx.beginPath();
            if (isLeft) {
                ctx.moveTo(this.x + this.w - 10, this.y + this.h);
                ctx.arcTo(this.x + this.w - 10, this.y + this.h - 5, this.x + this.w - 5, this.y + this.h - 5, 5);
                ctx.lineTo(this.x + this.w - 5, this.y + this.h - 5);
                ctx.arcTo(this.x + this.w, this.y + this.h - 5, this.x + this.w, this.y + this.h - 10, 5);
                ctx.lineTo(this.x + this.w, this.y + 5);
                ctx.arcTo(this.x + this.w, this.y, this.x + this.w - 5, this.y, 5);
                ctx.lineTo(this.x + this.w - 5, this.y);
                ctx.bezierCurveTo(this.x, this.y, this.x, this.y + 10, this.x - 20, this.y + 10);
                ctx.lineTo(this.x - 20, this.y + 20);
                ctx.arcTo(this.x, this.y + 20, this.x, this.y + this.h, 20);
                ctx.lineTo(this.x, this.y + this.h - 5);
                ctx.arcTo(this.x, this.y + this.h, this.x + 5, this.y + this.h, 5);
            } else {
                ctx.moveTo(this.x + this.w - 10, this.y);
                ctx.arcTo(this.x + this.w - 10, this.y + 5, this.x + this.w - 5, this.y + 5, 5);
                ctx.lineTo(this.x + this.w - 5, this.y + 5);
                ctx.arcTo(this.x + this.w, this.y + 5, this.x + this.w, this.y + 10, 5);
                ctx.lineTo(this.x + this.w, this.y + this.h - 5);
                ctx.arcTo(this.x + this.w, this.y + this.h, this.x + this.w - 5, this.y + this.h, 5);
                ctx.lineTo(this.x + this.w - 5, this.y + this.h);
                ctx.bezierCurveTo(this.x, this.y + this.h, this.x, this.y + this.h - 10, this.x - 20, this.y + this.h - 10);
                ctx.lineTo(this.x - 20, this.y + this.h - 20);
                ctx.arcTo(this.x, this.y + this.h - 20, this.x, this.y, 20);
                ctx.lineTo(this.x, this.y + 5);
                ctx.arcTo(this.x, this.y, this.x + 5, this.y, 5);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            if (this.turret.weapons.length === 0 && this.turret.boosters.length === 0) {
                ctx.font = '15px sans-serif';
                ctx.fillStyle = CWD.mainStroke;
                var name = this.turret.name;
                ctx.fillText(name, this.x + 2, this.y + this.h / 2 + 6);
            }
        };

        return shape;
    };

    CWD.createSponsonShape = function (turret, isLeft) {
        var shape = CWD.createShape(turret.name + " " + (isLeft ? "Left" : "Right"), "edit" + (isLeft ? "Left" : "Right") + "Turret");
        shape.turret = turret;
        shape.location = isLeft ? 'leftTurret' : 'rightTurret';

        shape.draw = function (ctx, borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;
            ctx.beginPath();
            var offset = Math.max(0, this.h * 2 - this.w) / 2;
            if (isLeft) {
                ctx.moveTo(this.x + this.w + offset, this.y + this.h);
                ctx.arc(this.x + this.w / 2, this.y + this.h, this.h, 0, Math.PI, true);
            } else {
                ctx.moveTo(this.x + this.w + offset, this.y);
                ctx.arc(this.x + this.w / 2, this.y, this.h, 0, Math.PI, false);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            if (this.turret.weapons.length === 0 && this.turret.boosters.length === 0) {
                ctx.font = '15px sans-serif';
                ctx.fillStyle = CWD.mainStroke;
                ctx.fillText("Sponson", this.x + 2, this.y + this.h / 2 + 6);
            }
        };

        return shape;
    };

    CWD.createBoosterShape = function (booster, isBack, link) {
        var shape = CWD.createShape("Rocket Booster", link);
        shape.booster = booster;
        shape.isBack = isBack;
        shape.minRowHeight = 1;
        shape.maxHeight = 100;

        shape.draw = function (ctx, borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = CWD.backgroundColor;
            ctx.beginPath();
            if (this.isBack) {
                ctx.moveTo(this.x + this.w * 0.85, this.y);
                ctx.quadraticCurveTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h / 2);
                ctx.quadraticCurveTo(this.x + this.w, this.y + this.h, this.x + this.w * 0.85, this.y + this.h);
                ctx.quadraticCurveTo(this.x + this.w * 0.7, this.y + this.h, this.x + this.w * 0.7, this.y + this.h / 2);
                ctx.quadraticCurveTo(this.x + this.w * 0.7, this.y, this.x + this.w * 0.85, this.y);
                ctx.lineTo(this.x + this.w * 0.3, this.y);
                ctx.quadraticCurveTo(this.x + this.w * 0.25, this.y, this.x + this.w * 0.25, this.y + this.h / 6);
                ctx.lineTo(this.x + this.w * 0.05, this.y);
                ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + this.h / 4);
                ctx.quadraticCurveTo(this.x, this.y + this.h / 2, this.x + this.w * 0.05, this.y + this.h / 2);
                ctx.lineTo(this.x + this.w * 0.25, this.y + this.h / 3);
                ctx.lineTo(this.x + this.w * 0.25, this.y + this.h * 2 / 3);
                ctx.lineTo(this.x + this.w * 0.05, this.y + this.h / 2);
                ctx.quadraticCurveTo(this.x, this.y + this.h / 2, this.x, this.y + this.h * 0.75);
                ctx.quadraticCurveTo(this.x, this.y + this.h, this.x + this.w * 0.05, this.y + this.h);
                ctx.lineTo(this.x + this.w * 0.25, this.y + this.h * 5 / 6);
                ctx.quadraticCurveTo(this.x + this.w * 0.25, this.y + this.h, this.x + this.w * 0.3, this.y + this.h);
                ctx.lineTo(this.x + this.w * 0.85, this.y + this.h);
                ctx.quadraticCurveTo(this.x + this.w * 0.7, this.y + this.h, this.x + this.w * 0.7, this.y + this.h / 2);
                ctx.quadraticCurveTo(this.x + this.w * 0.7, this.y, this.x + this.w * 0.85, this.y);
            } else {
                ctx.moveTo(this.x + this.w * 0.15, this.y);
                ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + this.h / 2);
                ctx.quadraticCurveTo(this.x, this.y + this.h, this.x + this.w * 0.15, this.y + this.h);
                ctx.quadraticCurveTo(this.x + this.w * 0.3, this.y + this.h, this.x + this.w * 0.3, this.y + this.h / 2);
                ctx.quadraticCurveTo(this.x + this.w * 0.3, this.y, this.x + this.w * 0.15, this.y);
                ctx.lineTo(this.x + this.w * 0.7, this.y);
                ctx.quadraticCurveTo(this.x + this.w * 0.75, this.y, this.x + this.w * 0.75, this.y + this.h / 6);
                ctx.lineTo(this.x + this.w * 0.95, this.y);
                ctx.quadraticCurveTo(this.x + this.w, this.y, this.x + this.w, this.y + this.h / 4);
                ctx.quadraticCurveTo(this.x + this.w, this.y + this.h / 2, this.x + this.w * 0.95, this.y + this.h / 2);
                ctx.lineTo(this.x + this.w * 0.75, this.y + this.h / 3);
                ctx.lineTo(this.x + this.w * 0.75, this.y + this.h * 2 / 3);
                ctx.lineTo(this.x + this.w * 0.95, this.y + this.h / 2);
                ctx.quadraticCurveTo(this.x + this.w, this.y + this.h / 2, this.x + this.w, this.y + this.h * 0.75);
                ctx.quadraticCurveTo(this.x + this.w, this.y + this.h, this.x + this.w * 0.95, this.y + this.h);
                ctx.lineTo(this.x + this.w * 0.75, this.y + this.h * 5 / 6);
                ctx.quadraticCurveTo(this.x + this.w * 0.75, this.y + this.h, this.x + this.w * 0.7, this.y + this.h);
                ctx.lineTo(this.x + this.w * 0.15, this.y + this.h);
                ctx.quadraticCurveTo(this.x + this.w * 0.3, this.y + this.h, this.x + this.w * 0.3, this.y + this.h / 2);
                ctx.quadraticCurveTo(this.x + this.w * 0.3, this.y, this.x + this.w * 0.15, this.y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            //        ctx.strokeRect(this.x+this.w*0.7+3, this.y+this.h/4, this.w*0.3-6, this.h/2);

            ctx.fillStyle = CWD.dpFill;
            var dpWidth = this.w * 0.3 - 6;
            var dims = CWD.dpDimensions(this.booster.totalDP());
            var dpSize = 15;
            if (dims.rows * dpSize > dpWidth) dpSize = Math.floor(dpWidth / dims.rows);
            if (dims.cols * dpSize > this.h / 2) dpSize = Math.floor(this.h / (2 * dims.cols));
            var dpLeft = this.x + this.w * (this.isBack ? 0.85 : 0.15) - (dims.rows * dpSize) / 2;
            for (var r = 0; r < dims.rows; r++) {
                for (var c = 0; c < dims.cols; c++) {
                    if (r * dims.cols + c < this.booster.totalDP()) {
                        ctx.fillRect(dpLeft + r * dpSize, this.y + this.h / 4 + c * dpSize, dpSize, dpSize);
                        ctx.strokeRect(dpLeft + r * dpSize, this.y + this.h / 4 + c * dpSize, dpSize, dpSize);
                    }
                }
            }

            ctx.font = '15px sans-serif';
            ctx.fillStyle = CWD.mainStroke;
            var name = this.booster.jumpJet ? "JJ" : "RB";
            ctx.fillText(name, this.x + this.w * 0.4, this.y + this.h / 2 + 6);

        };

        return shape;
    };

    CWD.drawDP = function (ctx, x, y, w, h, dp, dims, damage) {
        var r, c, now, ah = Math.abs(h);
        for (r = 0; r < dims.rows; r++) {
            for (c = 0; c < dims.cols; c++) {
                if (r * dims.cols + c < dp) {
                    ctx.fillRect(x + c * w, y + r * h, w, ah);
                    ctx.strokeRect(x + c * w, y + r * h, w, ah);
                }
            }
        }
        if (damage > 0) {
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            for (r = 0; r < dims.rows; r++) {
                for (c = 0; c < dims.cols; c++) {
                    now = r * dims.cols + c;
                    if (now < damage && now < dp) {
                        ctx.moveTo(x + c * w, y + r * h);
                        ctx.lineTo(x + c * w + w, y + r * h + ah);
                        ctx.moveTo(x + c * w, y + r * h + ah);
                        ctx.lineTo(x + c * w + w, y + r * h);
                    }
                }
            }
            ctx.moveTo(-1, -1);
            ctx.closePath();
            ctx.stroke();
        }
    };

    CWD.dpDimensions = function (dp) {
        var result = {};
        if (dp < 4) {
            result.rows = 1;
            result.cols = dp;
        } else if (dp === 9) {
            result.rows = 3;
            result.cols = 3;
        } else if (dp < 11) {
            result.rows = 2;
            result.cols = Math.ceil(dp / 2);
        } else if (dp < 16) {
            result.rows = 3;
            result.cols = Math.ceil(dp / 3);
        } else {
            result.rows = 4;
            result.cols = Math.ceil(dp / 4);
        }
        return result;
    };
})();