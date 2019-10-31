/**
 * Represents the Popup Display
 * @extends Phaser.Scene
 */
class PopupDisplayScene extends Phaser.Scene {
    /**
     * Creates a popup display scene
     * @param {Phaser.Types.Scenes.SettingsConfig} config 
     */
    constructor (config) {
        super(config);
    }

    /**
     * Initalizes the popup display. Fades in and populate the text
     * @param {JSON} data 
     */
    init(data) {
        this.manager = data.manager;

        this.camera = this.cameras.main;
        this.camera.setAlpha(0);

        this.graphics = this.add.graphics();

        this.graphics.fillStyle(0x000000, 0.15);
        this.graphics.fillRect(0, 0, 360, 740);

        let that = this;
        this.fadeIn(function () {
            that.input.on("pointerdown", that.bindFn(that.exitPopup));
            that.input.keyboard.on('keydown-SPACE', that.bindFn(that.exitPopup));
        });

        this.text = this.add.rexTagText(180, 200, data.text, {
            fontFamily: 'Teko',
            fontSize: "20pt",
            color: "#000",
            halign: 'center',
            wrap: {
                mode: "word",
                width: 280
            }
        });
        this.text.setDepth(5).setOrigin(0.5);
        this.rectangle = this.add.rectangle(180, 200, 300, this.text.height + 10, 0xffffff);
        this.rectangle.setOrigin(0.5);
        this.rectangle.setStrokeStyle(2, 0x000000, 1);
        this.rectangle.setDepth(4);
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
     * Fade in camera scene
     * @param {function} [callback=null] - should be called when done fading in
     */
    fadeIn(callback=null) {
        let currentAlpha = this.camera.alpha;
        if (currentAlpha == 0) {
            currentAlpha = 0.01;
        }
        let newAlpha = currentAlpha * 1.5;
        if (newAlpha > 0.999) {
            this.camera.clearAlpha();
            if (callback != null) {
                callback();
            }
        } else {
            this.camera.setAlpha(newAlpha);
            let that = this;
            this.time.addEvent({
                delay: 40,
                callback: function () {
                    that.fadeIn(callback);
                },
                loop: false
            });
        }
    }

    /**
     * Exit the popup by resuming the level and stopping the popup display scene
     * @param {Phaser.Input.InputPlugin} inputPlugin - input
     * @param {Phaser.Input.Pointer} pointer - The pointer
     * @param {Phaser.GameObjects} objClicked - the object clicked
     */
    exitPopup(inputPlugin, pointer, objClicked) {
        this.manager.level.scene.resume();
        this.scene.stop();
    }
}

export default PopupDisplayScene;
