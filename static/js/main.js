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

    let COLOR_DNA = "#22F2DD";
    let COLOR_RNA = "#FF74F8";
    let COLOR_PEPTIDE = "#A6FF4D";

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
            "descriptionVocab": [
                {
                    text: "The basics of ",
                    x: 20,
                    y: 300
                },
                {
                    text: "[color=" + COLOR_TERM + "]DNA, [/color]",
                    x: 132,
                    y: 300,
                    popup: "The primary molecule of inheritance in nearly all organisms; a double-stranded polymer of nucleotides that contains the sugar deoxyribose; abbreviated as DNA."
                },
                {
                    text: "[color=" + COLOR_A + "]Adenine or 'A'[/color]",
                    x: 175,
                    y: 300,
                    popup: "Adenine is a nucleobase, and a purine base in DNA and RNA. It is one of the four nucleobases in the nucleic acid of DNA that are represented by the letters G–C–A–T."
                },
                {
                    text: "matches with ",
                    x: 20,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_T + "]Thymine or 'T'[/color].",
                    x: 135,
                    y: 330,
                    popup: "Thymine is one of the four nucleobases in the nucleic acid of DNA that are represented by the letters G–C–A–T. Pyrimidine in DNA but not in RNA."
                },
                {
                    text: "(Tap on [color=" + COLOR_TERM + "]colored terms[/color] for its definition)",
                    x: 20,
                    y: 500,
                    popup: "If a full word is highlighted in another color, you can click on it to learn more."
                }
            ],
            "process": "dna replication",
            "speed": SPEED_MEDIUM,
            "popups": {
                "intro": "Tap a <style='color:" + COLOR_TERM + "'>nucleotide</style> to match the correct <style='color:" + COLOR_TERM + "'>base pair</style>. You can also submit nucleotides by pushing its letter on a keyboard.",
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
            }
            //"endMessage": "You just sequenced xxxxxxxxxxxxxx!"
        },

        // LEVEL 2
        {
            "ntSequence": "CGGCGCCGCGGCCGC",
            "controls": ["G", "C"],
            "unlocked": true,
            "name": "Clash of the Cs & Gs",
            "description": "The basics of DNA, [color=" + COLOR_C + "]C[/color] matches with [color=" + COLOR_G + "]G[/color].",
            "descriptionVocab": [
                {
                    text: "The basics of ",
                    x: 20,
                    y: 300
                },
                {
                    text: "[color=" + COLOR_TERM + "]DNA, [/color]",
                    x: 132,
                    y: 300,
                    popup: "The primary molecule of inheritance in nearly all organisms; a double-stranded polymer of nucleotides that contains the sugar deoxyribose; abbreviated as DNA."
                },
                {
                    text: "[color=" + COLOR_C + "]Cytosine or 'C'[/color]",
                    x: 175,
                    y: 300,
                    popup: "Cytosine is one of the four main bases found in DNA and RNA. Pyrimidine in DNA and RNA."
                },
                {
                    text: "matches with ",
                    x: 20,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_G + "]Guanine or 'G'[/color].",
                    x: 135,
                    y: 330,
                    popup: "Guanine is one of the four main nucleobases found in the nucleic acids DNA and RNA. Purine in DNA and RNA."
                },
                {
                    text: "(Tap on [color=" + COLOR_TERM + "]colored terms[/color] for its definition)",
                    x: 20,
                    y: 500,
                    popup: "If a full word is highlighted in another color, you can click on it to learn more."
                }
            ],
            "process": "dna replication",
            "speed": SPEED_MEDIUM,
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

        // Level 3
        {
            "ntSequence": "ATATTTTAAATATAT",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "Double Bond (AT)tack",
            "description": "Ok, expert! Try to keep up!\nFYI, A's & [color=" + COLOR_T + "]T[/color]'s make double bonds!",
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

        // Level 4
        {
            "ntSequence": "CGGCGCCGCGGCCGC",
            "controls": ["G", "C"],
            "unlocked": true,
            "name": "Level Rated CG",
            "description": "Are you fast enough?\nFYI, [color=" + COLOR_C + "]C[/color]'s & [color=" + COLOR_G + "]G[/color]'s make triple bonds!",
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

        // Level 5
        {
            "ntSequence": "TAGTCACTAGGAGCA",
            "controls": ["T", "A", "G", "C"],
            "unlocked": true,
            "name": "Bases Loaded!!!",
            "description": "(A)ll (T)he (C)ool (G)enes have ATCG's!",
            //"description": "([color=" + COLOR_A + "]A[/color])ll ([color=" + COLOR_T + "]T[/color])he ([color=" + COLOR_C + "]C[/color])ool ([color=" + COLOR_G + "]G[/color])enes have ATCG's!",
            "descriptionVocab": [
                {
                    text: "(A)ll (T)he (C)ool ",
                    x: 20,
                    y: 300
                },
                {
                    text: "[color=" + COLOR_TERM + "](G)enes[/color] ",
                    x: 163,
                    y: 300,
                    popup: "A region of DNA (deoxyribonucleic acid) coding either for the messenger RNA encoding the amino acid sequence in a polypeptide chain or for a functional RNA molecule."
                },
                {
                    text: "have ",
                    x: 233,
                    y: 300
                },
                {
                    text: "[color=" + COLOR_TERM + "]ATCG's![/color]",
                    x: 20,
                    y: 330,
                    popup: "Nucleotides are A nitrogenous base attached to a sugar; a component of nucleic acids."
                }
            ],
            "process": "dna replication",
            "speed": SPEED_MEDIUM,
            "popups": {
                "intro": "Let's put it all together, DNA is made of all 4 nucleotides (A, T, G, C). Submit nucleotides by tapping on them, or by pushing its letter on a keyboard."
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
            "ntSequence": "TAGTCACTAGGAGCA",
            "controls": ["T", "A", "G", "C"],
            "unlocked": true,
            "name": "#CanYouKeepUp!",
            "description": "You can't spell MATCHING without \n[color=" + COLOR_A + "]A[/color][color=" + COLOR_T + "]T[/color][color=" + COLOR_C + "]C[/color][color=" + COLOR_G + "]G[/color]! Don't make any mutations!",
            "descriptionVocab": [
                {
                    text: "You can't spell MATCHING without",
                    x: 20,
                    y: 300
                },
                {
                    text: "ACTG! Don't make any ",
                    x: 20,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_TERM + "]mutations[/color]!",
                    x: 207,
                    y: 330,
                    popup: "Any change in a genetic sequence, large or small."
                }
            ],
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

        // Level 7
        {
            "ntSequence": "ATGCAGTCTGATGC",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "New nucleotide, U",
            "description": "During Transcription, RNA is made from DNA. [color=" + COLOR_T + "]T[/color] is not in RNA, instead [color=" + COLOR_A + "]A[/color] binds to [color=" + COLOR_U + "]U[/color].",
            "descriptionVocab": [
                {
                    text: "During ",
                    x: 20,
                    y: 300
                },
                {
                    text: "[color=" + COLOR_TERM + "]Transcription[/color],",
                    x: 77,
                    y: 300,
                    popup: "A biochemical process by which the information in a strand of DNA is copied into a new molecule of messenger RNA (mRNA)."
                },
                {
                    text: "[color=" + COLOR_TERM + "]RNA[/color]",
                    x: 193,
                    y: 300,
                    popup: "Ribonucleic acid, or RNA, is a single-stranded polymer of nucleotides that contain the sugar ribose; made through the process of transcription; three primary types exist, and all three function in the interpretation of the information stored in DNA."
                },
                {
                    text: "is made ",
                    x: 230,
                    y: 300
                },
                {
                    text: "from",
                    x: 20,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_TERM + "]DNA[/color]. ",
                    x: 63,
                    y: 330,
                    popup: "The primary molecule of inheritance in nearly all organisms; a double-stranded polymer of nucleotides that contains the sugar deoxyribose; abbreviated as DNA."
                },
                {
                    text: "T is not in RNA, instead A",
                    x: 104,
                    y: 330
                },
                {
                    text: "binds to U.",
                    x: 20,
                    y: 360
                },
            ],
            "process": "transcription",
            "speed": SPEED_MEDIUM,
            "popups": {
                "intro": "Great job making all that DNA! Now its time to make <style='color:" + COLOR_TERM + "'>RNA</style>, see if you notice the difference.",
                "firstCorrectMatch": "Correct! When making RNA from DNA, nucleotide <style='color:" + COLOR_A + "'>A</style> only pairs with a <style='color:" + COLOR_U + "'>U</style> nucleotide in RNA.",
                "error5Match": "Whoops! When making RNA from DNA, nucleotide <style='color:" + COLOR_A + "'>A</style> only pairs with a <style='color:" + COLOR_U + "'>U</style> nucleotide in RNA."
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
            "ntSequence": "TGCAGTCTGATGC",
            "controls": ["U", "A", "G", "C"],
            "unlocked": true,
            "name": "Ribonucleic Acid (RNA)",
            "description": "The Central Dogma:\n[color=" + COLOR_DNA + "]DNA[/color] → [color=" + COLOR_RNA + "]RNA[/color] → [color=" + COLOR_PEPTIDE + "]protein[/color]",
            "descriptionVocab": [
                {
                    text: "The Central Dogma: ",
                    x: 20,
                    y: 300
                },
                {
                    text: "[color=" + COLOR_DNA + "]DNA[/color]",
                    x: 20,
                    y: 330,
                    popup: "The primary molecule of inheritance in nearly all organisms; a double-stranded polymer of nucleotides that contains the sugar deoxyribose; abbreviated as DNA."
                },
                {
                    text: " → ",
                    x: 57,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_RNA + "]RNA[/color]",
                    x: 90,
                    y: 330,
                    popup: "Ribonucleic acid, or RNA, is a single-stranded polymer of nucleotides that contain the sugar ribose; made through the process of transcription; three primary types exist, and all three function in the interpretation of the information stored in DNA."
                },
                {
                    text: " → ",
                    x: 125,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_PEPTIDE + "]protein[/color]",
                    x: 159,
                    y: 330,
                    popup: "A connected series of amino acids that may have up to 20 different kinds of side chains; can exist in long fibrous or globular forms; component of macromolecules; forms enzymes and macromolecules active in cellular structure and biochemical processes."
                },
            ],
            "process": "transcription",
            "speed": SPEED_FAST,
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

        // Level 9
        {
            "ntSequence": "AUGCCGGGUCAUGGGCCCACUGACCAUGGGUUUUAG",
            "unlocked": true,
            "name": "Lost in Translation!",
            "description": "Match the condon ([color=" + COLOR_RNA + "]RNA[/color]) with the anticodon. Anticodons code for specific amino acids to make [color=" + COLOR_PEPTIDE + "]protein[/color]!",
            "descriptionVocab": [
                {
                    text: "Match the ",
                    x: 20,
                    y: 300
                },
                {
                    text: "[color=" + COLOR_TERM + "]codon[/color] ",
                    x: 105,
                    y: 300,
                    popup: "A triplet sequence of DNA or RNA nucleotides corresponding to a specific amino acid or a start/stop signal in translation."
                },
                {
                    text: "(RNA) with the ",
                    x: 162,
                    y: 300
                },
                {
                    text: "[color=" + COLOR_TERM + "]anticodon[/color]. ",
                    x: 20,
                    y: 330,
                    popup: "Sequence of three nucleotides in tRNA that pairs with the corresponding codon in mRNA in translation."
                },
                {
                    text: "Anticodons code for specific",
                    x: 111,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_TERM + "]amino acids[/color] ",
                    x: 20,
                    y: 360,
                    popup: "Amino acids are small molecules that serve as building blocks of proteins."
                },
                {
                    text: "to make protein!",
                    x: 123,
                    y: 360
                },
            ],
            "description_image": {
                "name": "level16_description",
                "x": 200,
                "y": 492,
                "scale": 0.13
            },
            "process": "translation",
            "speed": SPEED_SLOW,
            "popups": {
                "intro": "Now that you know how to make DNA and RNA, lets make <style='color:" + COLOR_TERM + "'>protein</style>. Tap the codon to submit, or push 1 or 2 on a keyboard.",
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

        // Level 10
        {
            "ntSequence": "AUGCCGGGUCAUGGGCCCACUGACCAUGGGUUUUAG",
            "unlocked": true,
            "name": "Time for a protein bar!",
            "description": "A Gene ([color=" + COLOR_DNA + "]DNA[/color]) codes for a sequence of amino acids that make up the [color=" + COLOR_PEPTIDE + "]protein[/color].",
            "descriptionVocab": [
                {
                    text: "A ",
                    x: 20,
                    y: 300
                },
                {
                    text: "[color=" + COLOR_TERM + "]gene[/color] ",
                    x: 37,
                    y: 300,
                    popup: "A region of DNA (deoxyribonucleic acid) coding either for the messenger RNA encoding the amino acid sequence in a polypeptide chain or for a functional RNA molecule."
                },
                {
                    text: "(DNA) codes for a sequence ",
                    x: 82,
                    y: 300
                },
                {
                    text: "of ",
                    x: 20,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_TERM + "]amino acids[/color] ",
                    x: 41,
                    y: 330,
                    popup: "Amino acids are small molecules that serve as building blocks of proteins."
                },
                {
                    text: "that make up the ",
                    x: 144,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_TERM + "]protein[/color].",
                    x: 20,
                    y: 360,
                    popup: "A connected series of amino acids that may have up to 20 different kinds of side chains; can exist in long fibrous or globular forms; component of macromolecules; forms enzymes and macromolecules active in cellular structure and biochemical processes."
                },
            ],
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

        // Level 11
        {
            "ntSequence": "",
            "ntSequence": "AUGUUUGACCAUGGGUUUGACCCAGACACUCCGGGUGACCAUUAG",
            "unlocked": true,
            "name": "You put the Pro in Protein",
            "description": "The Central Dogma:\n[color=" + COLOR_DNA + "]DNA[/color] → [color=" + COLOR_RNA + "]RNA[/color] → [color=" + COLOR_PEPTIDE + "]protein[/color]",
            "descriptionVocab": [
                {
                    text: "The Central Dogma: ",
                    x: 20,
                    y: 300
                },
                {
                    text: "[color=" + COLOR_DNA + "]DNA[/color]",
                    x: 20,
                    y: 330,
                    popup: "The primary molecule of inheritance in nearly all organisms; a double-stranded polymer of nucleotides that contains the sugar deoxyribose; abbreviated as DNA."
                },
                {
                    text: " → ",
                    x: 57,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_RNA + "]RNA[/color]",
                    x: 90,
                    y: 330,
                    popup: "Ribonucleic acid, or RNA, is a single-stranded polymer of nucleotides that contain the sugar ribose; made through the process of transcription; three primary types exist, and all three function in the interpretation of the information stored in DNA."
                },
                {
                    text: " → ",
                    x: 125,
                    y: 330
                },
                {
                    text: "[color=" + COLOR_PEPTIDE + "]protein[/color]",
                    x: 159,
                    y: 330,
                    popup: "A connected series of amino acids that may have up to 20 different kinds of side chains; can exist in long fibrous or globular forms; component of macromolecules; forms enzymes and macromolecules active in cellular structure and biochemical processes."
                },
            ],
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

        // Level 12
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
                "scale": 0.3
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
        },

        // Level BONUS
        {
            "ntSequence": "GCTGGCAGCTGTCAA",
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
                "intro": "Tap nucleotides to rotate and slide them to submit a proper double or triple bond. You can also use the spacebar to rotate, and letters A, C, T, and G to submit."
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

        // Level BONUS
        {
            "ntSequence": "GCTGGCAGCTGTCAA",
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

        // Level BONUS
        {
            "ntSequence": "GCTGGCAGCTGTCAA",
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
        }
    ]);
    window.game = new Phaser.Game(game.config);
})();
