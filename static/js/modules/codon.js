import Nucleotide from "./nucleotide.js";

/**
 * Class representing a single codon triplet.
 */
class Codon {
    /**
     * 
     * @param {LevelStage} level - The level stage that the codon belongs to
     * @param {String} rep - The three RNA nucleotides rep that makes up the codon. Can be something like UCG
     */
    constructor(level, rep) {
        if (rep.length != 3) {
            console.error("Codon rep length is not 3.");
        }

        this.allAmminoAcids = {
            "phe": {
                "name": "phenylalanine",
                "color": 0x0055ff,
                "class": "nonpolar",
            },
            "leu": {
                "name": "leucine",
                "color": 0xff5e00,
                "class": "nonpolar",
            },
            "ile": {
                "name": "isoleucine",
                "color": 0x0026ff,
                "class": "nonpolar",
            },
            "met": {
                "name": "methionine",
                "color": 0x5FBB4E,
                "type": "start",
                "class": "nonpolar",
            },
            "val": {
                "name": "valine",
                "color": 0xff8c00,
                "class": "nonpolar",
            },
            "ser": {
                "name": "serine",
                "color": 0x632E86,
                "class": "polar",
            },
            "pro": {
                "name": "proline",
                "color": 0x9500ff,
                "class": "nonpolar",
            },
            "thr": {
                "name": "threonine",
                "color": 0xffbb00,
                "class": "polar",
            },
            "ala": {
                "name": "alanine",
                "color": 0xf200ff,
                "class": "nonpolar",
            },
            "tyr": {
                "name": "tyrosine",
                "color": 0xffea00,
                "class": "polar",
            },
            "stop": {
                "name": "STOP codon",
                "color": 0xEC4141,
                "type": "stop",
                "class": "stop",
            },
            "his": {
                "name": "histidine",
                "color": 0xff00dd,
                "class": "basic",
            },
            "gin": {
                "name": "glutamine",
                "color": 0xe5ff00,
                "class": "polar",
            },
            "asn": {
                "name": "asparagine",
                "color": 0xff00ae,
                "class": "polar",
            },
            "lys": {
                "name": "lysine",
                "color": 0xb7ff00,
                "class": "basic",
            },
            "asp": {
                "name": "aspartic acid",
                "color": 0x00ff91,
                "class": "eletric",
            },
            "glu": {
                "name": "glutamic acid",
                "color": 0x59ff00,
                "class": "acidic",
            },
            "cys": {
                "name": "cysteine",
                "color": 0x00ffbf,
                "class": "polar",
            },
            "trp": {
                "name": "tryptonphan",
                "color": 0x00ff62,
                "class": "nonpolar",
            },
            "arg": {
                "name": "arginine",
                "color": 0x00ffee,
                "class": "basic",
            },
            "gly": {
                "name": "glycine",
                "color": 0x00e1ff,
                "class": "nonpolar",
            },
        };

        this.allCodons = {
            "AAA":"phe",
            "AAG":"phe",
            "AAU":"leu",
            "AAC":"leu",
            "GAA":"leu",
            "GAG":"leu",
            "GAU":"leu",
            "GAC":"leu",
            "UAA":"ile",
            "UAG":"ile",
            "UAU":"ile",
            "UAC":"met",
            "CAA":"val",
            "CAG":"val",
            "CAU":"val",
            "CAC":"val",
            "AGA":"ser",
            "AGG":"ser",
            "AGU":"ser",
            "AGC":"ser",
            "GGA":"pro",
            "GGG":"pro",
            "GGU":"pro",
            "GGC":"pro",
            "UGA":"thr",
            "UGG":"thr",
            "UGU":"thr",
            "UGC":"thr",
            "CGA":"ala",
            "CGG":"ala",
            "CGU":"ala",
            "CGC":"ala",
            "AUA":"tyr",
            "AUG":"tyr",
            "AUU":"stop",
            "AUC":"stop",
            "GUA":"his",
            "GUG":"his",
            "GUU":"gin",
            "GUC":"gin",
            "UUA":"asn",
            "UUG":"asn",
            "UUU":"lys",
            "UUC":"lys",
            "CUA":"asp",
            "CUG":"asp",
            "CUU":"glu",
            "CUC":"glu",
            "ACA":"cys",
            "ACG":"cys",
            "ACU":"stop",
            "ACC":"trp",
            "GCA":"arg",
            "GCG":"arg",
            "GCU":"arg",
            "GCC":"arg",
            "UCA":"ser",
            "UCG":"ser",
            "UCU":"arg",
            "UCC":"arg",
            "CCA":"gly",
            "CCG":"gly",
            "CCU":"gly",
            "CCC":"gly"
        };

        this.level = level;
        this.rep = rep;
        this.amminoAcid = this.allAmminoAcids[this.allCodons[this.rep]];
        this.amminoAcidAbbr = this.allCodons[this.rep].toUpperCase();
        this.nucleotides = [
            new Nucleotide(this.level, this.rep.substr(0, 1), "basic"),
            new Nucleotide(this.level, this.rep.substr(1, 1), "basic"),
            new Nucleotide(this.level, this.rep.substr(2, 1), "basic"),
        ];
        this.matches = this.nucleotides[2].matches[0] + this.nucleotides[1].matches[0] + this.nucleotides[0].matches[0];
        this.matches = this.matches.replace(/T/g, "U");
        this.display = "codon"; // codon or rectangle (three nucleotides) or circle (ammino acid)
        this.codonDisplay = new Set(["codon", "amminoacid"]); // codon and/or amminoacid
        this.containerObj = null;
        this.containerObjRect = null;
        this.circleObj = null;
        this.ntCodonObj = [];
        this.amminoAcidObj = null;
        this.connectLineObj = null;

        this.missingNT = false;
        this.errorNT = false;
        this.dispLetter = false;

        this.amminoAcidAbbrText = null;
        this.ntLetterText = [];

        this.amminoAcidErrorObj = null;
        this.circleErrorObj = null;
        this.amminoAcidMissObj = null;
        this.circleMissObj = null;
    }

