/**
 * Represents the level stage scene
 * @extends Phaser.Scene
 */
class LoginScreen extends Phaser.Scene {

    /**
     * Creates a pause screen scene.
     * @param {Phaser.Types.Scenes.SettingsConfig} config 
     */
    constructor (config) {
        super(config);
    }

    /**
     * Initalizes the level.
     * @param {JSON} data 
     */
    init(data) {
        this.game = this;
        this.showLoginOverlay(data);
        this.floaty = this.physics.add.group();
        this.backgroundFloaties = this.spawnBackgroundFloaties(25);

        // Background Color
        this.graphics = this.game.add.graphics();
        this.graphics.fillStyle(0xFFFFFF, 1.0);
        this.graphics.fillRect(0, 0, 360, 740);

    }

    update() {
        // Allows background floaties to wrap
        this.physics.world.wrap(this.floaty, 50);
    }

    showLoginOverlay(data, duration=500) {
        if (this.domOverlay) {
            return;
        }

        let html = document.createElement("html");
        html.innerHTML = this.cache.html.entries.get("html_login");

        this.domOverlay = this.add.dom(180, 335).createFromHTML(String(html.innerHTML));

        // Adding options for adjective selector
        let adjectiveSelector = this.domOverlay.getChildByID("adjective-selector");
        let adjectives = ["wise", "agile", "strong", "inspiring", "heroic", "encouraging", "funny", "dexterous", "skillful", "clever"]
        this.appendSelectOptionsRandomly(adjectiveSelector, adjectives);

        // Adding options for color selector
        let colorSelector = this.domOverlay.getChildByID("color-selector");
        let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "magenta", "lime", "brown", "gray", "pink", "maroon"]
        this.appendSelectOptionsRandomly(colorSelector, colors);

        // Adding options for animal selector
        let animalSelector = this.domOverlay.getChildByID("animal-selector");
        let animals = [ "Aardvark", "Albatross", "Alligator", "Alpaca", "Ant", "Anteater", "Antelope", "Ape", "Armadillo", "Donkey", "Baboon", "Badger", "Barracuda", "Bat", "Bear", "Beaver", "Bee", "Bison", "Boar", "Buffalo", "Butterfly", "Camel", "Capybara", "Caribou", "Cassowary", "Cat", "Caterpillar", "Cattle", "Chamois", "Cheetah", "Chicken", "Chimpanzee", "Chinchilla", "Chough", "Clam", "Cobra", "Cockroach", "Cod", "Cormorant", "Coyote", "Crab", "Crane", "Crocodile", "Crow", "Curlew", "Deer", "Dinosaur", "Dog", "Dogfish", "Dolphin", "Dotterel", "Dove", "Dragonfly", "Duck", "Dugong", "Dunlin", "Eagle", "Echidna", "Eel", "Eland", "Elephant", "Elk", "Emu", "Falcon", "Ferret", "Finch", "Fish", "Flamingo", "Fly", "Fox", "Frog", "Gaur", "Gazelle", "Gerbil", "Giraffe", "Gnat", "Gnu", "Goat", "Goldfinch", "Goldfish", "Goose", "Gorilla", "Goshawk", "Grasshopper", "Grouse", "Guanaco", "Gull", "Hamster", "Hare", "Hawk", "Hedgehog", "Heron", "Herring", "Hippopotamus", "Hornet", "Horse", "Human", "Hummingbird", "Hyena", "Ibex", "Ibis", "Jackal", "Jaguar", "Jay", "Jellyfish", "Kangaroo", "Kingfisher", "Koala", "Kookabura", "Kouprey", "Kudu", "Lapwing", "Lark", "Lemur", "Leopard", "Lion", "Llama", "Lobster", "Locust", "Loris", "Louse", "Lyrebird", "Magpie", "Mallard", "Manatee", "Mandrill", "Mantis", "Marten", "Meerkat", "Mink", "Mole", "Mongoose", "Monkey", "Moose", "Mosquito", "Mouse", "Mule", "Narwhal", "Newt", "Nightingale", "Octopus", "Okapi", "Opossum", "Oryx", "Ostrich", "Otter", "Owl", "Oyster", "Panther", "Parrot", "Partridge", "Peafowl", "Pelican", "Penguin", "Pheasant", "Pig", "Pigeon", "Pony", "Porcupine", "Porpoise", "Quail", "Quelea", "Quetzal", "Rabbit", "Raccoon", "Rail", "Ram", "Rat", "Raven", "Red deer", "Red panda", "Reindeer", "Rhinoceros", "Rook", "Salamander", "Salmon", "Sand Dollar", "Sandpiper", "Sardine", "Scorpion", "Seahorse", "Seal", "Shark", "Sheep", "Shrew", "Skunk", "Snail", "Snake", "Sparrow", "Spider", "Spoonbill", "Squid", "Squirrel", "Starling", "Stingray", "Stinkbug", "Stork", "Swallow", "Swan", "Tapir", "Tarsier", "Termite", "Tiger", "Toad", "Trout", "Turkey", "Turtle", "Viper", "Vulture", "Wallaby", "Walrus", "Wasp", "Weasel", "Whale", "Wildcat", "Wolf", "Wolverine", "Wombat", "Woodcock", "Woodpecker", "Worm", "Wren", "Yak", "Zebra" ]
        this.appendSelectOptionsRandomly(animalSelector, animals);

