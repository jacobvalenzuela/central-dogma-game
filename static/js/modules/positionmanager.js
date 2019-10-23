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
        this.pathPointsFactor = 30;
        this.level = level;
        this.defaultTimerDelay = defaultTimerDelay;
        this.gameObj = level.gameObj;
        this.game = level;
        this.levelNucleotides = [];
        this.hasFrozenHead = false;

        // One of the many if special cases to distinguish codon and dna levels
        // All this code below is for path line drawing
        if (this.level.levelConfig.lvlType == "dna_replication") {
            // This loop is important, says how many total "spots" along line.
            for (let i = 0; i < this.level.nucleotides.length * this.pathPointsFactor; i++) {
                let prevIdx = Math.floor((i - 1) / this.pathPointsFactor);
                let currIdx = Math.floor(i / this.pathPointsFactor);
                let nextIdx = Math.floor((i + 1) / this.pathPointsFactor);

                if (currIdx === nextIdx) {
                    // Spaces out nucleotides
                    this.levelNucleotides.push(null);
                    this.levelNucleotides.push(null);
                    continue;
                }
                this.levelNucleotides.push(this.level.nucleotides[currIdx]);
            }

        // Controls the spacing between codons as they travel the path.
        } else if (this.level.levelConfig.lvlType == "codon_transcription") {
            
            // Initial spacing before first codon.
            for (let i = 0; i < 120; i++) {
                this.levelNucleotides.push(null);
            }

            // Fills up the rest of the level sequence.
            for (let i = 0; i < this.level.nucleotides.length; i++) {
                // How much spacing to add between each codon.
                for (let j = 0; j < 50; j++) {
                    this.levelNucleotides.push(null);
                }
                this.levelNucleotides.push(this.level.nucleotides[i]);
            }
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
        let unshiftFactor = 0;
        if (this.level.levelConfig.lvlType == "dna_replication") {
            unshiftFactor = 3;
        } else if (this.level.levelConfig.lvlType == "codon_transcription") {
            unshiftFactor = 1;
        }
        for (let i = 0; i < this.pathPointsFactor * unshiftFactor; i++) {
            this.levelNucleotides.unshift(null);
            this.compLevelNucleotides.unshift(null);
        }
        this.selectedNucleotides = [];

        this.level.graphics.lineStyle(1, 0x6c757d, 0.6);
        if (this.level.levelConfig.lvlType == "dna_replication") {
            this.inputRowPath = new Phaser.Curves.Path(0, 140);
            this.inputRowPath.lineTo(175, 140);
        } else if (this.level.levelConfig.lvlType == "codon_transcription") {
            this.inputRowPath = new Phaser.Curves.Path(740, 140);
            this.inputRowPath.lineTo(70, 140);
        }
        this.inputRowPath.draw(this.level.graphics);
        this.initRectPathPts = this.inputRowPath.getSpacedPoints(26 * this.pathPointsFactor);
        this.inputComplRowPath = new Phaser.Curves.Path(0, 126);
        this.inputComplRowPath.lineTo(363.46153846153845, 126);
        if (this.level.levelConfig.lvlType == "dna_replication") {
            this.inputComplRowPath.draw(this.level.graphics);
        }
        this.inputCompRectPathPts = this.inputComplRowPath.getSpacedPoints(54 * this.pathPointsFactor);
        if (this.level.levelConfig.lvlType == "dna_replication") {
            this.inputVertPath = new Phaser.Curves.Path(182, 147);
            this.inputVertPath.cubicBezierTo(25, 640, 320, 320, 15, 440);
        } else if (this.level.levelConfig.lvlType == "codon_transcription") {
            // this.inputVertPath = new Phaser.Curves.Path(77, 140);
            // this.inputVertPath.cubicBezierTo(55, 800, 15, 160, 75, 440);
            this.inputVertPath = new Phaser.Curves.Path(55, 140);
            this.inputVertPath.lineTo(55, 740);
        }
        // this.inputVertPath.draw(this.level.graphics);
        let numVertPathPts = 7 * this.pathPointsFactor;

        // VERTICAL PATH
        // Change the getPoints below to alter the points on the main incoming path. Will change speed traveled along path.
        // For some reason, changing this allows nucleotides to drift beyond the binding pocket.
        if (this.level.levelConfig.lvlType == "dna_replication") {
            this.initVertPathPts = this.inputVertPath.getPoints(numVertPathPts + this.pathPointsFactor).slice(0, numVertPathPts - this.pathPointsFactor);
            this.inputVertPathDispl = new Phaser.Curves.Path(175, 140);
            this.inputVertPathDispl.cubicBezierTo(-20, 640, 320, 320, -80, 440);
        } else if (this.level.levelConfig.lvlType == "codon_transcription") {
            this.initVertPathPts = this.inputVertPath.getPoints(numVertPathPts + this.pathPointsFactor).slice(0, numVertPathPts - this.pathPointsFactor);
            this.inputVertPathDispl = new Phaser.Curves.Path(70, 140);
            this.inputVertPathDispl.cubicBezierTo(40, 600, 20, 160, 55, 440);
        }
        
        this.inputVertPathDispl.draw(this.level.graphics);
        if (this.level.levelConfig.lvlType == "dna_replication") {
            this.outputVertPath = new Phaser.Curves.Path(245, 450);
            this.outputVertPath.cubicBezierTo(145, 710, 180, 600, 100, 700);
        } else if (this.level.levelConfig.lvlType == "codon_transcription") {
            this.outputVertPath = new Phaser.Curves.Path(180, 450);
            this.outputVertPath.cubicBezierTo(220, 710, 180, 600, 120, 700);
        }
        
        // this.outputVertPath.draw(this.level.graphics);
        this.outputVertPathPts = this.outputVertPath.getPoints(5 * this.pathPointsFactor);
        if (this.level.levelConfig.lvlType == "dna_replication") {
            this.outputVertPathDispl = new Phaser.Curves.Path(285, 500);
            this.outputVertPathDispl.cubicBezierTo(155, 710, 250, 600, 130, 670);
        } else if (this.level.levelConfig.lvlType == "codon_transcription") {
            this.outputVertPathDispl = new Phaser.Curves.Path(200, 450);
            this.outputVertPathDispl.cubicBezierTo(220, 710, 200, 600, 130, 700);
        }

        // Drawing the actual curve
        this.outputVertPathDispl.draw(this.level.graphics);
        if (this.level.levelConfig.lvlType == "dna_replication") {
            this.outputRowPath = new Phaser.Curves.Path(155, 710);
            this.outputRowPath.lineTo(400, 710);
        } else if (this.level.levelConfig.lvlType == "codon_transcription") {
            this.outputRowPath = new Phaser.Curves.Path(220, 710);
            this.outputRowPath.lineTo(400, 710);
        }
        
        this.outputRowPath.draw(this.level.graphics);

        // Determines the amount of points on the output path line
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
                x = x - 70;
                nucleotide.setPosition(x, y);
                nucleotide.setDisplay("codon");
                nucleotide.removeCodonDisplay("amminoacid");
            }
            nucleotide.setVisible(true);
            nucleotide.showLetter(true);
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
                modifier1 = 0.51;
                modifier2 = 0.51;
            }
            let scale = 0;
            let scalePrev = 0;

            // Handles scaling of nucleotides/codons
            if (this.level.levelConfig.lvlType == "dna_replication") {
                scale = this.calcInScale(i, modifier, modifier1, modifier2);
                scalePrev = this.calcInScale(i - 1, modifier, modifier1, modifier2);
            } else if (this.level.levelConfig.lvlType == "codon_transcription") {
                scale = 0.8;
                scalePrev = 0.8;
                if (i == initVertPathPts.length - 1) {
                    scalePrev = 0.1;
                }
            }
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
            if (this.level.levelConfig.lvlType == "dna_replication") {
                nucleotide.setDisplay("rectangle");
            } else if (this.level.levelConfig.lvlType == "codon_transcription") {
                nucleotide.setDisplay("circle");
            }
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
        // Gets the speed attriute from the level object in the config file.
        this.startNTMoveTimer(this.defaultTimerDelay);
    }

    /**
     * Start the nucleotides move timer
     * @param {number} delay - timer delay 
     */
    startNTMoveTimer(delay) {
        if (this.autoMoveTimer) {
            return;
        }
        let that = this;
        this.autoMoveTimer = this.game.time.addEvent({
            delay: delay,
            callback: function () {
                that.next();
            },
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

    tempPauseNTMoveTime(delay=1000) {
        if (this.autoMoveTimer) {
            let nextdelay = this.autoMoveTimer.delay;
            this.autoMoveTimer.remove();
            this.autoMoveTimer = null;
            let that = this;
            this.game.time.addEvent({
                delay: delay,
                callback: function () {that.startNTMoveTimer(nextdelay)},
                loop: false
            });
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
     * Note: Currently this function is used for the player's swiped nucleotide.
     * @param {Nucleotide} nucleotide - nucleotide to fade
     * @param {function} [callback=null] - function to be called after done fading
     */
    _fadeOut(nucleotide, callback=null) {
        let currentAlpha = nucleotide.getObject().alpha;
        let newAlpha = currentAlpha / 1.5;
        if (newAlpha < 0.1) {
            nucleotide.getObject().clearAlpha();
            nucleotide.setVisible(false);
            nucleotide.updateErrorDisplay();
            nucleotide.updateLetterDisplay();
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
                    that._fadeOut(nucleotide, callback);
                },
                loop: false
            });
        }
    }

    /**
     * Increments the nucleotides position by one
     */
    next() {
        // Right now the problem is that I'm trying to find a way to instantly delete the nucleotide once it leaves the binding pocket.
        // I want to remove it instantly so that it makes room for the next nucleotide.

        // Check if the first nucleotide in the line is past the binding pocket, and if so delete it.
        // Only applies to dna_replicaiton levels because codons "correct" is handled differently.
        if (this.level.levelConfig.lvlType == "dna_replication") {
            let ellipse = this.level.ntHighlightEllipse;
            let front = this.getHeadNucleotide();
            let correctAreaOffset = 75; // Number of pixels above bottom right corner of binding pocket.
            if (front && front.getObject().getTopRight().y > ellipse.getBottomRight().y - correctAreaOffset) {
                this.removeHeadNucleotide();
                this.processIncorrectNucleotide(front);
            }
        }



        // Checks the very front of the nucleotides (very end of path)
        // and if we have an object, delete it and handle incorrect
        // match logic.

        // TODO: Seperate out incorrect match logic to its own function.
        let head = this.levelNucleotides[0];
        if (head) {
            this.removeHeadNucleotide();
            this.processIncorrectNucleotide(head);
        }
        // levelNucleotides is a collection of all nucleotides and null objects along the line.
        // It shortens the array each tick by 1.
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
        } else if (this.level.levelConfig.lvlType == "codon_transcription" && !this.hasFrozenHead && this.getHeadNucleotide() && this.getHeadNucleotide().getObject().y > 490) {
            this.hasFrozenHead = true;
            this.tempPauseNTMoveTime(1000);
        }
        
    }

    /**
     * Given the nucleotide the player just missed,
     * will add on to the DNA output the correct nucleotide.
     * @param {Nucleotide} missedNucleotide - Nucleotide player got wrong.
     */
    processIncorrectNucleotide(missedNucleotide) {
        this.level.scorekeeping.incrementIncorrectSequences();
        let cloned = this.getValidMatchNT(missedNucleotide);
        if (this.level.levelConfig.lvlType == "dna_replication") {
            cloned.setDisplay("nucleotide");
        } else if (this.level.levelConfig.lvlType == "codon_transcription") {
            cloned.setDisplay("codon");
        }
        cloned.setPosition(missedNucleotide.getObject().x, missedNucleotide.getObject().y);
        cloned.setVisible(true);
        cloned.setScale(0.18);
        cloned.setAngle(180);
        cloned.setMissing(true);
        this.addToDNAOutput(cloned);
        this.level.shuffleNTBtnAngle();
        if (this.level.levelConfig.lvlType == "codon_transcription") {
            this.level.shuffleNTBtnOpts();
        }
    }

    /**
     * THIS FUNCTION IS CURRENTLY UNUSED.
     * What nucleotide, if any, is currently in the binding pocket?
     * @returns {Nucleotide} First nucleotide currently in the binding pocket.
     */ 
     nucleotideInBindingPocket() {
        for (let i = 0; i < this.levelNucleotides.length; i++) {
            if (this.levelNucleotides[i]) {
                var bbBinding = this.level.ntHighlightEllipse.getBounds();
                var bbNucleotide = this.levelNucleotides[i].getObject().getBounds();
                var inters = Phaser.Geom.Rectangle.Intersection(bbBinding, bbNucleotide);
                if (inters.width > 0 && inters.height > 0) {
                    console.log(this.levelNucleotides[i].getShortName() + " is touching binding pocket.");
                } else {
                    console.log("Nothing touching binding pocket.");
                }
            }
        }
     }

    /**
     * From the given nucleotide, find the matching NT pair that works
     * @param {Nucleotide} nucleotide - Nucleotide to reference from
     * @returns {Nucleotide} matching nucleotide
     */
    getValidMatchNT(nucleotide) {
        let btns = this.level.buttons;
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
     * Doesn't add anything to the DNA output.
     */
    removeHeadNucleotide() {
        for (let i = 0; i < this.levelNucleotides.length; i++) {
            let removed = this.levelNucleotides[i];
            if (removed) {
                this.hasFrozenHead = false;
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

        for (let i = 0; i < this.levelNucleotides.length; i++) {
            if (this.levelNucleotides[i]) {
                return this.levelNucleotides[i];
            }
        }
        return null;
    }

    /**
     * Adds a nucleotide to the output stack
     * @param {Nucleotide} nucleotide - The nucleotide that should be added to the output stack
     */
    addToDNAOutput(nucleotide) {
        this.hasFrozenHead = false;
        nucleotide.setScale(0.3);
        let firstPoint = this.outputVertPathPts[0];
        let secPoint = this.outputVertPathPts[1 * this.pathPointsFactor];
        let point = this.outputVertPathPts[2 * this.pathPointsFactor];
        nucleotide.setPosition(firstPoint.x, firstPoint.y);
        if (nucleotide.errorNT || nucleotide.missingNT) {
            // Shakes screen and flashes red upon a wrong match
            this.level.camera.flash(300, 255, 30, 30);
            this.level.camera.shake(400, 0.02);
        }
        this.updateNTMoveTimer(this.defaultTimerDelay / 2);
        // Matching animation?
        let that = this;
        this._animatePosition(nucleotide, secPoint.x, secPoint.y, function () {
            that._animatePosition(nucleotide, point.x, point.y);
            if (that.level.levelConfig.lvlType == "codon_transcription") {
                nucleotide.removeCodonDisplay("codon");
            }
            that.selectedNucleotides.push(nucleotide);
            for (let i = 0; i < (that.pathPointsFactor * 2); i++) {
                that.selectedNucleotides.push(null);
            }
            that.updateNTMoveTimer(that.defaultTimerDelay);
            that.level.ntBtnsEnabled = true;
            if (!nucleotide.missingNT) {
                that.removeHeadNucleotide();
                if (that.level.levelConfig.lvlType == "codon_transcription") {
                    that.level.shuffleNTBtnOpts();
                }
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

        // Shakes screen and flashes red upon a wrong match
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
        let nucDispObj = null;

        // Loops over all the nucleotide array, which contains 
        // either nucleotide objects or null objects.
        for (let i = 0; i < this.levelNucleotides.length; i++) {
            nucleotide = this.levelNucleotides[i];
            if (nucleotide) {
                nucDispObj = nucleotide.getObject();

                // Codon Levels
                if (this.level.levelConfig.lvlType == "codon_transcription") {
                    let wrapped = nucDispObj;
                    nucDispObj = {
                        getX: function() {
                            return wrapped.x - (wrapped.displayWidth * wrapped.originX);
                        },
                        getY: function() {
                            return wrapped.y - (wrapped.displayHeight * wrapped.originY);
                        },
                        getTopLeft: function () {
                            return new Phaser.Math.Vector2(this.getX(), this.getY());
                        },
                        getBottomRight: function () {
                            return new Phaser.Math.Vector2(this.getX() + wrapped.displayWidth,
                                                           this.getY() + wrapped.displayHeight);
                        },
                        getCenter: function () {
                            return new Phaser.Math.Vector2(this.getX() + wrapped.displayWidth / 2,
                                                           this.getY() + wrapped.displayHeight / 2);
                        },
                        getBounds: function() {
                            return new Phaser.Geom.Rectangle(this.getX(), this.getY(),
                                                             wrapped.displayWidth,
                                                             wrapped.displayHeight);
                        },
                        x: wrapped.x,
                        y: wrapped.y,
                        angle: wrapped.angle,
                    };
                }
                break;
            }
        }

        if (nucDispObj && this.level.levelConfig.lvlType == "dna_replication") {
            // actually make correct bounding boxes for ellipse and nucleotide
            var bbBinding = ellipse.getBounds();
            var bbNucleotide = nucDispObj.getBounds();
            var inters = Phaser.Geom.Rectangle.Intersection(bbBinding, bbNucleotide);
            return inters.width > 0 && inters.height > 0;
        } else if (nucDispObj && this.level.levelConfig.lvlType == "codon_transcription") {
            let offset = 100;
            return (ellipse.getTopLeft().y + offset < nucDispObj.getBottomRight().y &&
                    ellipse.getBottomRight().y > nucDispObj.getTopLeft().y);
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
