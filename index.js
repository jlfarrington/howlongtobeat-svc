// test data file
const testData = require("./Games.json");
const fs = require("fs");
const gameResultsArray = [];

const gameSearchTerms = testData.map((game) => game.Name);
const chunk = [];

const fetchGameData = async (chunkArr) => {
	//console.log(chunkArr);

	const gameData = await fetch("https://www.howlongtobeat.com/api/search", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			Referer: "https://howlongtobeat.com/",
			origin: "https://howlongtobeat.com",
		},
		body: JSON.stringify({
			searchType: "games",
			searchTerms: chunkArr,
			searchPage: 1,
			size: 20,
			searchOptions: {
				games: {
					userId: 0,
					platform: "",
					sortCategory: "popular",
					rangeCategory: "main",
					rangeTime: {
						min: 0,
						max: 0,
					},
					gameplay: {
						perspective: "",
						flow: "",
						genre: "",
					},
					modifier: "",
				},
				users: {
					sortCategory: "postcount",
				},
				filter: "",
				sort: 0,
				randomizer: 0,
			},
		}),
	});
	const gameDataJson = await gameData.json();
	return gameDataJson;
};

const retrieveData = async () => {
	const dataArr = [];
	for (let game of gameSearchTerms) {
		const gameData = await fetchGameData([game]);
		const gameInfo = gameData.data[0];
		if (gameData.data[0]) {
			const gameInfoObj = {
				name: gameInfo.game_name,
				completionTimeMain: Math.round(gameInfo.comp_main / 3600),
				completionTimeMainPlusSides: Math.round(gameInfo.comp_plus / 3600),
				completionTimeCompletionist: Math.round(gameInfo.comp_100 / 3600),
			};
			//console.log("adding this game to the data array: " + JSON.stringify(gameInfoObj));
			dataArr.push(gameInfoObj);
		} else {
			dataArr.push({
				name: game,
				completionTimeMain: "not found",
				completionTimeMainPlusSides: "not found",
				completionTimeCompletionist: "not found",
			});
		}
	}
	return dataArr;
};

const main = async () => {
	const gameData = await retrieveData();
	const dataString = JSON.stringify(gameData);
	// console.log(dataString);
	try {
		const data = fs.writeFileSync("./gameDatainfo.json", dataString);
	} catch (err) {
		console.error(err);
	}
};

main();
