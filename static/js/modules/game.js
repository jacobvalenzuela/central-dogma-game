import TouchFeedback from "./plugins/touchfeedback.js";
import ListLevels from "./scene/listlevels.js";
import PreLevelStage from "./scene/prelevelstage.js";
import TitleScreen from "./scene/titlescreen.js";
import LevelStage from "./scene/levelstage.js";

class Game {
    constructor (levels) {
        this.config = {
            type: Phaser.WEBGL,
            canvas: document.getElementsByTagName("canvas")[0],
            width: 360,
            height: 740,
            backgroundColor: "#fff",
            plugins: {
                scene: [
                    {
                        key: "TouchFeedback",
                        plugin: TouchFeedback,
                        start: true,
                        mapping: "touchFeedback"
                    }
                ]
            },
            scene: {
                preload: this.bindFn(this.preload),
                create: this.bindFn(this.create),
            }
        }
        this.levels = levels;
        this.level = 0;
    }

    bindFn(fn) {
        let clas = this;
        return function (...args) {
            let event = this;
            fn.bind(clas, event, ...args)();
        };
    }

    preload(gameObj) {
        this.game = gameObj;

        // load plugins
        this.game.load.plugin("rextagtextplugin", "static/vendor/js/rextagtextplugin.min.js", true);

        this.game.load.image("touch_feedback_circle", "static/img/touch_feedback/circle.png");
        this.game.load.image("touch_feedback_green_spark", "static/img/touch_feedback/green_sparkle.png");
        this.game.load.image("touch_feedback_yellow_spark", "static/img/touch_feedback/yellow_sparkle.png");

        this.game.load.image("logo_dogma", "static/img/DOGMA_logo.png");
        this.game.load.spritesheet(
            "logo_dogma_intro",
            "static/img/DOGMA_logo_intro.png",
            {
                frameWidth: 277,
                frameHeight: 166.25,
            }
        );
        this.game.load.image("logo_isb", "static/img/ISB_Logo.png");
        this.game.load.image("play_btn", "static/img/playBtn.png");
        this.game.load.image("home_btn", "static/img/homeBtn.png");
        
        this.game.load.image("nt_adenine_backbone", "static/img/nucleotide/adenine/Adenine_Backbone@3x.png");
        this.game.load.image("nt_adenine_basic", "static/img/nucleotide/adenine/Adenine_basic@3x.png");
        this.game.load.image("nt_adenine_hbonds", "static/img/nucleotide/adenine/Adenine_Hbonds@3x.png");

        this.game.load.image("nt_thymine_backbone", "static/img/nucleotide/thymine/Thymine_Backbone@3x.png");
        this.game.load.image("nt_thymine_basic", "static/img/nucleotide/thymine/Thymine_basic@3x.png");
        this.game.load.image("nt_thymine_hbonds", "static/img/nucleotide/thymine/Thymine_Hbonds@3x.png");

        this.game.load.image("nt_cytosine_backbone", "static/img/nucleotide/cytosine/Cytosine_Backbone@3x.png");
        this.game.load.image("nt_cytosine_basic", "static/img/nucleotide/cytosine/Cytosine_basic@3x.png");
        this.game.load.image("nt_cytosine_hbonds", "static/img/nucleotide/cytosine/Cytosine_Hbonds@3x.png");

        this.game.load.image("nt_guanine_backbone", "static/img/nucleotide/guanine/Guanine_Backbone@3x.png");
        this.game.load.image("nt_guanine_basic", "static/img/nucleotide/guanine/Guanine_basic@3x.png");
        this.game.load.image("nt_guanine_hbonds", "static/img/nucleotide/guanine/Guanine_Hbonds@3x.png");

        this.game.load.image("errortide_purine", "static/img/errortide/purine_error.png");
        this.game.load.image("errortide_pyrimidine", "static/img/errortide/pyrimidine_error.png");

        this.game.load.image("missingtide_purine", "static/img/missingtide/purine_missing.png");
        this.game.load.image("missingtide_pyrimidine", "static/img/missingtide/pyrimidine_missing.png");

        this.game.load.image("ntparticle_adenine", "static/img/nucleotide_particle/adenine_particle.png");
        this.game.load.image("ntparticle_cytosine", "static/img/nucleotide_particle/cytosine_particle.png");
        this.game.load.image("ntparticle_guanine", "static/img/nucleotide_particle/guanine_particle.png");
        this.game.load.image("ntparticle_thymine", "static/img/nucleotide_particle/thymine_particle.png");

        this.game.scene.add("listlevels", ListLevels, false, {levels: this.levels});
        for (let i = 0; i < this.levels.length; i++) {
            let level = this.levels[i];
            this.game.scene.add("levelpre" + i, PreLevelStage, false, {gameObj: this, lvlNum: i, level: level});
            this.game.scene.add("level" + i, LevelStage, false, {gameObj: this, lvlNum: i, level: level});
        }
    }

    create() {
        this.game.scene.add("titlescreen", TitleScreen, true, {
            "gameObj": this
        });

        // let singleLvl = new LevelStage(this, this.level);
        // let titleScreen = new TitleScreen(this);
    }

    startGame() {
        // let singleLvl = new LevelStage(this, this.level);
        
    }
}

export default Game;
