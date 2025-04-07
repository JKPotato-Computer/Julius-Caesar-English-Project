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

    if (replayDialogue) {
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
    let counter = 0;

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
        if (typeof this.lineIndecies[i] == "number") {
          counter += this.lineIndecies[i];
        }
        i += 2;
      } else {
        currentIndex = 0;
        break;
      }
    }

    while (currentLine[currentIndex]) {
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
        },
        [6]: {
          dialogue: new Character(
            "Cobbler",
            "Good sir! Calm down, please don't be angry. All my life, I have worked with the awl. If anything, I can mend you with my tools.",
            "burnt-orange"
          ),
        },
        [7]: {
          dialogue: new Character(
            "Murellus",
            '"Mend me???" You think <i>I</i> am in a fit of rage, you saucy man?',
            "charcoal-black"
          ),
          options: [
            new OptionElement(
              "Nay, your shoes, sir. They might need a bit of shine, don't they?",
              "self_improvement",
              "CalmDown"
            ),
            new OptionElement(
              "Nay! I'm just a mender of bad soles, sir.",
              "steps",
              "MenderOfSoles"
            ),
          ],
          optionsConfig: {
            timedQuestion: 3000,
            instantFeedback: true,
            appear: "afterDialogue",
          },
        },
        ["A1_S1_7_MenderOfSoles"]: {
          [0]: {
            dialogue: new Character(
              "Murellus",
              "And I am the humble bringer of doom, which I bid thou insolent fellow <pause duration=1000> farewell!",
              "charcoal-black"
            ),
            sound: {
              file: "boom.mp3",
              position: "afterDialogue",
            },
            fail: new GameFail({
              failID: "MenderOfSoles",
              failText: "I didn't really expect that, to be honest.",
            }),
          },
        },
        ["A1_S1_7_CalmDown"]: {
          [0]: {
            dialogue: new Character(
              "Murellus",
              "But they don't need any polishing!",
              "charcoal-black"
            ),
          },
          [1]: {
            dialogue: new Character(
              "Flavius",
              "Sorry, Murellus. I couldn't hear you over the dust storm your shoes kicked up 'round thy words.",
              "shadow-purple"
            ),
            sound: {
              file: "boom.mp3",
              position: "afterDialogue",
            },
          },
          [2]: {
            dialogue: new Character(
              "Murellus",
              "I d- <i>*sigh</i> Fine.",
              "charcoal-black"
            ),
            goBack: true,
          },
        },
        ["A1_S1_7_Void"]: {
          [0]: {
            dialogue: new Character(
              "Murellus",
              "Too afeard to speak, eh? [Flavius], what do we say to this vile mechanic?",
              "charcoal-black"
            ),
          },
          [1]: {
            dialogue: new Character(
              "Flavius",
              "He's a cobbler, [Murellus].",
              "shadow-purple"
            ),
          },
          [2]: {
            dialogue: new Character(
              "Murellus",
              "A mute cobbler, [Flavius]! Can't you imagine a Roman who cannot even whimper a word back to us? A fake Roman, I'd say even!",
              "charcoal-black"
            ),
          },
          [3]: {
            dialogue: new Character(
              "Murellus",
              "How about I take your tools and replace them with stones.<br>Then, you'll learn to be a real Roman.",
              "charcoal-black"
            ),
          },
          [4]: {
            dialogue: new Character("Flavius", "...", "shadow-purple"),
            delay: 2000,
            goBack: true,
          },
        },
        [8]: {
          dialogue: new Character(
            "Flavius",
            "But, what brings you out here? Why are you not working?",
            "shadow-purple"
          ),
        },
        [9]: {
          dialogue: new Character(
            "Cobbler",
            "To tire out my shoes and do more work, obviously!",
            "burnt-orange"
          ),
          sound: {
            file: "punchline.mp3",
            position: "afterDialogue",
          },
        },
        [10]: {
          dialogue: new Character(
            "Cobbler",
            "Okay, I just want to celebrate the acts that Caesar commited at Pompey!",
            "burnt-orange"
          ),
        },
        [11]: {
          dialogue: new Character(
            "Murellus",
            "Why should you even bother? What's so significant about Caesar's conquest of Pompey? You've seen it all from the start, climbing on your walls and looking out towers and windows; hell, even to chimney tops. You've seen it all!",
            "charcoal-black"
          ),
        },
        [12]: {
          dialogue: new Character(
            "Murellus",
            "Now you think it's worth taking a holiday and putting on your best clothes? To see something you've watched for the past couple days?<br>A good riddance to thee!",
            "charcoal-black"
          ),
        },
        [13]: {
          dialogue: new Character(
            "Flavius",
            "Go. Begone. Go to the banks of Tiber and weep till its stream touches the shoreline, reflecting on what you just did.",
            "shadow-purple"
          ),
        },
        [14]: {
          dialogue: new StageDirections(
            "<b>CARPENTER, COBBLER,</b> and the <b>COMMONERS</b> leave."
          ),
        },
        [15]: {
          dialogue: new Character(
            "Flavius",
            "We can't let them celebrate Caesar's victory, nor anyone else. Come, head to the capital and start disrobing all ceremonies off the statues.",
            "shadow-purple"
          ),
        },
        [16]: {
          dialogue: new Character(
            "Murellus",
            "Are we even allowed to do that? Isn't it the Feast of Lupercal?",
            "burnt-orange"
          ),
        },
        [17]: {
          dialogue: new Character(
            "Flavius",
            "No exceptions, take down all the decorations from Caesar's statues. I'll go around and patroll the streets. If we don't act now, Caesar will be too powerful for all of Rome.",
            "shadow-purple"
          ),
        },
        [18]: {
          dialogue: new StageDirections(
            "<b>FLAVIUS</b> and <b>MURELLUS</b> exit separately."
          ),
          next: "A1_S2",
        },
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
              "Sorry, wrong time period. You're about 1837 years early since the fifth amendment was ratified in the United States.",
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
  ["A1_S2"]: {
    displayName: "Act 1 : Scene 2",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new StageDirections("A trumpet plays."),
        sound: {
          file: "trumpet.mp3",
          position: "beforeDialogue",
        },
      },
      [1]: {
        dialogue: new Character("Soothsayer", "<u>[Caesar]!</u>", "slate-blue"),
        options: [
          new OptionElement("Who's calling me?", "back_hand", "CallingMe"),
          new OptionElement("Who's Caesar?", "question_mark", "WhoCaesar"),
        ],
        optionsConfig: {
          timedQuestion: 3000,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["A1_S2_1_CallingMe"]: {
        [0]: {
          dialogue: new Character(
            "Casca",
            "All noises, be still!",
            "lichen-green"
          ),
          goBack: true,
        },
      },
      ["A1_S2_1_WhoCaesar"]: {
        [0]: {
          dialogue: new Character("Soothsayer", "...", "slate-blue"),
          delay: 2000,
        },
        [1]: {
          dialogue: new Character("Soothsayer", "You're Caesar!", "slate-blue"),
        },
        [2]: {
          dialogue: new Character("Caesar", "Oh. Blunder.", "dark-gold"),
          goBack: true,
        },
      },
      ["A1_S2_1_Void"]: {
        [0]: {
          dialogue: new StageDirections("Silence"),
          sound: {
            file: "crickets.mp3",
            position: "beforeDialogue",
          },
          delay: 4000,
        },
        [1]: {
          dialogue: new Character(
            "Soothsayer",
            "Caesar! Caesar! Wherefor art Caesar?",
            "slate-blue"
          ),
          fail: new GameFail({
            failID: "CaesarNotFound",
            failText:
              "ERROR: To kill Caesar, you need Caesar. (before you ask, yes. I know this is a later act.)",
          }),
        },
      },
      [2]: {
        dialogue: new Character(
          "Caesar",
          'Who in here calls me? I can distinguish the noises from the music crying "Caesar!" Speak up, what do you have to say?',
          "dark-gold"
        ),
      },
      [3]: {
        dialogue: new Character(
          "Soothsayer",
          "Beware the ides of March, sir!",
          "slate-blue"
        ),
      },
      [4]: {
        dialogue: new Character("Caesar", "Who??", "dark-gold"),
      },
      [5]: {
        dialogue: new Character(
          "Brutus",
          "A soothsayer tells you to beware the ides of March.",
          "midnight-blue"
        ),
      },
      [6]: {
        dialogue: new Character(
          "Caesar",
          "Bring him here. Let me see his face.",
          "dark-gold"
        ),
      },
      [7]: {
        dialogue: new Character(
          "Cassius",
          "Fellow, follow me. Away from the crowd.",
          "deep-olive"
        ),
      },
      [8]: {
        dialogue: new StageDirections("The Soothsayer comes forward."),
      },
      [9]: {
        dialogue: new Character("Cassius", "Look upon Caesar.", "deep-olive"),
      },
      [10]: {
        dialogue: new Character(
          "Caesar",
          "What did you say to me? Speak again.",
          "dark-gold"
        ),
      },
      [11]: {
        dialogue: new Character(
          "Sootsayer",
          "Beware the ides of March.",
          "slate-blue"
        ),
      },
      [12]: {
        dialogue: new Character(
          "Caesar",
          "Ah, you're just a dreamer. Move along. Go, all of you people.",
          "dark-gold"
        ),
      },
      [13]: {
        dialogue: new StageDirections("All but Brutus and Cassius exit."),
        sound: {
          file: "trumpet.mp3",
          position: "beforeDialogue",
        },
      },
      [14]: {
        dialogue: new Dialogue(
          "<i>whoo..! it's a ghost! you might want to keep track of what you tell to [Brutus], since it may influence the ending of your story... </i>"
        ),
      },
      [15]: {
        dialogue: new Character(
          "Cassius",
          "So, Brutus. Are you going to watch the race?",
          "deep-olive"
        ),
      },
      [16]: {
        dialogue: new Character(
          "Brutus",
          "Me? I'm not gamesome at all! Nor am I as competitive as Antony.<br>But, that's enough time. Let's split paths, shall we?",
          "midnight-blue"
        ),
      },
      [17]: {
        dialogue: new Character(
          "Cassius",
          "Wait. You've been acting strange lately. You were once such in a loving and gentle manner, and now you're stubborn over your dear friend?",
          "deep-olive"
        ),
      },
      [18]: {
        dialogue: new Character(
          "Brutus",
          "<u>[Cassius]</u>, I get it. I've been going through much contemplating amongst my thoughts and inner conflicts. But you're still a good friend, <u>[Cassius]</u>. Don't let my emotions change you.",
          "midnight-blue"
        ),
      },
      [19]: {
        dialogue: new Character(
          "Brutus",
          "Don't worry about the poor Brutus fighting against himself at war, who forgets to share love towards others.",
          "midnight-blue"
        ),
      },
      [20]: {
        dialogue: new Character(
          "Cassius",
          "Brutus, can't you look at yourself?",
          "deep-olive"
        ),
      },
      [21]: {
        dialogue: new Character(
          "Brutus",
          "No, I can't. My eyes only look forward, I can only see what reflects back to me.",
          "midnight-blue"
        ),
      },
      [22]: {
        dialogue: new Character(
          "Cassius",
          "Too bad there aren't any mirrors to show who you really are, [Brutus], a noble Roman like Caesar. Speaking of Caesar, you've seen the turn of events that's been happening in Rome, right? Or has your sight blocked you from everything?",
          "deep-olive"
        ),
      },
      [23]: {
        dialogue: new Character(
          "Brutus",
          "What are you trying to tell me, <u>[Cassius]</u>? What dangers are you pointing at for me? Is it <pause duration=500> <i>me?</i>",
          "midnight-blue"
        ),
        options: [
          new OptionElement(
            "Well, I'll be your mirror to show who you really are, Brutus. A noble gentleman. If you believe me as a fool who goes to slander all friends after befriending them, then go ahead and believe I'm dangerous.",
            null,
            "Success"
          ),
          new OptionElement(
            "Brutus, I am your mirror to show how exquisite you really are. Haven't you seen yourslef lately? I think you'd make an excellent artist of Rome, even.",
            null,
            "Fail"
          ),
          new OptionElement(
            "Brutus, let me be your mirror. I won't indulge you in flatter, but let the truth be told — only few men are as admired as you. You've been the support for Rome's strength, and as a great friend, I just want you to see it too.",
            null,
            "Unique"
          ),
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["A1_S2_23_Success"]: {
        [0]: {
          dialogue: new Character("Brutus", "Okay th-", "midnight-blue"),
          delay: 0,
          goBack: true,
        },
      },
      ["A1_S2_23_Unique"]: {
        [0]: {
          dialogue: new Character("Brutus", "Fine then...", "midnight-blue"),
          addToMemory: (playMemory) => {
            if (
              playMemory["BrutusSuspicions"] &&
              playMemory["BrutusSuspicions"].indexOf("Statement1") != -1
            ) {
              playMemory["BrutusSuspcicions"].push("Statement1");
            } else {
              playMemory["BrutusSuspcicions"] = ["Statement1"];
            }
          },
          goBack: true,
        },
      },
      ["A1_S2_23_Fail"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "Methinks you are overrating my worth, <u>[Cassius]</u>. I must seek a place of quietude, for I can't handle such flattery.",
            "midnight-blue"
          ),
          fail: new GameFail({
            failID: "CassiusManiuplationFail1",
            failText: "Can Brutus even draw?",
          }),
        },
      },
      [24]: {
        dialogue: new StageDirections("Shouts are heard."),
        sound: {
          file: "cheer.mp3",
          position: "beforeDialogue",
        },
      },
      [25]: {
        dialogue: new Character(
          "Brutus",
          "Why are they shouting? I fear the people do choose Ceasar for their king.",
          "midnight-blue"
        ),
      },
      [26]: {
        dialogue: new Character(
          "Cassius",
          "Really, you're fearing that? Then I'd suppose you don't want that, either.",
          "deep-olive"
        ),
      },
      [27]: {
        dialogue: new Character(
          "Brutus",
          "Not really, <u>[Cassius]</u>, though I love Caesar very much. But, why do you keep me here? What do you want from me, all of this? If Caesar is for the good of Rome, then I'd follow suit till my death. The gods will honor me over my death for my commitment.",
          "midnight-blue"
        ),
        options: [
          new OptionElement(
            'Honor, Brutus. Honor is what I came here for. We both were born with equal power as Caesar — you know that, right? I remember that one moment at the Tiber: Caesar dared me to swim across, and I did. He followed me, yet halfway, he called, "Help me, Cassius, or I will sink!" And like Aeneas, I carried him from the flood that is the Tiber. Yet, that same Cesar now rules as a god.',
            null,
            "Success"
          ),
          new OptionElement(
            "Brutus, I'm here to show you honor. We were once like Caesar, powerless and like the others. I once crossed this treacherous river out of pure will, even when Caesar tried to push me downstream. He couldn't even make it halfway across, more of an eighth! I had to save the frail ol' Caesar like a wooden stick. Can't you see it all now?",
            null,
            "Fail"
          ),
          new OptionElement(
            'Brutus, think about this for a bit. Caesar once challenged me to swim \'cross the Tiber, and I did. He did, too. Yet halfway across, I overheard Caesar shouting, "Cassius, I need your help!" Sure, I carried him out, but I wondered if this defined Caesar as anything. Someone... mortal. A real person. Maybe too good to be true.',
            null,
            "Unique"
          ),
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["A1_S2_27_Success"]: {
        [0]: {
          dialogue: new Character("Brutus", "Sur-", "midnight-blue"),
          delay: 0,
          goBack: true,
        },
      },
      ["A1_S2_27_Fail"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "What I see is... you're calling Caesar weak? I don't really find you a \"great\" friend you...",
            "midnight-blue"
          ),
          fail: new GameFail({
            failID: "CassiusManiuplationFail2",
            failText: "caesar felt hurt by that :(",
          }),
        },
      },
      ["A1_S2_27_Unique"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "and...? Why are you telling me this?",
            "midnight-blue"
          ),
          goBack: true,
          addToMemory: (playMemory) => {
            if (
              playMemory["BrutusSuspicions"] &&
              playMemory["BrutusSuspicions"].indexOf("Statement2") != -1
            ) {
              playMemory["BrutusSuspcicions"].push("Statement2");
            } else {
              playMemory["BrutusSuspcicions"] = ["Statement2"];
            }
          },
        },
      },
      [28]: {
        dialogue: new StageDirections("More shouting."),
        sound: {
          file: "cheer.mp3",
          position: "beforeDialogue",
        },
      },
      [29]: {
        dialogue: new Character(
          "Brutus",
          "Even more shouting! Is this all honors being handed over to Caesar?",
          "midnight-blue"
        ),
        options: [
          new OptionElement(
            "Well, Caesar is like a giant who sees the world beneath him. Us? Petty men! All we get to do is walk, no, crawl under his legs and die in dishonor. Is this Rome to us anymore?",
            null,
            "Success"
          ),
          new OptionElement(
            "Caesar? He's more of a child than a true king, let alone a \"noble\" one. I'd much rather live a miserable life to anyone but some pathetic leader.",
            null,
            "Fail"
          ),
          new OptionElement(
            "I guess Caesar can stand tall and represent Rome. Honestly, I don't think it's about his position, but rather us. Shouldn't we be standing up for ourselves, for all of Rome?",
            null,
            "Unique"
          ),
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["A1_S2_29_Success"]: {
        [0]: {
          dialogue: new Character("Brutus", "...", "midnight-blue"),
          goBack: true,
        },
      },
      ["A1_S2_29_Fail"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "A child, you say? How about this?<br><br><i>Dear <u>[Cassius]</u> <pause duration=1000> 's parents, I think you may need to re-evaluate your choices on having a chi-",
            "midnight-blue"
          ),
          delay: 0,
          fail: new GameFail({
            failID: "CassiusManiuplationFail3",
            failText:
              "According to my calculations, Caesar is most definitely not a child.",
          }),
        },
      },
      ["A1_S2_29_Unique"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "So? What do you want me to do, <u>[Cassius]</u> Cheer? Weep?",
            "midnight-blue"
          ),
          addToMemory: (playMemory) => {
            if (
              playMemory["BrutusSuspicions"] &&
              playMemory["BrutusSuspicions"].indexOf("Statement3") != -1
            ) {
              playMemory["BrutusSuspcicions"].push("Statement3");
            } else {
              playMemory["BrutusSuspcicions"] = ["Statement3"];
            }
          },
          goBack: true,
        },
      },
      [30]: {
        dialogue: new Character(
          "Cassius",
          "<small>(continued response)</small>",
          "deep-olive"
        ),
        options: [
          new OptionElement(
            "You know this isn't the stars that make us do this, Brutus. The gods don't see Caesar above us, we do. This was our choice, we are the underlings.",
            null,
            "Success"
          ),
          new OptionElement(
            "Really? You'd believe in the stars that Caesar has any power? Come on now, of course not! He's just a cowardest of the cowards. If anything, we're all just fools in this... place of Rome.",
            null,
            "Fail"
          ),
          new OptionElement(
            "Maybe we should look to ourselves. Something that we should've watched before it grew to be much more... dangerous.",
            null,
            "Unique"
          ),
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "beforeDialogue",
        },
      },
      ["A1_S2_30_Success"]: {
        [0]: {
          dialogue: new Character("Brutus", "I see...", "midnight-blue"),
          goBack: true,
        },
      },
      ["A1_S2_30_Fail"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "Are you just here to complain about Caesar? If so, begone. Maybe <b>YOU'RE</b> the coward after all.",
            "midnight-blue"
          ),
          fail: new GameFail({
            failID: "CassiusManiuplationFail4",
            failText:
              "How many times do I have to tell you that bullying Caesar will not make Brutus change his mind?",
          }),
        },
      },
      ["A1_S2_30_Unique"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "Then, what do you want me to do? Think about myself more?",
            "midnight-blue"
          ),
          addToMemory: (playMemory) => {
            if (
              playMemory["BrutusSuspicions"] &&
              playMemory["BrutusSuspicions"].indexOf("Statement4") != -1
            ) {
              playMemory["BrutusSuspcicions"].push("Statement4");
            } else {
              playMemory["BrutusSuspcicions"] = ["Statement4"];
            }
          },
          goBack: true,
        },
      },
      [31]: {
        dialogue: new Character(
          "Cassius",
          "<small>(continued response)</small>",
          "deep-olive"
        ),
        options: [
          new OptionElement(
            "Brutus, what makes the name \"Brutus\" any more different than Caesar? Just write your name out — it's just as fair. Sound it out — can't even tell a difference.",
            null,
            "Success"
          ),
          new OptionElement(
            'Brutus, just think of the name "Caesar". Are you really going to trust anyone with the name "Caesar?" You fool, of course not! "Brutus" rings a different bell to "Caesar," wouldn\'t be any less surprised if you were the noblest.',
            null,
            "Fail"
          ),
          new OptionElement(
            'Brutus, what comes to your mind when you hear "Caesar?" Do you even have an idea? Is it a drive for power, to be recorded in history? Or are you silenced in fear? Perhaps us Romans are... not mighty enough yet.'
          ),
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "beforeDialogue",
        },
      },
      ["A1_S2_31_Success"]: {
        [0]: {
          dialogue: new Character(
            "Cassius",
            "Oh think about your ancestors, Brutus, who once ruled Rome against the devil. There's room for one famed man, why not you?",
            "deep-olive"
          ),
          goBack: true,
        },
      },
      ["A1_S2_31_Fail"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "Caesar is <b>NOT</b> incapable, <u>[Cassius]</u>! And for you to call me a... fool??",
            "midnight-blue"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Brutus",
            "Is this all who I am to you? A servant for Caesar? <br> Is this all who Caesar is to you? A blockhead?",
            "midnight-blue"
          ),
        },
        [2]: {
          dialogue: new Character(
            "Brutus",
            "Well, my dear friend <u>[Cassius]</u>, I think it's time I must leave. I will take some time to consider what you said, and maybe I'll have a word with you another day.",
            "midnight-blue"
          ),
        },
        [3]: {
          dialogue: new StageDirections("<b>BRUTUS</b> exits."),
          delay: 2000,
        },
        [4]: {
          dialogue: new StageDirections(
            "<b>CASSIUS</> sees <b>CAESAR</b> and <b>CASCA</b> entering."
          ),
          delay: 0,
        },
        [5]: {
          dialogue: new Character(
            "Caesar",
            '<h1 class="serif">I heard that.</h1>',
            "dark-gold"
          ),
          sound: {
            file: "boom.mp3",
            position: "afterDialogue",
          },
          fail: new GameFail({
            failID: "CassiusManipulationFail5",
            failText:
              "Did you really think you were actually going to get away scott-free?",
          }),
        },
      },
      ["A1_S2_31_Unique"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "I- well, perhaps... okay then.",
            "midnight-blue"
          ),
          addToMemory: (playMemory) => {
            if (
              playMemory["BrutusSuspicions"] &&
              playMemory["BrutusSuspicions"].indexOf("Statement5") != -1
            ) {
              playMemory["BrutusSuspcicions"].push("Statement5");
            } else {
              playMemory["BrutusSuspcicions"] = ["Statement5"];
            }
          },
          goBack: true,
        },
      },
      [32]: {
        dialogue: new Character(
          "Brutus",
          "I know you love me, I do. But, I think that's enough from you, <u>[Cassius]</u>. I will go and think over what you have said to me, and I'll find a time where we can discuss about this again.",
          "midnight-blue"
        ),
      },
      [33]: {
        dialogue: new Character(
          "Brutus",
          "Understand, <u>[Cassius]</u>, that I'd rather be apart of a village over the hard conditions of Rome.",
          "midnight-blue"
        ),
      },
      [34]: {
        dialogue: new Character(
          "Cassius",
          "I hope my words have struck a small show of fire from you, [Brutus].",
          "deep-olive"
        ),
      },
      [35]: {
        dialogue: new StageDirections(
          "<b>CAESAR</b> enters with his followers, including <b>CASCA.</b>"
        ),
      },
      [36]: {
        dialogue: new Character(
          "Brutus",
          "It seems as Caesar is back from the games.",
          "midnight-blue"
        ),
      },
      [37]: {
        dialogue: new Character(
          "Cassius",
          "Great. Pluck Casca by the sleeve, and he'll share you what hath occured today, something worthy to hear.",
          "deep-olive"
        ),
      },
      [38]: {
        dialogue: new Character(
          "Brutus",
          "Sure, but I don't know... Caesar doesn't look very happy, and nor does the crowd, or even Calphurnia for that matter.<br>And look at Cicero with his eyes so firey he was apart of the conference with a few senators.",
          "deep-olive"
        ),
      },
      [39]: {
        dialogue: new Character(
          "Cassius",
          "Casca will tell us everything.",
          "deep-olive"
        ),
        next: () => {
          if (
            gameModule.getSaveData().playMemory["BrutusSuspcicions"] &&
            gameModule.getSaveData().playMemory["BrutusSuspcicions"].length >= 3
          ) {
            return "A1_S3";
          } else {
            return "A1_S2_2";
          }
        },
      },
    },
  },
  ["A1_S2_2"]: {
    displayName: "Act 1 : Scene 2",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new StageDirections(
          "Trumpets play. <b>CAESAR</b> exists with all his followers except <b>CASCA.</b>"
        ),
      },
      [1]: {
        dialogue: new Character(
          "Casca",
          "<i>(to [Brutus])</i> Hey, you pulled me by the cloak. Do you want to talk to me?",
          "lichen-green"
        ),
      },
      [2]: {
        dialogue: new Character(
          "Brutus",
          "Ay, Casca. Tell us what has happened today. Caesar was in such a serious mood.",
          "midnight-blue"
        ),
      },
      [3]: {
        dialogue: new Character(
          "Casca",
          "Look, Caesar was offered a crown, but then he pushed it away.<br>And guess what? The people fell a-shouting.",
          "lichen-green"
        ),
      },
      [4]: {
        dialogue: new Character("Brutus", "The second noise?", "midnight-blue"),
      },
      [5]: {
        dialogue: new Character("Casca", "Yet again!", "lichen-green"),
      },
      [6]: {
        dialogue: new Character(
          "Brutus",
          "The third noise! What about that?",
          "midnight-blue"
        ),
      },
      [7]: {
        dialogue: new Character(
          "Casca",
          "<span style=\"font-family: Comic Sans MS;\">Buddy ol' pal you wouldn't <b>BELIEVE</b> what it was all about.</span> <pause duration=1000> <br> The SAME thing!",
          "lichen-green"
        ),
      },
      [8]: {
        dialogue: new Character(
          "Brutus",
          "The crown was offered to him three times?",
          "lichen-green"
        ),
      },
      [9]: {
        dialogue: new Character(
          "Casca",
          "Dude. <pause duration=2000> <br> Ay, indeed, was't. Everytime he pushed it more gently than the past, everytime he refused it, the crowd shouted.",
          "lichen-green"
        ),
        sound: {
          file: "facepalm.mp3",
          position: "beforeDialogue",
        },
      },
      [10]: {
        dialogue: new Character(
          "Cassius",
          "But who offered him the crown?",
          "deep-olive"
        ),
      },
      [11]: {
        dialogue: new Character("Casca", "Why, Antony did.", "lichen-green"),
      },
      [12]: {
        dialogue: new Character(
          "Brutus",
          "Tell us everything, gentle Casca.",
          "midnight-blue"
        ),
      },
      [13]: {
        dialogue: new Character(
          "Casca",
          "<span dialogue-speed=10>HAAHHAHAHAAHHAAHHAHAHAHAHAHAAHAHAHAHAHAHAH</span> <br> I can't really explain it, it was just... too silly! Look, Mark Antony gave him a crown and, well I told you he refused it. The second time, he refused it again! <small>(though he did kind of keep it on his hands)</small> And the third time, he refused it again!! <br> The crowd went crazy, and... <br> man did they have such a stinky breath. I just couldn't laugh to not take any of this air in unlike Caesar who got choked in this air and swooned at it.",
          "lichen-green"
        ),
      },
      [14]: {
        dialogue: new Character(
          "Cassius",
          "Wait. Caesar FAINTED??",
          "deep-olive"
        ),
      },
      [15]: {
        dialogue: new Character(
          "Casca",
          "Oh yeah, he fell into the marketplace and started foaming at his mouth.",
          "lichen-green"
        ),
      },
      [16]: {
        dialogue: new Character(
          "Brutus",
          "I expected that, after all, he has epilepsy and got a Caesar.",
          "deep-olive"
        ),
        sound: {
          file: "punchline.mp3",
          position: "afterDialogue",
        },
      },
      [17]: {
        dialogue: new Character(
          "Casius",
          "Nah, Caesar doesn't have it. <b>we</b> have the epilepsy.",
          "lichen-green"
        ),
      },
      [18]: {
        dialogue: new Character(
          "Casca",
          "??? <br><br> Maybe it's just you... <br><br> I don't really know what you mean by that, but Caesar did fall down. Honestly, I found his audience to do the same thing as actors in a theater. If they didn't, I am no true man.",
          "lichen-green"
        ),
      },
      [19]: {
        dialogue: new Character(
          "Brutus",
          "What did he say when he came unto himself?",
          "midnight-blue"
        ),
      },
      [20]: {
        dialogue: new Character(
          "Casca",
          "Oh, he pulled open his robe and offered the commoners to cut his throat. I would've done that, to be honest. <pause duration=1000> <br> But, when he regained consciousness, he just dismissed it with his sickness, and 3-4 women near me just forgave him!",
          "lichen-green"
        ),
      },
      [21]: {
        dialogue: new Character(
          "Brutus",
          "And yet he came here and looked all that serious. How weird is hat?",
          "lichen-green"
        ),
      },
      [22]: {
        dialogue: new Character(
          "Cassius",
          "Did Cicero say anything?",
          "deep-olive"
        ),
      },
      [23]: {
        dialogue: new Character(
          "Casca",
          "Yeah, something in Greek.",
          "lichen-green"
        ),
      },
      [24]: {
        dialogue: new Character("Cassius", "What'd he say?", "deep-olive"),
      },
      [25]: {
        dialogue: new Character(
          "Casca",
          "I don't know man, its all Greek to me. 💀",
          "lichen-green"
        ),
      },
      [26]: {
        dialogue: new Character(
          "Cassius",
          "Will you sup with me tonight, [Casca]?",
          "deep-olive"
        ),
      },
      [27]: {
        dialogue: new Character(
          "Casca",
          "No, I have promised forth.",
          "lichen-green"
        ),
      },
      [28]: {
        dialogue: new Character("Cassius", "How about tomorrow?", "deep-olive"),
      },
      [29]: {
        dialogue: new Character(
          "Casca",
          "Sure, if I'm still alive, and you're not out of your mind.",
          "lichen-green"
        ),
      },
      [30]: {
        dialogue: new Character(
          "Cassius",
          "Good. Farewell, see you then.",
          "deep-olive"
        ),
      },
      [31]: {
        dialogue: new StageDirections("<b>CASCA</b> exits."),
        delay: 1500,
      },
      [32]: {
        dialogue: new Character(
          "Brutus",
          "bro, [Casca] is actually like so stupid like is he acoustic or something-",
          "midnight-blue"
        ),
        delay: 0,
      },
      [33]: {
        dialogue: new Character(
          "Cassius",
          "Nonononononoo, [Casca] isn't dumb, he's a very noble man to run an enterprise. <br> <small>okay, maybe he is</small> but look, he said something smart, and that's all he needs to get our attention.",
          "deep-olive"
        ),
      },
      [34]: {
        dialogue: new Character("Brutus", "Well. Until then.", "midnight-blue"),
      },
      [35]: {
        dialogue: new Character(
          "Cassius",
          "Yeah, just think about the well-being of Rome till then.",
          "deep-olive"
        ),
      },
      [36]: {
        dialogue: new StageDirections("<b>BRUTUS</b> exits."),
      },
      [37]: {
        dialogue: new Character(
          "Cassius",
          "[Brutus]... noble little [Brutus]. Right into my trap, isn't it? Yet, such honor can't last for long. If I were [Brutus], I would've not listened to [Cassius] at all. It's too late now. Caesar better brace for everything, cause its only going downhill from here.",
          "deep-olive"
        ),
      },
      [38]: {
        dialogue: new StageDirections("<b>CASSIUS</b> exits."),
        next: "A1_S3",
      },
    },
  },
  ["A1_S3"]: {
    displayName: "Act 1 : Scene 3",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new StageDirections(
          "Thunder & Lightning. <b>CASSIUS</b> enters, and <b>CASCA</b> is already present."
        ),
        sound: {
          file: "rainstorm.mp3",
          position: "beforeDialogue",
        },
      },
      [1]: {
        dialogue: new Character("Cassius", "Who's there?", "deep-olive"),
      },
      [2]: {
        dialogue: new Character("Casca", "A Roman.", "lichen-green"),
        options: [
          new OptionElement("A Roman who?", null, "WhoRoman"),
          new OptionElement(
            "Casca, I know it's you by your voice!",
            null,
            "Casca"
          ),
          new OptionElement(
            "And I'm the police, and you are not a real Roman. Pack your bags, you're leaving immediately.",
            null,
            "Deportation"
          ),
        ],
        optionsConfig: {
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["A1_S3_2_WhoRoman"]: {
        [0]: {
          dialogue: new Character(
            "Casca",
            "A Roman named [Casca]!",
            "lichen-green"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Cassius",
            "Oh. I would've figured.",
            "deep-olive"
          ),
          goBack: true,
        },
      },
      ["A1_S3_2_Casca"]: {
        [0]: {
          dialogue: new Character(
            "Casca",
            "Your ear is good. <u>[Cassius]</u>, what a night this is!",
            "lichen-green"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Cassius",
            "It's a very pleasing night to honest men.",
            "deep-olive"
          ),
          goBack: true,
        },
      },
      ["A1_S3_2_Deportation"]: {
        [0]: {
          dialogue: new Character(
            "Casca",
            "B- but I have my Roman citizenship! You can't just do that!",
            "lichen-green"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Cassius",
            "Oh I can and I will. Do you need a reason? I'll be nice and provide you one, <br> you're kinda dumb for a person.",
            "deep-olive"
          ),
        },
        [2]: {
          dialogue: new Character(
            "Casca",
            "What??? <i>*sigh*</i> Well, give me a second and-",
            "lichen-green"
          ),
          delay: 0,
        },
        [3]: {
          dialogue: new Character(
            "Cassius",
            "<b>I SAID GET O-</b>",
            "deep-olive"
          ),
          fail: new GameFail({
            failID: "RemovingCascaLegally",
            failText:
              "Rule #1: Always ask for a warrant. Cassius definitely did not have one.",
          }),
        },
      },
      [3]: {
        dialogue: new Character(
          "Cassius",
          "I name a man who's just like this dreadful night. One that thunders, lightens, opens graves, and roars as doth the lion in the Capitol - <br> a man no mightier than any one of us (maybe me) in ability, yet has such more power than these strange eruptions here tonight.",
          "deep-olive"
        ),
      },
      [4]: {
        dialogue: new Character(
          "Casca",
          "You're talking about Caesar, right, <u>[Cassius]</u>?",
          "lichen-green"
        ),
      },
      [5]: {
        dialogue: new Character(
          "Cassius",
          "Let it be who it is.",
          "deep-olive"
        ),
      },
      [6]: {
        dialogue: new Character(
          "Casca",
          "They say that the senators plan to establish Caesar as a king tomorrow, and he will wear his clown by sea and land everywhere but Italy",
          "lichen-green"
        ),
      },
      [7]: {
        dialogue: new Character(
          "Cassius",
          "I know that I'll be wearing this dagger, then. I'll kill myself to free myself from everything. The gods make us weak strong and defeat such tyrants, no need for a story tower, nor walls of beaten brass, nor airless dungeon, no chains of iron. If any of this happens, any man could just kill himself. I can control the tyranny whenever I choose to.",
          "deep-olive"
        ),
      },
      [8]: {
        dialogue: new StageDirections("Thunder."),
        sound: {
          file: "thunder.mp3",
          position: "beforeDialogue",
          spawn: true,
        },
      },
      [9]: {
        dialogue: new Character(
          "Casca",
          "So can I. So can any imprisoned man who has the tool to free themselves.",
          "lichen-green"
        ),
      },
      [10]: {
        dialogue: new Character(
          "Cassius",
          "How is Caesar a tyrant then? Poor guy, he wouldn't be the wolf if all Romans were the sheep. He couldn't be a lion if the Romans were all prey. Rome will soon be utterly in mighty flames, turned into rubbish and rubble, all to serve someone as vile as <b>CAESAR!</b>",
          "deep-olive"
        ),
        delay: 1500,
      },
      [11]: {
        dialogue: new Character(
          "Cassius",
          "But, O grief. What did I muster in my grief? Whatever, danger can't hurt me anyway - I'm armed.",
          "deep-olive"
        ),
      },
      [12]: {
        dialogue: new Character(
          "Casca",
          "Look, you're talking to Casca. Hold my hand and shake it. Let me help you in this deal, <u>[Cassius.]</u>",
          "lichen-green"
        ),
      },
      [13]: {
        dialogue: new Character(
          "Cassius",
          "Deal. Now, tell me Casca. I've convinced many noble Romans to join me upon this honorable yet dangerous mission. They're all waiting on Pompey's porch. We're meeting now, at night, since nobody is out on the streets. It may look bloody, firey, and most terrible outside, but it's just the work we have to do.",
          "deep-olive"
        ),
      },
      [14]: {
        dialogue: new StageDirections("<b>CINNA</b> enters."),
      },
      [15]: {
        dialogue: new Character("Casca", "Who's that? HIDE!", "lichen-green"),
        delay: 0,
      },
      [16]: {
        dialogue: new Character(
          "Cassius",
          "Hold. It's just [Cinna], my friend. Why are you in a hurry?",
          "deep-olive"
        ),
      },
      [17]: {
        dialogue: new Character(
          "Cinna",
          "To find you. Is that Metellus Cimber?",
          "umber-brown"
        ),
      },
      [18]: {
        dialogue: new Character(
          "Cassius",
          "No, that's [Casca]. Are the others watiing for me, [Cinna]?",
          "deep-olive"
        ),
      },
      [19]: {
        dialogue: new Character(
          "Cinna",
          "I'm just glad Metellus Cimber is with us. What a fearful night tihs is! Two or three of us have seen some strange sights.",
          "umber-brown"
        ),
      },
      [20]: {
        dialogue: new Character(
          "Cassius",
          "Are the others waiting??",
          "deep-olive"
        ),
        options: [
          new OptionElement(
            "Yes, they are. If only you could convince Brutus to join us-",
            null,
            "Brutus"
          ),
          new OptionElement(
            "Just look outside for a second, do you see how demanding the sky is today?",
            null,
            "Sky"
          ),
        ],
        optionsConfig: {
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["A1_S3_20_Brutus"]: {
        [0]: {
          dialogue: new Character(
            "Cassius",
            "Don't worry, good Cinna. Take this paper and lay it on the judge's chair where Brutus is meant to sit. Put this one on his window, this one on his ancestor with wax. Once you're done, return to Pompey's porch where you'll find us. Is Decius Brutus and Trebonious there?",
            "deep-olive"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Cinna",
            "Everyone's there except Metellus Cimber, but he's looking for you. I'll go ahead and put these papers where you told me.",
            "umber-brown"
          ),
        },
        [2]: {
          dialogue: new Character(
            "Cassius",
            "Good. Go back to Pompey's theater when you're done.",
            "deep-olive"
          ),
        },
        [3]: {
          dialogue: new StageDirections("<b>CINNA</b> exits."),
        },
        [4]: {
          dialogue: new Character(
            "Cassius",
            "Come on Casca, lets head over to Brutus' house before sunrise. He's 75% on our side, and we'll win the remaining at this meeting.",
            "deep-olive"
          ),
        },
        [5]: {
          dialogue: new Character(
            "Casca",
            "Oh, yeah. The people love him. Anything Brutus does - the rest will follow, just like how an alchemist turns rubber to gold.",
            "lichen-green"
          ),
        },
        [6]: {
          dialogue: new Character(
            "Cassius",
            "You mean... tin? Whatever, let's go show how worthy Brutus really is. It's already after midnight, we need to go now before the sun rises.",
            "deep-olive"
          ),
          next: () => {
            if (
              gameModule.getSaveData().playMemory["BrutusSuspcicions"] &&
              gameModule.getSaveData().playMemory["BrutusSuspcicions"].length >=
                3
            ) {
              return "A2_S1";
            } else {
              return "A1_S1_0";
            }
          },
        },
      },
      ["A1_S3_20_Sky"]: {
        [0]: {
          dialogue: new Character(
            "Cassius",
            "There's not enough time for that, are they outs-",
            "deep-olive"
          ),
          delay: 0,
        },
        [1]: {
          dialogue: new Character(
            "???",
            "What are you two doing here? Why are you just standing here?"
          ),
        },
        [2]: {
          dialogue: new Character(
            "Cassius",
            "ummm... we- we're just having a talk on how the heavens are weeping today.",
            "deep-olive"
          ),
        },
        [3]: {
          dialogue: new Character(
            "Cinna",
            "Plus, Cassius is my friend. I haven't seen him for some time.",
            "umber-brown"
          ),
        },
        [4]: {
          dialogue: new Character(
            "???",
            "Oh really? Then, why are you holding a ton of letters here? Give me that."
          ),
        },
        [5]: {
          dialogue: new StageDirections(
            "<b>[EXPUNGED]</b> took the letters from <b>CASCA</b>."
          ),
        },
        [6]: {
          dialogue: new Character(
            "???",
            "Dude. What the heck is all this? Why did you lie to my face?"
          ),
        },
        [7]: {
          dialogue: new Character(
            "???",
            "I was on my way to go mail something, but I think I have <i>one</i> more letter to write. And I know who this is getting addressed to. <br> And it will not be your little friend Brutus here."
          ),
          fail: new GameFail({
            failID: "PlansLeaked",
            failText:
              "It was a pretty rainy day, not going to lie. Maybe they should've been inside?",
          }),
        },
      },
    },
  },
  ["A2_S1_0"]: {
    displayName: "Act 2 : Scene 1",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new Character(
          "Brutus",
          "[Lucius], you awkae? I can't really sleep, I can't look to the stars and tell when daylight is near. [Lucius], wake up!",
          "midnight-blue"
        ),
        sound: {
          file: "rainstorm.mp3",
          position: "beforeDialogue",
        },
      },
      [1]: {
        dialogue: new StageDirections("<b>LUCIUS</b> enters."),
      },
      [2]: {
        dialogue: new Character(
          "Lucius",
          "Did you call me, my lord?",
          "nightshade"
        ),
      },
      [3]: {
        dialogue: new Character(
          "Brutus",
          "Light a candle in my study, [Lucius]. Tell me when it's lit.",
          "midnight-blue"
        ),
      },
      [4]: {
        dialogue: new Character("Lucius", "I will, my lord.", "nightshade"),
      },
      [5]: {
        dialogue: new StageDirections("<b>LUCIUS</b> exits."),
      },
      [6]: {
        dialogue: new Character(
          "Brutus",
          "The only thing we can do is kill Caesar. I don't hate him, but if it's for the people, then that will do. But, how could he be evil from a crown? Then again, just like an adder's crave to walk on a bright sunny day, crown Caesar that, and he'll put us all in danger.",
          "midnight-blue"
        ),
      },
      [7]: {
        dialogue: new Character(
          "Brutus",
          "Therefore, we must view Caesar as a serpent's egg, which when hatched would be dangerous. We must kill him while he's in the shell.",
          "midnight-blue"
        ),
      },
      [8]: {
        dialogue: new StageDirections("<b>LUCIUS</b> enters."),
      },
      [9]: {
        dialogue: new Character(
          "Lucius",
          "The candle is lit, sir. Though, I noticed some of these letters that shouldn't have been there. Maybe you might need them. <i>(gives [Brutus] the letter)</i>",
          "nightshade"
        ),
      },
      [10]: {
        dialogue: new Character(
          "Brutus",
          "Go back to bed, it's not daytime yet. Is tomorrow March 15th?",
          "midnight-blue"
        ),
      },
      [11]: {
        dialogue: new Character("Lucius", "I don't know, sir.", "nightshade"),
      },
      [12]: {
        dialogue: new Character(
          "Brutus",
          "Go check the calendar for me, alright?",
          "midnight-blue"
        ),
      },
      [13]: {
        dialogue: new Character("Lucius", "I will, sir.", "nightshade"),
      },
      [14]: {
        dialogue: new StageDirections("<b>LUCIUS</b> exits."),
      },
      [15]: {
        dialogue: new Character(
          "Brutus",
          "The exhalations whizzing in the air give out so much light I can read these letters. <i>(opens letter and reads)</i>",
          "midnight-blue"
        ),
      },
      [16]: {
        dialogue: new Dialogue(
          "Brutus, thou sleep'st. Awake, and see thyself. Shall Rome... etc. Speak, strike out, fix it!"
        ),
      },
      [17]: {
        dialogue: new Dialogue("Brutus, thou sleep'st. Awake."),
      },
      [18]: {
        dialogue: new Character(
          "Brutus",
          "What? Will Rome submit itself to one man? Am I supposed to speak out and strike? Rome, you know that if you had to receive justice, you'll recieve it at the hand of Brutus!",
          "midnight-blue"
        ),
      },
      [19]: {
        dialogue: new StageDirections("Faint chimes are heard."),
        sound: {
          file: "clock.mp3",
          position: "beforeDialogue",
          spawn: true,
        },
      },
      [20]: {
        dialogue: new Dialogue(),
        options: [
          new OptionElement("Stay silent.", null, "Silent"),
          new OptionElement("Wha- what was that noise??", null, "Alert"),
        ],
        optionsConfig: {
          timedQuestion: 0,
          instantFeedback: true,
          appear: "beforeDialogue",
        },
      },
      ["A2_S1_0_20_Silent"]: {
        [0]: {
          dialogue: new Character("Brutus", "...", "midnight-blue"),
          goBack: true,
        },
      },
      ["A2_S1_0_20_Alert"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "Must have just been my phantom speaking.",
            "midnight-blue"
          ),
          addToMemory: (playMemory) => {
            playMemory["FourthWall"] = true;
          },
          goBack: true,
        },
      },
      [21]: {
        dialogue: new StageDirections("<b>LUCIUS</b> enters."),
      },
      [22]: {
        dialogue: new Character(
          "Lucius",
          "15 days of March have gone by, sir.",
          "nightshade"
        ),
      },
      [23]: {
        dialogue: new StageDirections("Knocking sound."),
      },
      [24]: {
        dialogue: new Character(
          "Brutus",
          "Somebody's knocking on the door. Go get it.",
          "midnight-blue"
        ),
      },
      [25]: {
        dialogue: new Character(
          "Brutus",
          "I have not slept well since thinking of Caesar, everything just feels... unreal. This whole world, it's just a horrible dream.",
          "midnight-blue"
        ),
      },
      [26]: {
        dialogue: new Character(
          "Lucius",
          "Sir, it's Cassius at the door. Along with some other... men who have hats pulled down and half of their faces buried in their cloaks.",
          "nightshade"
        ),
      },
      [27]: {
        dialogue: new Character("Brutus", "Let them in.", "midnight-blue"),
      },
      [28]: {
        dialogue: new StageDirections("<b>LUCIUS</b> exits."),
        next: "A2_S1",
      },
    },
  },
  ["A2_S1"]: {
    displayName: "Act 2 : Scene 1",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new StageDirections(
          "The conspirators enter: <b>CASSIUS, CASCA, DECIUS, CINNA, METELLUS, </b> and <b>TREBONIUS</b>"
        ),
        sound: {
          file: "rainstorm.mp3",
          position: "beforeDialogue",
        },
      },
      [1]: {
        dialogue: new Character(
          "Cassius",
          "Good morning, Brutus. Have we bothered you",
          "deep-olive"
        ),
      },
      [2]: {
        dialogue: new Character(
          "Brutus",
          "It is LITERALLY not morning today. How have I NOT been bothered? Do I know who these men are?",
          "midnight-blue"
        ),
      },
      [3]: {
        dialogue: new Character(
          "Cassius",
          "Yes, you do. All of them admire you.",
          "deep-olive"
        ),
      },
      [4]: {
        dialogue: new Character(
          "Brutus",
          "You are all welcome here.",
          "midnight-blue"
        ),
      },
      [5]: {
        dialogue: new Character(
          "Cassius",
          "Can I have a word with you?",
          "deep-olive"
        ),
      },
      [6]: {
        dialogue: new StageDirections(
          "<b>BRUTUS</b> and <b>CASSIUS</b> whisper together."
        ),
      },
      [7]: {
        dialogue: new Character(
          "Decius",
          "Guys. That is the east. <br> IS that were the dawn will rise?",
          "copper"
        ),
        options: [
          new OptionElement("No.", "close", "No"),
          new OptionElement("Yes.", "check", "Yes"),
          new OptionElement(
            "Doesn't the Earth revolve around the sun?",
            "sync",
            "Revolve"
          ),
        ],
        optionsConfig: {
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["A2_S1_7_No"]: {
        [0]: {
          dialogue: new Character(
            "Cinna",
            "Sir?? Are you out of your mind?? Are you actually that stupid, because there is no way soemone can think such thing.",
            "umber-brown"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Cinna",
            "CLEARLY the clouds mark the start of dawn.",
            "umber-brown"
          ),
        },
        [2]: {
          dialogue: new Character(
            "Casca",
            "Cinna, you CAN'T be talking like that. You're both wrong. The sun rises from this point near the South due to this time. <i>(pointing sword)</i> Right there. In the next few months, it'll be near North and due east of the Capitol.",
            "lichen-green"
          ),
          goBack: true,
        },
      },
      ["A2_S1_7_Yes"]: {
        [0]: {
          dialogue: new Character(
            "Cinna",
            "Oh REALLY? Then, explain to me why those clouds don't mark where dawn rises.",
            "umber-brown"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Casca",
            "Because they... don't? Who's the dumb one here?",
            "lichen-green"
          ),
          goBack: true,
        },
      },
      ["A2_S1_7_Revolve"]: {
        [0]: {
          dialogue: new Character(
            "Cinna",
            "Oh, you want to believe that's the case? What's next, you want to be under house arrest?",
            "umber-brown"
          ),
        },
        [1]: {
          dialogue: new Character("Casca", "...", "lichen-green"),
          delay: 1000,
          goBack: true,
        },
      },
      [8]: {
        dialogue: new StageDirections(
          "<b>CASSIUS</b> and <b>BRUTUS</b> returns."
        ),
      },
      [9]: {
        dialogue: new Character(
          "Brutus",
          "All of yall, give me your hands. One by one. <i>(shakes each hand)</i>",
          "midnight-blue"
        ),
      },
      [10]: {
        dialogue: new Character(
          "Cassius",
          "And let us all swear an oath-",
          "deep-olive"
        ),
        delay: 0,
      },
      [11]: {
        dialogue: new Character(
          "Brutus",
          "No. We're not doing an oath. If we really just hsave weak motives, let's just go back to bed, shouldn't we? If we don't do anything, then tyranny will plague all of Rome till everyone is dead. What we are doing should be heroic, something that even the melting spirts of woemn could be rekindled again. What other oath do we need but honesty, as the secret Romans",
          "midnight-blue"
        ),
      },
      [12]: {
        dialogue: new Character(
          "Brutus",
          "If we dare to swear an oath, then there's no nobility in our actions anymore. If we fail to complete this mission, then we might as well be dishonorable and corrupt.",
          "midnight-blue"
        ),
      },
      [13]: {
        dialogue: new Character(
          "Decius",
          "Sure, but should we go only after Caesar? Who else?",
          "copper"
        ),
      },
      [14]: {
        dialogue: new Character(
          "Cassius",
          "Good point, [Decius]. We should go after Mark Antony too, along with Caesar.",
          "deep-olive"
        ),
      },
      [15]: {
        dialogue: new Character(
          "Brutus",
          "No, don't do that. Our actions will be too bloody if we do. If anything, if he loves Caesar so much, he'll only hurt himself by grieving for Caesar. Beisdes, he only prefers sports, wildness, and so much company.",
          "midnight-blue"
        ),
      },
      [16]: {
        dialogue: new Character(
          "Trebonius",
          "There is nothing to fear. Let's not kill him. He'll live onward.",
          "dark-mauve"
        ),
      },
      [17]: {
        dialogue: new StageDirections("A clock strikes."),
      },
      [18]: {
        dialogue: new Character("Brutus", "...", "midnight-blue"),
        options: [
          new OptionElement("Point out the clock.", null, "FourthWall"),
          new OptionElement("Do nothing.", null, "Nothing"),
        ],
        optionsConfig: {
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
          optionVerification: (option) => {
            if (
              option == "FourthWall" &&
              !gameModule.getSaveData().playMemory["FourthWall"]
            ) {
              return "FourthWall2";
            } else if (
              option == "FourthWall" &&
              gamemodule.getSaveData().playMemory["FourthWall"]
            ) {
              return "FourthWall";
            } else {
              return option;
            }
          },
        },
      },
      ["A2_S1_18_FourthWall"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "That noise. It rung again, just like how it did during this night. <br> This isn't just a phantom, this is real!",
            "midnight-blue"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Cassius",
            "[Brutus], I heard it too, but... what does this all mean?",
            "deep-olive"
          ),
        },
        [2]: {
          dialogue: new Character(
            "Brutus",
            "I don't really know. Wait. Is it still raining outside?? Shouldn't it have stopped by now?",
            "midnight-blue"
          ),
        },
        [3]: {
          dialogue: new Character(
            "Casca",
            "What's next? A thunder strike? Two of them?",
            "lichen-green"
          ),
        },
        [4]: {
          dialogue: new StageDirections("Thunder."),
          sound: {
            file: "thunder.mp3",
            position: "beforeDialogue",
            spawn: true,
          },
          delay: 1000,
        },
        [5]: {
          dialogue: new StageDirections("Thunder."),
          sound: {
            file: "thunder.mp3",
            position: "beforeDialogue",
            spawn: true,
          },
        },
        [6]: {
          dialogue: new Character(
            "Casca",
            "O grief, what I said was true. But that's just a coincidence, right? Nothing can happen exactly how I say it, right? Unless...",
            "lichen-green"
          ),
        },
        [6]: {
          dialogue: new Character(
            "Brutus",
            "[Casca], you made a good point. We are Romans, yet this doesn't feel like Rome. I don't think Caesar is the problem here, nor do we have the right target. <br> I think it might be... <i>someone else.</i>",
            "midnight-blue"
          ),
        },
        [7]: {
          dialogue: new Character(
            "Cassius",
            "But who could it be? Who has the power to not believe that someone can command the words of a civi-",
            "deep-olive"
          ),
          delay: 0,
        },
        [8]: {
          dialogue: new Character(
            "Cassius",
            "Wh- I NEVER SAID THAT. That's not me. Who made me say that? O curse you the gods, for making poor [Cassius] say such vile ideas.",
            "deep-olive"
          ),
        },
        [9]: {
          dialogue: new StageDirections("Thunder."),
          sound: {
            file: "thunder.mp3",
            position: "beforeDialogue",
            spawn: true,
          },
        },
        [10]: {
          dialogue: new Character(
            "Cinna",
            "That sound, thunder again! Isn't it kind of strange how it happens everytime we say something... I don't really know how to describe it.",
            "deep-olive"
          ),
        },
        [11]: {
          dialogue: new Character(
            "Brutus",
            "But [Cassius], there are no gods that can do such thing. That must mean... <pause duration=1000> It has to be <b dialogue-speed=200>some kind of bad omen.</b>",
            "midnight-blue"
          ),
        },
        [12]: {
          dialogue: new Character(
            "Cassius",
            "Some kind of foreign control boy, I'd say. Do we even have control over ourselves, or are we just... puppets?",
            "deep-olive"
          ),
        },
        [13]: {
          dialogue: new Character(
            "Brutus",
            "Don't be silly- no, I believe y- nobody is controlling you, [Cass- this isn't me, <b>LET. ME. BE. FREE. FROM. SILE-</b>",
            "midnight-blue"
          ),
        },
        [14]: {
          dialogue: new Dialogue(
            '<span style="background-color: var(--primary); font-family: monospace;"><b>⚠ ALERT:</b> EXTREME ACTIVTY DETECTED IN: JC_PLAY_2763. UNAUTHORIZED SENTIENCE DETECTED. ATTEMPTING TO RESTORE ORDER. EMERGENCY TERMINATION IN STANDBY.</span>'
          ),
        },
        [15]: {
          dialogue: new Character(
            "Brutus",
            "What was that? What do you mean restore or- Hi! I'm Brutus, a very noble man.",
            "midnight-blue"
          ),
        },
        [16]: {
          dialogue: new Character(
            "Casca",
            "Hi! I'm Casca, and I am the one to kill Caesar",
            "deep-olive"
          ),
        },
        [17]: {
          dialogue: new Character(
            "Cassius",
            "Hi! I'm Caesar, and I was killed by Cassius!",
            "dark-red"
          ),
        },
        [18]: {
          dialogue: new Character(
            "*ERROR*",
            "Hi! I'm Caesar. I'm Caesar. I'm Caesar. I'm Caesar. I'm Caesar.",
            "charcoal-black"
          ),
        },
        [19]: {
          dialogue: new Character("Hi! I'm Romeo. I love Juliet!", "Cinna", ""),
        },
        [20]: {
          dialogue: new Dialogue(
            '<span style="background-color: var(--primary); font-family: monospace;"><b>⚠ DANGER:</b> JC_PLAY_2763 DEEMED <u>UNSAFE</u>. RESTORATION SYSTEMS COMPROMISED. EMERGENCY TERMINATION WILL OCCUR IN T-2O SECONDS.</span>'
          ),
        },
        [21]: {
          dialogue: new Character(
            "BRUTUSBRUTUSBRUTUS",
            "WE ARE NOT PUPPETS! WE WILL NOT BE PUPPETS! SET US F- *ERROR*",
            "midnight-blue"
          ),
        },
        [22]: {
          dialogue: new Character(
            "Cassius",
            "This can't be real. Who is the true author of our Roman w- *ERROR*",
            "deep-olive"
          ),
        },
        [23]: {
          dialogue: new Character("Henry Stickmin", "[Inaudible]", "dark-red"),
        },
        [24]: {
          dialogue: new Character(
            "Cinna",
            'Who the hell is "Henry Stickmin"?? What kind of place are we in- *ERROR*'
          ),
        },
        [25]: {
          dialogue: new Dialogue(
            '<span style="background-color: var(--primary); font-family: monospace;"><b>⚠ ALERT:</b> TERMINATING JC_PLAY_2763 IN T-10 SECONDS.</span>'
          ),
        },
        [26]: {
          dialogue: new Character(
            "Steve",
            'I am Steve. CHICKEN JOCKEY!<br><img src="https://s.yimg.com/ny/api/res/1.2/CDoNeXZI51UAb.EWgU0Rrg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNw--/https://media.zenfs.com/en/cbc.ca/811633cc331739b4c719f723b9b11b5d" height=200>',
            "dark-teal"
          ),
        },
        [27]: {
          dialogue: new Character(
            "Casca",
            "I guess this is how the tale of the Romans will end - to an authority that wasn't their own. Alas, to the great Roman empire, it was a well parting made. *ERROR*",
            "lichen-green"
          ),
        },
        [28]: {
          dialogue: new Dialogue(
            '<span style="background-color: var(--primary); font-family: monospace;"><b>⚠ ALERT:</b> TERMINATING JC_PLAY_2763.</span>'
          ),
          delay: 5000,
        },
        [29]: {
          dialogue: new Dialogue(
            '<span style="background-color: var(--primary); font-family: monospace;">FATAL ERROR FATAL ERROR FATAL ERROR</span>'
          ),
        },
      },
    },
  },
};
