/**
 * Represents the list level scene
 * @extends Phaser.Scene
 */
class ListLevels extends Phaser.Scene {
    /**
     * Creates a list levels scene
     * @param {Phaser.Types.Scenes.SettingsConfig} config 
     */
    constructor (config) {
        super(config);
    }

    /**
     * Initalizes the list levels. Fades in and populate the level list
     * @param {JSON} data 
     */
    init(data) {
        console.log(data);
        // Initialization
        this.camera = this.cameras.main;
        this.camera.setAlpha(0);
        this.graphics = this.add.graphics();

        // Level Data
        this.levels = data.levels;
        this.curLevel = 0;

        // Background and Title
        this.add.text(26, 90, "- LEVEL SELECTION -", 
            {fontFamily: 'Teko', fontSize: '40pt', color: '#000000'});

        this.graphics.fillStyle(0xFF8040, 0.4);
        this.graphics.fillRect(18, 157, 320, 45);

        this.graphics.fillStyle(0x006FFF, 0.4);
        this.graphics.fillRect(18, 212, 320, 45);


        // Level Selection UI/Functionality
        this.leftLevelBtn = this.add.image(60, 600, "left_arrow_btn").setScale(0.25).setInteractive();
        this.rightLevelBtn = this.add.image(300, 600, "right_arrow_btn").setScale(0.25).setInteractive();
        this.goBtn = this.add.image(180, 600, "go_btn").setScale(0.40).setInteractive();
        this.backBtn = this.add.image(50, 690, "back_btn").setScale(0.30).setInteractive();
        this.signoutBtn = this.add.image(250, 690, "signout_btn").setScale(0.5).setInteractive();
        this.sessionbtn = this.add.image(290, 35, "leadererboard_btn").setScale(0.33).setAlpha(0);
        this.greeting = this.add.text(26, 30, "", 
            {fontFamily: 'Teko', fontSize: '28pt', color: '#000000'});
        this.usernameText = this.add.text(26, 65, "", 
            {fontFamily: 'Teko', fontSize: '15pt', color: '#000000'});

        // Leaderboard UI/ Greeting
        // Leaderboard and greeting will only appear as an option if you're signed in
        cdapi.isUserSignedIn(data.gameObj.userName, data.gameObj.SessionID).then(result => {
            if (result) {
                this.sessionbtn.setInteractive();
                this.sessionbtn.setAlpha(1.0)
                this.sessionbtn.addListener("pointerup", this.bindFn(() => {
                    this.showSessionLeaderboard(data.gameObj.userName, data.gameObj.sessionID, "score", 10)
                }));
                this.greeting.text = "Welcome Back, ";
                this.usernameText.text = data.gameObj.animalName;
            } else {
                this.removeSignedInOnlyElements();
            }
        })

        // Left and Right
        this.leftLevelBtn.on("pointerdown", () => {
            this.browseLeft();
        });

        this.rightLevelBtn.on("pointerdown", () => {
            this.browseRight();
        });

        // Go Button
        this.goBtn.on("pointerdown", () => {
            if (this.levels[this.curLevel].unlocked == true) {
               this.startPrelevel(this.curLevel); 
            }
        })

        // Back Button
        this.backBtn.on("pointerdown", () => {
            this.backButtondown();
        })

        // Signout Button
        this.signoutBtn.on("pointerdown", () => {
            cdapi.signout(data.gameObj.userName, data.gameObj.sessionID).then(result => {
                this.removeSignedInOnlyElements();
            })
        })

        // Level Selection Descriptors
        this.levelBrowseTitle = this.add.text(20, 160, "", 
            {fontFamily: 'Teko', fontSize: '36pt', color: '#000000', align: 'center'});

        this.levelBrowseSubtitle = this.add.text(20, 220, "", 
            {fontFamily: 'Teko', fontSize: '28pt', color: '#000000', align: 'center'}); 

        this.levelBrowseDesc = this.add.text(20, 300, "", 
            {fontFamily: 'Teko', fontSize: '20pt', color: '#000000', align: 'left', wordWrap: { width: 320, useAdvancedWrap: true } });                                  

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

    removeSignedInOnlyElements() {
        // Removes leaderboard button
        this.sessionbtn.setAlpha(0);
        this.sessionbtn.setInteractive(false);

        // changes greeting
        this.usernameText.text = "";
        this.greeting.text = "Not Signed In";

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
    showSessionLeaderboard(userName, sessionID, category, rows) {
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
            let selectedCategory =  this.domOverlay.getChildByID("category-selector").value;
            cdapi.getTotalLeaderboard(sessionID, selectedCategory, rows).then(results => {    
                let table = this.domOverlay.getChildByID("sessions-leaderboard-table");
                console.log(selectedCategory);

                for (let i = 0; i < results.length; i++) {
                    let entry = document.createElement("tr");
                    let rank = document.createElement("td");
                    let userName = document.createElement("td");
                    let value = document.createElement("td");
    
                    rank.textContent = i + 1;
                    userName.textContent = results[i].userName;
                    value.textContent = results[i].value;
    
                    entry.appendChild(rank);
                    entry.appendChild(userName);
                    entry.appendChild(value);
    
                    table.appendChild(entry);
                }
            });
            /*
            this.domOverlay.on("click", function (event) {
                console.log(event.target.id);
                if (event.target.id == "category-selector") {
                    console.log("click!");
                    let selectedCategory =  this.domOverlay.getChildByID("category-selector").value;
                    cdapi.getTotalLeaderboard(sessionID, selectedCategory, rows).then(results => {    
                        let table = this.domOverlay.getChildByID("sessions-leaderboard-table");
                        console.log(selectedCategory);

                        for (let i = 0; i < results.length; i++) {
                            let entry = document.createElement("tr");
                            let rank = document.createElement("td");
                            let userName = document.createElement("td");
                            let value = document.createElement("td");
            
                            rank.textContent = i + 1;
                            userName.textContent = results[i].userName;
                            value.textContent = results[i].value;
            
                            entry.appendChild(rank);
                            entry.appendChild(userName);
                            entry.appendChild(value);
            
                            table.appendChild(entry);
                        }
                    });
                }
            });*/
        } else {
            this.domOverlay.getChildByID("sessions-name-displ").textContent = "Currently not signed into any session.";
        }

    }

    dismissOverlay(img, pointer) {
        if (pointer.upElement.tagName != "CANVAS") {
            return
        }
        this._dismissOverlay();
    }

    _dismissOverlay(duration=200) {
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
                that.scene.start("titlescreen");
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
    fadeIn(callback=null) {
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
            // Is there a better way of handling errors? like a way to break or something instead of putting everything
            // into a giant else branch?
        } else {
            let title = this.levels[level].name;
            let desc = this.levels[level].description;
            let speed = this.levels[level].speed;
            let difficulty = "Unknown";
            
            // Arbitrary numbers were chosen for dictating difficulty... may change later.
            if (speed > 33) {
                difficulty = "(Easy)";
            } else if (speed >= 25) {
                difficulty = "(Medium)";
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
                this.levelBrowseSubtitle.text = "Level " + (level + 1) + " - " + difficulty;
            } else {
                this.levelBrowseSubtitle.text = "Level " + (level + 1) + " - LOCKED";
                this.levelBrowseDesc.text = "You could probably write something about how to unlock this level here.";
            }
        }
    }

    
}

export default ListLevels;
