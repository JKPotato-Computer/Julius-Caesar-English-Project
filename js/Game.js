const saveData = {
	team: "teamConspirators",
	storyline: new Storyline({
		storyID: "Tutorial"
	}),
	playMemory: {},

	fails: 0,
	endings: {},

	timeSpent: 0,
}

const currentDialogue = {
	dialogueID: "testID",
	dialogueIndex: 0,
	dialogueList: [
		new StageDirections("[The scene is set in the Senate. The conspirators are gathered.]"),
		new StageDirections("<image src=\"https://shallowfordvet.com/wp-content/uploads/2017/07/puppy.jpg\" height=200/><br>IS THAT A <pause duration=1000><b>DOG???</b>"),
		new Character("Julius Caesar", "<b dialogue-speed=50>Cowards die many times before their deaths</b>; The valiant never taste of death but once.", "burnt-orange"),
		new StageDirections("[Brutus enters from stage left.]"),
		new Character("Brutus", "I fear the people choose <i>Caesar</i> for their king.", "slate-blue"),
		new Character("Caesar", "Let me have men about me that are fat, Sleek-headed men, and such as sleep o' nights. Yond Cassius has a lean and hungry look; He thinks too much: such men are dangerous.", "burnt-orange"),
		new StageDirections("[Caesar sits down in his chair as the conversation deepens.]"),
		new Character("Brutus", "But I do fear the people may turn against us.", "slate-blue"),
		new Character("Cassius", "Brutus, my lord, be confident; rest you content. When you know what is in hand, you shall be satisfied.", "dark-teal"),
		new Character("Brutus", "I would not, Cassius; yet I love him well. What is it that you would impart to me? If it be aught toward the general good, set honour in one eye and death i' the other, and I will look on both indifferently; for let the gods so speed me as I love the name of honour more than I fear death.", "slate-blue"),
		new Character("Cassius", "I know that virtue to be in you, Brutus, as well as I do know your outward favour. Well, honour is the subject of my story. I cannot tell what you and other men think of this life; but for my single self, I had as lief not be as live to be in awe of such a thing as I myself.", "dark-teal"),
		new Character("Brutus", "What means this shouting? I do fear the people choose Caesar for their king.", "slate-blue"),
		new Character("Cassius", "Ay, do you fear it? Then must I think you would not have it so.", "dark-teal"),
		new Character("Brutus", "I would not, Cassius; yet I love him well.", "slate-blue"),
		new Character("Cassius", "What is it that you would impart to me? I know not how, but you do love him, Brutus.", "dark-teal"),
		new Character("Brutus", "I am not gamesome; I do lack some part Of that quick spirit that is in Antony. Let me not hinder, Cassius, your desires; I'll leave you.", "slate-blue"),
		new Character("Cassius", "Brutus, I do observe your melancholy, And make even of your good wit and bad. Of what should it be that Brutus goes amiss? I would be glad to learn it; for, believe me, I had rather have my eyes than you should fear offense.", "dark-teal"),
		new Character("Brutus", "I have been up and down to seek you; for I am troubled. I do fear the people choose Caesar for their king.", "slate-blue"),
		new Character("Cassius", "You are dull, Brutus, and time marvelleth at your honourable words. But this same Cassius, though he be lean, he is a noble Roman, and well given.", "dark-teal"),
		new Character("Brutus", "Would you were stronger.", "slate-blue"),
		new Character("Cassius", "Be not deceived. If I were Brutus now, and he were Cassius, he should not humour me. I will this night, In several hands, in at his windows throw, As if they came from several citizens, Writings, all tending to the great opinion That Rome holds of his name; wherein obscurely Caesar's ambition shall be glanced at. And after this let Caesar seat him sure, For we will shake him, or worse days endure.", "dark-teal")]
}

const gameModule = (() => {
	const setTeam = (teamName) => {
		saveData.team = teamName;
	}

	let shouldAutoScroll = true; // Variable to control auto-scrolling
	let hasAnsweredQuestion = false;
	
	const autoScrollDialogue = function(dialogueListId) {
		const dialogueList = document.getElementById(dialogueListId);
		if (!dialogueList) {
			console.error(`Dialogue list element with ID "${dialogueListId}" not found.`);
			return;
		}

		if (shouldAutoScroll) {
			dialogueList.scrollTop = dialogueList.scrollHeight + 100;
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

	function addMessageAndAutoScroll(dialogueListId, dialogueElement, messageElement) {
		const dialogueList = document.getElementById(dialogueListId);
		if (dialogueList) {
			dialogueElement.appendChild(messageElement);

			dialogueList.appendChild(dialogueElement);
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
		function displayDialogue() {
			function awaitResponse() {
				
			}
			
			if (!saveData.storyline.hasNext()) {
				return;
			}

			const dialogue = saveData.storyline.next();
			const [dialogueElement, message] = dialogue.dialogue.createDialogue();
			handleDialogueScroll(containerId);
			addMessageAndAutoScroll(containerId, dialogueElement, message);
			if (dialogue.options) {
				if (dialogue.optionsConfig.appear == "afterDialogue") {
					setTimeout(function() {
						dialogue.dialogue.displayOptions(dialogueElement, dialogue.options);
					}, dialogue.dialogue.getDialogueDuration());
				} else {
					dialogue.dialogue.displayOptions(dialogueElement, dialogue.options);
				}
			} else {
				setTimeout(displayDialogue, dialogue.dialogue.getDialogueDuration())
			}
		}

		displayDialogue();
	}

	const init = function() {
		saveData.storyline = new Storyline();
		saveData.storyline.setStoryID("Tutorial");
		loadDialogue("dialoguePage");
	}

	const getTeam = () => saveData.team;

	return {
		setTeam: setTeam,
		getTeam: getTeam,
		loadDialogue: loadDialogue,
		init: init,
		autoScrollDialogue: autoScrollDialogue
	};
})();