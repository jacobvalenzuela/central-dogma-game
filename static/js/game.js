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
            this.objects = {};
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

            this.scorekeeping.start();
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
                },
                "T": {
                    shortname: "thymine",
                    color: 0x31ace0,
                }
            }

            this.game = game;
            this.rep = rep;
            this.type = type;
            this.imgObj = null;
        }

        getObject() {
            if (this.imgObj !== null) {
                return this.imgObj;
            }
            return this.game.add.image(0, 0, "nt_" + this.getShortName() + "_" + this.type);
        }

        getShortName() {
            return this.allNucleotides[this.rep].shortname;
        }

        getColor() {
            return this.allNucleotides[this.rep].color;
        }
    }

    window.game = new Game([
        {
            "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATAAATATATTATATAATATATATTATAAATATATATTTATATATATAATATAAATATATT"
        }
    ]);
})();