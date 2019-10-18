import GameScore from "../gamescore.js";
import PopupManager from "../popupmanager.js";
import Nucleotide from "../nucleotide.js";
import PositionManager from "../positionmanager.js";
import LevelComplete from "./levelcomplete.js";
import Codon from "../codon.js";

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
        this.ntButtons = [];
        this.btnLocations = {
            0: [310, 340],
            1: [310, 440],
            2: [310, 540],
            3: [310, 640]
        }
        this.ntBtnsEnabled = true;
        this.scorekeeping = new GameScore(this.game);
        this.popupmanager = new PopupManager(this);

        this.camera = this.game.cameras.cameras[0];
        this.graphics = this.game.add.graphics();

        // Sound Effects
        this.incorrectSound = game.sound.add("incorrect");
        this.correctSound = game.sound.add("correct");

        // Background
        this.graphics.fillStyle(BLACK, 1.0);
        this.graphics.fillRect(0, 0, 360, 740);

        //this.game.add.image(180, 360, "bg").setAlpha(0.5);

        //let bgtile = this.add.tileSprite(0, 42, 360, 740, "bg");
        /*let background = game.add.tileSprite(0,
            this.game.height - this.game.cache.getImage("bg").height,
            this.game.width,
            this.game.cache.getImage("bg").height,
            "bg");
        */

        // Header background space
        this.graphics.fillStyle(WHITE, 1);
        this.graphics.fillRect(0, 0, 360, 42);

        // Header logos
        this.game.add.image(75, 30, "logo_dogma").setScale(0.15).setDepth(1);
        this.game.add.image(300, 22, "logo_isb").setScale(0.15).setDepth(1);

        // UI Colored Boxes
        this.graphics.fillStyle(DARK_BLUE, 1.0);
        this.graphics.fillRect(15, 50, 75, 45).setDepth(0.5);

        this.graphics.fillStyle(ORANGE, 1.0);
        this.graphics.fillRect(100, 50, 75, 45).setDepth(0.5);

        this.graphics.fillStyle(GOLD, 1.0);
        this.graphics.fillRect(185, 50, 160, 45).setDepth(0.5);

        // UI Labels
        // '\'Open Sans\', sans-serif'
        this.game.add.text(29, 53, "REMAINING", 
            {fontFamily: 'Teko', fontSize: '10pt', color: '#FFFFFF'}).setDepth(1);

        this.game.add.text(116, 53, "ACCURACY", 
            {fontFamily: 'Teko', fontSize: '10pt', color: '#FFFFFF'}).setDepth(1);

        this.game.add.text(195, 62, "SCORE:", 
            {fontFamily: 'Teko', fontSize: '20pt', color: '#FFFFFF'}).setDepth(1);

        if (this.levelConfig.lvlType == "dna_replication") {
            this.game.add.text(4, 105, "5'", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});
            
            this.game.add.text(345, 105, "3'", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});
        }

        this.game.add.text(4, 150, "3'", 
            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

        this.game.add.text(4, 530, "5'", 
            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

        this.game.add.text(257, 497, "5'", 
            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

        this.game.add.text(340, 690, "3'", 
            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});
        
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
        this.ntHighlightEllipse = this.game.add.ellipse(160, 490, 230, 125, 0xfffaa8, 1);
        this.ntHighlightEllipse.setDepth(1);
        this.ntHighlightEllipse.setAngle(16);
        this.ntHighlightEllipse.setAlpha(1.0);

        // Conditional rendering for each level type
        if (this.levelConfig.lvlType == "dna_replication") {
            if (!optbtns) {
                optbtns = ["T", "A", "G", "C"];
            }

            // Label for the now visible binding pocket.
            this.game.add.text(90, 534, "Binding Pocket", 
            {fontFamily: 'Teko', fontSize: '12pt', color: '#FFFFFF'}).setDepth(1).setAngle(19);

        } else if (this.levelConfig.lvlType == "codon_transcription") {
            if (!optbtns) {
                optbtns = this.genCodonBtnOpts();
            }
            // On codon levels, we remove the ellipse and add in the APE sites.
            // We still need the ellipse for collision purposes though.
            this.ntHighlightEllipse.setAlpha(0);

            // Top to bottom each binding site, equally spaced by 120px (if scale is 1.2x)
            this.game.add.image(60, 373, "bindingsite").setDepth(1).setScale(1.2).setAlpha(0.25);
            this.game.add.text(120, 335, "A",
            {fontFamily: 'Teko', fontSize: '60pt', color: '#FFFFFF'}).setDepth(2).setAlpha(0.75);

            this.game.add.image(60, 493, "bindingsite").setDepth(1).setScale(1.2).setAlpha(0.25);
            this.game.add.text(120, 455, "P",
            {fontFamily: 'Teko', fontSize: '60pt', color: '#FFFFFF'}).setDepth(2).setAlpha(0.75);

            this.game.add.image(60, 613, "bindingsite").setDepth(1).setScale(1.2).setAlpha(0.25);
            this.game.add.text(120, 575, "E",
            {fontFamily: 'Teko', fontSize: '60pt', color: '#FFFFFF'}).setDepth(2).setAlpha(0.75);
        }

        for (let i = 0; i < optbtns.length; i++) {
            this.makeNTBtn(optbtns[i]);
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
     * Makes a nucleotide button
     * @param {string} type - the nucleotide type
     */
    makeNTBtn(type) {
        let nt = null;
        if (this.levelConfig.lvlType == "dna_replication") {
            nt = new Nucleotide(this, type, this.ntType);
            nt.setDisplay("nucleotide");
        } else if (this.levelConfig.lvlType == "codon_transcription") {
            nt = new Codon(this, type);
            nt.setDisplay("codon");
        }
        nt.setVisible(true);
        nt.setPosition(this.btnLocations[this.ntButtons.length][0], this.btnLocations[this.ntButtons.length][1]);
        let scale = 0;
        if (this.levelConfig.lvlType == "dna_replication") {
            scale = 0.20;
            nt.setAngle(180); // Makes button face correct way.
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
        this.ntButtons.push(nt);
    }

    genCodonBtnOpts() {
        let head = this.positionManager.getHeadNucleotide(true);
        let codonOptions = ["U", "C", "A", "G"];
        let actualOptions = [head.matches];
        for (let i = 0; i < 2; i++) {
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
        let angles = [0, 90, 180, 270];
        for (let i = 0; i < this.ntButtons.length; i++) {
            let angle = angles[Math.floor(Math.random()*angles.length)];
            this.ntButtons[i].setAngle(angle);
        }
    }

    /**
     * Shuffles nucleotide options. One correct from codon.
     */
    shuffleNTBtnOpts() {
        if (!this.positionManager.getHeadNucleotide(true)) {
            return;
        }
        for (let i = 0; i < this.ntButtons.length; i++) {
            this.ntButtons[i].destroy();
        }
        this.ntButtons = [];
        let optbtns = this.genCodonBtnOpts();
        for (let i = 0; i < optbtns.length; i++) {
            this.makeNTBtn(optbtns[i]);
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
            let nt = image.getData("nucleotide");
            nt.setAngle(nt.getAngle() + 90);
            console.log("Angle set to " + nt.getAngle());

        // Otherwise we're actually dragging
        } else if (this.positionManager.ntTouchingBindingPocket()) {

            let angle = image.angle;
            let clickedNT = image.getData("nucleotide");
            let headNT = this.positionManager.getHeadNucleotide();
            let cloned = clickedNT.clone();
            if (this.levelConfig.lvlType == "dna_replication") {
                cloned.setDisplay("nucleotide");
            } else {
                cloned.setDisplay("codon");
            }
            cloned.setPosition(clickedNT.getObject().x, clickedNT.getObject().y);
            cloned.setVisible(true);
            cloned.setScale(0.18);
            cloned.setAngle(clickedNT.getAngle());
            this.shuffleNTBtnAngle();
            this.ntBtnsEnabled = false;


            if (!clickedNT.validMatchWith(headNT) || (this.rotateNT && cloned.getAngle() != -180)) {
                
                // Wrong Match
                let correctnt = this.positionManager.getValidMatchNT(headNT);
                this.popupmanager.emitEvent("errorMatch", headNT, correctnt);
                this.popupmanager.emitEvent("error5Match", headNT, correctnt);
                cloned.setError(true);
                this.scorekeeping.incrementIncorrectSequences();
                this.incorrectSound.play();

            } else {

                // Correct Match
                this.popupmanager.emitEvent("correctMatch", headNT, cloned);
                this.popupmanager.emitEvent("firstCorrectMatch", headNT, cloned);
                this.scorekeeping.incrementSequencesMade();
                this.correctSound.play();
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
            if (this.levelConfig.lvlType == "dna_replication") {
                // Default angle nucleotide respawns with in a non-rotational level.
                image.getData("nucleotide").setAngle(180);
            }
        }
        image.setData("startedDragging", false);
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

    spawnBackgroundParticles(amount) {
        let velocityX;
        let velocityY;
        let scale;
        for (let i = 0; i <= amount; i++) {
            velocityX = Math.random() * 100;
            velocityY = Math.random() * 100;
            scale = Math.random();
            let particle = this.physics.add.sprite();
            particle.setScale(scale)
            particle.setVelocityX(velocityX);
            particle.setVelocityY(velocityY);
            // Create particle circle with a random size
            // Assign it a random direction and speed
            // Make sure it has no collision
            // And can loop around off screen
        }
    }
}

export default LevelStage;
