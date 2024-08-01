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
            console.log(filteredCountries);
        }
    } catch (error) {
        console.error(error);
    }
}

//array of countries -> local storage?
//cca2, common, nativeName-array

//function randomize array of countries

console.log("Hej JS-filen!");

const urlAllCountries = "https://restcountries.com/v3.1/all";


let countryList = getAllCountries(urlAllCountries);

function toNunzia(){
    getAllCountries(url);
}

async function getAllCountries(url) {
  let countries = await fetchData(url);
  let countryList = [];
  //console.log(countries);
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
  return countryList;
}

async function fetchData(url) {
  let data = [];
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  } catch (error) {}
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