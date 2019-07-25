/*
    Installed plugins:
    Tag Text: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tagtext/index.html
*/

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

    WebFont.load({
        google: {
            families: ['Open Sans', 'Knewave', 'Bevan']
        }
    });

    class TouchFeedback extends Phaser.Plugins.ScenePlugin {
        constructor (scene, pluginManager) {
            super(scene, pluginManager);
        }

        boot() {
            this.scene.events.on("start", this.bindFn(this.start));
        }

        start() {
            this.scene.input.on("pointerdown", this.bindFn(this.startFeedBack));
            this.scene.input.on("pointermove", this.bindFn(this.moveFeedBack));

            this.rateLimitHit = false;
        }

        startFeedBack(inputPlugin, pointer, objClicked) {
            this.createGrowingCir(pointer.x, pointer.y);
            this.createParticles(pointer.x, pointer.y, 5);
        }

        moveFeedBack(inputPlugin, pointer, objHovered) {
            if (pointer.primaryDown && !this.rateLimitHit) {
                this.rateLimitHit = true;
                this.createParticles(pointer.x, pointer.y, 1);
                this.resetRateLimit();
            }
        }

        resetRateLimit() {
            let that = this;
            this.scene.time.addEvent({
                delay: 100,
                loop: false,
                callback: function () {
                    that.rateLimitHit = false;
                },
            });
        }

        createGrowingCir(x, y) {
            let img = this.scene.add.image(x, y, "touch_feedback_circle").setScale(0.05).setAlpha(0.75).setDepth(10000);
            this.grow(img);
            this.fadeOut(img);
        }

        createParticles(x, y, amt) {
            let touchFeedbackPartConf = {
                x: 0,
                y: 0,
                speed: { min: -100, max: 100 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.3, end: 0 },
                active: false,
                lifespan: 450
            }
            let partGr = this.scene.add.particles("touch_feedback_green_spark").createEmitter(touchFeedbackPartConf);
            partGr.manager.setDepth(10000);
            let partYell = this.scene.add.particles("touch_feedback_yellow_spark").createEmitter(touchFeedbackPartConf);
            partYell.manager.setDepth(10000);

            partGr.setPosition(x, y);
            partYell.setPosition(x, y);
            partGr.resume();
            partYell.resume();
            partGr.explode(amt);
            partYell.explode(amt);
        }

        grow(img) {
            if (img.scale >= 0.35) {
                return;
            } else {
                let scale = img.scale + 0.015;
                img.setScale(scale);
                let that = this;
                this.scene.time.addEvent({
                    delay: 10,
                    loop: false,
                    callback: function () {
                        that.grow(img);
                    },
                });
            }
        }

        fadeOut(img) {
            if (img.alpha <= 0) {
                img.destroy();
            } else {
                let alpha = img.alpha - 0.02;
                img.setAlpha(alpha);
                let that = this;
                this.scene.time.addEvent({
                    delay: 10,
                    loop: false,
                    callback: function () {
                        that.fadeOut(img);
                    },
                });
            }
        }

        bindFn(fn) {
            let clas = this;
            return function (...args) {
                let event = this;
                fn.bind(clas, event, ...args)();
            };
        }
    }

    class Game {
        constructor (levels) {
            this.config = {
                type: Phaser.CANVAS,
                canvas: document.getElementsByTagName("canvas")[0],
                width: 360,
                height: 740,
                backgroundColor: "#fff",
                plugins: {
                    scene: [
                        {
                            key: "TouchFeedback",
                            plugin: TouchFeedback,
                            start: true,
                            mapping: "touchFeedback"
                        }
                    ]
                },
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

            // load plugins
            this.game.load.plugin("rextagtextplugin", "static/vendor/js/rextagtextplugin.min.js", true);

            this.game.load.image("touch_feedback_circle", "static/img/touch_feedback/circle.png");
            this.game.load.image("touch_feedback_green_spark", "static/img/touch_feedback/green_sparkle.png");
            this.game.load.image("touch_feedback_yellow_spark", "static/img/touch_feedback/yellow_sparkle.png");

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
            this.game.load.image("home_btn", "static/img/homeBtn.png");
            
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

            this.game.load.image("missingtide_purine", "static/img/missingtide/purine_missing.png");
            this.game.load.image("missingtide_pyrimidine", "static/img/missingtide/pyrimidine_missing.png");

            this.game.load.image("ntparticle_adenine", "static/img/nucleotide_particle/adenine_particle.png");
            this.game.load.image("ntparticle_cytosine", "static/img/nucleotide_particle/cytosine_particle.png");
            this.game.load.image("ntparticle_guanine", "static/img/nucleotide_particle/guanine_particle.png");
            this.game.load.image("ntparticle_thymine", "static/img/nucleotide_particle/thymine_particle.png");

            this.game.scene.add("listlevels", ListLevels, false, {levels: this.levels});
            for (let i = 0; i < this.levels.length; i++) {
                let level = this.levels[i];
                this.game.scene.add("levelpre" + i, PreLevelStage, false, {gameObj: this, lvlNum: i, level: level});
                this.game.scene.add("level" + i, LevelStage, false, {gameObj: this, lvlNum: i, level: level});
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
            this.skipToLevelsList = false;
            if (data.skipToLevelsList) {
                this.skipToLevelsList = true;
            }

            this.gameObj = data.gameObj;
            this.game = this;
            this.camera = this.game.cameras.cameras[0];
            this.graphics = this.game.add.graphics();

            if (data.fadeIn) {
                this.camera.fadeIn(1000);
            }
            
            this.graphics.fillStyle(0xF1F1F2, 1.0);
            this.graphics.fillRect(0, 0, 360, 740);
            let isblogo = this.game.add.image(180, 320, "logo_isb").setScale(0.35);
            this.isblogo = this.game.add.image(280, 30, "logo_isb").setScale(0.20).setAlpha(0);

            let dogmaLogo = this.game.add.sprite(185, 280, "logo_dogma_intro", 0).setScale(0.75);

            this.playBtn = this.game.add.image(180, 500, "play_btn").setScale(0.30).setAlpha(0).setInteractive();

            this.playBtn.addListener("pointerup", this.bindFn(this.onPlayClick));
            this.playBtn.addListener("pointerdown", this.bindFn(this.onPlayClickHold));
            this.playBtn.addListener("pointerup", this.bindFn(this.onPlayClickRelease));
            this.playBtn.addListener("dragend", this.bindFn(this.onPlayClickRelease));

            let animDelay = 1;
            if (this.skipToLevelsList) {
                animDelay = 0;
                this.onPlayClick();
            }

            let that = this;
            this.game.time.addEvent({
                delay: 1000 * animDelay,
                callback: function () {
                    that.fadeOut(isblogo, function () {
                        that.game.anims.create({
                            key: "logo_dogma_anim",
                            frames: that.game.anims.generateFrameNumbers("logo_dogma_intro", null),
                            frameRate: 30,
                            repeat: 0,
                            delay: 500  * animDelay
                        });
                        dogmaLogo.anims.play("logo_dogma_anim");
                        that.game.time.addEvent({
                            delay: 3600  * animDelay,
                            callback: function () {
                                that.fadeIn(that.playBtn);
                                that.fadeIn(that.isblogo);
                            },
                            loop: false
                        });
                    }, that.skipToLevelsList);
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

        fadeOut(image, callback=null, skip=false) {
            let currentAlpha = image.alpha;
            let newAlpha = currentAlpha / 1.5;
            if (newAlpha < 0.001 || skip) {
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
            let that = this;
            this.fadeOut(this.playBtn);
            this.scene.launch("listlevels");
            this.scene.moveAbove("titlescreen", "listlevels");
        }

        onPlayClickHold(img) {
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
            this.camera.fadeOut(400);

            let that = this;
            this.time.addEvent({
                delay: 400,
                loop: false,
                callback: function () {
                    that.scene.stop("titlescreen");
                    that.scene.start("levelpre" + level);
                }
            });
            this.camera.setBounds(0, 0, 360, 740);
            this.camera.pan(img.x, img.y, 400).zoomTo(4, 400, Phaser.Math.Easing.Expo.In);
            let titleScreenScene = this.scene.manager.getScene("titlescreen");
            this.scene.manager.resume("titlescreen");
            titleScreenScene.camera.setBounds(0, 0, 360, 740);
            titleScreenScene.camera.pan(img.x, img.y, 400).zoomTo(4, 400, Phaser.Math.Easing.Expo.In);
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
            this.level = data.gameObj.levels[data.lvlNum];

            this.camera = this.cameras.main;
            this.graphics = this.add.graphics();

            this.graphics.fillStyle(0x000, 1.0);
            this.graphics.fillRect(0, 0, 360, 740);

            let lvlNumTxt = this.add.text(120, 250, "Level " + (data.lvlNum + 1), 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '30pt', color: '#fff'});
            lvlNumTxt.setPosition((360 - lvlNumTxt.width) / 2, 250);

            let lvlName = this.add.text(0, 310, this.level.name, 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '20pt', color: '#fff'});
            lvlName.setPosition((360 - lvlName.width) / 2, 310);

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

            this.ntHighlightEllipse = this.game.add.ellipse(140, 510, 230, 125, 0xfffaa8, 1);
            this.ntHighlightEllipse.setAngle(16);
            this.ntHighlightEllipse.setAlpha(0.90);

            this.game.add.text(70, 554, "Binding Pocket", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '9pt', color: '#000'}).setAngle(19).setAlpha(0.5);

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
            }

            for (let i = 0; i < Object.keys(this.ntparticle).length; i++) {
                let nt = Object.keys(this.ntparticle)[i];
                this.ntparticle[nt].manager.setDepth(5000);
            }

            let nucleotides = this.gameObj.levels[this.level].ntSequence;
            for (let i = 0; i < nucleotides.length; i++) {
                let nucleotide = new Nucleotide(this, nucleotides[i], this.ntType);
                this.nucleotides.push(nucleotide);
            }

            this.positionManager = new PositionManager(this, this.levelConfig.speed);
            this.positionManager.setPositions(false);

            let optbtns = this.gameObj.levels[this.level].controls;
            if (!optbtns) {
                optbtns = ["T", "A", "G", "C"];
            }
            for (let i = 0; i < optbtns.length; i++) {
                this.makeNTBtn(optbtns[i]);
            }
            this.shuffleNTBtnAngle();

            this.scene.remove("levelcomplete" + this.level);

            this.scorekeeping.init();

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
            let nt = new Nucleotide(this, type, this.ntType);
            nt.setDisplay("nucleotide");
            nt.setVisible(true);
            nt.setPosition(this.btnLocations[this.ntButtons.length][0], this.btnLocations[this.ntButtons.length][1]);
            nt.setScale(0.20);
            nt.getObject().setInteractive();
            nt.showLetter(true);
            this.game.input.setDraggable(nt.getObject());
            this.game.input.on("dragstart", this.bindFn(this.onDragNTBtnStart));
            this.game.input.on("drag", this.bindFn(this.onDragNTBtn));
            this.game.input.on("dragend", this.bindFn(this.onDragNTBtnEnd));
            this.ntButtons.push(nt);
        }

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

        onDragNTBtnEnd (input, pointer, image) {
            let startedDragging = image.getData("startedDragging");
            if (!startedDragging) {
                return;
            }
            if (!this.ntBtnsEnabled) {
                return;
            }
            let distance = image.getData("distanceDragged");
            if (distance < 15 && this.rotateNT) {
                let nt = image.getData("nucleotide");
                nt.setAngle(nt.getAngle() + 90);
            } else if (this.positionManager.ntTouchingBindingPocket()){
                let angle = image.angle;
                let clickedNT = image.getData("nucleotide");
                let headNT = this.positionManager.getHeadNucleotide();
                let cloned = clickedNT.clone();
                cloned.setDisplay("nucleotide");
                cloned.setPosition(clickedNT.getObject().x, clickedNT.getObject().y);
                cloned.setVisible(true);
                cloned.setScale(0.18);
                cloned.setAngle(clickedNT.getAngle());
                this.shuffleNTBtnAngle();
                this.ntBtnsEnabled = false;
                if (!clickedNT.validMatchWith(headNT) || (this.rotateNT && cloned.getAngle() % 180 != 0)) {
                    let correctnt = this.positionManager.getValidMatchNT(headNT);
                    this.popupmanager.emitEvent("errorMatch", headNT, correctnt);
                    this.popupmanager.emitEvent("error5Match", headNT, correctnt);
                    cloned.setError(true);
                    this.scorekeeping.incrementIncorrectSequences();
                } else {
                    this.popupmanager.emitEvent("correctMatch", headNT, cloned);
                    this.popupmanager.emitEvent("firstCorrectMatch", headNT, cloned);
                    this.scorekeeping.incrementSequencesMade();
                    let headNTName = headNT.getShortName();
                    let pairNTName = cloned.getShortName();
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
                image.getData("nucleotide").setAngle(0);
            }
            image.setData("startedDragging", false);
        }

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
            this.scene.add(sceneName, LevelComplete, false, {gameObj: this.gameObj, nucleotides: nucleotides, score: this.scorekeeping.getScore(), accuracy: this.scorekeeping.getAccuracy()});
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
    }

    class PositionManager {
        constructor (level, defaultTimerDelay) {
            this.autoMoveTimer = null;
            this.pathPointsFactor = 60;
            this.level = level;
            this.defaultTimerDelay = defaultTimerDelay;
            this.gameObj = level.gameObj;
            this.game = level;
            this.levelNucleotides = [];
            for (let i = 0; i < this.level.nucleotides.length * this.pathPointsFactor; i++) {
                let prevIdx = Math.floor((i - 1) / this.pathPointsFactor);
                let currIdx = Math.floor(i / this.pathPointsFactor);
                let nextIdx = Math.floor((i + 1) / this.pathPointsFactor);
                if (currIdx === nextIdx) {
                    this.levelNucleotides.push(null);
                    this.levelNucleotides.push(null);
                    continue;
                }
                this.levelNucleotides.push(this.level.nucleotides[currIdx]);
            }
            this.compLevelNucleotides = [];
            let paddingComp = 22 * this.pathPointsFactor;
            for (let i = 0; i < paddingComp; i++) {
                this.compLevelNucleotides.push(null);
            }
            for (let i = 0; i < this.levelNucleotides.length; i++) {
                let nucleotide = this.levelNucleotides[i];
                if (nucleotide) {
                    let newcleotide = new Nucleotide(this.level, nucleotide.matches[0], this.level.ntType);
                    this.compLevelNucleotides.push(newcleotide);
                } else {
                    this.compLevelNucleotides.push(null);
                }
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
            this.initRectPathPts = this.inputRowPath.getSpacedPoints(26 * this.pathPointsFactor);
            this.inputComplRowPath = new Phaser.Curves.Path(0, 126);
            this.inputComplRowPath.lineTo(363.46153846153845, 126);
            this.inputComplRowPath.draw(this.level.graphics);
            this.inputCompRectPathPts = this.inputComplRowPath.getSpacedPoints(54 * this.pathPointsFactor);
            this.inputVertPath = new Phaser.Curves.Path(182, 147);
            this.inputVertPath.cubicBezierTo(25, 640, 320, 320, 15, 440);
            // this.inputVertPath.draw(this.level.graphics);
            let numVertPathPts = 7 * this.pathPointsFactor;
            this.initVertPathPts = this.inputVertPath.getPoints(numVertPathPts + this.pathPointsFactor).slice(0, numVertPathPts - this.pathPointsFactor);
            this.inputVertPathDispl = new Phaser.Curves.Path(175, 140);
            this.inputVertPathDispl.cubicBezierTo(-30, 640, 280, 320, -80, 440);
            this.inputVertPathDispl.draw(this.level.graphics);
            this.outputVertPath = new Phaser.Curves.Path(245, 450);
            this.outputVertPath.cubicBezierTo(145, 710, 180, 600, 100, 700);
            // this.outputVertPath.draw(this.level.graphics);
            this.outputVertPathPts = this.outputVertPath.getPoints(5 * this.pathPointsFactor);
            this.outputVertPathDispl = new Phaser.Curves.Path(285, 500);
            this.outputVertPathDispl.cubicBezierTo(155, 710, 250, 600, 130, 670);
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
                nucleotide.setDepth(2999 - i);
                nucleotide.setDisplay("nucleotide");
                nucleotide.setVisible(true);
                if (animate) {
                    this._animatePosition(nucleotide, x, y);
                } else {
                    nucleotide.setPosition(x, y);
                }
                let modifier = 0;
                if (i < this.pathPointsFactor * 10) {
                    modifier = 0.045;
                }
                let scale = this.calcInScale(i, modifier);
                let scalePrev = this.calcInScale(i - 1, modifier);
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

        calcInScale(idx, modifier=0) {
            //  x1 y1    x2   y2
            // (0, 17/50) (180, 11/100)
            const x1 = 0;
            const y1 = 17 / 50 + modifier;
            const x2 = 180;
            const y2 = 45 / 500 + modifier;
            return this.calcExponential(x1, y1, x2, y2, idx);
        }

        calcExponential(x1, y1, x2, y2, x) {
            x1 = 0; // assuming this is always 0
            let a = y1;
            let b = Math.pow(Math.E, Math.log(y2 / y1) / x2);
            return a * Math.pow(b, x);
        }

        start() {
            this.startNTMoveTimer(this.defaultTimerDelay);
        }

        startNTMoveTimer(delay) {
            let that = this;
            this.autoMoveTimer = this.game.time.addEvent({
                delay: delay,
                callback: function () {that.next();},
                loop: true
            });
        }

        stopNTMoveTimer() {
            if (this.autoMoveTimer) {
                this.autoMoveTimer.remove();
                this.autoMoveTimer = null;
            }
        }

        updateNTMoveTimer(newDelay) {
            this.stopNTMoveTimer();
            this.startNTMoveTimer(newDelay);
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
                    delay: 10,
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
            let head = this.levelNucleotides[0];
            if (head) {
                this.removeHeadNucleotide();
                this.level.scorekeeping.incrementIncorrectSequences();
                let cloned = this.getValidMatchNT(head);
                cloned.setDisplay("nucleotide");
                cloned.setPosition(head.getObject().x, head.getObject().y);
                cloned.setVisible(true);
                cloned.setScale(0.18);
                cloned.setAngle(180);
                cloned.setMissing(true);
                this.addToDNAOutput(cloned);
                this.level.shuffleNTBtnAngle();
            }
            this.levelNucleotides = this.levelNucleotides.slice(1, this.levelNucleotides.length);
            this.compLevelNucleotides = this.compLevelNucleotides.slice(1, this.compLevelNucleotides.length);
            this.selectedNucleotides.push(null);
            this.setPositions(true);
            if (this.getLevelNTCount() == 0) {
                let that = this;
                this.level.time.addEvent({
                    delay: 300,
                    loop: false,
                    callback: function () {
                        that.level.endGame();
                    }
                });
            }
        }

        getValidMatchNT(nucleotide) {
            let btns = this.level.ntButtons;
            let cloned = null;
            for (let i = 0; i < btns.length; i++) {
                let btn = btns[i];
                if (nucleotide.validMatchWith(btn)) {
                    cloned = btn.clone();
                }
            }
            return cloned;
        }

        removeHeadNucleotide() {
            for (let i = 0; i < this.levelNucleotides.length; i++) {
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
            if (this.ntTouchingBindingPocket()) {
                for (let i = 0; i < this.levelNucleotides.length; i++) {
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
            if (nucleotide.errorNT || nucleotide.missingNT) {
                this.level.camera.flash(300, 255, 30, 30);
                this.level.camera.shake(400, 0.02);
            }
            this.updateNTMoveTimer(50);
            let that = this;
            this._animatePosition(nucleotide, secPoint.x, secPoint.y, function () {
                that._animatePosition(nucleotide, point.x, point.y);
                that.selectedNucleotides.push(nucleotide);
                for (let i = 0; i < (that.pathPointsFactor * 2); i++) {
                    that.selectedNucleotides.push(null);
                }
                that.updateNTMoveTimer(that.defaultTimerDelay);
                that.level.ntBtnsEnabled = true;
                if (!nucleotide.missingNT) {
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

        getLevelNTCount() {
            let lvlNTs = this.levelNucleotides;
            let cnt = 0;
            for (let i = 0; i < lvlNTs.length; i++) {
                if (lvlNTs[i]) {
                    cnt++;
                }
            }
            return cnt;
        }

        ntTouchingBindingPocket() {
            let ellipse = this.level.ntHighlightEllipse;
            let nucleotide = null;
            for (let i = 0; i < this.levelNucleotides.length; i++) {
                nucleotide = this.levelNucleotides[i];
                if (nucleotide) {
                    nucleotide = nucleotide.getObject();
                    break;
                }
            }
            if (nucleotide) {
                let ellipseBottomLeft = this.getRotatedRectCoordinates(ellipse, ellipse.getTopLeft());
                let ellipseTopRight = this.getRotatedRectCoordinates(ellipse, ellipse.getBottomRight());
                let nucleotideBottomLeft = this.getRotatedRectCoordinates(nucleotide, nucleotide.getTopLeft());
                let nucleotideTopRight = this.getRotatedRectCoordinates(nucleotide, nucleotide.getBottomRight());
                return !(ellipseTopRight.x <= nucleotideBottomLeft.x ||
                        ellipseTopRight.y <= nucleotideBottomLeft.y ||
                        ellipseBottomLeft.x >= nucleotideTopRight.x ||
                        ellipseBottomLeft.y >= nucleotideTopRight.y);
            }
            return false;
        }

        getRotatedRectCoordinates(obj, cornerCoord) {
            let center = obj.getCenter();
            let tempX = cornerCoord.x - center.x;
            let tempY = cornerCoord.y - center.y;

            let theta = 360 - obj.angle;
            theta = theta * Math.PI / 180; // radians

            let rotatedX = tempX * Math.cos(theta) - tempY * Math.sin(theta);
            let rotatedY = tempX * Math.sin(theta) + tempY * Math.cos(theta);

            let x = rotatedX + center.x;
            let y = rotatedY + center.y;

            return new Phaser.Math.Vector2(x, y);
        }
    }

    
    class GameScore {
        constructor (game) {
            this.initialized = false;
            this.game = game;
            this.sequencesMade = 0;
            this.secondsElapsed = 0;
            this.wrongSequences = 0;
            this.timerSec = null;
            this.timerMs = null;
            this.initialNTCount = this.game.levelConfig.ntSequence.length;
        }

        init() {
            this.initialized = true;
            this.sequenceNTsTxt = this.game.add.text(50, 80, "0", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '18pt', color: '#000'}).setOrigin(0.5);
            this.updateSequenceNTs();
            let rate = this.getRate();
            this.rateTxt = this.game.add.text(140, 80, rate, 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '18pt', color: '#000'}).setOrigin(0.5);
            this.accuracyTxt = this.game.add.text(222, 80, "100%", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '18pt', color: '#000'}).setOrigin(0.5);
            this.scoreTxt = this.game.add.text(307, 80, "0", 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '18pt', color: '#000'}).setOrigin(0.5);
        }

        start() {
            if (!this.initialized) {
                console.error("GameScore instance has not been initialized yet!");
            }
            this.timerSec = this.game.time.addEvent({
                delay: 1000,
                callback: this.bindFn(this.tickSec),
                loop: true
            });
            this.timerMs = this.game.time.addEvent({
                delay: 50,
                callback: this.bindFn(this.tickMs),
                loop: true
            });
        }

        stop() {

        }

        tickMs() {
            this.updateSequenceNTs();
            this.updateScore();
            this.updateAccuracy();
        }

        updateSequenceNTs() {
            let count = this.getNTCount();
            this.sequenceNTsTxt.setText(count);
        }

        updateScore() {
            let score = this.getScore();
            this.scoreTxt.setText(score);
        }

        updateAccuracy() {
            this.accuracyTxt.setText(this.getAccuracy() + "%");
        }

        getNTCount() {
            return this.game.positionManager.getLevelNTCount();
        }

        getGameSpeed() {
            return this.game.levelConfig.speed;
        }


        tickSec() {
            this.secondsElapsed++;
        }

        bindFn(fn) {
            let clas = this;
            return function (...args) {
                let event = this;
                fn.bind(clas, event, ...args)();
            };
        }

        incrementIncorrectSequences() {
            this.wrongSequences++;
        }

        incrementSequencesMade() {
            this.sequencesMade++;
        }

        getRate() {
            // let minElapsed = Math.ceil(this.secondsElapsed / 60);
            // return Math.round(this.sequencesMade / minElapsed);
            let ntRate = Math.floor(1000 / this.getGameSpeed());
            return Math.min(ntRate, this.game.levelConfig.ntSequence.length);
        }

        getAccuracy() {
            let ntCnt = this.initialNTCount;
            return Math.round(((ntCnt - this.wrongSequences) / ntCnt) * 100);
        }

        getScore() {
            return this.sequencesMade * 100;
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
                    display: {
                        "basic": {
                            "origin": [0.5, 0.5],
                            "angle": 0,
                        },
                        "hbonds": {
                            "origin": [0.42, 0.5],
                            "angle": 0,
                        },
                    }
                },
                "T": {
                    shortname: "thymine",
                    color: 0x31ace0,
                    matches: ["A"],
                    classification: "pyrimidine",
                    display: {
                        "basic": {
                            "origin": [0.5, 0.5],
                            "angle": 0,
                        },
                        "hbonds": {
                            "origin": [0.65, 0.65],
                            "angle": 180,
                        },
                    }
                },
                "C": {
                    shortname: "cytosine",
                    color: 0xc71489,
                    matches: ["G"],
                    classification: "pyrimidine",
                    display: {
                        "basic": {
                            "origin": [0.5, 0.5],
                            "angle": 0,
                        },
                        "hbonds": {
                            "origin": [0.65, 0.5],
                            "angle": 180,
                        },
                    }
                },
                "G": {
                    shortname: "guanine",
                    color: 0x26b11e,
                    matches: ["C"],
                    classification: "purine",
                    display: {
                        "basic": {
                            "origin": [0.5, 0.5],
                            "angle": 0,
                        },
                        "hbonds": {
                            "origin": [0.5, 0.40],
                            "angle": 0,
                        },
                    }
                },
            }

            this.level = level;
            this.rep = rep;
            this.type = type;
            this.imgObj = null;
            this.squareObj = null;
            this.display = "rectangle"; // rectangle or nucleotide
            this.matches = this.allNucleotides[rep].matches;
            this.displayment = this.allNucleotides[rep].display[type];
            this.errorNT = false; // is an error NT and should show red BG
            this.missingNT = false; // is missing NT and should show a white center
            this.dispLetter = false; // should display NT letter on the face
        }

        getObject() {
            if (this.imgObj === null) {
                this._genNTObjs();
            }
            if (this.display == "rectangle") {
                return this.squareObj;
            } else {
                return this.imgObj;
            }
        }

        _genNTObjs() {
            this.imgObj = this.level.add.image(0, 0, "nt_" + this.getShortName() + "_" + this.type);
            this.squareObj = this.level.add.rectangle(0, 0, 10, 10, this.getColor());
            this.imgObj.setVisible(false);
            this.squareObj.setVisible(false);
            this.imgObj.setData("nucleotide", this);
            this.squareObj.setData("nucleotide", this);
            this.imgObj.setDepth(1);
            this.squareObj.setDepth(1);

            this.imgObj.setOrigin(this.displayment.origin[0], this.displayment.origin[1]);
            this.imgObj.setAngle(this.displayment.angle);
            
            this.imgObjErr = this.level.add.image(0, 0, "errortide_" + this.getClassification());
            this.squareObjErr = this.level.add.rectangle(0, 0, 15, 15, 0xfc0e33);
            this.imgObjErr.setVisible(false);
            this.squareObjErr.setVisible(false);
            this.imgObjErr.setDepth(0);
            this.squareObjErr.setDepth(0);

            this.imgObjMiss = this.level.add.image(0, 0, "missingtide_" + this.getClassification());
            this.squareObjMiss = this.level.add.rectangle(0, 0, 15, 15, 0xffffff);
            this.imgObjMiss.setVisible(false);
            this.squareObjMiss.setVisible(false);
            this.imgObjMiss.setDepth(2);
            this.squareObjMiss.setDepth(2);

            this.letterText = this.level.add.text(0, 0, this.rep, 
                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '18pt', color: '#fff'}).setOrigin(0.5);
            this.letterText.setDepth(3);
            this.letterText.setVisible(false);
        }

        setDepth(depth) {
            if (!this.imgObj) {
                this.getObject();
            }
            this.imgObj.setDepth(depth);
            this.squareObj.setDepth(depth);
            this.imgObjErr.setDepth(depth - 1);
            this.squareObjErr.setDepth(depth - 1);
            this.imgObjMiss.setDepth(depth + 1);
            this.squareObjMiss.setDepth(depth + 1);
            this.letterText.setDepth(depth + 2);
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
                this.letterText.setVisible(false);
            } else { // want imgObj
                this.imgObj.setVisible(this.squareObj.visible);
                this.imgObj.setPosition(this.squareObj.x, this.squareObj.y);
                this.squareObj.setVisible(false);
                if (this.dispLetter) {
                    this.letterText.setVisible(true);
                    this.letterText.setPosition(this.squareObj.x, this.squareObj.y);
                } else {
                    this.letterText.setVisible(false);
                }
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
                    scale = scale + scale * 0.30;
                }
                this.imgObjErr.setScale(scale);
                this.imgObjErr.setAlpha(this.imgObj.alpha);
                this.imgObjErr.setAngle(this.imgObj.angle);
            }
        }

        updateMissingDisplay() {
            if (!this.imgObjMiss || !this.squareObjMiss) {
                return;
            }
            if (!this.missingNT) {
                this.squareObjMiss.setVisible(false);
                this.imgObjMiss.setVisible(false);
                return;
            }
            if (this.display == "rectangle") {
                this.squareObjMiss.setVisible(this.squareObj.visible);
                this.squareObjMiss.setPosition(this.squareObj.x, this.squareObj.y);
                this.imgObjMiss.setVisible(false);
                this.squareObjMiss.setScale(this.squareObj.scale - 0.55);
            } else {
                this.imgObjMiss.setVisible(this.imgObj.visible);
                this.imgObjMiss.setPosition(this.imgObj.x, this.imgObj.y);
                this.squareObjMiss.setVisible(false);
                let scale = this.imgObj.scale;
                if (scale > 0) {
                    scale = scale - scale * 0.25;
                }
                this.imgObjMiss.setScale(scale);
                this.imgObjMiss.setAlpha(this.imgObj.alpha);
                this.imgObjMiss.setAngle(this.imgObj.angle);
            }
        }

        updateLetterDisplay() {
            if (this.dispLetter && this.display != "rectangle") {
                this.letterText.setVisible(true);
                let x = this.getObject().x;
                let y = this.getObject().y;
                if (this.getClassification() == "purine") {
                    let p = x;
                    let q = y;
                    x = x + 13;
                    y = y + 9;
                    let th = this.getObject().angle;
                    th = th * Math.PI / 180;
                    let xp = (x - p) * Math.cos(th) - (y - q) * Math.sin(th) + p;
                    let yp = (x - p) * Math.sin(th) + (y - q) * Math.cos(th) + q;
                    x = xp;
                    y = yp;
                }
                this.letterText.setPosition(x, y);
                this.letterText.setDepth(this.imgObj.depth + 2);
            } else {
                this.letterText.setVisible(false);
            }
        }

        showLetter(shouldShow) {
            this.dispLetter = shouldShow;
            this.updateLetterDisplay();
        }

        setVisible(visible) {
            this.getObject().setVisible(visible);
            this.updateErrorDisplay();
            this.updateMissingDisplay();
            this.updateLetterDisplay();
        }

        setPosition(x, y) {
            this.getObject().setPosition(x, y);
            this.updateErrorDisplay();
            this.updateMissingDisplay();
            this.updateLetterDisplay();
        }

        setScale(scale) {
            this.getObject().setScale(scale);
            this.updateErrorDisplay();
            this.updateMissingDisplay();
        }

        getAngle() {
            return this.getObject().angle - this.displayment.angle;
        }

        setAngle(angle) {
            angle = angle + this.displayment.angle;
            this.getObject().setAngle(angle);
            this.updateLetterDisplay();
        }

        setError(errorBool) {
            this.errorNT = errorBool;
            this.updateErrorDisplay();
        }

        setMissing(missingBool) {
            this.missingNT = missingBool;
            this.updateMissingDisplay();
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

        clone(level=this.level) {
            return new Nucleotide(level, this.rep, this.type);
        }

        destroy() {
            this.imgObj.destroy();
            this.squareObj.destroy();
        }

        toJSON() {
            return {
                "name": this.getShortName().substr(0, 1).toUpperCase() + this.getShortName().substr(1, this.getShortName().length),
                "color": "#" + this.getColor().toString(16),
            }
        }
    }

    class PopupManager {
        constructor(level) {
            this.level = level;
            this.popupCnt = 0;

            this.popupsConfig = this.level.levelConfig.popups;
            if (!this.popupsConfig) {
                this.popupsConfig = {};
            }

            let popupsKeys = Object.keys(this.popupsConfig);
            for (let i = 0; i < popupsKeys.length; i++) {
                let key = popupsKeys[i];
                let val = this.popupsConfig[key];
                Mustache.parse(val);
            }

            this.firstCorrectMatchHappened = false;
            this.error5MatchCount = 0;
        }

        emitEvent(eventType) {
            if (!(eventType in this.popupsConfig)) {
                return;
            }
            let fn = this["on_" + eventType];
            if (!fn) {
                console.error(eventType + " event type is not defined for the popup manager");
                return;
            } else {
                fn = fn.bind(this);
            }
            fn(...Array.from(arguments).slice(1));
        }

        on_firstCorrectMatch(nucleotide1, nucleotide2) {
            if (this.firstCorrectMatchHappened) {
                return;
            }
            this.firstCorrectMatchHappened = true;
            nucleotide1 = nucleotide1.toJSON();
            nucleotide2 = nucleotide2.toJSON();
            this.displayPopup(
                "firstCorrectMatch",
                {
                    "nucleotide1": nucleotide1,
                    "nucleotide2": nucleotide2,
                }
            );
        }

        on_errorMatch(nucleotide1, nucleotide2) {
            nucleotide1 = nucleotide1.toJSON();
            nucleotide2 = nucleotide2.toJSON();
            this.displayPopup(
                "errorMatch",
                {
                    "nucleotide1": nucleotide1,
                    "nucleotide2": nucleotide2,
                }
            );
        }

        on_error5Match(nucleotide1, nucleotide2) {
            this.error5MatchCount++;
            if ((this.error5MatchCount - 1) % 5 != 0) {
                return;
            }
            nucleotide1 = nucleotide1.toJSON();
            nucleotide2 = nucleotide2.toJSON();
            this.displayPopup(
                "error5Match",
                {
                    "nucleotide1": nucleotide1,
                    "nucleotide2": nucleotide2,
                }
            );
        }

        displayPopup(eventType, values) {
            let rendered = Mustache.render(this.popupsConfig[eventType], values);
            let sceneName = "popupDisplay" + this.popupCnt;
            let levelSceneName = "level" + this.level.level;
            this.level.scene.add(sceneName, PopupDisplayScene, false, {text: rendered, manager: this});
            let that = this;
            this.level.time.addEvent({
                delay: 300,
                loop: false,
                callback: function () {
                    that.level.scene.launch(sceneName);
                    that.level.scene.pause();
                    that.level.scene.moveAbove(levelSceneName, sceneName);
                }
            });
            this.popupCnt++;
        }

        destroy() {
            for (let i = 0; i < this.popupCnt; i++) {
                this.level.scene.remove("popupDisplay" + i);
            }
        }
    }

    class PopupDisplayScene extends Phaser.Scene {
        constructor (config) {
            super(config);
        }

        init(data) {
            this.manager = data.manager;

            this.camera = this.cameras.main;
            this.camera.setAlpha(0);

            this.graphics = this.add.graphics();

            this.graphics.fillStyle(0x000000, 0.15);
            this.graphics.fillRect(0, 0, 360, 740);

            let that = this;
            this.fadeIn(function () {
                that.input.on("pointerdown", that.bindFn(that.exitPopup));
            });

            this.rectangle = this.add.rectangle(180, 270, 300, 150, 0xffffff);
            this.rectangle.setStrokeStyle(5, 0x000000, 1);
            this.text = this.add.rexTagText(40, 200, data.text, {
                fontFamily: '\'Open Sans\', sans-serif',
                fontSize: "18pt",
                color: "#000",
                halign: 'center',
                wrap: {
                    mode: "word",
                    width: 280
                }
            });
            let width = this.text.width;
            let height = this.text.height;
            let x = (360 - width) / 2;
            this.text.setPosition(x, this.text.y);
            this.rectangle.setSize(this.rectangle.width, this.text.height + 10);
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
                currentAlpha = 0.01;
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

        exitPopup(inputPlugin, pointer, objClicked) {
            this.manager.level.scene.resume();
            this.scene.stop();
        }
    }

    class LevelComplete extends Phaser.Scene {
        constructor(config) {
            super(config);
        }

        init(data) {
            this.confnucleotides = data.nucleotides;
            this.nucleotides = [];
            this.draggableNTWidth = 0;
            this.draggableNTX = 0;

            this.gameObj = data.gameObj;
            this.camera = this.cameras.main;
            this.camera.setAlpha(0);

            this.graphics = this.add.graphics();

            this.graphics.fillStyle(0x000000, 0.50);
            this.graphics.fillRect(0, 0, 360, 740);

            let that = this;
            this.fadeIn(function () {
                let rectbg = that.add.rectangle(180, -100, 300, 400, 0x9BDBF5);
                rectbg.setStrokeStyle(5, 0x5C96C9, 1);
                that.moveToY(rectbg, 300, function () {
                    let lvlcompTxt = that.add.text(180, 155, "Level Complete!", 
                        {fontFamily: '\'Knewave\', cursive', fontSize: '27pt', color: '#BC1D75', align: "center"});
                    lvlcompTxt.setOrigin(0.5).setScale(0);
                    that.animateScale(lvlcompTxt, 1.12, function () {
                        that.animateScale(lvlcompTxt, 1);
                        let scoreRect = that.add.rectangle(180, 260, 200, 100, 0x1B98D1);
                        scoreRect.setAlpha(0).setStrokeStyle(5, 0x6BABDA, 1);
                        that.fadeInObj(scoreRect);
                        let scoreLabTxt = that.add.text(180, 230, "SCORE", 
                            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '20pt', color: '#8CC7E7', align: 'center'});
                        scoreLabTxt.setOrigin(0.5);
                        let scoreTxt = that.add.text(180, 269, "0", 
                            {fontFamily: '\'Bevan\', cursive', fontSize: '35pt', color: '#FAF5AB', align: 'center'});
                        scoreTxt.setOrigin(0.5);
                        that.time.addEvent({
                            delay: 600,
                            loop: false,
                            callback: function () {
                                that.scoreUp(scoreTxt, data.score, function () {
                                    that.time.addEvent({
                                        delay: 600,
                                        loop: false,
                                        callback: function () {
                                            let homeBtn = that.add.image(180, 420, "home_btn").setScale(0.22).setAlpha(0).setInteractive();
                                            that.homeBtn = homeBtn;
                                            that.fadeInObj(homeBtn);
                                            homeBtn.addListener("pointerup", that.bindFn(that.onHomeClick));
                                            homeBtn.addListener("pointerdown", that.bindFn(that.onHomeClickHold));
                                            homeBtn.addListener("pointerup", that.bindFn(that.onHomeClickRelease));
                                            homeBtn.addListener("dragend", that.bindFn(that.onHomeClickRelease));
                                            let accStampBg = that.add.image(270, 300, "nt_cytosine_basic").setScale(0.36).setAngle(15);
                                            that.fadeInObj(accStampBg);
                                            that.animateScale(accStampBg, 0.26);
                                            let accStampLbl = that.add.text(265, 320, "%", 
                                                {fontFamily: '\'Open Sans\', sans-serif', fontSize: '12pt', color: '#FCB6DF', align: 'center'}).setOrigin(0.5).setAngle(15).setAlpha(0).setScale(1.3);
                                            that.fadeInObj(accStampLbl);
                                            that.animateScale(accStampLbl, 1);
                                            let accStampTxt = that.add.text(271, 295, data.accuracy, 
                                                {fontFamily: '\'Bevan\', sans-serif', fontSize: '20pt', color: '#FFFFFF', align: 'center'}).setOrigin(0.5).setAngle(15).setAlpha(0).setScale(1.3);
                                            that.fadeInObj(accStampTxt);
                                            that.animateScale(accStampTxt, 1);
                                            that.makeDraggableNTs();
                                        }
                                    });
                                });
                            }
                        });
                    });
                });
            });
        }

        makeDraggableNTs() {
            let lowestX = 400;
            let highestX = lowestX;
            for (let i = 0; i < this.confnucleotides.length; i++) {
                let cfnt = this.confnucleotides[i];
                let nt = cfnt.clone(this);
                this.nucleotides.push(nt);
                highestX = lowestX + 75 * i;
                nt.setPosition(highestX, 650);
                nt.setDisplay("nucleotide");
                nt.setScale(0.25);
                nt.setVisible(true);
                nt.showLetter(true);
                nt.setAngle(270);
                nt.setError(cfnt.errorNT);
                nt.setMissing(cfnt.missingNT);
            }
            this.draggableNTWidth = highestX - lowestX;
            this.draggableNTX = lowestX;
            this.introDraggableNTs();
        }

        introDraggableNTs() {
            let count = 0;
            let that = this;
            this.time.addEvent({
                delay: 3,
                repeat: 50,
                callback: function () {
                    count++;
                    if (count <= 50) {
                        let dis = that.calcExponential(0, 15, 50, 2, count);
                        that.moveDraggableNTs(-1 * dis);
                    } else {
                        that.runNTTilTouch();
                        that.makeHitbox();
                    }
                }
            });
        }

        runNTTilTouch() {
            let sign = -1;
            let that = this;
            this.draggableNTTimer = this.time.addEvent({
                delay: 30,
                loop: true,
                callback: function () {
                    that.moveDraggableNTs(sign * 3);
                    if (sign < 0 && !that.canDragLeft()) {
                        sign = 1;
                    } else if (sign > 0 && !that.canDragRight()) {
                        sign = -1;
                    }
                }
            });
        }

        makeHitbox() {
            this.hitbox = this.add.rectangle(180, 650, 360, 160, 0x000);
            this.hitbox.setFillStyle(0x000, 0).setInteractive();
            this.input.setDraggable(this.hitbox);
            this.input.on("dragstart", this.bindFn(this.onDragHitboxStart));
            this.input.on("drag", this.bindFn(this.onDragHitbox));
            this.input.on("dragend", this.bindFn(this.onDragHitboxEnd));
        }

        onDragHitboxStart (input, pointer, rect) {
            let leftButtonDown = pointer.leftButtonDown();
            if (!leftButtonDown) {
                return;
            }
            if (this.draggableNTTimer) {
                this.draggableNTTimer.destroy();
                this.draggableNTTimer = null;
            }
            if (this.velocityTimer) {
                this.velocityTimer.destroy();
                this.velocityTimer = null;
            }
            let x = pointer.x;
            rect.setData("pointerStartX", x);
            rect.setData("startedDragging", true);
            rect.setData("distanceDragged", 0);
            this.timepoint1 = (new Date).getTime();
            this.timepoint2 = (new Date).getTime();
            this.position1 = x;
            this.position2 = x;
            this.velocity = 0;
        }

        onDragHitbox (input, pointer, rect, x, y) {
            let startedDragging = rect.getData("startedDragging");
            if (!startedDragging) {
                return;
            }
            let leftButtonDown = pointer.leftButtonDown();
            if (!leftButtonDown) {
                return;
            }
            let imgX = rect.getData("pointerStartX");
            let pointerX = pointer.x;
            let distanceDraggedNew = pointerX - imgX;
            let distanceDragged = rect.getData("distanceDragged");
            let displacement = distanceDraggedNew - distanceDragged;
            if (displacement < 0 && !this.canDragLeft(displacement)) {
                return;
            } else if (displacement > 0 && !this.canDragRight(displacement)) {
                return;
            }
            this.moveDraggableNTs(displacement);
            rect.setData("distanceDragged", distanceDraggedNew);
            this.timepoint1 = this.timepoint2;
            this.position1 = this.position2;
            this.timepoint2 = (new Date).getTime();
            this.position2 = pointerX;
        }

        onDragHitboxEnd (input, pointer, rect) {
            let startedDragging = rect.getData("startedDragging");
            if (!startedDragging) {
                return;
            }
            rect.setData("startedDragging", false);
            rect.setData("distanceDragged", 0);
            this.velocity = (this.position2 - this.position1) / (this.timepoint2 - this.timepoint1);
            this.doVelocityDragNT();
        }

        doVelocityDragNT() {
            let that = this;
            this.velocityTimer = this.time.addEvent({
                loop: true,
                delay: 10,
                callback: function () {
                    that.moveDraggableNTs(that.velocity * 2);
                    that.velocity = that.velocity * 0.95;
                    if (Math.abs(that.velocity) < 0.001 || (that.velocity < 0 && !that.canDragLeft(that.velocity)) || (that.velocity > 0 && !that.canDragRight(that.velocity))) {
                        that.velocityTimer.destroy();
                        that.velocity = 0;
                    }
                }
            });
        }

        moveDraggableNTs(displacement) {
            for (let i = 0; i < this.nucleotides.length; i++) {
                let nt = this.nucleotides[i];
                let x = nt.getObject().x + displacement;
                nt.setPosition(x, nt.getObject().y);
                if (i == 0) {
                    this.draggableNTX = x;
                }
            }
        }

        canDragLeft(displacement=0) {
            return this.draggableNTWidth + this.draggableNTX + displacement > 0;
        }

        canDragRight(displacement=0) {
            return this.draggableNTX + displacement < 360;
        }

        scoreUp(text, score, callback=null) {
            let sctxt = parseInt(text.text);
            if (sctxt == score) {
                if (callback) {
                    callback();
                }
            } else {
                let perc = Math.floor((Math.random() * 3) + 1) / 100;
                perc = score * perc;
                sctxt = Math.min(sctxt + perc, score);
                text.setText(sctxt);
                let that = this;
                this.time.addEvent({
                    delay: 1,
                    loop: false,
                    callback: function () {
                        that.scoreUp(text, score, callback);
                    }
                });
            }
        }

        calcExponential(x1, y1, x2, y2, x) {
            x1 = 0; // assuming this is always 0
            let a = y1;
            let b = Math.pow(Math.E, Math.log(y2 / y1) / x2);
            return a * Math.pow(b, x);
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
                currentAlpha = 0.1;
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

        moveToY(obj, y, callback=null) {
            let currentY = obj.y;
            if (Math.abs(currentY - y) < 2) {
                obj.setPosition(obj.x, y);
                if (callback != null) {
                    callback();
                }
            } else {
                let perc = y - currentY;
                perc = perc * 0.3;
                obj.setPosition(obj.x, currentY + perc);
                let that = this;
                this.time.addEvent({
                    delay: 10,
                    loop: false,
                    callback: function () {
                        that.moveToY(obj, y, callback);
                    }
                });
            }
        }

        animateScale(obj, scale, callback=null) {
            let currentScale = obj.scale;
            if (currentScale == 0) {
                currentScale = 0.01;
            }
            if (Math.abs(currentScale - scale) < 0.01) {
                obj.setScale(scale);
                if (callback != null) {
                    callback();
                }
            } else {
                let perc = scale - currentScale;
                perc = perc * 0.3;
                obj.setScale(currentScale + perc);
                let that = this;
                this.time.addEvent({
                    delay: 10,
                    loop: false,
                    callback: function () {
                        that.animateScale(obj, scale, callback);
                    }
                });
            }
        }

        fadeInObj(obj, callback=null) {
            let currentAlpha = obj.alpha;
            if (currentAlpha == 0) {
                currentAlpha = 0.01;
            }
            if (currentAlpha > 0.99) {
                obj.setAlpha(1);
                if (callback != null) {
                    callback();
                }
            } else {
                let perc = 1 - currentAlpha;
                perc = perc * 0.2;
                obj.setAlpha(currentAlpha + perc);
                let that = this;
                this.time.addEvent({
                    delay: 10,
                    loop: false,
                    callback: function () {
                        that.fadeInObj(obj, callback);
                    }
                });
            }
        }

        onHomeClick(img) {
            if (img != this.homeBtn) {
                return;
            }
            this.camera.fadeOut(600, 0, 0, 0, function (camera, progress) {
                if (progress < 0.9) {
                    return;
                }
                this.scene.start("titlescreen", {skipToLevelsList: true, gameObj: this.gameObj, fadeIn: true});
            });
        }

        onHomeClickHold(img) {
            if (img != this.homeBtn) {
                return;
            }
            this.homeBtn.setScale(0.18);
        }

        onHomeClickRelease(img) {
            this.homeBtn.setScale(0.22);
        }
    }

    window.game = new Game([
        {
            // "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATA"
            "ntSequence": "ATATTTTAAATATATATATA",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "AT the Beginning",
            "speed": 20,
            "popups": {
                "firstCorrectMatch": "Good work! <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> binds with <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>!",
                "error5Match": "In DNA <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> can only bind to <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>, both nucleotides help make up DNA!"
            },
            "rotateNT": false,
            "ntType": "basic",
        },
        {
            "ntSequence": "CGCGCGCGGGGCCGCGCGGC",
            "controls": ["G", "C"],
            "unlocked": true,
            "name": "Clash of the Cs and Gs",
            "speed": 20,
            "rotateNT": false,
            "ntType": "basic",
        },
        {
            "ntSequence": "TAGTTACTAGGAGAGGTCAT",
            "unlocked": true,
            "name": "Mixing Things Up",
            "speed": 20,
            "rotateNT": false,
            "ntType": "basic",
        },
        {
            "ntSequence": "GTAATCACTAAGTAGTAATACCCTCACTGAATGTGTAACGCCGTTCGGACAACCAAGCTGCACCATTGCTCTACATTCATGTGACGGCCGACCGAG",
            "unlocked": true,
            "name": "Adding a Bit of a Twist",
            "speed": 30,
            "rotateNT": true,
            "ntType": "hbonds",
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
            "ntSequence": "ATT",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "It's Debug Time!",
            "speed": 1,
            "popups": {
                "firstCorrectMatch": "Good work! <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> binds with <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>!",
                "error5Match": "In DNA <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> can only bind to <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>, both nucleotides help make up DNA!"
            },
            "rotateNT": false,
            "ntType": "basic",
        },
    ]);
})();