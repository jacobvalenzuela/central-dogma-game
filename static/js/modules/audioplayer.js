/**
 * Class representing an audio player to play music and sounds.
 */
class AudioPlayer {
    constructor() {
        // Sound Effects
        this.incorrectSound = game.sound.add("incorrect");
        this.correctSound = game.sound.add("correct");
    }

    playCorrectSound() {
        this.correctSound.play();
    }

    playIncorrectSound() {
        this.incorrectSound.play();
    }

}

export default AudioPlayer;