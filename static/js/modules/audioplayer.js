/**
 * Class representing an audio player to play music and sounds.
 */
class AudioPlayer {
    constructor() {

        this.music_muted = false;
        this.defaultMusicVolume = 0.4;

        // Sound Effects
        this.incorrectSound = game.sound.add("incorrect", { volume: 0.6 });
        this.correctSound = game.sound.add("correct", { volume: 0.6 });
        this.dialogOpenSound = game.sound.add("dialog_open", { volume: 0.4 });
        this.dialogCloseSound = game.sound.add("dialog_close", { volume: 0.4 });
        this.clickSound = game.sound.add("click", { volume: 0.6 });
        this.winSound = game.sound.add("win", { volume: 0.6 });

        // Music
        this.bgmusic2 = game.sound.add("bgmusic2", { loop: true, volume: this.defaultMusicVolume });
        this.bgmusic3 = game.sound.add("bgmusic3", { loop: true, volume: this.defaultMusicVolume });

        this.titlemusic = game.sound.add("titlemusic", { loop: true, volume: this.defaultMusicVolume });

        this.bgmusic = [this.bgmusic2, this.bgmusic3];

        this.allMusic = [this.titlemusic, this.bgmusic2, this.bgmusic3];

    }

    /**
    * Plays the sound for when something correct happens.
    * @function
    */
    playCorrectSound() {
        this.correctSound.play();
    }

    /**
    * Plays the sound for when something incorrect happens.
    * @function
    */
    playIncorrectSound() {
        this.incorrectSound.play();
    }

    /**
    * Plays the sound for when a dialog box opens.
    * @function
    */
    playDialogOpenSound() {
        this.dialogOpenSound.play();
    }

    /**
    * Plays the sound for when a dialog box closes.
    * @function
    */
    playDialogCloseSound() {
        this.dialogCloseSound.play();
    }

    /**
    * Plays the sound for when the user clicks on something.
    * @function
    */
    playClickSound() {
        this.clickSound.play();
    }

    /**
    * Plays the sound for when the player wins.
    * @function
    */
    playWinSound() {
        this.winSound.play();
    }

    /**
    * Selects a random song from the background music to play.
    * @function
    */
    playRandomBgMusic() {
        this.bgmusic[Math.floor(Math.random() * this.bgmusic.length)].play();
    }

    /**
    * Specifically plays the track bgmusic2.
    * @function
    */
    playBgMusic2() {
        if (!this.music_muted) {
            this.bgmusic2.play();
        }
    }

     /**
    * Specifically plays the track bgmusic3.
    * @function
    */
    playBgMusic3() {
        if (!this.music_muted) {
            this.bgmusic3.play();
        }
    }

    /**
    * Specifically plays the title screen music.
    * @function
    */    
    playTitleMusic() {
        if (!this.music_muted) {
            this.titlemusic.play();
        }
    }

    /**
    * Mutes and unmutes music.
    * @function
    * @param {bool} bool - Whether or not to mute the music.
    */
    MuteMusic(bool) {
        this.music_muted = bool;
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

    /**
    * Stops all music
    * @function
    */    
    stopAllMusic() {
        this.titlemusic.stop();
        this.bgmusic2.stop();
        this.bgmusic3.stop();
    }

}

export default AudioPlayer;