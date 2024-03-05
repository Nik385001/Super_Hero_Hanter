let input = document.getElementById("input-box");
let button = document.getElementById("submit-button");
let showContainer = document.getElementById("show-container");
let listContainer = document.querySelector(".list");

let date = new Date();
console.log(date.getTime());

const [timestamp, apiKey, hashValue] = [ts, publicKey, hashVal];

function displayWords(value) {
  input.value = value;
  removeElements();
}

function removeElements() {
  listContainer.innerHTML = "";
}

async function addToFavorites(heroId, heroName) {
  const inputVal = heroName.trim();
  if (inputVal.length < 1) {
    alert("Input cannot be blank");
    return;
  }

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.some(favorite => favorite.name === inputVal)) {
    favorites.push({ name: inputVal, id: heroId });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Added to favorites!");
  } else {
    alert("This superhero is already in your favorites!");
  }
}

async function getResults() {
  showContainer.innerHTML = "";
  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&name=${input.value}`;

  const response = await fetch(url);
  const jsonData = await response.json();

  jsonData.data["results"].forEach((element) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");
    
    const characterImageContainer = document.createElement("div");
    characterImageContainer.classList.add("container-character-image");
    
    const image = document.createElement("img");
    image.src = `${element.thumbnail["path"]}.${element.thumbnail["extension"]}`;
    
    characterImageContainer.appendChild(image);
    
    const characterName = document.createElement("div");
    characterName.classList.add("character-name");
    characterName.textContent = element.name;
    
    const characterDescription = document.createElement("div");
    characterDescription.classList.add("character-description");
    characterDescription.textContent = element.description;
    
    const addToFavoritesButton = document.createElement("button");
    addToFavoritesButton.textContent = "Add to Favorites";
    addToFavoritesButton.addEventListener("click", () => addToFavorites(element.id, element.name));

    cardContainer.appendChild(characterImageContainer);
    cardContainer.appendChild(characterName);
    cardContainer.appendChild(characterDescription);
    cardContainer.appendChild(addToFavoritesButton);

    showContainer.appendChild(cardContainer);
  });
}

input.addEventListener("keyup", async () => {
  removeElements();
  if (input.value.length < 4) {
    return false;
  }

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${input.value}`;

  const response = await fetch(url);
  const jsonData = await response.json();

  jsonData.data["results"].forEach((result) => {
    let name = result.name;
    let div = document.createElement("div");
    div.style.cursor = "pointer";
    div.classList.add("autocomplete-items");
    div.setAttribute("onclick", "displayWords('" + name + "')");
    let word = "<b>" + name.substr(0, input.value.length) + "</b>";
    word += name.substr(input.value.length);
     listContainer.appendChild(div);
  });
});window.onload = () => {
  getResults();
};

input.addEventListener("keyup", async () => {
  removeElements();
  if (input.value.length < 4) {
      return false;
  }

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${input.value}`;

  const response = await fetch(url);
  const jsonData = await response.json();

  jsonData.data["results"].forEach((result) => {
      let name = result.name;
      let div = document.createElement("div");
      div.style.cursor = "pointer";
      div.classList.add("autocomplete-items");
      div.setAttribute("onclick", "displayWords('" + name + "')");
      let word = "<b>" + name.substr(0, input.value.length) + "</b>";
      word += name.substr(input.value.length);
      div.innerHTML = `<p class="item">${word}</p>`;
      listContainer.appendChild(div);
  });
});

button.addEventListener(
  "click",
  (getResults = async () => {
      if (input.value.trim().length < 1) {
          alert("Input cannot be blank");
      }
      showContainer.innerHTML = "";
      const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&name=${input.value}`;

      const response = await fetch(url);
      const jsonData = await response.json();
      jsonData.data["results"].forEach((element) => {
          showContainer.innerHTML = `<div class="card-container">
              <div class="container-character-image">
              <img src="${
                  element.thumbnail["path"] + "." + element.thumbnail["extension"]
              }"/></div>
              <div class="character-name">${element.name}</div>
              <div class="character-description">${element.description}</div>
              <button onclick="addToFavorites('${element.id}', '${element.name}', '${element.img}', '${element.description}', '${element.comics}', '${element.series}', '${element.stories}')">
                  Add to Favorites
              </button>
              </div>`;
      });
  })
);

// Add to Favorites function
function addToFavorites(id, name, img, desc, comics, series, stories) {
  const inputVal = name.trim();
  if (inputVal.length < 1) {
      alert("Input cannot be blank");
      return;
  }

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Check if the superhero is already in favorites
  if (favorites.some(hero => hero.id === id)) {
      alert("This superhero is already in your favorites!");
  } else {
      favorites.push({
          id: id,
          name: name,
          img: img,
          desc: desc,
          comics: comics,
          series: series,
          stories: stories
      });

      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Added to favorites!");
  }
}
