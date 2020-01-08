/**
 * Represents the level stage scene
 * @extends Phaser.Scene
 */
class AboutScreen extends Phaser.Scene {

    /**
     * Creates an about/credits screen scene.
     * @param {Phaser.Types.Scenes.SettingsConfig} config 
     */
    constructor (config) {
        super(config);
    }

    /**
     * Initalizes the level.
     * @param {JSON} data 
     */
    init(data) {

        this.camera = this.cameras.main;
        console.log(this);
        var graphics = this.add.graphics();

        // Text
        this.add.text(26, 90, "ABOUT", 
        {fontFamily: 'Teko', fontSize: '40pt', color: '#000'});


        // Back button
        this.backBtn = this.add.image(50, 690, "back_btn").setScale(0.30).setInteractive();
        this.backBtn.on("pointerdown", () => {
            this.backButtondown();
        })


        
        // Floaties
        this.floaty = this.physics.add.group();
        this.backgroundFloaties = this.spawnBackgroundFloaties(25);
        
        
    }

    update() {
        // Allows background floaties to wrap
        this.physics.world.wrap(this.floaty, 50);
    }

    backButtondown() {
        this.camera.fadeOut(400);
        let that = this;        
        this.time.addEvent({
            delay: 400,
            loop: false,
            callback: function () {
                that.scene.stop("about");
                that.scene.launch("titlescreen");
            }
        });
    }   

    /**
     * Make button smaller
     * @param {Phaser.GameObjects.Image} img - the play button
     */
    onButtonClickHold(img) {
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
            myFloaty.setScale(maxScale).setDepth(0.5).setAlpha(0.15);

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

export default AboutScreen;