setupWorldMap();

function setupWorldMap() {
	document.getElementById("world-map-container").innerHTML = worldMap;
	document
		.querySelectorAll("#world-map-container > svg > path")
		.forEach((countryPath) =>
			countryPath.addEventListener("click", countryClickListener)
		);
	const elem = document.querySelector("#world-map-container > svg");
	svgPanZoom(elem);
}

function countryClickListener(event) {
	const isoCode2 = event.target.id;
	const countryName = event.target.getAttribute("title");
	document.getElementById(
		"guessed-country"
	).innerHTML = `You guessed ${countryName}`;
}

// Search countries
document
	.getElementById("searchInput")
	.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			performSearch();
		}
	});

async function performSearch() {
	const searchText = document.getElementById("searchInput").value.toLowerCase();
	try {
		const response = await fetch(
			"https://restcountries.com/v3.1/name/" + searchText
		);
		const data = await response.json();
		const filteredCountries = data.filter((country) =>
			country.name.common.toLowerCase().startsWith(searchText)
		);
		if (filteredCountries.length > 0) {
			displayCountries(filteredCountries);
		} else {
			displayErrorMessage("No countries match your search.");
		}
	} catch (error) {
		console.error(error);
		displayErrorMessage("There was an error fetching the country data.");
	}
}

//Display filtered countries in a modal

function displayCountries(countries) {
	const countryList = document.getElementById("countryList");
	countryList.innerHTML = ""; // Clear previous results

	countries.forEach((country) => {
		const countryRow = document.createElement("section");
		countryRow.className = "country-row";

		const flagImg = document.createElement("img");
		flagImg.src = country.flags.png;

		const countryInfo = document.createElement("div");
		countryInfo.classList = "country-info";

		const countryName = document.createElement("p");
		countryName.classList = "country-name";
		countryName.innerText = country.name.common;

		const countryCapital = document.createElement("p");
		countryCapital.innerText = `Capital: ${country.capital}`;
		countryCapital.className = "capital";

		const countryPopulation = document.createElement("p");
		countryPopulation.innerText = `Population: ${country.population}`;
		countryPopulation.classList = "population";

		const showButton = document.createElement("button");
		showButton.textContent = "Show on map";
		showButton.classList = "showOnMapButton";
		showButton.addEventListener('click', () => {
			const modal = document.getElementById("modal");
			modal.classList.toggle('hidden');
			highlightCountry(country.cca2);
		});

		countryInfo.appendChild(countryName);
		countryInfo.appendChild(countryCapital);
		countryInfo.appendChild(countryPopulation);

		countryRow.appendChild(flagImg);
		countryRow.appendChild(countryInfo);
		countryRow.appendChild(showButton);

		countryList.appendChild(countryRow);
	});

	showModal();
}

function highlightCountry(isoCode2){
	console.log(isoCode2);
	document.querySelector(`path#${isoCode2}`).classList.add('highlight');
}

function displayErrorMessage(message) {
	const countryList = document.getElementById("countryList");
	countryList.innerHTML = ""; // Clear previous results


  const errorMsg = document.createElement('p');
  errorMsg.classList = 'error-message'
  errorMsg.innerText = message;
  countryList.appendChild(errorMsg);

	showModal();
}

function showModal() {
	const modal = document.getElementById("modal");
	const closeButton = document.getElementsByClassName("close-button")[0];

	modal.classList.toggle('hidden');

	closeButton.onclick = function () {
		modal.classList.toggle('hidden');
	};

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.classList.toggle('hidden');
		}
	};
}

// array of countries -> local storage?
// cca2, common, nativeName-array

// function randomize array of countries
console.log("Hej JS-filen!");

const urlAllCountries = "https://restcountries.com/v3.1/all?fields=name,cca2";

// function to be used in Game Logic. What should it return?
// Now results are stored in Local storage
getListOfCountries_StoreOrderedAndRandomizedList(urlAllCountries);

