const saveData = {
	team: "teamConspirators",
	currentSection: "A1_S1",
	playMemory : {},

	fails: 0,
	endings: {},

	timeSpent: 0,
}

const currentDialogue = {
	dialogueID: "testID",
	dialogueIndex : 0
}

const gameModule = (() => {
	const setTeam = (teamName) => {
		saveData.team = teamName;
	}

	let shouldAutoScroll = true; // Variable to control auto-scrolling
	function autoScrollDialogue(dialogueListId) {
		const dialogueList = document.getElementById(dialogueListId);
		if (!dialogueList) {
			console.error(`Dialogue list element with ID "${dialogueListId}" not found.`);
			return;
		}

		if (shouldAutoScroll) {
			dialogueList.scrollTop = dialogueList.scrollHeight;
		}
	}

	// Example of how you might prevent auto-scrolling (e.g., when the user scrolls up)
	function handleDialogueScroll(dialogueListId) {
		const dialogueList = document.getElementById(dialogueListId);
		if (!dialogueList) return;

		// If the user has scrolled away from the bottom (with a tolerance)
		if (dialogueList.scrollHeight - dialogueList.scrollTop - dialogueList.clientHeight > 20) {
			shouldAutoScroll = false;
		} else {
			shouldAutoScroll = true;
		}
	}

	function addMessageAndAutoScroll(dialogueListId, messageElement) {
		const dialogueList = document.getElementById(dialogueListId);
		if (dialogueList) {
			dialogueList.appendChild(messageElement);
			Dialogue.typewriteDialogue(messageElement);
			autoScrollDialogue(dialogueListId);
		}
	}

	const loadDialogue = (containerId) => {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`Container with ID "${containerId}" not found.`);
			return;
		}

		container.innerHTML = "";

		let i = 0;
		Array.from(currentDialogue.dialogueList).forEach((dialogue) => {
			const e = dialogue.createDialogue();
			setTimeout(() => {
				handleDialogueScroll(containerId);
				addMessageAndAutoScroll(containerId, e);
			}, i);

			i += e.querySelector(".text").textContent.length * Dialogue.prototype.dialogueSpeed + 200;
		})
	}

	const getTeam = () => saveData.team;

	return {
		setTeam: setTeam,
		getTeam: getTeam,
		loadDialogue: loadDialogue
	};
})();