    getObject() {
        if (!this.containerObj) {
            this._genObjects();
        }
        if (this.display == "codon") {
            return this.containerObj;
        } else if (this.display == "rectangle") {
            return this.containerObjRect;
        } else {
            return this.circleObj;
        }
    }

    _genObjects() {
        this.containerObj = this.level.add.container();
        this.connectLineObj = this.level.add.line(0, 0, 0, -50, 0, 50);
        this.connectLineObj.setStrokeStyle(3, 0xFFFFFF);
        this.containerObj.add(this.connectLineObj);
        let width = 0;
        let height = 0;
        for (let i = 0; i < this.nucleotides.length; i++) {
            let nt = this.nucleotides[i]; // Current nucleotide
            let cdnt; // Current codon
            let ntShortName = nt.getShortName();
            
            // Setting up correct animation
            cdnt = this.level.add.sprite(0, 0, "nt_" + ntShortName + "_basic_animated");
            this.level.anims.create({
                key: "idle_" + ntShortName,
                frames: this.level.anims.generateFrameNumbers("nt_" + ntShortName + "_basic_animated", { start: 0, end: 3}),
                frameRate: 30,
                repeat: -1
            });
            cdnt.anims.play("idle_" + ntShortName);

            
            let size = nt.getCodonSize();
            cdnt.setSize(size.width, size.height);

            // Multiplying it by 2 because for some reason they were reduced in width to being with.
            // Couldn't find where it was originally being set.
            cdnt.setDisplaySize(size.width * 2, size.height);

            // How far away from main input line to space codons.
            // Magic, meaningless numbers to just align the graphics.
            // (distance to space vertically, distance to space horizontally)
            cdnt.setPosition(cdnt.x - 55 + (size.width + 5) * i, cdnt.y - 90 + size.offsetY * 5); 

            // Makes the codons actually face each other.
            cdnt.setAngle(270);

            this.containerObj.add(cdnt);
            this.ntCodonObj.push(cdnt);
            
            // What is this doing? Game breaks if I remove it :/
            width += size.width;
            if (height == 0) {
                height += size.height;
            }
            
        }
        
        // Creating appropriate amino acid
        if (this.amminoAcid.class == "nonpolar") {
            this.amminoAcidErrorObj = this._genCircle(30, 60, 0xfc0e33);
            this.amminoAcidObj = this._genCircle(25, 50, this.amminoAcid.color);
            this.amminoAcidMissObj = this._genCircle(18, 40, 0xffffff);
        } else if (this.amminoAcid.class == "polar") {
            this.amminoAcidErrorObj = this._genSquare(0, 25, 0xfc0e33);
            this.amminoAcidObj = this._genSquare(0, 25, this.amminoAcid.color);
            this.amminoAcidMissObj = this._genSquare(0, 25, 0xffffff);
        } else if (this.amminoAcid.class == "acidic") {
            this.amminoAcidErrorObj = this._genDiamond(0, 25, 0xfc0e33);
            this.amminoAcidObj = this._genDiamond(0, 25, this.amminoAcid.color);
            this.amminoAcidMissObj = this._genDiamond(0, 25, 0xffffff);
        } else if (this.amminoAcid.class == "basic") {
            this.amminoAcidErrorObj = this._genTriangle(0, 25, 0xfc0e33);
            this.amminoAcidObj = this._genTriangle(0, 25, this.amminoAcid.color);
            this.amminoAcidMissObj = this._genTriangle(0, 25, 0xffffff);
        } else /*if (this.amminoAcid.class == "stop")*/ {
            this.amminoAcidErrorObj = this._genOctagon(60, 85, 0xfc0e33);
            this.amminoAcidObj = this._genOctagon(50, 75, this.amminoAcid.color);
            this.amminoAcidMissObj = this._genOctagon(34, 60, 0xffffff);
        }
        this.amminoAcidErrorObj.setScale(1.3);
        this.amminoAcidMissObj.setScale(0.7);
        this.containerObj.add(this.amminoAcidErrorObj);
        this.containerObj.add(this.amminoAcidObj);
        this.containerObj.add(this.amminoAcidMissObj);
        this.containerObj.setAngle(90);
        this.containerObj.setSize(width, height + this.connectLineObj.height + this.amminoAcidObj.height);

        let rectTop = this.level.add.rectangle(0, -3.333, 10, 3.333, this.nucleotides[0].getColor());
        let rectMid = this.level.add.rectangle(0, 0, 10, 3.333, this.nucleotides[1].getColor());
        let rectBot = this.level.add.rectangle(0, 3.333, 10, 3.333, this.nucleotides[2].getColor());
        this.containerObjRect = this.level.add.container(0, 0, [rectTop, rectMid, rectBot]);
        this.circleErrorObj = this.level.add.circle(0, 0, 6, 0xfc0e33);
        this.circleObj = this.level.add.circle(0, 0, 5, this.getAmminoColor());
        this.circleMissObj = this.level.add.circle(0, 0, 3, 0xffffff);

        this.containerObjRect.setSize(
            rectTop.width + rectMid.width + rectBot.width,
            rectTop.height + rectMid.height + rectBot.height
        );

        this.containerObj.setData("nucleotide", this);
        this.containerObjRect.setData("nucleotide", this);
        this.circleObj.setData("nucleotide", this);
        this.amminoAcidObj.setData("nucleotide", this);
        this.connectLineObj.setData("nucleotide", this);

        this.containerObj.setVisible(false);
        this.containerObjRect.setVisible(false);
        this.circleObj.setVisible(false);

        this.amminoAcidErrorObj.setVisible(false);
        this.circleErrorObj.setVisible(false);
        this.amminoAcidMissObj.setVisible(false);
        this.circleMissObj.setVisible(false);

        // Conditional rendering to make the text appear in the right spot on specific shapes
        if (this.amminoAcid.class == "basic") {
            this.amminoAcidAbbrText = this.level.add.text(0, 0, this.amminoAcidAbbr, 
                {fontFamily: 'Teko, sans-serif', fontSize: '24pt', color: '#FFFFFF'}).setOrigin(0.10, 0.5);
        } else if (this.amminoAcid.class == "stop") {
            this.amminoAcidAbbrText = this.level.add.text(0, 0, this.amminoAcidAbbr, 
                {fontFamily: 'Teko, sans-serif', fontSize: '24pt', color: '#FFFFFF'}).setOrigin(0.40, 0.5);
        } else {
            this.amminoAcidAbbrText = this.level.add.text(0, 0, this.amminoAcidAbbr, 
                {fontFamily: 'Teko, sans-serif', fontSize: '24pt', color: '#FFFFFF'}).setOrigin(0.5);
        }

        //this.amminoAcidAbbrText.setVisible(false);
        //this.amminoAcidAbbrText.setStroke(0x000, 1);

        for (let i = 0; i < this.nucleotides.length; i++) {
            let txt = this.nucleotides[i].rep;
            let nttxt = this.level.add.text(0, 0, txt, 
                {fontFamily: 'Teko, sans-serif', fontSize: '14pt', color: '#FFFFFF'}).setOrigin(0.5);
            nttxt.setVisible(false);
            // nttxt.setStroke(0x000, 3);
            this.ntLetterText.push(nttxt);
        }
        this.setDepth(1);
    }

