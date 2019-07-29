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

export default Nucleotide;
