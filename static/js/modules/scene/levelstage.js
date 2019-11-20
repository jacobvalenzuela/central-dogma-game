import GameScore from "../gamescore.js";
import PopupManager from "../popupmanager.js";
import Nucleotide from "../nucleotide.js";
import PositionManager from "../positionmanager.js";
import LevelComplete from "./levelcomplete.js";
import Codon from "../codon.js";
import AudioPlayer from "../audioplayer.js";
import BackgroundFloater from "../backgroundfloater.js";

/**
 * Represents the level stage scene
 * @extends Phaser.Scene
 */
class LevelStage extends Phaser.Scene {
    /**
     * Creates a level stage scene
     * @param {Phaser.Types.Scenes.SettingsConfig} config 
     */
    constructor (config) {
        super(config);
    }

    /**
     * Initalizes the level with the graphics, positioning, and scorekeeping
     * @param {JSON} data 
     */
    init(data) {

        // Color Constants
        let ORANGE = 0xF56C26; // Adenine
        let DARK_BLUE = 0x002664;
        let CYAN = 0x22F2DD; // Thymine
        let BLUE = 0x006FFF;
        let WHITE = 0xFFFFFF;
        let DARKER_BLUE = 0x103B75; // Cytosine
        let BLACK = 0x1e1e1e;
        let GOLD = 0xF5B222; // Guanine

        let HL_ELLIPSE_X = 160;
        let HL_ELLIPSE_Y = 490;
        let HL_ELLIPSE_WIDTH = 230;
        let HL_ELLIPSE_HEIGHT = 125;
        let HL_ELLIPSE_COLOR = 0xfffaa8

        this.data = data;
        this.levelConfig = data.level;
        this.gameObj = data.gameObj;
        this.game = this;
        this.level = data.lvlNum;
        this.rotateNT = this.levelConfig.rotateNT;
        this.ntType = this.levelConfig.ntType;
        this.gameEnded = false;
        this.scorekeeping = null;
        this.objects = {};
        this.nucleotides = [];
        this.buttons = [];
        this.buttonCurrent = null;
        this.btnLocationNucleotides = {
            0: [310, 340],
            1: [310, 440],
            2: [310, 540],
            3: [310, 640]
        };
        this.btnLocationCodons = {
            0: [310, 410],
            1: [310, 540],
            2: [310, 650]
        };
        this.ntBtnsEnabled = true;

        // Attaches global score to the current game.
        this.game.globalscore = data.gameObj.GLOBAL_SCORE;
        this.scorekeeping = new GameScore(this.game);
        this.popupmanager = new PopupManager(this);

        this.camera = this.game.cameras.cameras[0];
        this.graphics = this.game.add.graphics();

        // Sound Effects
        this.audioplayer = new AudioPlayer();

        // Background Color and Floaties
        this.graphics.fillStyle(BLACK, 1.0);
        this.graphics.fillRect(0, 0, 360, 740);

        this.floaty = this.physics.add.group();
        this.backgroundFloaties = this.spawnBackgroundFloaties(15);
        //this.floaterSpawner = new BackgroundFloater(this);
        //this.backgroundFloaties = this.floaterSpawner.spawnBackgroundFloaties(15);

        // Header background space
        this.graphics.fillStyle(WHITE, 1);
        this.graphics.fillRect(0, 0, 360, 42);

        // Header logos
        this.game.add.image(75, 30, "logo_dogma").setScale(0.15).setDepth(1);
        this.game.add.image(300, 22, "logo_isb").setScale(0.15).setDepth(1);

        // UI Colored Boxes
        this.graphics.fillStyle(DARK_BLUE, 1.0);
        this.graphics.fillRect(15, 65, 75, 45).setDepth(0.5);

        this.graphics.fillStyle(DARK_BLUE, 1.0);
        this.graphics.fillRect(100, 65, 75, 45).setDepth(0.5);

        this.graphics.fillStyle(ORANGE, 1.0);
        this.graphics.fillRect(185, 65, 115, 45).setDepth(0.5);

        // UI Labels
        // '\'Open Sans\', sans-serif'
        this.game.add.text(29, 68, "REMAINING", 
            {fontFamily: 'Teko, sans-serif', fontSize: '10pt', color: '#FFFFFF'}).setDepth(1);

        this.game.add.text(116, 68, "ACCURACY", 
            {fontFamily: 'Teko, sans-serif', fontSize: '10pt', color: '#FFFFFF'}).setDepth(1);

        this.game.add.text(195, 68, "SCORE", 
            {fontFamily: 'Teko, sans-serif', fontSize: '10pt', color: '#FFFFFF'}).setDepth(1);

        console.log(this.data);

        // Level Name
        this.game.add.text(16, 45, "LV. " + (this.data.lvlNum + 1) + ": " + this.data.level.name, 
            {fontFamily: 'Teko, sans-serif', fontSize: '14pt', color: '#FFFFFF'}).setDepth(1);

        // Pause Button
        this.pauseBtn = this.game.add.image(330, 87, "pause_btn").setDepth(1).setScale(0.23).setInteractive();
        this.pauseBtn.addListener("pointerdown", this.bindFn(function(){
            console.log("pressed");
            this.scene.pause();
            
            this.scene.launch('pauseScreen', this);
        }, this));



        let ntParticleConfig = {
            x: 150,
            y: 510,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            active: false,
            lifespan: 600,
            gravityY: 800
        };
        this.ntparticle = {
            "adenine": this.add.particles("ntparticle_adenine").createEmitter(ntParticleConfig),
            "cytosine": this.add.particles("ntparticle_cytosine").createEmitter(ntParticleConfig),
            "guanine": this.add.particles("ntparticle_guanine").createEmitter(ntParticleConfig),
            "thymine": this.add.particles("ntparticle_thymine").createEmitter(ntParticleConfig),
            "uracil": this.add.particles("ntparticle_thymine").createEmitter(ntParticleConfig),
        }

        for (let i = 0; i < Object.keys(this.ntparticle).length; i++) {
            let nt = Object.keys(this.ntparticle)[i];
            this.ntparticle[nt].manager.setDepth(5000);
        }

        let nucleotides = this.gameObj.levels[this.level].ntSequence;
        if (this.levelConfig.lvlType == "dna_replication") {
            for (let i = 0; i < nucleotides.length; i++) {
                let nucleotide = new Nucleotide(this, nucleotides[i], this.ntType);
                this.nucleotides.push(nucleotide);
            }
        } else if (this.levelConfig.lvlType == "codon_transcription") {
            if (nucleotides.length % 3 != 0) {
                console.error("Nucleotides length is not divisible by 3");
            }
            let nucleotidesnew = "";
            for (let i = 0; i < nucleotides.length; i+=3) {
                let first = nucleotides.substr(i, 1);
                let second = nucleotides.substr(i + 1, 1);
                let third = nucleotides.substr(i + 2, 1);
                nucleotidesnew += (third + second + first);
            }
            nucleotides = nucleotidesnew;
            for (let i = 0; i < nucleotides.length; i+=3) {
                let ntstr = nucleotides.substr(i, 3);
                let codon = new Codon(this, ntstr, this.ntType);
                this.nucleotides.push(codon);
            }
        }

        this.positionManager = new PositionManager(this, this.levelConfig.speed);
        this.positionManager.setPositions(false);
        let optbtns = this.gameObj.levels[this.level].controls;

        // Binding Pocket
        // Invisible, we're only using this for collision detection.
        this.ntHighlightEllipse = this.game.add.ellipse(HL_ELLIPSE_X, HL_ELLIPSE_Y,
                                                        HL_ELLIPSE_WIDTH, HL_ELLIPSE_HEIGHT,
                                                        HL_ELLIPSE_COLOR, 1);
        this.ntHighlightEllipse.setAlpha(0);
        this.ntHighlightEllipse.setVisible(true);
        this.ntHighlightEllipse.setAngle(16);
        this.ntHighlightEllipse.setDepth(1000);

        // WW: Display the highlight ellipse
        this.tweens.add({
            targets: this.ntHighlightEllipse,
            scale: 1.05,
            duration: 1000,
            alpha: 1,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });
        var bb = this.ntHighlightEllipse.getBounds();
        this.bbox = this.game.add.rectangle(bb.x, bb.y, bb.width, bb.height,
                                            0xff0000);
        this.bbox.setVisible(true);
        this.bbox.setDepth(1001);
        this.bbox.setAlpha(0.5);

        // Conditional rendering for each level type
        if (this.levelConfig.lvlType == "dna_replication") {
            if (!optbtns) {
                optbtns = ["T", "A", "G", "C"];
            }

            // Label for binding pocket.
            /*
            this.game.add.text(90, 534, "Binding Pocket",
            {fontFamily: 'Teko', fontSize: '12pt', color: '#FFFFFF'}).setDepth(1).setAngle(19);
            */
            this.game.add.text(77, 475, "Binding Pocket",
            {fontFamily: 'Teko', fontSize: '12pt', color: '#FFFFFF'}).setDepth(1);

            // Binding pocket
            this.bindingPocket = this.game.add.image(153, 433, "bindingpocket");
            //this.bindingPocket.setAngle(16);
            this.bindingPocket.setDepth(1000);
            this.bindingPocket.setScale(0.75)
    
            this.tweens.add({
                targets: this.bindingPocket,
                alpha: 0.5,
                duration: 1000,
                ease: 'linear',
                yoyo: true,
                repeat: -1
            })

            /*
            this.tweens.add({
                targets: this.bindingPocket,
                scaleX: 1.20,
                duration: 2460,
                alpha: 1,
                ease: 'Sine',
                yoyo: true,
                repeat: -1
            });
    
            this.tweens.add({
                targets: this.bindingPocket,
                scaleY: 1.20,
                duration: 1064,
                alpha: 1,
                ease: 'Sine',
                yoyo: true,
                repeat: -1
            });
            */

        } else if (this.levelConfig.lvlType == "codon_transcription") {
            if (!optbtns) {
                optbtns = this.genCodonBtnOpts();
            }
            // On codon levels, we remove the ellipse and add in the APE sites.
            // We still need the ellipse for collision purposes though.
            this.ntHighlightEllipse.setAlpha(0);
            this.ntHighlightEllipse.setVisible(false);

            // Top to bottom each binding site, equally spaced by 120px (if scale is 1.2x)
            this.bindingSiteObjects = [];
            this.bindingSiteObjects.push(this.game.add.image(150, 363, "bindingsite").setDepth(3000).setScale(1.3).setAlpha(0.8));
            this.bindingSiteObjects.push(this.game.add.text(85, 410, "Accepter Site",
            {fontFamily: 'Teko', fontSize: '16pt', color: '#ffffff'}).setDepth(3000).setAlpha(1).setAngle(270));
            
            this.bindingSiteObjects.push(this.game.add.image(150, 494, "bindingsite").setDepth(0.5).setScale(1.3).setAlpha(1));
            this.bindingSiteObjects.push(this.game.add.text(85, 537, "Peptidyl Site",
            {fontFamily: 'Teko', fontSize: '16pt', color: '#ffffff'}).setDepth(0.5).setAlpha(1).setAngle(270));
        
            this.bindingSiteObjects.push(this.game.add.image(150, 625, "bindingsite").setDepth(3000).setScale(1.3).setAlpha(0.8));
            this.bindingSiteObjects.push(this.game.add.text(85, 654, "Exit Site",
            {fontFamily: 'Teko', fontSize: '16pt', color: '#ffffff'}).setDepth(3000).setAlpha(1).setAngle(270));

            for (let i = 0; i < this.bindingSiteObjects.length; i++) {
                // indices:
                // 0, 1 = top binding site
                // 2, 3 = middle binding site
                // 4, 5 = bottom binding site
                // "initialMovement" used to alternate site movement.
                let initialMovement = '';
                if (i == 2 || i == 3) {
                    initialMovement = '-=5';
                } else {
                    initialMovement = '+=5';
                }
                
                this.tweens.add({
                    targets: this.bindingSiteObjects[i],
                    duration: 2000,
                    x: initialMovement,
                    ease: 'Quad.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
            }
        }

        // Creates nucleotide buttons
        for (let i = 0; i < optbtns.length; i++) {
            this.makeBtn(optbtns[i]);
        }

        // Keyboard Controls (must be instantiated after creating level specific buttons)

        if (this.levelConfig.lvlType == "dna_replication") {
            this.input.keyboard.on('keydown-T', function(event) {
                this.onKeyboardInput(0);
            }, this);
    
            this.input.keyboard.on('keydown-A', function(event) {
                this.onKeyboardInput(1);
    
            }, this);
    
            this.input.keyboard.on('keydown-G', function(event) {
                this.onKeyboardInput(2);
    
            }, this);
    
            this.input.keyboard.on('keydown-C', function(event) {
                this.onKeyboardInput(3);
            }, this);
    
            this.input.keyboard.on('keydown-SPACE', function(event) {
                if (this.positionManager.ntTouchingBindingPocket() && this.rotateNT && this.buttonCurrent) {
                    console.log('keydown-SPACE, ntTouchingBindingPocket');
                    this.processNucleotideSubmission(this.buttonCurrent); 
                } 
            }, this);
        } else if (this.levelConfig.lvlType == "codon_transcription") {
            this.input.keyboard.on('keydown-ONE', function(event) {
                this.onKeyboardInput(0);
            }, this);
    
            this.input.keyboard.on('keydown-TWO', function(event) {
                this.onKeyboardInput(1);
            }, this);
    
            this.input.keyboard.on('keydown-THREE', function(event) {
                this.onKeyboardInput(2);
            }, this);
        }


        // Won't rotate buttons that don't need to be rotated.
        this.shuffleNTBtnAngle();

        this.scene.remove("levelcomplete" + this.level);

        this.scorekeeping.init();

        // window.cod = new Codon(this, "UAC");
        // window.cod.getObject();
        // window.cod.setPosition(200, 275);
    }

    start() {
        this.scorekeeping.start();
        this.positionManager.start();
        this.popupmanager.emitEvent("intro");
    }

    update() {
        // Allows background floaties to wrap
        this.physics.world.wrap(this.floaty, 50);
    }

    /**
     * Changes the context of the function `this` keyword to the class. Moves the `this` reference to the first parameter instead.
     * @param {function} fn - The function used to bind to the class
     */
    bindFn(fn) {
        let clas = this;
        return function (...args) {
            let event = this;
            fn.bind(clas, event, ...args)();
        };
    }

    /**
     * Makes a nucleotide or codon button
     * @param {string} type - the nucleotide type
     */
    makeBtn(type) {
        let nt = null;
        if (this.levelConfig.lvlType == "dna_replication") {
            nt = new Nucleotide(this, type, this.ntType);
            nt.setDisplay("nucleotide");
            nt.setPosition(this.btnLocationNucleotides[this.buttons.length][0], this.btnLocationNucleotides[this.buttons.length][1]);
        } else if (this.levelConfig.lvlType == "codon_transcription") {
            nt = new Codon(this, type);
            nt.setDisplay("codon");
            nt.setPosition(this.btnLocationCodons[this.buttons.length][0], this.btnLocationCodons[this.buttons.length][1]);
        }
        nt.setVisible(true);
        
        let scale = 0;
        if (this.levelConfig.lvlType == "dna_replication") {
            scale = 0.20;
            nt.setAngle(180);
        } else if (this.levelConfig.lvlType == "codon_transcription") {
            scale = .60;
            nt.setAngle(180);
        }
        nt.setScale(scale);
        nt.getObject().setInteractive();
        nt.showLetter(true);
        this.game.input.setDraggable(nt.getObject());
        this.game.input.on("dragstart", this.bindFn(this.onDragNTBtnStart));
        this.game.input.on("drag", this.bindFn(this.onDragNTBtn));
        this.game.input.on("dragend", this.bindFn(this.onDragNTBtnEnd));
        this.buttons.push(nt);
    }

    genCodonBtnOpts() {
        let head = this.positionManager.getHeadNucleotide(true);
        let codonOptions = ["U", "C", "A", "G"];
        let actualOptions = [head.matches];
        console.log(actualOptions);
        let maxOtherOptions;
        
        // This is a bit weird and undocumented, but there is an optional
        // variable that can be included in level config called 'maxButtons'.
        // This is to specify how many OTHER buttons to use in codon levels
        // besides the correct button choice.
        if (typeof this.levelConfig.maxButtons !== 'undefined') {
            maxOtherOptions = this.levelConfig.maxButtons;
        } else {
            maxOtherOptions = 2; // 2 by default
        }
        for (let i = 0; i < maxOtherOptions; i++) {
            let nt1 = this.getRandomInArray(codonOptions);
            let nt2 = this.getRandomInArray(codonOptions);
            let nt3 = this.getRandomInArray(codonOptions);
            let option = nt1 + nt2 + nt3;
            actualOptions.push(option);
        }
        console.log(actualOptions);
        return this.shuffleArray(actualOptions);
    }

    getRandomInArray(array) {
        return array[Math.floor(Math.random()*array.length)];
    }

    /**
     * Shuffles array in place.
     * @param {Array} a items An array containing the items.
     */
    shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /**
     * Shuffles the nucleotide button angle
     */
    shuffleNTBtnAngle() {
        if (!this.rotateNT) {
            return;
        }
        // We don't include 180 because we never want the nucleotide to
        // ever spawn with the already correct angle.
        let angles = [0, 90, 270];
        for (let i = 0; i < this.buttons.length; i++) {
            let angle = angles[Math.floor(Math.random()*angles.length)];
            this.buttons[i].setAngle(angle);
        }
    }

    /**
     * Shuffles nucleotide options. One correct from codon.
     */
    shuffleNTBtnOpts() {
        if (!this.positionManager.getHeadNucleotide(true)) {
            return;
        }
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].destroy();
        }
        this.buttons = [];
        let optbtns = this.genCodonBtnOpts();
        for (let i = 0; i < optbtns.length; i++) {
            this.makeBtn(optbtns[i]);
        }
        
    }

