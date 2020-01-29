/**
 * Represents the level stage scene
 * @extends Phaser.Scene
 */
class QuizScreen extends Phaser.Scene {

    /**
     * Creates a quiz screen scene.
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
        console.log(data);
        // Color Constants
        let ORANGE = 0xFE5832;
        let DARK_BLUE = 0x002664;
        let CYAN = 0x21EEE9;
        let BLUE = 0x006FFF;
        let WHITE = 0xFFFFFF;
        let DARKER_BLUE = 0x0e1e2d;
        let BLACK = 0x000000;

        // retrieve question bank
        let questions = data.cache.json.entries.entries.quizQuestions.questions;

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x000000, 0.80);
        this.graphics.fillRect(0, 0, 360, 740);


        // Quiz related variables
        this.selectedChoice = null;
        this.quizQuestion = questions[5]//questions[Math.floor(questions.length * Math.random())];
        this.points = this.quizQuestion.worth;


        // Initialize Quiz Layout
        this.questionBox = this.add.rectangle(180, 165, 320, 175, BLUE).setAlpha(1.0).setStrokeStyle(2, WHITE, 1);
        this.add.rectangle(180, 430, 320, 280, BLACK).setAlpha(1.0).setStrokeStyle(2, WHITE, 1);

        // Question prompt
        this.prompt = this.add.text(30, 120, "", {fontFamily: 'Teko, sans-serif', fontSize: '26pt', color: '#FFFFFF', wordWrap: { width: 290, useAdvancedWrap: true }}).setAlpha(0);
        this.tweens.add({ targets: this.prompt, alpha: 1.0, duration: 600, ease: 'power4' });

        // Point worth above question prompt
        this.pointWorth = this.add.text(30, 80, "(" + this.points + " Points)", {fontFamily: 'Teko, sans-serif', fontSize: '26pt', color: '#FFFFFF', wordWrap: { width: 290, useAdvancedWrap: true }}).setAlpha(0);
        this.tweens.add({ targets: this.pointWorth, alpha: 1.0, duration: 600, ease: 'power4' });

        this.actionFeedback = this.add.text(20, 263, "", {fontFamily: 'Teko, sans-serif', fontSize: '18pt', fontStyle: 'italic', color: '#FFFFFF', wordWrap: { width: 320, useAdvancedWrap: true }});

        this.submitFeedback = this.add.text(180, 685, "", {fontFamily: 'Teko, sans-serif', fontSize: '32pt', color: '#FFFFFF', wordWrap: { width: 290, useAdvancedWrap: true }}).setAlpha(0);
        this.submitFeedback.setOrigin(0.5, 0.5);
        this.choices = [];


        this.submitBtn = this.add.image(180, 620, "submit_btn").setScale(0.40).setAlpha(0);
        this.submitBtn.addListener("pointerup", this.bindFn(function(){
            this.submitFeedback.setAlpha(1.0);

            if (this.quizQuestion.type == "drag and drop") {
                this.selectedChoice = this.getDragAndDropSelectedChoice(this.quizQuestion, this.questionBox, this.choices, this.actionFeedback);
                console.log("SELECTED CHOICE IS " + this.selectedChoice);
            }

            if (this.quizQuestion.correct == this.selectedChoice) {
                
                // On correct
                this.submitFeedback.text = "+" + this.points + " POINTS!";
                this.submitFeedback.setColor("#008000");
    
                data.scorekeeping.addKnowledgePoints(this.points);
                let that = this;

                this.time.addEvent({
                    delay: 1000,
                    callback: function () {
                        that.scene.stop();
                        that.scene.resume("level" + data.level);
                    }
                });
            
            } else if (this.selectedChoice != null) {
            
                // on incorrect
                this.submitFeedback.text = "Try Again";
                this.submitFeedback.setColor("#FF0000");
                this.halvePointsAndDisplay();
    
                for (let i = 0; i < this.choices.length; i++) { 
                    if (i == this.selectedChoice) {
                        this.choices[i].setColor("#FF0000");
                    }
                }
            }
        }));

        
        
        this.displayQuizQuestion(this.quizQuestion);
        
        
    }

    // Will get the selected choice during a drag and drop question
    // Given the array of choice objects (phaser text objects) and the question, and questionBox (phaser rect)
    // and the feedback area
    // Will return the id (int) (the position of the choice in this.question array) if valid.
    // Wil return null if multiple/none choices are in question box
    // or if the current question is not a drag and drop question.
    // Will also update the feedback text to reflect results of user input.
    getDragAndDropSelectedChoice(question, questionBox, choices, actionFeedback) {
        if (question.type == "drag and drop") {
            let potentialChoices = [];
            for (let i = 0; i < choices.length; i++) {
                let minx = questionBox.x - (questionBox.width / 2);
                let maxx = questionBox.x + (questionBox.width / 2);
                let miny = questionBox.y - (questionBox.height / 2);
                let maxy = questionBox.y + (questionBox.height / 2);

                if (choices[i].x > minx && choices[i].x < maxx &&
                    choices[i].y > miny && choices[i].y < maxy) {
                       potentialChoices.push(choices[i]);
                }
                
            }
            if (potentialChoices.length > 1) {
                actionFeedback.text = "Make sure only one answer is in the blue box.";
                return null;
            } else if (potentialChoices.length == 0) {
                actionFeedback.text = "Make sure your answer is in the blue box.";
                return null;
            } else {
                // we must be a valid answer
                // so find its index
                for (let i = 0; i < question.options.length; i++) {
                    if (question.options[i] == potentialChoices[0].text) {
                        return i;
                    }
                }

                // if for some reason the answer didn't match...
                return null;
            }
        } else {
            return null;
        }
    }

    // Given a quiz question, will display it accordingly based on its type
    displayQuizQuestion(question) {
        console.log(question);
        this.prompt.text = question.prompt;
        if (question.type == "multiple choice") {
            this.actionFeedback.text = "Click on an answer!";

            for (let i = 0; i < question.options.length; i++) {
                console.log(question.options[i])
                
                let option;
                option = this.add.text(400, 300 + (75 * i), question.options[i], {fontFamily: 'Teko, sans-serif', fontSize: '18pt', color: '#FFFFFF', wordWrap: { width: 290, useAdvancedWrap: true }}).setAlpha(0);
                option.setInteractive();
                option.addListener("pointerdown", () => {
                    this.onMultipleChoiceClick(i);
                });

                this.choices[i] = option;

                // intro animations
                this.tweens.add({ targets: this.choices[i], alpha: 1.0, duration: 500 + (i * 350), ease: 'power4' });
                this.tweens.add({ targets: this.choices[i], x: 30, y: 300 + (75 * i), duration: 500 + (i * 250), ease: 'Quad.easeInOut' });
            
            }
        } else if (question.type == "drag and drop") {
            // assign each choice a random x and y coordinate within the orange box.
            // also assign choice an int so we can later check it for the right answer
            // fade it in one at a time.
            // make it so that the user can drag it to change its location

            this.actionFeedback.text = "Drag one answer to the blank!";

            // display the submit button instantly
            this.tweens.add({ targets: this.submitBtn, alpha: 1.0, duration: 1000, ease: 'power4' });
            this.submitBtn.setInteractive();
            for (let i = 0; i < question.options.length; i++) {
                // buffer to keep items in the box
                let buffer = 50;

                // from x=20 to x=340
                let randx = (Math.random() * (320 - buffer)) + 20 + buffer;

                // from y=290 to y=570
                let randy = (Math.random() * (280 - buffer)) + 290 + buffer;

                let option;
                option = this.add.text(randx, randy, question.options[i], {fontFamily: 'Teko, sans-serif', fontSize: '18pt', color: '#FFFFFF', wordWrap: { width: 200, useAdvancedWrap: true }}).setAlpha(0);
                option.setOrigin(0.5, 0.5);
                option.setInteractive({ draggable: true });
                option.on('drag', function(pointer, dragX, dragY){
                    option.x = dragX;
                    option.y = dragY
                });



                this.choices[i] = option;
                this.tweens.add({ targets: this.choices[i], alpha: 1.0, duration: 500 + (i * 350), ease: 'power4' });
            }

            // other details:
            // there is going to be no selection behavior for drag and drop
            // upon clicking submit, it will check if the choice's coordinates are inside a bounding box (question blank)
            // if no answer, or more than one answer is in the bounding box, tell the user
        }
    }

    // Selects choice and updates colors
    onMultipleChoiceClick(numChoice) {
        // If this is the first time selecting an answer, show the submit button
        if (this.selectedChoice == null) {
            this.tweens.add({ targets: this.submitBtn, alpha: 1.0, duration: 1000, ease: 'power4' });
            this.submitBtn.setInteractive();
        }

        this.submitFeedback.text = "";
        this.selectedChoice = numChoice;
        for (let i = 0; i < this.choices.length; i++) {
            if (i == numChoice) {
                this.choices[i].setColor("#006FFF");
                this.tweens.add({ targets: this.choices[i], x: 60, y: 300 + (75 * i), duration: 1000, ease: 'Quad.easeInOut' });
            } else {
                this.choices[i].setColor("#FFFFFF");
                this.tweens.add({ targets: this.choices[i], x: 30, y: 300 + (75 * i), duration: 1000, ease: 'Quad.easeInOut' });
            }
        }
    }

    halvePointsAndDisplay() {
        this.points = Math.floor(this.points / 2);
        this.pointWorth.text = "(" + this.points + " Points)";
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
}

export default QuizScreen;