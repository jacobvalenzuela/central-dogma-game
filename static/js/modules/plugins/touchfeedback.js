class TouchFeedback extends Phaser.Plugins.ScenePlugin {
    constructor (scene, pluginManager) {
        super(scene, pluginManager);
    }

    boot() {
        this.scene.events.on("start", this.bindFn(this.start));
    }

    start() {
        this.scene.input.on("pointerdown", this.bindFn(this.startFeedBack));
        this.scene.input.on("pointermove", this.bindFn(this.moveFeedBack));

        this.rateLimitHit = false;
    }

    startFeedBack(inputPlugin, pointer, objClicked) {
        this.createGrowingCir(pointer.x, pointer.y);
        this.createParticles(pointer.x, pointer.y, 5);
    }

    moveFeedBack(inputPlugin, pointer, objHovered) {
        if (pointer.primaryDown && !this.rateLimitHit) {
            this.rateLimitHit = true;
            this.createParticles(pointer.x, pointer.y, 1);
            this.resetRateLimit();
        }
    }

    resetRateLimit() {
        let that = this;
        this.scene.time.addEvent({
            delay: 90,
            loop: false,
            callback: function () {
                that.rateLimitHit = false;
            },
        });
    }

    createGrowingCir(x, y) {
        let img = this.scene.add.image(x, y, "touch_feedback_circle").setScale(0.05).setAlpha(0.75).setDepth(10000);
        this.grow(img);
        this.fadeOut(img);
    }

    createParticles(x, y, amt) {
        let touchFeedbackPartConf = {
            x: 0,
            y: 0,
            speed: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.3, end: 0 },
            active: false,
            lifespan: 800
        }
        let partGr = this.scene.add.particles("touch_feedback_green_spark").createEmitter(touchFeedbackPartConf);
        partGr.manager.setDepth(10000);
        let partYell = this.scene.add.particles("touch_feedback_yellow_spark").createEmitter(touchFeedbackPartConf);
        partYell.manager.setDepth(10000);

        partGr.setPosition(x, y);
        partYell.setPosition(x, y);
        partGr.resume();
        partYell.resume();
        partGr.explode(amt);
        partYell.explode(amt);
    }

    grow(img) {
        if (img.scale >= 0.35) {
            return;
        } else {
            let scale = img.scale + 0.015;
            img.setScale(scale);
            let that = this;
            this.scene.time.addEvent({
                delay: 10,
                loop: false,
                callback: function () {
                    that.grow(img);
                },
            });
        }
    }

    fadeOut(img) {
        if (img.alpha <= 0) {
            img.destroy();
        } else {
            let alpha = img.alpha - 0.02;
            img.setAlpha(alpha);
            let that = this;
            this.scene.time.addEvent({
                delay: 10,
                loop: false,
                callback: function () {
                    that.fadeOut(img);
                },
            });
        }
    }

    bindFn(fn) {
        let clas = this;
        return function (...args) {
            let event = this;
            fn.bind(clas, event, ...args)();
        };
    }
}

export default TouchFeedback;
