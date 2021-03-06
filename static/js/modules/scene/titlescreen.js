import AudioPlayer from "../audioplayer.js";

/**
 * Represents the title screen
 * @extends Phaser.Scene
 */
class TitleScreen extends Phaser.Scene {
    /**
     * Creates a title screen scene
     * @param {Phaser.Types.Scenes.SettingsConfig} config 
     */
    constructor (config) {
        super(config);
    }

    /**
     * Creates the title screen with animations
     * @param {JSON} data 
     */
    init(data) {

        console.log(data);
        this.data = data;

        this.skipToLevelsList = false;
        if (data.skipToLevelsList) {
            this.skipToLevelsList = true;
        }

        this.showBonusLevels = false;
        if (data.showBonusLevels) {
            this.showBonusLevels = true;
        }

        this.gameObj = data.gameObj;
        this.game = this;
        this.camera = this.game.cameras.cameras[0];
        this.graphics = this.game.add.graphics();

        if (data.fadeIn) {
            this.camera.fadeIn(1000);
        }
        
        this.playedIntro = false;

        // Background color
        this.graphics.fillStyle(0xFFFFFF, 1.0);
        this.graphics.fillRect(0, 0, 360, 740);
        
        // Audio
        // will grab existing audio object if there is one 
        // (sometimes it's passed when we move between scenes to preserve audio/muting)
        if (data.audio) { 
            this.audioplayer = data.audio;
            if (this.data.gameObj.GLOBAL.ACTIVE_MUSIC) {
                this.audioplayer.playTitleMusic();
            } else {
                this.audioplayer.stopAllMusic();
            }
        } else {
            this.audioplayer = new AudioPlayer();
            if (this.data.gameObj.GLOBAL.ACTIVE_MUSIC) {
                this.audioplayer.playTitleMusic();
            }
        }
        

        // Intro title screen ISB logo
        this.dogmaLogo = this.game.add.image(180, 275, "logo_dogma").setScale(0.3).setDepth(10);

        // upper right ISB logo
        this.isblogo = this.game.add.image(80, 45, "logo_isb").setScale(0.30).setAlpha(1.0).setDepth(1);

        // Notifications
        this.alert = this.game.add.text(68, 390, "",
            {fontFamily: 'Teko', fontSize: '20pt', color: '#000000'}).setDepth(1).setAlpha(1);

        // Menu Buttons

        // Play Button
        this.playBtn = this.game.add.image(180, 420, "play_btn").setScale(0.5).setAlpha(0).setDepth(1);
        this.playBtn.setVisible(false);
        this.playBtn.addListener("pointerdown", this.bindFn(this.onButtonClickHold));
        this.playBtn.addListener("pointerup", this.bindFn(this.onButtonClickRelease));
        this.playBtn.addListener("dragend", this.bindFn(this.onButtonClickRelease));

        // Play Bonus Levels Button
        this.playBonusBtn = this.game.add.image(180, 507, "play_bonus_btn").setScale(0.5).setAlpha(0).setDepth(1);
        this.playBonusBtn.setVisible(false);
        this.playBonusBtn.addListener("pointerdown", this.bindFn(this.onButtonClickHold));
        this.playBonusBtn.addListener("pointerup", this.bindFn(this.onButtonClickRelease));
        this.playBonusBtn.addListener("dragend", this.bindFn(this.onButtonClickRelease));

        // Signin Button
        this.signInBtn = this.game.add.image(180, 580, "signin_btn").setScale(0.5).setAlpha(0).setDepth(1);
        this.signInBtn.addListener("pointerdown", this.bindFn(this.onButtonClickHold));
        this.signInBtn.addListener("pointerup", this.bindFn(this.onButtonClickRelease));
        this.signInBtn.addListener("dragend", this.bindFn(this.onButtonClickRelease));

        // Effect Disable Button
        this.effectDisableBtn = this.game.add.image(180, 640, "effect_disable_btn").setScale(0.5).setAlpha(0).setDepth(1);
        this.effectDisableBtn.addListener("pointerdown", this.bindFn(this.onButtonClickHold));
        this.effectDisableBtn.addListener("pointerup", this.bindFn(this.onButtonClickRelease));
        this.effectDisableBtn.addListener("dragend", this.bindFn(this.onButtonClickRelease));

        // Education Button
        this.educationDisableBtn = this.game.add.image(180, 700, "education_disable_btn").setScale(0.5).setAlpha(0).setDepth(1);
        this.educationDisableBtn.addListener("pointerdown", this.bindFn(this.onButtonClickHold));
        this.educationDisableBtn.addListener("pointerup", this.bindFn(this.onButtonClickRelease));
        this.educationDisableBtn.addListener("dragend", this.bindFn(this.onButtonClickRelease));

        // Music Button
        this.musicbtn = this.add.image(310, 45, "mutemusic_btn").setScale(0.30).setInteractive().setAlpha(0).setDepth(1);
        this.musicbtn.on("pointerdown", () => {
            this.audioplayer.playClickSound();
            this.data.gameObj.GLOBAL.ACTIVE_MUSIC = !this.data.gameObj.GLOBAL.ACTIVE_MUSIC;
            if (this.data.gameObj.GLOBAL.ACTIVE_MUSIC) {
                this.musicbtn.setAlpha(1.0);
                this.audioplayer.MuteMusic(false);
            } else {
                this.musicbtn.setAlpha(0.5);
                this.audioplayer.MuteMusic(true);
            }
        });

        // Handles skipping to levels (most likely from pause screen)
        let animDelay = 1;
        if (this.skipToLevelsList) {
            animDelay = 0;

            console.log("showing bonus level messages:")
            console.log(this);
            console.log(this.showBonusLevels);

            if (this.showBonusLevels) {
                this.onPlayClick(true);
            } else {
                this.onPlayClick(false);
            }
        }

        this.input.on("pointerdown", this.bindFn(this.displayUI));

        let that = this;
        this.displayUI();
        this.floaty = this.physics.add.group();
        this.backgroundFloaties = this.spawnBackgroundFloaties(25);
    }

