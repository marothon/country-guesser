setupWorldMap();

function setupWorldMap(){
    document.getElementById('world-map-container').innerHTML = worldMap;
    document.querySelectorAll("#world-map-container > svg > path").forEach(
        (countryPath) => countryPath.addEventListener('click', countryClickListener)
    );
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