    /**
     * When nucleotide button gets dragged
     * @param {Phaser.Input.InputPlugin} input - input
     * @param {Phaser.Input.Pointer} pointer - The pointer
     * @param {Phaser.GameObjects.Image} image - the image
     */
    onDragNTBtnStart (input, pointer, image) {
        if (!this.ntBtnsEnabled) {
            return;
        }
        let leftButtonDown = pointer.leftButtonDown();
        if (!leftButtonDown) {
            return;
        }
        let x = pointer.x;
        let y = pointer.y;
        let angle = image.getData("nucleotide").getAngle();
        image.setData("pointerStartX", x);
        image.setData("pointerStartY", y);
        // image.setData("startAngle", angle);
        image.setData("startedDragging", true);
        image.setData("distanceDragged", 0);
    }

    /**
     * When the button gets dragged
     * @param {Phaser.Input.InputPlugin} input - input
     * @param {Phaser.Input.Pointer} pointer - The pointer
     * @param {Phaser.GameObjects.Image} image - the image
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     */
    onDragNTBtn (input, pointer, image, x, y) {
        if (!this.ntBtnsEnabled) {
            return;
        }
        let startedDragging = image.getData("startedDragging");
        if (!startedDragging) {
            return;
        }
        let leftButtonDown = pointer.leftButtonDown();
        if (!leftButtonDown) {
            return;
        }
        let imgX = image.getData("pointerStartX");
        let imgY = image.getData("pointerStartY");
        let pointerX = x;
        let pointerY = y;
        let distance = Math.sqrt(Math.pow(pointerX - imgX, 2) + Math.pow(pointerY - imgY, 2));
        image.setData("distanceDragged", distance);
    }

