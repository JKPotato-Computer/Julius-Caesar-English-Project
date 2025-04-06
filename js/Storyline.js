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
    for (let i = 0; i < this.lineIndecies.length;) {
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

    for (let i = 0; i < this.lineIndecies.length;) {
      if (i + 1 < this.lineIndecies.length && typeof this.lineIndecies[i + 1] == "string") {
        currentLine =
          currentLine[
          this.storyID +
          "_" +
          this.lineIndecies[i] +
          "_" +
          this.lineIndecies[i + 1]
          ];
        if (typeof (this.lineIndecies[i]) == "number") {
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
    for (let i = 0; i < this.lineIndecies.length;) {
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

    for (let i = 0; i < this.lineIndecies.length;) {
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
          )
        },
        [7]: {
          dialogue: new Character(
            "Murellus",
            "\"Mend me???\" You think <i>I</i> am in a fit of rage, you saucy man?",
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
            )
          },
          [1]: {
            dialogue: new Character(
              "Flavius",
              "Sorry, Murellus. I couldn't hear you over the dust storm your shoes kicked up 'round thy words.",
              "shadow-purple"
            )
          },
          [2]: {
            dialogue: new Character(
              "Murellus",
              "I d- <i>*sigh</i> Fine.",
              "charcoal-black"
            ),
            goBack: true
          }
        },
        ["A1_S1_7_Void"]: {
          [0]: {
            dialogue: new Character(
              "Murellus",
              "Too afeard to speak, eh? [Flavius], what do we say to this vile mechanic?",
              "charcoal-black"
            )
          },
          [1]: {
            dialogue: new Character(
              "Flavius",
              "He's a cobbler, [Murellus].",
              "shadow-purple"
            )
          },
          [2]: {
            dialogue: new Character(
              "Murellus",
              "A mute cobbler, [Flavius]! Can't you imagine a Roman who cannot even whimper a word back to us? A fake Roman, I'd say even!",
              "charcoal-black"
            )
          },
          [3]: {
            dialogue: new Character(
              "Murellus",
              "How about I take your tools and replace them with stones.<br>Then, you'll learn to be a real Roman.",
              "charcoal-black"
            ),
          },
          [4]: {
            dialogue: new Character(
              "Flavius",
              "...",
              "shadow-purple"
            ),
            delay: 2000,
            goBack: true
          }
        },
        [8]: {
          dialogue: new Character(
            "Flavius",
            "But, what brings you out here? Why are you not working?",
            "shadow-purple"
          )
        },
        [9]: {
          dialogue: new Character(
            "Cobbler",
            "To tire out my shoes and do more work, obviously!",
            "burnt-orange"
          ),
          sound: {
            file: "punchline.mp3",
            position: "afterDialogue"
          }
        },
        [10]: {
          dialogue: new Character(
            "Cobbler",
            "Okay, I just want to celebrate the acts that Caesar commited at Pompey!",
            "burnt-orange"
          )
        },
        [11]: {
          dialogue: new Character(
            "Murellus",
            "Why should you even bother? What's so significant about Caesar's conquest of Pompey? You've seen it all from the start, climbing on your walls and looking out towers and windows; hell, even to chimney tops. You've seen it all!",
            "charcoal-black"
          )
        },
        [12]: {
          dialogue: new Character(
            "Murellus",
            "Now you think it's worth taking a holiday and putting on your best clothes? To see something you've watched for the past couple days?<br>A good riddance to thee!",
            "charcoal-black"
          )
        },
        [13]: {
          dialogue: new Character(
            "Flavius",
            "Go. Begone. Go to the banks of Tiber and weep till its stream touches the shoreline, reflecting on what you just did.",
            "shadow-purple"
          )
        },
        [14]: {
          dialogue: new StageDirections("<b>CARPENTER, COBBLER,</b> and the <b>COMMONERS</b> leave.")
        },
        [15]: {
          dialogue: new Character(
            "Flavius",
            "We can't let them celebrate Caesar's victory, nor anyone else. Come, head to the capital and start disrobing all ceremonies off the statues.",
            "shadow-purple"
          )
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
          )
        },
        [18]: {
          dialogue: new StageDirections("<b>FLAVIUS</b> and <b>MURELLUS</b> exit separately."),
          next: "A1_S2"
        }
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
  ["A1_S2"]: {
    displayName: "Act 1 : Scene 2",
    ["teamConspirators"]: {
      [0]: {
        dialogue: new StageDirections("A trumpet plays."),
        sound: {
          file: "trumpet.mp3",
          position: "beforeDialogue"
        }
      },
      [1]: {
        dialogue: new Character(
          "Soothsayer",
          "<u>[Caesar]!</u>",
          "slate-blue"
        ),
        options: [
          new OptionElement(
            "Who's calling me?",
            "back_hand",
            "CallingMe"
          ),
          new OptionElement(
            "Who's Caesar?",
            "question_mark",
            "WhoCaesar"
          ),
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
          goBack: true
        }
      },
      ["A1_S2_1_WhoCaesar"]: {
        [0]: {
          dialogue: new Character(
            "Soothsayer",
            "...",
            "slate-blue"
          ),
          delay: 2000,
        },
        [1]: {
          dialogue: new Character(
            "Soothsayer",
            "You're Caesar!",
            "slate-blue"
          ),
        },
        [2]: {
          dialogue: new Character(
            "Caesar",
            "Oh. Blunder.",
            "dark-gold"
          ),
          goBack: true
        }
      },
      ["A1_S2_1_Void"]: {
        [0]: {
          dialogue: new StageDirections("Silence"),
          sound: {
            file: "crickets.mp3",
            position: "beforeDialogue"
          },
          delay: 4000
        },
        [1]: {
          dialogue: new Character(
            "Soothsayer",
            "Caesar! Caesar! Wherefor art Caesar?",
            "slate-blue"
          ),
          fail: new GameFail({
            failID: "CaesarNotFound",
            failText: "ERROR: To kill Caesar, you need Caesar. (before you ask, yes. I know this is a later act.)"
          })
        }
      },
      [2]: {
        dialogue: new Character(
          "Caesar",
          "Who in here calls me? I can distinguish the noises from the music crying \"Caesar!\" Speak up, what do you have to say?",
          "dark-gold"
        ),
      },
      [3]: {
        dialogue: new Character(
          "Soothsayer",
          "Beware the ides of March, sir!",
          "slate-blue"
        )
      },
      [4]: {
        dialogue: new Character(
          "Caesar",
          "Who??",
          "dark-gold"
        ),
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
        dialogue: new StageDirections("The Soothsayer comes forward.")
      },
      [9]: {
        dialogue: new Character(
          "Cassius",
          "Look upon Caesar.",
          "deep-olive"
        ),
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
        options: [
          new OptionElement("Ah, you're just a dreamer. Move along.", "bubble_chart", "Dreamer"),
          new OptionElement("The... Ides of March?", "flag", "Suspicious"),
          new OptionElement("Wait, there's ice in March?", "deployed_code", "Ice")
        ],
        optionsConfig: {
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue"
        }
      },
      ["A1_S2_11_Dreamer"]: {
        [0]: {
          dialogue: new Character("Caesar", "Go, all of you people.", "dark-gold"),
          goBack: true,
        }
      },
      ["A1_S2_11_Suspicious"]: {
        [0]: {
          dialogue: new Dialogue("<i>Caesar will remember that...<i>"),
          addToMemory: (playMemory) => {
            playMemory["CaesarSuspicious"] = true;
          },
          goBack: true
        }
      },
      ["A1_S2_11_Ice"]: {
        [0]: {
          dialogue: new Character(
            "Soothsayer",
            "<b>I D E S</b> of March, not <b>I C E</b> of March.",
            "slate-blue"
          )
        },
        [1]: {
          dialogue: new Character(
            "Caesar",
            "The id... ce of March? I don't get it, what does ice have to do with me?",
            "dark-gold"
          )
        },
        [2]: {
          dialogue: new Character(
            "Soothsayer",
            "No- whatever.",
            "slate-blue"
          ),
          goBack: true
        },
      },
      [12]: {
        dialogue: new StageDirections(
          "All but Brutus and Cassius exit."
        ),
        sound: {
          file: "trumpet.mp3",
          position: "beforeDialogue"
        }
      },
      [13]: {
        dialogue: new Dialogue("<i>whoo..! it's a ghost! you might want to keep track of what you tell to [Brutus], since it may influence the ending of your story... </i>"),
      },
      [14]: {
        dialogue: new Character("Cassius", "So, Brutus. Are you going to watch the race?", "deep-olive"),
      },
      [15]: {
        dialogue: new Character("Brutus", "Me? I'm not gamesome at all! Nor am I as competitive as Antony.<br>But, that's enough time. Let's split paths, shall we?", "midnight-blue"),
      },
      [16]: {
        dialogue: new Character("Cassius", "Wait. You've been acting strange lately. You were once such in a loving and gentle manner, and now you're stubborn over your dear friend?", "deep-olive"),
      },
      [17]: {
        dialogue: new Character("Brutus", "<u>[Cassius]</u>, I get it. I've been going through much contemplating amongst my thoughts and inner conflicts. But you're still a good friend, <u>[Cassius]</u>. Don't let my emotions change you.", "midnight-blue")
      },
      [18]: {
        dialogue: new Character("Brutus", "Don't worry about the poor Brutus fighting against himself at war, who forgets to share love towards others.", "midnight-blue")
      },
      [19]: {
        dialogue: new Character("Cassius", "Brutus, can't you look at yourself?", "deep-olive"),
      },
      [20]: {
        dialogue: new Character("Brutus", "No, I can't. My eyes only look forward, I can only see what reflects back to me.", "midnight-blue"),
      },
      [21]: {
        dialogue: new Character("Cassius", "Too bad there aren't any mirrors to show who you really are, [Brutus], a noble Roman like Caesar. Speaking of Caesar, you've seen the turn of events that's been happening in Rome, right? Or has your sight blocked you from everything?", "deep-olive")
      },
      [22]: {
        dialogue: new Character("Brutus", "What are you trying to tell me, <u>[Cassius]</u>? What dangers are you pointing at for me? Is it <pause duration=500> <i>me?</i>", "midnight-blue"),
        options: [
          new OptionElement("Well, I'll be your mirror to show who you really are, Brutus. A noble gentleman. If you believe me as a fool who goes to slander all friends after befriending them, then go ahead and believe I'm dangerous.", null, "Success"),
          new OptionElement("Brutus, I am your mirror to show how exquisite you really are. Haven't you seen yourslef lately? I think you'd make an excellent artist of Rome, even.", null, "Fail"),
          new OptionElement("Brutus, let me be your mirror. I won't indulge you in flatter, but let the truth be told — only few men are as admired as you. You've been the support for Rome's strength, and as a great friend, I just want you to see it too.", null, "Unique")
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue"
        }
      },
      ["A1_S2_22_Success"]: {
        [0]: {
          dialogue: new Character("Brutus", "Okay th-", "midnight-blue"),
          delay: 0,
          goBack: true,
        }
      },
      ["A1_S2_22_Unique"]: {
        [0]: {
          dialogue: new Character("Brutus", "Fine then...", "midnight-blue"),
          addToMemory: (playMemory) => {
            if (playMemory["BrutusSuspicions"] && playMemory["BrutusSuspicions"].indexOf("Statement1") != -1) {
              playMemory["BrutusSuspcicions"].push("Statement1");
            } else {
              playMemory["BrutusSuspcicions"] = ["Statement1"];
            }
          },
          goBack: true,
        }
      },
      ["A1_S2_22_Fail"]: {
        [0]: {
          dialogue: new Character("Brutus", "Methinks you are overrating my worth, <u>[Cassius]</u>. I must seek a place of quietude, for I can't handle such flattery.", "midnight-blue"),
          fail: new GameFail({
            failID: "CassiusManiuplationFail1",
            failText: "Can Brutus even draw?"
          }
          ),
        }
      },
      [23]: {
        dialogue: new StageDirections("Shouts are heard."),
      },
      [24]: {
        dialogue: new Character("Brutus", "Why are they shouting? I fear the people do choose Ceasar for their king.", "midnight-blue"),
      },
      [25]: {
        dialogue: new Character("Cassius", "Really, you're fearing that? Then I'd suppose you don't want that, either.", "deep-olive"),
      },
      [26]: {
        dialogue: new Character("Brutus", "Not really, <u>[Cassius]</u>, though I love Caesar very much. But, why do you keep me here? What do you want from me, all of this? If Caesar is for the good of Rome, then I'd follow suit till my death. The gods will honor me over my death for my commitment.", "midnight-blue"),
        options: [
          new OptionElement("Honor, Brutus. Honor is what I came here for. We both were born with equal power as Caesar — you know that, right? I remember that one moment at the Tiber: Caesar dared me to swim across, and I did. He followed me, yet halfway, he called, \"Help me, Cassius, or I will sink!\" And like Aeneas, I carried him from the flood that is the Tiber. Yet, that same Cesar now rules as a god.", "null", "Success"),
          new OptionElement("Brutus, I'm here to show you honor. We were once like Caesar, powerless and like the others. I once crossed this treacherous river out of pure will, even when Caesar tried to push me downstream. He couldn't even make it halfway across, more of an eighth! I had to save the frail ol' Caesar like a wooden stick. Can't you see it all now?", null, "Fail"),
          new OptionElement("Brutus, think about this for a bit. Caesar once challenged me to swim 'cross the Tiber, and I did. He did, too. Yet halfway across, I overheard Caesar shouting, \"Cassius, I need your help!\" Sure, I carried him out, but I wondered if this defined Caesar as anything. Someone... mortal. A real person. Maybe too good to be true.", null, "Unique")
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue"
        }
      },
      ["A1_S2_26_Success"]: {
        [0]: {
          dialogue: new Character("Brutus", "Sur-", "midnight-blue"),
          delay: 0,
          goBack: true,
        }
      },
      ["A1_S2_26_Fail"]: {
        [0]: {
          dialogue: new Character("Brutus", "What I see is... you're calling Caesar weak? I don't really find you a \"great\" friend you...", "midnight-blue"),
          fail: new GameFail(
            {
              failID: "CassiusManiuplationFail2",
              failText: "caesar felt hurt by that :("
            }
          )
        }
      },
      ["A1_S2_26_Unique"]: {
        [0]: {
          dialogue: new Character("Brutus", "and...? Why are you telling me this?"),
          goBack: true,
          addToMemory: (playMemory) => {
            if (playMemory["BrutusSuspicions"] && playMemory["BrutusSuspicions"].indexOf("Statement2") != -1) {
              playMemory["BrutusSuspcicions"].push("Statement2");
            } else {
              playMemory["BrutusSuspcicions"] = ["Statement2"];
            }
          },
        }
      },
      [27]: {
        dialogue: new StageDirections("More shouting."),
      },
      [28]: {
        dialogue: new StageDirections("Even more shouting! Is this all honors being handed over to Caesar?"),
        options: [
          new OptionElement("Well, Caesar is like a giant who sees the world beneath him. Us? Petty men! All we get to do is walk, no, <i>crawl</i> under his legs and die in dishonor. Is this Rome to us anymore?", null, "Success"),
          new OptionElement("Caesar? He's more of a child than a true king, let alone a \"noble\" one. I'd much rather live a miserable life to anyone but some pathetic leader.", null, "Fail"),
          new OptionElement("I guess Caesar can stand tall and represent Rome. Honestly, I don't think it's about his position, but rather us. Shouldn't we be standing up for ourselves, for all of Rome?",null,"Unique")
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue"
        }
      },
      ["A1_S2_28_Success"]: {
        [0]: {
          dialogue: new Character("Brutus", "...", "midnight-blue"),
          goBack: true
        }
      },
      ["A1_S2_28_Fail"]: {
        [0]: {
          dialogue: new Character("Brutus", "A child, you say? How about this?<br><br><i>Dear <u>[Cassius]</u> <pause duration=1000> 's parents, I think you may need to re-educate your chi-", "midnight-blue"),
          delay: 0,
          fail: new GameFail({
            failID: "CassiusManiuplationFail3",
            failText: "According to my calculations, Caesar is most definitely not a child."
          })
        }
      },
      ["A1_S2_28_Unique"]: {
        [0]: {
          dialogue: new Character("Brutus", "So? What do you want me to do, <u>[Cassius]</u> Cheer? Weep?", "midnight-blue"),
          addToMemory: (playMemory) => {
            if (playMemory["BrutusSuspicions"] && playMemory["BrutusSuspicions"].indexOf("Statement3") != -1) {
              playMemory["BrutusSuspcicions"].push("Statement3");
            } else {
              playMemory["BrutusSuspcicions"] = ["Statement3"];
            }
          },
          goBack: true
        }
      },
      [29]: {
        dialogue: new Character("Cassius","<small>(continued response)</small>","deep-olive"),
        options: [
          new OptionElement("You know this isn't the stars that make us do this, Brutus. The gods don't see Caesar above us, we do. This was our choice, we are the underlings.",null,"Success"),
          new OptionElement("Really? You'd believe in the stars that Caesar has any power? Come on now, of course not! He's just a cowardest of the cowards. If anything, we're all just fools in this... place of Rome.",null,"Fail"),
          new OptionElement("Maybe we should look to ourselves. Something that we should've watched before it grew to be much more... dangerous.",null,"Unique")
        ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue"
        }
      },
      ["A1_S2_29_Success"]: {
        [0]: {
          dialogue: new Character("Brutus","I see...","midnight-blue"),
          goBack: true
        }
      },
      ["A1_S2_29_Fail"]: {
        [0]: {
          dialogue: new Character("Brutus","Are you just here to complain about Caesar? If so, begone. Maybe <b>YOU'RE</b> the coward after all.","midnight-blue"),
          fail: new GameFail(
            {
              failID: "CassiusManiuplationFail4",
              failText: "How many times do I have to tell you that bullying Caesar will not make Brutus change his mind?",
            }
          )
        }
      },
      ["A1_S2_29_Unique"]: {
        [0]: {
          dialogue: new Character("Brutus","Then, what do you want me to do? Look at who I was before?","midnight-blue"),
          addToMemory: (playMemory) => {
            if (playMemory["BrutusSuspicions"] && playMemory["BrutusSuspicions"].indexOf("Statement4") != -1) {
              playMemory["BrutusSuspcicions"].push("Statement4");
            } else {
              playMemory["BrutusSuspcicions"] = ["Statement4"];
            }
          },
          goBack: true
        }
      },
      [30]: {
        dialogue: new Character("Cassius","<small>(continued response)</small>","deep-olive"),
        options: [
          ],
        optionsConfig: {
          randomize: true,
          timedQuestion: 0,
          instantFeedback: true,
          appear: "afterDialogue"
        }
      }
    }
  }
};
