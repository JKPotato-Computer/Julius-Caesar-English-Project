const saveData = {
	team: "teamConspirators",
}

const currentDialogue = {
	dialogueID: "testID",
	dialogueList: [
		  new StageDirections("[The scene is set in the Senate. The conspirators are gathered.]"),
  new Character("Julius Caesar", "Cowards die many times before their deaths; The valiant never taste of death but once.", "burnt-orange"),
  new StageDirections("[Brutus enters from stage left.]"),
  new Character("Brutus", "I fear the people choose Caesar for their king.", "slate-blue"),
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
  new Character("Cassius", "Be not deceived. If I were Brutus now, and he were Cassius, he should not humour me. I will this night, In several hands, in at his windows throw, As if they came from several citizens, Writings, all tending to the great opinion That Rome holds of his name; wherein obscurely Caesar's ambition shall be glanced at. And after this let Caesar seat him sure, For we will shake him, or worse days endure.", "dark-teal"),
	],
}

const speed = 10;

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
	  const textElement = messageElement.querySelector((messageElement.classList.contains("stage-direction")) ? (".direction") : (".text"));
	  if (dialogueList) {
		dialogueList.appendChild(messageElement);
		typewriteMessage(textElement);
		autoScrollDialogue(dialogueListId);
	  }
	}
	
	const typewriteMessage = (textElement) => {
		let i = 0, text = textElement.textContent;
	    textElement.textContent = ''; // Clear the initial text

	    function typeNextCharacter() {
		  if (i < text.length) {
	  	    textElement.textContent += text.charAt(i);
		    i++;
		    setTimeout(typeNextCharacter, speed);
		  }
	    }

	    typeNextCharacter();
	};
	
	const createMessageDiv = (dialogue) => {
		const tempElement = document.createElement('div');
		tempElement.classList.add("message");
		tempElement.style.setProperty('--accent-color', `var(--${dialogue.color}-accent)`);
		tempElement.style.setProperty('--bg-color', `var(--${dialogue.color}-bg)`);

		const message = document.createElement("span");
		message.textContent = dialogue.text;

		if (dialogue instanceof Character) {
			tempElement.classList.add("character");

			const name = document.createElement("span");
			name.classList.add("name");
			name.textContent = dialogue.name + ":";
			tempElement.appendChild(name);

			message.classList.add("text");
			tempElement.appendChild(message);
		} else if (dialogue instanceof StageDirections) {
			tempElement.classList.add("stage-direction");
			message.classList.add("direction");
			tempElement.appendChild(message);
		}

		return tempElement;
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
			const e = createMessageDiv(dialogue);
			const textElement = e.querySelector((e.classList.contains("stage-direction")) ? (".direction") : (".text"));
			setTimeout(() => {
				handleDialogueScroll(containerId);
				addMessageAndAutoScroll(containerId, e);
			}, i);
			
			i += textElement.textContent.length * speed + 200;
		})
	}

	const getTeam = () => saveData.team;

	return {
		setTeam: setTeam,
		getTeam: getTeam,
		loadDialogue : loadDialogue
	};
})();