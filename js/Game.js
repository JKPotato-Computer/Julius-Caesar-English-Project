const saveData = {};
const userSettings = {
  volume: 1,
  canSkipDialogue: true,
  speed: 1
}

let isPlaying = false;
let private_load;

const gameModule = (() => {
  let shouldAutoScroll = true; // Variable to control auto-scrolling
  let hasAnsweredQuestion = false;
  let skipCooldown = false;
  let wasSkipped = false;

  let timeoutCallback, timeoutID;
  let playingAudio;
  const playAudio = (audioFileName, spawnAudio) => {
    try {
      if (spawnAudio) {
        const audio = new Audio("./sfx/" + audioFileName);
        audio.volume = .75 * userSettings.volume;
        audio.play();
        return;
      } else if (playingAudio) {
        playingAudio.pause();
      }
      playingAudio = new Audio("./sfx/" + audioFileName);
      playingAudio.volume = .5 * userSettings.volume;
      playingAudio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  const createInterruptableTimeout = (callback, delay) => {
    return new Promise((resolve) => {
      timeoutID = setTimeout(() => {
        callback();
        resolve();
      }, delay);
      timeoutCallback = callback; // Save the callback
    });
  };
  
  const interruptTimeout = () => {
    if (!timeoutID) {
      return Promise.resolve();
    }
  
    clearTimeout(timeoutID);
  
    return new Promise((resolve) => {
      if (timeoutCallback) {
        timeoutCallback(); // Execute the saved callback immediately
        timeoutCallback = null; // Clear to prevent double execution
      }
      timeoutID = null; // Clear the timeout ID
      resolve();
    });
  };

  function saveDataToLocalStorage(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true; // Indicate success
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      return false; // Indicate failure
    }
  }
  
  function loadDataFromLocalStorage(key) {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return null; // Key doesn't exist
      }
      const data = JSON.parse(serializedData);
      return data;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return null; // Indicate failure
    }
  }

  const showNotification = (message) => {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification-item';

    const text = document.createElement('span');
    text.className = 'notification-text';
    text.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.textContent = '×';
    closeButton.onclick = function() {
      container.removeChild(notification);
    };

    notification.appendChild(text);
    notification.appendChild(closeButton);
    container.appendChild(notification);
  }

  // Function to show the loading screen
  const showLoadingScreen = (duration) => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "flex"; // Show the loading screen

    if (duration) {
      setTimeout(() => {
        hideLoadingScreen();
      }, duration);
    }
  };

  // Function to hide the loading screen
  const hideLoadingScreen = () => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "none"; // Hide the loading screen
  };

  const autoScrollDialogue = (dialogueListId) => {
    const dialogueList = document.getElementById(dialogueListId);
    if (!dialogueList) {
      console.error(
        `Dialogue list element with ID "${dialogueListId}" not found.`
      );
      return;
    }

    if (shouldAutoScroll) {
      dialogueList.scrollTop = dialogueList.scrollHeight + 100;
    }
  };

  const answerQuestion = () => {
    hasAnsweredQuestion = true;
  };

  // Example of how you might prevent auto-scrolling (e.g., when the user scrolls up)
  const handleDialogueScroll = (dialogueListId) => {
    const dialogueList = document.getElementById(dialogueListId);
    if (!dialogueList) return;

    // If the user has scrolled away from the bottom (with a tolerance)
    if (
      dialogueList.scrollHeight -
        dialogueList.scrollTop -
        dialogueList.clientHeight >
      20
    ) {
      shouldAutoScroll = false;
    } else {
      shouldAutoScroll = true;
    }
  };

  const addMessageAndAutoScroll = (
    dialogueListId,
    dialogueElement,
    messageElement,
    disableTypewrite
  ) => {
    const dialogueList = document.getElementById(dialogueListId);
    if (dialogueList) {
      dialogueElement.appendChild(messageElement);

      dialogueList.appendChild(dialogueElement);
      if (!disableTypewrite) {
        Dialogue.typewriteDialogue(messageElement);
      }
      autoScrollDialogue(dialogueListId);
    }
  };

  const transitionStoryline = (storyID, safeTransition) => {
    showLoadingScreen(1000);
    saveData.storyline.setStoryID(storyID, safeTransition);
    setTimeout(() => {
      instantLoad("dialoguePage");
      loadDialogue("dialoguePage");
    }, 1000);
  };

  const retryStory = () => {
    saveData.gameEndFail.reset();
    saveData.gameEndFail = null;
    saveData.storyline.goBack(true);
    instantLoad("dialoguePage");
    loadDialogue("dialoguePage");
  };

  const exitStory = () => {
    if (saveData.storyline.hasFail()) {
      return;
    }

    isPlaying = false;
    saveData.storyline.pauseStory();
    document.querySelector("#mainPage").style.display = "";
    document.querySelector("#gamePage").style.display = "none";
    document.querySelector("#title").style.display = "flex";
    document.querySelector("#teamSelector").style.display = "none";
    document.querySelector("#mainMenu").style.display = "flex";
  };

  const instantLoad = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found.`);
      return;
    }

    container.innerHTML = "";

    let lastOptions = null;
    for (const dialog of saveData.storyline.dialogueList) {
      const [dialogueElement, message] = dialog.dialogue.createDialogue();
      handleDialogueScroll(containerId);
      addMessageAndAutoScroll(containerId, dialogueElement, message, true);

      if (dialog.options) {
        dialog.dialogue.displayOptions(
          dialogueElement,
          dialog.options,
          dialog.optionsConfig
        );
        lastOptions = dialogueElement;
      } else if (lastOptions) {
        let choice = dialog.extraParams.split(" ");
        choice = choice[choice.length - 2];
        for (const e of lastOptions.querySelectorAll(
          ".dialogueOptions > button"
        )) {
          if (e.dataset.optionId == choice) {
            e.classList.add("locked");
          } else {
            e.disabled = true;
          }
        }
        lastOptions = null;
      }
    }

    autoScrollDialogue(containerId);
  };

  const loadDialogue = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found.`);
      return;
    }
  
    document.querySelector("#actDetails").textContent =
      Storyline.prototype.acts[saveData.storyline.storyID].displayName;
  
    async function displayDialogue() { // Make displayDialogue async
      if (!saveData.storyline.hasNext()) {
        return;
      }
  
      if (!isPlaying) {
        return;
      }
  
      let [dialogue, dialogueCount] = saveData.storyline.next();
      let wasSkipped = false;
  
      const [dialogueElement, message] = dialogue.dialogue.createDialogue();
      let startTime = null;

      function handleDialogueResult() {
        document.removeEventListener("keydown", handleSpacebar);
      
        if ((dialogue.sound) && (dialogue.sound.position == "afterDialogue")) {
          playAudio(dialogue.sound.file, dialogue.sound.spawn || false);
        }

        if (dialogue.addToMemory) {
          dialogue.addToMemory(saveData.playMemory);
        }

        if (dialogue.options) {
          dialogue.dialogue.displayOptions(
            dialogueElement,
            dialogue.options,
            dialogue.optionsConfig
          );
          autoScrollDialogue(containerId);
          awaitInterval();
          return;
        }
      
        if (dialogue.fail) {
          saveData.fails.fails += 1;
          if (
            saveData.fails.discoveredFails.indexOf(dialogue.fail.failID) === -1
          ) {
            saveData.fails.discoveredFails.push(dialogue.fail.failID);
          }
      
          saveData.gameEndFail = dialogue.fail;
          dialogue.fail.displayFail();
          return;
        }
      
        if (dialogue.next) {
          if (typeof(dialogue.next) == "string") {
            transitionStoryline(dialogue.next);
          } else if (typeof(dialogue.next) == "function") {
            transitionStoryline(dialogue.next());
          }

          return;
        }
      
        if (dialogue.goBack) {;
          saveData.storyline.goBack();
          displayDialogue();
          return;
        }
      
        displayDialogue(); // Default: go to next line
      }
  
      const handleSpacebar = (event) => {
        if (message.classList.contains("skipped")) return;
        if (!userSettings.canSkipDialogue) return;
        if (event.key === " " || event.code === "Space" || event.keyCode === 32) {
          if (skipCooldown) {
            showNotification("You're skipping through too fast!");
            return;
          }
        
          skipCooldown = true;
          setTimeout(() => (skipCooldown = false), 100);
        

          message.classList.add("skipped");
          wasSkipped = true; // <<< Important
          interruptTimeout().then(() => {
            console.log("Dialogue interrupted by spacebar.");
            handleDialogueResult();
          });
        }
      };
  
      document.addEventListener("keydown", handleSpacebar);
  
      function awaitInterval() {
        if (!isPlaying) {
          return;
        }
  
        if (
          dialogue.optionsConfig.timedQuestion &&
          dialogue.optionsConfig.timedQuestion > 0
        ) {
          if (startTime == null) {
            startTime = Date.now() / 1000;
          }
  
          let secondsLeft =
            (dialogue.optionsConfig.timedQuestion / 1000 * (1 / userSettings.speed)) -
            (Date.now() / 1000 - startTime);
          dialogueElement.querySelector(".barComplete").style.width =
            (Math.abs(secondsLeft) /
            (dialogue.optionsConfig.timedQuestion / 1000 * (1 / userSettings.speed))) *
            100 +
            "%";
          dialogueElement.querySelector(".timedQuestion > span").textContent =
            Math.abs(secondsLeft).toFixed(1) + "s";
  
          if (secondsLeft <= 0) {
            if (!hasAnsweredQuestion) {
              saveData.storyline.answerResponse("Void");
            }
  
            for (const e of dialogueElement.querySelectorAll(
              ".dialogueOptions > button"
            )) {
              e.disabled = true;
            }
  
            hasAnsweredQuestion = false;
            displayDialogue();
            return;
          }
        }
  
        if (hasAnsweredQuestion && dialogue.optionsConfig.instantFeedback) {
          hasAnsweredQuestion = false;
          displayDialogue();
          return;
        }
  
        setTimeout(awaitInterval, 1);
      }
  
      dialogueCount++;
      document.querySelector("#dialogBar").style.width =
        (dialogueCount / saveData.storyline.getTotalLines()) * 100 + "%";
      document.querySelector("#percentage").textContent =
        Math.floor((dialogueCount / saveData.storyline.getTotalLines()) * 100) +
        "%";
  
      handleDialogueScroll(containerId);
      addMessageAndAutoScroll(containerId, dialogueElement, message);
  
      try {
        if ((dialogue.sound) && (dialogue.sound.position == "beforeDialogue")) {
          playAudio(dialogue.sound.file);
        }

        if (dialogue.options) {
          if (dialogue.optionsConfig.appear == "afterDialogue") {
            await createInterruptableTimeout(() => {
              if (!wasSkipped) {
                handleDialogueResult();
              }
            }, dialogue.dialogue.getDialogueDuration() + ((dialogue.delay || 750) * (1 / userSettings.speed)));
          } else {
            dialogue.dialogue.displayOptions(
              dialogueElement,
              dialogue.options,
              dialogue.optionsConfig
            );
            awaitInterval();
          }
        } else {
          if (dialogue.fail) {
            await createInterruptableTimeout(() => {
              if (!wasSkipped) {
                handleDialogueResult();
              }
            }, dialogue.dialogue.getDialogueDuration() + 1000);
            return;
          }
  
          if (dialogue.next) {
            await createInterruptableTimeout(() => {
              if (!wasSkipped) {
                handleDialogueResult();
              }
            }, dialogue.dialogue.getDialogueDuration() + 1000);
            return;
          }
  
          if (dialogue.goBack) {
            await createInterruptableTimeout(() => {
              if (!wasSkipped) {
                handleDialogueResult();
              }
            }, dialogue.dialogue.getDialogueDuration() + ((dialogue.delay || 750) * (1 / userSettings.speed)));
            return;
          }
          await createInterruptableTimeout(() => {
            if (!wasSkipped) {
              handleDialogueResult();
            }
          }, dialogue.dialogue.getDialogueDuration() + ((dialogue.delay || 750) * (1 / userSettings.speed)));
        }
      } catch (error) {
        console.error("Dialogue interrupted or failed:", error);
        // Handle the interrupt or error, if necessary.
      }
    }
  
    displayDialogue();
  };

  const wipeSaveData = function() {
    console.log("Wiped save data.");
    for (let key in saveData) {
      delete saveData[key];
    }
    console.log(saveData);
  }

  const init = function (s) {
    if (isPlaying) {
      return;
    }
    isPlaying = true;

    let hasSaveData = Object.keys(saveData).length != 0;
    if (!hasSaveData) {
      // New Save Data
      saveData["team"] = document.querySelector("#teamSelector > div:nth-child(2) > button.selected").id;
      saveData["storyline"] = new Storyline({
        storyID: ((s != "") && (Storyline.prototype.acts[s])) ? s : "Tutorial"
      });
      saveData["playMemory"] = {};
      saveData["fails"] = {
        fails: 0,
        discoveredFails: []
      };
      saveData["gameEndFail"] = null;
      saveData["endings"] = [];
      saveData["timeSpent"] = 0;
    }

    transitionStoryline(saveData.storyline.storyID, hasSaveData);
  };

  const getTeam = () => saveData.team;
  const getStoryline = () => saveData.storyline;
  const getSaveData = () => saveData;
  const getSetting = (option) => userSettings[option];
  const setSetting = (option, value) => {
    userSettings[option] = value;
    saveDataToLocalStorage("userSettings", userSettings);
  };

  const hasSaveData = () => Object.keys(saveData).length != 0;

  private_load = loadDataFromLocalStorage;

  return {
    getTeam: getTeam,
    getStoryline: getStoryline,
    loadDialogue: loadDialogue,
    init: init,
    autoScrollDialogue: autoScrollDialogue,
    answerQuestion: answerQuestion,
    getSaveData: getSaveData,
    showLoadingScreen: showLoadingScreen,
    hideLoadingScreen: hideLoadingScreen,
    retryStory: retryStory,
    exitStory: exitStory,
    hasSaveData : hasSaveData,
    wipeSaveData : wipeSaveData,
    showNotification : showNotification,
    setSetting: setSetting,
    getSetting: getSetting
  };
})();

window.onload = function () {
  gameModule.showLoadingScreen(); // Show loading screen initially
  let settings = private_load("userSettings");
  for (const key in settings) {
    userSettings[key] = settings[key];
    document.querySelector("#" + key).value = (typeof settings[key] == "boolean") ? ((settings[key] == true) ? "on" : "off") : (settings[key]*100);
    
    if (typeof(settings[key]) == "number") {
      document.querySelector("#" + key + "Val").textContent = (settings[key]*100) + "%";
    }
  }
  setTimeout(() => {
    gameModule.hideLoadingScreen(); // Hide loading screen after 1 second
  }, 1000); // 1000ms (1 second) delay after window load
};
