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

        let questions = data.cache.json.entries.entries.quizQuestions.questions;
        console.log(questions);

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x000000, 0.80);
        this.graphics.fillRect(0, 0, 360, 740);
        /*this.add.text(120, 150, "QUIZ", 
        {fontFamily: 'Teko, sans-serif', fontSize: '40pt', color: '#FFFFFF'}).setDepth(1);*/


        // Quiz related variables
        this.selectedChoice = null;
        this.quizQuestion = questions[Math.floor(questions.length * Math.random())];
        this.points = this.quizQuestion.worth;


        // Initialize Quiz Layout
        this.prompt = this.add.text(30, 120, "", {fontFamily: 'Teko, sans-serif', fontSize: '26pt', color: '#FFFFFF', wordWrap: { width: 290, useAdvancedWrap: true }}).setAlpha(0);
        this.tweens.add({ targets: this.prompt, alpha: 1.0, duration: 600, ease: 'power4' });

        this.pointWorth = this.add.text(30, 80, "(" + this.points + " Points)", {fontFamily: 'Teko, sans-serif', fontSize: '26pt', color: '#FFFFFF', wordWrap: { width: 290, useAdvancedWrap: true }}).setAlpha(0);
        this.tweens.add({ targets: this.pointWorth, alpha: 1.0, duration: 600, ease: 'power4' });

        this.choices = [this.choice1, this.choice2, this.choice3, this.choice4];

        this.submitBtn = this.add.image(180, 620, "submit_btn").setScale(0.40).setAlpha(0);
        this.submitBtn.addListener("pointerup", this.bindFn(function(){
            this.feedback.setAlpha(1.0);
            if (this.quizQuestion.correct == this.selectedChoice) {
                
                // On correct
                // add question's point worth value to the score
                // Indicate correctness by saying "Correct" in green letters under the submit button
                this.feedback.text = "+" + this.points + " Points!";
                this.feedback.setColor("#008000");
    
                data.gameObj.GLOBAL.SCORE += this.points;
                let that = this
                this.time.addEvent({
                    delay: 1000,
                    callback: function () {
                        that.scene.stop();
                        that.scene.resume("level" + data.level);
                    }
                });
    
                // wait then and resume scene.

                /*
                this.data.gameObj.GLOBAL.SCORE += this.points;
                let that = this;
                this.time.addEvent({
                    delay: 1000,
                    loop: false,
                    callback: function() {
                            that.scene.resume("level" + data.level);
                            that.scene.stop();
                    }
                });
                */
            
            } else {
            
                // on incorrect
                // Indicate wrongess by saying "Wrong" in red letters under the submit button
                this.feedback.text = "WRONG";
                this.feedback.setColor("#FF0000");
                this.halvePointsAndDisplay();
    
                // highlight the correct answer
                // actually I removed this so the user can guess (while losing points) 
                // to eventually get it right
                for (let i = 0; i < this.choices.length; i++) { /*
                    if (i == this.quizQuestion.correct) {
                        this.choices[i].setColor("#008000");
                        this.tweens.add({ targets: this.choices[i], x: 60, y: 300 + (75 * i), duration: 1000, ease: 'Quad.easeInOut' });
                    } else */ if (i == this.selectedChoice) {
                        this.choices[i].setColor("#FF0000");
                    }
                }
    
                // wait like 3000ms and resume scene
                
    
            }
        }));

        this.feedback = this.add.text(135, 650, "", {fontFamily: 'Teko, sans-serif', fontSize: '32pt', color: '#FFFFFF', wordWrap: { width: 290, useAdvancedWrap: true }}).setAlpha(0);

        this.displayQuizQuestion(this.quizQuestion);
        
        
    }

    // Given a quiz question, will display it accordingly based on its type
    displayQuizQuestion(question) {
        console.log(question);
        if (question.type == "multiple choice") {
            this.prompt.text = question.prompt;

            for (let i = 0; i < question.options.length; i++) {
                console.log(question.options[i])

                // Create rectangle background for text
                /*
                this.graphics.fillStyle(0x006FFF, 0.80);
                this.graphics.fillRect(30, 300 + (75 * i), 290, 50);
                */

                
                // We set its initial x to start offscreen
                this.choices[i] = this.add.text(400, 300 + (75 * i), question.options[i], {fontFamily: 'Teko, sans-serif', fontSize: '18pt', color: '#FFFFFF', wordWrap: { width: 290, useAdvancedWrap: true }}).setAlpha(0);
                this.choices[i].setInteractive();
                this.choices[i].addListener("pointerdown", () => {
                    this.onMultipleChoiceClick(i);
                    console.log(this.selectedChoice);
                });


                // intro animations
                this.tweens.add({ targets: this.choices[i], alpha: 1.0, duration: 500 + (i * 350), ease: 'power4' });
                this.tweens.add({ targets: this.choices[i], x: 30, y: 300 + (75 * i), duration: 500 + (i * 250), ease: 'Quad.easeInOut' });

                // making choice interactive
            
            }
        }
    }

    // Selects choice and updates colors
    onMultipleChoiceClick(numChoice) {
        // If this is the first time selecting an answer, show the submit button
        if (this.selectedChoice == null) {
            this.tweens.add({ targets: this.submitBtn, alpha: 1.0, duration: 1000, ease: 'power4' });
            this.submitBtn.setInteractive();
        }

        this.feedback.text = "";
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

    onSubmitClick(data) {
        this.feedback.setAlpha(1.0);
        if (this.quizQuestion.correct == this.selectedChoice) {
            
            // On correct
            // add question's point worth value to the score
            // Indicate correctness by saying "Correct" in green letters under the submit button
            this.feedback.text = "+" + this.points + " Points!";
            this.feedback.setColor("#008000");

            this.time.addEvent({
                delay: 1000,
                callback: function () {
                    that.countDownTimer(callback);
                }
            });

            // wait then and resume scene.
            this.scene.resume("level" + data.level);
            this.scene.stop();
            /*
            this.data.gameObj.GLOBAL.SCORE += this.points;
            let that = this;
            this.time.addEvent({
                delay: 1000,
                loop: false,
                callback: function() {
                        that.scene.resume("level" + data.level);
                        that.scene.stop();
                }
            });
            */
        
        } else {
        
            // on incorrect
            // Indicate wrongess by saying "Wrong" in red letters under the submit button
            this.feedback.text = "WRONG";
            this.feedback.setColor("#FF0000");
            this.halvePointsAndDisplay();

            // highlight the correct answer
            // actually I removed this so the user can guess (while losing points) 
            // to eventually get it right
            for (let i = 0; i < this.choices.length; i++) { /*
                if (i == this.quizQuestion.correct) {
                    this.choices[i].setColor("#008000");
                    this.tweens.add({ targets: this.choices[i], x: 60, y: 300 + (75 * i), duration: 1000, ease: 'Quad.easeInOut' });
                } else */ if (i == this.selectedChoice) {
                    this.choices[i].setColor("#FF0000");
                }
            }

            // wait like 3000ms and resume scene
            

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