        // Adding options for state selector
        let stateSelector = this.domOverlay.getChildByID("state-selector");
        let states = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
        this.appendSelectOptionsRandomly(stateSelector, states, true);

        // Adding options for grade selector
        let gradeSelector = this.domOverlay.getChildByID("grade-selector");
        let grades = ["K-8", "9", "10", "11", "12", "Undergraduate", "Other", "NA"]
        this.appendSelectOptionsRandomly(gradeSelector, grades, true);

        // Adding options for gender selector
        let genderSelector = this.domOverlay.getChildByID("gender-selector");
        let genders = ["Prefer not to say", "Female", "Male", "Non-binary", "Third gender", "Other"]
        this.appendSelectOptionsRandomly(genderSelector, genders, true);

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

        // if the user is signed in and their data is in local storage, use it to fill out the form.
        console.log(localStorage.getItem("username"));
        if (localStorage.getItem("username") != null) {
            // Get and format the stored username
            let formattedUserData = this.formatUserData(localStorage.getItem("username"));
            console.log(formattedUserData);

            // Use it to fill out the dom overlay
            let domOverlayFieldIDs = ["adjective-selector", "color-selector", "animal-selector", "state-selector", "grade-selector", "gender-selector", "login-sessionName"];

            for (let i = 0; i < domOverlayFieldIDs.length; i++) {
                this.domOverlay.getChildByID(domOverlayFieldIDs[i]).value = formattedUserData[i];
            }

            // Filled out the form, but hides it, only showing the confirm relog form.
            // If they accept the relog, it acts as a regular sign in button, using the hidden form values.
            // If they reject the relog, it changes the display to show the login screen again.
            this.domOverlay.getChildByID("returnUserDisplay").classList.remove("hidden");
            this.domOverlay.getChildByID("loginUserDisplay").classList.add("hidden");
            this.domOverlay.getChildByID("user-name-relog").textContent = this.domOverlay.getChildByID("adjective-selector").value.replace(/\b\w/g, l => l.toUpperCase()) + " " + this.domOverlay.getChildByID("color-selector").value.replace(/\b\w/g, l => l.toUpperCase()) + " " + this.domOverlay.getChildByID("animal-selector").value.replace(/\b\w/g, l => l.toUpperCase())
        }