    update() {
        // Allows background floaties to wrap
        this.physics.world.wrap(this.floaty, 50);
    }
    
    /**
     * Display the UI (button) so game may be started faster
     */
    displayUI() {
        if (this.playedIntro) {
            return;
        }
        this.playBtn.setVisible(true);
        this.playedIntro = true;

        // Fade in all UI
        this.fadeIn(this.playBtn);
        this.fadeIn(this.isblogo);
        this.fadeIn(this.playBonusBtn);
        

 
        this.fadeIn(this.musicbtn, () => {
            if (!this.data.gameObj.GLOBAL.ACTIVE_MUSIC) {
                this.musicbtn.setAlpha(0.5);
            }
        });

        this.fadeIn(this.educationDisableBtn, () => {
            if (!this.data.gameObj.GLOBAL.ACTIVE_EDUCATION) {
                this.educationDisableBtn.setAlpha(0.5);
            }
        });

        this.fadeIn(this.effectDisableBtn, () => {
            if (!this.data.gameObj.GLOBAL.ACTIVE_EFFECTS) {
                this.effectDisableBtn.setAlpha(0.5);
            }
        });
        
        // Makes UI Interactive
        this.playBtn.setInteractive();
        this.playBtn.addListener("pointerup", () => {
            this.onPlayClick(false);
        });

        this.playBonusBtn.setInteractive();
        this.playBonusBtn.addListener("pointerup", () => {
            this.onPlayClick(true);
        });

        this.effectDisableBtn.setInteractive();
        this.effectDisableBtn.addListener("pointerup", this.bindFn(this.onEffectDisableClick));

        this.educationDisableBtn.setInteractive();
        this.educationDisableBtn.addListener("pointerup", this.bindFn(this.onEducationDisableClick));


        // Only sign in fades in / made interactive if user is signed out
        cdapi.isUserSignedIn(this.data.gameObj.userName, this.data.gameObj.SessionID).then(result => {
            if (result) {
                this.signInBtn.setInteractive(false);
                this.signInBtn.setAlpha(0);
            } else {
                this.signInBtn.setInteractive();
                this.fadeIn(this.signInBtn);
                this.signInBtn.addListener("pointerup", () => {
                    this.audioplayer.stopAllMusic();
                    this.scene.stop("loginScreen");
                    this.scene.launch("loginScreen");
                    this.scene.stop("titlescreen");
                });
            }
        })


    }

