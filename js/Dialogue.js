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

	static typewriteDialogue(dialogueElem) {
		const message = dialogueElem.querySelector(".text");
		let i = 0, text = message.innerHTML;
		message.innerHTML = ''; // Clear the initial text

		let dialogueSpeed = Dialogue.prototype.dialogueSpeed;
		function typeNextCharacter() {
			if (i > text.length) {
				return;
			}

			let currentChar = text.charAt(i);
			if (currentChar == "<") {
				currentChar = text.substring(i,text.indexOf(">",i) + 1);
				i = text.indexOf(">",i);

				if (currentChar.includes("/")) {
					dialogueSpeed = Dialogue.prototype.dialogueSpeed;
				} else if (currentChar.match(/dialogue-speed=("\d+")/g)) {
					dialogueSpeed = parseInt(currentChar.match(/dialogue-speed=("\d+")/g)[0].match(/(\d+)/g)[0]);
					console.log(dialogueSpeed);
				}
			}

			message.innerHTML = text.substring(0, i);
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

Dialogue.prototype.dialogueSpeed = 75;