(function (glob) {
    "use strict";
    // **********************************************************************
    // ****** Public API
    // **********************************************************************
    var cdapi = { };
    cdapi.version = '1.0.0';
    const BASE_URL = 'http://localhost:5000';
    //const BASE_URL = '/api';
    let loggedIn = false;
    let currentSession = null;

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
    cdapi.login = async (username) => {
        return await postJSON(BASE_URL + "/user/login",
                              {"username": username}).then(data => {
                                  if (data.status == "ok") {
                                      window.localStorage.setItem("loginToken", data.access_token);
                                      loggedIn = true;
                                  }
                                  return data;
                              });
    };

    cdapi.globalLeaderboard = async () => {
        const url = BASE_URL + "/leaderboard";
        return await getJSON(url);
    };
    cdapi.sessionLeaderboard = async (sessionId) => {
        const url = BASE_URL + "/leaderboard/" + sessionId;
        return await getJSON(url);
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
    // These lines needed to support a NPM/ES6 environment, the define() call
    // is to support RequireJS
    glob.cdapi = cdapi;
    typeof module != 'undefined' && module.exports ? module.exports = cdapi : typeof define === "function" && define.amd ? define("cdapi", [], function () { return cdapi; }) : glob.cdapi = cdapi;
})(typeof window != "undefined" ? window : this);

