import PopupDisplayScene from "./scene/popupdisplayscene.js";

class PopupManager {
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
    }

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

    displayPopup(eventType, values) {
        let rendered = Mustache.render(this.popupsConfig[eventType], values);
        let sceneName = "popupDisplay" + this.popupCnt;
        let levelSceneName = "level" + this.level.level;
        this.level.scene.add(sceneName, PopupDisplayScene, false, {text: rendered, manager: this});
        let that = this;
        this.level.time.addEvent({
            delay: 300,
            loop: false,
            callback: function () {
                that.level.scene.launch(sceneName);
                that.level.scene.pause();
                that.level.scene.moveAbove(levelSceneName, sceneName);
            }
        });
        this.popupCnt++;
    }

    destroy() {
        for (let i = 0; i < this.popupCnt; i++) {
            this.level.scene.remove("popupDisplay" + i);
        }
    }
}

export default PopupManager;
