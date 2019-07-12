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
            this.levels = levels;
            this.level = 0;
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
            this.game.load.spritesheet(
                "logo_dogma_intro",
                "static/img/DOGMA_logo_intro.png",
                {
                    frameWidth: 600,
                    frameHeight: 360,
                }
            );
            this.game.load.image("logo_isb", "static/img/ISB_Logo.png");
            this.game.load.image("play_btn", "static/img/playBtn.png");
            
            this.game.load.image("nt_adenine_backbone", "static/img/nucleotide/adenine/Adenine_Backbone@3x.png");
            this.game.load.image("nt_adenine_basic", "static/img/nucleotide/adenine/Adenine_basic@3x.png");
            this.game.load.image("nt_adenine_hbonds", "static/img/nucleotide/adenine/Adenine_Hbonds@3x.png");

            this.game.load.image("nt_thymine_backbone", "static/img/nucleotide/thymine/Thymine_Backbone@3x.png");
            this.game.load.image("nt_thymine_basic", "static/img/nucleotide/thymine/Thymine_basic@3x.png");
            this.game.load.image("nt_thymine_hbonds", "static/img/nucleotide/thymine/Thymine_Hbonds@3x.png");

            this.game.load.image("nt_cytosine_backbone", "static/img/nucleotide/cytosine/Cytosine_Backbone@3x.png");
            this.game.load.image("nt_cytosine_basic", "static/img/nucleotide/cytosine/Cytosine_basic@3x.png");
            this.game.load.image("nt_cytosine_hbonds", "static/img/nucleotide/cytosine/Cytosine_Hbonds@3x.png");

            this.game.load.image("nt_guanine_backbone", "static/img/nucleotide/guanine/Guanine_Backbone@3x.png");
            this.game.load.image("nt_guanine_basic", "static/img/nucleotide/guanine/Guanine_basic@3x.png");
            this.game.load.image("nt_guanine_hbonds", "static/img/nucleotide/guanine/Guanine_Hbonds@3x.png");

            this.game.load.image("errortide_purine", "static/img/errortide/purine_error.png");
            this.game.load.image("errortide_pyrimidine", "static/img/errortide/pyrimidine_error.png");

            this.game.load.image("ntparticle_adenine", "static/img/nucleotide_particle/adenine_particle.png");
            this.game.load.image("ntparticle_cytosine", "static/img/nucleotide_particle/cytosine_particle.png");
            this.game.load.image("ntparticle_guanine", "static/img/nucleotide_particle/guanine_particle.png");
            this.game.load.image("ntparticle_thymine", "static/img/nucleotide_particle/thymine_particle.png");

            this.game.scene.add("listlevels", ListLevels, false, {levels: this.levels});
            for (let i = 0; i < this.levels.length; i++) {
                this.game.scene.add("levelpre" + i, PreLevelStage, false, {gameObj: this, lvlNum: i});
                this.game.scene.add("level" + i, LevelStage, false, {gameObj: this, lvlNum: i});
            }
        }

        create() {
            this.game.scene.add("titlescreen", TitleScreen, true, {
                "gameObj": this
            });

            // let singleLvl = new LevelStage(this, this.level);
            // let titleScreen = new TitleScreen(this);
        }

        startGame() {
            // let singleLvl = new LevelStage(this, this.level);
            
        }
    }

    class TitleScreen extends Phaser.Scene {
        constructor (config) {
            super(config);
        }

        init(data) {
            this.gameObj = data.gameObj;
            this.game = this;
            this.camera = this.game.cameras.cameras[0];
            this.graphics = this.game.add.graphics();
            
            this.graphics.fillStyle(0xF1F1F2, 1.0);
            this.graphics.fillRect(0, 0, 360, 740);
            let isblogo = this.game.add.image(190, 320, "logo_isb").setScale(0.35);
            this.isblogo = this.game.add.image(280, 30, "logo_isb").setScale(0.20).setAlpha(0);

            let dogmaLogo = this.game.add.sprite(185, 280, "logo_dogma_intro", 0).setScale(0.75);

            this.playBtn = this.game.add.image(190, 500, "play_btn").setScale(0.30).setAlpha(0).setInteractive();

            this.playBtn.addListener("pointerup", this.bindFn(this.onPlayClick));
            this.playBtn.addListener("pointerdown", this.bindFn(this.onPlayClickHold));
            this.playBtn.addListener("pointerup", this.bindFn(this.onPlayClickRelease));
            this.playBtn.addListener("dragend", this.bindFn(this.onPlayClickRelease));

            let that = this;
            this.game.time.addEvent({
                delay: 1000,
                callback: function () {
                    that.fadeOut(isblogo, function () {
                        that.game.anims.create({
                            key: "logo_dogma_anim",
                            frames: that.game.anims.generateFrameNumbers("logo_dogma_intro", null),
                            frameRate: 30,
                            repeat: 0,
                            delay: 500
                        });
                        dogmaLogo.anims.play("logo_dogma_anim");
                        that.game.time.addEvent({
                            delay: 3600,
                            callback: function () {
                                that.fadeIn(that.playBtn);
                                that.fadeIn(that.isblogo);
                            },
                            loop: false
                        });
                    });
                },
                loop: false
            });
        }

        fadeIn(image, callback=null) {
            let currentAlpha = image.alpha;
            if (currentAlpha == 0) {
                currentAlpha = 0.0001;
            }
            let newAlpha = currentAlpha * 1.5;
            if (newAlpha > 0.999) {
                image.clearAlpha();
                if (callback != null) {
                    callback(image);
                }
            } else {
                image.setVisible(true);
                image.setAlpha(newAlpha);
                let that = this;
                this.game.time.addEvent({
                    delay: 40,
                    callback: function () {
                        that.fadeIn(image, callback);
                    },
                    loop: false
                });
            }
        }

        fadeOut(image, callback=null) {
            let currentAlpha = image.alpha;
            let newAlpha = currentAlpha / 1.5;
            if (newAlpha < 0.001) {
                image.clearAlpha();
                image.setVisible(false);
                if (callback != null) {
                    callback(image);
                }
            } else {
                image.setAlpha(newAlpha);
                let that = this;
                this.game.time.addEvent({
                    delay: 40,
                    callback: function () {
                        that.fadeOut(image, callback);
                    },
                    loop: false
                });
            }
        }

        onPlayClick(img) {
            if (img != this.playBtn) {
                return;
            }
            let that = this;
            this.fadeOut(this.playBtn);
            this.scene.launch("listlevels");
            this.scene.moveAbove("titlescreen", "listlevels");
        }

        onPlayClickHold(img) {
            if (img != this.playBtn) {
                return;
            }
            this.playBtn.setScale(0.25);
        }

        onPlayClickRelease(img) {
            this.playBtn.setScale(0.30);
        }

        bindFn(fn) {
            let clas = this;
            return function (...args) {
                let event = this;
                fn.bind(clas, event, ...args)();
            };
        }
    }

    class ListLevels extends Phaser.Scene {
        constructor (config) {
            super(config);
        }

        init(data) {
            this.camera = this.cameras.main;
            this.camera.setAlpha(0);

            this.levels = data.levels;

            this.graphics = this.add.graphics();

            this.graphics.fillStyle(0x9BDBF5, 0.75);
            this.graphics.fillRect(30, 100, 300, 600);

            this.add.text(18, 53, "Choose a level", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '24pt', color: '#000'});

            let that = this;
            this.fadeIn(function () {
                that.populateLevels();
            });
        }

        populateLevels() {
            for (let i = 0; i < this.levels.length; i++) {
                let x = 80 + 100 * (i % 3);
                let y = 150 + 100 * Math.floor(i / 3);

                let that = this;
                this.time.addEvent({
                    delay: 75 * i,
                    callback: function () {
                        let lvlBtn = that.add.image(x, y, "nt_adenine_basic").setScale(0.20).setInteractive();
                        lvlBtn.setData("level", i);

                        let xtxt = x - 18;
                        let ytxt = y - 30;
                        let txt = that.add.text(xtxt, ytxt, i + 1, 
                            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '35pt', color: '#fff', stroke: '#000', strokeThickness: 10});  
                        
                        if (that.levels[i].unlocked) {
                            lvlBtn.addListener("pointerup", that.bindFn(that.onLvlClick));
                            lvlBtn.addListener("pointerdown", that.bindFn(that.lvlPointerDown));
                            lvlBtn.addListener("pointerup", that.bindFn(that.lvlPointerRelease));
                        } else {
                            lvlBtn.setAlpha(0.50);
                            txt.setAlpha(0.75);
                        }
                    },
                    loop: false
                });
            }
        }

        onLvlClick(img) {
            let level = img.getData("level");
            this.camera.fadeOut(600);

            let that = this;
            this.time.addEvent({
                delay: 600,
                loop: false,
                callback: function () {
                    that.scene.stop("titlescreen");
                    that.scene.start("levelpre" + level);
                }
            });
        }

        lvlPointerDown(img) {
            img.setScale(0.15);
        }

        lvlPointerRelease(img) {
            img.setScale(0.20);
        }

        bindFn(fn) {
            let clas = this;
            return function (...args) {
                let event = this;
                fn.bind(clas, event, ...args)();
            };
        }

        fadeIn(callback=null) {
            let currentAlpha = this.camera.alpha;
            if (currentAlpha == 0) {
                currentAlpha = 0.0001;
            }
            let newAlpha = currentAlpha * 1.5;
            if (newAlpha > 0.999) {
                this.camera.clearAlpha();
                if (callback != null) {
                    callback();
                }
            } else {
                this.camera.setAlpha(newAlpha);
                let that = this;
                this.time.addEvent({
                    delay: 40,
                    callback: function () {
                        that.fadeIn(callback);
                    },
                    loop: false
                });
            }
        }
    }

    class PreLevelStage extends Phaser.Scene {
        constructor (config) {
            super(config);
        }

        init(data) {
            this.camera = this.cameras.main;
            this.graphics = this.add.graphics();

            this.graphics.fillStyle(0x000, 1.0);
            this.graphics.fillRect(0, 0, 360, 740);

            this.add.text(120, 250, "Level " + (data.lvlNum + 1), 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '30pt', color: '#fff'});

            this.scene.launch("level" + data.lvlNum);
            this.scene.moveAbove("level" + data.lvlNum, "levelpre" + data.lvlNum);

            let that = this;
            this.time.addEvent({
                delay: 3000,
                loop: false,
                callback: function () {
                    that.fadeOut();
                }
            });
        }

        fadeOut(callback=null) {
            let currentAlpha = this.camera.alpha;
            let newAlpha = currentAlpha / 1.5;
            console.log(newAlpha)
            if (newAlpha < 0.001) {
                this.camera.setAlpha(0);
                if (callback != null) {
                    callback();
                }
            } else {
                this.camera.setAlpha(newAlpha);
                let that = this;
                this.time.addEvent({
                    delay: 40,
                    callback: function () {
                        that.fadeOut(callback);
                    },
                    loop: false
                });
            }
        }
    }

    class LevelStage extends Phaser.Scene {
        constructor (config) {
            super(config);
        }

        init(data) {
            this.gameObj = data.gameObj;
            this.game = this;
            this.level = data.lvlNum;
            this.scorekeeping = null;
            this.objects = {};
            this.nucleotides = [];
            this.ntButtons = [];
            this.btnLocations = {
                0: [310, 400],
                1: [310, 450],
                2: [310, 500],
                3: [310, 550]
            }
            this.ntBtnsEnabled = true;
            this.scorekeeping = new GameScore(this.game);

            this.camera = this.game.cameras.cameras[0];
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

            this.leftHighlightCir = this.game.add.circle(80, 490, 50, 0xfffaa8, 0);

            this.rightHighlightCir = this.game.add.circle(210, 534, 47, 0xfffaa8, 0);

            this.game.add.text(18, 53, "Sequence NTs", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(102, 53, "Rate [NTs/min]", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(200, 53, "Accuracy", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(293, 53, "Score", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(4, 105, "5'", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});
            
            this.game.add.text(4, 150, "3'", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(345, 105, "3'", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(4, 530, "5'", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(265, 490, "5'", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});

            this.game.add.text(340, 690, "3'", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '8pt', color: '#000'});
            
            let ntParticleConfig = {
                x: 150,
                y: 510,
                speed: { min: -800, max: 800 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.5, end: 0 },
                blendMode: "SCREEN",
                active: false,
                lifespan: 600,
                gravityY: 800
            };
            this.ntparticle = {
                "adenine": this.add.particles("ntparticle_adenine").createEmitter(ntParticleConfig),
                "cytosine": this.add.particles("ntparticle_cytosine").createEmitter(ntParticleConfig),
                "guanine": this.add.particles("ntparticle_guanine").createEmitter(ntParticleConfig),
                "thymine": this.add.particles("ntparticle_thymine").createEmitter(ntParticleConfig),
            }

            for (let i = 0; i < Object.keys(this.ntparticle).length; i++) {
                let nt = Object.keys(this.ntparticle)[i];
                this.ntparticle[nt].manager.setDepth(10);
            }

            let nucleotides = this.gameObj.levels[this.level].ntSequence;
            for (let i = 0; i < nucleotides.length; i++) {
                let nucleotide = new Nucleotide(this, nucleotides[i], "basic");
                this.nucleotides.push(nucleotide);
            }
            
            this.positionManager = new PositionManager(this);
            this.positionManager.setPositions(false);

            let optbtns = this.gameObj.levels[this.level].controls;
            if (!optbtns) {
                optbtns = ["T", "A", "G", "C"];
            }
            for (let i = 0; i < optbtns.length; i++) {
                this.makeNTBtn(optbtns[i]);
            }

            let that = this;
            this.time.addEvent({
                delay: 5000,
                loop: false,
                callback: function () {
                    that.scorekeeping.start();

                    that.positionManager.start();
                }
            });
        }

        bindFn(fn) {
            let clas = this;
            return function (...args) {
                let event = this;
                fn.bind(clas, event, ...args)();
            };
        }

        makeNTBtn(type) {
            let nt = new Nucleotide(this, type, "basic");
            nt.setDisplay("nucleotide");
            nt.setVisible(true);
            nt.setPosition(this.btnLocations[this.ntButtons.length][0], this.btnLocations[this.ntButtons.length][1]);
            nt.setScale(0.15);
            nt.getObject().setInteractive();
            this.game.input.setDraggable(nt.getObject());
            this.game.input.on("dragstart", this.bindFn(this.onDragNTBtnStart));
            this.game.input.on("drag", this.bindFn(this.onDragNTBtn));
            this.game.input.on("dragend", this.bindFn(this.onDragNTBtnEnd));
            this.ntButtons.push(nt);
        }

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
            let angle = image.angle;
            image.setData("pointerStartX", x);
            image.setData("pointerStartY", y);
            image.setData("startAngle", angle);
            image.setData("startedDragging", true);
        }

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
            let startAngle = image.getData("startAngle");
            image.setAngle(startAngle + distance);
        }

        onDragNTBtnEnd (input, pointer, image) {
            let startedDragging = image.getData("startedDragging");
            if (!startedDragging) {
                return;
            }
            if (!this.ntBtnsEnabled) {
                return;
            }
            let angle = image.angle;
            let clickedNT = image.getData("nucleotide");
            let headNT = this.positionManager.getHeadNucleotide();
            let cloned = clickedNT.clone();
            cloned.setDisplay("nucleotide");
            cloned.setPosition(clickedNT.getObject().x, clickedNT.getObject().y);
            cloned.setVisible(true);
            cloned.setScale(0.18);
            this.ntBtnsEnabled = false;
            // if (clickedNT.validMatchWith(headNT)) {
            //     this.positionManager.addToDNAOutput(cloned);
            // } else {
            //     this.positionManager.doRejectNT(cloned);
            // }
            if (!clickedNT.validMatchWith(headNT)) {
                cloned.setError(true);
            } else {
                let headNTName = headNT.getShortName();
                let pairNTName = cloned.getShortName();
                this.ntparticle[headNTName].resume();
                this.ntparticle[headNTName].explode(50);
                this.ntparticle[pairNTName].resume();
                this.ntparticle[pairNTName].explode(50);
            }
            this.positionManager.addToDNAOutput(cloned);
            image.setAngle(0);
            image.startedDragging = false;
        }
    }

    class PositionManager {
        constructor (level) {
            this.autoMoveTimer = null;
            this.pathPointsFactor = 60;
            this.level = level;
            this.gameObj = level.gameObj;
            this.game = level.gameObj.game;
            this.levelNucleotides = [];
            for (let i = 0; i < this.level.nucleotides.length * this.pathPointsFactor; i++) {
                let prevIdx = Math.floor((i - 1) / this.pathPointsFactor);
                let currIdx = Math.floor(i / this.pathPointsFactor);
                let nextIdx = Math.floor((i + 1) / this.pathPointsFactor);
                if (currIdx === nextIdx) {
                    this.levelNucleotides.push(null);
                    continue;
                }
                this.levelNucleotides.push(this.level.nucleotides[currIdx]);
            }
            this.compLevelNucleotides = [];
            let paddingComp = 8 * this.pathPointsFactor;
            for (let i = 0; i < paddingComp; i++) {
                this.compLevelNucleotides.push(null);
            }
            for (let i = 0; i < this.levelNucleotides.length; i++) {
                let prevIdx = Math.floor((i - 1) / this.pathPointsFactor);
                let currIdx = Math.floor(i / this.pathPointsFactor);
                let nextIdx = Math.floor((i + 1) / this.pathPointsFactor);
                if (currIdx === nextIdx) {
                    this.compLevelNucleotides.push(null);
                    continue;
                }
                let nucleotide = this.levelNucleotides[i];
                let newcleotide = new Nucleotide(this.level, nucleotide.matches[0], "basic");
                this.compLevelNucleotides.push(newcleotide);
            }
            for (let i = 0; i < this.pathPointsFactor * 3; i++) {
                this.levelNucleotides.unshift(null);
                this.compLevelNucleotides.unshift(null);
            }
            this.selectedNucleotides = [];

            this.level.graphics.lineStyle(1, 0x6c757d, 0.6);
            this.inputRowPath = new Phaser.Curves.Path(0, 140);
            this.inputRowPath.lineTo(175, 140);
            this.inputRowPath.draw(this.level.graphics);
            this.initRectPathPts = this.inputRowPath.getSpacedPoints(13 * this.pathPointsFactor);
            this.inputComplRowPath = new Phaser.Curves.Path(0, 126);
            this.inputComplRowPath.lineTo(363.46153846153845, 126);
            this.inputComplRowPath.draw(this.level.graphics);
            this.inputCompRectPathPts = this.inputComplRowPath.getSpacedPoints(27 * this.pathPointsFactor);
            this.inputVertPath = new Phaser.Curves.Path(182, 147);
            this.inputVertPath.cubicBezierTo(25, 640, 320, 320, 15, 440);
            // this.inputVertPath.draw(this.level.graphics);
            let numVertPathPts = 7 * this.pathPointsFactor;
            this.initVertPathPts = this.inputVertPath.getPoints(numVertPathPts + this.pathPointsFactor).slice(0, numVertPathPts - this.pathPointsFactor);
            this.inputVertPathDispl = new Phaser.Curves.Path(182, 147);
            this.inputVertPathDispl.cubicBezierTo(-30, 640, 280, 320, -80, 440);
            this.inputVertPathDispl.draw(this.level.graphics);
            this.outputVertPath = new Phaser.Curves.Path(245, 450);
            this.outputVertPath.cubicBezierTo(145, 710, 180, 600, 100, 700);
            // this.outputVertPath.draw(this.level.graphics);
            this.outputVertPathPts = this.outputVertPath.getPoints(5 * this.pathPointsFactor);
            this.outputVertPathDispl = new Phaser.Curves.Path(285, 500);
            this.outputVertPathDispl.cubicBezierTo(145, 710, 250, 600, 130, 670);
            this.outputVertPathDispl.draw(this.level.graphics);
            this.outputRowPath = new Phaser.Curves.Path(155, 710);
            this.outputRowPath.lineTo(400, 710);
            this.outputRowPath.draw(this.level.graphics);
            this.outputRowPathPts = this.outputRowPath.getPoints(30 * this.pathPointsFactor);
        }

        setPositions(animate=true) {
            let inputCompRectPathPts = this.inputCompRectPathPts.slice().reverse();
            for (let i = 0; i < inputCompRectPathPts.length; i++) {
                let x = inputCompRectPathPts[i].x;
                let y = inputCompRectPathPts[i].y;
                let nucleotide = this.compLevelNucleotides[i];
                if (!nucleotide) {
                    continue;
                }
                nucleotide.setVisible(true);
                if (animate) {
                    this._animatePosition(nucleotide, x, y);
                } else {
                    nucleotide.setPosition(x, y);
                }
            }
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
                // (0, 3/10) (180, 1/20) len(initVertPathPts)==180
                let scale = 0.3 - (1/1440) * i;
                let scalePrev = 0.3 - (1/1440) * (i - 1);
                if (animate) {
                    nucleotide.setScale(scalePrev);
                    this._animateScale(nucleotide, scale);
                } else {
                    nucleotide.setScale(scale);
                }
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
                let idx = Math.floor(i / this.pathPointsFactor);
                // (0, 0.2) (299, 0.07) len(outputVertPathPts)=299
                let scale = 0.2 - (1/2300) * i;
                let scalePrev = 0.2 - (1/2300) * (i - 1);
                if (animate) {
                    nucleotide.setScale(scalePrev);
                    this._animateScale(nucleotide, scale);
                } else {
                    nucleotide.setScale(scale);
                }
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

        start() {
            this.startTimer();
        }

        startTimer() {
            let that = this;
            this.autoMoveTimer = this.game.time.addEvent({
                delay: 30,
                callback: function () {that.next();},
                loop: true
            });
        }

        stopTimer() {
            if (this.autoMoveTimer) {
                this.autoMoveTimer.remove();
                this.autoMoveTimer = null;
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
                    delay: 20,
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

        _animateScale(nucleotide, scale, callback=null) {
            let fromScale = nucleotide.getObject().scale;
            let toScale = scale;
            if (fromScale === undefined) {
                fromScale = nucleotide.getObject().scaleX;
            }
            if (Math.abs(fromScale - toScale) < 0.001) {
                nucleotide.setScale(scale);
                if (callback != null) {
                    callback(nucleotide);
                }
            } else {
                let that = this;
                this.game.time.addEvent({
                    delay: 40,
                    callback: function () {
                        let midScale = (fromScale + toScale) / 2;
                        nucleotide.setScale(midScale);
                        that._animateScale(nucleotide, scale, callback);
                    },
                });
            }
        }

        _fadeOut(nucleotide, callback=null) {
            let currentAlpha = nucleotide.getObject().alpha;
            let newAlpha = currentAlpha / 1.5;
            if (newAlpha > 5) {
                nucleotide.getObject().clearAlpha();
                nucleotide.setVisible(false);
                nucleotide.updateErrorDisplay();
                if (callback != null) {
                    callback(nucleotide);
                }
            } else {
                nucleotide.getObject().setAlpha(newAlpha);
                nucleotide.updateErrorDisplay();
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
            let relHead = this.getHeadNucleotide();
            if (relHead) {
                this.level.leftHighlightCir.setFillStyle(0xfffaa8, 1);
                this.level.rightHighlightCir.setFillStyle(0xfffaa8, 1);
            } else {
                this.level.leftHighlightCir.setFillStyle(0xfffaa8, 0);
                this.level.rightHighlightCir.setFillStyle(0xfffaa8, 0);
            }
            let head = this.levelNucleotides[0];
            if (head) {
                this.removeHeadNucleotide();
                console.log("Removed head nucleotide at the very end");
            }
            this.levelNucleotides = this.levelNucleotides.slice(1, this.levelNucleotides.length);
            this.compLevelNucleotides = this.compLevelNucleotides.slice(1, this.compLevelNucleotides.length);
            this.selectedNucleotides.push(null);
            this.setPositions(true);
        }

        removeHeadNucleotide() {
            for (let i = 0; i < this.pathPointsFactor; i++) {
                let removed = this.levelNucleotides[i];
                if (removed) {
                    this.levelNucleotides[i] = null;
                    this._animatePosition(removed, removed.getObject().x - 40, removed.getObject().y + 130);
                    this._fadeOut(removed, function () {
                        removed.destroy();
                    });
                    break;
                }
            }
        }

        getHeadNucleotide() {
            if (this.levelNucleotides.length) {
                for (let i = 0; i < this.pathPointsFactor; i++) {
                    if (this.levelNucleotides[i] != null) {
                        return this.levelNucleotides[i];
                    }
                }
            }
            return null;
        }

        addToDNAOutput(nucleotide) {
            nucleotide.setScale(0.3);
            let firstPoint = this.outputVertPathPts[0];
            let secPoint = this.outputVertPathPts[1 * this.pathPointsFactor];
            let point = this.outputVertPathPts[2 * this.pathPointsFactor];
            nucleotide.setPosition(firstPoint.x, firstPoint.y);
            if (nucleotide.errorNT) {
                this.level.camera.flash(300, 255, 30, 30);
                this.level.camera.shake(400, 0.02);
            } else {
                this.level.camera.flash(200, 95, 187, 78);
                this.level.camera.shake(200, 0.01);
            }
            // this.stopTimer();
            let that = this;
            this._animatePosition(nucleotide, secPoint.x, secPoint.y, function () {
                that._animatePosition(nucleotide, point.x, point.y);
                that.selectedNucleotides.push(nucleotide);
                for (let i = 0; i < (that.pathPointsFactor * 2); i++) {
                    that.selectedNucleotides.push(null);
                }
                // that.startTimer();
                that.level.ntBtnsEnabled = true;
                if (!nucleotide.errorNT) {
                    that.removeHeadNucleotide();
                }
            });
        }

        doRejectNT(nucleotide) {
            nucleotide.setScale(0.3);
            let firstPoint = this.outputVertPathPts[0];
            let secPoint = this.outputVertPathPts[1 * this.pathPointsFactor];
            nucleotide.setPosition(firstPoint.x, firstPoint.y);
            this.level.camera.flash(300, 255, 30, 30);
            this.level.camera.shake(400, 0.01);
            let that = this;
            this._animatePosition(nucleotide, secPoint.x, secPoint.y, function () {
                that._fadeOut(nucleotide);
                that._animatePosition(nucleotide, firstPoint.x, firstPoint.y, function () {
                    that.level.ntBtnsEnabled = true;
                    nucleotide.destroy();
                });
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
         * @param {Object} level The level object
         * @param {String} rep The representation of the nucleotide. Choose from A, T
         * @param {String} type The type of the nucleotide. Choose from basic, hbonds, backbone
         */
        constructor (level, rep, type) {
            this.allNucleotides = {
                "A": {
                    shortname: "adenine",
                    color: 0xf49232,
                    matches: ["T"],
                    classification: "purine",
                },
                "T": {
                    shortname: "thymine",
                    color: 0x31ace0,
                    matches: ["A"],
                    classification: "pyrimidine",
                },
                "C": {
                    shortname: "cytosine",
                    color: 0xc71489,
                    matches: ["G"],
                    classification: "pyrimidine",
                },
                "G": {
                    shortname: "guanine",
                    color: 0x26b11e,
                    matches: ["C"],
                    classification: "purine",
                },
            }

            this.level = level;
            // if (!(this.level instanceof LevelStage)) {
            //     debugger
            // }
            this.rep = rep;
            this.type = type;
            this.imgObj = null;
            this.squareObj = null;
            this.display = "rectangle"; // rectangle or nucleotide
            this.matches = this.allNucleotides[rep].matches;
            this.errorNT = false; // is an error NT and should show red BG
        }

        getObject() {
            if (this.imgObj === null) {
                this.imgObj = this.level.game.add.image(0, 0, "nt_" + this.getShortName() + "_" + this.type);
                this.squareObj = this.level.game.add.rectangle(0, 0, 10, 10, this.getColor());
                this.imgObj.setVisible(false);
                this.squareObj.setVisible(false);
                this.imgObj.setData("nucleotide", this);
                this.squareObj.setData("nucleotide", this);
                this.imgObj.setDepth(5);
                this.squareObj.setDepth(5);
                
                this.imgObjErr = this.level.game.add.image(0, 0, "errortide_" + this.getClassification());
                this.squareObjErr = this.level.game.add.rectangle(0, 0, 15, 15, 0xfc0e33);
                this.imgObjErr.setVisible(false);
                this.squareObjErr.setVisible(false);
                this.imgObjErr.setDepth(4);
                this.squareObjErr.setDepth(4);
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
            this.updateErrorDisplay();
        }

        updateErrorDisplay() {
            if (!this.imgObjErr || !this.squareObjErr) {
                return;
            }
            if (!this.errorNT) {
                this.squareObjErr.setVisible(false);
                this.imgObjErr.setVisible(false);
                return;
            }
            if (this.display == "rectangle") {
                this.squareObjErr.setVisible(this.squareObj.visible);
                this.squareObjErr.setPosition(this.squareObj.x, this.squareObj.y);
                this.imgObjErr.setVisible(false);
                this.squareObjErr.setScale(this.squareObj.scale);
            } else {
                this.imgObjErr.setVisible(this.imgObj.visible);
                this.imgObjErr.setPosition(this.imgObj.x, this.imgObj.y);
                this.squareObjErr.setVisible(false);
                let scale = this.imgObj.scale;
                if (scale > 0) {
                    scale = scale + scale * 0.25;
                }
                this.imgObjErr.setScale(scale);
                this.imgObjErr.setAlpha(this.imgObj.alpha);
            }
        }

        setVisible(visible) {
            this.getObject().setVisible(visible);
            this.updateErrorDisplay();
        }

        setPosition(x, y) {
            this.getObject().setPosition(x, y);
            this.updateErrorDisplay();
        }

        setScale(scale) {
            this.getObject().setScale(scale);
            this.updateErrorDisplay();
        }

        setError(errorBool) {
            this.errorNT = errorBool;
            this.updateErrorDisplay();
        }

        getShortName() {
            return this.allNucleotides[this.rep].shortname;
        }

        getColor() {
            return this.allNucleotides[this.rep].color;
        }

        getClassification() {
            return this.allNucleotides[this.rep].classification;
        }

        validMatchWith(other) {
            if (!other) {
                return false;
            }
            return this.allNucleotides[this.rep].matches.indexOf(other.rep) >= 0;
        }

        clone() {
            return new Nucleotide(this.level, this.rep, this.type);
        }

        destroy() {
            this.imgObj.destroy();
            this.squareObj.destroy();
        }
    }

    window.game = new Game([
        { 
            // "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATA"
            "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATAAATATATTATATAATATATATTATAAATATATATTTATATATATAATATAAATATATT",
            "controls": ["T", "A"],
            "unlocked": true,
        },
        {
            "ntSequence": "CGCGCGCGGGGCCGCGCGGCCCCGGGCCGCGGCGCGCGCGCGCGCGCGCGGCCCCGCGCGCGGCCGCGCGCGCGCGGCGCGCGCGCGCGCGCGCGG",
            "controls": ["G", "C"],
            "unlocked": true,
        },
        {
            "ntSequence": "TAGTTACTAGGAGAGGTCATTTATAGGTTAGTCACTTCAGGCCTAGAAGAGATACATAGCACTTGGAGGACAGCGAAAAACAAATTTCACGGCATG",
            "unlocked": true,
        },
        {
            "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATAAATATATTATATAATATATATTATAAATATATATTTATATATATAATATAAATATATT",
        },
        {
            "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATAAATATATTATATAATATATATTATAAATATATATTTATATATATAATATAAATATATT",
        },
        {
            "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATAAATATATTATATAATATATATTATAAATATATATTTATATATATAATATAAATATATT",
        },
        {
            "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATAAATATATTATATAATATATATTATAAATATATATTTATATATATAATATAAATATATT",
        },
        {
            "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATAAATATATTATATAATATATATTATAAATATATATTTATATATATAATATAAATATATT",
        },
    ]);
})();