import PopupDisplayScene from "./scene/popupdisplayscene.js";

/**
 * Class representing the popup manager
 */
class PopupManager {
    /**
     * Creates a popup manager
     * @param {LevelStage} level - the level that the popups should belong to
     */
    constructor(level) {
        this.level = level;
        this.popupCnt = 0;

        this.popupsConfig = this.level.levelConfig.popups;
        if (!this.popupsConfig) {
            this.popupsConfig = {};
        }

        let popupsKeys = Object.keys(this.popupsConfig);
        for (let i = 0; i < popupsKeys.length; i++) {
            let key = popupsKeys[i];
            let val = this.popupsConfig[key];
            Mustache.parse(val);
        }

        this.firstCorrectMatchHappened = false;
        this.error5MatchCount = 0;
        this.introHappened = false;
    }

    /**
     * Emits an event
     * @param {string} eventType - the event to be emitted
     * @param {...*} parameters - parameters to pass onto the event handler
     */
    emitEvent(eventType) {
        if (!(eventType in this.popupsConfig)) {
            return;
        }
        let fn = this["on_" + eventType];
        if (!fn) {
            console.error(eventType + " event type is not defined for the popup manager");
            return;
        } else {
            fn = fn.bind(this);
        }
        fn(...Array.from(arguments).slice(1));
    }


    /**
     * An initial popup message for giving directions or more introduction.
     */
    on_intro() {
        if (this.introHappened) {
            return;
        }
        this.introHappened = true;
        this.displayPopup(
            "intro",
            {}
        );
    }

    /**
     * Should be emitted on correct matches. Except the popup will only show on the first time that
     * the player has made a correct match.
     * @param {Nucleotide} nucleotide1 - The left nucleotide
     * @param {Nucleotide} nucleotide2 - The right nucleotide
     */
    on_firstCorrectMatch(nucleotide1, nucleotide2) {
        if (this.firstCorrectMatchHappened) {
            return;
        }
        this.firstCorrectMatchHappened = true;
        nucleotide1 = nucleotide1.toJSON();
        nucleotide2 = nucleotide2.toJSON();
        this.displayPopup(
            "firstCorrectMatch",
            {
                "nucleotide1": nucleotide1,
                "nucleotide2": nucleotide2,
            }
        );
    }

    /**
     * Displays a popup telling students that the two nucleotides should be the correct answer.
     * @param {Nucleotide} nucleotide1 - The left nucleotide
     * @param {Nucleotide} nucleotide2 - The right nucleotide
     */
    on_errorMatch(nucleotide1, nucleotide2) {
        nucleotide1 = nucleotide1.toJSON();
        nucleotide2 = nucleotide2.toJSON();
        this.displayPopup(
            "errorMatch",
            {
                "nucleotide1": nucleotide1,
                "nucleotide2": nucleotide2,
            }
        );
    }

    /**
     * Displays a popup telling students that the two NT should be the correct answer. Should be invoked
     * on every error. Every 5th error will result in popup however.
     * @param {Nucleotide} nucleotide1 - The left nucleotide
     * @param {Nucleotide} nucleotide2 - The right nucleotide
     */
    on_error5Match(nucleotide1, nucleotide2) {
        this.error5MatchCount++;
        if ((this.error5MatchCount - 1) % 5 != 0) {
            return;
        }
        nucleotide1 = nucleotide1.toJSON();
        nucleotide2 = nucleotide2.toJSON();
        this.displayPopup(
            "error5Match",
            {
                "nucleotide1": nucleotide1,
                "nucleotide2": nucleotide2,
            }
        );
    }

    /**
     * Displays the corresponding popup by rendering a template and using it for the popup.
     * @param {string} eventType - The type of event that just got fired
     * @param {JSON} values - The values that should be used to render the event template string
     */
    displayPopup(eventType, values, callback=null) {
        let rendered = Mustache.render(this.popupsConfig[eventType], values);
        let sceneName = "popupDisplay" + this.popupCnt;
        let levelSceneName = "level" + this.level.level;
        this.level.scene.add(sceneName, PopupDisplayScene, false, {text: rendered, manager: this});
        let that = this;
        this.level.time.addEvent({
            delay: 200,
            loop: false,
            callback: function () {
                that.level.scene.launch(sceneName);
                that.level.scene.pause();
                that.level.scene.moveAbove(levelSceneName, sceneName);
            }
        });
        this.popupCnt++;
    }

    /**
     * Deletes all popups that this manager has ever created for the game.
     */
    destroy() {
        for (let i = 0; i < this.popupCnt; i++) {
            this.level.scene.remove("popupDisplay" + i);
        }
    }
}

export default PopupManager;
