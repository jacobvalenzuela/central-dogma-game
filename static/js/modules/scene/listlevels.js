import AudioPlayer from "../audioplayer.js";

/**
 * Represents the list level scene
 * @extends Phaser.Scene
 */
class ListLevels extends Phaser.Scene {
    /**
     * Creates a list levels scene
     * @param {Phaser.Types.Scenes.SettingsConfig} config 
     */
    constructor(config) {
        super(config);
    }

    /**
     * Initalizes the list levels. Fades in and populate the level list
     * @param {JSON} data 
     */
    init(data) {
        console.log(data);
        this.data = data;
        // Initialization
        this.camera = this.cameras.main;
        this.camera.setAlpha(0);
        this.graphics = this.add.graphics();

        // Level Data
        this.levels = data.levels;


        this.curLevel = 0;

        // Background and Title
        this.add.text(26, 115, "- LEVEL SELECTION -",
            { fontFamily: 'Teko', fontSize: '40pt', color: '#000000' });

        this.graphics.fillStyle(0xFF8040, 0.4);
        this.graphics.fillRect(18, 177, 320, 50);

        this.graphics.fillStyle(0x006FFF, 0.4);
        this.graphics.fillRect(18, 237, 320, 50);

        // Sound Effects
        this.audioplayer = data.audio; // gets the audio player from title screen

        // Level Selection UI/Functionality
        this.leftLevelBtn = this.add.image(60, 640, "left_arrow_btn").setScale(0.25).setInteractive();
        this.rightLevelBtn = this.add.image(300, 640, "right_arrow_btn").setScale(0.25).setInteractive();
        this.goBtn = this.add.image(180, 640, "go_btn").setScale(0.40).setInteractive();
        this.backBtn = this.add.image(50, 707, "back_btn").setScale(0.30).setInteractive();
        this.signoutBtn = this.add.image(250, 707, "signout_btn").setScale(0.5).setInteractive();
        this.sessionbtn = this.add.image(235, 45, "leadererboard_btn").setScale(0.30).setAlpha(0);
        this.musicbtn = this.add.image(310, 45, "mutemusic_btn").setScale(0.30).setInteractive();

        if (!this.data.gameObj.GLOBAL.ACTIVE_MUSIC) {
            this.musicbtn.setAlpha(0.5);
        }

        this.greeting = this.add.text(20, 20, "",
            { fontFamily: 'Teko', fontSize: '28pt', color: '#000000' });
        this.usernameText = this.add.text(22, 55, "",
            { fontFamily: 'Teko', fontSize: '15pt', color: '#000000' });
        this.sessionText = this.add.text(22, 75, "",
            { fontFamily: 'Teko', fontSize: '15pt', color: '#000000' });

        // Leaderboard UI/ Greeting
        // Leaderboard and greeting will only appear as an option if you're signed in
        cdapi.isUserSignedIn(data.gameObj.userName, data.gameObj.SessionID).then(result => {
            if (result) {
                this.sessionbtn.setInteractive();
                this.sessionbtn.setAlpha(1.0)
                this.sessionbtn.addListener("pointerup", this.bindFn(() => {
                    this.showSessionLeaderboard(data.gameObj.userName, data.gameObj.sessionID, "score", 10)
                }));
                this.greeting.text = "Welcome, ";
                this.usernameText.text = data.gameObj.animalName;

                if (data.gameObj.sessionID == "") {
                    this.sessionText.text = "Session: " + "default session";
                } else {
                    this.sessionText.text = "Session: " + data.gameObj.sessionID;
                }

                
            } else {
                this.removeSignedInOnlyElements();
                localStorage.removeItem("username");
            }
        })

        // Music Button handler
        this.musicbtn.on("pointerdown", () => {
            this.audioplayer.playClickSound();
            this.data.gameObj.GLOBAL.ACTIVE_MUSIC = !this.data.gameObj.GLOBAL.ACTIVE_MUSIC
            if (this.data.gameObj.GLOBAL.ACTIVE_MUSIC) {
                this.musicbtn.setAlpha(1.0);
                this.audioplayer.MuteMusic(false);
            } else {
                this.musicbtn.setAlpha(0.5);
                this.audioplayer.MuteMusic(true);
            }
        });

        // Left and Right
        this.leftLevelBtn.on("pointerdown", () => {
            this.audioplayer.playClickSound();
            this.browseLeft();
        });

        this.rightLevelBtn.on("pointerdown", () => {
            this.audioplayer.playClickSound();
            this.browseRight();
        });

        // Go Button
        this.goBtn.on("pointerdown", () => {
            this.audioplayer.playClickSound();



            if (this.levels[this.curLevel].unlocked == true) {
                if (this.areTheseBonusLevels()) {
                    this.startPrelevel(this.curLevel + 12); // skips regular levels 
                } else {
                    this.startPrelevel(this.curLevel); // loads the normal level
                }

            }
        })

        // Back Button
        this.backBtn.on("pointerdown", () => {
            this.audioplayer.playClickSound();
            this.backButtondown();
        })

        // Signout Button
        this.signoutBtn.on("pointerdown", () => {
            this.audioplayer.playClickSound();
            cdapi.signout(data.gameObj.userName, data.gameObj.sessionID).then(result => {
                this.removeSignedInOnlyElements();
                localStorage.removeItem("username");
            });
        })

        // Level Selection Descriptors
        this.levelBrowseTitle = this.add.text(180, 203, "",
            { fontFamily: 'Teko', fontSize: '32pt', color: '#000000', align: 'center' }).setOrigin(0.5, 0.5);

        this.levelBrowseSubtitle = this.add.text(180, 263, "",
            { fontFamily: 'Teko', fontSize: '32pt', color: '#000000', align: 'center' }).setOrigin(0.5, 0.5);

        // In line style rendering with rexBBCodeText
        this.levelBrowseDesc = this.add.rexBBCodeText(20, 305, "", {
            fontFamily: 'Teko',
            fontSize: "28px",
            color: "#000000",
            halign: "left",
            wrap: {
                mode: "word",
                width: 300
            },
            lineSpacing: 0
        });

        // Images to accompany level descriptions
        this.levelBrowseImage = null;

        // Functionality to skip DOGMA animation, also fades in content.
        let that = this;
        this.fadeIn(function () {
            that.displayLevel(that.curLevel);
            //that.userbtn.addListener("pointerup", that.bindFn(that.onUserButtonClick));
        });

        this.domOverlay = null;
        this.fadeCover = this.add.rectangle(180, 370, 360, 740, 0x000000).setDepth(1000).setAlpha(0).setInteractive();
        this.fadeCover.addListener("pointerup", that.bindFn(that.dismissOverlay))


    }

