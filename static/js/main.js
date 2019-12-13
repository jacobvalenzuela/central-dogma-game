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

    // speeds:
    // 50 - takes about 5.28 seconds for 3 nucleotides
    // 33 - takes about 3.66 seconds for 3 nucleotides
    // 1 - takes about 1.95 seconds for 3 nucleotides

    let game = new Game([
        {
            // "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATA"
            "ntSequence": "ATATTTTAAATATAT",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "AT the Beginning",
            "description": "DNA Replication",
            "process": "dna replication",
            "speed": 33,
            "popups": {
                "intro": "Tap a <style='color: #ce00ce;'>nucleotide</style> to match the correct <style='color: #ce00ce;'>base pair</style>.",
                "firstCorrectMatch": "In DNA, <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> can only bind to <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>!",
                "error5Match": "Whoops! In DNA, <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> cannot bind to <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style>."
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
            "ntSequence": "CGGCGCCGCGGCCGC",
            "controls": ["G", "C"],
            "unlocked": true,
            "name": "Clash of the Cs and Gs",
            "description": "DNA Replication",
            "process": "dna replication",
            "speed": 33,
            "popups": {
                "intro": "In DNA, <style='color: #F5B222;'>Guanine</style> only binds with <style='color: #103B75;'>Cytosine</style>!",
                "error5Match": "Whoops! In DNA, <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> cannot bind to <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style>."
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
            "ntSequence": "TAGTCACTAGGAGCA",
            "unlocked": true,
            "name": "Mixing Things Up",
            "description": "DNA Replication",
            "process": "dna replication",
            "speed": 33,
            "popups": {
                "intro": "DNA is made of A's, T's, G's, and C's.",
                "error5Match": "Adenine [A] only binds with Thymine [T] and Guanine [G] only binds with Cytosine [C]!"
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
            "ntSequence": "ATAGATCTCGTACGATCGAT",
            "unlocked": true,
            "name": "All Together Now",
            "description": "DNA Replication",
            "process": "dna replication",
            "speed": 1,
            "popups": {
                "intro": "Picking up the pace! Make base pairs the A's and T's or with G's and C's."
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
            "ntSequence": "GCAGUCUGAUGC",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Introducing Uracil",
            "description": "Transcription",
            "process": "transcription",
            "speed": 50,
            "popups": {
                "intro": "Rotate nucleotides by tapping to make the proper bonds and slide them to base pair!",
                "firstCorrectMatch": "DNA codes for genes that get transcribed into messenger RNA.",
                "error5Match": "In RNA, there is no longer Thymine [T], instead Adenine [A] binds with Uracil [U]."
            },
            "rotateNT": true,
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
            "ntSequence": "GCUGGCAGCUGUCAA",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Transcriptor",
            "description": "Transcription",
            "process": "transcription",
            "speed": 33,
            "popups": {
                "intro": "RNA contains the blueprint for the gene to be translated into proteins, which carry out most of the functions in cells",
                "error5Match": "Accuracy is important, do your best to limit mutations!"
            },
            "rotateNT": true,
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
            "ntSequence": "AUGCCGGGUCAUGGGCCCACUGACCAUGGGUUUUAG",
            "unlocked": true,
            "name": "Codon Training",
            "description": "Translation",
            "process": "translation",
            "speed": 50,
            "popups": {
                "intro": "Each protein molecule is made up of a long chain of different types amino acids.",
                "firstCorrectMatch": "Proteins can be hormones, enzymes, or structures!"
            },
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
            "ntSequence": "",
            "ntSequence": "AUGUUUGACCAUGGGUUUGACCCAGACACUCCGGGUGACCAUUAG",
            "unlocked": true,
            "name": "Lost In Translation",
            "description": "Translation",
            "process": "translation",
            "speed": 33,
            "popups": {
                "intro": "Accuracy is important, do your best to limit mutations!",
                "error5Match": "Careful! Mutations in protein can result in genetic variations."
            },
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
        }
    ]);
    window.game = new Phaser.Game(game.config);
})();
