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
            families: ['Open Sans', 'Knewave', 'Bevan']
        }
    });

    let game = new Game([
        {
            // "ntSequence": "ATATTTTAAATATATATATATAATTATATATATATATA"
            "ntSequence": "ATATTTTAAATATATATATA",
            "controls": ["T", "A"],
            "unlocked": true,
            "name": "AT the Beginning",
            "speed": 20,
            "popups": {
                "firstCorrectMatch": "Good work! <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> binds with <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>!",
                "error5Match": "In DNA <style='color: {{ nucleotide1.color }};'>{{ nucleotide1.name }}</style> can only bind to <style='color: {{ nucleotide2.color }};'>{{ nucleotide2.name }}</style>, both nucleotides help make up DNA!"
            },
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "dna_replication",
        },
        {
            "ntSequence": "CGCGCGCGGGGCCGCGCGGC",
            "controls": ["G", "C"],
            "unlocked": true,
            "name": "Clash of the Cs and Gs",
            "speed": 20,
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "dna_replication",
        },
        {
            "ntSequence": "TAGTTACTAGGAGAGGTCAT",
            "unlocked": true,
            "name": "Mixing Things Up",
            "speed": 20,
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "dna_replication",
        },
        {
            "ntSequence": "GTAATCACTAAGTAGTAATA",
            "unlocked": true,
            "name": "Adding a Bit of a Twist",
            "speed": 30,
            "rotateNT": true,
            "ntType": "hbonds",
            "lvlType": "dna_replication",
        },
        {
            "ntSequence": "AUGGCAACCAAACCGGGUCAUUGACCCACUGACCAUGGGUUUUAG",
            "unlocked": true,
            "name": "Codon you do this?",
            "speed": 35,
            "rotateNT": false,
            "ntType": "basic",
            "lvlType": "codon_transcription",
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
        },
        // {
        //     "ntSequence": "A",
        //     "controls": ["T", "A"],
        //     "unlocked": true,
        //     "name": "Debug 2",
        //     "rotateNT": false,
        //     "ntType": "basic",
        //     "lvlType": "dna_replication",
        // },
    ]);

    window.game = new Phaser.Game(game.config);
})();