async function getListOfCountries_StoreOrderedAndRandomizedList(url) {
	let countries = await fetchData(url);
	let countryList = [];
	countries.forEach((country) => {
		let newCountry = { name: country.name.common, cca2: country.cca2 };
		countryList.push(newCountry);
	});

	localStorage.setItem("countryListOrdered", JSON.stringify(countryList));

	let randomizedList = shuffleList(countryList);
	localStorage.setItem(
		"countryListRandomOrder",
		JSON.stringify(randomizedList)
	);
}

async function fetchData(url) {
	let data = [];
	try {
		let response = await fetch(url);
		let data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}
}

// Randomizes order of a list.
// Fisher-Yates Sorting Algorithm (https://freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/)
function shuffleList(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// Game logic functions (with help of chat gpt)
let currentCountry = null;
let correctAnswers = 0;
let wrongAnswers = 0;
const maxAttempts = 3;
const maxCorrectAnswers = 10;

document.getElementById("start-game").addEventListener("click", startGame);

async function startGame() {
	resetGame();
	await getListOfCountries_StoreOrderedAndRandomizedList(urlAllCountries);
	selectRandomCountry();
	updateGameStatus();
}

function countryClickListener(event) {
	const isoCode2 = event.target.id.toUpperCase();
	const countryName = event.target.getAttribute("title");
	document.getElementById(
		"guessed-country"
	).innerHTML = `You guessed ${countryName}`;

	if (!currentCountry) {
		return;
	}

	if (isoCode2 === currentCountry.cca2) {
		correctAnswers++;
		event.target.classList.add("correct");
		document.getElementById("game-status").innerHTML = "Right answer!";
		document.getElementById("game-status").classList.add('correct');

		if (correctAnswers < maxCorrectAnswers) {
			setTimeout(selectRandomCountry, 1000);
		} else {
			document.getElementById("game-status").innerHTML = "You have won!";
			disableCountryClickListeners();
		}
	} else {
		wrongAnswers++;
		event.target.classList.add("wrong");
		document.getElementById(currentCountry.cca2).classList.add("correct");
		document.getElementById("game-status").innerHTML = "Wrong answer!";
		document.getElementById("game-status").classList.add('wrong');

		if (wrongAnswers >= maxAttempts) {
			document.getElementById("game-status").innerHTML = "You lost!";
			disableCountryClickListeners();
		} else {
			setTimeout(selectRandomCountry, 1000);
		}
	}
	updateGameStatus();
}

function selectRandomCountry() {
	const countryList = JSON.parse(
		localStorage.getItem("countryListRandomOrder")
	);
	const randomIndex = Math.floor(Math.random() * countryList.length);
	currentCountry = countryList[randomIndex];
	document.getElementById(
		"current-country"
	).innerHTML = `Where is ${currentCountry.name}?`;
	document.getElementById("guessed-country").innerHTML = "";
}

function updateGameStatus() {
	document.getElementById(
		"remaining-attempts"
	).innerHTML = `Remaining attempts: ${maxAttempts - wrongAnswers}`;
	document.getElementById(
		"correct-answers"
	).innerHTML = `Correct answers: ${correctAnswers}`;
}

function disableCountryClickListeners() {
	document
		.querySelectorAll("#world-map-container > svg > path")
		.forEach((countryPath) =>
			countryPath.removeEventListener("click", countryClickListener)
		);
}

function resetGame() {
	correctAnswers = 0;
	wrongAnswers = 0;
	currentCountry = null;
	document.getElementById("game-status").innerHTML = "";
	document.getElementById("current-country").innerHTML = "";
	document.getElementById("guessed-country").innerHTML = "";
	document.getElementById("remaining-attempts").innerHTML = "";
	document.getElementById("correct-answers").innerHTML = "";
	document
		.querySelectorAll(".correct")
		.forEach((element) => element.classList.remove("correct"));
	document
		.querySelectorAll(".wrong")
		.forEach((element) => element.classList.remove("wrong"));
	setupWorldMap();
}
