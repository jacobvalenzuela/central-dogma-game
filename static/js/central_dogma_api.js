(function (glob) {
    "use strict";
    // **********************************************************************
    // ****** Public API
    // **********************************************************************
    var cdapi = { };
    cdapi.version = '1.0.0';
    const NO_BACKEND = false;
    const BASE_URL = 'http://localhost:5000';
    //const BASE_URL = '/api';
    let loggedIn = false;
    let currentSession = null;
    var globalObject = null;

    /* Get the session id */
    function get(name) {
        if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    }

    function handleError() {
        let err = {"status": "error", "error": "The API service cannot be reached."};
        console.log(err);
        return err;
    }

    cdapi.getSessionID = function() {
        return get('sessionid');
    };
    cdapi.init = function() {
        console.log('this is the CD API: ' + cdapi.getSessionID());
    };

    cdapi.info = function() {
        const url = BASE_URL + "/info";
        fetch(url).then(function(response) { return response.json() })
            .then(function(jsonObj) {
                console.log(jsonObj);
            }).catch(handleError);
    };

    function getJSON(url) {
        return fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'no-referrer'
        }).then(response => response.json()).catch(handleError);
    }

    function postJSON(url, data) {
        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
        }).then(response => response.json()).catch(handleError);
    }
    function postJSONAuth(url, data) {
        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem("loginToken")
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
        }).then(response => response.json()).catch(handleError);
    }
    function patchJSONAuth(url, data) {
        return fetch(url, {
            method: 'PATCH',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem("loginToken")
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
        }).then(response => response.json()).catch(handleError);
    }

    async function getAuth(url) {
        let headers = {"Authorization": "Bearer " + window.localStorage.getItem("loginToken")};
        const response = await fetch(url, {headers}).catch(handleError);
        return await response.json();
    }

    // These are the official API functions
    cdapi.register = async (username, password, grade, gender) => {
        return await postJSON(BASE_URL + "/user/register",
                              {"username": username, "password": password,
                               "grade": grade, "gender": gender}).then(data => {
                                   if (data.status == "ok") {
                                       window.localStorage.setItem("loginToken", data.access_token);
                                       loggedIn = true;
                                   }
                                   return data;
                               });
    };
    cdapi.login = async (username, password) => {
        return await postJSON(BASE_URL + "/user/login",
                              {"username": username, "password": password}).then(data => {
                                  if (data.status == "ok") {
                                      window.localStorage.setItem("loginToken", data.access_token);
                                      loggedIn = true;
                                  }
                                  return data;
                              });
    };

    cdapi.globalLeaderboard = async (sortby) => {
        const url = BASE_URL + "/leaderboard";
        return await postJSON(url, {orderby: sortby});
    };
    cdapi.sessionLeaderboard = async (sessionId, sortby) => {
        const url = BASE_URL + "/leaderboard/" + sessionId;
        return await postJSON(url, {orderby: sortby});
    };
    cdapi.levelGlobalLeaderboard = async (levelId, sortby) => {
        const url = BASE_URL + "/level_leaderboard/" + levelId;
        return await postJSON(url, {orderby: sortby});
    };
    cdapi.levelSessionLeaderboard = async (sessionId, levelId, sortby) => {
        const url = BASE_URL + "/level_leaderboard/" + sessionId + '/' + levelId;
        return await postJSON(url, {orderby: sortby});
    };

    cdapi.sessionInfo = async (sessionId) => {
        return await getAuth(BASE_URL + "/session/" + sessionId);
    };
    cdapi.makeSession = async (sessionCode, startTime, endTime) => {
        return await postJSONAuth(BASE_URL + "/session",
                                  {"session_code": sessionCode, "start_time": startTime, "end_time": endTime});
    };
    cdapi.ownedSessions = async () => {
        return await getAuth(BASE_URL + "/session");
    };
    cdapi.modifySession = async (sessionCode, startTime, endTime) => {
        return await patchJSONAuth(BASE_URL + "/session/" + sessionCode,
                                   {"start_time": startTime, "end_time": endTime});
    };
    cdapi.userGames = async () => {
        return await getAuth(BASE_URL + "/game");
    };
    cdapi.logLevelCompletion = async (levelId, params) => {
        return await postJSONAuth(BASE_URL + "/game/" + levelId, params);
    };
    cdapi.levelData = async (levelId, params) => {
        return await postJSONAuth(BASE_URL + "/leveldata/" + levelId, params);
    };
    cdapi.logQuestionResponse = async (questionId, answerOption, correctness, sessionCode) => {
        if (sessionCode !== null) {
            return await postJSONAuth(BASE_URL + "/response/" + questionId,
                                      {'session_code': sessionCode,
                                       'correctness': correctness,
                                       'answer_option': answerOption});
        } else {
            return await postJSONAuth(BASE_URL + "/response/" + questionId,
                                      {'correctness': correctness,
                                       'answer_option': answerOption});
        }
    };
    cdapi.gameCompletionInfo = async () => {
        return await getAuth(BASE_URL + "/game");
    };

    cdapi.logHyperlinkVisited = async (url) => {
        return await postJSONAuth(BASE_URL + "/tracklink", {"url": url});
    };

    cdapi.isLoggedIn = function () {
        return loggedIn;
    }

    cdapi.getCurrentSession = function () {
        return currentSession;
    }

    cdapi.setCurrentSession = function (sess) {
        currentSession = sess;
    }

    // ***************************************************************************************
    // Josh's new functions
    // ***************************************************************************************
    cdapi.signin = async (username, sessionID, userInfo) => {
        if (NO_BACKEND) {
            console.log('no backend -> dummy signin');
            return new Promise(function(resolve, reject) {
                loggedIn = true;
                resolve(true);
            });
        }
        return await postJSON(BASE_URL + "/user/signin",
                              {"username": username, "session_id": sessionID, "userinfo": userInfo}).then(data => {
                                  if (data.status == "ok") {
                                      window.localStorage.setItem("loginToken", data.access_token);
                                      loggedIn = true;
                                  }
                                  return data;
                              });
    };
    cdapi.signout = function(username, sessionID) {
        return new Promise(function(resolve, reject) {
            loggedIn = false;
            resolve(true);
        });
    };
    cdapi.isUserSignedIn = function(username, sessionID) {
        return new Promise(function(resolve, reject) {
            resolve(loggedIn);
        });
    };
    /* Stores a new global object (see above) for the user. */
    cdapi.storeNewGlobalVariable = async (userName, sessionID, global) => {
        if (NO_BACKEND) {
            console.log('no backend -> dummy store');
            return new Promise(function(resolve, reject) {
                globalObject = global;
                resolve(true);
            });
        }
        return await postJSONAuth(BASE_URL + "/user/storevar",
                                  {"session_id": sessionID,
                                   "global": global}).then(data => {
                                      if (data.status == "ok") {
                                          console.log('stored variable');
                                      }
                                  });
    };

    // returns object which is their stored global object
    cdapi.getGlobalVariable = async (username, sessionid) => {
        if (NO_BACKEND) {
            console.log('no backend -> dummy retrieve');
            return new Promise(function(resolve, reject) {
                resolve(globalObject);
            });
        }
        // TODO: backend connection
    };

    /* Gets a leaderboard based on given parameter for a session. */
    cdapi.getTotalLeaderboard = async (sessionID, orderBy, numRows) => {
        if (NO_BACKEND) {
            console.log('no backend -> dummy leader board');
            return new Promise(function(resolve, reject) {
                let result = {
                    result: [ {userName: "heroic-orange-dinosaur", value: 606}, {userName: "heroic-orange-dinosaur", value: 490} ],
                    status: "ok"
                }
                resolve(result);
            });
        }
        return await postJSON(BASE_URL + "/total_leaderboard",
                              {"session_id": sessionID, "orderby": orderBy,
                               "numrows": numRows}).then(data => {
                                  if (data.status == "ok") {
                                  }
                                  return data;
                              });
    };

    /* Gets a leaderboard of scores for a level in a session. */
    cdapi.getLevelLeaderboard = async (sessionID, level, numRows) => {
        if (NO_BACKEND) {
            console.log('no backend -> dummy level leader board');
            return new Promise(function(resolve, reject) {
                var result = [ { userName: 'user1', value: 12345 } ];
                resolve(result);
            });
        }
        return await postJSON(BASE_URL + "/level_leaderboard",
                              {"session_id": sessionID, "level": level,
                               "numrows": numRows}).then(data => {
                                  if (data.status == "ok") {
                                  }
                                  return data;
                              });
    };

    // These lines needed to support a NPM/ES6 environment, the define() call
    // is to support RequireJS
    glob.cdapi = cdapi;
    typeof module != 'undefined' && module.exports ? module.exports = cdapi : typeof define === "function" && define.amd ? define("cdapi", [], function () { return cdapi; }) : glob.cdapi = cdapi;
})(typeof window != "undefined" ? window : this);