    /**
     * When dragging stops
     * @param {Phaser.Input.InputPlugin} input - input
     * @param {Phaser.Input.Pointer} pointer - The pointer
     * @param {Phaser.GameObjects.Image} image - the image
     */
    onDragNTBtnEnd (input, pointer, image) {
        let startedDragging = image.getData("startedDragging");
        if (!startedDragging) {
            return;
        }
        if (!this.ntBtnsEnabled) {
            return;
        }

        // Rotates 90 degrees if not dragged but tapped.
        let distance = image.getData("distanceDragged");
        if (distance < 15 && this.rotateNT) {
            this.rotateNucleotideButton(image.getData("nucleotide"));

        // Otherwise we're actually dragging and want to submit answer.
        } else if (this.positionManager.ntTouchingBindingPocket()) {
            //console.log('onDragNTBtnEnd(), ntTouchingBindingPocket');
            let angle = image.angle;
            let clickedNT = image.getData("nucleotide");
            this.processNucleotideSubmission(clickedNT, angle);

            if (this.levelConfig.lvlType == "dna_replication" && !this.rotateNT) {
                // Default angle nucleotide respawns with in a non-rotational level.
                image.getData("nucleotide").setAngle(180);
            }
        }
        image.setData("startedDragging", false);
    }

    /**
     * Processes the keyboard input depending on nucleotide level type.
     * @param {int} num- Numbers 1-4, depending on which button (1 = top button) we want to rotate/submit.
     */
    onKeyboardInput(num) {
        this.buttonCurrent = this.buttons[num];
        if (this.positionManager.ntTouchingBindingPocket() && !this.rotateNT) {
            console.log('onKeyboardInput(), ntTouchingBindingPocket');
            this.processNucleotideSubmission(this.buttonCurrent);
        } else if (this.rotateNT) {
            this.rotateNucleotideButton(this.buttonCurrent);
        }
    }

