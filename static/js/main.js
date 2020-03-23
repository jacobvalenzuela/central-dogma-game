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
    let SPEED_SLOW = 42;
    let SPEED_MEDIUM = 33;
    let SPEED_FAST = 1;

    // color codes
    let COLOR_TERM = "#ce00ce";


    // Notes about game attributes:
    // process - different from the "lvlType". Level type dictates how the level is 
    // played, but process describes what is being shown. Necessary in order to correctly 
    // color code lines in positionmanager.js

    let game = new Game([
        {
            "ntSequence": "ATATTTTAAATATAT",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "AT the Beginning",
            "description": "Introduction to the basics of DNA replication with two purine nucleobases, Adenine and Guanine.",
            "process": "dna replication",
            "speed": SPEED_SLOW,
            "popups": {
                "intro": "Tap a <style='color:" + COLOR_TERM + "'>nucleotide</style> to match the correct <style='color:" + COLOR_TERM + "'>base pair</style>.",
                "firstCorrectMatch": "Correct! In <style='color:" + COLOR_TERM + "'>DNA</style>, nucleotide 'A' or <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> only pairs with nucleotide 'T' or <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>.",
                "error5Match": "Whoops! In <style='color:" + COLOR_TERM + "'>DNA</style>, nucleotide 'A' or <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> only pairs with nucleotide 'T' or <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>."
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
            "ntSequence": "ATATTTTAAATATAT",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "Picking Up The Pace!",
            "description": "We're going to challenge you, try to keep up by matching Adenine and Guanine!",
            "process": "dna replication",
            "speed": SPEED_MEDIUM,
            "popups": {
                "intro": "The cell needs more DNA, we're picking up the pace with your nucleotide pairing."
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
            "description": "Introduction to the basics of DNA replication with two pyrimidine nucleobases, Cytosine and Guanine.",
            "process": "dna replication",
            "speed": SPEED_SLOW,
            "popups": {
                "intro": "DNA is more than just A's and T's.",
                "firstCorrectMatch": "Correct! In <style='color:" + COLOR_TERM + "'>DNA</style>, nucleotide 'C' or <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> only pairs with nucleotide 'G' or <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>.",
                "error5Match": "Whoops! In <style='color:" + COLOR_TERM + "'>DNA</style>, nucleotide 'C' or <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> only pairs with nucleotide 'G' or <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>."
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
            "name": "We need more!",
            "description": "We're going to challenge you, try to keep up by matching Cytosine and Thymine!",
            "process": "dna replication",
            "speed": SPEED_MEDIUM,
            "popups": {
                "intro": "The cell needs more DNA, we're picking up the pace with your nucleotide pairing."
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
            "ntSequence": "ATATTTTAAATATAT",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "(AT)tack of Purine",
            "description": "We're going to challenge you, try to keep up by matching Adenine and Guanine!",
            "process": "dna replication",
            "speed": SPEED_FAST,
            "popups": {
                "intro": "<style='color:" + COLOR_TERM + "'>DNA replication</style> is fast, but it also needs to be <style='color:" + COLOR_TERM + "'>accurate</style>."
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
            "name": "Rated CG",
            "description": "We're going to challenge you, try to keep up by matching Cytosine and Thymine!",
            "process": "dna replication",
            "speed": SPEED_FAST,
            "popups": {
                "intro": "How's that accuracy? Try to prevent mutations from happening."
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
            "speed": SPEED_SLOW,
            "popups": {
                "intro": "Putting it all together, DNA only has 4 nucleotides (A, T, G, C)."
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
            "name": "All Together Now!",
            "description": "We're going to challenge you, try to keep up by matching all 4 nucleotides!",
            "process": "dna replication",
            "speed": SPEED_MEDIUM,
            "popups": {
                "intro": "We're picking up the pace - but remember accuracy is important!"
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
            "name": "The Replicator",
            "description": "We're going to challenge you, try to keep up by matching all 4 nucleotides!",
            "process": "dna replication",
            "speed": SPEED_FAST,
            "popups": {
                "intro": "Lets see how accurately you can <style='color:" + COLOR_TERM + "'>copy</style> the DNA of an entire <style='color:" + COLOR_TERM + "'>gene</style>!"
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
            "ntSequence": "UGCAGUCUGAUGC",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Introducing Uracil",
            "description": "Transcription",
            "process": "transcription",
            "speed": SPEED_SLOW,
            "popups": {
                "intro": "Great job making all that DNA! Now its time to make <style='color:" + COLOR_TERM + "'>RNA</style>, see if you notice the difference.",
                "firstCorrectMatch": "Correct! In RNA, nucleotide 'A' only pairs with nucleotide 'U'.",
                "error5Match": "Whoops! In RNA, nucleotide 'A' only pairs with nucleotide 'U'."
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
            "ntSequence": "UGCAGUCUGAUGC",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Ribonucleic Acid",
            "description": "Transcription",
            "process": "transcription",
            "speed": SPEED_MEDIUM,
            "popups": {
                "intro": "The process of making RNA from DNA is called <style='color:" + COLOR_TERM + "'>transcription</style>."
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
            "ntSequence": "UGCAGUCUGAUGC",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Transcriptor",
            "description": "Transcription",
            "process": "transcription",
            "speed": SPEED_FAST,
            "popups": {
                "intro": "We're picking up the pace. Accuracy in transcription is important, but not as much as with DNA replication."
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
            "ntSequence": "GCUGGCAGCUGUCAA",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Adding A Mixup",
            "description": "Transcription",
            "process": "transcription",
            "speed": SPEED_SLOW,
            "popups": {
                "intro": "Tap nucleotides to rotate and make a proper double or triple bond."
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
            "name": "Running In Circles",
            "description": "Transcription",
            "process": "transcription",
            "speed": SPEED_MEDIUM,
            "popups": {
                "intro": "The transcription happening in your cells right now is making about 1 error for every 10,000 pairs it makes. How are you doing?"
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
            "name": "High Speed Spinner",
            "description": "Transcription",
            "process": "transcription",
            "speed": SPEED_FAST,
            "popups": {
                "intro": "Only the best can complete this level with 100% accuracy!"
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
            "speed": SPEED_SLOW,
            "popups": {
                "intro": "Now that you know how to make DNA and RNA, lets make <style='color:" + COLOR_TERM + "'>protein</style>.",
                "firstCorrectMatch": "Correct! Nucleotide pairing rules still apply.",
                "error5Match": "Whoops! Nucleotide pairing rules still apply."
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
            "ntSequence": "AUGCCGGGUCAUGGGCCCACUGACCAUGGGUUUUAG",
            "unlocked": true,
            "name": "Codon Training",
            "description": "Translation",
            "process": "translation",
            "speed": SPEED_MEDIUM,
            "popups": {
                "intro": "The process of making a protein molecule from RNA is called <style='color:" + COLOR_TERM + "'>translation</style>."
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
            "speed": SPEED_FAST,
            "popups": {
                "intro": "We're picking up the pace. Accuracy in translation is important, but not as much as with DNA replication."
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
            "name": "Lost In Translation II",
            "description": "Translation",
            "process": "translation",
            "speed": SPEED_FAST,
            "popups": {
                "intro": "The translation happening in your cells right now is making less than 1 error for every 10,000 pairs it makes. How are you doing?"
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
