const saveData = {
	team: "teamConspirators",
	storyline: new Storyline({
		storyID: "Tutorial"
	}),
	playMemory: {},

	fails: {
		fails: 0,
		discoveredFails: [],
	},

	gameEndFail: null,
	endings: [],

	timeSpent: 0,
}

const gameModule = (() => {

	let shouldAutoScroll = true; // Variable to control auto-scrolling
	let hasAnsweredQuestion = false;

	let timeoutCallback, timeoutID;
	const createInterruptableTimeout = (callback, delay) => {
		timeoutID = setTimeout(callback, delay);
		timeoutCallback = callback;
	}

	const interruptTimeout = (disableCallback) => {
		if ((!timeoutCallback) || (!timeoutID)) {
			return;
		}

		if (!disableCallback) {
			timeoutCallback();
		}

		clearTimeout(timeoutID);
	}

	// Function to show the loading screen
	const showLoadingScreen = (duration) => {
		const loadingScreen = document.getElementById('loading-screen');
		loadingScreen.style.display = 'flex'; // Show the loading screen

		if (duration) {
			setTimeout(() => {
				hideLoadingScreen();
			}, duration);
		}
	}

	// Function to hide the loading screen
	const hideLoadingScreen = () => {
		const loadingScreen = document.getElementById('loading-screen');
		loadingScreen.style.display = 'none'; // Hide the loading screen
	}


	const autoScrollDialogue = (dialogueListId) => {
		const dialogueList = document.getElementById(dialogueListId);
		if (!dialogueList) {
			console.error(`Dialogue list element with ID "${dialogueListId}" not found.`);
			return;
		}

		if (shouldAutoScroll) {
			dialogueList.scrollTop = dialogueList.scrollHeight + 100;
		}
	}

	const answerQuestion = () => {
		hasAnsweredQuestion = true;
	}

	// Example of how you might prevent auto-scrolling (e.g., when the user scrolls up)
	const handleDialogueScroll = (dialogueListId) => {
		const dialogueList = document.getElementById(dialogueListId);
		if (!dialogueList) return;

		// If the user has scrolled away from the bottom (with a tolerance)
		if (dialogueList.scrollHeight - dialogueList.scrollTop - dialogueList.clientHeight > 20) {
			shouldAutoScroll = false;
		} else {
			shouldAutoScroll = true;
		}
	}

	const addMessageAndAutoScroll = (dialogueListId, dialogueElement, messageElement, disableTypewrite) => {
		const dialogueList = document.getElementById(dialogueListId);
		if (dialogueList) {
			dialogueElement.appendChild(messageElement);

			dialogueList.appendChild(dialogueElement);
			if (!disableTypewrite) {
				Dialogue.typewriteDialogue(messageElement);
			}
			autoScrollDialogue(dialogueListId);
		}
	}

	const transitionStoryline = (storyID) => {
		showLoadingScreen(1000);
		saveData.storyline.setStoryID(storyID);
		setTimeout(() => {
			instantLoad("dialoguePage");
			loadDialogue("dialoguePage");
		}, 1000);
	}

	const retryStory = () => {
		saveData.gameEndFail.reset();
		saveData.gameEndFail = null;
		saveData.storyline.goBack(true);
		instantLoad("dialoguePage");
		loadDialogue("dialoguePage");
	}

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
				dialog.dialogue.displayOptions(dialogueElement, dialog.options, dialog.optionsConfig);
				lastOptions = dialogueElement;
			} else if (lastOptions) {
				let choice = dialog.extraParams.split(" ");
				choice = choice[choice.length - 2];
				for (const e of lastOptions.querySelectorAll(".dialogueOptions > button")) {
					if (e.dataset.optionId == choice) {
						e.classList.add("locked");
					} else {
						e.disabled = true;
					}
				}
				lastOptions = null;
			}
		}
	}

	const loadDialogue = (containerId) => {

		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`Container with ID "${containerId}" not found.`);
			return;
		}

		document.querySelector("#actDetails").textContent = Storyline.prototype.acts[saveData.storyline.storyID].displayName;

		function displayDialogue() {
			if (!saveData.storyline.hasNext()) {
				return;
			}

			let [dialogue, dialogueCount] = saveData.storyline.next();
			const [dialogueElement, message] = dialogue.dialogue.createDialogue();
			let startTime = null;

			const handleSpacebar = (event) => {
				if (event.key === ' ' || event.code === 'Space' || event.keyCode === 32) {
					message.classList.add("skipped");
					interruptTimeout();
				}
			};

			document.addEventListener('keydown', handleSpacebar);
			function awaitInterval() {
				if ((dialogue.optionsConfig.timedQuestion) && (dialogue.optionsConfig.timedQuestion > 0)) {
					if (startTime == null) {
						startTime = Date.now() / 1000;
					}

					let secondsLeft = (dialogue.optionsConfig.timedQuestion / 1000) - ((Date.now() / 1000) - startTime);
					dialogueElement.querySelector(".barComplete").style.width = ((Math.abs(secondsLeft) / (dialogue.optionsConfig.timedQuestion / 1000)) * 100) + "%";
					dialogueElement.querySelector(".timedQuestion > span").textContent = Math.abs(secondsLeft).toFixed(1) + "s";
					
					if ((secondsLeft <= 0)) {
						if (!hasAnsweredQuestion) {
							saveData.storyline.answerResponse("Void");
						}

						for (const e of dialogueElement.querySelectorAll(".dialogueOptions > button")) {
							e.disabled = true;
						}

						hasAnsweredQuestion = false;
						displayDialogue();
						return;
					}
				}

				if (((hasAnsweredQuestion) && (dialogue.optionsConfig.instantFeedback))) {
					hasAnsweredQuestion = false;
					displayDialogue();
					return;
				}

				setTimeout(awaitInterval, 1);
			}


			dialogueCount++;
			document.querySelector("#dialogBar").style.width = ((dialogueCount / (saveData.storyline.getTotalLines())) * 100) + "%";
			document.querySelector("#percentage").textContent = Math.floor((dialogueCount / (saveData.storyline.getTotalLines())) * 100) + "%";

			handleDialogueScroll(containerId);
			addMessageAndAutoScroll(containerId, dialogueElement, message);
			if (dialogue.options) {
				if (dialogue.optionsConfig.appear == "afterDialogue") {
					createInterruptableTimeout(function () {
						document.removeEventListener('keydown', handleSpacebar);
						dialogue.dialogue.displayOptions(dialogueElement, dialogue.options, dialogue.optionsConfig);
						awaitInterval();
					}, dialogue.dialogue.getDialogueDuration());
				} else {
					dialogue.dialogue.displayOptions(dialogueElement, dialogue.options, dialogue.optionsConfig);
					awaitInterval();
				}
			} else {
				if (dialogue.fail) {
					createInterruptableTimeout(() => {
						saveData.fails.fails += 1;
						if (saveData.fails.discoveredFails.indexOf(dialogue.fail.failID) != -1) {
							saveData.fails.discoveredFails.push(dialogue.fail.failID);
						}

						saveData.gameEndFail = dialogue.fail;
						document.removeEventListener('keydown', handleSpacebar);
						dialogue.fail.displayFail();
					}, dialogue.dialogue.getDialogueDuration() + 1000);
					return;
				}

				if (dialogue.next) {
					createInterruptableTimeout(() => {
						document.removeEventListener('keydown', handleSpacebar);
						transitionStoryline(dialogue.next);
					}, dialogue.dialogue.getDialogueDuration() + 1000);
					return;
				}

				if (dialogue.goBack) {
					createInterruptableTimeout(() => {
						document.removeEventListener('keydown', handleSpacebar);
						saveData.storyline.goBack();
					}, dialogue.dialogue.getDialogueDuration());
					return;
				}

				createInterruptableTimeout(() => {
					document.removeEventListener('keydown', handleSpacebar);
					displayDialogue();
				}, dialogue.dialogue.getDialogueDuration());
			}
		}

		displayDialogue();
	}

	const init = function (s) {
		transitionStoryline(((s != "") && (Storyline.prototype.acts[s])) ? (s) : ("Tutorial"));
	}

	const setTeam = (teamName) => {
		saveData.team = teamName;
	}

	const getTeam = () => saveData.team;
	const getStoryline = () => saveData.storyline;
	const getSaveData = () => saveData;

	return {
		setTeam: setTeam,
		getTeam: getTeam,
		getStoryline: getStoryline,
		loadDialogue: loadDialogue,
		init: init,
		autoScrollDialogue: autoScrollDialogue,
		answerQuestion: answerQuestion,
		getSaveData: getSaveData,
		showLoadingScreen: showLoadingScreen,
		hideLoadingScreen: hideLoadingScreen,
		retryStory: retryStory
	};
})();

window.onload = function () {
	gameModule.showLoadingScreen(); // Show loading screen initially
	setTimeout(() => {
		gameModule.hideLoadingScreen(); // Hide loading screen after 1 second
	}, 1000); // 1000ms (1 second) delay after window load
};