    _genCircle(x, y, fillColor) {
        let cir = this.level.add.circle(x, y, 55, fillColor);
        let glow = this.level.add.circle(x, y, 60, 0xFFFFFF);
        cir.setStrokeStyle(3, 0xFFFFFF);
        return cir;
    }

    _genSquare(x, y, fillColor) {
        let square = this.level.add.rectangle(x, y, 110, 110, fillColor);
        square.setStrokeStyle(3, 0xFFFFFF);
        return square;
    }

    _genDiamond(x, y, fillColor) {
        let square = this.level.add.rectangle(x, y, 110, 110, fillColor);
        square.setStrokeStyle(3, 0xFFFFFF);
        square.setAngle(45);
        return square;
    }

    _genTriangle(x, y, fillColor) {
        let tri = this.level.add.triangle(x, y, 0, 100, 50, 0, 100, 100, fillColor);
        tri.setStrokeStyle(3, 0xFFFFFF);
        return tri;
    }

    _genOctagon(x, y, fillColor) {
        let oct = this.level.add.polygon(x, y, [[21, -51], [-21, -51], [-51, -21], [-51, 21], [-21, 51], [21, 51], [51, 21], [51, -21]], fillColor);
        oct.setStrokeStyle(3, 0xFFFFFF);
        return oct;
    }