    /**
     * Rotates nucleotide, intended for button controls.
     * @param {nucleotide} ntButton- Nucleotide button to be rotated.
     */
    rotateNucleotideButton(ntButton) {
        ntButton.setAngle(ntButton.getAngle() + 90);
        // console.log("Angle set to " + nt.getAngle());
    }

    /**
     * Processes logic for nucleotide submissions
     * @param {nucleotide} submission - Nucleotide we're trying to submit
     * @param {int} angle - Optional angle for rotation levels
     */
    processNucleotideSubmission(submission, angle = 0) {
        //console.log('processNucleotideSubmission()');
        let headNT = this.positionManager.getHeadNucleotide();
        let cloned = submission.clone();
        if (this.levelConfig.lvlType == "dna_replication") {
            cloned.setDisplay("nucleotide");
        } else {
            cloned.setDisplay("codon");
        }
        cloned.setPosition(submission.getObject().x, submission.getObject().y);
        cloned.setVisible(true);
        cloned.setScale(0.18);
        cloned.setAngle(submission.getAngle());
        this.shuffleNTBtnAngle();
        this.ntBtnsEnabled = false;

        if (!submission.validMatchWith(headNT) || (this.rotateNT && cloned.getAngle() != -180)) {

            // Wrong Match
            let correctnt = this.positionManager.getValidMatchNT(headNT);
            this.popupmanager.emitEvent("errorMatch", headNT, correctnt);
            this.popupmanager.emitEvent("error5Match", headNT, correctnt);
            cloned.setError(true);
            this.scorekeeping.incrementIncorrectSequences();
            this.audioplayer.playIncorrectSound();

        } else {

            // Correct Match
            this.popupmanager.emitEvent("correctMatch", headNT, cloned);
            this.popupmanager.emitEvent("firstCorrectMatch", headNT, cloned);
            this.scorekeeping.incrementSequencesMade();
            this.audioplayer.playCorrectSound();
            let headNTName = null;
            let pairNTName = null;
            if (this.levelConfig.lvlType == "dna_replication") {
                headNTName = headNT.getShortName();
                pairNTName = cloned.getShortName();
            } else if (this.levelConfig.lvlType == "codon_transcription") {
                headNTName = headNT.nucleotides[0].getShortName();
                pairNTName = cloned.nucleotides[0].getShortName();
            }

            // Particle explosion upon correct match
            let that = this;
            this.game.time.addEvent({
                delay: 100,
                loop: false,
                callback: function () {
                    that.ntparticle[headNTName].resume();
                    that.ntparticle[headNTName].explode(50);
                    that.game.time.addEvent({
                        delay: 100,
                        callback: function () {
                            that.ntparticle[pairNTName].resume();
                            that.ntparticle[pairNTName].explode(50);
                        },
                        loop: false
                    });
                }
            });
        }
        this.positionManager.addToDNAOutput(cloned);
    }

