document.querySelector("#startButton").addEventListener("click", () => {
	document.querySelector("#mainMenu").style.display = "none";
	document.querySelector("#teamSelector").style.display = "";
	document.querySelector("#title").style.display = "none";
})

document.querySelector("#back").addEventListener("click", () => {
	document.querySelector("#mainMenu").style.display = "";
	document.querySelector("#teamSelector").style.display = "none";
	document.querySelector("#title").style.display = "";
})

Array.from(document.querySelectorAll("#teamSelector>div:not(.navOptions)>button")).forEach((btn) => {
	btn.addEventListener("click", () => {
		gameModule.setTeam(btn.id);
		Array.from(document.querySelectorAll("#teamSelector>div:not(.navOptions)>button")).forEach((btn) => {
			if (btn.id == gameModule.getTeam()) {
				btn.classList.add("selected");
			} else {
				btn.classList.remove("selected");
			};
		});
	});
});