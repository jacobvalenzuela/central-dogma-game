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
    let COLOR_A = "#F56C26";
    let COLOR_T = "#22F2DD";
    let COLOR_C = "#103B75";
    let COLOR_G = "#F5B222";
    let COLOR_U = "#aa24ff";


    // Notes about game attributes:
    // process - different from the "lvlType". Level type dictates how the level is 
    // played, but process describes what is being shown. Necessary in order to correctly 
    // color code lines in positionmanager.js

    let game = new Game([
        // LEVEL 1
        {
            "ntSequence": "ATATTTTAAATATAT",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "A/T the Beginning",
            "description": "The basics of DNA, [color=" + COLOR_A + "]A[/color] matches with [color=" + COLOR_T + "]T[/color].",
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

        //LEVEL 2
        {
            "ntSequence": "ATATTTTAAATATAT",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "Picking Up The Pace!",
            "description": "Can you keep up! [color=" + COLOR_A + "]A[/color] matches with [color=" + COLOR_T + "]T[/color]!",
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
        
        // Level 3
        {
            "ntSequence": "CGGCGCCGCGGCCGC",
            "controls": ["G", "C"],
            "unlocked": true,
            "name": "Clash of the Cs & Gs",
            "description": "The basics of DNA, [color=" + COLOR_C + "]C[/color] matches with [color=" + COLOR_G + "]G[/color].",
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

        // Level 4
        {
            "ntSequence": "CGGCGCCGCGGCCGC",
            "controls": ["G", "C"],
            "unlocked": true,
            "name": "Cells need more Cs & Gs!",
            "description": "Are you an expert now? Match [color=" + COLOR_C + "]C[/color] to [color=" + COLOR_G + "]G[/color].",
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

        // Level 5
        {
            "ntSequence": "ATATTTTAAATATAT",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "Double Bond (AT)tack",
            "description": "Ok, expert! Try to keep up! FYI, A's & T's make double bonds!",
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

        // Level 6
        {
            "ntSequence": "CGGCGCCGCGGCCGC",
            "controls": ["G", "C"],
            "unlocked": true,
            "name": "Level Rated CG",
            "description": "Are you fast enough? FYI, C's & G's make triple bonds!",
            "process": "dna replication",
            "speed": SPEED_FAST,
            "popups": {
                "intro": "How's that accuracy? Try to prevent <style='color:" + COLOR_TERM + "'>mutations</style> from happening."
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

        // Level 7
        {
            "ntSequence": "TAGTCACTAGGAGCA",
            "unlocked": true,
            "name": "All Together Now!",
            "description": "([color=" + COLOR_A + "]A[/color])ll ([color=" + COLOR_T + "]T[/color])he ([color=" + COLOR_C + "]C[/color])ool ([color=" + COLOR_G + "]G[/color])enes have ATCG's!",
            "process": "dna replication",
            "speed": SPEED_SLOW,
            "popups": {
                "intro": "Let's put it all together, DNA is made of all 4 nucleotides (A, T, G, C)."
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

        // Level 8
        {
            "ntSequence": "TAGTCACTAGGAGCA",
            "unlocked": true,
            "name": "Bases Loaded!!!",
            "description": "It's faster, make sure to match bases correctly or you'll introduce mutations!",
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

        // Level 9
        {
            "ntSequence": "TAGTCACTAGGAGCA",
            "unlocked": true,
            "name": "#CanYouKeepUp!",
            "description": "You can't spell MATCHING without ATCG!",
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

        // Level 10
        {
            "ntSequence": "UGCAGUCUGAUGC",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "New nucleotide, U",
            "description": "During Transcription, RNA is made from DNA.",
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

        // Level 11
        {
            "ntSequence": "UGCAGUCUGAUGC",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Ribonucleic Acid (RNA)",
            "description": "[color=" + COLOR_T + "]T[/color] is not in RNA, instead [color=" + COLOR_A + "]A[/color] binds to [color=" + COLOR_U + "]U[/color].",
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

        // Level 12
        {
            "ntSequence": "UGCAGUCUGAUGC",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Polymerase Expert",
            "description": "The Central Dogma:\nDNA → RNA → protein",
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

        // Level 13
        {
            "ntSequence": "GCUGGCAGCUGUCAA",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Spin Cycle!",
            "description": "Rotate (by tapping) the nucleotides so they form bonds!",
            "description_image": {
                "name": "level13_description",
                "x": 180,
                "y": 470,
                "scale": 0.1
            },
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

        // Level 14
        {
            "ntSequence": "GCUGGCAGCUGUCAA",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "TFW You Can't Keep Up!",
            "description": "Remember your binding partners!",
            "description_image": {
                "name": "level14_description",
                "x": 180,
                "y": 480,
                "scale": 0.08
            },
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

        // Level 15
        {
            "ntSequence": "GCUGGCAGCUGUCAA",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Danger: Experts Only",
            "description": "Can you get a perfect sequence?",
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

        // Level 16
        {
            "ntSequence": "AUGCCGGGUCAUGGGCCCACUGACCAUGGGUUUUAG",
            "unlocked": true,
            "name": "Lost in Translation!",
            "description": "Match the condon (RNA) with the anticodon. Anticodons code for specific amion acids to make protein!",
            "description_image": {
                "name": "level16_description",
                "x": 200,
                "y": 520,
                "scale": 0.16
            },
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

        // Level 17
        {
            "ntSequence": "AUGCCGGGUCAUGGGCCCACUGACCAUGGGUUUUAG",
            "unlocked": true,
            "name": "Time for a protein bar!",
            "description": "A Gene (DNA) codes for a sequence of amino acids that make up the Protein.",
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

        // Level 18
        {
            "ntSequence": "",
            "ntSequence": "AUGUUUGACCAUGGGUUUGACCCAGACACUCCGGGUGACCAUUAG",
            "unlocked": true,
            "name": "You put the Pro in Protein",
            "description": "The Central Dogma:\nDNA → RNA → protein",
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

        // Level 19
        {
            "ntSequence": "",
            "ntSequence": "AUGUUUGACCAUGGGUUUGACCCAGACACUCCGGGUGACCAUUAG",
            "unlocked": true,
            "name": "Central Dogma Expert!",
            "description": "Thank you for playing!",
            "description_image": {
                "name": "logo_dogma",
                "x": 180,
                "y": 470,
                "scale": 0.25
            },
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
