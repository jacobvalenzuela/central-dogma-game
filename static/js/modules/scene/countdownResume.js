/**
 * Represents the level stage scene
 * @extends Phaser.Scene
 */
class CountdownResumeScreen extends Phaser.Scene {

    /**
     * Creates a countdown screen scene.
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
        console.log("COUNTDOWN SCREEN DATA");
        console.log(data);

        var gra = this.add.graphics();
        gra.fillStyle(0x000000, 0.50);
        gra.fillRect(0, 0, 360, 740);

        let curTime = 3;
        let text = this.add.text(165, 150, curTime, 
        {fontFamily: 'Teko, sans-serif', fontSize: '120pt', color: '#FFFFFF'}).setDepth(1);

        let that = this;
        this.time.addEvent({
            delay: 1100,
            loop: true,
            callback: function() {
                curTime = curTime - 1;
                if (curTime == 0) {
                    that.scene.resume("level" + data.level);
                    that.scene.stop();
                } else {
                    text.setText(curTime);
                }
            }
        });
    }  
}

export default CountdownResumeScreen;