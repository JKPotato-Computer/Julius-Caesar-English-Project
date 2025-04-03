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
	}

	hasNext() {
		let currentScene = Storyline.prototype.acts[this.storyID][gameModule.getTeam()];
		let currentLine = currentScene;
		for (let i = 0; i < this.lineIndecies.length;) {
			if ((i + 1 < this.lineIndecies.length) && (typeof (this.lineIndecies[i + 1]) == "string")) {
				currentLine = currentLine[this.storyID + "_" + this.lineIndecies[i] + "_" + this.lineIndecies[i + 1]];
				i += 2;
			} else {
				currentLine = currentLine[this.lineIndecies[i++]];
			}
		}
		let nextScene = Object.values(currentScene);
		if (nextScene.length > (this.lineIndecies.length + 1)) return true;
		return false;
	}

	next() {
		let currentScene = Storyline.prototype.acts[this.storyID][gameModule.getTeam()];
		let currentLine = currentScene;
		for (let i = 0; i <= this.linePointerIndex;) {
			if ((i + 1 < this.lineIndecies.length) && (typeof (this.lineIndecies[i + 1]) == "string")) {
				currentLine = currentLine[this.storyID + "_" + this.lineIndecies[i] + "_" + this.lineIndecies[i + 1]];
				i += 2;
			} else {
				if (i == this.linePointerIndex) {
					this.lineIndecies[i]++;
				}
				currentLine = currentLine[this.lineIndecies[i++]];
			}
		}
		return currentLine;
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
		const failText = document.createElement("p");
		failText.textContent = this.failText;
		failText.classList.add("failText");
		document.querySelector("#dialoguePage").appendChild(failText);
	}
}

Storyline.prototype.acts = {
	["Tutorial"]: {
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
			[4]: {
				dialogue: new Dialogue("What do I mean by that, exactly? Well, let's play through Act 1 : Scene 1 as a demonstration, <i>shalt we</i>?"),
				options: [
					new OptionElement("Yes, let's do it!", "thumb_up", "Yes"),
					new OptionElement("No. Julius Caesar was never real.", "thumb_down", "No"),
				],
				optionsConfig: {
					timedQuestion: 0,
					instantFeedback: true,
					appear: "afterDialogue"
				}
			},
			["Tutorial_4_Yes"]: {
				[0]: {
					dialogue: new Dialogue("Alright... here we go!!!"),
					next: "A1_S1"
				}
			},
			["Tutorial_4_No"]: {
				[0]: {
					dialogue: new Dialogue("<b>Wrong answer.</b>", "crimson"),
					fail: new GameFail("TutorialFail", "What a shame. You failed the tutorial. Not even Casca is that dumb!")
				},
			}
		}
	},
	["A1_S1"]: {
		["teamConspirators"]: {

		}
	}
}