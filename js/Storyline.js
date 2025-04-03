class Storyline {
	constructor({
		storyID = "",
		lineIndencies = [-1],
		linePointerIndex = 0,
		dialogueList = [],
	} = {}) {
		this.storyID = storyID;
		this.lineIndecies = lineIndencies;
		this.dialogueList = dialogueList;
		this.linePointerIndex = linePointerIndex;
	}

	setStoryID(storyID) {
		this.storyID = storyID;
		this.linePointerIndex = 0;
		this.lineIndecies = [-1];
	}

	answerResponse(answer) {
		this.lineIndecies.push(answer);
		this.lineIndecies.push(-1);
		this.linePointerIndex += 2;
	}

	goBack() {
		this.lineIndecies.pop();
		this.lineIndecies.pop();
		this.linePointerIndex -= 2;
		this.lineIndecies[this.linePointerIndex]++;
	}

	getTotalLines() {
		let currentScene = Storyline.prototype.acts[this.storyID][gameModule.getTeam()];
		let currentLine = currentScene;
		let currentIndex;
		let counter;

		for (let i = 0; i < this.lineIndecies.length;) {
			if ((i + 1) && (typeof (this.lineIndecies[i + 1]) == "string")) {
				currentLine = currentLine[this.storyID + "_" + this.lineIndecies[i] + "_" + this.lineIndecies[i + 1]];
				i += 2;
			} else {
				currentIndex = this.lineIndecies[i];
				counter = currentIndex;
				break;
			}
		}

		while (currentScene[currentIndex]) {
			currentIndex++;
			counter++;
		}

		return counter;
	}

	hasNext() {
		let currentScene = Storyline.prototype.acts[this.storyID][gameModule.getTeam()];
		let currentLine = currentScene;
		for (let i = 0; i < this.lineIndecies.length;) {
			if ((i + 1 < this.lineIndecies.length) && (typeof (this.lineIndecies[i + 1]) == "string")) {
				currentLine = currentLine[this.storyID + "_" + this.lineIndecies[i] + "_" + this.lineIndecies[i + 1]];
				i += 2;
			} else {
				return currentLine[this.lineIndecies[i] + 1] != undefined;
			}
		}
	}

	next() {
		let currentScene = Storyline.prototype.acts[this.storyID][gameModule.getTeam()];
		let currentLine = currentScene;
		let counter = 0;
		for (let i = 0; i < this.lineIndecies.length;) {
			if ((i + 1 < this.lineIndecies.length) && (typeof (this.lineIndecies[i + 1]) == "string")) {
				if (typeof (this.lineIndecies[i]) == "number") {
					counter += this.lineIndecies[i];
				}

				currentLine = currentLine[this.storyID + "_" + this.lineIndecies[i] + "_" + this.lineIndecies[i + 1]];
				i += 2;
			} else {
				this.lineIndecies[i]++;
				counter += this.lineIndecies[i];
				currentLine = currentLine[this.lineIndecies[i]];
				break;
			}
		}
		return [currentLine, counter];
	}
}

class GameFail {
	constructor({
		failID = "",
		failText = "",
	} = {}) {
		this.failID = failID;
		this.failText = failText;
	}

	displayFail() {
		document.querySelector("#failScreen").style.display = "flex";
		document.querySelector("#failReason").innerHTML = this.failText;
		document.querySelector("#failType > small").textContent = "Fail ID: " + this.failID;
		document.querySelector("#failScreen > h1").textContent = GameFail.prototype.failTitle[Math.floor(Math.random() * GameFail.prototype.failTitle.length)];
	}
}
GameFail.prototype.failTitle = [
	"DEED UNDONE",
	"PURPOSE LOST",
	"FIE ON'T",
	"TASK NAUGHT",
	"FOILED NOW",
	"UNDONE US",
	"NO SUCCESS",
	"AIM MISSED",
	"PLOT FAILED",
	"DESIGN LOST",
	"HOPES DASHED",
	"FALLEN SO",
	"LOST LABOR",
	"WRECKED NOW",
	"NO FRUIT",
	"QUEST VAIN",
	"GAME LOST",
	"VAIN STRENGTH",
	"BAD END",
	"CAUSE COLD",
];

