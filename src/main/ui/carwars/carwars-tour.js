/*
 Car Wars is a trademark of Steve Jackson Games, and its rules and art are copyrighted by Steve Jackson Games.
 All rights are reserved by Steve Jackson Games.

 This game aid is the original creation of Aaron Mulder and is released for free distribution, and not for resale,
 under the permissions granted in the Steve Jackson Games Online Policy.

 Application code for this game aid (except for the Car Wars rules as noted above) copyright 2013 Aaron Mulder.
 */
/* global $, CW, CWD, CWT: true */
CWT={};

(function() {
    "use strict";

    CWT.startTour = function (canvasState, finishFunction) {
            this.state = canvasState;
            $('<div id="TourOverlay"></div>').insertAfter('#upperSchematic');
            this.overlay = $('#TourOverlay');
            $('<div id="TourDialog" class="ui-corner-all ui-overlay-shadow"></div>').appendTo(this.overlay);
            $('<div id="TourContent"></div>').appendTo('#TourDialog');
            $('<p>Welcome to the Combat Garage tour!</p><p>During this tour I point out things you can mouse over and click, ' +
                'but note that you won\'t be able to try that out until you close the tour.</p>').appendTo('#TourContent');
            $('<input type="button" name="Next" value="Next" id="TourNext" style="position: absolute; bottom: 10px; right: 20px;">').appendTo('#TourDialog');
            $('<input type="button" name="Close" value="Close" id="TourClose" style="position: absolute; bottom: 10px; left: 20px;">').appendTo('#TourDialog');
            $('#TourClose', this.overlay).click(function () {
                canvasState.overlays = [];
                $('#TourOverlay').hide().remove();
                finishFunction();
                return false;
            });
            $('#TourNext', this.overlay).click(function () {
                CWT.next();
                return false;
            });
            //        this.screen = 'BodyCycleSidecar';
            this.screen = 'Start';
        };
    CWT.next = function () {
            var text, top;
            if (this.screen === 'Start') {
                $('#TourDialog', this.overlay).addClass('FixedDialog');
                this.moveDialog('<p>Front and center you\'ll see the current vehicle design. ' +
                        'You won\'t see every last accessory there, but most items that take space or have DP will show up.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 300, y: 280}
                    ]);
                this.screen = 'Schematic';
            } else if (this.screen === 'Schematic') {
                this.moveDialog('<p>Along the top you\'ll find the status display with the key statistics for the design. ' +
                        'These values are updated every time you make any change to the design.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 150, y: 0}
                    ]);
                this.screen = 'Status';
            } else if (this.screen === 'Status') {
                this.moveDialog('<p>If you hover your mouse over a component in the design view, it will highlight the edge and show ' +
                        'the name of the component in green text.  You can click to edit that component.  Often you ' +
                        'can also hover over the area where something <i>could</i> go (like weapon or armor) to work on that.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 465, y: 315}
                    ]);
                this.state.car.hoverShape = this.state.car.frontRightTire;
                this.state.lowerValid = false;
                this.state.upperValid = false;
                this.screen = 'ClickToEdit';
            } else if (this.screen === 'ClickToEdit') {
                this.moveDialog('<p>To edit other features of the car, you can click the buttons below the design view. ' +
                        'This can give you access to things like corner-mount weapons where there\'s no place ' +
                        'in the design to hover, as well as things you haven\'t added yet like accessories or a turret.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 50, y: 430}
                    ]);
                this.state.car.hoverShape = this.state.car.toolbarButtons[0];
                this.state.upperValid = false;
                this.screen = 'Toolbar';
            } else if (this.screen === 'Toolbar') {
                this.moveDialog('<p>Whether you click a feature in the design view or a toolbar button, you\'ll see ' +
                        'the related editing controls here.  As you manipulate the controls, the design ' +
                        'and the status display above it are updated immediately.</p><p>For instance, note the ' +
                        'max weight and space of 2760 and 7 in the top readout.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 700, y: 150}
                    ]);
                this.state.car.hoverShape = this.state.car.toolbarButtons[0];
                $('#upperSchematic').triggerHandler('click');
                this.state.car.hoverShape = null;
                this.state.upperValid = false;
                this.screen = 'EditArea';
            } else if (this.screen === 'EditArea') {
                this.moveDialog('<p>If you click the [+] next to the current body type, it switches from Subcompact to ' +
                        'Compact and the status display now shows limits of 10 spaces and 4440 lbs.</p>' +
                        '<p>You may also see the note in the bottom right of your window that the engine size ' +
                        'was increased to accommodate the larger body.  I try to help keep the design legal.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 700, y: 150}
                    ]);
                $('#CarBodyTypeNext').focus().trigger('click');
                this.screen = 'ChangeBody';
            } else if (this.screen === 'ChangeBody') {
                this.moveDialog('<p>You can find ways to make an illegal design, though.  Here we\'ve added a one-space ' +
                        'turret and then downsized the body to a subcompact (which can\'t handle such a turret).</p>' +
                        '<p>You\'ll see the \'Illegal\' text above and below the design, and in the bottom right ' +
                        'of your window it mentions the specific problems.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 50, y: 20},
                        {startx: 300, starty: 500, x: 400, y: 400}
                    ]);
                this.state.car.hoverShape = this.state.car.toolbarButtons[7];
                $('#upperSchematic').triggerHandler('click');
                $('#CarTurretListTopTurret').triggerHandler('click');
                this.state.car.hoverShape = this.state.car.toolbarButtons[0];
                $('#upperSchematic').triggerHandler('click');
                this.state.car.hoverShape = null;
                $('#CarBodyTypePrev').focus().trigger('click');
                this.screen = 'Illegal';
            } else if (this.screen === 'Illegal') {
                this.moveDialog('<p>Remove the offending turret, and the complaint goes away.</p>' +
                        '<p>Note as well that you can click on the road outside the vehicle shape ' +
                        'to get back to the text description of the design as it stands.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 670, y: 100}
                    ]);
                this.state.car.hoverShape = this.state.car.toolbarButtons[7];
                $('#upperSchematic').triggerHandler('click');
                this.state.car.hoverShape = null;
                $('#CarTurretListTopTurret').triggerHandler('click');
                $('#CarTurretRemove').triggerHandler('click');
                this.screen = 'TextDescription';
            } else if (this.screen === 'TextDescription') {
                this.moveDialog('<p>When you\'re ready to save your design or start over, you can use the ' +
                        'main menu control here.  Click it to bring up the menu...</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 670, y: 50}
                    ]);
                this.screen = 'MenuIcon';
            } else if (this.screen === 'MenuIcon') {
                text = '<p>And here\'s the list of options from the menu. ' +
                    'You can save the current design, start fresh with one of several types of vehicles, ' +
                    'or list your existing designs.</p>';
                top = 357;
                if (!CW.readCookie('author_email')) {
                    text += '<p>You\'ll need to set up an account and log in to list designs.  When you select ' +
                        'List Designs, just enter your e-mail address and hit Create Account if you haven\'t set up an account before.</p>';
                    top = 317;
                }
                this.moveDialog(text, 200, 500, [
                    {startx: 300, starty: 500, x: 300, y: top, color: "#0000FF"}
                ]);
                this.state.car.hoverShape = this.state.car.menuIcon;
                $('#upperSchematic').triggerHandler('click');
                this.screen = 'Menu';
            } else if (this.screen === 'Menu') {
                this.moveDialog('<p>There are also several options available from the Design Info screen</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 645, y: 415}
                    ]);
                this.state.car.hoverShape = this.state.car.toolbarButtons[12];
                this.state.upperValid = false;
                $.mobile.changePage('#editDefault');
                this.screen = 'DesignButton';
            } else if (this.screen === 'DesignButton') {
                this.moveDialog('<p>Most importantly, you can download your design as a PDF, showing the text description, ' +
                        'key statistics, a walkaround description, the design schematic, and a design worksheet with all the components ' +
                        'listed individually.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 700, y: 580}
                    ]);
                this.state.car.hoverShape = this.state.car.toolbarButtons[12];
                this.state.upperValid = false;
                $.mobile.changePage('#editDesign');
                this.screen = 'DesignScreen1';
            } else if (this.screen === 'DesignScreen1') {
                this.moveDialog('<p>You can also set the tech level to restrict equipment to only what\'s ' +
                        'available in the Car Wars Compendium (v2.5), set whether to count the weight of crew ' +
                        'equipment against the vehicle limit, and change the body color.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 700, y: 170},
                        {startx: 300, starty: 500, x: 700, y: 245},
                        {startx: 300, starty: 500, x: 700, y: 405}
                    ]);
                this.state.car.hoverShape = null;
                this.state.upperValid = false;
                this.screen = 'DesignScreen2';
            } else if (this.screen === 'DesignScreen2') {
                this.moveDialog('<p>Finally, if you choose Save Design from either the main menu or the ' +
                        'design screen, you\'ll come here.  If you enter an e-mail address before you ' +
                        'submit the design, I\'ll e-mail you a link to the design, and you\'ll be able ' +
                        'to list it later from the main menu.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 700, y: 145}
                    ]);
                this.state.car.car.designName = 'Cosmic Fireball';
                this.state.car.designNameField.text = '"Cosmic Fireball"';
                this.state.middleValid = false;
                $.mobile.changePage('#editSave');
                this.screen = 'Save';
            } else if (this.screen === 'Save') {
                this.moveDialog('<p>Otherwise, you can copy and paste the link provided here so you\'ll ' +
                        'be able to get back to this design later.</p>', 200, 500,
                    [
                        {startx: 300, starty: 500, x: 700, y: 175}
                    ]);
                $.mobile.changePage('#confirmSave');
                this.screen = 'ConfirmSave';
            } else if (this.screen === 'ConfirmSave') {
                this.moveDialog('<p>For the rest of the tour, we\'ll visit each of the screens and talk about how to ' +
                        'add weapons and armor, select an engine, manage your crew, and so on.</p>' +
                        '<p><b>Body:</b> This is where you set up your body type, chassis, suspension, and other ' +
                        'similar options.  Use the [+] and [-] buttons next to each option to switch between ' +
                        'the different values.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 50, y: 420, color: "#0000FF"},
                        {startx: 300, starty: 500, x: 700, y: 100},
                        {startx: 300, starty: 500, x: 700, y: 260},
                        {startx: 300, starty: 500, x: 700, y: 483}
                    ]);
                this.state.car.hoverShape = this.state.car.toolbarButtons[0];
                this.state.upperValid = false;
                $.mobile.changePage('#editBody');
                this.screen = 'BodyScreen';
            } else if (this.screen === 'BodyScreen') {
                this.moveDialog('<p>Different vehicles have different Body options.  If you select New Vehicle Design ' +
                        'from the main menu, you can select one of the ' +
                        'available vehicle types by clicking the type here.  Let\'s look at the Body options for a cycle.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 280, y: 160}
                    ]);
                $('#CarMenuNewCar').triggerHandler('click');
                this.state.car.hoverShape = CWD.vehicleSelector.shapes[1];
                this.state.upperValid = false;
                this.screen = 'SelectScreen';
            } else if (this.screen === 'SelectScreen') {
                this.moveDialog('<p>On the cycle body screen, you can add a cycle windshell, and configure ' +
                        'extra armor for it.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 425}
                    ]);
                $.mobile.changePage('#editDefault');
                $('#upperSchematic').triggerHandler('click');
                this.state.car.hoverShape = null;
                this.state.invalidate();
                this.state.car.car.addWindshell();
                $.mobile.changePage('#editBody');
                this.screen = 'BodyCycleWindshell';
            } else if (this.screen === 'BodyCycleWindshell') {
                this.moveDialog('<p>Or, if you prefer, you can instead add a sidecar (for Medium or Heavy cycles, anyway).  ' +
                        'You can set the suspension and other sidecar options here too.</p>' +
                        '<p>Since you can only have either a windshell or a sidecar, you\'ll notice that when you ' +
                        'select one, the other is disabled (unless you remove the one you picked).</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 525}
                    ]);
                this.state.car.car.windshell = null;
                $('#editBody').triggerHandler('pagebeforeshow');
                $('#CarBodyTypeNext').triggerHandler('click');
                $('#CarSidecarTypeNext').triggerHandler('click');
                $('#CarSidecarTypeNext').triggerHandler('click');
                this.screen = 'BodyCycleSidecar';
            } else if (this.screen === 'BodyCycleSidecar') {
                $('#TourDialog', this.overlay).addClass('FixedDialog');
                this.moveDialog('<p>For trikes, you can configure here whether it should be a regular or  ' +
                        'reversed trike.</p>' +
                        '<p>Other vehicle types have similar customizations available.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 150}
                    ]);
                $('#statusSidecarWeight').hide();
                $('#statusSidecarWeightLabel').hide();
                $('#statusSidecarSpace').hide();
                $('#statusSidecarSpaceLabel').hide();
                $.mobile.changePage('#editDefault');
                this.state.car.hoverShape = CWD.vehicleSelector.shapes[2];
                $('#upperSchematic').triggerHandler('click');
                this.state.car.hoverShape = null;
                this.state.invalidate();
                this.state.car.car.reversed = true;
                $.mobile.changePage('#editBody');
                $('#CarBodyReversedTrike').trigger('execute');
                this.screen = 'BodyTrike';
            } else if (this.screen === 'BodyTrike') {
                this.moveDialog('<p><b>Crew:</b> If you click the driver or gunner or a passenger in the design view, you can get  ' +
                        'the details for that person.  Or you can use the crew button in the toolbar, which ' +
                        'also lets you add a new passenger (or add crew to a sidecar).  Here we clicked the ' +
                        'toolbar button and then we\'ll select \'Add Gunner\' and then click the new \'Gunner\' button.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 100, y: 420, color: "#0000FF"},
                        {startx: 300, starty: 500, x: 700, y: 100}
                    ]);
                this.state.car.hoverShape = this.state.car.toolbarButtons[1];
                this.state.upperValid = false;
                $.mobile.changePage('#editAllCrew');
                this.screen = 'CrewList';
            } else if (this.screen === 'CrewList') {
                this.moveDialog('<p>Once you\'ve selected a crew member, you can choose body armor, a targeting ' +
                        'computer, component armor for that person, and so on.</p>' +
                        '<p>Most options here are specific to the selected person.  But if you have both a Driver ' +
                        'and a Gunner, you\'ll also see the Crew Compartment CA controls at the bottom, to ' +
                        'put Component Armor around the Driver and Gunner together.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 70},
                        {startx: 300, starty: 500, x: 700, y: 180},
                        {startx: 300, starty: 500, x: 700, y: 570}
                    ]);
                $('#CarCrew1').triggerHandler('click');
                $('#CarCrew1').triggerHandler('click');
                this.state.car.hoverShape = null;
                this.state.upperValid = false;
                this.screen = 'CrewGunner';
            } else if (this.screen === 'CrewGunner') {
                this.moveDialog('<p><b>Engine:</b> Until you pick a specific engine, I\'ll adjust your engine to fit ' +
                        'the body and chassis you select.  But when you click the engine in the design or the ' +
                        'toolbar, you\'ll come to the Engine Selector.  This lets you put ' +
                        'in your desired top speed and acceleration, and then proposes several engines for you.  You ' +
                        'can also limit it to only Gas or Electric.  For now, we\'ll bump up the desired ' +
                        'acceleration to 15.</p>', 200, 510,
                    [
                        {startx: 430, starty: 500, x: 470, y: 220, color: "#0000FF"},
                        {startx: 430, starty: 500, x: 700, y: 100},
                        {startx: 430, starty: 500, x: 700, y: 430}
                    ]);
                $('#CarCrewChange').trigger('click');
                this.state.car.hoverShape = this.state.car.engine;
                this.state.upperValid = false;
                $.mobile.changePage('#editEngineList');
                this.screen = 'EngineSelector1';
            } else if (this.screen === 'EngineSelector1') {
                this.moveDialog('<p>Look closely at the first engine in the list.  It says ' +
                        '\'Acc 15, TS 80mph <b>@ 1890lbs</b>\'.  This engine is too small to give ' +
                        'the right acceleration at the maximum chassis weight of 1920 lbs, but it will work if you leave off just ' +
                        'a few pounds.  This is a trick to squeak by with a slightly smaller or cheaper ' +
                        'engine -- if you can live with a little less armor in the end.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 330}
                    ]);
                $('#CarAccelerationNext').triggerHandler('click');
                $('#CarAccelerationNext').triggerHandler('click');
                this.state.car.hoverShape = null;
                this.state.upperValid = false;
                this.screen = 'EngineSelector2';
            } else if (this.screen === 'EngineSelector2') {
                this.moveDialog('<p>You may also notice that some of the engines in this list have add-ons included: ' +
                        'a Turbocharger (TC) for the gas engines, High-Torque Motors (HTM) for the electric engines, and ' +
                        'so on.</p>' +
                        '<p>For now, we\'ll click the second \'50 cid\' engine in the list.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 400}
                    ]);
                this.screen = 'EngineSelector3';
            } else if (this.screen === 'EngineSelector3') {
                this.moveDialog('<p>Now you can manually configure every aspect of the engine: the size, add-ons, ' +
                        'component armor, and engine-mounted accessories like Fire Extinguishers and Nitrous Oxide ' +
                        'and Improved Supercharger Capacitors.  But if you\'re satisfied with the engine that the ' +
                        'selector proposed, there\'s nothing further to do here.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 70},
                        {startx: 300, starty: 500, x: 700, y: 300},
                        {startx: 300, starty: 500, x: 700, y: 570}
                    ]);
                $('#CarSelectEngine2').triggerHandler('click');
                this.screen = 'EngineDetails';
            } else if (this.screen === 'EngineDetails') {
                this.moveDialog('<p><b>Gas Tank:</b> Since we selected a gas engine, a gas tank shows in the ' +
                        'design and the Gas Tank button is enabled in the toolbar.  Clicking either one lets you ' +
                        'change the type, size, and options for the tank.</p>' +
                        '<p>You won\'t use this for electric engines.</p>', 200, 510,
                    [
                        {startx: 430, starty: 500, x: 270, y: 210, color: "#0000FF"},
                        {startx: 430, starty: 500, x: 700, y: 300}
                    ]);
                this.state.car.hoverShape = this.state.car.tank;
                this.state.upperValid = false;
                $.mobile.changePage('#editGasTank');
                this.screen = 'GasTank';
            } else if (this.screen === 'GasTank') {
                this.moveDialog('<p><b>Tires:</b> Selecting the Tires icon in the toolbar brings up a list of the ' +
                        'tire positions you can change.  You can also add a spare tire (as cargo) from here.  ' +
                        'If you instead click on a tire in the design, it will just go straight to that tire ' +
                        'position.</p>' +
                        '<p>We\'ll select \'Front Tires\' from here.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 260, y: 428, color: "#0000FF"},
                        {startx: 300, starty: 500, x: 700, y: 150}
                    ]);
                this.state.car.hoverShape = this.state.car.toolbarButtons[4];
                this.state.upperValid = false;
                $.mobile.changePage('#editAllTires');
                this.screen = 'AllTires';
            } else if (this.screen === 'AllTires') {
                this.moveDialog('<p>Your tires will always match left-to-right.  Under \'Other Tires\', there\'s an option ' +
                        'for whether they should match front-to-back as well.  Above that, ' +
                        'you can configure the tire type and options.  Below, you can configure wheelguards and ' +
                        'wheelhubs for the selected tire location.  Often the guards and hubs don\'t ' +
                        'match from front to back, so you\'ll need to change them in both locations if you want them ' +
                        'all around.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 110},
                        {startx: 300, starty: 500, x: 700, y: 440},
                        {startx: 300, starty: 500, x: 700, y: 560}
                    ]);
                this.state.car.hoverShape = this.state.car.frontLeftTire;
                this.state.upperValid = false;
                $('#CarTiresAllFront').triggerHandler('click');
                this.screen = 'FrontTires';
            } else if (this.screen === 'FrontTires') {
                this.moveDialog('<p><b>Performance:</b> The Sport button in the toolbar brings up the performance options, ' +
                        'like that big spoiler that makes the car <i>look</i> really fast.  (Plus I guess it actually handles better.) ' +
                        'In any case, here\'s where you\'ll find ' +
                        'all the options that will make your vehicle lighter, faster, and more maneuverable.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 295, y: 428, color: "#0000FF"},
                        {startx: 300, starty: 500, x: 700, y: 200}
                    ]);
                this.state.car.hoverShape = null;
                this.state.upperValid = false;
                $('#CarTireTypeNext').triggerHandler('click');
                $('#CarTireTypeNext').triggerHandler('click');
                $.mobile.changePage('#editPerformance');
                this.screen = 'PerformanceScreen';
            } else if (this.screen === 'PerformanceScreen') {
                this.moveDialog('<p><b>Body Modifications:</b> The Mods button in the toolbar brings up the list of ' +
                        'Ramplates, Bumper Spikes and other attachments, as well as conversions like a ' +
                        'Convertible Hardtop.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 350, y: 428, color: "#0000FF"},
                        {startx: 300, starty: 500, x: 700, y: 200}
                    ]);
                $.mobile.changePage('#editBodyMods');
                this.screen = 'BodyModsScreen';
            } else if (this.screen === 'BodyModsScreen') {
                this.moveDialog('<p><b>Turrets:</b> The Turret button brings up a list of turrets to choose from (including EWPs, ' +
                        'Rocket Platforms, and other turret-like add-ons).  If you\'ve already selected a turret for the top ' +
                        'or sides, it will be the only option displayed there; otherwise you\'ll see all the devices that ' +
                        'the current vehicle can mount.</p>' +
                        '<p>We\'ll click \'Turret\' here to add a top turret.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 400, y: 428, color: "#0000FF"},
                        {startx: 400, starty: 500, x: 700, y: 100}
                    ]);
                this.state.car.car.nextBody();
                $.mobile.changePage('#editTurretList');
                this.screen = 'TurretListScreen';
            } else if (this.screen === 'TurretListScreen') {
                $('#CarTurretListTopTurret').triggerHandler('click');
                this.moveDialog('<p>The turret options come up when you\'ve selected a particular turret/EWP/etc. to work with. ' +
                        'The default size is the largest the current vehicle can mount, though you can make it smaller ' +
                        'if you like.  There are also options for the turret, depending on the type.</p>' +
                        '<p>Most importantly, you\'ll also find the list of weapons in the turret, where you can ' +
                        'add more.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 100},
                        {startx: 300, starty: 500, x: 700, y: 220}
                    ]);
                this.screen = 'TopTurretScreen';
            } else if (this.screen === 'TopTurretScreen') {
                $.mobile.changePage('#editDefault');
                this.moveDialog('<p><b>Weapons:</b> There are many ways to add weapons.  You can use the Weapons button in the ' +
                        'toolbar, you can hover your mouse over an empty front or side area of the design to get a link to add ' +
                        'weapons to that facing, you can click an existing weapon, or you can click a link from a turret to add ' +
                        'or edit a weapon in the turret.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 442, y: 428},
                        {startx: 300, starty: 500, x: 570, y: 150},
                        {startx: 300, starty: 500, x: 425, y: 265}
                    ]);
                this.screen = 'FindWeapon';
            } else if (this.screen === 'FindWeapon') {
                this.state.car.hoverShape = this.state.car.toolbarButtons[8];
                this.state.upperValid = false;
                $('#upperSchematic').triggerHandler('click');
                this.moveDialog('<p>Clicking the Weapons button in the toolbar gives the full list of vehicular weapon locations, ' +
                        'including corner mounts and sidecar mounts.  From here, you can add or edit any of those weapons.</p>' +
                        '<p>We\'ll click \'Add Front Weapon\' to continue.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 442, y: 428, color: '#0000FF'},
                        {startx: 300, starty: 500, x: 700, y: 100}
                    ]);
                this.screen = 'AllWeapons';
            } else if (this.screen === 'AllWeapons') {
                this.state.car.hoverShape = null;
                this.state.upperValid = false;
                $('#CarWeaponsAllFront').triggerHandler('click');
                this.moveDialog('<p>When you\'re adding a weapon, you must first choose the type of weapon from the categories ' +
                        'listed here, and then I\'ll show you all the weapon options in that category.  But don\'t worry -- ' +
                        'if you change your mind there\'s a \'Back\' button on the weapon list so you can get back here.</p>' +
                        '<p>We\'ll choose \'Small-Bore Projectile\' to continue.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 55}
                    ]);
                this.screen = 'WeaponCategories';
            } else if (this.screen === 'WeaponCategories') {
                $('#CarWeaponCategorySBP').triggerHandler('click');
                this.moveDialog('<p>Here\'s the list of Small-Bore Projectile weapons.  Any one that can\'t fit in the ' +
                        'current location (maybe due to overall size or the 1/3 spaces rule) will be disabled.  Just ' +
                        'click the one you want to add, or \'Back\' to get back to the category list.</p>' +
                        '<p>Here we\'ll select a Vulcan Machine Gun to add.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 200}
                    ]);
                this.screen = 'WeaponList';
            } else if (this.screen === 'WeaponList') {
                $('#CarWeaponListLink3').triggerHandler('click');
                this.moveDialog('<p>There\'s a lot to editing a weapon.  At the top, you can choose to have more than one ' +
                        'of the same weapon in the same location.  This will link the weapons, and any changes ' +
                        'will apply to both.  Plus, if you add component armor, it will protect both ' +
                        'weapons with a single set of CA.</p>' +
                        '<p>Below that are the ammo options, which we\'ll look at next.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 20}
                    ]);
                this.screen = 'WeaponCount';
            } else if (this.screen === 'WeaponCount') {
                this.moveDialog('<p>Here are the ammo options.  Each weapon starts with a full load of regular shots. ' +
                        'You can use the [x] button to remove it all, or the [+] and [-] buttons to add or remove single ' +
                        'shots.  The grid button for ammo types you aren\'t using adds a full magazine of that kind.  I ' +
                        'will add extra magazines (or rocket magazines) as needed.  Finally, some weapons have options ' +
                        'like \'Tracer\' here that can be applied to all your shots.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 100},
                        {startx: 300, starty: 500, x: 700, y: 320}
                    ]);
                this.screen = 'WeaponAmmo';
            } else if (this.screen === 'WeaponAmmo') {
                this.moveDialog('<p>Below that you\'ll find the options for the weapon itself.  Some may be disabled, ' +
                        'depending on the space remaining.  Other may only show up for particular weapons, such as the ' +
                        '\'Infrared\' option that only applies to lasers.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 450}
                    ]);
                this.screen = 'WeaponOptions';
            } else if (this.screen === 'WeaponOptions') {
                this.state.car.hoverShape = this.state.car.toolbarButtons[9];
                this.state.upperValid = false;
                $('#upperSchematic').triggerHandler('click');
                this.moveDialog('<p><b>Armor:</b> You can add armor from the toolbar, or by hovering over a space just ' +
                        'beyond the weapons on one of the sides of the vehicle.</p>' +
                        '<p>In either case, you start by selecting the type of Plastic and/or Metal armor to use, and ' +
                        'whether it should be sloped.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 495, y: 428, color: '#0000FF'},
                        {startx: 300, starty: 500, x: 700, y: 60}
                    ]);
                this.screen = 'ArmorType';
            } else if (this.screen === 'ArmorType') {
                this.state.car.hoverShape = null;
                this.state.upperValid = false;
                this.moveDialog('<p>Just below that, you\'ll see a button that offers to add armor up to the vehicle\'s ' +
                        'max weight.  If you click that, the armor will be distributed fairly evenly, though ' +
                        'with less for the top (except for trikes and turreted designs) and underbody.</p>' +
                        '<p>Otherwise, you can use the remaining controls to specify exactly how you want the armor ' +
                        'arranged.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 169}
                    ]);
                this.screen = 'ArmorPoints';
            } else if (this.screen === 'ArmorPoints') {
                this.state.car.hoverShape = this.state.car.toolbarButtons[10];
                this.state.upperValid = false;
                $('#upperSchematic').triggerHandler('click');
                this.moveDialog('<p><b>Gear:</b> This is where you\'ll find the rest of the accessories that aren\'t on ' +
                        'one of the other screens.  At the top you can add Links and Smart Links, which you can optionally ' +
                        'configure by indicating what weapons or equipment should be linked.  Below that, you\'ll find ' +
                        'categories for the rest of the available accessories.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 550, y: 428, color: '#0000FF'},
                        {startx: 300, starty: 500, x: 700, y: 100}
                    ]);
                this.screen = 'GearScreen';
            } else if (this.screen === 'GearScreen') {
                var item = CW.createWeapon('MD', 'Back', null);
                this.state.car.car.backWeapons.push(item);
                this.state.car.addWeapon(item, 'Back', false);
                this.state.car.hoverShape = null;
                this.state.upperValid = false;
                item = CW.createLink(this.state.car.car, false);
                item.items.push(this.state.car.car.frontWeapons[0]);
                item.items.push(this.state.car.car.backWeapons[0]);
                this.state.car.car.links.push(item);
                $('#CarGearLinks').triggerHandler('click');
                $('#CarLink0').triggerHandler('click');
                this.moveDialog('<p>I added a Minedropper so we can try out links.  Clicking on Links brings up a list of ' +
                        'existing links, and then we click the option to \'Add New Link\'.</p>' +
                        '<p>From here, you can simply check off the items that should be linked.  But you can also ' +
                        'skip this, and the link will still be included in the design -- it just won\'t indicate ' +
                        'what is actually linked.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 100}
                    ]);
                this.screen = 'Links';
            } else if (this.screen === 'Links') {
                this.state.car.hoverShape = this.state.car.toolbarButtons[10];
                this.state.upperValid = false;
                $('#upperSchematic').triggerHandler('click');
                $('#CarGearCategoryElectronics').triggerHandler('click');
                this.moveDialog('<p>Besides Smart Links (which work just like Links), the rest of the gear screens ' +
                        'look pretty much like this (I brought up the \'Electronics\' one).  You can select ' +
                        'whichever accessories you want.</p>' +
                        '<p>Remember that some accessories are found with the items they go with -- like targeting ' +
                        'computers with crew, fire extinguishers with the engine, body and performance mods, etc. ' +
                        'The gear lists are just the catch-all for everything else.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 700, y: 200}
                    ]);
                this.screen = 'Electronics';
            } else if (this.screen === 'Electronics') {
                this.state.car.hoverShape = this.state.car.toolbarButtons[11];
                this.state.upperValid = false;
                this.moveDialog('<p><b>Repair &amp; Salvage:</b> The remaining screen is for calculating how much it' +
                        'would cost to repair a damaged vehicle, or what you can salvage from the wreck.</p>' +
                        '<p>It is still under development so I won\'t describe it here yet.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 594, y: 405, color: '#0000FF'}
                    ]);
                this.screen = 'Repair';
            } else if (this.screen === 'UNUSED') {
                // TODO: move to the gear/boosters screen
                $('#upperSchematic').triggerHandler('click');
                this.moveDialog('<p><b>Rocket Boosters and Jump Jets:</b> Clicking Boosters in the toolbar brings up the ' +
                        'booster and jump jet options.  At the top, you select the type and direction.  In the middle, ' +
                        'you have to select whether the booster weight and effect should be calculated at the vehicle\'s ' +
                        'current or max weight.  The you just use the [-] and [+] buttons to indicate how much thrust ' +
                        'you\'re looking for, and I\'ll figure how much booster you need to achieve that.</p>', 200, 510,
                    [
                        {startx: 300, starty: 500, x: 594, y: 405, color: '#0000FF'},
                        {startx: 300, starty: 500, x: 700, y: 405},
                        {startx: 300, starty: 500, x: 700, y: 505}
                    ]);
                this.screen = 'Boosters';
            } else {
                $('#TourDialog', this.overlay).removeClass('FixedDialog');
                this.moveDialog('<p>And that just about does it for the tour. ' +
                    'Hopefully I gave you a good overview of the ' +
                    'Combat Garage.  Happy designing!</p>', 200, 200, []);
                this.state.car.hoverShape = null;
                this.state.upperValid = false;
                $('#TourNext', this.overlay).hide();
            }
        };
    CWT.createArrow = function (startx, starty, x, y, color) {
            return {
                length: Math.sqrt((x - startx) * (x - startx) + (y - starty) * (y - starty)),
                angle: Math.atan2((y - starty), (x - startx)),
                color: color || "#008000",
                draw: function (ctx) {
                    ctx.translate(startx, starty);
                    ctx.rotate(this.angle);
                    ctx.beginPath();
                    ctx.strokeStyle = this.color;
                    ctx.fillStyle = this.color;
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, -10);
                    ctx.lineTo(this.length - 30, -10);
                    ctx.lineTo(this.length - 30, -25);
                    ctx.lineTo(this.length, 0);
                    ctx.lineTo(this.length - 30, 25);
                    ctx.lineTo(this.length - 30, 10);
                    ctx.lineTo(0, 10);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
            };
        };
    CWT.moveDialog = function (content, x, y, pointTo) {
            $('#TourContent', this.overlay).empty();
            $(content).appendTo($('#TourContent', this.overlay));
            $('#TourDialog', this.overlay).animate({
                left: x,
                top: y
            }, 500);
            this.state.overlays = [];
            var arrow;
            for (var i = 0; i < pointTo.length; i++) {
                arrow = this.createArrow(pointTo[i].startx, pointTo[i].starty, pointTo[i].x, pointTo[i].y, pointTo[i].color);
                this.state.overlays.push(arrow);
            }
            this.state.upperValid = false;
        };
})();