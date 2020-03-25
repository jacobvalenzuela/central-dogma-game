import TouchFeedback from "./plugins/touchfeedback.js";
import ListLevels from "./scene/listlevels.js";
import PreLevelStage from "./scene/prelevelstage.js";
import TitleScreen from "./scene/titlescreen.js";
import LevelStage from "./scene/levelstage.js";
import PauseScreen from "./scene/pause.js";
import AboutScreen from "./scene/about.js";
import CountdownResumeScreen from './scene/countdownResume.js';
import QuizScreen from './scene/quiz.js';
import LoginScreen from './scene/loginscreen.js';
import LogoScreen from './scene/logoscreen.js';

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
        this.GLOBAL = {
            SCORE: 0, // Overall score as an Int
            ACTIVE_EFFECTS: true, // Boolean to indicate whether the player is playing with effects (screen shake/flash)
            ACTIVE_EDUCATION: true, // Boolean to indicate whether the player is playing with quizzes enabled
            QUIZ_RESULTS: [], // Array of "quiz" objects
            LEVEL_PERFORMANCE: [] // Array of "level" objects
        };
        this.sessionID = "";
        this.userName = "";

        
        // QUIZ_RESULTS is an array of "quiz" objects:
        /*
            {
                timestamp, String, // timestamp when question is asked
                question: Object, // the question object
                attempts: Int, // how many choices did the user pick (including correct answers)
                questionNum: Int // how many questions have already been asked (including this one)
            }
        */

        // example question object for above
        /*
            {
                type: String, // the type of question (either "drag and drop" or "multiple choice")
                score: Int, // How much was this quiz question worth
                prompt: String, // The question prompt
                options: Array of Strings, // all the possible choices
                correct: Int, // The index in the options array that is the correct answer
            }
        */

        // LEVEL_PERFORMANCE is an array of "level" objects:
        /*
            {
                timestamp, String, // timestamp when level was finished
                level: Int, // what number level is this in the campaign
                process: String, // what process of DNA replication was being played?
                lvlType: String, // what type of level was this ("dna_replication" vs "codon_transcription"
                speed: Int, // speed of the level,
                score: Int, // the score they got for this level
                rotateNT: Boolean, // was this level a rotational level?
                missed: Int, // how many objects were missed
                correct: Int, // how many objects were correct
                error: Int, // how many objects were errored
                total: Int, // how many objects were in the total sequence
                levelNum: Int // how many levels were already completed (including this one)
            }
        */

        /*
            I need these functions:
            SignIn(userName, sessionID) - Signs into the user account within a session.
            No returns
                userName - String - The username is a combination of an adjective, color, and animal.
                sessionID - String - The name of the session.

            SignOut(userName, sessionID) - Signs out of a user account within a session.
            No returns
                userName - String - The username is a combination of an adjective, color, and animal.
                sessionID - String - The name of the session.

            isUserSignedIn(userName, sessionID) - Checks if the given username is already signed in.
            Returns a boolean
                userName - String - The username is a combination of an adjective, color, and animal.
                sessionID - String - The name of the session.

            StoreNewGlobalVariable(userName, sessionID, GLOBAL) - Stores a new global object (see above) for the user.
            No returns  
                userName - String - The username is a combination of an adjective, color, and animal.
                sessionID - String - The name of the session.
                GLOBAL - Object - An object containing all the data about this current game instance.

            GetTotalLeaderboard(sessionID, Parameter1, rows) - Gets a leaderboard based on given parameter for a session.
            Returns an array of objects which look like {userName: String, value: Int}
                sessionID - String - The name of the session. Optional variable- if excluded, will get a global leaderboard across all sessions.
                Parameter1 - String - What to order by in DESC order
                                      Can either be "score" (the total global scores of a single user across all game instances)
                                      Or "levelsCompleted" (the total "level" objects of a single user across all game instances)
                                      Or "quizzesCompleted" (the total "quiz" objects of a single user across all game instances)
                rows - Int - How many objects to return

            GetLevelLeaderboard(sessionID, level, rows) - Gets a leaderboard of scores for a level in a session.
            Returns an array of objects which look like {userName: String, value: Int}
                sessionID - String - The name of the session. Optional variable- if excluded, will get a global leaderboard across all sessions.
                level - Int - What level to look for (in the "level" object)
                rows - Int - How many objects to return
        */

        /*
            I need these fake functions to test/develop stuff
            isUserSignedIn(userName, sessionID) - Can just return true all the time, I just want it to write as a placeholder.
            StoreNewGlobalVariable(userName, sessionID, GLOBAL) - Doesn't actually have to do anything, probably just going to write it as a placeholde.r
            GetTotalLeaderboard(sessionID, Parameter1, rows)
            GetLevelLeaderboard(sessionID, level, rows)
        */


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
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
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
        
        let bbcodepluginurl = "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js";
        this.game.load.plugin("rexbbcodetextplugin", bbcodepluginurl, true);

        this.game.load.image("touch_feedback_circle", "static/img/touch_feedback/circle.png");
        this.game.load.image("touch_feedback_green_spark", "static/img/touch_feedback/green_sparkle.png");
        this.game.load.image("touch_feedback_yellow_spark", "static/img/touch_feedback/yellow_sparkle.png");

        // User Interface Related
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
        this.game.load.image("logo_isb_white", "static/img/ISB_Logo_white.png");
        this.game.load.image("play_btn", "static/img/playBtn.png");
        this.game.load.image("home_btn", "static/img/homeBtn.png");
        this.game.load.image("back_btn", "static/img/backBtn.png");
        this.game.load.image("levels_btn", "static/img/levelsBtn.png");
        this.game.load.image("bg", "static/img/bg.png");
        this.game.load.image("bg_ingame", "static/img/bg_ingame.png");
        this.game.load.svg("signin_user_icn", "static/img/sign_in/user-solid.svg");
        this.game.load.image("right_arrow_btn", "static/img/rightArrowBtn.png");
        this.game.load.image("left_arrow_btn", "static/img/leftArrowBtn.png");
        this.game.load.image("go_btn", "static/img/goBtn.png");
        this.game.load.image("effect_disable_btn", 'static/img/effectDisableBtn.png');
        this.game.load.image("pause_btn", "static/img/pauseBtn.png");
        this.game.load.image("resume_btn", "static/img/resumeBtn.png");
        this.game.load.image("next_btn", "static/img/nextBtn.png");
        this.game.load.image("education_disable_btn", "static/img/educationDisableBtn.png");
        this.game.load.image("leadererboard_btn", "static/img/leaderboard.png");
        this.game.load.image("profile_btn", "static/img/signin.png");
        this.game.load.image("credits_btn", "static/img/CreditsBtn.png");
        this.game.load.image("submit_btn", "static/img/submitBtn.png");
        this.game.load.image("signout_btn", "static/img/signoutBtn.png");

        // Icons
        this.game.load.image("rotateIcon", "static/img/rotateIcon.png");
        this.game.load.image("swipeIcon", "static/img/swipeIcon.png");
        this.game.load.image("tapIcon", "static/img/tapIcon.png");

        // ADENINE
        this.game.load.image("nt_adenine_backbone", "static/img/nucleotide/adenine/Adenine_Backbone@3x.png");
        this.game.load.image("nt_adenine_basic", "static/img/nucleotide/adenine/Adenine_basic@3x.png");

        this.game.load.spritesheet("nt_adenine_basic_animated",
            "static/img/nucleotide/adenine/Adenine_basic_animated.png",
            { frameWidth: 600, frameHeight: 300 }
        );

        this.game.load.image("nt_adenine_hbonds", "static/img/nucleotide/adenine/Adenine_Hbonds@3x.png");

        // THYMINE
        this.game.load.image("nt_thymine_backbone", "static/img/nucleotide/thymine/Thymine_Backbone@3x.png");
        this.game.load.image("nt_thymine_basic", "static/img/nucleotide/thymine/Thymine_basic@3x.png");

        this.game.load.spritesheet("nt_thymine_basic_animated", 
            "static/img/nucleotide/thymine/Thymine_basic_animated.png",
            { frameWidth: 600, frameHeight: 300 }
        );

        this.game.load.image("nt_thymine_hbonds", "static/img/nucleotide/thymine/Thymine_Hbonds@3x.png");

        // CYTOSINE
        this.game.load.image("nt_cytosine_backbone", "static/img/nucleotide/cytosine/Cytosine_Backbone@3x.png");
        this.game.load.image("nt_cytosine_basic", "static/img/nucleotide/cytosine/Cytosine_basic@3x.png");
        this.game.load.image("nt_cytosine_hbonds", "static/img/nucleotide/cytosine/Cytosine_Hbonds@3x.png");

        this.game.load.spritesheet("nt_cytosine_basic_animated", 
            "static/img/nucleotide/cytosine/Cytosine_basic_animated.png",
            { frameWidth: 600, frameHeight: 300 }
        );

        // URACIL
        this.game.load.spritesheet("nt_uracil_basic_animated", 
            "static/img/nucleotide/uracil/Uracil_basic_animated.png",
            { frameWidth: 600, frameHeight: 300 }
        );

        // GUANINE
        this.game.load.image("nt_guanine_backbone", "static/img/nucleotide/guanine/Guanine_Backbone@3x.png");
        this.game.load.image("nt_guanine_basic", "static/img/nucleotide/guanine/Guanine_basic@3x.png");
        this.game.load.image("nt_guanine_hbonds", "static/img/nucleotide/guanine/Guanine_Hbonds@3x.png");

        this.game.load.spritesheet("nt_guanine_basic_animated", 
            "static/img/nucleotide/guanine/Guanine_basic_animated.png",
            { frameWidth: 600, frameHeight: 300 }
        );

        // Errortides and Missingtides
        this.game.load.image("errortide_purine", "static/img/errortide/purine_error.png");
        this.game.load.image("errortide_pyrimidine", "static/img/errortide/pyrimidine_error.png");
        this.game.load.image("missingtide_purine", "static/img/missingtide/purine_missing.png");
        this.game.load.image("missingtide_pyrimidine", "static/img/missingtide/pyrimidine_missing.png");

        // Particles
        this.game.load.image("ntparticle_adenine", "static/img/nucleotide_particle/adenine_particle.png");
        this.game.load.image("ntparticle_cytosine", "static/img/nucleotide_particle/cytosine_particle.png");
        this.game.load.image("ntparticle_guanine", "static/img/nucleotide_particle/guanine_particle.png");
        this.game.load.image("ntparticle_thymine", "static/img/nucleotide_particle/thymine_particle.png");
        this.game.load.image("ntparticle_white", "static/img/nucleotide_particle/white_particle.png");

        // Codons
        this.game.load.svg("codontide_adenine", "static/img/codontide/a_codon.svg");
        this.game.load.svg("codontide_cytosine", "static/img/codontide/c_codon.svg");
        this.game.load.svg("codontide_guanine", "static/img/codontide/g_codon.svg");
        this.game.load.svg("codontide_uracil", "static/img/codontide/u_codon.svg");

        // Codons Level
        this.game.load.image("bindingsite", "static/img/bindingsite.png");

        // Binding Pocket
        this.game.load.image("bindingpocket", "static/img/bindingpocket.png");

        // Adding Game Scenes
        this.game.scene.add("listlevels", ListLevels, false, {gameObj: this, levels: this.levels});
        for (let i = 0; i < this.levels.length; i++) {
            let level = this.levels[i];
            this.game.scene.add("levelpre" + i, PreLevelStage, false, {gameObj: this, lvlNum: i, level: level});
            this.game.scene.add("level" + i, LevelStage, false, {gameObj: this, lvlNum: i, level: level});
        }
        this.game.scene.add("pauseScreen", PauseScreen, false, {gameObj: this, levels: this.levels});
        this.game.scene.add("aboutScreen", AboutScreen, false, {gameObj: this, levels: this.levels});
        this.game.scene.add("countdownResumeScreen", CountdownResumeScreen, false, {gameObj: this, levels: this.levels});
        this.game.scene.add("quizScreen", QuizScreen, false, {gameObj: this, levels: this.levels});
        this.game.scene.add("titlescreen", TitleScreen, false, {gameObj: this, levels: this.levels});
        this.game.scene.add("loginScreen", LoginScreen, false, {gameObj: this, levels: this.levels});

        // JSON
        this.game.load.json("quizQuestions", "static/json/quizquestions.json");

        // HTML
        this.game.load.html("html_login", "static/html/login.html");
        this.game.load.html("html_register", "static/html/register.html");
        this.game.load.html("html_sessions", "static/html/sessions.html");
        this.game.load.html("html_sessionmgr", "static/html/sessionmgr.html");
        this.game.load.html("html_sequencedinfo", "static/html/sequencedinfo.html");
        this.game.load.html("html_knowledgepanel", "static/html/knowledgepanel.html");
        this.game.load.html("html_quiz", "static/html/quiz.html");
        this.game.load.html("html_levelleaderboard", "static/html/levelleaderboard.html");

        // Sound Effects
        this.game.load.audio("incorrect", "static/audio/sounds/Incorrect.wav");
        this.game.load.audio("correct", "static/audio/sounds/Correct.wav");
        this.game.load.audio("dialog_open", "static/audio/sounds/DialogOpen.wav");
        this.game.load.audio("dialog_close", "static/audio/sounds/DialogClose.wav");
        this.game.load.audio("click", "static/audio/sounds/Click.wav");
        this.game.load.audio("win", "static/audio/sounds/Win.wav");

        // Music
        this.game.load.audio("bgmusic1", "static/audio/music/shinyTech2.mp3");
        this.game.load.audio("bgmusic2", "static/audio/music/Familiar.mp3");
        this.game.load.audio("bgmusic3", "static/audio/music/Tribulation.mp3");
        
        // Level Carousel Selector Images
        this.game.load.image("level1", "static/img/levelCarouselImages/1.png");
        this.game.load.image("level2", "static/img/levelCarouselImages/2.png");
        this.game.load.image("level3", "static/img/levelCarouselImages/3.png");

        // Etc.
        this.game.load.image("fluff", "static/img/fluff.png");
        this.game.load.image("fluff_dark", "static/img/fluff_dark.png");
    
    }

    /**
     * Creates the title screen and starts it.
     */
    create() {
        /*
        this.game.scene.add("titlescreen", TitleScreen, true, {
            gameObj: this
        });
        */
        
        this.game.scene.add("logoScreen", LogoScreen, true, {gameObj: this, levels: this.levels});

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