    areTheseBonusLevels() {
        return (this.levels.length < 12)
    }

    removeSignedInOnlyElements() {
        // Removes leaderboard button
        this.sessionbtn.setAlpha(0);
        this.sessionbtn.setInteractive(false);

        // changes greeting
        this.usernameText.text = "";
        this.greeting.text = "Not Signed In";
        this.sessionText.text = "";

        // removes sign out button
        this.signoutBtn.setAlpha(0);
        this.signoutBtn.setInteractive(0);
    }

    updateSignInIcon() {
        if (cdapi.isLoggedIn()) {
            this.signInIcn.setVisible(false);
            this.userIcn.setVisible(true);
        } else {
            this.signInIcn.setVisible(true);
            this.userIcn.setVisible(false);
        }
    }

    onUserButtonClick() {
        if (!cdapi.isLoggedIn()) {
            this.showLoginOverlay();
        } else {
            this.showSessionsOverlay();
        }
    }


    // Actual leaderboard method I'm using
    showSessionLeaderboard(userName, sessionID, rows) {
        if (this.domOverlay) {
            return;
        }

        let html = document.createElement("html");
        html.innerHTML = this.cache.html.entries.get("html_sessions");

        this.domOverlay = this.add.dom(180, 360).createFromHTML(String(html.innerHTML));
        this.add.tween({
            targets: [this.fadeCover],
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 0,
            alpha: {
                getStart: function () {
                    return 0;
                },
                getEnd: function () {
                    return 0.6;
                }
            }
        });

        if (sessionID != "") {
            this.domOverlay.getChildByID("sessions-name-displ").textContent = sessionID;
            this.domOverlay.getChildByID("sessions-username").textContent = "Username: " + userName;
            let selectedCategory = this.domOverlay.getChildByID("category-selector").value;

            // Gets values initially
            let table = this.domOverlay.getChildByID("sessions-leaderboard-table");
            cdapi.getTotalLeaderboard(sessionID, selectedCategory, 100).then(results => {
                console.log(results);
                this.displayLeaderboardResults(results.result, table);
            });

            // And also when sort by selector is changed
            this.domOverlay.addListener("change");
            this.domOverlay.on("change", (event) => {
                if (event.target.id == "category-selector") {
                    selectedCategory = event.target.value;
                    console.log(selectedCategory);
                    cdapi.getTotalLeaderboard(sessionID, selectedCategory, 100).then(results => {
                        console.log(results);
                        this.displayLeaderboardResults(results.result, table);
                    });
                }
            });
        } else {
            this.domOverlay.getChildByID("sessions-name-displ").textContent = "Currently not signed into any session.";
        }

    }

