class GameScore {
    constructor (game) {
        this.initialized = false;
        this.game = game;
        this.sequencesMade = 0;
        this.secondsElapsed = 0;
        this.wrongSequences = 0;
        this.timerSec = null;
        this.timerMs = null;
        this.initialNTCount = this.game.levelConfig.ntSequence.length;
    }

    init() {
        this.initialized = true;
        this.sequenceNTsTxt = this.game.add.text(50, 80, "0", 
            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '18pt', color: '#000'}).setOrigin(0.5);
        this.updateSequenceNTs();
        let rate = this.getRate();
        this.rateTxt = this.game.add.text(140, 80, rate, 
            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '18pt', color: '#000'}).setOrigin(0.5);
        this.accuracyTxt = this.game.add.text(222, 80, "100%", 
            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '18pt', color: '#000'}).setOrigin(0.5);
        this.scoreTxt = this.game.add.text(307, 80, "0", 
            {fontFamily: '\'Open Sans\', sans-serif', fontSize: '18pt', color: '#000'}).setOrigin(0.5);
    }

    start() {
        if (!this.initialized) {
            console.error("GameScore instance has not been initialized yet!");
        }
        this.timerSec = this.game.time.addEvent({
            delay: 1000,
            callback: this.bindFn(this.tickSec),
            loop: true
        });
        this.timerMs = this.game.time.addEvent({
            delay: 50,
            callback: this.bindFn(this.tickMs),
            loop: true
        });
    }

    stop() {

    }

    tickMs() {
        this.updateSequenceNTs();
        this.updateScore();
        this.updateAccuracy();
    }

    updateSequenceNTs() {
        let count = this.getNTCount();
        this.sequenceNTsTxt.setText(count);
    }

    updateScore() {
        let score = this.getScore();
        this.scoreTxt.setText(score);
    }

    updateAccuracy() {
        this.accuracyTxt.setText(this.getAccuracy() + "%");
    }

    getNTCount() {
        return this.game.positionManager.getLevelNTCount();
    }

    getGameSpeed() {
        return this.game.levelConfig.speed;
    }


    tickSec() {
        this.secondsElapsed++;
    }

    bindFn(fn) {
        let clas = this;
        return function (...args) {
            let event = this;
            fn.bind(clas, event, ...args)();
        };
    }

    incrementIncorrectSequences() {
        this.wrongSequences++;
    }

    incrementSequencesMade() {
        this.sequencesMade++;
    }

    getRate() {
        // let minElapsed = Math.ceil(this.secondsElapsed / 60);
        // return Math.round(this.sequencesMade / minElapsed);
        let ntRate = Math.floor(1000 / this.getGameSpeed());
        return Math.min(ntRate, this.game.levelConfig.ntSequence.length);
    }

    getAccuracy() {
        let ntCnt = this.initialNTCount;
        return Math.round(((ntCnt - this.wrongSequences) / ntCnt) * 100);
    }

    getScore() {
        return this.sequencesMade * 100;
    }
}

export default GameScore;
