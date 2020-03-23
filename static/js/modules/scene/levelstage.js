import GameScore from "../gamescore.js";
import PopupManager from "../popupmanager.js";
import Nucleotide from "../nucleotide.js";
import PositionManager from "../positionmanager.js";
import LevelComplete from "./levelcomplete.js";
import Codon from "../codon.js";
import AudioPlayer from "../audioplayer.js";

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
        this.game.globalscore = data.gameObj.GLOBAL.SCORE;
        this.scorekeeping = new GameScore(this.game);
        this.popupmanager = new PopupManager(this);

        this.camera = this.game.cameras.cameras[0];

        // Main graphics object to draw some of the HUD with.
        this.graphics = this.game.add.graphics();

        // Secondary graphics object to draw with,
        // We need this to render HUD that needs to cover gameplay objects.
        this.graphicsOverlay = this.game.add.graphics();
        this.graphicsOverlay.setDepth(100);

        // Sound Effects
        this.audioplayer = new AudioPlayer();

        // Stops any previously playing music and starts music
        this.game.sound.stopAll();
        this.audioplayer.playRandomBgMusic();
        console.log("player music");

        // Background floaties
        this.floaty = this.physics.add.group();
        this.backgroundFloaties = this.spawnBackgroundFloaties(15);
        //this.floaterSpawner = new BackgroundFloater(this);
        //this.backgroundFloaties = this.floaterSpawner.spawnBackgroundFloaties(15);

        // Background Color
        this.graphics.fillStyle(BLACK, 1.0);
        this.graphics.fillRect(0, 0, 360, 740);

        // Header background space
        this.graphicsOverlay.fillStyle(WHITE, 1);
        this.graphicsOverlay.fillRect(0, 0, 360, 42);

        // Additional black space on codon levels to block out codons from behind the UI.
        if (this.levelConfig.lvlType == "codon_transcription") {
            this.graphicsOverlay.fillStyle(BLACK, 1);
            this.graphicsOverlay.fillRect(0, 42, 360, 68); 
        }

        // Header logos
        this.game.add.image(75, 30, "logo_dogma").setScale(0.15).setDepth(101);
        this.game.add.image(300, 22, "logo_isb").setScale(0.15).setDepth(101);

        // UI Colored Boxes
        this.graphicsOverlay.fillStyle(DARK_BLUE, 1.0);
        this.graphicsOverlay.fillRect(15, 65, 75, 45);

        this.graphicsOverlay.fillStyle(DARK_BLUE, 1.0);
        this.graphicsOverlay.fillRect(100, 65, 75, 45);

        this.graphicsOverlay.fillStyle(ORANGE, 1.0);
        this.graphicsOverlay.fillRect(185, 65, 115, 45);


        // UI Labels
        // '\'Open Sans\', sans-serif'
        this.game.add.text(29, 68, "REMAINING", 
            {fontFamily: 'Teko, sans-serif', fontSize: '10pt', color: '#FFFFFF'}).setDepth(105);

        this.game.add.text(116, 68, "ACCURACY", 
            {fontFamily: 'Teko, sans-serif', fontSize: '10pt', color: '#FFFFFF'}).setDepth(105);

        this.game.add.text(195, 68, "SCORE", 
            {fontFamily: 'Teko, sans-serif', fontSize: '10pt', color: '#FFFFFF'}).setDepth(105);

        // Level Name
        this.game.add.text(16, 45, "LV. " + (this.data.lvlNum + 1) + ": " + this.data.level.name, 
            {fontFamily: 'Teko, sans-serif', fontSize: '14pt', color: '#FFFFFF'}).setDepth(105);

        // Pause Button
        this.pauseBtn = this.game.add.image(330, 87, "pause_btn").setDepth(101).setScale(0.23).setInteractive();
        this.pauseBtn.addListener("pointerdown", this.bindFn(function(){
            this.audioplayer.playClickSound();
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
            gravityY: 800,
            tint: 0xFFFFFF // white by default
        };
        this.ntparticle = {
            "adenine": this.add.particles("ntparticle_adenine").createEmitter(ntParticleConfig),
            "cytosine": this.add.particles("ntparticle_cytosine").createEmitter(ntParticleConfig),
            "guanine": this.add.particles("ntparticle_guanine").createEmitter(ntParticleConfig),
            "thymine": this.add.particles("ntparticle_thymine").createEmitter(ntParticleConfig),
            "uracil": this.add.particles("ntparticle_thymine").createEmitter(ntParticleConfig),
            "white": this.add.particles("ntparticle_white").createEmitter(ntParticleConfig),
            "tinted": this.add.particles("ntparticle_white").createEmitter(ntParticleConfig)
        }

        for (let i = 0; i < Object.keys(this.ntparticle).length; i++) {
            let nt = Object.keys(this.ntparticle)[i];
            this.ntparticle[nt].manager.setDepth(5000);
        }

        // Adds in nucleotide/codon sequence
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
        /*
        this.tweens.add({
            targets: this.ntHighlightEllipse,
            scale: 1.05,
            duration: 1000,
            alpha: 1,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });*/


        // Conditional rendering for each level type
        if (this.levelConfig.lvlType == "dna_replication") {
            if (!optbtns) {
                optbtns = ["T", "A", "G", "C"];
            }

            // Creating appropriate UI behind nucleotide buttons depending on how many nucleotides there are
            this.createThreeBorderRectangle(260, 285, 100, 102.5 * optbtns.length, WHITE, WHITE);

            // Top UI Box Label
            let topLabel = "";
            this.levelConfig.rotateNT ? topLabel = "TAP TO ROTATE\nSWIPE TO SUBMIT" : topLabel = "\nTAP/SWIPE"
            if (this.levelConfig.rotateNT) {
                this.game.add.image(275, 220, "tapIcon").setScale(0.2);
                this.game.add.text(290, 220, "TO", 
                    {fontFamily: 'Teko, sans-serif', fontSize: '16pt', color: '#FFFFFF'}).setDepth(105);
                this.game.add.image(322, 225, "rotateIcon").setScale(0.15);
                this.game.add.image(275, 260, "swipeIcon").setScale(0.2);
                this.game.add.text(290, 260, "TO SUBMIT", 
                    {fontFamily: 'Teko, sans-serif', fontSize: '16pt', color: '#FFFFFF'}).setDepth(105);
            } else {
                this.game.add.image(283, 245, "tapIcon").setScale(0.2);
                this.game.add.text(298, 245, "OR", 
                    {fontFamily: 'Teko, sans-serif', fontSize: '16pt', color: '#FFFFFF'}).setDepth(105);
                this.game.add.image(328, 245, "swipeIcon").setScale(0.2);
                this.game.add.text(273, 265, "TO SUBMIT", 
                    {fontFamily: 'Teko, sans-serif', fontSize: '16pt', color: '#FFFFFF'}).setDepth(105);
            }

            // Bottom UI Box Label
            this.game.add.text(273, 290 + (102.5 * optbtns.length), "Nucleotides", 
                {fontFamily: 'Teko, sans-serif', fontSize: '16pt', color: '#000000'}).setDepth(105);
            this.graphicsOverlay.fillStyle(WHITE, 1.0);
            this.graphicsOverlay.fillRoundedRect(268, 287 + (102.5 * optbtns.length), 83, 27, 10);

            // Label for binding pocket.
            /*
            this.game.add.text(90, 534, "Binding Pocket",
            {fontFamily: 'Teko', fontSize: '12pt', color: '#FFFFFF'}).setDepth(1).setAngle(19);
            */
            this.game.add.text(100, 460, "Binding Pocket",
            {fontFamily: 'Teko', fontSize: '12pt', color: '#FFFFFF'}).setDepth(1);

            // Binding pocket
            this.bindingPocket = this.game.add.image(170, 400, "bindingpocket");
            //this.bindingPocket.setAngle(16);
            this.bindingPocket.setDepth(1000);
            this.bindingPocket.setScale(0.75)

            // WW: just visualize the bounding box for debugging purposes
            
            /*
            var bb = this.bindingPocket;
            this.bbox = this.game.add.rectangle(bb.x, bb.y, bb.width, bb.height,
                                                0xff0000);
            this.bbox.setScale(bb.scale);
            this.bbox.setVisible(true);
            this.bbox.setDepth(1001);
            this.bbox.setAlpha(0.5);
            */

            this.tweens.add({
                targets: this.bindingPocket,
                alpha: 0.5,
                duration: 1000,
                ease: 'linear',
                yoyo: true,
                repeat: -1
            });

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
            this.bindingSiteObjects.push(this.game.add.image(150, 363, "bindingsite").setDepth(3000).setScale(1.3).setAlpha(0.6));
            this.bindingSiteObjects.push(this.game.add.text(85, 410, "Accepter Site",
            {fontFamily: 'Teko', fontSize: '16pt', color: '#ffffff'}).setDepth(3000).setAlpha(1).setAngle(270));
            
            this.bindingSiteObjects.push(this.game.add.image(150, 494, "bindingsite").setDepth(1).setScale(1.3).setAlpha(0.85));
            this.bindingSiteObjects.push(this.game.add.text(85, 537, "Peptidyl Site",
            {fontFamily: 'Teko', fontSize: '16pt', color: '#ffffff'}).setDepth(1).setAlpha(1).setAngle(270));
        
            this.bindingSiteObjects.push(this.game.add.image(150, 625, "bindingsite").setDepth(3000).setScale(1.3).setAlpha(0.6));
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

            // Creating appropriate UI behind amino acid buttons
            this.createThreeBorderRectangle(230, 340, 131, 270, WHITE, WHITE);

            // Top UI Box Label
            this.game.add.image(273, 285, "tapIcon").setScale(0.2);
            this.game.add.text(288, 285, "OR", 
                {fontFamily: 'Teko, sans-serif', fontSize: '16pt', color: '#FFFFFF'}).setDepth(105);
            this.game.add.image(318, 285, "swipeIcon").setScale(0.2);
            this.game.add.text(263, 305, "TO SUBMIT", 
                {fontFamily: 'Teko, sans-serif', fontSize: '16pt', color: '#FFFFFF'}).setDepth(105);

                
            // Bottom UI Box Label
            this.game.add.text(255, 615, "Amino Acids", 
            {fontFamily: 'Teko, sans-serif', fontSize: '16pt', color: '#000000'}).setDepth(105);
            this.graphics.fillStyle(WHITE, 1.0);
            this.graphics.fillRoundedRect(250, 610, 85, 27, 10);
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

        // Start initial quiz screen (if education is active)
        if (this.data.gameObj.GLOBAL.ACTIVE_EDUCATION) {
            this.scene.pause();
            this.scene.launch('quizScreen', this);
        }
        


        // Starts actual game
        
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
        console.log(this.data);
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
    }

    /**
     * Processes logic for nucleotide submissions
     * @param {nucleotide} submission - Nucleotide we're trying to submit
     * @param {int} angle - Optional angle for rotation levels
     */
    processNucleotideSubmission(submission, angle = 0) {
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
                // on codon levels, it'll just pick the first nucleotide in
                // the codon to base its colors off of.
                headNTName = headNT.nucleotides[0].getShortName();
                pairNTName = cloned.nucleotides[0].getShortName();
            }

            
            // Particle explosion upon correct match
            let that = this;
            let particle1, particle2; // particles to explode upon correct match.

            if (this.levelConfig.lvlType == "dna_replication") {    
                particle1 = that.ntparticle[headNTName];
                particle2 = that.ntparticle[pairNTName];
            } else if (this.levelConfig.lvlType == "codon_transcription") {
                // we define particle1 and particle2 to be different on codon levels
                // because codons consist of three nucleotides.. would make sense to
                // use amino acid color instead.

                // get the letters of the 3 nucleotides that make up the codon.
                let codonLetters = "";
                for (let i = 0; i < 3; i++) {
                    codonLetters += cloned.nucleotides[i].getShortName()[0].toUpperCase();
                }

                // creates a temporary codon in order to lookup its amino acid color
                let codonLookup = new Codon(this, codonLetters);
                let aminoAcidCode = codonLookup.allCodons[codonLetters];

                // color of amino acid in decimal form.
                let aminoAcidColorCode = codonLookup.allAmminoAcids[aminoAcidCode].color
                aminoAcidColorCode = "0x" + aminoAcidColorCode.toString(16);

                // Actually tinting and setting particle emitters
                that.ntparticle["tinted"].tint.onChange(aminoAcidColorCode);
                particle1 = that.ntparticle["tinted"];
                particle2 = that.ntparticle["white"];
                
            }

            this.game.time.addEvent({
                delay: 100,
                loop: false,
                callback: function () {
                    particle1.resume();
                    particle1.explode(50);
                    that.game.time.addEvent({
                        delay: 100,
                        callback: function () {
                            particle2.resume();
                            particle2.explode(50);
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
            correctCount: this.scorekeeping.sequencesMade,
            accuracy: this.scorekeeping.getAccuracy(),
            quiz: this.levelConfig.quiz,
            sequencedinfo: this.levelConfig.sequencedinfo,
            knowledgepanel: this.levelConfig.knowledgepanel,
        });

        // Adds current score to global score
        this.data.gameObj.GLOBAL.SCORE += this.scorekeeping.getScore();

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

    /**
     * Draws a rectangle with the left border missing
     * @param {INT} x - X-coordinate of the top left corner.
     * @param {INT} y - Y-coordinate of the top left corner.
     * @param {INT} width - Width of entire rectangle.
     * @param {INT} height - Height of entire rectangle.
     * @param {HEXCODE} fillColor - Color to fill rectantle with.
     * @param {HEXCODE} borderColor - Color to border rectantle with.
     */  
    createThreeBorderRectangle(x, y, width, height, fillColor, borderColor) {
        // Creating appropriate UI behind nucleotide buttons depending on how many nucleotides there are
        this.graphics.fillStyle(fillColor, 0.15);
        this.graphics.fillRect(x, y, width, height);
        
        // Line top
        this.graphics.lineStyle(5, borderColor, 1.0);
        this.graphics.beginPath();
        this.graphics.moveTo(x, y);
        this.graphics.lineTo(x + width, y);
        this.graphics.closePath();
        this.graphics.strokePath();

        // Line right
        this.graphics.lineStyle(5, borderColor, 1.0);
        this.graphics.beginPath();
        this.graphics.moveTo(x + width, y);
        this.graphics.lineTo(x + width, y + height);
        this.graphics.closePath();
        this.graphics.strokePath();

        // Line bottom
        this.graphics.lineStyle(5, borderColor, 1.0);
        this.graphics.beginPath();
        this.graphics.moveTo(x + width, y + height);
        this.graphics.lineTo(x, y + height);
        this.graphics.closePath();
        this.graphics.strokePath();
    }
}

export default LevelStage;
