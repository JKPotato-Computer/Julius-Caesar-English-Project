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

	hasNext() {
		let currentScene = Storyline.prototype.acts[this.storyID][gameModule.getTeam()];
		let currentLine = currentScene;
		for (let i = 0;i < this.lineIndecies.length;) {
			if ((i + 1 < this.lineIndecies.length) && (typeof(this.lineIndecies[i + 1]) == "string")) {
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
		for (let i = 0;i < this.lineIndecies.length;) {
			if ((i + 1 < this.lineIndecies.length) && (typeof(this.lineIndecies[i + 1]) == "string")) {
				currentLine = currentLine[this.storyID + "_" + this.lineIndecies[i] + "_" + this.lineIndecies[i + 1]];
				i += 2;
			} else {
				this.lineIndecies[i]++;
				currentLine = currentLine[this.lineIndecies[i]];
				break;
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
		console.log(this.failID);
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
		["teamConspirators"]: {
			/*
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
			*/
			[0]: {
				dialogue: new Dialogue("What do I mean by that, exactly? Well, let's play through Act 1 : Scene 1 as a demonstration, <i>shalt we</i>?"),
				options: [
					new OptionElement("Yes, let's do it!", "thumb_up", "Yes"),
					new OptionElement("What's a Julius Caesar?", "thumb_down", "No"),
				],
				optionsConfig: {
					timedQuestion: 5000,
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
						failText: "dude, you're in the wrong universe. this is not romeo and juliet.<br>come back later for a romeo and juliet edition ;)"}
					)
				},
			},
			["Tutorial_0_Void"]: {
				[0]: {
					dialogue: new Dialogue("The Mongol Empire of the 13th and 14th centuries was the largest contiguous empire in history.[4] Originating in present-day Mongolia in East Asia, the Mongol Empire at its height stretched from the Sea of Japan to parts of Eastern Europe, extending northward into parts of the Arctic;[5] eastward and southward into parts of the Indian subcontinent, mounted invasions of Southeast Asia, and conquered the Iranian Plateau; and reached westward as far as the Levant and the Carpathian Mountains.")
				}
			}
		}
	},
	["A1_S1"]: {
		["teamConspirators"]: {

		}
	}
}