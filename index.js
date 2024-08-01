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
            console.log(filteredCountries);
        }
    } catch (error) {
        console.error(error);
    }
}