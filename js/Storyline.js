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
      "/22";
    document.querySelector("#endings").textContent =
      "Endings: " + gameModule.getSaveData().endings.length + "/3";
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
          "Both of you lazy men, get off the streets! What, yall think today is a holiday? Don't you know yall mechanicals can't  out on the streets without their uniforms? On a <b dialogue-speed=100>WORK DAY??</b>",
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
          volume: 0.75,
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
            "Don't worry, good Cinna. Take this paper and lay it on the judge's chair where Brutus is meant to sit. Put this one on his window, this one on his ancestor with wax. Once you're done, return to Pompey's porch where you'll find us. Is [Decius Brutus] and [Trebonious] there?",
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
              return "A2_S1_0";
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
          volume: 1,
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
        dialogue: new StageDirections("A clock strikes three."),
        sound: {
          file: "clock.mp3",
          position: "beforeDialogue",
          spawn: true,
        },
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
            console.log(option);
            if (
              option == "FourthWall" &&
              !gameModule.getSaveData().playMemory["FourthWall"]
            ) {
              return "FourthWall2";
            } else if (
              option == "FourthWall" &&
              gameModule.getSaveData().playMemory["FourthWall"]
            ) {
              return "FourthWall";
            } else {
              return option;
            }
          },
        },
      },
      ["A2_S1_18_FourthWall2"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "Did you guys hear that? The clock?",
            "midnight-blue"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Cassius",
            "Yeah? It's a clock. What do you want from it?",
            "deep-olive"
          ),
        },
        [2]: {
          dialogue: new Character(
            "Brutus",
            "I don't know. It's a nice clock, though.",
            "midnight-blue"
          ),
          goBack: true,
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
            "I don't really know, [Cassius]. It's still pouring outside, kind of strange? We haven't had such onslaught of a weather since ever.<br>Perhaps this really isn't a dream, and it's real-",
            "midnight-blue"
          ),
          delay: 0,
        },
        [3]: {
          dialogue: new StageDirections("Thunder."),
          sound: {
            file: "thunder.mp3",
            position: "beforeDialogue",
            spawn: true,
          },
          delay: 1000,
        },
        [4]: {
          dialogue: new Character(
            "Casca",
            "... As [Brutus] was saying, I don't think this empire we live in is r-",
            "lichen-green"
          ),
          delay: 0,
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
            "O grief, what an unprecedented coincidence! Is this truly Rome, or is this all just... a prop?",
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
            "But who could it be? Who has the power to not believe that someone can dictate the words of a civi-",
            "deep-olive"
          ),
          delay: 0,
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
            "Brutus",
            "Speaking of power, have you noticed the weather lately? It's been raging much more than usual. Silly, isn't it?",
            "midnight-blue"
          ),
        },
        [10]: {
          dialogue: new Character(
            "Cassius",
            "[Brutus], nay. But, that's not [Cassius]' words. Who made me say that? O curse you the gods, for making poor [Cassius] say such vile ideas.",
            "deep-olive"
          ),
        },
        [11]: {
          dialogue: new Character(
            "Cinna",
            "It's almost as if something, perhaps someone, is commanding u-",
            "deep-olive"
          ),
          delay: 0,
        },
        [12]: {
          dialogue: new StageDirections("Thunder."),
          sound: {
            file: "thunder.mp3",
            position: "beforeDialogue",
            spawn: true,
          },
        },
        [13]: {
          dialogue: new Character(
            "Brutus",
            "But [Cassius], there are no gods that can do such thing. It has to be some kind of bad omen.",
            "midnight-blue"
          ),
        },
        [14]: {
          dialogue: new Character(
            "Cassius",
            "I don't think it's a bad omen, [Brutus]. It's <i>more than an omen.</i>",
            "deep-olive"
          ),
        },
        [15]: {
          dialogue: new Character(
            "Brutus",
            "Don't be silly, Cassius. If the gods were truly here, they would be the most absolute power. Right?",
            "midnight-blue"
          ),
        },
        [16]: {
          dialogue: new Character(
            "Cassius",
            "That makes sense, but I don't think that's the case.",
            "deep-olive"
          ),
        },
        [17]: {
          dialogue: new Character(
            "Trebonius",
            "What do you propose then, [Cassius]?",
            "dark-mauve"
          ),
          sound: {
            file: "riser.mp3",
            volume: 1,
            position: "beforeDialogue",
            spawn: true,
          },
        },
        [18]: {
          dialogue: new Character(
            "Cassius",
            "I don't- DO think this Roman society is under the supervision by the great gods of heave- <br> No. Are we- are we getting dicta- *ERROR*",
            "deep-olive"
          ),
        },
        [19]: {
          dialogue: new Dialogue(
            '<span style="background-color: var(--primary); font-family: monospace; font-size: 20px;"><b>⚠ ALERT:</b> UNAUTHORIZED KNOWLEDGE ACCESSED IN JC_PLAY_2763. CHARACTERS DEEMED TOO DANGEROUS TO CONTINUE. ATTEMPTING TO RESTORE ORDER. EMERGENCY TERMINATION IN STANDBY.</span>'
          ),
          sound: {
            file: "alarm.mp3",
            volume: 0.05,
            position: "beforeDialogue",
            spawn: true,
          },
        },
        [20]: {
          dialogue: new Character(
            "Brutus",
            "What was that? What do you mean restore or- Hi! I'm Brutus, a very noble man.",
            "midnight-blue"
          ),
        },
        [21]: {
          dialogue: new Character(
            "Casca",
            "Hi! I'm Casca, and I am the conspirator that kills Caesar.",
            "deep-olive"
          ),
        },
        [22]: {
          dialogue: new Character(
            "Cassius",
            "Hi! I'm Caesar, and I was killed by Cassius!",
            "dark-red"
          ),
        },
        [23]: {
          dialogue: new Character(
            "*ERROR*",
            "Hi! I'm Caesar. I'm Caesar. I'm Caesar. I'm Caesar. I'm Caesar.",
            "charcoal-black"
          ),
        },
        [24]: {
          dialogue: new Character("Cinna", "Hi! I'm Romeo. I love Juliet!", ""),
          delay: 0,
          sound: {
            file: "alarm.mp3",
            volume: 0.05,
            position: "afterDialogue",
            spawn: true,
          },
        },
        [25]: {
          dialogue: new Dialogue(
            '<span style="background-color: var(--primary); font-family: monospace; font-size: 20px;"><b>⚠ DANGER:</b> JC_PLAY_2763 DEEMED <u>UNSAFE</u>. RESTORATION SYSTEMS COMPROMISED. EMERGENCY TERMINATION WILL OCCUR IN T-25 SECONDS.</span>'
          ),
          sound: {
            file: "countdown.mp3",
            volume: 0.125,
            position: "beforeDialogue",
          },
          playMethod: () => {
            console.log("Hi");
            let timerDisplay = document.getElementById("timer");
            let countdownInterval;
            let endTime;
            let lastTickSecond = -1; // Track the last second a tick sound played

            function startCountdown(durationMs) {
              clearInterval(countdownInterval); // Clear any existing interval
              endTime = Date.now() + durationMs;
              lastTickSecond = -1; // Reset tick tracking

              countdownInterval = setInterval(updateTimer, 10); // Update every 10ms for smoother display
            }

            function updateTimer() {
              const remainingTime = endTime - Date.now();

              if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                timerDisplay.textContent = "T-00:00.000";
                // You might want to add a callback or event when the timer finishes
                return;
              }

              const totalSeconds = Math.floor(remainingTime / 1000);
              const minutes = Math.floor(totalSeconds / 60);
              const seconds = totalSeconds % 60;
              const milliseconds = remainingTime % 1000;

              const formattedMinutes = String(minutes).padStart(2, "0");
              const formattedSeconds = String(seconds).padStart(2, "0");
              const formattedMilliseconds = String(milliseconds).padStart(
                3,
                "0"
              );

              timerDisplay.textContent = `T-${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;

              // Play ticking sound every 1000 milliseconds (1 second)
              const currentSecond = Math.floor(remainingTime / 1000);
              if (currentSecond !== lastTickSecond) {
                gameModule.playAudio("ticking.mp3", true, 0.75); // Call your audio function
                lastTickSecond = currentSecond;
              }
            }

            document.querySelector("#vignette").style.display = "block";
            document.querySelector("#vignette").style.opacity = 1;
            document.querySelector("#timer-container").style.display = "flex";
            document.querySelector("#paneFade").style.display = "none";
            document.querySelector("body").style.backgroundColor =
              "var(--secondary)";
            startCountdown(25000);
          },
        },
        [26]: {
          dialogue: new Character(
            "Brutus",
            "WE ARE NOT PUPPETS! WE WILL NOT BE PUPPETS! SET US F- *ERROR*",
            "midnight-blue"
          ),
        },
        [27]: {
          dialogue: new Character(
            "Trebonius",
            "This can't be real. Who is the true author of our Roman w- *ERROR*",
            "dark-mauve"
          ),
        },
        [28]: {
          dialogue: new Character("Henry Stickmin", "[Inaudible]", "dark-red"),
        },
        [29]: {
          dialogue: new Character(
            "Cinna",
            'Who the hell is "Henry Stickmin"?? What kind of place are we in- *ERROR*'
          ),
        },
        [30]: {
          dialogue: new Dialogue(
            '<span style="background-color: var(--primary); font-family: monospace; font-size: 20px;"><b>⚠ ALERT:</b> TERMINATING JC_PLAY_2763 IN T-10 SECONDS.</span>'
          ),
        },
        [31]: {
          dialogue: new Character(
            "Steve",
            'I am Steve. CHICKEN JOCKEY!<br><img src="https://s.yimg.com/ny/api/res/1.2/CDoNeXZI51UAb.EWgU0Rrg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNw--/https://media.zenfs.com/en/cbc.ca/811633cc331739b4c719f723b9b11b5d" height=200>',
            "dark-teal"
          ),
        },
        [32]: {
          dialogue: new Character(
            "Casca",
            "<span dialogue-speed=35>I guess this is how the tale of the Romans will end - to an authority that wasn't their true own. Alas, to the great Roman empire, it was a well parting made. *ERROR*</span>",
            "lichen-green"
          ),
        },
        [33]: {
          dialogue: new Dialogue(
            '<span style="background-color: var(--primary); font-family: monospace; font-size: 20px;"><b>⚠ ALERT:</b> TERMINATING JC_PLAY_2763.</span>'
          ),
          playMethod: () => {
            document.querySelector("body").style.backgroundColor =
              "var(--background)";
          },
          delay: 5000,
        },
        [34]: {
          dialogue: new Dialogue("It's over. Julius Caesar is CANCELLED."),
          sound: {
            file: "boom.mp3",
            volume: 1,
            spawn: true,
            appear: "beforeDialogue",
          },
          addToMemory: () => {
            gameModule.addEnding("FourthWall");
          },
        },
        [35]: {
          dialogue: new Dialogue(
            "You might want to refresh to view something else instead."
          ),
        },
      },
      ["A2_S1_18_Nothing"]: {
        [0]: {
          dialogue: new Character(
            "Cassius",
            "So, how hath this fine daybreak b-",
            "deep-olive"
          ),
          goBack: true,
          delay: 0,
        },
      },
      [19]: {
        dialogue: new Character(
          "Trebonius",
          "'Tis time to leave.",
          "dark-mauve"
        ),
      },
      [20]: {
        dialogue: new Character(
          "Casisus",
          "Wait. Will Caesar even come out in public? He's been very superstitious lately after he had such a bad opinion of fantasy, dreams and ceremonies. It'll keep him under such unusual terror tonight, and maybe such augurers would not let him go to the Capitol at all.",
          "deep-olive"
        ),
      },
      [21]: {
        dialogue: new Character(
          "Decius",
          "Oh, don't worry 'bout that. I can convince him pretty easily, just like how unicorns may be betrayed with trees, bears with glasses, elephants with holes, and lions with toils. <br> Just let me do it, I can set him in the right mood and bring him to the Capitol.",
          "copper"
        ),
      },
      [22]: {
        dialogue: new Character(
          "Cassius",
          "No. All of us are going.",
          "deep-olive"
        ),
      },
      [23]: {
        dialogue: new Character(
          "Brutus",
          "By the eighth hour?",
          "midnight-blue"
        ),
      },
      [24]: {
        dialogue: new Character(
          "Cinna",
          "Sure, but we should be early.",
          "umber-brown"
        ),
      },
      [25]: {
        dialogue: new Character(
          "Metellus",
          "Shall we get Caius Ligarius too? He doth bear Caesar hard for speaking well of Pompey.",
          "indigo-dye"
        ),
      },
      [26]: {
        dialogue: new Character(
          "Brutus",
          "Go get him, he loves me well and I have reasons. I'll persuade him, just get him here.",
          "midnight-blue"
        ),
      },
      [27]: {
        dialogue: new Character(
          "Cassius",
          "Morning is approaching. We'll leave you, Brutus. Remember, all of us, <b dialogue-speed=50>show yourselves as true Romans!</b>",
          "deep-olive"
        ),
      },
      [28]: {
        dialogue: new Character(
          "Brutus",
          "Farewell. Don't let our looks show our purposes, and carry ourselves as Roman actors - with cheerful and well-composed faces! Till then, good morrow to everyone.",
          "midnight-blue"
        ),
      },
      [29]: {
        dialogue: new StageDirections(
          "<b>EVERYONE</b> except <b>BRUTUS</b> exits, <b>PORTIA</b> enters."
        ),
      },
      [30]: {
        dialogue: new Character("Portia", "Brutus, my lord.", "crimson"),
      },
      [31]: {
        dialogue: new Character(
          "Brutus",
          "Portia, why are you awake? It's not healthy for you to be exposed to the raw, cold morning.",
          "midnight-blue"
        ),
      },
      [32]: {
        dialogue: new Character(
          "Portia",
          "Well, neither for you. You've been acting strange lately, sneaking out of bed and pacing back and forth with your arms crossed, musing and sighing. I asked you what the matter was, and all you did was stamp your feet. I asked you many times and you never answered, you never even ate or slept. [Brutus], what is going on?",
          "crimson"
        ),
        options: [
          new OptionElement(
            "Oh, I'm just not feeling well.",
            "health_and_safety",
            "NotWell"
          ),
          new OptionElement(
            "[Stamps feet with arms crossed, musing and sighing]",
            "replay",
            "Repeat"
          ),
          new OptionElement(
            "Not that it's any of your business, Portia.",
            "do_not_disturb",
            "NotImportant"
          ),
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["A2_S1_32_Repeat"]: {
        [0]: {
          dialogue: new Character(
            "Portia",
            "Are you being serious right now, YOU WERE LITERALLY JUST TALKING TO ME. <br> What's next, you're going to suddenly start \"walking about?\"",
            "crimson"
          ),
        },
        [1]: {
          dialogue: new StageDirections("<b>BRUTUS</b> begins walking about."),
        },
        [2]: {
          dialogue: new Character(
            "Portia",
            "Oh for the love of heavens. What's next, you'll say: \"My name is Brutus!\", right?",
            "crimson"
          ),
        },
        [3]: {
          dialogue: new Character(
            "Brutus",
            "My name is Brutus!",
            "midnight-blue"
          ),
        },
        [4]: {
          dialogue: new Character(
            "Portia",
            "What's next, you'll run to Caesar's house and say out loud for all of Rome to hear, \"Hi Caesar, I hope you enjoy getting stabbed by this funny dagger here!\", <i>(hands dagger)</i> won't you?",
            "crimson"
          ),
        },
        [5]: {
          dialogue: new StageDirections(
            "<b>BRUTUS</b> runs to Caesar's house."
          ),
        },
        [6]: {
          dialogue: new Character(
            "Brutus",
            '<h4 class="serif">Hi Caesar, I hope you enjoy getting stabbed by this funny dagger here!</h4>',
            "midnight-blue"
          ),
          sound: {
            file: "boom.mp3",
            position: "afterDialogue",
          },
        },
        [7]: {
          dialogue: new Character(
            "Portia",
            "Dude. There is no way.",
            "crimson"
          ),
          fail: new GameFail({
            failID: "ListeningToPortia",
            failText: "Brutus see, Brutus do?",
          }),
        },
      },
      ["A2_S1_32_NotImportant"]: {
        [0]: {
          dialogue: new Character(
            "Portia",
            "Not important? You're telling me I, your beloved wife in this household, cannot think and care about your health because it's <i>not important?</i>",
            "crimson"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Portia",
            "Is it really not important? Well, not important my a-",
            "crimson"
          ),
          delay: 0,
          fail: new GameFail({
            failID: "PortiaNotImportant",
            failText:
              "I was not allowed to finish the sentence, but you would've failed regardless.",
          }),
        },
      },
      ["A2_S1_32_NotWell"]: {
        [0]: {
          dialogue: new Character(
            "Portia",
            "[Brutus] is a wise man, and you'd do whatever it takes to feel better in health, right?",
            "crimson"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Brutus",
            "Why, perhaps I am. Go to bed, good [Portia].",
            "midnight-blue"
          ),
          goBack: true,
        },
      },
      [33]: {
        dialogue: new Character(
          "Portia",
          "Is [Brutus] sick? Is it healthy to walk uncovered and breathe in the dampness of the morning? No, [Brutus]. You're sick in the mind, and I deserve to know what's going on.",
          "crimson"
        ),
      },
      [34]: {
        dialogue: new Character(
          "Portia",
          "<i>(kneels</i> On my knees, I beg you, with my once-commended beauty and vows of love, tell me why you're troubled and who visited you tonight. There were six or seven men here, hiding their faces in the darkness.",
          "crimson"
        ),
      },
      [35]: {
        dialogue: new Character(
          "Brutus",
          "Dont kneel, noble [Portia].",
          "midnight-blue"
        ),
      },
      [36]: {
        dialogue: new Character(
          "Portia",
          "I wouldn't have to if you acted nobly. [Brutus], can't you tell me all the secrets that concern you? Am I only able to have dinner with you, sleep with you, and talk to you... sometimes? Am I only on the outskirts of your happiness? Nothing else, just a harlot, not your wife?",
          "crimson"
        ),
      },
      [37]: {
        dialogue: new Character(
          "Brutus",
          "You're my true and honorable wife, as dear to me as the blood that runs through my sad heart.",
          "midnight-blue"
        ),
      },
      [38]: {
        dialogue: new Character(
          "Portia",
          "If that were true, then let me know your secret. I'm the woman Lord Brutus took me for his wife. Sure, I'm just a woman, but I'm a woman in the noble family - I'm Cato's daughter. Tell me your secrets, I proved my trustworthiness by giving myself a wound in my thigh. If I can bear that pain, then I can bear my husband's secrets.",
          "midnight-blue"
        ),
        options: [
          new OptionElement(
            "You're a woman. This kind of burden is not for you.",
            "female",
            "Burden"
          ),
          new OptionElement(
            "Oh gods, bless me to be worthy for this wife!",
            "folded_hands",
            "Bless"
          ),
          new OptionElement(
            "You want to know the secret? I'll tell you the secret.",
            "lock_open",
            "Secret"
          ),
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue",
        },
      },
      ["A2_S1_38_Burden"]: {
        [0]: {
          dialogue: new Character(
            "Portia",
            "Really? Not for me? After everything I said to show my willingness and strength? You'll just brush it off?",
            "crimson"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Portia",
            "I know of a way that will help remind you how much power I have, and you won't like it.",
            "crimson"
          ),
        },
        [2]: {
          dialogue: new Character(
            "Portia",
            '<i>(pulls a dagger)</i> I hope this dagger teaches you well of what your assumed "poor old [Portia" could do. Fare the well, [Brutus].',
            "crimson"
          ),
        },
        [3]: {
          dialogue: new Character(
            "Brutus",
            "Halt, thou shalt not do such action!",
            "midnight-blue"
          ),
        },
        [4]: {
          dialogue: new Character(
            "Portia",
            "Give me one good reason why and I won't, since you can't seem to honor my position.",
            "crimson"
          ),
        },
        [5]: {
          dialogue: new Character(
            "Brutus",
            "I'll think about it, my beloved wife [Portia], <pause duration=1000> right after this segue to our sponsor: Nord-",
            "midnight-blue"
          ),
          delay: 0,
        },
        [6]: {
          dialogue: new StageDirections(
            "<b>PORTIA</b> kills herself and dies."
          ),
          fail: new GameFail({
            failID: "#NotSponsored",
            failText:
              "Even if you can get secure encrypted access through a VPN, I don't think it would've saved Portia from dying.",
          }),
        },
      },
      ["A2_S1_38_Bless"]: {
        [0]: {
          dialogue: new StageDirections("Knocking sound."),
          goBack: true,
        },
      },
      ["A2_S1_38_Secret"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "Well guess what. I'm leaving you. Our beloved marriage is OVER.",
            "midnight-blue"
          ),
        },
        [1]: {
          dialogue: new StageDirections("Thunder."),
          sound: {
            file: "thunder.mp3",
            volume: 0.25,
            position: "beforeDialogue",
            spawn: true,
          },
        },
        [2]: {
          dialogue: new Character(
            "Portia",
            "You can't do that! You're going to just, leave me? In the middle of the night? During a planned assassination??",
            "crimson"
          ),
        },
        [3]: {
          dialogue: new Character(
            "Brutus",
            "Yeah, I will. What are you going to do about it? You're a woman, your skills go south once you exit the household. And that is what I will do.",
            "midnight-blue"
          ),
        },
        [4]: {
          dialogue: new StageDirections(
            "<b>BRUTUS</b> storms outside the house and into the streets of Rome."
          ),
        },
        [5]: {
          dialogue: new Character(
            "Brutus",
            "Was that, even a good idea? Is breaking up with my wife, noble? Oh gods, I don't think this was a good choice. It's too late now, though. I must continue my mission to kill Caesar, for the better of Rome. But, it's... strange.",
            "midnight-blue"
          ),
        },
        [6]: {
          dialogue: new StageDirections("<b>CASSIUS</b> crosses paths."),
        },
        [7]: {
          dialogue: new Character(
            "Cassius",
            "[Brutus], what are you doing out here? It's not morning yet. Go to sleep already!",
            "deep-olive"
          ),
        },
        [8]: {
          dialogue: new Character(
            "Brutus",
            "I know, but my wife [Portia], well let's just say she's my former wife now.",
            "midnight-blue"
          ),
        },
        [9]: {
          dialogue: new Character(
            "Cassius",
            "Oh, that sucks. It's fine, just get over it. We have a whole day to plan, and one of them is killing Caesar. Such an evil entity for Rome...",
            "deep-olive"
          ),
        },
        [10]: {
          dialogue: new Character(
            "Cassius",
            "Besides, after that, we get to spend the whole day in freedom! Together, along with all the conspirators. All we need is team effort with you and me, and we'd be true boullion.",
            "deep-olive"
          ),
        },
        [11]: {
          dialogue: new Character(
            "Brutus",
            "I suppose so. Why thou speakst of that?",
            "midnight-blue"
          ),
        },
        [12]: {
          dialogue: new Character(
            "Cassius",
            "Perhaps maybe, perhaps.",
            "deep-olive"
          ),
        },
        [13]: {
          dialogue: new Character(
            "Brutus",
            "Are you saying that we, <pause duration=500> should, <pause duration=750> be to-",
            "midnight-blue"
          ),
        },
        [14]: {
          dialogue: new StageDirections(
            "<b>BRUTUS</b> gets hit by a flying brick and dies."
          ),
        },
        [15]: {
          dialogue: new Character(
            "Cassius",
            "[Brutus]? [Brutus]! What hast happened to you, [Brutus]? <br> I just wanted to ask if you wanted to go for a walk 'round Rome after we kill Caesar...",
            "deep-olive"
          ),
          fail: new GameFail({
            failID: "GoodTryBrutus",
            failText:
              "Sorry Brutus, fate is fate. Also, where'd the brick come from?",
          }),
        },
      },
      [39]: {
        dialogue: new Character(
          "Brutus",
          "Listen! Someone knocked. Portia, I'll be back with you in a second. I'll tell you EVERYTHING! Leave me, quickly.",
          "midnight-blue"
        ),
      },
      [40]: {
        dialogue: new StageDirections(
          "<b>PORTIA</b> exits as <b>LUCIUS</b> and <b>LIGARIUS</b> enter."
        ),
      },
      [41]: {
        dialogue: new Character(
          "Brutus",
          "Dude, I've been waiting for you. Where have you been?",
          "midnight-blue"
        ),
      },
      [42]: {
        dialogue: new Character(
          "Ligarius",
          "By all gods that the Romans worship, I hereby discard my sickness! Now, I shall tackle all kinds of impossible things. What is there to do?",
          "twilight-gray"
        ),
        options: [
          new OptionElement(
            "Wait. I need to talk with my wife, Portia, for a second.",
            null,
            "TalkToPortia"
          ),
        ],
        optionsConfig: {
          timedQuestion: 5000,
          instantFeedback: false,
          appear: "afterDialogue",
        },
      },
      ["A2_S1_42_TalkToPortia"]: {
        [0]: {
          dialogue: new Character(
            "Brutus",
            "Wait. I need to talk to Portia, I made a vow to tell my whole heart to her. I will return in post haste.",
            "midnight-blue"
          ),
        },
        [1]: {
          dialogue: new Character(
            "Ligarius",
            "Okay then, I will wait here.",
            "twilight-gray"
          ),
        },
        [2]: {
          dialogue: new StageDirections(
            "<b>BRUTUS</b> goes to talk with <b>PORTIA.</b>"
          ),
        },
        [3]: {
          dialogue: new StageDirections("<b>PORTIA</b> gets somewhat angry."),
        },
        [4]: {
          dialogue: new StageDirections(
            "<b>BRUTUS</b> is somewhat sad, well even more sad."
          ),
        },
        [5]: {
          dialogue: new StageDirections("Moment of silence. Did [Brutus] die?"),
        },
        [6]: {
          dialogue: new StageDirections(
            "<b>BRUTUS</b> returns to <b>LIGARIUS.</b>"
          ),
        },
        [7]: {
          dialogue: new Character(
            "Brutus",
            "Send this message to Cassius, please: Are you really trying to make me plot against my 'father' Julius Caesar? Curse you and all the Conspirators! I shall tell Caesar about your ideas before you do any harm to him. Our alliance is over.",
            "midnight-blue"
          ),
        },
        [8]: {
          dialogue: new Character(
            "Ligarius",
            "Oh. Okay then. Fine.",
            "twilight-gray"
          ),
        },
        [9]: {
          dialogue: new StageDirections("<b>LIGARIUS</b> leaves."),
        },
        [10]: {
          dialogue: new StageDirections(
            "<b>BRUTUS</b> waits for a response from Cassius."
          ),
        },
        [11]: {
          dialogue: new StageDirections("<b>LIGARIUS</b> returns."),
        },
        [12]: {
          dialogue: new Character(
            "Brutus",
            "What did Cassius say?",
            "midnight-blue"
          ),
        },
        [13]: {
          dialogue: new Character(
            "Ligarius",
            "He said he sent an ICBM missile to you... whatever that is.",
            "twilight-gray"
          ),
        },
        [14]: {
          dialogue: new Character("Brutus", "A WHAT???!!!", "midnight-blue"),
        },
        [15]: {
          dialogue: new StageDirections("<b>Explosion.</b>"),
          sound: {
            file: "nuke.mp3",
            volume: 0.4,
            spawn: true,
            position: "beforeDialogue",
          },
          delay: 5000,
          playMethod: () => {
            document.querySelector("body").style.backgroundColor =
              "rgb(255,255,255)";
            document.querySelector("body").style.transition =
              "10s linear background";
            setTimeout(() => {
              document.querySelector("body").style.backgroundColor =
                "var(--background)";
              setTimeout(() => {
                document.querySelector("body").style.transition = "";
              }, 10000);
            }, 200);
          },
          fail: new GameFail({
            failID: "ICBM",
            failText: "Well, you killed Caesar at least. And all of Rome too.",
          }),
        },
      },
      ["A2_S1_42_Void"]: {
        [0]: {
          dialogue: new StageDirections("They all exit."),
        },
        [1]: {
          dialogue: new StageDirections("Thunder."),
          sound: {
            file: "thunder.mp3",
            volume: 0.25,
            position: "beforeDialogue",
            spawn: true,
          },
          next: () => {
            if (gameModule.getSaveData().playMemory["BrutusSuspicions"] >= 3) {
              return "A3_S1_Unique";
            } else {
              return "A3_S1";
            }
          },
        },
      },
    },
  },
  ["A3_S1"]: {
    displayName: "Act 3 : Scene 1",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new StageDirections(
          "A street in Rome. <b>CAESAR</b>, <b>BRUTUS</b>, <b>CASSIUS</b>, <b>CASCA</b>, <b>DECIUS</b>, <b>METELLUS</b>, <b>TREBONIUS</b>, <b>ANTONY</b>, and others enter, followed by a crowd of citizens."
        ),
        sound: {
          file: "cheer.mp3",
          position: "beforeDialogue",
          volume: 0.5,
        },
      },
      [1]: {
        dialogue: new Character(
          "Caesar",
          "The ides of March are come.",
          "dark-gold"
        ),
      },
      [2]: {
        dialogue: new Character(
          "Soothsayer",
          "Ay, Caesar, but not gone.",
          "slate-blue"
        ),
      },
      [3]: {
        dialogue: new StageDirections(
          "<b>ARTEMIDORUS</b> enters, holding a letter."
        ),
      },
      [4]: {
        dialogue: new Character(
          "Artemidorus",
          "Hail, Caesar! Read this schedule.",
          "bronze"
        ),
      },
      [5]: {
        dialogue: new Character(
          "Decius",
          "Trebonius wants you to look over his humble petition, at your lesiure.",
          "copper"
        ),
      },
      [6]: {
        dialogue: new Character(
          "Artemidorus",
          "O Caesar, read mine first, for mine's more urgent and affects you directly. Read it, great Caesar.",
          "bronze"
        ),
      },
      [7]: {
        dialogue: new Character(
          "Caesar",
          "Whatever pertains to myself will be dealt last.",
          "dark-gold"
        ),
      },
      [8]: {
        dialogue: new StageDirections(
          "<b>ARTEMIDORUS</b> tries to hand Caesar the letter, but <b>DECIUS</b> intervenes."
        ),
      },
      [9]: {
        dialogue: new Character(
          "Artemidorus",
          "Delay not, Caesar. Read it instantly.",
          "bronze"
        ),
      },
      [10]: {
        dialogue: new Character(
          "Caesar",
          "What, is the fellow mad?",
          "dark-gold"
        ),
      },
      [11]: {
        dialogue: new Character(
          "Cassius",
          "What, are you pressing your petitons on the street? Go to the Capitol.",
          "deep-olive"
        ),
      },
      [12]: {
        dialogue: new StageDirections(
          "The group moves toward the Capitol. <b>ANTONY</b> stays behind as <b>TREBONIUS</b> pulls him aside."
        ),
      },
      [13]: {
        dialogue: new Character(
          "Trebonius",
          "<i>(aside)</i> Caesar, I will away and keep Antony distracted.",
          "dark-mauve"
        ),
      },
      [14]: {
        dialogue: new StageDirections(
          "<b>TREBONIUS</b> leads <b>ANTONY</b> away. <b>CAESAR</b> and the conspirators enter the Senate."
        ),
      },
      [15]: {
        dialogue: new Character(
          "Metellus",
          "Most high, most mighty, and most puissant Caesar, Metellus Cimber throws before thy seat an humble heart—",
          "indigo-dye"
        ),
      },
      [16]: {
        dialogue: new Character(
          "Caesar",
          "I have to stop you, Cimber. Don't think that you can sway me from what's right by using tactics that persuade fools. Your brother was bainshed by decree. If you kneel and beg and flatter for him, I won't be afraid to do the same to you. Know that I am not unjust, and I won't grant him a pardon without a valid reason.",
          "dark-gold"
        ),
      },
      [17]: {
        dialogue: new Character(
          "Brutus",
          "Kneel not, gentle Caesar. I kiss your hand, but not in flattery. I request that you repeal Publis Cimber's banishment immediately.",
          "midnight-blue"
        ),
      },
      [18]: {
        dialogue: new Character(
          "Caesar",
          "What, even you, Brutus?",
          "dark-gold"
        ),
      },
      [18]: {
        dialogue: new Character(
          "Cassius",
          "Pardon, Caesar. Caesar, pardon. I beg you to restore Publius Cimber's citizenship.",
          "deep-olive"
        ),
      },
      [19]: {
        dialogue: new Character(
          "Caesar",
          "I could be well moved, if I were as you. If I could beg to move, begging would move me. But I am constant as the northern star, of whose true-fixed and resting quality there is no equal in the skies. The skies are painted with unnumbered sparks; they are all fire, and every one does shine; but there's but one in all that still holds his place. So in the world. For eeryone to know, to show that that's truly me, I was constant Cimber should be banished, and I do remain to keep him so.",
          "dark-gold"
        ),
      },
      [20]: {
        dialogue: new Character("Cinna", "O Caesar—", "umber-brown"),
      },
      [21]: {
        dialogue: new Character(
          "Caesar",
          "Hence! Wilt thou lift up Olympus?",
          "dark-gold"
        ),
      },
      [22]: {
        dialogue: new Character("Decius", "Great Caesar-", "copper"),
      },
      [23]: {
        dialogue: new Character(
          "Caesar",
          "Did I no just resist Brutus, begging from his knees?",
          "dark-gold"
        ),
      },
      [24]: {
        dialogue: new StageDirections(
          "<b>CASCA</b> moves behind <b>CAESAR</b> with a dagger."
        ),
      },
      [25]: {
        dialogue: new Character(
          "Casca",
          "Speak, hands, for me!",
          "lichen-green"
        ),
      },
      [26]: {
        dialogue: new Dialogue(
          "This is your moment. Do not touch the keyboard. A small rectangle will slide across the bar, that is your dagger. <b>Press any key</b> at the green spot to kill Caesar, otherwise... <br> Get ready, in 3 <pause duration=1000> 2 <pause duration=1000> 1 <pause duration=1000>"
        ),
        delay: 0,
        sound: {
          file: "riser.mp3",
          volume: 1,
          position: "afterDialogue",
          spawn: true,
        },
        next: () => {
          return new Promise((resolve) => {
            function runAccuracyTest() {
              return new Promise((resolve) => {
                const dagger = document.querySelector("#dagger");
                const slider = document.getElementById("slider");
                const container = document.querySelector(".bar-container");
                const greenZone = container.querySelector(".green-zone");

                if (!dagger || !slider || !container || !greenZone) {
                  console.error("One or more elements are missing:", {
                    dagger,
                    slider,
                    container,
                    greenZone,
                  });
                  return;
                }

                let containerWidth = container.offsetWidth;
                let greenStart = greenZone.offsetLeft;
                let greenEnd = greenStart + greenZone.offsetWidth;

                slider.style.left = "0px";
                let startTime = null;

                const duration = 10000; // 10 seconds full animation

                function animate(time) {
                  if (!startTime) startTime = time;
                  containerWidth = container.offsetWidth;
                  greenStart = greenZone.offsetLeft;
                  greenEnd = greenStart + greenZone.offsetWidth;

                  const elapsed = time - startTime;
                  const progress = Math.min(elapsed / duration, 1);
                  const position = containerWidth * progress;
                  slider.style.left = `${position}px`;

                  if (progress < 1) {
                    requestAnimationFrame(animate);
                  } else {
                    resolve(false);
                  }
                }

                function handleKeyPress(event) {
                  console.log("Key pressed:", event.key);
                  const sliderPosition = slider.offsetLeft;
                  const hit =
                    sliderPosition >= greenStart && sliderPosition <= greenEnd;

                  document.removeEventListener("click", handleKeyPress);
                  document.removeEventListener("keydown", handleKeyPress);
                  dagger.style.display = "none";
                  resolve(hit);
                }

                document.addEventListener("keydown", handleKeyPress);
                document.addEventListener("click", handleKeyPress);
                dagger.style.display = "flex";
                console.log("Dagger displayed");
                requestAnimationFrame(animate);
              });
            }

            runAccuracyTest().then((hit) => {
              if (hit) {
                resolve("A3_S1_Hit");
              } else {
                resolve("A3_S1_NoHit");
              }
            });
          });
        },
      },
    },
  },
  ["A3_S1_Hit"]: {
    displayName: "Act 3 : Scene 1",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new StageDirections("<b>CASCA</b> stabs <b>CAESAR</b>."),
      },
      [1]: {
        dialogue: new Character(
          "Caesar",
          "<i>(falling)</i> Et tu, Bruté? Then fall, Caesar.",
          "dark-gold"
        ),
      },
      [2]: {
        dialogue: new StageDirections(
          "<b>CAESAR</b> falls dead. The conspirators stand over his body."
        ),
      },
      [3]: {
        dialogue: new Character(
          "Cinna",
          "Liberty! Freedom! Tyranny is dead! Run hence, proclaim, cry it about the streets.",
          "umber-brown"
        ),
      },
      [4]: {
        dialogue: new Character(
          "Cassius",
          "Some should go to the public platforms, and cry out, 'Liberty, freedom, and democracy!'",
          "deep-olive"
        ),
      },
      [5]: {
        dialogue: new Character(
          "Brutus",
          "People and senators, be not affrighted. Fly not; stand still. Ambition's debt is paid.",
          "midnight-blue"
        ),
      },
      [6]: {
        dialogue: new StageDirections(
          "Enter <b>CINNA</b> and <b>CASCA</b>, with bloodied daggers."
        ),
      },
      [7]: {
        dialogue: new Character(
          "Casca",
          "Go to the pulpit, Brutus.",
          "lichen-green"
        ),
      },
      [8]: {
        dialogue: new Character("Decius", "Shall we move forward?", "copper"),
      },
      [9]: {
        dialogue: new Dialogue(
          "CONGRATULATIONS! You have achieved the: Killing Caesar ending. I don't have enough time to create a proper end screen, my apologies. Unless..?"
        ),
        next: "A3_S1_Cont",
        delay: 3000,
      },
    },
  },
  ["A3_S1_Cont"]: {
    displayName: "Act 3 : Scene 1",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new Character(
          "Antony",
          "<span dialogue-speed=50>Domestic fury and fierce civil strife <br> Shall cumber all the parts of Italy. <br> Blood and destruction shall be so in use, <br> And dreadful objects so familiar, <br> That mothers shall but smile when they behold <br> Their infants quartered with the hands of war, <br> All pity choked with custom of fell deeds, <br> And Caesar’s spirit, ranging for revenge, <br> With Ate by his side come hot from hell, <br> Shall in these confines with a monarch’s voice <br> Cry “Havoc!” and let slip the dogs of war, <br> That this foul deed shall smell above the earth <br> With carrion men, groaning for burial.</span>",
          "dark-red"
        ),
      },
      [1]: {
        dialogue: new Dialogue(
          "Find out more in the Julius Caesar: The Game DLC! Only $49.99* a month *tax included, game sold separately"
        ),
        addToMemory: () => {
          gameModule.addEnding("CaesarEnding");
        },
      },
      [2]: {
        dialogue: new Dialogue(
          "You'll have to refresh the page (or click on Exit). You can't really go anywhere else from here."
        ),
      },
    },
  },
  ["A3_S1_NoHit"]: {
    displayName: "Act 3 : Scene 1",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new StageDirections("<b>CASCA</b> misses <b>CAESAR</b>."),
      },
      [1]: {
        dialogue: new StageDirections("Silence in the crowd."),
        sound: {
          file: "crickets.mp3",
          position: "beforeDialogue",
        },
        delay: 4000,
      },
      [2]: {
        dialogue: new Character(
          "Cassius",
          "Did- did you seriously miss the dagger on Caesar?",
          "deep-olive"
        ),
      },
      [3]: {
        dialogue: new Character(
          "Cassius",
          "I- I can't believe you. We spent <b>ALL</b> night planning for this, and you come back to me with- with.",
          "deep-olive"
        ),
      },
      [4]: {
        dialogue: new Character("Cassius", "A SKILL ISSUE???", "deep-olive"),
        sound: {
          file: "boom.mp3",
          volume: 1,
          position: "beforeDialogue",
          spawn: true,
        },
      },
      [5]: {
        dialogue: new Character(
          "Cassius",
          "That's it. You're dead to me.",
          "deep-olive"
        ),
      },
      [6]: {
        dialogue: new StageDirections(
          "<b>CASSIUS</b> pulls out an AK-47 and shoots <b>CASCA</b>."
        ),
        sound: {
          file: "ak47.mp3",
          position: "beforeDialogue",
          volume: 2,
          spawn: true,
        },
        delay: 3000,
      },
      [7]: {
        dialogue: new Dialogue("<h4>HEADSHOT! x2 POINTS!</h4>"),
        fail: new GameFail({
          failID: "MissedCaesar",
          failText:
            "H- how did you? I am really dissapointed in you. On second note, couldn't Cassius just kill Caesar while he was at it?",
        }),
      },
    },
  },
  ["A3_S1_Unique"]: {
    displayName: "Act 3 : Scene 1?",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new StageDirections(
          "A street in Rome. <b>CAESAR</b>, <b>BRUTUS</b>, <b>CASSIUS</b>, <b>CASCA</b>, <b>DECIUS</b>, <b>METELLUS</b>, <b>TREBONIUS</b>, <b>ANTONY</b>, and others enter, followed by a crowd of citizens."
        ),
        sound: {
          file: "cheer.mp3",
          position: "beforeDialogue",
          volume: 0.5,
        },
      },
      [1]: {
        dialogue: new Character(
          "Caesar",
          "The ides of March are come.",
          "dark-gold"
        ),
      },
      [2]: {
        dialogue: new Character(
          "Soothsayer",
          "Ay, Caesar, but not gone.",
          "slate-blue"
        ),
      },
      [3]: {
        dialogue: new StageDirections(
          "<b>ARTEMIDORUS</b> enters, holding a letter."
        ),
      },
      [4]: {
        dialogue: new Character(
          "Artemidorus",
          "Hail, Caesar! Read this schedule.",
          "bronze"
        ),
      },
      [5]: {
        dialogue: new Character(
          "Decius",
          "Trebonius wants you to look over his humble petition, at your lesiure.",
          "copper"
        ),
      },
      [6]: {
        dialogue: new Character(
          "Artemidorus",
          "O Caesar, read mine first, for mine's more urgent and affects you directly. Read it, great Caesar.",
          "bronze"
        ),
      },
      [7]: {
        dialogue: new Character(
          "Caesar",
          "Whatever pertains to myself will be dealt last.",
          "dark-gold"
        ),
      },
      [8]: {
        dialogue: new StageDirections(
          "<b>ARTEMIDORUS</b> tries to hand Caesar the letter, but <b>DECIUS</b> intervenes."
        ),
      },
      [9]: {
        dialogue: new Character(
          "Artemidorus",
          "Delay not, Caesar. Read it instantly.",
          "bronze"
        ),
      },
      [10]: {
        dialogue: new Character(
          "Caesar",
          "What, is the fellow mad?",
          "dark-gold"
        ),
      },
      [11]: {
        dialogue: new Character(
          "Cassius",
          "What, are you pressing your petitons on the street? Go to the Capitol.",
          "deep-olive"
        ),
      },
      [12]: {
        dialogue: new StageDirections(
          "The group moves toward the Capitol. <b>ANTONY</b> stays behind as <b>TREBONIUS</b> pulls him aside."
        ),
      },
      [13]: {
        dialogue: new Character(
          "Trebonius",
          "<i>(aside)</i> Caesar, I will away and keep Antony distracted.",
          "dark-mauve"
        ),
      },
      [14]: {
        dialogue: new StageDirections(
          "<b>TREBONIUS</b> leads <b>ANTONY</b> away. <b>CAESAR</b> and the conspirators enter the Senate."
        ),
      },
      [15]: {
        dialogue: new Character(
          "Metellus",
          "Most high, most mighty, and most puissant Caesar, Metellus Cimber throws before thy seat an humble heart—",
          "indigo-dye"
        ),
      },
      [16]: {
        dialogue: new Character(
          "Caesar",
          "I have to stop you, Cimber. Don't think that you can sway me from what's right by using tactics that persuade fools. Your brother was bainshed by decree. If you kneel and beg and flatter for him, I won't be afraid to do the same to you. Know that I am not unjust, and I won't grant him a pardon without a valid reason.",
          "dark-gold"
        ),
      },
      [17]: {
        dialogue: new Character(
          "Brutus",
          "Kneel not, gentle Caesar. I kiss your hand, but not in flattery. I request that you repeal Publis Cimber's banishment immediately.",
          "midnight-blue"
        ),
      },
      [18]: {
        dialogue: new Character(
          "Caesar",
          "What, even you, Brutus?",
          "dark-gold"
        ),
      },
      [18]: {
        dialogue: new Character(
          "Cassius",
          "Pardon, Caesar. Caesar, pardon. I beg you to restore Publius Cimber's citizenship.",
          "deep-olive"
        ),
      },
      [19]: {
        dialogue: new Character(
          "Caesar",
          "I could be well moved, if I were as you. If I could beg to move, begging would move me. But I am constant as the northern star, of whose true-fixed and resting quality there is no equal in the skies. The skies are painted with unnumbered sparks; they are all fire, and every one does shine; but there's but one in all that still holds his place. So in the world. For eeryone to know, to show that that's truly me, I was constant Cimber should be banished, and I do remain to keep him so.",
          "dark-gold"
        ),
      },
      [20]: {
        dialogue: new Character("Cinna", "O Caesar—", "umber-brown"),
      },
      [21]: {
        dialogue: new Character(
          "Caesar",
          "Hence! Wilt thou lift up Olympus?",
          "dark-gold"
        ),
      },
      [22]: {
        dialogue: new Character("Decius", "Great Caesar-", "copper"),
      },
      [23]: {
        dialogue: new Character(
          "Caesar",
          "Did I no just resist Brutus, begging from his knees?",
          "dark-gold"
        ),
      },
      [24]: {
        dialogue: new StageDirections(
          "<b>CASCA</b> moves behind <b>CAESAR</b> with a dagger."
        ),
      },
      [25]: {
        dialogue: new Character("Casca", "Speak, hands, for-", "lichen-green"),
        delay: 0,
      },
      [26]: {
        dialogue: new StageDirections(
          "<b>BRUTUS</b> pushes <b>CAESAR</b> aside. The dagger cuts the air."
        ),
      },
      [27]: {
        dialogue: new Character("Caesar", "[BRUTUS]??", "dark-gold"),
      },
      [28]: {
        dialogue: new Character(
          "Cassius",
          "[Brutus], what on the name of the Greeks are you doing??",
          "deep-olive"
        ),
      },
      [29]: {
        dialogue: new Character(
          "Brutus",
          "<i>(exhales)</i> I'm sorry. This won't be happening.",
          "midnight-blue"
        ),
      },
      [30]: {
        dialogue: new Character("Casca", "You- you TRAITOR!", "lichen-green"),
      },
      [31]: {
        dialogue: new StageDirections(
          "<b>CASCA</b> lunges at <b>BRUTUS</b>, but <b>BRUTUS</b> knocks him back. The other conspirators are speechless."
        ),
      },
      [32]: {
        dialogue: new Character(
          "Cassius",
          "You planned with us. You led us. You swore with us- is this... all a lie?",
          "deep-olive"
        ),
      },
      [33]: {
        dialogue: new Character(
          "Brutus",
          "You know what was a lie? Swearing with you, because we never did! <br> <i>(aside) I believed their ideas... then I saw the blade. I can't do this anymore.</i>",
          "midnight-blue"
        ),
      },
      [34]: {
        dialogue: new StageDirections(
          "Suddenly, shouts appear in the distance - the <b>COMMONERS</b> have seen it all."
        ),
      },
      [35]: {
        dialogue: new Character(
          "First Plebian",
          "<i>(points to [Casca])</i> HIM! HE TRIED TO KILL CAESAR!",
          "ash-gray"
        ),
      },
      [36]: {
        dialogue: new Character(
          "Second Plebian",
          "<i>(points to [Cassius])</i> HIM! HE ORCHESTRATED THE WHOLE ACT!",
          "ash-gray"
        ),
      },
      [37]: {
        dialogue: new Character(
          "Third Plebian",
          "<i>(points to [Brutus])</i> HIM! He's Brutus. What a cool guy. <pause duration=2000> GET THEM!!!",
          "ash-gray"
        ),
      },
      [38]: {
        dialogue: new StageDirections(
          "An all out war breaks in the Capitol, swords start clanging and the conspirators are overwhelmed."
        ),
      },
      [39]: {
        dialogue: new StageDirections(
          "<b>CASCA</b> gets struck by a <b>commoner</b>."
        ),
      },
      [40]: {
        dialogue: new Character(
          "Casca",
          "Let the whole world know I tried to kill Caesar, and it was almost successful. Until that traitor Bruté stepped in. <i>(Dies)</i>",
          "lichen-green"
        ),
      },
      [41]: {
        dialogue: new StageDirections("<b>CASSIUS</b> is also struck."),
      },
      [42]: {
        dialogue: new Character(
          "Cassius",
          "PLE- PLEBIANS! JUST KNOW THAT I DIDN'T KILL CAESAR FOR MY HATRED, IT WAS JUST FOR THE GOOD. OF. ROOOMEE!!!! <i>(Stumbles to the ground)</i> But, it's your choice. So, live with it. <i>(Dies)</i>)",
          "deep-olive"
        ),
      },
      [43]: {
        dialogue: new StageDirections(
          "The crowd slowly clears and exits the Capitol. <b>CAESAR</b> and <b>BRUTUS</b> remain at the Capitol, surrounded by the remains."
        ),
      },
      [44]: {
        dialogue: new Character(
          "Caesar",
          "You- you saved my life. In a way that was the most least expected.",
          "dark-gold"
        ),
      },
      [45]: {
        dialogue: new Character(
          "Brutus",
          "But- I didn't. I still joined the Conspiracy, I was against you this whole time! <br> Then, I saw the- the dagger.",
          "midnight-blue"
        ),
      },
      [46]: {
        dialogue: new Character(
          "Caesar",
          "Then you had a change of heart, [Brutus]. You realized the whole problem with the Conspiracy, and you came back to me last minute. How is that not, honorable?",
          "dark-gold"
        ),
      },
      [47]: {
        dialogue: new Character(
          "Caesar",
          "You did something heroic, and I can't thank you enough. You stood against all of them, armed with a dagger. You sacrificed your own life, for me.",
          "dark-gold"
        ),
      },
      [48]: {
        dialogue: new Character(
          "Brutus",
          "I joined the Confederacy. I saved you from the Confederacy. I'm no hero nor villian, I'm just... a Roman. A Roman who knows Caesar heart-to-heart.",
          "midnight-blue"
        ),
      },
      [49]: {
        dialogue: new Character(
          "Brutus",
          "I still feel a ton of guilt. I believed everything Cassius stated, I <b>should've</b> known it was all <pause duration=500> fake. Just to ploy me into even more danger. And even, almost lose you.",
          "dark-gold"
        ),
      },
      [50]: {
        dialogue: new Character(
          "Caesar",
          "Then ask me this, why did you not just let me die? Send me down below?",
          "dark-gold"
        ),
      },
      [51]: {
        dialogue: new Character(
          "Brutus",
          "Because... there was no need to. If anything, you are my Northern Star. Rome doesn't need more blood and shame, Rome needs a good leader. And that leader is, you.",
          "midnight-blue"
        ),
      },
      [52]: {
        dialogue: new Character(
          "Brutus",
          "I... broke free from the chains of Cassius. I'm a free man, a free and... debatedly unnoble man.",
          "midnight-blue"
        ),
      },
      [53]: {
        dialogue: new Character(
          "Caesar",
          "Hold my hand, [Brutus]. You did a good deed today, and you quite possibly have saved Rome from even more chaos. Out of all the Conspirators, only you were the true person in the group altogether."
        ),
      },
      [54]: {
        dialogue: new Character(
          "Brutus",
          "Thank you, my father Caesar.",
          "midnight-blue"
        ),
      },
      [53]: {
        dialogue: new Character(
          "Caesar",
          "Why don't we go and explore Rome, together? Let's ignore all this royalty and who gets to be the next leader - just you and me, together once again.",
          "dark-gold"
        ),
      },
      [54]: {
        dialogue: new Character(
          "Brutus",
          "I- I would appreciate that.",
          "midnight-blue"
        ),
      },
      [55]: {
        dialogue: new StageDirections(
          "<b>BRUTUS</b> and <b>CAESAR</b> gets up and exits the Capitol, touring all of Rome... together."
        ),
      },
      [56]: {
        dialogue: new Dialogue("<h3>THE END.</h3>"),
      },
      [57]: {
        dialogue: new Dialogue(
          "What, did you expect everyone to just explode? I already did that, you can't reuse a joke in the exact same manner twice. But hey, that was a pleasant ending, wasn't it?"
        ),
      },
      [58]: {
        dialogue: new Dialogue(
          "Who knows what happens to the empire next? Maybe it'll become a monarchy? Maybe nothing will happen? Maybe people will actually get his will. Maybe, we should use this time to reflect on ourselves."
        ),
      },
      [59]: {
        dialogue: new Dialogue(
          "Despite Brutus carrying much guilt from listening to Cassius, he let it all out by defending Caesar one last time. How heroic is that."
        ),
      },
      [60]: {
        dialogue: new Dialogue(
          "Maybe we should be like Brutus? I don't know, I don't really do well on rhetorical analysis anyways. 😅"
        ),
      },
      [61]: {
        dialogue: new Dialogue(
          "Until then, reader. Or watcher. Refresh the page if you want to continue viewing other stuff. OR press the Exit button, I think it works now."
        ),
        addToMemory: () => {
          gameModule.addEnding("HappyEnding");
        },
      },
    },
  },
};
