/**
 * Class representing an audio player to play music and sounds.
 */
class AudioPlayer {
    constructor() {

        this.music_muted = false;
        this.defaultMusicVolume = 0.4;

        // Sound Effects
        this.incorrectSound = game.sound.add("incorrect", {volume: 0.6});
        this.correctSound = game.sound.add("correct", {volume: 0.6});
        this.dialogOpenSound = game.sound.add("dialog_open", {volume: 0.4});
        this.dialogCloseSound = game.sound.add("dialog_close", {volume: 0.4});
        this.clickSound = game.sound.add("click", {volume: 0.6});
        this.winSound = game.sound.add("win", {volume: 0.6});
        
        // Music
        this.bgmusic1 = game.sound.add("bgmusic1", {loop: true, volume: this.defaultMusicVolume});
        this.bgmusic2 = game.sound.add("bgmusic2", {loop: true, volume: this.defaultMusicVolume});
        this.bgmusic3 = game.sound.add("bgmusic3", {loop: true, volume: this.defaultMusicVolume});

        this.titlemusic = game.sound.add("titlemusic", {loop: true, volume: this.defaultMusicVolume});

        this.bgmusic = [this.bgmusic2, this.bgmusic3];

        this.allMusic = [this.titlemusic, this.bgmusic, this.bgmusic2, this.bgmusic3];

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
        if (!this.music_muted) {
            this.bgmusic1.play();
        }
    }

    playBgMusic2() {
        if (!this.music_muted) {
            this.bgmusic2.play();
        }
    }

    playBgMusic3() {
        if (!this.music_muted) {
            this.bgmusic3.play();
        }
    }

    playTitleMusic() {
        if (!this.music_muted) {
            this.titlemusic.play();
        }
    }

    toggleMuteMusic() {
        this.music_muted = !this.music_muted;        
        if (this.music_muted) {
            this.titlemusic.stop();
        } else {
            this.titlemusic.play();
        }

        /*
        for (let i = 0; i < this.allMusic.length; i++) {
            this.allMusic[i].mute = this.music_muted;
            
            if (this.music_muted) {
                this.allMusic[i].setVolume(0);
            } else {
                this.allMusic[i].setVolume(this.defaultMusicVolume);
            }
            
        }
        */
    }

    stopAllMusic() {
        this.titlemusic.stop();
        this.bgmusic1.stop();
        this.bgmusic2.stop();
        this.bgmusic3.stop();
    }

}

export default AudioPlayer;