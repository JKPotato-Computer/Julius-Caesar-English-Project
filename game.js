const saveData = {
	team: "teamConspirators",
}

const gameModule = (() => {
	const setTeam = (teamName) => {
		saveData.team = teamName;
	}

	const getTeam = () => saveData.team;

	return {
		setTeam: setTeam,
		getTeam: getTeam
	};
})();