        this.domOverlay.addListener("click");
        this.domOverlay.on("click", function (event) {
            if (event.target.id == "adjective-selector" ||
                event.target.id == "color-selector" ||
                event.target.id == "animal-selector") {

                this.domOverlay.getChildByID("user-name").textContent = this.domOverlay.getChildByID("adjective-selector").value.replace(/\b\w/g, l => l.toUpperCase()) + " " + this.domOverlay.getChildByID("color-selector").value.replace(/\b\w/g, l => l.toUpperCase()) + " " + this.domOverlay.getChildByID("animal-selector").value.replace(/\b\w/g, l => l.toUpperCase())
                this.domOverlay.getChildByID("user-found").textContent = "";
            } else if (event.target.id === "login-register") {
                event.preventDefault();
                this._dismissOverlay(0);
                this.showRegisterOverlay(0);
            } else if (event.target.id == "no-relog-button") {
                // If they reject the relog, it changes the display to show the login screen again.
                // Also erase any previously stored login info
                // Also reset all the form fields

                localStorage.removeItem("username");
                this.resetFields(this.domOverlay);
                this.domOverlay.getChildByID("returnUserDisplay").classList.add("hidden");
                this.domOverlay.getChildByID("loginUserDisplay").classList.remove("hidden");
                

            } else if (event.target.id == "login-button") {
                event.preventDefault();

                // just builds the animal name
                let animalname = this.capitalizeFirstLetter(this.domOverlay.getChildByID("adjective-selector").value) + " " +
                                 this.capitalizeFirstLetter(this.domOverlay.getChildByID("color-selector").value) + " " +
                                 this.capitalizeFirstLetter(this.domOverlay.getChildByID("animal-selector").value) + " ";

                // retrieves session name
                let session = this.domOverlay.getChildByID("login-sessionName").value.replace(" ", "_");

                // check if session is unset, and if so, set it to a default value (date + "No_Session_ID")
                if (session == "") {
                    let defaultSession = "no_session_id";

                    let today = new Date();
                    let dd = String(today.getDate()).padStart(2, '0');
                    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    let yyyy = today.getFullYear();

                    today = mm + '_' + dd + '_' + yyyy;
                    session = today + "_" + defaultSession;
                    console.log(session);
                }

                // builds the username and lowercases it
                let username = this.domOverlay.getChildByID("adjective-selector").value + "-" +
                this.domOverlay.getChildByID("color-selector").value + "-" +
                this.domOverlay.getChildByID("animal-selector").value + "-" +
                this.domOverlay.getChildByID("state-selector").value + "-" +
                this.domOverlay.getChildByID("grade-selector").value.replace("-", "_") +  "-" +
                this.domOverlay.getChildByID("gender-selector").value.replace(new RegExp(" ", 'g'), "_").replace("-", "_") + "-" + session;
                username = username.toLowerCase();                

                // if any are invalid, tell the user
                if (!username || !session || this.domOverlay.getChildByID("adjective-selector").value == "" ||
                    this.domOverlay.getChildByID("color-selector").value == "" || this.domOverlay.getChildByID("animal-selector").value == "") {
                    this.domOverlay.getChildByID("login-feedback").textContent = "Please specify a valid username.";
                    return;
                }

                // first check if user is already signed in
                cdapi.isUserSignedIn(username, session)
                .then(loggedIn => {
                    // If they are not logged in already, they are free to log in.
                    if (!loggedIn) {
                        // Store this data as globals for the game to use later
                        data.gameObj.sessionID = session;
                        data.gameObj.userName = username;
                        data.gameObj.animalName = animalname;

                        // Also store username in localStorage to check when relogging
                        localStorage.setItem("username", username);

                        cdapi.signin(username, session)
                        .then(result => {
                            this.scene.start("titlescreen", {skipToLevelsList: false, gameObj: data.gameObj, fadeIn: true});
                        })
                        .catch(result => {
                            this.domOverlay.getChildByID("login-feedback").textContent = "Something went wrong while logging in.";
                            console.log("failed to log in: " + result);
                        })

                    // if they are logged in, they just have to wait out their session.
                    } else {
                        this.domOverlay.getChildByID("login-feedback").textContent = "User is already signed in, try again later.";
                    }
                })
                .catch(result => {
                    this.domOverlay.getChildByID("login-feedback").textContent = "Something went wrong while logging in.";
                    console.log("failed to log in: " + result);
                })
            } else if (event.target.id == "skip-button") {
                this.scene.start("titlescreen", {skipToLevelsList: false, gameObj: data.gameObj, fadeIn: true});
            }
        }, this);
    }
    /**
     * Given the dom overlay, will reset the login form field to default values
     * @param {DOMOverlay} - The DOMOverlay phaser object
     */
    resetFields(domOverlay) {
        console.log("called reset fields");
        domOverlay.getChildByID("adjective-selector").value = "";
        domOverlay.getChildByID("color-selector").value = "";
        domOverlay.getChildByID("animal-selector").value = "";
        domOverlay.getChildByID("state-selector").value = "";
        domOverlay.getChildByID("grade-selector").value = "";
        domOverlay.getChildByID("gender-selector").value = "";
        domOverlay.getChildByID("login-sessionName").value = "";
    }

    /**
     * Helper function to randomize form selection order.
     * @param {Array} - The array to scramble.
     */
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }  
    }
    
    /**
     * Helper function to capitalize the first letter (for selection options)
     * @param {String} - The string to capitalize.
     */      
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Helper function to populate a select HTML element with options in a random order.
     * @param {HTMLElement} - The element to append options to.
     * @param {array} - The options, array of strings, to scramble and append.
     */   
    appendSelectOptionsRandomly(selector, options, keepOrder=false) {
        if (!keepOrder) {
            this.shuffleArray(options);
        }
        for (let i = 0; i < options.length; i++) {
            let option = document.createElement("option");
            option.value = options[i];
            option.textContent = this.capitalizeFirstLetter(options[i]);
            selector.appendChild(option);
        }
    }

    /**
     * Generates floaties that randomly move and grow/shrink in the background.
     * @param {INT} n - How many floaties to spawn.
     * @returns {Array} - An array with all the floaties.
     */    
    spawnBackgroundFloaties(n) {
        let allFloaties = [];
        for (let i = 0; i < n; i++) {
            // Settings for background floaties
            let maxScale = 0.20 * Math.random(); // their potential max size
            let maxSpeed = 35; // their potential max speed
            let screenWidth = 360; // width of box to randomly spawn floaties
            let screenHeight = 720; // height of box to randomly spawn floaties

            let myFloaty = this.floaty.create(screenWidth * Math.random(), screenHeight * Math.random(), 'fluff_dark');
            myFloaty.setScale(maxScale).setDepth(0.5).setAlpha(0.15);

            // Randoly sets speed to some percentage of its max speed, in a random direction
            myFloaty.setVelocity(Phaser.Math.Between(-maxSpeed * Math.random(), maxSpeed * Math.random()), 
                                 Phaser.Math.Between(-maxSpeed * Math.random(), maxSpeed * Math.random()));
            
            this.tweens.add({
                targets: myFloaty,
                maxScale: maxScale + 0.07,
                duration: 1000 + (Math.random() * 5000),
                ease: 'Power1',
                yoyo: true,
                repeat: -1
            });
            allFloaties.push(myFloaty);
        }
    }

    // Takes in a rawuserdata, which is the raw string of a username
    // formatted after they sign in. Typically this should be stored in
    // localstorage, and retrieved to be put into this function.
    formatUserData(rawuserdata) {
        // splitting by "-" produces an array with the following indices:
        // 0 - animal adjective
        // 1 - animal color
        // 2 - animal
        // 3 - state
        // 4 - grade
        // 5 - gender
        // 6 - sessionid
        let userdata = rawuserdata.split("-");

        // formatting userdata to perfectly match values
        userdata[2] = this.capitalizeFirstLetter(userdata[2]);
        userdata[3] = userdata[3].toUpperCase();
        userdata[4] = this.capitalizeFirstLetter(userdata[4]).replace("_", "-");
        if (userdata[5] == "prefer_not_to_say") {
            userdata[5] = "Prefer not to say";
        } else if (userdata[5] == "non_binary") {
            userdata[5] = "Non-binary";
        } else if (userdata[5] == "third_gender"){
            userdata[5] = "Third gender";
        } else {
            userdata[5] = this.capitalizeFirstLetter(userdata[5]);
        }
        return userdata;
    }
}

export default LoginScreen;