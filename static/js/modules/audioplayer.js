/**
 * Class representing an audio player to play music and sounds.
 */
class AudioPlayer {
    constructor() {
        // Sound Effects
        this.incorrectSound = game.sound.add("incorrect", {volume: 0.6});
        this.correctSound = game.sound.add("correct", {volume: 0.6});
        this.dialogOpenSound = game.sound.add("dialog_open", {volume: 0.4});
        this.dialogCloseSound = game.sound.add("dialog_close", {volume: 0.4});
        this.clickSound = game.sound.add("click", {volume: 0.6});
        this.winSound = game.sound.add("win", {volume: 0.6});
        
        // Music
        this.bgmusic1 = game.sound.add("bgmusic1", {loop: true, volume: 0.4});
        this.bgmusic2 = game.sound.add("bgmusic2", {loop: true, volume: 0.4});
        this.bgmusic3 = game.sound.add("bgmusic3", {loop: true, volume: 0.4});

        this.titlemusic = game.sound.add("titlemusic", {loop: true, volume: 0.4});

        this.bgmusic = [this.bgmusic2, this.bgmusic3];

    }

    playCorrectSound() {
        this.correctSound.play();
    }

    playIncorrectSound() {
        this.incorrectSound.play();
    }

    playDialogOpenSound() {
        this.dialogOpenSound.play();
    }

    playDialogCloseSound() {
        this.dialogCloseSound.play();
    }

    playClickSound() {
        this.clickSound.play();
    }

    playWinSound() {
        this.winSound.play();
    }

    playRandomBgMusic() {
        this.bgmusic[Math.floor(Math.random() * this.bgmusic.length)].play();
    }

    playBgMusic1() {
        this.bgmusic1.play();
    }

    playBgMusic2() {
        this.bgmusic2.play();
    }

    playBgMusic3() {
        this.bgmusic3.play();
    }

    playTitleMusic() {
        this.titlemusic.play();
    }

}

export default AudioPlayer;