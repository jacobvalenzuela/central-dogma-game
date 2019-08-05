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
        this.nucleotides = [
            new Nucleotide(this.level, this.rep.substr(0, 1), "basic"),
            new Nucleotide(this.level, this.rep.substr(1, 1), "basic"),
            new Nucleotide(this.level, this.rep.substr(2, 1), "basic"),
        ];
        this.matches = this.nucleotides[2].matches[0] + this.nucleotides[1].matches[0] + this.nucleotides[0].matches[0];
        this.display = "codon"; // codon or rectangle (three nucleotides) or circle (ammino acid)
        this.codonDisplay = new Set(["codon", "amminoacid"]); // codon and/or amminoacid
        this.containerObj = null;
        this.containerObjRect = null;
        this.circleObj = null;
        this.ntCodonObj = [];
        this.amminoAcidObj = null;
        this.connectLineObj = null;
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
        this.connectLineObj.setStrokeStyle(1, 0x000);
        this.containerObj.add(this.connectLineObj);
        for (let i = 0; i < this.nucleotides.length; i++) {
            let nt = this.nucleotides[i];
            let cdnt = this.level.add.image(-50, -125, "codontide_" + nt.getShortName());
            let size = nt.getCodonSize();
            cdnt.setSize(size.width, size.height);
            cdnt.setDisplaySize(size.width, size.height);
            cdnt.setPosition(cdnt.x + size.width * i, cdnt.y + size.offsetY);
            this.containerObj.add(cdnt);
            this.ntCodonObj.push(cdnt);
        }
        if (this.amminoAcid.class == "nonpolar") {
            this.amminoAcidObj = this._genCircle(25, 75, this.amminoAcid.color);
        } else if (this.amminoAcid.class == "polar") {
            this.amminoAcidObj = this._genSquare(0, 25, this.amminoAcid.color);
        } else if (this.amminoAcid.class == "acidic") {
            this.amminoAcidObj = this._genDiamond(0, 25, this.amminoAcid.color);
        } else if (this.amminoAcid.class == "basic") {
            this.amminoAcidObj = this._genTriangle(0, 25, this.amminoAcid.color);
        } else if (this.amminoAcid.class == "stop") {
            this.amminoAcidObj = this._genOctagon(50, 75, this.amminoAcid.color);
        }
        this.containerObj.add(this.amminoAcidObj);
        this.containerObj.setAngle(90);

        let rectTop = this.level.add.rectangle(0, -3.333, 10, 3.333, this.nucleotides[0].getColor());
        let rectMid = this.level.add.rectangle(0, 0, 10, 3.333, this.nucleotides[1].getColor());
        let rectBot = this.level.add.rectangle(0, 3.333, 10, 3.333, this.nucleotides[2].getColor());
        this.containerObjRect = this.level.add.container(0, 0, [rectTop, rectMid, rectBot]);
        this.circleObj = this.level.add.circle(0, 0, 5, this.getAmminoColor());

        this.containerObj.setVisible(false);
        this.containerObjRect.setVisible(false);
        this.circleObj.setVisible(false);
    }

    _genCircle(x, y, fillColor) {
        let cir = this.level.add.circle(x, y, 55, fillColor);
        cir.setStrokeStyle(1, 0x000);
        return cir;
    }

    _genSquare(x, y, fillColor) {
        let square = this.level.add.rectangle(x, y, 110, 110, fillColor);
        square.setStrokeStyle(1, 0x000);
        return square;
    }

    _genDiamond(x, y, fillColor) {
        let square = this.level.add.rectangle(x, y, 110, 110, fillColor);
        square.setStrokeStyle(1, 0x000);
        square.setAngle(45);
        return square;
    }

    _genTriangle(x, y, fillColor) {
        let tri = this.level.add.triangle(x, y, 0, 100, 50, 0, 100, 100, fillColor);
        tri.setStrokeStyle(1, 0x000);
        return tri;
    }

    _genOctagon(x, y, fillColor) {
        let oct = this.level.add.polygon(x, y, [[21, -51], [-21, -51], [-51, -21], [-51, 21], [-21, 51], [21, 51], [51, 21], [51, -21]], fillColor);
        oct.setStrokeStyle(1, 0x000);
        return oct;
    }

    getAmminoColor() {
        return this.amminoAcid.color;
    }

    setDepth(depth) {

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

    updateErrorDisplay() {

    }

    updateMissingDisplay() {

    }

    showLetter(shouldShow) {

    }

    setVisible(visible) {
        this.getObject().setVisible(visible);
    }

    setPosition(x, y) {
        this.getObject().setPosition(x, y);
    }

    setScale(scale) {
        this.getObject().setScale(scale);
    }

    getAngle() {
        return 0;
    }

    setAngle(angle) {

    }

    setError(errorBool) {

    }

    setMissing(missingBool) {

    }

    getAmminoShortName() {
        return this.amminoAcid.name;
    }

    validMatchWith(other) {
        if (!other) {
            return false;
        }
        for (let i = 0; i < 3; i++) {
            let nt1 = this.nucleotides[i];
            let nt2 = other.nucleotides[i];
            if (!nt1.validMatchWith(nt2)) {
                return false;
            }
        }
        return true;
    }

    clone(level=this.level) {
        return new Codon(level, this.rep);
    }
}

export default Codon;
