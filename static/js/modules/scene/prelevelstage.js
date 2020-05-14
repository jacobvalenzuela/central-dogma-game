/**
 * Represents the Pre Level Stage
 * @extends Phaser.Scene
 */
class PreLevelStage extends Phaser.Scene {
    /**
     * Creates a pre level stage scene
     * @param {Phaser.Types.Scenes.SettingsConfig} config 
     */
    constructor (config) {
        super(config);
    }

    /**
     * Displays the pre level stage with the name and level number
     * @param {JSON} data 
     */
    init(data) {
        this.lvlNum = data.lvlNum;
        this.level = data.gameObj.levels[data.lvlNum];

        this.camera = this.cameras.main;
        this.graphics = this.add.graphics();

        this.graphics.fillStyle(0x000, 1.0);
        this.graphics.fillRect(0, 0, 360, 740);

        let lvlNumTxtLabel = "";
        if (data.lvlNum >= 12) {
            lvlNumTxtLabel = "Bonus Level " + (data.lvlNum + 1);
        } else {
            lvlNumTxtLabel = "Level " + (data.lvlNum + 1);
        }
        let lvlNumTxt = this.add.text(120, 250, lvlNumTxtLabel, 
            {fontFamily: 'Teko', fontSize: '40pt', color: '#fff'});
        lvlNumTxt.setPosition((360 - lvlNumTxt.width) / 2, 250);

        /*
        let lvlName = this.add.text(0, 310, this.level.description, 
            {fontFamily: 'Teko', fontSize: '20pt', color: '#fff'});
        lvlName.setPosition((360 - lvlName.width) / 2, 310);
        */
        // In line style rendering with rexBBCodeText
        let lvlName = this.add.rexBBCodeText(180, 360, "", {
            fontFamily: 'Teko',
            fontSize: "30px",
            color: "#fff",
            halign: "center",
            wrap: {
                mode: "word",
                width: 300
            },
            lineSpacing: 0
        }).setOrigin(0.5, 0.5);
        lvlName.text = this.level.description;

        this.scene.launch("level" + data.lvlNum);
        this.scene.moveAbove("level" + data.lvlNum, "levelpre" + data.lvlNum);

        this.gameStarted = false;

        let that = this;
        this.time.addEvent({
            delay: 5000,
            loop: false,
            callback: this.bindFn(this.startGame),
        });

        this.input.on("pointerdown", this.bindFn(this.startGame));
    }

    startGame() {
        if (this.gameStarted) {
            return;
        }
        this.gameStarted = true;
        let that = this;
        this.fadeOut(function () {
            that.scene.manager.getScene("level" + that.lvlNum).start();
        });
    }

    /**
     * Fade out camera scene
     * @param {function} [callback=null] - should be called when done fading out
     */
    fadeOut(callback=null) {
        let currentAlpha = this.camera.alpha;
        let newAlpha = currentAlpha / 1.5;
        if (newAlpha < 0.001) {
            this.camera.setAlpha(0);
            if (callback != null) {
                callback();
            }
        } else {
            this.camera.setAlpha(newAlpha);
            let that = this;
            this.time.addEvent({
                delay: 40,
                callback: function () {
                    that.fadeOut(callback);
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
}

export default PreLevelStage;
