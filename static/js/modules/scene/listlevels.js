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


    // Process for making a new level selection screen
    // Position two arrows in the level selection scene, which when clicked will either increment/decrement curLevel
    // Each arrow, when clicked, will call the increment/decrment method of the ListLevels object, then update the display.
    // onLvlClick() starts the scene based on button clicked, but can be adapted to start a given scene/level number.
    // When levels are cycled, their name should be displayed, a small description, and its difficulty.
    // ^^ for that, potentially use tweens to make it appear on screen in an interesting way.
    // ^^ also for that, let's use some associated color in the background.

    // TODO
    // Write increment method DONE
    // Write decrement method DONE
    // Write a startPreLevel(levelNum) method. DONE
    // Write a displayLevel(levelNum) method. DONE
    // Add a description field to the level json object found in main.js. DONEish. *only on the first three levels...

    /**
     * Initalizes the list levels. Fades in and populate the level list
     * @param {JSON} data 
     */
    init(data) {
        console.log("Global score right now: " + data.gameObj.GLOBAL_SCORE);

        // Initialization
        this.camera = this.cameras.main;
        this.camera.setAlpha(0);
        this.graphics = this.add.graphics();

        // Level Data
        this.levels = data.levels;
        this.curLevel = 0;

        // Background and Title
        // this.graphics.fillStyle(0x002664, 0.75);
        // this.graphics.fillRect(20, 100, 320, 600);
        this.add.text(20, 60, "LEVEL SELECTION", 
            {fontFamily: 'Teko', fontSize: '24pt', color: '#000'});


        // Level Selection UI/Functionality
        this.leftLevelBtn = this.add.image(60, 650, "left_arrow_btn").setScale(0.25).setInteractive();
        this.rightLevelBtn = this.add.image(300, 650, "right_arrow_btn").setScale(0.25).setInteractive();
        this.goBtn = this.add.image(180, 650, "go_btn").setScale(0.40).setInteractive();

        this.leftLevelBtn.on("pointerdown", () => {
            this.browseLeft();
        });

        this.rightLevelBtn.on("pointerdown", () => {
            this.browseRight();
        });

        this.goBtn.on("pointerdown", () => {
            if (this.levels[this.curLevel].unlocked == true) {
               this.startPrelevel(this.curLevel); 
            }
        })

        // Level Selection Descriptors
        this.levelBrowseTitle = this.add.text(20, 160, "", 
            {fontFamily: 'Teko', fontSize: '36pt', color: '#000', align: 'center'});

        this.levelBrowseSubtitle = this.add.text(20, 220, "", 
            {fontFamily: 'Teko', fontSize: '28pt', color: '#000', align: 'center'}); 

        this.levelBrowseDesc = this.add.text(20, 300, "", 
            {fontFamily: 'Teko', fontSize: '20pt', color: '#000', align: 'left', wordWrap: { width: 320, useAdvancedWrap: true } });                                  


        // Sign in UI
        this.userbtn = this.add.image(40, 30, "nt_thymine_basic").setScale(0.17).setAngle(15).setInteractive();
        this.signInIcn = this.add.image(40, 30, "signin_signin_icn").setScale(0.15).setTintFill(0xDCF3FD).setVisible(false);
        this.userIcn = this.add.image(40, 30, "signin_user_icn").setScale(0.15).setTintFill(0xDCF3FD).setVisible(false);
        this.updateSignInIcon();


        // Functionality to skip DOGMA animation, also fades in content.
        let that = this;
        this.fadeIn(function () {
            that.displayLevel(that.curLevel);
            that.userbtn.addListener("pointerup", that.bindFn(that.onUserButtonClick));
        });

        this.domOverlay = null;
        this.fadeCover = this.add.rectangle(180, 370, 360, 740, 0x000000).setDepth(1000).setAlpha(0).setInteractive();
        this.fadeCover.addListener("pointerup", that.bindFn(that.dismissOverlay))


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

    showSessionMgrOverlay(duration=500) {
        if (this.domOverlay) {
            return;
        }
        this.domOverlay = this.add.dom(180, 300).createFromCache('html_sessionmgr');
        this.add.tween({
            targets: [this.fadeCover],
            ease: 'Sine.easeInOut',
            duration: duration,
            delay: 0,
            alpha: {
                getStart: function () {
                    return 0;
                },
                getEnd: function () {
                    return 0.4;
                }
            }
        });

        this.domOverlay.getChildByID("sessionmgr-sessions-list").innerHTML = "";
        let newSess = this.addSessionToSessionMgr("new");
        newSess.querySelector("a").classList.add("selected");
        let that = this;
        cdapi.ownedSessions()
            .then(function (data) {
                if (data.status == "ok") {
                    that.domOverlay.getChildByID("sessionmgr-error-message").classList.add("hidden");
                    for (let i = 0; i < data.sessions.length; i++) {
                        let sess = data.sessions[i];
                        that.addSessionToSessionMgr(sess.session_code, sess.start_time, sess.end_time);
                    }
                } else {
                    that.domOverlay.getChildByID("sessionmgr-error-message").classList.remove("hidden");
                    that.domOverlay.getChildByID("sessionmgr-error-message").textContent = data.error;
                }
            })
            .catch(function (data) {
                that.domOverlay.getChildByID("sessionmgr-error-message").textContent = data.error;
                that.domOverlay.getChildByID("sessionmgr-error-message").classList.remove("hidden");
            });
            
        this.domOverlay.addListener("click");
        this.domOverlay.on("click", function (event) {
            if (event.target.id == "sessionmgr-submit-button") {
                event.preventDefault();
                let sessioncode = this.domOverlay.getChildByID("sessionmgr-name-input").value;
                let start = this.domOverlay.getChildByID("sessionmgr-start-input").value;
                let end = this.domOverlay.getChildByID("sessionmgr-end-input").value;
                if (!sessioncode || !start || !end) {
                    return;
                }
                start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL).format("YYYY-MM-DD HH:mm:ss");
                end = moment(end, moment.HTML5_FMT.DATETIME_LOCAL).format("YYYY-MM-DD HH:mm:ss");
                let selectedSessionCode = this.domOverlay.getChildByID("sessionmgr-sessions-list").querySelector("a.selected").dataset.sessionCode;
                if (selectedSessionCode == "new") {
                    cdapi.makeSession(sessioncode, start, end)
                        .then(function (data) {
                            if (data.status == "ok") {
                                that._dismissOverlay(0);
                                that.showSessionMgrOverlay(0);
                            } else {
                                that.domOverlay.getChildByID("sessionmgr-error-message").classList.remove("hidden");
                                that.domOverlay.getChildByID("sessionmgr-error-message").textContent = data.error;
                            }
                        })
                        .catch(function (data) {
                            that.domOverlay.getChildByID("sessionmgr-error-message").classList.remove("hidden");
                            that.domOverlay.getChildByID("sessionmgr-error-message").textContent = data.error;
                        });
                } else {
                    cdapi.modifySession(sessioncode, start, end)
                        .then(function (data) {
                            if (data.status == "ok") {
                                that._dismissOverlay(0);
                                that.showSessionMgrOverlay(0);
                            }else {
                                that.domOverlay.getChildByID("sessionmgr-error-message").classList.remove("hidden");
                                that.domOverlay.getChildByID("sessionmgr-error-message").textContent = data.error;
                            }
                        })
                        .catch(function (data) {
                            that.domOverlay.getChildByID("sessionmgr-error-message").classList.remove("hidden");
                            that.domOverlay.getChildByID("sessionmgr-error-message").textContent = data.error;
                        });
                }
            }
        }, this);
    }

    addSessionToSessionMgr(code, start=null, end=null) {
        let li = document.createElement("li");
        let anchor = document.createElement("a");
        anchor.href = "#";
        if (code == "new") {
            anchor.textContent = "[Create New Session]";
        } else {
            anchor.textContent = code;
        }
        if (start) {
            anchor.dataset.startTime = start;
        }
        if (end) {
            anchor.dataset.endTime = end;
        }
        anchor.dataset.sessionCode = code;
        li.appendChild(anchor);
        this.domOverlay.getChildByID("sessionmgr-sessions-list").appendChild(li);
        let that = this;
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            this.parentNode.parentNode.querySelector("a.selected").classList.remove("selected");
            this.classList.add("selected");
            that.populateSessionManagerForm(this.dataset.sessionCode, this.dataset.startTime, this.dataset.endTime);
        });
        return li;
    }

    populateSessionManagerForm(code, start=null, end=null) {
        if (code == "new") {
            this.domOverlay.getChildByID("sessionmgr-name-input").disabled = false;
            this.domOverlay.getChildByID("sessionmgr-name-input").value = "";
            this.domOverlay.getChildByID("sessionmgr-start-input").value = "";
            this.domOverlay.getChildByID("sessionmgr-end-input").value = "";
        } else {
            this.domOverlay.getChildByID("sessionmgr-name-input").disabled = true;
            this.domOverlay.getChildByID("sessionmgr-name-input").value = code;
            this.domOverlay.getChildByID("sessionmgr-start-input").value = moment(start).format(moment.HTML5_FMT.DATETIME_LOCAL);
            this.domOverlay.getChildByID("sessionmgr-end-input").value = moment(end).format(moment.HTML5_FMT.DATETIME_LOCAL);
        }
    }

    showSessionsOverlay(duration=500) {
        if (this.domOverlay) {
            return;
        }
        this.domOverlay = this.add.dom(180, 300).createFromCache('html_sessions');
        this.add.tween({
            targets: [this.fadeCover],
            ease: 'Sine.easeInOut',
            duration: duration,
            delay: 0,
            alpha: {
                getStart: function () {
                    return 0;
                },
                getEnd: function () {
                    return 0.4;
                }
            }
        });
        
        this.updateSessionOverlay();

        let that = this;
        this.domOverlay.addListener("click");
        this.domOverlay.on("click", function () {
            if (event.target.id == "sessions-join-button") {
                let val = that.domOverlay.getChildByID("sessions-name-input").value;
                if (!val) {
                    return;
                }
                cdapi.sessionInfo(val)
                    .then(function (data) {
                        if (data.status == "ok") {
                            that.domOverlay.getChildByID("sessions-error-message").classList.add("hidden");
                            cdapi.setCurrentSession(val);
                            that.updateSessionOverlay();
                        } else {
                            that.domOverlay.getChildByID("sessions-error-message").classList.remove("hidden");
                            that.domOverlay.getChildByID("sessions-error-message").textContent = "Session does not exist or it may have expied.";
                        }
                    })
                    .catch(function (data) {
                        let error = data.error;
                        if (!error) {
                            error = "The API service cannot be reached.";
                        }
                        that.domOverlay.getChildByID("sessions-error-message").classList.remove("hidden");
                        that.domOverlay.getChildByID("sessions-error-message").textContent = error;
                    });
            } else if (event.target.id == "sessions-manager") {
                event.preventDefault();
                this._dismissOverlay(0);
                this.showSessionMgrOverlay(0);
            }
        }, this);
    }

    updateSessionOverlay() {
        let that = this;
        if (cdapi.getCurrentSession() == null) {
            cdapi.globalLeaderboard()
                .then(function (data) {
                    if (data.status == "ok") {
                        that.updateSessionOverlayLeaderboard(data.entries);
                    } else {
                        that.updateSessionOverlayLeaderboard([]);
                    }
                })
                .catch(function () {
                    that.updateSessionOverlayLeaderboard([]);
                });
        } else {
            let currentSession = cdapi.getCurrentSession();
            cdapi.sessionInfo(currentSession)
                .then(function (data) {
                    if (data.status == "ok") {
                        cdapi.sessionLeaderboard(currentSession)
                            .then(function (data) {
                                if (data.status == "ok") {
                                    that.updateSessionOverlayLeaderboard(data.entries);
                                } else {
                                    that.updateSessionOverlayLeaderboard([]);
                                }
                            })
                            .catch(function () {
                                that.updateSessionOverlayLeaderboard([]);
                            });
                    } else {
                        cdapi.setCurrentSession(null);
                        that.updateSessionOverlayLeaderboard([]);
                    }
                })
                .catch(function () {
                    cdapi.setCurrentSession(null);
                    that.updateSessionOverlayLeaderboard([]);
                });
        }
    }

    updateSessionOverlayLeaderboard(leaderboard) {
        let currentSession = cdapi.getCurrentSession();
        this.domOverlay.getChildByID("sessions-leaderboard-list").innerHTML = "";

        if (currentSession == null) {
            this.domOverlay.getChildByID("sessions-session-name-displ").textContent = "Global";
        } else {
            this.domOverlay.getChildByID("sessions-session-name-displ").textContent = currentSession;
        }
        
        if (leaderboard.length) {
            this.domOverlay.getChildByID("sessions-no-scores-notice").classList.add("hidden");
            for (let i = 0; i < leaderboard.length; i++) {
                let entry = leaderboard[i];
                let li = document.createElement("li");
                let tn = document.createTextNode(entry.username + " - ");
                let strong = document.createElement("strong");
                strong.textContent = entry.score;
                li.appendChild(tn);
                li.appendChild(strong);
                this.domOverlay.getChildByID("sessions-leaderboard-list").appendChild(li);
            }
        } else {
            this.domOverlay.getChildByID("sessions-no-scores-notice").classList.remove("hidden");
        }
    }

    showLoginOverlay(duration=500) {
        if (this.domOverlay) {
            return;
        }
        this.domOverlay = this.add.dom(180, 300).createFromCache('html_login');
        this.add.tween({
            targets: [this.fadeCover],
            ease: 'Sine.easeInOut',
            duration: duration,
            delay: 0,
            alpha: {
                getStart: function () {
                    return 0;
                },
                getEnd: function () {
                    return 0.4;
                }
            }
        });
        this.domOverlay.addListener("click");
        this.domOverlay.on("click", function (event) {
            if (event.target.id === "login-register") {
                event.preventDefault();
                this._dismissOverlay(0);
                this.showRegisterOverlay(0);
            } else if (event.target.id == "login-button") {
                event.preventDefault();
                let username = this.domOverlay.getChildByID("login-username").value;
                let password = this.domOverlay.getChildByID("login-password").value;
                if (!username || !password) {
                    return;
                }
                let that = this;
                cdapi.login(username, password)
                    .then(function (data) {
                        if (data.status == "ok") {
                            that.updateSignInIcon();
                            that._dismissOverlay();
                        } else if (data.status == "error") {
                            that.domOverlay.getChildByID("login-error-msg").textContent = data.error;
                            that.domOverlay.getChildByID("login-error-msg").classList.remove("hidden");
                        }
                    }).catch(function (data) {
                        that.domOverlay.getChildByID("login-error-msg").textContent = data.error;
                        that.domOverlay.getChildByID("login-error-msg").classList.remove("hidden");
                    });
            }
        }, this);
    }

    showRegisterOverlay(duration=500) {
        if (this.domOverlay) {
            return;
        }
        this.domOverlay = this.add.dom(180, 300).createFromCache('html_register');
        this.add.tween({
            targets: [this.fadeCover],
            ease: 'Sine.easeInOut',
            duration: duration,
            delay: 0,
            alpha: {
                getStart: function () {
                    return 0;
                },
                getEnd: function () {
                    return 0.4;
                }
            }
        });
        this.domOverlay.addListener("click");
        this.domOverlay.on("click", function (event) {
            if (event.target.id === "register-login") {
                event.preventDefault();
                this._dismissOverlay(0);
                this.showLoginOverlay(0);
            } else if (event.target.id == "register-button") {
                event.preventDefault();
                let username = this.domOverlay.getChildByID("register-username").value;
                let password = this.domOverlay.getChildByID("register-password").value;
                let node = this.domOverlay.node;
                let genders = node.querySelectorAll("[name='register-gender']");
                let gender = null;
                for (let i  = 0; i < genders.length; i++) {
                    if (genders[i].checked) {
                        gender = genders[i].value.substr(0, 1);
                        break;
                    }
                }
                let grade = this.domOverlay.getChildByID("register-grade").value;
                if (!username || !password || !gender || !grade) {
                    return;
                }
                let that = this;
                cdapi.register(username, password, grade, gender)
                    .then(function (data) {
                        if (data.status == "ok") {
                            that.updateSignInIcon();
                            that._dismissOverlay();
                        } else if (data.status == "error") {
                            that.domOverlay.getChildByID("register-error-msg").textContent = data.error;
                            that.domOverlay.getChildByID("register-error-msg").classList.remove("hidden");
                        }
                    }).catch(function (data) {
                        that.domOverlay.getChildByID("register-error-msg").textContent = data.error;
                        that.domOverlay.getChildByID("register-error-msg").classList.remove("hidden");
                    });
            }
        }, this);
        let gradeDisp = this.domOverlay.getChildByID("register-grade-displ");
        let gradeSlider = this.domOverlay.getChildByID("register-grade");
        gradeSlider.addEventListener("input", function () {
            gradeDisp.textContent = this.value;
        })
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
                console.log(level);
                that.scene.start("levelpre" + level);
            }
        });
        this.camera.setBounds(0, 0, 360, 740);
        this.camera.pan(this.goBtn.x, this.goBtn.y, 400).zoomTo(4, 400, Phaser.Math.Easing.Expo.In);
        let titleScreenScene = this.scene.manager.getScene("titlescreen");
        this.scene.manager.resume("titlescreen");
        titleScreenScene.camera.setBounds(0, 0, 360, 740);
        titleScreenScene.camera.pan(this.goBtn.x, this.goBtn.y, 400).zoomTo(4, 400, Phaser.Math.Easing.Expo.In);
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
            if (speed >= 50) {
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
