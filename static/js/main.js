import Game from "./modules/game.js";

/** @namespace window */

/**
 * Creates the game instance for the end user.
 * Refer to it as {@link window.game}.
 */
(function () {
    "use strict";
    
    WebFont.load({
        google: {
            families: ['Open Sans', 'Knewave', 'Bevan', 'Teko']
        }
    });

    let game = new Game([
        {
            // "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATA"
            "ntSequence": "ATATTTTAAATATATATATA",
            //"ntSequence": "AA",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "AT the Beginning!",
            "description": "You can include whatever description you want here. Maybe even add a picture or some kind of explanation. But it probably shouldn't be a wall of text.",
            "speed": 50,
            "popups": {
                "intro": "Tap on the nucleotides to submit.",
                "firstCorrectMatch": "Good work! <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> binds with <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>!",
                "error5Match": "In DNA <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> can only bind to <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>, both nucleotides help make up DNA!"
            },
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "dna_replication",
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen;'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
        },
        {
            "ntSequence": "ATATTTTAAATATATATATA",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "Back AT it Again...",
            "description": "I'm back at it again to show you that the description can indeed actually change. All this data is stored with the level files so it's very easy to change.",
            "speed": 25,
            "popups": {
                "intro": "Tap on the nucleotides to submit."
            },
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "dna_replication",
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen;'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
        },
                {
            "ntSequence": "ATATTTTAAATATATATATA",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "AT's all Folks!",
            "description": "Hopefully this is something useful, at least education wise for providing a little more context. If not this space can be potentially used for other things like high score, pointing to other resources, etc.",
            "speed": 1,
            "popups": {
                "intro": "Tap on the nucleotides to submit."
            },
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "dna_replication",
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen;'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
        },
        {
            // "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATA"
            "ntSequence": "ATATTTTAAATATATATATA",
            "controls": ["T", "A"],
            "unlocked": false,
            "name": "Testing Locked Levels!",
            "description": "If this text shows up, something isn't working correctly.",
            "speed": 50,
            "popups": {
                "firstCorrectMatch": "Good work! <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> binds with <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>!",
                "error5Match": "In DNA <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> can only bind to <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>, both nucleotides help make up DNA!"
            },
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "dna_replication",
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen;'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
        },        

        {
            "ntSequence": "CCCCCCCCCC",
            "controls": ["G", "C"],
            "unlocked": true,
            "name": "Clash of the Cs and Gs",
            "speed": 20,
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "dna_replication",
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen;'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
        },
        {
            "ntSequence": "TAGTTACTAGGAGAGGTCAT",
            "unlocked": true,
            "name": "Mixing Things Up",
            "speed": 20,
            "popups": {
                "intro": "Tap on the nucleotides to submit."
            },
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "dna_replication",
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen;'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
        },
        {
            "ntSequence": "GTAATCACTAAGTAGTAATA",
            "unlocked": true,
            "name": "Adding a Bit of a Twist",
            "speed": 60,
            "popups": {
                "intro": "Tap on the nucleotides to rotate and drag to submit."
            },
            "rotateNT": true,
            "ntType": "hbonds",
            "lvlType": "dna_replication",
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen;'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
        },
        {
            "ntSequence": "AUGGCAACCAAACCGGGUCAUUGACCCACUGACCAUGGGUUUUAG",
            "unlocked": true,
            "name": "Codon Training",
            "speed": 67,
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "codon_transcription",
            "maxButtons": 1,
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen;'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
        },
        {
            "ntSequence": "AUGGCAACCAAACCGGGUCAUUGACCCACUGACCAUGGGUUUUAG",
            "unlocked": true,
            "name": "Codon Training II",
            "speed": 30,
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "codon_transcription",
            "maxButtons": 1,
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen;'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
        },        
        {
            "ntSequence": "AUGGCAACCAAACCGGGUCAUUGACCCACUGACCAUGGGUUUUAG",
            "unlocked": true,
            "name": "Codon you do this?",
            "speed": 50,
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "codon_transcription",
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen;'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
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
            "ntSequence": "AUG",
            "unlocked": true,
            "name": "It's Debug Time!",
            "speed": 1,
            "popups": {
                // "firstCorrectMatch": "Good work! <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> binds with <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>!",
                // "error5Match": "In DNA <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> can only bind to <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>, both nucleotides help make up DNA!"
            },
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "codon_transcription",
            "quiz": {
                "question": "Three base pairs are called a __________.",
                "options": [
                    "Codon", // first option is correct
                    "Amino Acid",
                    "Peptide",
                    "DNA",
                ],
            },
            "sequencedinfo": {
                "name": "insulin",
                "description": "<strong>Insulin</strong> is a <span style='color: blue;'>gene</span> that codes for a peptide (sequence of <span style='color: red;'>amino acids</span>) that acts as a hormone to regulate metabolism",
                "infourl": "https://www.cdc.gov/diabetes/basics/diabetes.html",
                "imgurl": "./static/img/flashcard/insulin.png",
            },
            "knowledgepanel": {
                "description": "<strong>Promoter sequences</strong> are <span style='color: forestgreen'>DNA</span> sequences that define where transcription of a <span style='color: blue;'>gene starts</span>.",
                "imgurl": "./static/img/flashcard/promoter_dna.png",
            },
        },
    ]);
    window.game = new Phaser.Game(game.config);
})();
