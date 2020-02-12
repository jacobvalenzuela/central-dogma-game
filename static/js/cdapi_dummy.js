(function (glob) {
    "use strict";
    // **********************************************************************
    // ****** Public API
    // **********************************************************************
    var cdapi = { };
    cdapi.version = '1.0.0';
    let loggedIn = false;
    let currentSession = null;
    var globalObject = null;


    cdapi.signin = function(username, sessionID) {
        return new Promise(function(resolve, reject) {
            loggedIn = true;
            resolve(true);
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
    cdapi.storeNewGlobalVariable = function(userName, sessionID, global) {
        return new Promise(function(resolve, reject) {
            globalObject = global;
            resolve(true);
        });
    };

    /* Gets a leaderboard based on given parameter for a session. */
    cdapi.getTotalLeaderboard = function(sessionID, orderBy, numRows) {
        return new Promise(function(resolve, reject) {
            var result = [ { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 }, { userName: 'user1', value: 12345 } ];
            resolve(result);
        });
    };

    /* Gets a leaderboard of scores for a level in a session. */
    cdapi.getLevelLeaderboard = function(sessionID, level, numRows) {
        return new Promise(function(resolve, reject) {
            var result = [ { userName: 'user1', value: 12345 } ];
            resolve(result);
        });
    };

    // These lines needed to support a NPM/ES6 environment, the define() call
    // is to support RequireJS
    glob.cdapi = cdapi;
    typeof module != 'undefined' && module.exports ? module.exports = cdapi : typeof define === "function" && define.amd ? define("cdapi", [], function () { return cdapi; }) : glob.cdapi = cdapi;
})(typeof window != "undefined" ? window : this);

