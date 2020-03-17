/**
 * Represents the level complete screen
 * @extends Phaser.Scene
 */
class LevelComplete extends Phaser.Scene {
    /**
     * Creates a level complete scene
     * @param {Phaser.Types.Scenes.SettingsConfig} config 
     */
    constructor(config) {
        super(config);
    }

    /**
     * Sets up the level complete screen graphics and starts it
     * @param {JSON} data 
     */
    init(data) {
        // Color Constants
        let ORANGE = 0xFE5832;
        let DARK_BLUE = 0x002664;
        let CYAN = 0x21EEE9;
        let BLUE = 0x006FFF;
        let WHITE = 0xFFFFFF;
        let DARKER_BLUE = 0x0e1e2d;

        this.level = data.level;
        this.confnucleotides = data.nucleotides;
        this.lvlType = data.lvlType;
        this.nucleotides = [];
        this.draggableNTWidth = 0;
        this.draggableNTX = 0;
        this.quiz = data.quiz;
        this.score = data.score;
        this.knowledgepanel = data.knowledgepanel;
        this.sequencedinfo = data.sequencedinfo;

        this.quizPointWorth = 500;

        this.gameObj = data.gameObj;
        this.camera = this.cameras.main;
        this.camera.setAlpha(0);

        this.graphics = this.add.graphics();

        this.graphics.fillStyle(0x000000, 0.50);
        this.graphics.fillRect(0, 0, 360, 740);
        this.cntTimer = 10;
        this.quizAnswered = false;

        let that = this;
        this.data = data;
        this.domOverlay = null;

        // Invisible, non interactable (yet) UI
        this.levelsBtn = this.add.image(180, 520, "levels_btn").setScale(0.5).setAlpha(0).setDepth(100);
        this.nextBtn = this.add.image(180, 620, "next_btn").setScale(0.5).setAlpha(0).setDepth(100);

        this.fadeIn(function () {
            // Level Complete
            let rectbg = that.add.rectangle(180, -100, 300, 250, BLUE);
            rectbg.setStrokeStyle(2, WHITE, 1);
            that.rectbg = rectbg;
            that.moveToY(rectbg, 240, function () {
                let lvlcompTxt = that.add.text(180, 155, "Level Complete!", 
                    {fontFamily: 'Teko', fontSize: '27pt', color: '#FFFFFF', align: "center"});
                lvlcompTxt.setOrigin(0.5).setScale(0);
                that.animateScale(lvlcompTxt, 1.12, function () {
                    that.animateScale(lvlcompTxt, 1);
                    let scoreRect = that.add.rectangle(180, 260, 200, 100, ORANGE);
                    scoreRect.setAlpha(0).setStrokeStyle(2, WHITE, 1);
                    that.scoreRect = scoreRect;
                    that.fadeInObj(scoreRect);
                    let scoreLabTxt = that.add.text(180, 230, "SCORE", 
                        {fontFamily: 'Teko', fontSize: '20pt', color: '#FFFFFF', align: 'center'});
                    scoreLabTxt.setOrigin(0.5);
                    that.scoreLabTxt = scoreLabTxt;
                    let scoreTxt = that.add.text(180, 269, "0", 
                        {fontFamily: 'Teko', fontSize: '35pt', color: '#FFFFFF', align: 'center'});
                    scoreTxt.setOrigin(0.5);
                    that.scoreTxt = scoreTxt;

                    // Score up animation
                    that.time.addEvent({
                        delay: 600,
                        loop: false,
                        callback: function () {
                            that.scoreUp(scoreTxt, data.score, function () {
                                that.time.addEvent({
                                    delay: 600,
                                    loop: false,
                                    callback: function () {
                                        // Popup elements that go on top of the score box
                                        // Conveys accuracy and mutation information
                                        let accStampBg = that.add.rectangle(125, 150, 180, 50, BLUE).setDepth(1).setStrokeStyle(2, WHITE, 1);
                                        that.fadeInObj(accStampBg);
 
                                        let accStampTxt = that.add.text(280, 180, data.accuracy + "%" + " Accurate!", 
                                            {fontFamily: 'Teko', fontSize: '18pt', color: '#FFFFFF', align: 'center'}).setOrigin(0.5).setAlpha(0).setScale(1.3).setDepth(2);
                                        that.fadeInObj(accStampTxt);
                                        that.animateScale(accStampTxt, 1);

                                        
                                        
                                        let mutationCount = 0;
                                        let missingCount = 0;
                                        for (let i = 0; i < data.nucleotides.length; i++) {
                                            if (Boolean(data.nucleotides[i].errorNT)) {
                                                mutationCount++;
                                            } else if (Boolean(data.nucleotides[i].missingNT)) {
                                                missingCount++;
                                            }
                                        }

                                        // Quick global updates
                                        /*
                                        that.gameObj.GLOBAL.TOTAL_LEVELS_PLAYED++;
                                        that.gameObj.GLOBAL.TOTAL_MUTATIONS += mutationCount;
                                        that.gameObj.GLOBAL.TOTAL_MISSED += Math.round( (data.nucleotides.length - (data.nucleotides.length * (data.accuracy/100))));
                                        */

                                        let mutationTxt = that.add.text(280, 180, mutationCount + " Mutations Introduced!", 
                                            {fontFamily: 'Teko', fontSize: '18pt', color: '#FFFFFF', align: 'center'}).setOrigin(0.5).setAlpha(0).setScale(1.3).setDepth(2);
                                        that.fadeInObj(mutationTxt);
                                        that.animateScale(mutationTxt, 1);
            
                                        
                                        // These animations determine the final position of the ui elements...
                                        that.tweens.add({ targets: scoreRect, x: 180, y: 100, duration: 300, ease: 'power4' });
                                        that.tweens.add({ targets: scoreLabTxt, x: 180, y: 75, duration: 300, ease: 'power4' });
                                        that.tweens.add({ targets: scoreTxt, x: 180, y: 110, duration: 300, ease: 'power4' });
                                        that.tweens.add({ targets: accStampBg, x: 220, y: 165, duration: 300, ease: 'power4' });
                                        that.tweens.add({ targets: accStampTxt, x: 190, y: 155, duration: 300, ease: 'power4' });

                                        that.tweens.add({ targets: mutationTxt, x: 220, y: 175, duration: 300, ease: 'power4' });

                                        that.tweens.add({ targets: lvlcompTxt, alpha: 0, duration: 400, ease: 'power4' });
                                        that.tweens.add({ targets: rectbg, alpha: 0, duration: 400, ease: 'power4' });


                                        console.log(that);
                                        let levelData = data.gameObj.levels[that.level];
                                        let performance = {
                                            timestamp: new Date().toLocaleString("en-US"), // timestamp when level was finished
                                            level: that.level + 1, // what number level is this in the campaign
                                            process: levelData.process, // what process of DNA replication was being played?
                                            lvlType: that.lvlType, // what type of level was this ("dna_replication" vs "codon_transcription"
                                            speed: levelData.speed, // speed of the level,
                                            score: that.score, // the score the player earned during the level
                                            rotateNT: levelData.rotateNT, // was this level a rotational level?
                                            missed: missingCount, // how many objects were missed
                                            correct: data.nucleotides.length - missingCount - mutationCount, // how many objects were correct
                                            error: mutationCount, // how many objects were errored
                                            total: data.nucleotides.length, // how many objects were in the total sequence
                                            levelNum: that.gameObj.GLOBAL.LEVEL_PERFORMANCE.length + 1 // how many levels were already completed (including this one)
                                        }
                                        that.gameObj.GLOBAL.LEVEL_PERFORMANCE.push(performance)
                                        
                                        // store progress in database.
                                        that.updateDatabaseUserGlobal(data);

                                        that.presentEndscreenOptions();
                                        console.log(data);

                                        // Introduces draggable NTs
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

    countDownTimer(callback=null) {
        if (this.cntTimer == 0) {
            this.countdownText.setVisible(false);
            if (callback != null) {
                callback();
            }
        } else {
            this.cntTimer--;
            this.countdownText.setText(this.cntTimer);
            let that = this;
            this.time.addEvent({
                delay: 1000,
                callback: function () {
                    that.countDownTimer(callback);
                }
            });
        }
    }

    /**
     * Creates the draggable nucleotides at the bottom
     */
    makeDraggableNTs() {
        let lowestX = 400;
        let highestX = lowestX;
        for (let i = 0; i < this.confnucleotides.length; i++) {
            let cfnt = this.confnucleotides[i];
            let nt = cfnt.clone(this);
            this.nucleotides.push(nt);
            highestX = lowestX + 85 * i;
            nt.setPosition(highestX, 650);
            if (this.lvlType == "dna_replication") {
                nt.setDisplay("nucleotide");
                nt.setScale(0.25);
                nt.showLetter(true);
            } else if (this.lvlType == "codon_transcription") {
                nt.setDisplay("codon");
                nt.removeCodonDisplay("codon");
                nt.setScale(0.55);
                nt.showLetter(false);
            }
            nt.setVisible(true);
            nt.setAngle(270);
            nt.setError(cfnt.errorNT);
            nt.setMissing(cfnt.missingNT);
        }
        this.draggableNTWidth = highestX - lowestX;
        this.draggableNTX = lowestX;
        this.introDraggableNTs();
    }

    /**
     * Animates a neat little intro that the draggable nucleotides to come in
     */
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

    /**
     * Keeps the nucleotides moving until touched
     */
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

    /**
     * Make touch hit box
     */
    makeHitbox() {
        this.hitbox = this.add.rectangle(180, 670, 360, 140, 0x000);
        this.hitbox.setFillStyle(0x000, 0).setInteractive();
        this.input.setDraggable(this.hitbox);
        this.input.on("dragstart", this.bindFn(this.onDragHitboxStart));
        this.input.on("drag", this.bindFn(this.onDragHitbox));
        this.input.on("dragend", this.bindFn(this.onDragHitboxEnd));
    }

    /**
     * When the rectangle hitbox gets touch start
     * @param {Phaser.Input.InputPlugin} inputPlugin - input
     * @param {Phaser.Input.Pointer} pointer - The pointer
     * @param {Phaser.GameObjects.Rectangle} rect - the rectangle
     */
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

    /**
     * When the hitbox gets dragged
     * @param {Phaser.Input.InputPlugin} input - input
     * @param {Phaser.Input.Pointer} pointer - The pointer
     * @param {Phaser.GameObjects.Rectangle} rect - the rectangle
     * @param {number} x - Current x
     * @param {number} y - current y
     */
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

    /**
     * When dragging stops
     * @param {Phaser.Input.InputPlugin} input - input
     * @param {Phaser.Input.Pointer} pointer - The pointer
     * @param {Phaser.GameObjects.Rectangle} rect - the rectangle
     */
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

    /**
     * Keep moving until no velocity is left
     */
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

    /**
     * Move the draggable nucleotides by this amount
     * @param {number} displacement 
     */
    moveDraggableNTs(displacement) {
        if (isNaN(displacement)) {
            return;
        }
        for (let i = 0; i < this.nucleotides.length; i++) {
            let nt = this.nucleotides[i];
            let x = nt.getObject().x + displacement;
            nt.setPosition(x, nt.getObject().y);
            if (i == 0) {
                this.draggableNTX = x;
            }
        }
    }

    /**
     * Can it be dragged left?
     * @param {number} [displacement=0] - Number to be dragged 
     */
    canDragLeft(displacement=0) {
        return this.draggableNTWidth + this.draggableNTX + displacement > 0;
    }

    /**
     * Can it be dragged right?
     * @param {number} [displacement=0] - number to be dragged
     */
    canDragRight(displacement=0) {
        return this.draggableNTX + displacement < 360;
    }

    /**
     * Animates score going up for the text field
     * @param {Phaser.GameObjects.Text} text 
     * @param {number} score 
     * @param {function} callback 
     */
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
            text.setText(Math.floor(sctxt));
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

    /**
     * Calculates an exponential curve and uses the passed in X to determine the Y value.
     * @param {number} x1 - The starting X. is always 0
     * @param {number} y1 - Starting Y
     * @param {number} x2 - Ending X
     * @param {number} y2 - Ending Y
     * @param {number} x - The x position
     * @returns {number} The resulting answer
     */
    calcExponential(x1, y1, x2, y2, x) {
        x1 = 0; // assuming this is always 0
        let a = y1;
        let b = Math.pow(Math.E, Math.log(y2 / y1) / x2);
        return a * Math.pow(b, x);
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
     * Fade in camera scene
     * @param {function} [callback=null] - should be called when done fading in
     */
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

    /**
     * Move the given object to a position in Y coord
     * @param {Phaser.GameObjects} obj - Object to be moved
     * @param {number} y - Y coord
     * @param {function} [callback=null] - callback function
     */
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

    /**
     * Animates the scale of an object
     * @param {Phaser.GameObjects} obj - Object scale to be animated
     * @param {number} scale - resulting scale
     * @param {function} [callback=null] - function to be called after done
     */
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

    /**
     * Fade in the object from alpha 0 to 1
     * @param {Phaser.GameObjects} obj - Object to fade in
     * @param {function} [callback=null] - callback to be called when done fading
     */
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

    /**
     * Triggered on home click
     * @param {Phaser.GameObjects.Image} img - home button img obj
     */
    onLevelsClick(img) {
        if (img != this.levelsBtn) {
            return;
        }
        this.levelsBtn.removeInteractive();
        this.scene.stop("level" + this.level);
        this.scene.start("titlescreen", {skipToLevelsList: true, gameObj: this.gameObj, fadeIn: true});
    }

    /**
     * Triggered on next click
     * @param {Phaser.GameObjects.Image} img - next button img obj
     */
    onNextClick(img) {
        if (img != this.nextBtn) {
            return;
        }
        this.nextBtn.removeInteractive();
        this.scene.stop("level" + this.level);
        let newNum = Number(this.level) + Number(1);
        this.scene.start("levelpre" + newNum);
    }    

    doQuiz() {
        this.quizOverlay = this.add.dom(180, 900).createFromCache("html_quiz");
        this.quizOverlay.setScale(1.1);
        this.quizOverlay.getChildByID("quiz-question").textContent = this.quiz.question;
        this.quizOverlay.getChildByID("quiz-options").innerHTML = "";
        this.quizOverlay.getChildByID("quiz-submit-btn").classList.add("hidden");
        let choices = [];
        for (let i = 0; i < this.quiz.options.length; i++) {
            let option = this.quiz.options[i];
            let li = document.createElement("li");
            li.textContent = option;
            choices.push(li);
        }
        choices = this.shuffleArray(choices);
        for (let i = 0; i < choices.length; i++) {
            let li = choices[i];
            this.quizOverlay.getChildByID("quiz-options").appendChild(li);
            let that = this;
            li.addEventListener("click", function () {
                if (that.quizAnswered) {
                    return;
                }
                that.quizOverlay.getChildByID("quiz-submit-btn").classList.remove("hidden");
                let lastselected = that.quizOverlay.getChildByID("quiz-options").querySelector(".selected");
                if (lastselected) {
                    lastselected.classList.remove("selected");
                }
                this.classList.add("selected");
            });
        }
        let that = this;
        this.quizOverlay.node.querySelector("#quiz-submit-btn").addEventListener("click", function () {
            this.classList.add("hidden");
            that.quizAnswered = true;
            let quizOpts = that.quizOverlay.getChildByID("quiz-options").querySelectorAll("li");
            let answeredOption = "";
            let correctness = true;
            for (let i = 0; i < quizOpts.length; i++) {
                let li = quizOpts[i];
                if (li.textContent == that.quiz.options[0]) {
                    li.classList.add("correct");
                } else if (li.classList.contains("selected")) {
                    li.classList.add("wrong");
                    correctness = false;
                }
                if (li.classList.contains("selected")) {
                    answeredOption = li.textContent;
                }
            }
            if (cdapi.isLoggedIn()) {
                cdapi.logQuestionResponse(that.level, answeredOption, + correctness, cdapi.getCurrentSession());
            }
            if (correctness) { // Upon selecting correct quiz answer
                // that.gameObj.GLOBAL.SCORE += that.quizPointWorth;
                // that.gameObj.GLOBAL.QUIZ_QUESTIONS_CORRECT++;
                let bonustxt = that.add.text(180, 269, "+" + that.quizPointWorth + " BONUS!", 
                    {fontFamily: '\'Bevan\', cursive', fontSize: '29pt', color: '#78D863', align: 'center'});
                bonustxt.setOrigin(0.5);
                that.tweens.add({ targets: bonustxt, y: 60, duration: 1900, ease: 'Power3' });
                that.time.addEvent({
                    delay: 1100,
                    callback: function () {
                        that.tweens.add({ targets: bonustxt, alpha: 0, duration: 1500, ease: 'Power3' });
                    }
                });
            } else {
                // that.gameObj.GLOBAL.QUIZ_QUESTIONS_WRONG++;
            }
            that.time.addEvent({
                delay: 2500,
                callback: function () {
                    that.tweens.add({ targets: that.quizOverlay.rotate3d, x: 1, w: 90, duration: 600, ease: 'Power3' });

                    that.tweens.add({ targets: that.quizOverlay, scaleX: 0.75, scaleY: 0.75, y: 900, alpha: 0.6, duration: 600, ease: 'Power3',
                        onComplete: function ()
                        {
                            that.quizOverlay.setVisible(false);
                        }
                    });
                    let newScore = that.score;
                    let delayscore = 0;
                    if (correctness) {
                        newScore = newScore + 500;
                        delayscore = 600;
                    }
                    if (cdapi.isLoggedIn()) {
                        cdapi.logLevelCompletion(that.level, {
                            "score": newScore,
                            "session_code": cdapi.getCurrentSession(),
                        });
                    }
                    that.scoreUp(that.scoreTxt, newScore, function () {
                        that.time.addEvent({
                            delay: delayscore,
                            callback: function () {
                                that.tweens.add({ targets: that.knowledgePanelOverlay, alpha: 0, duration: 500});
                                
                                that.presentEndscreenOptions();

                                /*
                                that.camera.fadeOut(600, 0, 0, 0, function (camera, progress) {
                                    if (progress < 0.9) {
                                        return;
                                    }
                                });
                                */
                            }
                        });
                    });
                }
            });
        });

        this.tweens.add({
            targets: this.quizOverlay,
            y: 360,
            duration: 500,
            ease: 'Power3'
        });
    }

    presentEndscreenOptions() {

        console.log(this.data);
        // I need the username, sessionID, and level
        //this.showLevelLeaderboard(this.data.gameObj.userName, this.data.gameObj.sessionID, this.data.level, 25);

        this.levelsBtn.setInteractive();
        this.levelsBtn.addListener("pointerup", this.bindFn(this.onLevelsClick));
        this.levelsBtn.addListener("pointerdown", this.bindFn(this.onButtonClickHold));
        this.levelsBtn.addListener("pointerup", this.bindFn(this.onButtonClickRelease));
        this.levelsBtn.addListener("dragend", this.bindFn(this.onButtonClickRelease));    
        this.fadeInObj(this.levelsBtn);

        // The next button won't show up if there isn't a next level to play.
        if (this.level < this.gameObj.levels.length - 1) {
            this.nextBtn.setInteractive();
            this.nextBtn.addListener("pointerup", this.bindFn(this.onNextClick));
            this.nextBtn.addListener("pointerdown", this.bindFn(this.onButtonClickHold));
            this.nextBtn.addListener("pointerup", this.bindFn(this.onButtonClickRelease));
            this.nextBtn.addListener("dragend", this.bindFn(this.onButtonClickRelease));   
            this.fadeInObj(this.nextBtn);
        }

    
    }

    showLevelLeaderboard(userName, sessionID, level, rows) {
        // show level end leaderboard
        if (this.domOverlay) {
            return;
        }

        let html = document.createElement("html");
        html.innerHTML = this.cache.html.entries.get("html_levelleaderboard");

        this.domOverlay = this.add.dom(180, 360).createFromHTML(String(html.innerHTML));

        if (sessionID != "") {
            this.domOverlay.getChildByID("sessions-level-displ").textContent = level;
            this.domOverlay.getChildByID("sessions-name-displ").textContent = sessionID;
            this.domOverlay.getChildByID("sessions-username").textContent = "Username: " + userName;
            let table = this.domOverlay.getChildByID("sessions-leaderboard-table");
            cdapi.getLevelLeaderboard(sessionID, level, rows).then(results => {
                this.displayLeaderboardResults(results, table);
            });
        } else {
            this.domOverlay.getChildByID("sessions-name-displ").textContent = "Currently not signed into any session.";
        }

    }

    displayLeaderboardResults(results, table) {
        // Clear table
        table.innerHTML = "";

        // Add back in headers
        let header = document.createElement("tr");
        let rankHeading = document.createElement("th");
        let nameHeading = document.createElement("th");
        let valueHeading = document.createElement("th");

        rankHeading.textContent = "Rank";
        nameHeading.textContent = "Name";
        valueHeading.textContent = "Score";

        nameHeading.classList.add("name");

        header.appendChild(rankHeading);
        header.appendChild(nameHeading);
        header.appendChild(valueHeading);
        table.appendChild(header);

        // Fill out table
        for (let i = 0; i < results.length; i++) {
            let entry = document.createElement("tr");
            let rank = document.createElement("td");
            let userName = document.createElement("td");
            let value = document.createElement("td");

            rank.textContent = i + 1;
            userName.textContent = results[i].userName;
            value.textContent = results[i].value;

            entry.appendChild(rank);
            entry.appendChild(userName);
            entry.appendChild(value);

            table.appendChild(entry);
        }
    }    

    updateDatabaseUserGlobal(data) {
        // add their current progress to the database,
        // but only if they have a userName and sessionID
        if (data.gameObj.userName != "" && data.gameObj.sessionID != "") {
            cdapi.storeNewGlobalVariable(data.gameObj.userName, data.gameObj.sessionID, data.gameObj.GLOBAL).then(result => {
                console.log("object stored: ");
                console.log(data.gameObj.GLOBAL);
            }).catch(err => {
                console.log("problem storing new global variable: " + err);
            });
        }
    }

    shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /**
     * If button is held
     * @param {Phaser.GameObjects.Image} img - button img obj
     */
    onButtonClickHold(img) {
        img.setScale(0.45);
    }

    /**
     * If button is released
     * @param {Phaser.GameObjects.Image} img - button img obj
     */
    onButtonClickRelease(img) {
        img.setScale(0.50);
    }
}

export default LevelComplete;