    getAmminoColor() {
        return this.amminoAcid.color;
    }

    setDepth(depth) {
        if (!this.containerObj) {
            this.getObject();
        }
        for (let i = 0; i < this.ntLetterText.length; i++) {
            this.ntLetterText[i].setDepth(depth + 2);
        }
        this.amminoAcidAbbrText.setDepth(depth + 2);

        this.amminoAcidMissObj.setDepth(depth + 1);
        this.circleMissObj.setDepth(depth + 1);
        
        this.containerObj.setDepth(depth);
        this.containerObjRect.setDepth(depth);
        this.circleObj.setDepth(depth);
        this.amminoAcidObj.setDepth(depth);
        
        this.connectLineObj.setDepth(depth - 1);
        
        this.amminoAcidErrorObj.setDepth(depth - 2);
        this.circleErrorObj.setDepth(depth - 2);
        
    }

    setDisplay(type) {
        if (["codon", "rectangle", "circle"].indexOf(type) < 0) {
            throw new Error("Invalid display type! " + type);
        }
        if (this.containerObj === null) {
            this.getObject();
        }
        if (this.display == type) {
            return this.getObject();
        }
        let prevType = this.display;
        this.display = type;
        let prevObj = null;
        if (prevType == "codon") {
            prevObj = this.containerObj;
        } else if (prevType == "rectangle") {
            prevObj = this.containerObjRect;
        } else if (prevType == "circle") {
            prevObj = this.circleObj;
        }
        let visible = prevObj.visible;
        let x = prevObj.x;
        let y = prevObj.y;
        if (type == "codon") {
            this.containerObj.setVisible(visible);
            this.containerObj.setPosition(x, y);
            this.containerObjRect.setVisible(false);
            this.circleObj.setVisible(false);
        } else if (type == "rectangle") {
            this.containerObjRect.setVisible(visible);
            this.containerObjRect.setPosition(x, y);
            this.containerObj.setVisible(false);
            this.circleObj.setVisible(false);
        } else if (type == "circle") {
            this.circleObj.setVisible(visible);
            this.circleObj.setPosition(x, y);
            this.containerObj.setVisible(false);
            this.containerObjRect.setVisible(false);
        }
    }

