class PreLevelStage extends Phaser.Scene {
    constructor (config) {
        super(config);
    }

    init(data) {
        this.level = data.gameObj.levels[data.lvlNum];

        this.camera = this.cameras.main;
        this.graphics = this.add.graphics();

        this.graphics.fillStyle(0x000, 1.0);
        this.graphics.fillRect(0, 0, 360, 740);

        let lvlNumTxt = this.add.text(120, 250, "Level " + (data.lvlNum + 1), 
            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '30pt', color: '#fff'});
        lvlNumTxt.setPosition((360 - lvlNumTxt.width) / 2, 250);

        let lvlName = this.add.text(0, 310, this.level.name, 
            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '20pt', color: '#fff'});
        lvlName.setPosition((360 - lvlName.width) / 2, 310);

        this.scene.launch("level" + data.lvlNum);
        this.scene.moveAbove("level" + data.lvlNum, "levelpre" + data.lvlNum);

        let that = this;
        this.time.addEvent({
            delay: 3000,
            loop: false,
            callback: function () {
                that.fadeOut();
            }
        });
    }

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
}

export default PreLevelStage;