    /**
     * Fade in object
     * @param {Phaser.GameObjects.Image} image - Image to fade in
     * @param {function} [callback=null] - function to run when done fading
     */
    fadeIn(image, callback=null) {
        let currentAlpha = image.alpha;
        if (currentAlpha == 0) {
            currentAlpha = 0.0001;
        }
        let newAlpha = currentAlpha * 1.5;
        if (newAlpha > 0.999) {
            image.clearAlpha();
            if (callback != null) {
                callback(image);
            }
        } else {
            image.setVisible(true);
            image.setAlpha(newAlpha);
            let that = this;
            this.game.time.addEvent({
                delay: 40,
                callback: function () {
                    that.fadeIn(image, callback);
                },
                loop: false
            });
        }
    }

    /**
     * Fade out object
     * @param {Phaser.GameObjects.Image} image - Image to fade out
     * @param {function} [callback=null] - function to run when done fading
     * @param {boolean} [skip=false] - if fading out should be skipped entirely
     */
    fadeOut(image, callback=null, skip=false) {
        let currentAlpha = image.alpha;
        let newAlpha = currentAlpha / 1.5;
        if (newAlpha < 0.001 || skip) {
            image.clearAlpha();
            image.setVisible(false);
            if (callback != null) {
                callback(image);
            }
        } else {
            image.setAlpha(newAlpha);
            let that = this;
            this.game.time.addEvent({
                delay: 20,
                callback: function () {
                    that.fadeOut(image, callback);
                },
                loop: false
            });
        }
    }

    /**
     * Show list of levels
     * @param {Phaser.GameObjects.Image} img - the play button
     */
    onPlayClick(bonusLevels) {
        let that = this;
        this.fadeOut(this.playBtn, function () {
            that.playBtn.setVisible(false);
        });
        /*
        this.playBtn.removeListener("pointerup");
        this.playBtn.removeListener("pointerdown");
        this.playBtn.removeListener("pointerup");
        this.playBtn.removeListener("dragend");
        */

        // Fades out UI
        this.fadeOut(this.dogmaLogo);
        this.fadeOut(this.playBtn);
        this.fadeOut(this.playBonusBtn);
        this.fadeOut(this.effectDisableBtn);
        this.fadeOut(this.educationDisableBtn);
        this.fadeOut(this.signInBtn);
        this.fadeOut(this.isblogo);
        this.fadeOut(this.musicbtn);

        // Removes interactivity from UI
        this.effectDisableBtn.setInteractive(false);
        this.educationDisableBtn.setInteractive(false);
        this.playBtn.setInteractive(false);
        this.signInBtn.setInteractive(false);

        console.log(this.data.gameObj.levels);
        console.log("bonusLevels:");
        console.log(bonusLevels);

        // Checks if we want to see bonus levels
        if (bonusLevels) {
            this.scene.launch("listlevels", {gameObj: this.data.gameObj, levels: this.data.gameObj.levels.slice(12), audio: this.audioplayer});
        } else  {
            this.scene.launch("listlevels", {gameObj: this.data.gameObj, levels: this.data.gameObj.levels.slice(0, 12), audio: this.audioplayer});
        }
       
        this.scene.moveAbove("titlescreen", "listlevels");
        
    }

    /**
     * Toggles epilepsy setting
     * @param {Phaser.GameObjects.Image} img - the epilepsy toggle button
     */
    onEffectDisableClick(img) {
        this.data.gameObj.GLOBAL.ACTIVE_EFFECTS = !this.data.gameObj.GLOBAL.ACTIVE_EFFECTS;
        

        // If user is epileptic, they want to disable the screen effects
        // means the button should be faded.
        if(this.data.gameObj.GLOBAL.ACTIVE_EFFECTS) {
            img.setAlpha(1.0);
            this.displayAlert("Screen shake/flash enabled.");
        } else {
            img.setAlpha(0.66);
            this.displayAlert("Screen shake/flash disabled.");
        }
        
    }

