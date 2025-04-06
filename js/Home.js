let clearingData = false;

document.querySelector("#startButton").addEventListener("click", () => {
  document.querySelector("#mainMenu").style.display = "none";
  document.querySelector("#title").style.display = "none";

  if (gameModule.hasSaveData()) {
    document.querySelector("#saveDataManager").style.display = "";
  } else {
    document.querySelector("#teamSelector").style.display = "";
  }
});

document.querySelector("#optionsButton").addEventListener("click", () => {
  document.querySelector("#mainMenu").style.display = "none";
  document.querySelector("#title").style.display = "none";
  document.querySelector("#settingsMenu").style.display = "";
})

document.querySelector("#volume").addEventListener("input", () => {
  gameModule.setSetting("volume",document.querySelector("#volume").value / 100);
  document.querySelector("#volumeVal").textContent = document.querySelector("#volume").value + "%";
})

document.querySelector("#speed").addEventListener("input", () => {
  gameModule.setSetting("speed",document.querySelector("#speed").value / 100);
  document.querySelector("#speedVal").textContent = document.querySelector("#speed").value + "%";
})

document.querySelector("#canSkipDialogue").addEventListener("change", () => {
  gameModule.setSetting("canSkipDialogue",document.querySelector("#canSkipDialogue").checked);
})

document.querySelector("#back").addEventListener("click", () => {
  document.querySelector("#mainMenu").style.display = "";
  document.querySelector("#teamSelector").style.display = "none";
  document.querySelector("#title").style.display = "";
});

document.querySelector("#returnToMenu").addEventListener("click", () => {
  document.querySelector("#mainMenu").style.display = "";
  document.querySelector("#settingsMenu").style.display = "none";
  document.querySelector("#title").style.display = "";
});



Array.from(
  document.querySelectorAll("#teamSelector>div:not(.navOptions)>button")
).forEach((btn) => {
  btn.addEventListener("click", () => {
    Array.from(
      document.querySelectorAll("#teamSelector>div:not(.navOptions)>button")
    ).forEach((b) => {
      if (b == btn) {
        b.classList.add("selected");
      } else {
        b.classList.remove("selected");
      }
    });
  });
});

document.querySelector("#confirm").addEventListener("click", () => {
  if (clearingData) {
    clearingData = false;
    gameModule.wipeSaveData();
  }

  gameModule.init(document.querySelector("#specificID").value);
  document.querySelector("#gamePage").style.display = "";
  document.querySelector("#mainPage").style.display = "none";
});

document.querySelector("#existingData").addEventListener("click", () => {
  gameModule.init(document.querySelector("#specificID"));
  document.querySelector("#gamePage").style.display = "";
  document.querySelector("#mainPage").style.display = "none";
  document.querySelector("#saveDataManager").style.display = "none";
})

document.querySelector("#newData").addEventListener("click", () => {
  clearingData = true;
  document.querySelector("#teamSelector").style.display = "";
  document.querySelector("#saveDataManager").style.display = "none";
})

document.querySelector("#retry").addEventListener("click", () => {
  gameModule.retryStory();
});

document.querySelector("#closeBtn").addEventListener("click", () => {
  gameModule.exitStory();
});

document.querySelector("#return").addEventListener("click", () => {
  gameModule.retryStory();
  gameModule.exitStory();
});

document.querySelector("#viewStats").addEventListener("click", () => {
  document.querySelector("#statsDialog").showModal();
});

document.querySelector("#statsClose").addEventListener("click", () => {
  document.querySelector("#statsDialog").close();
});

if (true) {
  document.querySelector("#gamePage").style.display = "none";
  document.querySelector("#mainPage").style.display = "";
}
