class PopupDisplayScene extends Phaser.Scene {
    constructor (config) {
        super(config);
    }

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
        });

        this.text = this.add.rexTagText(180, 200, data.text, {
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: "18pt",
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
        this.rectangle.setStrokeStyle(5, 0x000000, 1);
        this.rectangle.setDepth(4);
    }

    bindFn(fn) {
        let clas = this;
        return function (...args) {
            let event = this;
            fn.bind(clas, event, ...args)();
        };
    }

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

    exitPopup(inputPlugin, pointer, objClicked) {
        this.manager.level.scene.resume();
        this.scene.stop();
    }
}

export default PopupDisplayScene;
