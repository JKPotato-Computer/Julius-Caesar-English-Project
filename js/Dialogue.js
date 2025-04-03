class OptionElement {
	constructor(text, icon, id) {
		this.text = text;
		this.icon = icon;
		this.id = id;
	}

	createOption() {
		const button = document.createElement("button");
		button.className = "iconLabelBtn dialogueOption";
		button.dataset.optionId = this.id;

		const label = document.createElement("span");
		const icon = document.createElement("span");

		label.className = "optionLabel";
		icon.className = "material-symbols-outlined";

		label.textContent = this.text;
		icon.textContent = this.icon;
		button.appendChild(icon);
		button.appendChild(label);
		return button;
	}
}

class TextElement {
	constructor({
		text = "",
		color = null,
	} = {}) {
		this.text = text;
		this.color = color;
	}

	createTextElement() {
		const message = document.createElement("span");
		message.classList.add("text");
		if (this.color != null) {
			message.style.setProperty("--text-color", "var(--" + this.color + "--accent)");
		} else {
			message.style.setProperty("--text-color", "var(--text)");
		}

		message.innerHTML = this.text;
		return message;
	}
}

class Dialogue {
	constructor(textProperties, color) {
		if (typeof (textProperties) == "object") {
			this.text = new TextElement(textProperties);
		} else {
			this.text = new TextElement({
				text: textProperties
			})
		}

		this.color = color;
	}

	createDialogue() {
		const dialogueElem = document.createElement("div");
		dialogueElem.classList.add("message");
		dialogueElem.style.setProperty("--accent-color", "var(--" + this.color + "-accent)");
		dialogueElem.style.setProperty("--bg-color", "var(--" + this.color + "-bg)");

		const message = this.text.createTextElement();
		return [dialogueElem, message];
	}

	displayOptions(dialogueElem, options, optionsConfig) {
		
		const dialogueOptions = document.createElement("div");
		dialogueOptions.classList.add("dialogueOptions");

		if ((optionsConfig.timedQuestion) && (optionsConfig.timedQuestion > 0)) {
			const timedQuestion = document.createElement("div");
			timedQuestion.classList.add("timedQuestion");

			const timedBar = document.createElement("div");
			timedBar.classList.add("timedBar");

			const barComplete = document.createElement("div");
			barComplete.classList.add("barComplete")

			const timerSpan = document.createElement("span")
			timerSpan.textContent = (optionsConfig.timedQuestion / 1000).toFixed(1) + "s";

			timedBar.appendChild(barComplete);
			timedQuestion.appendChild(timedBar);
			timedQuestion.appendChild(timerSpan);
			dialogueElem.appendChild(timedQuestion);
		}

		let optionsList = [];

		switch (options.length) {
			case 1:
				dialogueOptions.classList.add("one-option");
				break;
			case 2:
				dialogueOptions.classList.add("two-option");
				break;
			case 3:
				dialogueOptions.classList.add("three-option");
				break;
			default:
				dialogueOptions.classList.add("four-option");
		}

		Array.from(options).forEach((option) => {
			const optionElement = option.createOption();
			optionsList.push(optionElement);
			dialogueOptions.appendChild(optionElement);

			optionElement.addEventListener("click", () => {
				optionElement.classList.add("locked");
				gameModule.getStoryline().answerResponse(optionElement.dataset.optionId);
				gameModule.answerQuestion();

				Array.from(optionsList).forEach(option => option.disabled = option != optionElement);
			}) 
		})

		dialogueElem.appendChild(dialogueOptions);
	}

	getDialogueDuration() {
		let duration = 0, dialogueSpeed = Dialogue.prototype.dialogueSpeed;
		let text = this.text.text;

		for (let i = 0; i < text.length;) {
			let currentChar = text.charAt(i);
			if (currentChar == "<") {
				currentChar = text.substring(i, text.indexOf(">", i) + 1);
				i = text.indexOf(">", i);
				if (currentChar.includes("/")) {
					dialogueSpeed = Dialogue.prototype.dialogueSpeed;
				} else if (currentChar.match(/dialogue-speed=(\d+)/g)) {
					dialogueSpeed = parseInt(currentChar.match(/dialogue-speed=(\d+)/g)[0].match(/(\d+)/g)[0]);
				} else if (currentChar.match(/pause duration=(\d+)/g)) {
					duration += parseInt(currentChar.match(/pause duration=(\d+)/g)[0].match(/(\d+)/)[0]);
					i++;
					continue;
				}
			}

			duration += dialogueSpeed;
			i++;
		}
		return duration;
	}

	static typewriteDialogue(dialogueElem) {
		const message = dialogueElem;
		let i = 0, text = message.innerHTML;
		message.innerHTML = ''; // Clear the initial text

		let dialogueSpeed = Dialogue.prototype.dialogueSpeed;

		function checkHeightChange() {
			const currentHeight = dialogueElem.clientHeight;
			if (currentHeight !== previousHeight) {
				previousHeight = currentHeight;  // Update the previous height
				gameModule.autoScrollDialogue("dialoguePage");
			}
		}

		// Set an initial previous height
		let previousHeight = dialogueElem.clientHeight;

		// Resize observer to monitor the container's size (specifically its height)
		const resizeObserver = new ResizeObserver(() => {
			checkHeightChange();  // Check if the container's height has changed
		});

		function typeNextCharacter() {
			if (i > text.length) {
				return;
			}

			let currentChar = text.charAt(i);
			if (currentChar == "<") {
				currentChar = text.substring(i, text.indexOf(">", i) + 1);
				i = text.indexOf(">", i);

				if (currentChar.includes("/")) {
					dialogueSpeed = Dialogue.prototype.dialogueSpeed;
				} else if (currentChar.match(/dialogue-speed=("\d+")/g)) {
					dialogueSpeed = parseInt(currentChar.match(/dialogue-speed=("\d+")/g)[0].match(/(\d+)/g)[0]);
				} else if (currentChar.match(/pause duration=("\d+")/g)) {
					i++;
					setTimeout(typeNextCharacter, parseInt(currentChar.match(/pause duration=("\d+")/g)[0].match(/(\d+)/g)[0]));
					return;
				}
			}

			message.innerHTML = text.substring(0, i);
			checkHeightChange();
			i++;
			setTimeout(typeNextCharacter, dialogueSpeed);
		}

		typeNextCharacter();
	}
}

class StageDirections extends Dialogue {
	constructor(direction) {
		super(direction, "ash-gray");
	}

	createDialogue() {
		const [dialogueElem, message] = super.createDialogue();
		dialogueElem.classList.add("stage-direction");
		message.classList.add("direction");
		dialogueElem.appendChild(message);

		return dialogueElem;
	}
}

class Character extends Dialogue {
	constructor(name, text, color) {
		super(text, color);
		this.name = name;
	}

	createDialogue() {
		const [dialogueElem, message] = super.createDialogue();
		dialogueElem.classList.add("character");

		const charName = document.createElement("span");
		charName.classList.add("name");
		charName.textContent = this.name + ":";

		message.classList.add("dialog");
		dialogueElem.appendChild(charName);
		dialogueElem.appendChild(message);

		return dialogueElem;
	}
}

Dialogue.prototype.dialogueSpeed = 25;