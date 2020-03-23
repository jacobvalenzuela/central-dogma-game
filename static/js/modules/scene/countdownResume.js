import AudioPlayer from "../audioplayer.js";

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

        let DELAY = 800;

        // Sound Effects
        this.audioplayer = new AudioPlayer();

        // Color Constants
        let ORANGE = 0xFE5832;
        let DARK_BLUE = 0x002664;
        let CYAN = 0x21EEE9;
        let BLUE = 0x006FFF;
        let WHITE = 0xFFFFFF;
        let DARKER_BLUE = 0x0e1e2d;

        var gra = this.add.graphics();
        gra.fillStyle(0x000000, 0.50);
        gra.fillRect(0, 0, 360, 740);

        this.add.text(55, 120, "GET READY", 
            {fontFamily: 'Teko, sans-serif', fontSize: '60pt', color: '#FFFFFF'}).setDepth(1);
        //this.add.rectangle(180, 160, 300, 75, ORANGE).setAlpha(1.0).setStrokeStyle(2, WHITE, 1);

        let curTime = 3;
        let text = this.add.text(155, 250, curTime, 
        {fontFamily: 'Teko, sans-serif', fontSize: '120pt', color: '#FFFFFF'}).setDepth(1);
        //this.add.rectangle(180, 320, 75, 150, ORANGE).setAlpha(1.0).setStrokeStyle(2, WHITE, 1);

        let that = this;
        this.time.addEvent({
            delay: DELAY,
            loop: true,
            callback: function() {
                curTime = curTime - 1;
                if (curTime == 0) {
                    that.audioplayer.playDialogCloseSound();
                    that.scene.resume("level" + data.level);
                    that.scene.stop();
                } else {
                    that.audioplayer.playClickSound();
                    text.setText(curTime);
                }
            }
        });
    }  
}

export default CountdownResumeScreen;