    addCodonDisplay(type) {
        if (["codon", "amminoacid"].indexOf(type) < 0) {
            throw new Error("Invalid codon display type! " + type);
        }
        this.codonDisplay.add(type);
        this.updateCodonDisplay();
    }

    removeCodonDisplay(type) {
        if (["codon", "amminoacid"].indexOf(type) < 0) {
            throw new Error("Invalid codon display type! " + type);
        }
        this.codonDisplay.delete(type);
        this.updateCodonDisplay();
    }

    updateCodonDisplay() {
        if (this.codonDisplay.has("codon")) {
            for (let i = 0; i < this.ntCodonObj.length; i++) {
                this.ntCodonObj[i].setVisible(true);
            }
        } else {
            for (let i = 0; i < this.ntCodonObj.length; i++) {
                this.ntCodonObj[i].setVisible(false);
            }
        }
        if (this.codonDisplay.has("amminoacid")) {
            this.amminoAcidObj.setVisible(true);
        } else {
            this.amminoAcidObj.setVisible(false);
        }

        if (this.codonDisplay.has("codon") && this.codonDisplay.has("amminoacid")) {
            this.connectLineObj.setVisible(true);
        } else {
            this.connectLineObj.setVisible(false);
        }
        this.updateLetterDisplay();
        this.updateErrorDisplay();
    }

    updateErrorDisplay() {
        if (!this.errorNT) {
            this.amminoAcidErrorObj.setVisible(false);
            this.circleErrorObj.setVisible(false);
            return;
        }
        if (this.display == "circle") {
            this.circleErrorObj.setVisible(this.circleObj.visible);
            this.circleErrorObj.setPosition(this.circleObj.x, this.circleObj.y);
            this.amminoAcidErrorObj.setVisible(false);
            this.circleErrorObj.setScale(this.circleObj.scale);
        } else if (this.display == "codon") {
            this.amminoAcidErrorObj.setVisible(true);
            this.circleErrorObj.setVisible(false);
        }
        
    }

    updateMissingDisplay() {
        if (!this.amminoAcidMissObj || !this.circleMissObj) {
            return;
        }
        if (!this.missingNT) {
            this.amminoAcidMissObj.setVisible(false);
            this.circleMissObj.setVisible(false);
            return;
        }
        if (this.display == "circle") {
            this.circleMissObj.setVisible(this.circleObj.visible);
            this.circleMissObj.setPosition(this.circleObj.x - 1, this.circleObj.y - 1);
            this.amminoAcidMissObj.setVisible(false);
            this.circleMissObj.setScale(this.circleObj.scale);
        } else if (this.display == "codon") {
            this.amminoAcidMissObj.setVisible(true);
            this.circleMissObj.setVisible(false);
        }
    }

    calculateRotatedPosition(offsetX, offsetY) {
        let x = this.getObject().x;
        let y = this.getObject().y;
        let p = x;
        let q = y;
        x = x + offsetX;
        y = y + offsetY;
        let th = this.getObject().angle;
        th = th * Math.PI / 180;
        let xp = (x - p) * Math.cos(th) - (y - q) * Math.sin(th) + p;
        let yp = (x - p) * Math.sin(th) + (y - q) * Math.cos(th) + q;
        x = xp;
        y = yp;
        return new Phaser.Math.Vector2(x, y);
    }