Storyline.prototype.acts = {
	["Tutorial"]: {
		displayName: "Tutorial",
		["teamConspirators"]: {
			[0]: {
				dialogue: new Dialogue("Welcome to the tale of Julius Caesar! Before we get started, let's roll through a <b>quick tutorial</b>, shall we?"),
			},
			[1]: {
				dialogue: new Dialogue("Ever heard of the Henry Stickmin Collection, you know... this game? <br> <img src=\"https://m.media-amazon.com/images/M/MV5BZDI0Nzg0OWItODYwNC00NDJkLThlNDEtMDg5ODM3ODUyMjZiXkEyXkFqcGc@._V1_.jpg\" height=150> <br> Probably not, right? Well, let's say that you'll be <i>one like them.</i>"),
			},
			[2]: {
				dialogue: new Dialogue("Here's the deal: as apart of Team Conspirators, your mission is to kill Caesar and take back the Roman Empire for ourselves, or perhaps for the \"better of Rome.\""),
			},
			[3]: {
				dialogue: new Dialogue("How are you going to do that? Well, you'll have the power to enter people's minds and control their decisions - sometimes it helps you get closer to the plan, other times it might just go <i>horribly wrong...</i>."),
			},
			[0]: {
				dialogue: new Dialogue("What do I mean by that, exactly? Well, let's play through Act 1 : Scene 1 as a demonstration, <i>shalt we</i>?"),
				options: [
					new OptionElement("Yes, let's do it!", "thumb_up", "Yes"),
					new OptionElement("What's a Julius Caesar?", "thumb_down", "No"),
				],
				optionsConfig: {
					timedQuestion: 0,
					instantFeedback: true,
					appear: "afterDialogue"
				}
			},
			["Tutorial_0_Yes"]: {
				[0]: {
					dialogue: new Dialogue("Alright... here we go!!!"),
					next: "A1_S1"
				}
			},
			["Tutorial_0_No"]: {
				[0]: {
					dialogue: new Dialogue("<b>Wrong answer.</b>", "crimson"),
					fail: new GameFail({
						failID: "TUTORIAL_FAIL",
						failText: "why are you here then"
					}
					)
				},
			},
		}
	},
	["A1_S1"]: {
		displayName: "Act 1: Scene 1",
		["teamConspirators"]: {
			[0]: {
				dialogue: new StageDirections("<b>Flavius</b> and <b>Murellus</b> enter and speak to a <b>Carpenter, Cobbler,</b> and some other commoners.")
			},
			[1]: {
				dialogue: new Character("Flavius", "Both of you lazy men, get off the streets! What, yall think today is a holiday? Don't you know yall mechanicals be out on the streets without their uniforms? On a <b dialogue-speed=100>WORK DAY??</b><br><u>[Carpenter]</u>, talk to me. What is your profession?", "shadow-purple"),
				options: [
					new OptionElement("I'm a carpenter, sir.", "forest", "IsCarpenter"),
					new OptionElement("I plead the fifth, sir.", "volume_off", "PleadFifth"),
					new OptionElement("You can't speak to me like that. What is YOUR profession?", "history", "Retaliation")
				],
				optionsConfig: {
					timedQuestion: 0,
					instantFeedback: true,
					appear: "afterDialogue"
				}
			},
			["A1_S1_1_IsCarpenter"]: {

			},
			["A1_S1_1_PleadFifth"]: {
				[0]: {
					dialogue: new Character("Flavius", "You dare to speak against me? Why don't we tell the WHOLE senate this.<br>Maybe then you'll tell me.", "shadow-purple"),
					fail: new GameFail({
						failID: "PleadingTheFifth",
						failText: "You could've just said you were a carpenter..."
					})
				}
			},
			["A1_S1_1_Retaliation"]: {

			}
		}
	}
}
