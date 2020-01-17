/**
 * Class representing an audio player to play music and sounds.
 */
class AudioPlayer {
    constructor() {
        // Sound Effects
        this.incorrectSound = game.sound.add("incorrect");
        this.correctSound = game.sound.add("correct");
        
        // Music
        this.bgmusic1 = game.sound.add("bgmusic1", {loop: true,
                                                    volume: 0.6});
    }

    playCorrectSound() {
        this.correctSound.play();
    }

    playIncorrectSound() {
        this.incorrectSound.play();
    }

    playBgMusic1() {
        //this.bgmusic1.play();
    }

}

export default AudioPlayer;