    displayLeaderboardResults(results, table) {
        // Clear table
        table.innerHTML = "";

        // Add back in headers
        let header = document.createElement("tr");
        let rankHeading = document.createElement("th");
        let nameHeading = document.createElement("th");
        let valueHeading = document.createElement("th");
        let levelsPlayedHeading = document.createElement("th");

        rankHeading.textContent = "Rank";
        nameHeading.textContent = "Name";
        valueHeading.textContent = "Score";
        levelsPlayedHeading.textContent = "Levels Played";

        nameHeading.classList.add("name");

        header.appendChild(rankHeading);
        header.appendChild(nameHeading);
        header.appendChild(valueHeading);
        header.appendChild(levelsPlayedHeading);
        table.appendChild(header);

        // Will find the unique users, get their total score, then sort in descending order.
        let uniqueUserMap = {};
        let uniqueUserArray = [];
        for (let i = 0; i < results.length; i++) {
            if (results[i].userName in uniqueUserMap) {
                uniqueUserMap[results[i].userName].score += results[i].score;
            } else if (!results[i].userName.includes("~")) {
                uniqueUserMap[results[i].userName] = results[i];
            }
        }
        for (let x in uniqueUserMap) {
            let user = {
                userName: "",
                score: 0,
                levels: 0
            }
            user.userName = uniqueUserMap[x].userName;
            user.score = uniqueUserMap[x].score;
            user.levels = uniqueUserMap[x].levels;
            uniqueUserArray.push(user);
        }
        uniqueUserArray.sort((a, b) => {return b.score - a.score});


        // Fill out table user results processed above
        for (let i = 0; i < uniqueUserArray.length; i++) {
            let entry = document.createElement("tr");
            let rank = document.createElement("td");
            let userName = document.createElement("td");
            let score = document.createElement("td");
            let levelsPlayed = document.createElement("td");


            rank.textContent = i + 1;
            userName.textContent = uniqueUserArray[i].userName;
            score.textContent = uniqueUserArray[i].score;
            levelsPlayed.textContent = uniqueUserArray[i].levels;

            entry.appendChild(rank);
            entry.appendChild(userName);
            entry.appendChild(score);
            entry.appendChild(levelsPlayed);
            table.appendChild(entry);
        }
    }

    dismissOverlay(img, pointer) {
        if (pointer.upElement.tagName != "CANVAS") {
            return
        }
        this._dismissOverlay();
    }

    _dismissOverlay(duration = 200) {
        if (!this.domOverlay) {
            return;
        }
        this.domOverlay.destroy();
        this.domOverlay = null;
        let tw = this.add.tween({
            targets: [this.fadeCover],
            ease: 'Sine.easeInOut',
            duration: duration,
            delay: 0,
            alpha: {
                getStart: function () {
                    return 0.4;
                },
                getEnd: function () {
                    return 0;
                }
            }
        });
    }

    /**
     * Stop the titlescreen and starts the given prelevel scene
     * @param {Int} level - The level to start.
     */
    startPrelevel(level) {
        if (this.domOverlay) {
            return;
        }
        this.camera.fadeOut(400);
        let that = this;
        this.time.addEvent({
            delay: 400,
            loop: false,
            callback: function () {
                that.scene.stop("titlescreen");
                that.scene.start("levelpre" + level);
            }
        });
        this.camera.setBounds(0, 0, 360, 740);
        this.camera.pan(this.goBtn.x, this.goBtn.y, 400).zoomTo(4, 400, Phaser.Math.Easing.Expo.In);
        /*
        let titleScreenScene = this.scene.manager.getScene("titlescreen");
        this.scene.manager.resume("titlescreen");
        titleScreenScene.camera.setBounds(0, 0, 360, 740);
        titleScreenScene.camera.pan(this.goBtn.x, this.goBtn.y, 400).zoomTo(4, 400, Phaser.Math.Easing.Expo.In);
        */
    }