    /**
     * Ends the level. show level complete screen
     */
    endGame() {
        if (this.gameEnded) {
            return;
        }
        this.gameEnded = true;
        let sceneName = "levelcomplete" + this.level;
        let levelSceneName = "level" + this.level;
        let nucleotides = this.positionManager.selectedNucleotides.filter(function (el) {
            return el != null;
        });
        this.scene.add(sceneName, LevelComplete, false, {
            level: this.level,
            lvlType: this.levelConfig.lvlType,
            gameObj: this.gameObj,
            nucleotides: nucleotides,
            score: this.scorekeeping.getScore(),
            accuracy: this.scorekeeping.getAccuracy(),
            quiz: this.levelConfig.quiz,
            sequencedinfo: this.levelConfig.sequencedinfo,
            knowledgepanel: this.levelConfig.knowledgepanel,
        });

        // Adds current score to global score
        this.data.gameObj.GLOBAL_SCORE += this.scorekeeping.getScore();

        let that = this;
        this.time.addEvent({
            delay: 300,
            loop: false,
            callback: function () {
                that.scene.launch(sceneName);
                that.scene.pause();
                that.scene.moveAbove(levelSceneName, sceneName);
                that.popupmanager.destroy();
            }
        });
        
    }

    /**
     * Generates floaties that randomly move and grow/shrink in the background.
     * @param {INT} n - How many floaties to spawn.
     * @returns {Array} - An array with all the floaties.
     */    
    spawnBackgroundFloaties(n) {
        let allFloaties = [];
        for (let i = 0; i < n; i++) {
            // Settings for background floaties
            let maxScale = 0.20 * Math.random(); // their potential max size
            let maxSpeed = 35; // their potential max speed
            let screenWidth = 360; // width of box to randomly spawn floaties
            let screenHeight = 720; // height of box to randomly spawn floaties

            let myFloaty = this.floaty.create(screenWidth * Math.random(), screenHeight * Math.random(), 'fluff');
            myFloaty.setScale(maxScale).setDepth(0.5).setAlpha(0.15);

            // Randoly sets speed to some percentage of its max speed, in a random direction
            myFloaty.setVelocity(Phaser.Math.Between(-maxSpeed * Math.random(), maxSpeed * Math.random()), 
                                 Phaser.Math.Between(-maxSpeed * Math.random(), maxSpeed * Math.random()));
            
            this.tweens.add({
                targets: myFloaty,
                maxScale: maxScale + 0.07,
                duration: 1000 + (Math.random() * 5000),
                ease: 'Power1',
                yoyo: true,
                repeat: -1
            });
            allFloaties.push(myFloaty);
        }
    }
}

export default LevelStage;