    /**
     * Toggles education setting
     * @param {Phaser.GameObjects.Image} img - the education toggle button
     */
    onEducationDisableClick(img) {
        this.data.gameObj.GLOBAL.ACTIVE_EDUCATION = !this.data.gameObj.GLOBAL.ACTIVE_EDUCATION;
        
        if(this.data.gameObj.GLOBAL.ACTIVE_EDUCATION) {
            img.setAlpha(1.0);
            this.displayAlert("Education features enabled.");
        } else {
            img.setAlpha(0.66);
            this.displayAlert("Education features disabled.");
        }
    }
    
    /**
     * Show credits/about page
     * @param {Phaser.GameObjects.Image} img - the credits/about button
     */
    onCreditsClick(img) {
        this.camera.fadeOut(400);
        let that = this;        
        this.time.addEvent({
            delay: 400,
            loop: false,
            callback: function () {
                that.scene.launch("aboutScreen");
                that.scene.stop("titlescreen");
            }
        });
    }

    /**
     * Make button smaller
     * @param {Phaser.GameObjects.Image} img - the play button
     */
    onButtonClickHold(img) {
        this.audioplayer.playClickSound();
        img.setScale(0.45);
    }

    /**
     * Make button regular sized
     * @param {Phaser.GameObjects.Image} img - the play button
     */
    onButtonClickRelease(img) {
        img.setScale(0.50);
    }

    /**
     * Changes the context of the function `this` keyword to the class. Moves the `this` reference to the first parameter instead.
     * @param {function} fn - The function used to bind to the class
     */
    bindFn(fn) {
        let clas = this;
        return function (...args) {
            let event = this;
            fn.bind(clas, event, ...args)();
        };
    }
    /**
     * Generates floaties that randomly move and grow/shrink in the background.
     * @param {INT} n - How many floaties to spawn.
     * @returns {Array} - An array with all the floaties.
     */    
    spawnBackgroundFloaties(n) {
        let allFloaties = [];
        for (let i = 0; i < n; i++) {
            // Settings for background floaties
            let maxScale = 0.20 * Math.random(); // their potential max size
            let maxSpeed = 35; // their potential max speed
            let screenWidth = 360; // width of box to randomly spawn floaties
            let screenHeight = 720; // height of box to randomly spawn floaties

            let myFloaty = this.floaty.create(screenWidth * Math.random(), screenHeight * Math.random(), 'fluff_dark');
            myFloaty.setScale(maxScale).setDepth(0.2).setAlpha(0.15);

            // Randoly sets speed to some percentage of its max speed, in a random direction
            myFloaty.setVelocity(Phaser.Math.Between(-maxSpeed * Math.random(), maxSpeed * Math.random()), 
                                 Phaser.Math.Between(-maxSpeed * Math.random(), maxSpeed * Math.random()));
            
            this.tweens.add({
                targets: myFloaty,
                maxScale: maxScale + 0.07,
                duration: 1000 + (Math.random() * 5000),
                ease: 'Power1',
                yoyo: true,
                repeat: -1
            });
            allFloaties.push(myFloaty);
        }
    }
    
    /**
     * Displays a temporary alert message in the certain of the screen.
     * @param {string} text - Alert message
     */ 
    displayAlert(text) {
        this.alert.setText(text);
        this.tweens.add({
            targets: this.alert,
            alpha: 1,
            duration: 200,
            ease: 'Linear'
        });
        let that = this;
        that.time.addEvent({
            delay: 1000,
            loop: false,
            callback: function() {
                that.tweens.add({
                    targets: that.alert,
                    alpha: 0,
                    duration: 200,
                    ease: 'Linear'
                });
            }
        });
    }
}

export default TitleScreen;
