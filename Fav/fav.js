// Selecting the card container from the DOM
let cardContainer = document.getElementById('container');

// Event listener attached to DOM which is executed when the page is loaded
window.addEventListener("load", function () {
    // Getting the favorites array from localStorage
    let favorites = localStorage.getItem("favorites");

    // If favorites is null then we display nothing and return from there
    if (favorites == null) {
        cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favorites</p>"
        return;
    } else {
        favorites = JSON.parse(localStorage.getItem("favorites"));
    }

    // If no characters left for displaying
    if (favorites.length == 0) {
        cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favorites</p>";
        // Clear local storage when no favorites are present
        localStorage.clear();
        return;
    }

    cardContainer.innerHTML = "";

    favorites.forEach(character => {
        cardContainer.innerHTML +=
            `
            <div class="flex-col card" id="${character.id}">
                <img src="${character.img || ''}" alt="">
                <span class="name">${character.name}</span>
                <span class="id">Id : ${character.id}</span>
                <span class="comics">Comics : ${character.comics || 'N/A'}</span>
                <span class="series">Series : ${character.series || 'N/A'}</span>
                <span class="stories">Stories : ${character.stories || 'N/A'}</span>
                <button class="btn remove-btn" onclick="removeCharacterFromFavorites('${character.id}')">
                    <i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favorites
                </button>
            </div>
        `
    });

    // Adding the appropriate events to the buttons after they are inserted in DOM
    addEvent();
});

// Function for attaching eventListener to buttons
function addEvent() {
    let removeBtn = document.querySelectorAll(".remove-btn");
    removeBtn.forEach((btn) => btn.addEventListener("click", removeCharacterFromFavorites));
}

function removeCharacterFromFavorites(id) {
    // Getting the favorites array which stores objects of characters
    let favorites = JSON.parse(localStorage.getItem("favorites"));

    // Deleting the character from the array whose id is matched
    favorites = favorites.filter(character => character.id !== id);

    // If no characters left for displaying
    if (favorites.length == 0) {
        cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favorites</p>";
        // Clear local storage when no favorites are present
        localStorage.clear();
    } else {
        // Updating the new array in localStorage
        localStorage.setItem("favorites", JSON.stringify(favorites));

        // Removing the element from DOM
        document.getElementById(id).remove();

        // Displaying the "Removed from favorites" toast in DOM
        document.querySelector(".remove-toast").setAttribute("data-visibility", "show");

        // Removing the "Removed from favorites" toast from DOM
        setTimeout(function () {
            document.querySelector(".remove-toast").setAttribute("data-visibility", "hide");
        }, 1000);
    }
}
async function addToFavorites(heroId, heroName) {
    const inputVal = heroName.trim();
    if (inputVal.length < 1) {
      alert("Input cannot be blank");
      return;
    }
  
    // Fetch detailed information about the superhero using the heroId
    const heroDetails = await fetchHeroDetails(heroId);
  
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
    if (!favorites.some(favorite => favorite.id === heroId)) {
      favorites.push({
        id: heroId,
        name: heroName,
        img: heroDetails.thumbnail.path + "." + heroDetails.thumbnail.extension,
        desc: heroDetails.description,
        comics: heroDetails.comics.available,
        series: heroDetails.series.available,
        stories: heroDetails.stories.available
      });
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Added to favorites!");
    } else {
      alert("This superhero is already in your favorites!");
    }
  }
  
  async function fetchHeroDetails(heroId) {
    const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${heroId}?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`);
    const jsonData = await response.json();
    return jsonData.data.results[0];
  }
  