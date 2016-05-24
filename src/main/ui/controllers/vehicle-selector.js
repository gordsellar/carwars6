/* global angular, CWD */
angular.module('carwars').
    controller('VehicleSelectorCtrl', function($scope, $rootScope, vehicle, model) {
        "use strict";
        var car = vehicle.car;
        $scope.car = CWD.vehicleSelector;
        $scope.click = function(address) {
            if(!address) return;
            switch(address) {
                case "createNewCar":
                    $scope.createCar();
                    break;
                case "createNewCycle":
                    $scope.createCycle();
                    break;
                case "createNewTrike":
                    $scope.createTrike();
                    break;
                case "createNewRaceCar":
                    $scope.createRaceCar();
                    break;
                case "createNewCarTrailer":
                    $scope.createCarTrailer();
                    break;
                case "createNewTenWheeler":
                    $scope.createTenWheeler();
                    break;
                case "createNewSemiTractor":
                    $scope.createSemiTractor();
                    break;
                case "createNewSemiTrailer":
                    $scope.createSemiTrailer();
                    break;
                case "createNewBus":
                    $scope.createBus();
                    break;
                default:
                    console.log("Unexpected target: "+address);
                    return;
            }
        };
    });

(function() {
    "use strict";

    CWD.createVehicleSelectShape = function (x, y, w, h, text, body, car, hoverLink) {
        var shape = CWD.createShape(text, hoverLink);
        shape.x = x;
        shape.y = y;
        shape.w = 233.3;
        shape.h = 200;
        shape.text = text;
        shape.textX = null;
        shape.body = body;
        shape.car = car;
        shape.bodyWidth = w;
        shape.bodyHeight = h;

        shape.drawLowerBody = function (body, car, widthToBody, bodyWidth, ctx, borderColor) {
            if (body.drawLowerBody) {
                body.drawLowerBody(car, ctx, this.hoverShape, borderColor, widthToBody, bodyWidth, this.heightToBody, this.bodyHeight, false);
                ctx.strokeStyle = borderColor;
                ctx.fillStyle = CWD.backgroundColor;
                ctx.fill();
                ctx.stroke();
            }
        };

        shape.drawBody = function (body, car, widthToBody, bodyWidth, ctx, borderColor) {
            body.draw(car, ctx, this.hoverShape, borderColor, widthToBody, bodyWidth, this.heightToBody, this.bodyHeight, false);
            ctx.strokeStyle = borderColor;
            ctx.fillStyle = this.gradient;
            ctx.fill();
            ctx.stroke();
        };

        shape.drawUpperBody = function (body, car, widthToBody, bodyWidth, ctx, borderColor) {
            if (body.drawUpperAccessories)
                body.drawUpperAccessories(car, ctx, this.hoverShape, borderColor, widthToBody, bodyWidth, this.heightToBody, this.bodyHeight, false);
        };

        shape.draw = function (ctx, borderColor) {
            ctx.font = '30px sans-serif';
            if (!this.textX) {
                this.textX = this.x + this.w / 2 - ctx.measureText(this.text).width / 2;
                this.widthToBody = this.car.right ? 670 - this.bodyWidth : 350 - this.bodyWidth / 2;
                this.heightToBody = 300 - this.bodyHeight / 2;
            }
            if (!this.gradient) {
                this.gradient = ctx.createLinearGradient(this.widthToBody, this.heightToBody, this.widthToBody, this.heightToBody + this.bodyHeight);
                if (this.gradient) {
                    this.gradient.addColorStop(0, '#AA2222');
                    this.gradient.addColorStop(0.5, '#EE3030');
                    this.gradient.addColorStop(1, '#AA2222');
                } else {
                    this.gradient = 'black';
                }
            }
            ctx.strokeStyle = borderColor;
            ctx.strokeRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = borderColor;
            ctx.fillText(this.text, this.textX, this.y + this.h - 10);
            ctx.transform(0.3, 0, 0, 0.3, this.x+(this.text === 'Semi Tractor' ? 10 : 0), this.y);
            CWD.vehicleSelector.car = this.car;
            CWD.vehicleSelector.configureTires(this);
            ctx.lineWidth = 8;
            this.drawLowerBody(this.body, CWD.vehicleSelector, this.widthToBody, this.bodyWidth, ctx, borderColor);
            if (this.body === CWD.tenWheelerBody1) this.drawLowerBody(CWD.semiTrailerBody, CWD.vehicleSelector, 57, 415, ctx, borderColor);
            this.drawBody(this.body, CWD.vehicleSelector, this.widthToBody, this.bodyWidth, ctx, borderColor);
            if (this.body === CWD.tenWheelerBody1) this.drawBody(CWD.semiTrailerBody, CWD.vehicleSelector, 57, 415, ctx, borderColor);
            this.drawUpperBody(this.body, CWD.vehicleSelector, this.widthToBody, this.bodyWidth, ctx, borderColor);
            if (this.body === CWD.tenWheelerBody1) this.drawUpperBody(CWD.semiTrailerBody, CWD.vehicleSelector, 57, 415, ctx, borderColor);
            ctx.lineWidth = 1;
        };

        return shape;
    };
    CWD.selectorTire = {abbv: "PR", totalDP: function () {
        return 9;
    }};
    CWD.vehicleSelector = {
        hoverShape: null,
        selector: true,
        suppressDrawing: true,
        maximumY: 601,
        tires: {
            frontRightTire: CWD.createTireShape(CWD.selectorTire, "Front Tires", null, false, true),
            frontLeftTire: CWD.createTireShape(CWD.selectorTire, "Front Tires", null, true, true),
            backRightTire: CWD.createTireShape(CWD.selectorTire, "Back Tires", null, false, true),
            backLeftTire: CWD.createTireShape(CWD.selectorTire, "Back Tires", null, true, true),
            backRightCycleTire: CWD.createTireShape(CWD.selectorTire, "Back Tires", null, false, true),
            backLeftCycleTire: CWD.createTireShape(CWD.selectorTire, "Back Tires", null, true, true),
            frontTire: CWD.createSingleTireShape(CWD.selectorTire, "Front Tire", null, true),
            backTire: CWD.createSingleTireShape(CWD.selectorTire, "Back Tire", null, false),
            frontRightTruck: CWD.createTireShape(CWD.selectorTire, "Front Tire", null, false, true),
            frontLeftTruck: CWD.createTireShape(CWD.selectorTire, "Front Tire", null, true, true),
            backRightInner: CWD.createTireShape(CWD.selectorTire, "Back Tire", null, false, true),
            backRightOuter: CWD.createTireShape(CWD.selectorTire, "Back Tire", null, false, false),
            backLeftInner: CWD.createTireShape(CWD.selectorTire, "Back Tire", null, true, true),
            backLeftOuter: CWD.createTireShape(CWD.selectorTire, "Back Tire", null, true, false),
            middleRightInner: CWD.createTireShape(CWD.selectorTire, "Back Tire", null, false, true),
            middleRightOuter: CWD.createTireShape(CWD.selectorTire, "Back Tire", null, false, false),
            middleLeftInner: CWD.createTireShape(CWD.selectorTire, "Back Tire", null, true, true),
            middleLeftOuter: CWD.createTireShape(CWD.selectorTire, "Back Tire", null, true, false)
        },
        shapes: [
            CWD.createVehicleSelectShape(0, 0, 500, 300, "Car", CWD.carBody1, {}, "createNewCar"),
            CWD.createVehicleSelectShape(233.3, 0, 500, 250, "Cycle", CWD.cycleBody1, {}, "createNewCycle"),
            CWD.createVehicleSelectShape(466.7, 0, 500, 350, "Trike", CWD.trikeBody1, {}, "createNewTrike"),
            CWD.createVehicleSelectShape(0, 200, 500, 400, "Race Car", CWD.carBody1, {}, "createNewRaceCar"),
            CWD.createVehicleSelectShape(233.3, 200, 300, 200, "Car Trailer", CWD.carTrailerBody, {isFlatbed: function () {
                return true;
            }, hasOversizeWeaponFacings: function () {
                return false;
            }, totalTongueDP: function () {
                return 3;
            }}, "createNewCarTrailer"),
            CWD.createVehicleSelectShape(466.7, 200, 205, 300, "10-Wheeler", CWD.tenWheelerBody1, {isFlatbed: function () {
                return false;
            }, right: true}, "createNewTenWheeler"),
            CWD.createVehicleSelectShape(0, 400, 300, 300, "Semi Tractor", CWD.semiTractorBody1, {fifthWheelDP: function () {
                return 0;
            }, right: true}, "createNewSemiTractor"),
            CWD.createVehicleSelectShape(233.3, 400, 600, 200, "Semi Trailer", CWD.semiTrailerBody, {isFlatbed: function () {
                return false;
            }}, "createNewSemiTrailer"),
            CWD.createVehicleSelectShape(466.7, 400, 650, 300, "Bus", CWD.busBody1, {}, "createNewBus")
        ],
        contains: function (x, y) {
            this.hoverShape = null;
            if (x <= 233) {
                if (y < 200) this.hoverShape = this.shapes[0];
                else if (y < 400) this.hoverShape = this.shapes[3];
                else if (y <= 600) this.hoverShape = this.shapes[6];
            } else if (x < 467) {
                if (y < 200) this.hoverShape = this.shapes[1];
                else if (y < 400) this.hoverShape = this.shapes[4];
                else if (y <= 600) this.hoverShape = this.shapes[7];
            } else if (x <= 700) {
                if (y < 200) this.hoverShape = this.shapes[2];
                else if (y < 400) this.hoverShape = this.shapes[5];
                else if (y <= 600) this.hoverShape = this.shapes[8];
            }
            return this.hoverShape;
        },
        draw: function (ctx) {
            ctx.setTransform.apply(ctx, [1, 0, 0, 1, 0, 0]);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            for (var i = 0; i < this.shapes.length; i++) {
                ctx.setTransform.apply(ctx, CWD.globalTransform);
                this.shapes[i].draw(ctx, this.shapes[i] === this.hoverShape ? CWD.hoverStroke : CWD.outlineColor);
            }
        },
        configureTires: function (car) {
            this.widthToBody = car.widthToBody;
            this.bodyWidth = car.bodyWidth;
            this.heightToBody = car.heightToBody;
            this.bodyHeight = car.bodyHeight;
            if (car.text === 'Car' || car.text === 'Race Car') {
                this.frontRightTire = this.tires.frontRightTire;
                this.frontLeftTire = this.tires.frontLeftTire;
                this.backRightTire = this.tires.backRightTire;
                this.backLeftTire = this.tires.backLeftTire;
                this.middleLeftTire = null;
                this.middleRightTire = null;
                this.frontWheelhubs = [];
                this.frontWheelguards = [];
                this.backWheelhubs = [];
                this.backWheelguards = [];
                car.body.layoutTires(this);
            } else if (car.text === 'Cycle') {
                this.frontTire = this.tires.frontTire;
                this.backTire = this.tires.backTire;
                car.body.layoutTires(this);
            } else if (car.text === 'Trike') {
                this.frontTire = this.tires.frontTire;
                this.backLeftTire = this.tires.backLeftCycleTire;
                this.backRightTire = this.tires.backRightCycleTire;
                car.body.layoutTires(this);
            } else if (car.text === 'Car Trailer') {
                this.leftTires = [this.tires.backLeftTire];
                this.rightTires = [this.tires.backRightTire];
                car.body.layoutTires(this, {width: 3, height: 4}, true);
            } else if (car.text === 'Semi Tractor' || car.text === 'Bus') {
                this.frontLeftTire = this.tires.frontLeftTruck;
                this.frontRightTire = this.tires.frontRightTruck;
                this.backLeftTire = this.tires.backLeftInner;
                this.backLeftOuterTire = this.tires.backLeftOuter;
                this.backRightTire = this.tires.backRightInner;
                this.backRightOuterTire = this.tires.backRightOuter;
                this.middleLeftTire = this.tires.middleLeftInner;
                this.middleLeftOuterTire = this.tires.middleLeftOuter;
                this.middleRightTire = this.tires.middleRightInner;
                this.middleRightOuterTire = this.tires.middleRightOuter;
                car.body.layoutTires(this);
            } else if (car.text === '10-Wheeler') {
                this.frontLeftTire = this.tires.frontLeftTruck;
                this.frontRightTire = this.tires.frontRightTruck;
                this.leftTires = [this.tires.backLeftInner, this.tires.middleLeftInner, this.tires.backLeftOuter, this.tires.middleLeftOuter];
                this.rightTires = [this.tires.backRightInner, this.tires.middleRightInner, this.tires.backRightOuter, this.tires.middleRightOuter];
                car.body.layoutTires(this);
                var oldWTB = this.widthToBody;
                this.widthToBody = 57;
                CWD.semiTrailerBody.layoutTires(this, false);
                this.widthToBody = oldWTB;
            } else if (car.text === 'Semi Trailer') {
                this.leftTires = [this.tires.backLeftInner, this.tires.middleLeftInner, this.tires.backLeftOuter, this.tires.middleLeftOuter];
                this.rightTires = [this.tires.backRightInner, this.tires.middleRightInner, this.tires.backRightOuter, this.tires.middleRightOuter];
                car.body.layoutTires(this, false);
            }
        },

        // Below this is stuff just needed to support the normal vehicle shape API calls

        drawLower: function (ctx) {
        },
        drawMiddle: function (ctx) {
        },
        addQuickStart: function () {
        },
        removeQuickStart: function () {
        },
        hideCheckEngine: function () {
        },
        showCheckEngine: function () {
        }
    };
})();