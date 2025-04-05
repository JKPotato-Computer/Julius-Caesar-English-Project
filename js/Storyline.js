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

  setStoryID(storyID, safeTransition) {
    this.storyID = storyID;
    if (!safeTransition) {
      this.linePointerIndex = 0;
      this.lineIndecies = [-1];
      this.dialogueList = [];
    }
  }

  answerResponse(answer) {
    this.lineIndecies.push(answer);
    this.lineIndecies.push(-1);
    this.linePointerIndex += 2;
  }

  goBack(replayDialogue) {
    let counterPop = this.lineIndecies.pop();
    this.lineIndecies.pop();
    this.linePointerIndex -= 2;

    if (!replayDialogue) {
      this.lineIndecies[this.linePointerIndex]++;
    } else {
      this.lineIndecies[this.linePointerIndex]--;
      for (let i = 0; i <= counterPop + 1; i++) {
        this.dialogueList.pop();
      }
    }
  }

  pauseStory() {
    this.lineIndecies[this.linePointerIndex]--;
    this.dialogueList.pop();
  }

  hasFail() {
    let currentScene =
      Storyline.prototype.acts[this.storyID][gameModule.getTeam()];
    let currentLine = currentScene;
    for (let i = 0; i < this.lineIndecies.length; ) {
      if (
        i + 1 < this.lineIndecies.length &&
        typeof this.lineIndecies[i + 1] == "string"
      ) {
        currentLine =
          currentLine[
            this.storyID +
              "_" +
              this.lineIndecies[i] +
              "_" +
              this.lineIndecies[i + 1]
          ];
        i += 2;
      } else {
        break;
      }
    }

    let i = this.lineIndecies[this.linePointerIndex];
    do {
      if (currentLine[i].fail) {
        return true;
      }
      i++;
    } while (currentLine[i]);
    return false;
  }

  getTotalLines() {
    let currentScene =
      Storyline.prototype.acts[this.storyID][gameModule.getTeam()];
    let currentLine = currentScene;
    let currentIndex;
    let counter;

    for (let i = 0; i < this.lineIndecies.length; ) {
      if (i + 1 && typeof this.lineIndecies[i + 1] == "string") {
        currentLine =
          currentLine[
            this.storyID +
              "_" +
              this.lineIndecies[i] +
              "_" +
              this.lineIndecies[i + 1]
          ];
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
    let currentScene =
      Storyline.prototype.acts[this.storyID][gameModule.getTeam()];
    let currentLine = currentScene;
    for (let i = 0; i < this.lineIndecies.length; ) {
      if (
        i + 1 < this.lineIndecies.length &&
        typeof this.lineIndecies[i + 1] == "string"
      ) {
        currentLine =
          currentLine[
            this.storyID +
              "_" +
              this.lineIndecies[i] +
              "_" +
              this.lineIndecies[i + 1]
          ];
        i += 2;
      } else {
        return currentLine[this.lineIndecies[i] + 1] != undefined;
      }
    }
  }

  next() {
    let currentScene =
      Storyline.prototype.acts[this.storyID][gameModule.getTeam()];
    let currentLine = currentScene;
    let counter = 0;
    let extraParams = "";

    for (let i = 0; i < this.lineIndecies.length; ) {
      if (
        i + 1 < this.lineIndecies.length &&
        typeof this.lineIndecies[i + 1] == "string"
      ) {
        if (typeof this.lineIndecies[i] == "number") {
          counter += this.lineIndecies[i];
        }

        currentLine =
          currentLine[
            this.storyID +
              "_" +
              this.lineIndecies[i] +
              "_" +
              this.lineIndecies[i + 1]
          ];
        extraParams += this.lineIndecies[i + 1] + " ";
        i += 2;
      } else {
        this.lineIndecies[i]++;
        counter += this.lineIndecies[i];
        currentLine = currentLine[this.lineIndecies[i]];

        if (extraParams != "") {
          currentLine.extraParams = extraParams;
        }

        this.dialogueList.push(currentLine);
        break;
      }
    }

    return [currentLine, counter];
  }
}

class GameFail {
  constructor({ failID = "", failText = "" } = {}) {
    this.failID = failID;
    this.failText = failText;
  }

  displayFail() {
    document.querySelector("#failScreen").style.display = "flex";
    document.querySelector("#failReason").innerHTML = this.failText;
    document.querySelector("#failType > small").textContent =
      "Fail ID: " + this.failID;
    document.querySelector("#failScreen > h1").textContent =
      GameFail.prototype.failTitle[
        Math.floor(Math.random() * GameFail.prototype.failTitle.length)
      ];

    document.querySelector("#failCount").textContent =
      "Fails: " + gameModule.getSaveData().fails.fails;
    document.querySelector("#uniqueFails").textContent =
      "Unique Fails: " +
      gameModule.getSaveData().fails.discoveredFails.length +
      "/60";
    document.querySelector("#endings").textContent =
      "Endings: " + gameModule.getSaveData().endings.length + "/5";
  }

  reset() {
    document.querySelector("#failScreen").style.display = "none";
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
        dialogue: new Dialogue(
          "Hey there, welcome to the Julius Caesar: Text-Based Game™."
        ),
      },
      [1]: {
        dialogue: new Dialogue(
          "Who am I, you may ask?<br>I... don't really know. But, <i>you</i> are a ghost! A special ghost... one that can infiltrate the minds of others and create some <i>hefty</i> decisions."
        ),
      },
      [2]: {
        dialogue: new Dialogue(
          "As a Conspirator, you'll be trying to assassinate Julius Caesar for the good of Rome! <pause duration=1000> Or, you can take Rome for yourselves. The fate lies on YOU."
        ),
      },
      [3]: {
        dialogue: new Dialogue(
          "So, are thou ready to head to Act 1: Scene 1 and try stuff out?"
        ),
        options: [
          new OptionElement("Yes, let's do it!", "thumb_up", "Yes"),
          new OptionElement("What's a Julius Caesar?", "thumb_down", "No"),
        ],
        optionsConfig: {
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["Tutorial_3_Yes"]: {
        [0]: {
          dialogue: new Dialogue("Alright... here we go!!!"),
          next: "A1_S1",
        },
      },
      ["Tutorial_3_No"]: {
        [0]: {
          dialogue: new Dialogue("<b>Wrong answer.</b>", "crimson"),
          fail: new GameFail({
            failID: "TUTORIAL_FAIL",
            failText: "why are you here then",
          }),
        },
      },
    },
  },
  ["A1_S1"]: {
    displayName: "Act 1: Scene 1",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new StageDirections(
          "<b>Flavius</b> and <b>Murellus</b> enter and speak to a <b>Carpenter, Cobbler,</b> and some other commoners."
        ),
      },
      [1]: {
        dialogue: new Character(
          "Flavius",
          "Both of you lazy men, get off the streets! What, yall think today is a holiday? Don't you know yall mechanicals be out on the streets without their uniforms? On a <b dialogue-speed=100>WORK DAY??</b>",
          "shadow-purple"
        ),
      },
      [2]: {
        dialogue: new Character(
          "Flavius",
          "<u>[Carpenter]</u>, talk to me. What is your profession?",
          "shadow-purple"
        ),
        options: [
          new OptionElement("I'm a carpenter, sir.", "forest", "IsCarpenter"),
          new OptionElement(
            "I plead the fifth, sir.",
            "volume_off",
            "PleadFifth"
          ),
          new OptionElement(
            "You can't speak to me like that. What is YOUR profession?",
            "history",
            "Retaliation"
          ),
        ],
        optionsConfig: {
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["A1_S1_2_IsCarpenter"]: {
        [0]: {
          dialogue: new Character(
            "Murellus",
            "Well, where's your leather apron and ruler? Why are you trying to stand out with your best apparel?",
            "charcoal-black"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Murellus",
            "And, you, [Cobbler]. What do you do?",
            "charcoal-black"
          ),
        },
        [2]: {
          dialogue: new Character(
            "Cobbler",
            "I'm just a plain old cobbler, unlike any other men here.",
            "burnt-orange"
          ),
        },
        [3]: {
          dialogue: new Character(
            "Murellus",
            "Wh- what do you do??<br>Tell me already!",
            "charcoal-black"
          ),
        },
        [4]: {
          dialogue: new Character(
            "Cobbler",
            "Just a humble occupation that I perfect, good sir. Or should I say, <i>mending thy bad soles.</i>",
            "burnt-orange"
          ),
        },
        [5]: {
          dialogue: new Character(
            "Murellus",
            {
              text: "YOU <b>RASCAL!</b> <pause duration=150> WHAT. <pause duration=150> DO. <pause duration=150> YOU. <pause duration=150> DO???",
              color: "dark-red",
            },
            "charcoal-black"
          ),
          options: [
            new OptionElement(
              "Good sir! Calm down, don't get angry at me. If you hear me out, I'll tell you awl.",
              "self_improvement",
              "CalmDown"
            ),
            new OptionElement(
              "Good sir! Like I said, I am a mender of bad soles.",
              "volume_off",
              "MenderOfSoles"
            ),
          ],
          optionsConfig: {
            timedQuestion: 5000,
            instantFeedback: true,
            appear: "afterDialogue",
          },
        },
        ["A1_S1_5_MenderOfSoles"]: {
          [0]: {
            dialogue: new Character(
              "Murellus",
              "If you're so much of a mender of soles, why don't thou mend an answer for once?",
              "charcoal-black"
            ),
          },
          [1]: {
            dialogue: new Character(
              "Cobbler",
              "I'm <pause duration=1000> a cobbler.",
              "burnt-orange"
            ),
          },
          [2]: {
            dialogue: new Character(
              "Murellus",
              "And I, the humble bringer of doom, bid thee farewell!",
              "charcoal-black"
            ),
            fail: new GameFail({
              failID: "MenderOfSoles",
              failText: "Well. I didn't expect that.",
            }),
          },
        },
        ["A1_S1_5_Void"]: {},
      },
      ["A1_S1_2_PleadFifth"]: {
        [0]: {
          dialogue: new Character(
            "Flavius",
            "What is the fifth?<pause=1000>",
            "shadow-purple"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Murellus",
            "Who is the fifth?",
            "charcoal-black"
          ),
          fail: new GameFail({
            failID: "PleadingTheFifth",
            failText:
              "Sorry, wrong time period. You're about 1837 years late since the fifth amendment was ratified in the United States.",
          }),
        },
      },
      ["A1_S1_2_Retaliation"]: {
        [0]: {
          dialogue: new Character(
            "Flavius",
            "Well, I'm apart of the <b>senate</b>, and you're going to be sent on a one way trip to the <b>Senate.</b>",
            "shadow-purple"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Flavius",
            "Maybe THEN you'll tell all of us your <i>professión</i>.<pause=1000>",
            "shadow-purple"
          ),
          fail: new GameFail({
            failID: "RetaliatingFlavius",
            failText: "Just say you're a carpenter.",
          }),
        },
      },
    },
  },
};
