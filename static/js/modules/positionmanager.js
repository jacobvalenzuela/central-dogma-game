import Nucleotide from "./nucleotide.js";

/**
 * Class representing the manager that will manipulate nucleotide positions
 */
class PositionManager {
    /**
     * Creates a position manager
     * @param {LevelStage} level - The level that the position belong to
     * @param {number} defaultTimerDelay - The delay that the position get updated a tick, smaller is faster
     */
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
            if (nucleotide && this.level.levelConfig.lvlType == "dna_replication") {
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
        if (this.level.levelConfig.lvlType == "dna_replication") {
            this.inputComplRowPath.draw(this.level.graphics);
        }
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

    /**
     * Update the nucleotides position
     * @param {boolean} [animate=true] - Whether the positions should animate to make a smoother transition
     */
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
            if (this.level.levelConfig.lvlType == "dna_replication") {
                nucleotide.setDisplay("nucleotide");
            } else if (this.level.levelConfig.lvlType == "codon_transcription") {
                let exp = this.calcExponential(0, 80, initVertPathPts.length, 15, i);
                x = x - exp;
                if (nucleotide.display != "codon") {
                    nucleotide.setPosition(x, y);
                }
                nucleotide.setDisplay("codon");
                nucleotide.removeCodonDisplay("amminoacid");
            }
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
            let modifier1 = 0;
            let modifier2 = 0;
            if (this.level.levelConfig.lvlType == "codon_transcription") {
                modifier1 = 0.35;
                modifier2 = 0.15;
            }
            let scale = this.calcInScale(i, modifier, modifier1, modifier2);
            let scalePrev = this.calcInScale(i - 1, modifier, modifier1, modifier2);
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
            nucleotide.setDisplay("rectangle");
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

    /**
     * Calculates the scale that comes in on the vertical path
     * @param {number} idx - The index of the nucleotide
     * @param {number} modifier - The number to influence in the size
     * @returns {number} the resulting answer
     */
    calcInScale(idx, modifier=0, modifier1=0, modifier2=0) {
        //  x1 y1    x2   y2
        // (0, 17/50) (180, 11/100)
        const x1 = 0;
        const y1 = 17 / 50 + modifier + modifier1;
        const x2 = 180;
        const y2 = 45 / 500 + modifier + modifier2;
        return this.calcExponential(x1, y1, x2, y2, idx);
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
        if (y2 == 0) {
            y2 = 0.00001;
        }
        x1 = 0; // assuming this is always 0
        let a = y1;
        let b = Math.pow(Math.E, Math.log(y2 / y1) / x2);
        return a * Math.pow(b, x);
    }

    /**
     * Start the timer at default delay
     */
    start() {
        this.startNTMoveTimer(this.defaultTimerDelay);
    }

    /**
     * Start the nucleotides move timer
     * @param {number} delay - timer day 
     */
    startNTMoveTimer(delay) {
        let that = this;
        this.autoMoveTimer = this.game.time.addEvent({
            delay: delay,
            callback: function () {that.next();},
            loop: true
        });
    }

    /**
     * Stop nucleotides move timer
     */
    stopNTMoveTimer() {
        if (this.autoMoveTimer) {
            this.autoMoveTimer.remove();
            this.autoMoveTimer = null;
        }
    }

    /**
     * Restarts the timer with a new delay
     * @param {number} newDelay - The new delay
     */
    updateNTMoveTimer(newDelay) {
        this.stopNTMoveTimer();
        this.startNTMoveTimer(newDelay);
    }

    /**
     * Move nucleotide to a position and animate it along the way
     * @param {Nucleotide} nucleotide - Nucleotide to move
     * @param {number} x - X to move to
     * @param {number} y - Y to move to
     * @param {function} callback - Function to call when done moving
     */
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

    /**
     * Animate the nucleotides scale
     * @param {Nucleotide} nucleotide - Nucleotide to animate the scale
     * @param {number} scale - The scale it should go to
     * @param {function} callback - Function to be called when done scaling
     */
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

    /**
     * Fade out nucleotide
     * @param {Nucleotide} nucleotide - nucleotide to fade
     * @param {function} [callback=null] - function to be called after done fading
     */
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

    /**
     * Increments the nucleotides position by one
     */
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

    /**
     * From the given nucleotide, find the matching NT pair that works
     * @param {Nucleotide} nucleotide - Nucleotide to reference from
     * @returns {Nucleotide} matching nucleotide
     */
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

    /**
     * Removes the head nucleotide from the incoming call stack.
     */
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

    /**
     * Get the head nucleotide from the imcoming stack.
     * @returns {Nucleotide} the head nucleotide
     */
    getHeadNucleotide(ignorePocket=false) {
        if (ignorePocket) {
            for (let i = 0; i < this.levelNucleotides.length; i++) {
                let nucleotide = this.levelNucleotides[i];
                if (nucleotide) {
                    return nucleotide;
                }
            }
            return null;
        }
        if (this.ntTouchingBindingPocket()) {
            for (let i = 0; i < this.levelNucleotides.length; i++) {
                if (this.levelNucleotides[i] != null) {
                    return this.levelNucleotides[i];
                }
            }
        }
        return null;
    }

    /**
     * Adds a nucleotide to the output stack
     * @param {Nucleotide} nucleotide - The nucleotide that should be added to the output stack
     */
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

    /**
     * Rejects the given nucleotide. Comes with animation and everything
     * @param {Nucleotide} nucleotide - to be rejected
     */
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

    /**
     * Get the number of nucleotides in the level
     * @returns {number} Num of nt in lvl
     */
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

    /**
     * Is the head nucleotide touching the binding pocket?
     * @returns {boolean} if the head nucleotide touch the binding pocket
     */
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

    /**
     * Rotates the given coordinate about the object angle
     * @param {Phaser.GameObjects} obj - Object that has been rotated
     * @param {Phaser.Math.Vector2} cornerCoord - The corner coordinate that should be rotated
     */
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

export default PositionManager;