    /**
     * Shrink the image
     * @param {Phaser.GameObjects.Image} img 
     */
    lvlPointerDown(img) {
        if (this.domOverlay) {
            return;
        }
        img.setScale(0.15);
    }

    /**
     * unshrink the image
     * @param {Phaser.GameObjects.Image} img 
     */
    lvlPointerRelease(img) {
        if (this.domOverlay) {
            return;
        }
        img.setScale(0.20);
    }

    backButtondown() {
        this.camera.fadeOut(400);
        let that = this;
        this.time.addEvent({
            delay: 400,
            loop: false,
            callback: function () {
                that.scene.stop("listlevels");
                that.scene.stop("levelpre" + that.curLevel);
                that.scene.start("titlescreen", { gameObj: that.data.gameObj, levels: that.data.gameObj.levels, audio: that.audioplayer });
            }
        });
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
     * Fade in camera scene
     * @param {function} [callback=null] - should be called when done fading in
     */
    fadeIn(callback = null) {
        let currentAlpha = this.camera.alpha;
        if (currentAlpha == 0) {
            currentAlpha = 0.0001;
        }
        let newAlpha = currentAlpha * 1.5;
        if (newAlpha > 0.999) {
            this.camera.clearAlpha();
            if (callback != null) {
                callback();
            }
        } else {
            this.camera.setAlpha(newAlpha);
            let that = this;
            this.time.addEvent({
                delay: 40,
                callback: function () {
                    that.fadeIn(callback);
                },
                loop: false
            });
        }
    }

    /**
     * Selects the next level.
     */
    browseRight() {
        if (this.curLevel < this.levels.length - 1) {
            this.curLevel++;
            this.displayLevel(this.curLevel);
        }
        this.updateGoButton();
    }

    /**
     * Selects the previous level.
     */
    browseLeft() {
        if (this.curLevel > 0) {
            this.curLevel--;
            this.displayLevel(this.curLevel);
        }
        this.updateGoButton();
    }

    /**
     * Changes the appearence of the go button depending on the current level.
     * @param {Int} - Given the current level, if locked, the go button will be transparent.
     */
    updateGoButton() {
        if (this.levels[this.curLevel].unlocked) {
            this.goBtn.setAlpha(1.0);
        } else {
            this.goBtn.setAlpha(0.5);
        }
    }

    /**
     * In the level selection scene, displays the information related to a level.
     * @param {Int} - The level whose data should be displayed.
     */
    displayLevel(level) {
        if (level > this.levels.length || this.level < 0) {
            console.error("Given level number to display, " + this.level + ", is not a valid level number.");
        } else {
            let title = this.levels[level].name;
            let desc = this.levels[level].description;
            let speed = this.levels[level].speed;
            let difficulty = "Unknown";

            // Arbitrary numbers were chosen for dictating difficulty... may change later.
            if (speed > 33) {
                difficulty = "(Easy)";
            } else if (speed >= 25) {
                difficulty = "(Moderate)";
            } else if (level == "14" || level == "18") { // levels 15 and 19 are "very hard"
                difficulty = "(Very Hard)";
            } else {
                difficulty = "(Hard)";
            }

            // Rendering text, testing if it is unlocked and/or has a description.
            this.levelBrowseTitle.text = title;
            if (this.levels[level].unlocked == true) {
                if (typeof this.levels[level].description === "undefined") {
                    this.levelBrowseDesc.text = "Description not available."
                } else {
                    this.levelBrowseDesc.text = desc;
                }

                // if we're in bonus levels, it should have a different subtitle.
                if (this.areTheseBonusLevels()) {
                    this.levelBrowseSubtitle.text = "Bonus Level " + (level + 13);
                } else {
                    this.levelBrowseSubtitle.text = "Level " + (level + 1) + " : " + difficulty;
                }

            } else {
                this.levelBrowseSubtitle.text = "Level " + (level + 1) + " : LOCKED";
                this.levelBrowseDesc.text = "You could probably write something about how to unlock this level here.";
            }

            // Levels 13, 14, 16, and 19 have special images to show.

            // should destroy image if this.levelBrowsImage is an image
            if (this.levelBrowseImage != null) {
                this.levelBrowseImage.destroy();
            }

            if (this.levels[level].description_image) {
                let image = this.levels[level].description_image
                this.levelBrowseImage = this.add.image(image.x, image.y, image.name).setScale(image.scale).setOrigin(0.5, 0.5);
            } else {
                this.levelBrowseImage = null;
            }
        }
    }


}

export default ListLevels;
