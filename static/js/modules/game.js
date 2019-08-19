import TouchFeedback from "./plugins/touchfeedback.js";
import ListLevels from "./scene/listlevels.js";
import PreLevelStage from "./scene/prelevelstage.js";
import TitleScreen from "./scene/titlescreen.js";
import LevelStage from "./scene/levelstage.js";

/**
 * Class representing the game object. Handles the creation of the basic
 * game in a canvas element using WebGL renderer.
 */
class Game {
    /**
     * Creates a Game.
     * @param {LevelJSONDefinition} levels 
     */
    constructor (levels) {
        this.config = {
            type: Phaser.WEBGL,
            // canvas: document.getElementsByTagName("canvas")[0],
            // parent: document.getElementsByTagName("main")[0],
            dom: {
                createContainer: true,
            },
            scale: {
                parent: "game",
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 360,
                height: 740,
            },
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
     * Preloads the game by registering plugins and load assets. Also registers
     * the levels defined in the game config.
     * @param {Phaser.Game} gameObj - The game instance from Phaser
     */
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

        this.game.load.svg("signin_signin_icn", "static/img/sign_in/sign-in-alt-solid.svg");
        this.game.load.svg("signin_user_icn", "static/img/sign_in/user-solid.svg");
        
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

        this.game.load.svg("codontide_adenine", "static/img/codontide/a_codon.svg");
        this.game.load.svg("codontide_cytosine", "static/img/codontide/c_codon.svg");
        this.game.load.svg("codontide_guanine", "static/img/codontide/g_codon.svg");
        this.game.load.svg("codontide_uracil", "static/img/codontide/u_codon.svg");

        this.game.scene.add("listlevels", ListLevels, false, {levels: this.levels});
        for (let i = 0; i < this.levels.length; i++) {
            let level = this.levels[i];
            this.game.scene.add("levelpre" + i, PreLevelStage, false, {gameObj: this, lvlNum: i, level: level});
            this.game.scene.add("level" + i, LevelStage, false, {gameObj: this, lvlNum: i, level: level});
        }

        this.game.load.html("html_login", "static/html/login.html");
        this.game.load.html("html_register", "static/html/register.html");
        this.game.load.html("html_sessions", "static/html/sessions.html");
        this.game.load.html("html_sessionmgr", "static/html/sessionmgr.html");
    }

    /**
     * Creates the title screen and starts it.
     */
    create() {
        this.game.scene.add("titlescreen", TitleScreen, true, {
            "gameObj": this
        });

        // let singleLvl = new LevelStage(this, this.level);
        // let titleScreen = new TitleScreen(this);
    }

    /**
     * Nothing.
     */
    startGame() {
        // let singleLvl = new LevelStage(this, this.level);
        
    }
}

export default Game;
