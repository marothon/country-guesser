setupWorldMap();

function setupWorldMap(){
    document.getElementById('world-map-container').innerHTML = worldMap;
    document.querySelectorAll("#world-map-container > svg > path").forEach(
        (countryPath) => countryPath.addEventListener('click', countryClickListener)
    );
    const elem = document.querySelector('#world-map-container > svg');
    svgPanZoom(elem);
}

function countryClickListener(event){
    const isoCode2 = event.target.id;
    const countryName = event.target.getAttribute('title');
    document.getElementById('guessed-country').innerHTML = `You guessed ${countryName}`;
}


//Search countries

document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

async function performSearch() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    try {
        const response = await fetch('https://restcountries.com/v3.1/name/' + searchText);
        const data = await response.json();
        const filteredCountries = data.filter(country => country.name.common.toLowerCase().startsWith(searchText));
        if (filteredCountries.length > 0) {
            displayCountries(filteredCountries);
        }else {
            displayErrorMessage('No countries match your search.');
        }
    } catch (error) {
        console.error(error);
        displayErrorMessage('There was an error fetching the country data.');
    }
}

//Display filtered countries in a modal

function displayCountries(countries) {
    const countryList = document.getElementById('countryList');
    countryList.innerHTML = '';  // Clear previous results

    countries.forEach(country => {
        const countryRow = document.createElement('section');
        countryRow.className = 'country-row';

        const flagImg = document.createElement('img');
        flagImg.src = country.flags.png;

        const countryInfo = document.createElement('div');
        countryInfo.classList = 'country-info';
        
        const countryName = document.createElement('p');
        countryName.classList = 'country-name';
        countryName.innerText = country.name.common;

        const countryCapital = document.createElement('p');
        countryCapital.innerText = `Capital: ${country.capital}`;
        countryCapital.className = 'capital';
        
        const countryPopulation = document.createElement('p');
        countryPopulation.innerText = `Population: ${country.population}`;
        countryPopulation.classList = 'population'

        const showButton = document.createElement('button');
        showButton.textContent = 'Show on map';
        showButton.classList = 'showOnMapButton';

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

function displayErrorMessage(message) {
    const countryList = document.getElementById('countryList');
    countryList.innerHTML = '';  // Clear previous results

    const errorMsg = document.createElement('p');
    errorMsg.style.color = 'red';
    errorMsg.innerText = message;
    countryList.appendChild(errorMsg);

    showModal();
}

function showModal() {
    const modal = document.getElementById('modal');
    const closeButton = document.getElementsByClassName('close-button')[0];

    modal.style.display = 'block';

    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

//array of countries -> local storage?
//cca2, common, nativeName-array

//function randomize array of countries

console.log("Hej JS-filen!");

const urlAllCountries = "https://restcountries.com/v3.1/all?fields=name,cca2";

//function to be used in Game Logic. What should it return?
//Now results are stored in Local storage
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

//Randomizes order of a list.
//Fisher-Yates Sorting Algorithm (https://freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/)
function shuffleList(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
