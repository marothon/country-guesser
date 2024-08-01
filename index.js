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