    updateLetterDisplay() {
        if (this.dispLetter && this.display == "codon" && this.getObject().visible && this.getObject().alpha > 0.1) {
            if (this.codonDisplay.has("amminoacid")) {
                this.amminoAcidAbbrText.setVisible(true);
                let amminoAcidAbbrTextPos = this.calculateRotatedPosition(0, 12);
                this.amminoAcidAbbrText.setPosition(amminoAcidAbbrTextPos.x, amminoAcidAbbrTextPos.y);
            } else {
                this.amminoAcidAbbrText.setVisible(false);
            }
            if (this.codonDisplay.has("codon")) {
                for (let i = 0; i < this.ntLetterText.length; i++) {
                    this.ntLetterText[i].setVisible(true);
                    this.ntLetterText[i].setScale(this.containerObj.scale * 2);
                    let xoffset = 0 + 54 * this.containerObj.scale;
                    let yoffset = 0 + 90 * this.containerObj.scale;
                    let pos = this.calculateRotatedPosition(-1 * xoffset + i * xoffset, -1 * yoffset);
                    this.ntLetterText[i].setPosition(pos.x, pos.y);
                }
            } else {
                for (let i = 0; i < this.ntLetterText.length; i++) {
                    this.ntLetterText[i].setVisible(false);
                }
            }
        } else {
            this.amminoAcidAbbrText.setVisible(false);
            for (let i = 0; i < this.ntLetterText.length; i++) {
                this.ntLetterText[i].setVisible(false);
            }
        }
    }

    showLetter(shouldShow) {
        this.dispLetter = shouldShow;
        this.updateLetterDisplay();
    }

    setVisible(visible) {
        this.getObject().setVisible(visible);
        this.updateLetterDisplay();
        this.updateErrorDisplay();
        this.updateMissingDisplay();
    }

    setPosition(x, y) {
        this.getObject().setPosition(x, y);
        this.updateLetterDisplay();
        this.updateErrorDisplay();
        this.updateMissingDisplay();
    }

    setScale(scale) {
        this.getObject().setScale(scale);
        this.updateErrorDisplay();
        this.updateMissingDisplay();
        this.updateLetterDisplay();
    }

    getAngle() {
        return this.getObject().angle - 90;
    }

    setAngle(angle) {
        this.getObject().setAngle(angle + 90);
    }

    setError(errorBool) {
        this.errorNT = errorBool;
        this.updateErrorDisplay();
    }

    setMissing(missingBool) {
        this.missingNT = missingBool;
        this.updateMissingDisplay();
    }

    getAmminoShortName() {
        return this.amminoAcid.name;
    }

    validMatchWith(other) {
        if (!other || this.constructor !== other.constructor) {
            return false;
        }
        let othernucleotides = other.nucleotides.slice().reverse();
        for (let i = 0; i < 3; i++) {
            let nt1 = this.nucleotides[i];
            let nt2 = othernucleotides[i];
            if (!nt1.validMatchWith(nt2)) {
                return false;
            }
        }
        return true;
    }

    clone(level=this.level) {
        return new Codon(level, this.rep);
    }

    destroy() {
        this.containerObj.destroy();
        this.containerObjRect.destroy();
        this.circleObj.destroy();
        this.amminoAcidObj.destroy();
        this.connectLineObj.destroy;
        for (let i = 0; i < this.ntCodonObj.length; i++) {
            this.ntCodonObj[i].destroy();
        }
        for (let i = 0; i < this.ntLetterText.length; i++) {
            this.ntLetterText[i].destroy();
        }
        this.amminoAcidAbbrText.destroy();
    }

    toJSON() {
        return {
            "name": this.amminoAcid.name,
            "color": "#" + this.amminoAcid.color.toString(16),
        }
    }
}

export default Codon;
