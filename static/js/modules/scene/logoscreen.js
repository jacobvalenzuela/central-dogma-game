/**
 * Represents the title screen
 * @extends Phaser.Scene
 */
class LogoScreen extends Phaser.Scene {
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

        // Stops all music that might be previously playing.
        this.game.sound.stopAll();

        // setting the context
        this.game = this;

        // Background color
        this.graphics = this.game.add.graphics();
        this.graphics.fillStyle(0xFFFFFF, 1.0);
        this.graphics.fillRect(0, 0, 360, 740);
        

        // Intro title screen ISB logo
        let isblogo = this.game.add.image(180, 320, "logo_isb").setScale(0.5).setDepth(10);

        // Intro dogma logo
        let dogmaLogo = this.game.add.sprite(185, 280, "logo_dogma_intro", 0).setScale(1.4).setDepth(10);
        this.dogmaLogo = dogmaLogo;

        let animDelay = 1;
        let that = this;
        this.game.time.addEvent({
            delay: 1000 * animDelay,
            callback: function () {
                that.fadeOut(isblogo, function () {
                    that.game.anims.create({
                        key: "logo_dogma_anim",
                        frames: that.game.anims.generateFrameNumbers("logo_dogma_intro", null),
                        frameRate: 60,
                        repeat: 0,
                        delay: 500  * animDelay
                    });
                    dogmaLogo.anims.play("logo_dogma_anim");
                    that.introWaitTimer = that.game.time.addEvent({
                        delay: 4000  * animDelay,
                        callback: function () {
                            that.fadeOut(that.dogmaLogo, function() {
                                that.scene.launch("loginScreen");
                                that.scene.stop("logoScreen");
                            })
                            
                        },
                        loop: false
                    });
                });
            },
            loop: false
        });
        this.floaty = this.physics.add.group();
        this.backgroundFloaties = this.spawnBackgroundFloaties(25);
    }

    update() {
        // Allows background floaties to wrap
        this.physics.world.wrap(this.floaty, 50);
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
}
export default LogoScreen;
