(function () {
    "use strict";

    /**
     * When called, it resizes the Canvas on the page so that
     * it would scale porportionally to the width and height.
     * That would look good on all devices width and height.
     */
    function resizeCanvas() {
        let mainWidth = 360;
        let mainHeight = 740;
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
        let tRatio = mainWidth / screenWidth;
        let tProportionalHeight = mainHeight / tRatio;
        tRatio = mainHeight / screenHeight;
        let tProportionalWidth = mainWidth / tRatio;
        if (tProportionalHeight > screenHeight) {
            mainWidth = tProportionalWidth;
            mainHeight = screenHeight;
        } else {
            mainWidth = screenWidth;
            mainHeight = tProportionalHeight;
        }
        let main = document.querySelector("main");
        main.style.height = mainHeight + "px";
        main.style.width = mainWidth + "px";
    }

    resizeCanvas();
    window.addEventListener("resize", function () {
        resizeCanvas();
    });

    class Game {
        constructor (levels) {
            this.config = {
                type: Phaser.CANVAS,
                canvas: document.getElementsByTagName("canvas")[0],
                width: 360,
                height: 740,
                backgroundColor: "#fff",
                scene: {
                    preload: this.bindFn(this.preload),
                    create: this.bindFn(this.create),
                }
            }
            this.scorekeeping = null;
            this.levels = levels;
            this.level = 0;
            this.objects = {};
            this.nucleotides = [];
            this.ntButtons = [];
            this.btnLocations = {
                0: [310, 420],
                1: [310, 490]
            }
            this.ntBtnsEnabled = true;
        }

        bindFn(fn) {
            let clas = this;
            return function (...args) {
                let event = this;
                fn.bind(clas, event, ...args)();
            };
        }

        preload(gameObj) {
            this.game = gameObj;
            this.game.load.image("logo_dogma", "static/img/DOGMA_logo.png");
            this.game.load.image("logo_isb", "static/img/ISB_Logo.png");
            
            this.game.load.image("nt_adenine_backbone", "static/img/nucleotide/adenine/Adenine_Backbone@3x.png");
            this.game.load.image("nt_adenine_basic", "static/img/nucleotide/adenine/Adenine_basic@3x.png");
            this.game.load.image("nt_adenine_hbonds", "static/img/nucleotide/adenine/Adenine_Hbonds@3x.png");

            this.game.load.image("nt_thymine_backbone", "static/img/nucleotide/thymine/Thymine_Backbone@3x.png");
            this.game.load.image("nt_thymine_basic", "static/img/nucleotide/thymine/Thymine_basic@3x.png");
            this.game.load.image("nt_thymine_hbonds", "static/img/nucleotide/thymine/Thymine_Hbonds@3x.png");
            this.scorekeeping = new GameScore(this.game);
        }

        create() {
            this.graphics = this.game.add.graphics();
            this.game.add.image(75, 30, "logo_dogma").setScale(0.15);
            this.game.add.image(300, 22, "logo_isb").setScale(0.15);
            
            this.graphics.fillStyle(0xF1F1F2, 1.0);
            this.graphics.fillRect(0, 100, 360, 640);

            this.graphics.fillStyle(0xE5F7FD, 1.0);
            this.graphics.fillRect(15, 50, 75, 45);

            this.graphics.fillStyle(0xEFEAF4, 1.0);
            this.graphics.fillRect(100, 50, 75, 45);

            this.graphics.fillStyle(0xF3F9EC, 1.0);
            this.graphics.fillRect(185, 50, 75, 45);

            this.graphics.fillStyle(0xFDE8E9, 1.0);
            this.graphics.fillRect(270, 50, 75, 45);

            this.game.add.text(18, 53, "Sequence NTs", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(102, 53, "Rate [NTs/min]", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(200, 53, "Accuracy", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(293, 53, "Score", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            let nucleotides = this.levels[this.level].ntSequence;
            for (let i = 0; i < nucleotides.length; i++) {
                let nucleotide = new Nucleotide(this.game, nucleotides[i], "basic");
                this.nucleotides.push(nucleotide);
            }
            
            this.positionManager = new PositionManager(this, this.nucleotides);
            this.positionManager.setPositions(false);

            this.makeNTBtn("T");
            this.makeNTBtn("A");

            this.scorekeeping.start();
        }

        makeNTBtn(type) {
            let nt = new Nucleotide(this.game, type, "basic");
            nt.setDisplay("nucleotide");
            nt.setVisible(true);
            nt.setPosition(this.btnLocations[this.ntButtons.length][0], this.btnLocations[this.ntButtons.length][1]);
            nt.getObject().setScale(0.18);
            nt.getObject().setInteractive();
            nt.getObject().on("pointerup", this.bindFn(this.onNTBtnClick));
            this.ntButtons.push(nt);
        }

        onNTBtnClick(image, pointer, localX, localY) {
            if (!this.ntBtnsEnabled) {
                return;
            }
            let clickedNT = image.getData("nucleotide");
            let headNT = this.positionManager.getHeadNucleotide();
            if (clickedNT.validMatchWith(headNT)) {
                this.ntBtnsEnabled = false;
                let cloned = clickedNT.clone();
                cloned.setDisplay("nucleotide");
                cloned.setPosition(clickedNT.getObject().x, clickedNT.getObject().y);
                cloned.setVisible(true);
                cloned.getObject().setScale(0.18);
                this.positionManager.addToDNAOutput(cloned);
            } else {
                console.log("INVALID")
            }
        }
    }

    class PositionManager {
        constructor (gameObj, levelNucleotides) {
            this.gameObj = gameObj;
            this.game = gameObj.game;
            this.levelNucleotides = Array.from(levelNucleotides);
            this.selectedNucleotides = [];

            this.gameObj.graphics.lineStyle(1, 0x6c757d, 0.6);
            this.inputRowPath = new Phaser.Curves.Path(320, 125);
            this.inputRowPath.lineTo(40, 125);
            this.inputRowPath.lineTo(40, 140);
            this.inputRowPath.lineTo(165, 140);
            this.inputRowPath.draw(this.gameObj.graphics);
            this.initRectPathPts = this.inputRowPath.getSpacedPoints(30);
            this.inputVertPath = new Phaser.Curves.Path(182, 147);
            this.inputVertPath.cubicBezierTo(25, 640, 320, 320, 15, 440);
            this.inputVertPath.draw(this.gameObj.graphics);
            let numVertPathPts = 7;
            this.initVertPathPts = this.inputVertPath.getPoints(numVertPathPts).slice(0, numVertPathPts - 1);
            this.outputVertPath = new Phaser.Curves.Path(245, 450);
            this.outputVertPath.cubicBezierTo(145, 710, 180, 600, 100, 700);
            this.outputVertPath.draw(this.gameObj.graphics);
            this.outputVertPathPts = this.outputVertPath.getPoints(5);
            this.outputRowPath = new Phaser.Curves.Path(155, 710);
            this.outputRowPath.lineTo(370, 710);
            this.outputRowPath.draw(this.gameObj.graphics);
            this.outputRowPathPts = this.outputRowPath.getPoints(17);
        }

        setPositions(animate=true) {
            let initVertPathPts = this.initVertPathPts.slice().reverse();
            for (let i = 0; i < initVertPathPts.length; i++) {
                let x = initVertPathPts[i].x;
                let y = initVertPathPts[i].y;
                let nucleotide = this.levelNucleotides[i];
                if (!nucleotide) {
                    continue;
                }
                nucleotide.setDisplay("nucleotide");
                nucleotide.setVisible(true);
                if (animate) {
                    this._animatePosition(nucleotide, x, y);
                } else {
                    nucleotide.setPosition(x, y);
                }
                let scale = (initVertPathPts.length * 0.05) - (0.05 * i);
                nucleotide.getObject().setScale(scale);
            }
            let initRectPathPts = this.initRectPathPts.slice().reverse();
            for (let i = 0; i < initRectPathPts.length; i++) {
                let x = initRectPathPts[i].x;
                let y = initRectPathPts[i].y;
                let nucleotide = this.levelNucleotides[initVertPathPts.length + i];
                if (!nucleotide) {
                    continue;
                }
                if (animate) {
                    this._animatePosition(nucleotide, x, y);
                } else {
                    nucleotide.setPosition(x, y);
                }
                nucleotide.setVisible(true);
            }
            let selectedNucleotides = this.selectedNucleotides.slice().reverse();
            let outputVertPathPts = this.outputVertPathPts.slice(2, this.outputVertPathPts.length);
            for (let i = 0; i < outputVertPathPts.length; i++) {
                let nucleotide = selectedNucleotides[i];
                if (!nucleotide) {
                    continue;
                }
                let x = outputVertPathPts[i].x;
                let y = outputVertPathPts[i].y;
                if (animate) {
                    this._animatePosition(nucleotide, x, y);
                } else {
                    nucleotide.setPosition(x, y);
                }
                let scale = (outputVertPathPts.length * 0.05) - (0.05 * i);
                nucleotide.getObject().setScale(scale);
            }
            let outputRectPathsPts = this.outputRowPathPts.slice();
            for (let i = 0; i < outputRectPathsPts.length; i++) {
                let nucleotide = selectedNucleotides[outputVertPathPts.length + i];
                if (!nucleotide) {
                    continue;
                }
                let x = outputRectPathsPts[i].x;
                let y = outputRectPathsPts[i].y;
                nucleotide.setDisplay("rectangle");
                if (animate) {
                    this._animatePosition(nucleotide, x, y);
                } else {
                    nucleotide.setPosition(x, y);
                }
            }
        }

        _animatePosition(nucleotide, x, y, callback=null) {
            let fromX = nucleotide.getObject().x;
            let toX = x;
            let fromY = nucleotide.getObject().y;
            let toY = y;
            if (Math.abs(fromX - toX) < 1 && Math.abs(fromY - toY) < 1) {
                nucleotide.setPosition(toX, toY);
                if (callback != null) {
                    callback(nucleotide);
                }
            } else {
                let that = this;
                this.game.time.addEvent({
                    delay: 40,
                    callback: function () {
                        let midX = (fromX + toX) / 2;
                        let midY = (fromY + toY) / 2;
                        nucleotide.setPosition(midX, midY);
                        that._animatePosition(nucleotide, x, y, callback);
                    },
                    loop: false
                });
            }
        }

        _fadeOut(nucleotide) {
            let currentAlpha = nucleotide.getObject().alpha;
            let newAlpha = currentAlpha / 1.5;
            if (newAlpha > 5) {
                nucleotide.getObject().clearAlpha();
                nucleotide.setVisible(false);
            } else {
                nucleotide.getObject().setAlpha(newAlpha);
                let that = this;
                this.game.time.addEvent({
                    delay: 40,
                    callback: function () {
                        that._fadeOut(nucleotide);
                    },
                    loop: false
                });
            }
        }

        next() {
            let removed = this.levelNucleotides[0];
            if (removed) {
                this._animatePosition(removed, removed.getObject().x - 40, removed.getObject().y + 130);
                this._fadeOut(removed);
                //removed.setVisible(false);
            }
            this.levelNucleotides = this.levelNucleotides.slice(1, this.levelNucleotides.length);
            this.setPositions(true);
        }

        getHeadNucleotide() {
            if (this.levelNucleotides.length) {
                return this.levelNucleotides[0];
            }
            return null;
        }

        addToDNAOutput(nucleotide) {
            this.selectedNucleotides.push(nucleotide);
            nucleotide.getObject().setScale(0.3);
            let firstPoint = this.outputVertPathPts[0];
            let secPoint = this.outputVertPathPts[1];
            let point = this.outputVertPathPts[2];
            nucleotide.setPosition(firstPoint.x, firstPoint.y);
            let that = this;
            this._animatePosition(nucleotide, secPoint.x, secPoint.y, function () {
                that.next();
                that._animatePosition(nucleotide, point.x, point.y);
                that.gameObj.ntBtnsEnabled = true;
            });
        }
    }

    
    class GameScore {
        constructor (game) {
            this.game = game;
            this.sequencesMade = 0;
            this.secondsElapsed = 0;
            this.wrongSequences = 0;
            this.timer = null;
        }

        start() {
            this.timer = this.game.time.addEvent({
                delay: 1000,
                callback: this.tick,
                loop: true
            });
        }

        stop() {

        }

        tick() {
            this.secondsElapsed++;
            //console.log("tick")
        }

        incrementSequences(correct) {
            this.sequencesMade++;
            if (!correct) {
                this.wrongSequences++;
            }
        }

        getRate() {
            let minElapsed = Math.ceil(this.secondsElapsed / 60);
            return Math.round(this.sequencesMade / minElapsed);
        }

        getAccuracy() {
            return Math.round((this.sequencesMade - this.wrongSequences) / this.sequencesMade);
        }

        getScore() {
            return this.sequencesMade;
        }
    }

    class Nucleotide {
        /**
         * 
         * @param {Object} game The game object
         * @param {String} rep The representation of the nucleotide. Choose from A, T
         * @param {String} type The type of the nucleotide. Choose from basic, hbonds, backbone
         */
        constructor (game, rep, type) {
            this.allNucleotides = {
                "A": {
                    shortname: "adenine",
                    color: 0xf49232,
                    matches: ["T"],
                },
                "T": {
                    shortname: "thymine",
                    color: 0x31ace0,
                    matches: ["A"],
                }
            }

            this.game = game;
            this.rep = rep;
            this.type = type;
            this.imgObj = null;
            this.squareObj = null;
            this.display = "rectangle"; // rectangle or nucleotide
        }

        getObject() {
            if (this.imgObj === null) {
                this.imgObj = this.game.add.image(0, 0, "nt_" + this.getShortName() + "_" + this.type);
                this.squareObj = this.game.add.rectangle(0, 0, 10, 10, this.getColor());
                this.imgObj.setVisible(false);
                this.squareObj.setVisible(false);
                this.imgObj.setData("nucleotide", this);
                this.squareObj.setData("nucleotide", this);
            }
            if (this.display == "rectangle") {
                return this.squareObj;
            } else {
                return this.imgObj;
            }
        }

        setDisplay(type) {
            if (["rectangle", "nucleotide"].indexOf(type) < 0) {
                throw new Error("Invalid display type! " + type);
            }
            if (this.squareObj === null || this.imgObj === null) {
                this.getObject();
            }
            if (this.display == type) {
                return this.getObject();
            }
            this.display = type;
            if (type == "rectangle") { // want squareObj
                this.squareObj.setVisible(this.imgObj.visible);
                this.squareObj.setPosition(this.imgObj.x, this.imgObj.y);
                this.imgObj.setVisible(false);
            } else { // want imgObj
                this.imgObj.setVisible(this.squareObj.visible);
                this.imgObj.setPosition(this.squareObj.x, this.squareObj.y);
                this.squareObj.setVisible(false);
            }
        }

        setVisible(visible) {
            this.getObject().setVisible(visible);
        }

        setPosition(x, y) {
            this.getObject().setPosition(x, y);
        }

        getShortName() {
            return this.allNucleotides[this.rep].shortname;
        }

        getColor() {
            return this.allNucleotides[this.rep].color;
        }

        validMatchWith(other) {
            return this.allNucleotides[this.rep].matches.indexOf(other.rep) >= 0;
        }

        clone() {
            return new Nucleotide(this.game, this.rep, this.type);
        }
    }

    window.game = new Game([
        { 
            // "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATA"
            "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATAAATATATTATATAATATATATTATAAATATATATTTATATATATAATATAAATATATT"
        }
    ]);
})();