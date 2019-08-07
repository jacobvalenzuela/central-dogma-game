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
        this.level = data.level;
        this.confnucleotides = data.nucleotides;
        this.lvlType = data.lvlType;
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
            } else if (this.lvlType == "codon_transcription") {
                nt.setDisplay("codon");
            }
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
        this.hitbox = this.add.rectangle(180, 650, 360, 160, 0x000);
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
    onHomeClick(img) {
        if (img != this.homeBtn) {
            return;
        }
        this.camera.fadeOut(600, 0, 0, 0, function (camera, progress) {
            if (progress < 0.9) {
                return;
            }
            this.scene.stop("level" + this.level);
            this.scene.start("titlescreen", {skipToLevelsList: true, gameObj: this.gameObj, fadeIn: true});
        });
    }

    /**
     * If button is held
     * @param {Phaser.GameObjects.Image} img - home button img obj
     */
    onHomeClickHold(img) {
        if (img != this.homeBtn) {
            return;
        }
        this.homeBtn.setScale(0.18);
    }

    /**
     * If home button is released
     * @param {Phaser.GameObjects.Image} img - home button img obj
     */
    onHomeClickRelease(img) {
        this.homeBtn.setScale(0.22);
    }
}

export default LevelComplete;
