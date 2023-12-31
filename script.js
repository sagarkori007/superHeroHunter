// Function to fetch character data from the Marvel API
function fetchCharacterData() {
  // Direct URL is provided
  fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=8/7/2023, 7:39:15&apikey=35bdfbdaa573c732bf66fcd2fef95339&hash=f928f3878fc3ac05554fac846953f13a`)
    .then(response => response.json())
    .then(data => {
      const characters = data.data.results;

      // Clear previous character cards
      const characterContainer = document.getElementById('character-container');
      characterContainer.innerHTML = '';

      // Create Bootstrap cards for each character
      characters.forEach(character => {
        const characterName = character.name;
        const characterImageUrl = character.thumbnail.path + '.' + character.thumbnail.extension;

        // Create Bootstrap card elements
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-3 character-card';
        // Attribute is set to help the searching feature
        card.setAttribute('data-name', characterName.toLowerCase());
        card.innerHTML = `
          <div class="card">
            <img src="${characterImageUrl}" class="card-img-top" alt="${characterName} Image">
            <div class="card-body">
              <h5 class="card-title">${characterName}</h5>
              <button class="btn btn-primary add-to-favorites">Favorite</button>
            </div>
          </div>
        `;

        // Add event listener to "Favorite" button
        const addToFavoritesButton = card.querySelector('.add-to-favorites');
        addToFavoritesButton.addEventListener('click', () => addToFavorites(character));

        // Add event listener to card for navigating to card details page
        const cardTitle = card.querySelector('.card-title');
        cardTitle.addEventListener('click', () => navigateToCardDetails(character.id));

        // Append card to character container
        characterContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Function to handle adding a character to favorites
function addToFavorites(character) {
  const favorites = getFavorites();

  // Check if the character is already a favorite
  const isFavorite = favorites.some(favorite => favorite.id === character.id);
  if (isFavorite) {
    console.log('Character is already a favorite.');
    return;
  }

  favorites.push(character);

  // Update local storage with the updated favorites array
  localStorage.setItem('favorites', JSON.stringify(favorites));

  // Refresh favorites container
  renderFavorites();
}

// Function to handle removing a character from favorites
function removeFromFavorites(card, characterId) {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(character => character.id !== characterId);

  // Update local storage with the updated favorites array
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

  // Refresh favorites container
  renderFavorites();
}

// Function to get the favorite characters from local storage
function getFavorites() {
  const favoritesData = localStorage.getItem('favorites');
  return favoritesData ? JSON.parse(favoritesData) : [];
}

// Function to render the favorite characters in the favorites container
function renderFavorites() {
  const favoritesContainer = document.getElementById('favorites-container');
  favoritesContainer.innerHTML = '';

  const favorites = getFavorites();
  favorites.forEach(character => {
    // Create Bootstrap card for the favorite character
    const favoriteCard = document.createElement('div');
    favoriteCard.className = 'col-md-4 mb-3 character-card';
    favoriteCard.innerHTML = `
      <div class="card">
        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" class="card-img-top" alt="${character.name} Image">
        <div class="card-body">
          <h5 class="card-title">${character.name}</h5>
          <button class="btn btn-danger remove-from-favorites">Remove</button>
        </div>
      </div>
    `;

    // Add event listener to "Remove" button
    const removeFromFavoritesButton = favoriteCard.querySelector('.remove-from-favorites');
    removeFromFavoritesButton.addEventListener('click', () => removeFromFavorites(favoriteCard, character.id));

    // Add event listener to card for navigating to card details page
    const cardTitle = favoriteCard.querySelector('.card-title');
    cardTitle.addEventListener('click', () => navigateToCardDetails(character.id));

    // Append card to favorites container
    favoritesContainer.appendChild(favoriteCard);
  });
}

// Function to navigate to the card details page
function navigateToCardDetails(characterId) {
  // Redirect to the card details page, passing the character ID as a query parameter
  window.location.href = `./characterDetails.html?characterId=${characterId}`;
}

// Function to handle tab navigation
function handleTabNavigation(event) {
  const tabLink = event.target;
  const tabContentId = tabLink.getAttribute('href').substring(1);
  const tabContent = document.getElementById(tabContentId);

  // Remove "show active" class from all tab panes
  const allTabPanes = document.getElementsByClassName('tab-pane');
  Array.from(allTabPanes).forEach(tabPane => {
    tabPane.classList.remove('show', 'active');
  });

  // Add "show active" class to the selected tab pane
  tabContent.classList.add('show', 'active');
}

// Function to handle search input
function handleSearchInput() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const characterCards = document.getElementsByClassName('character-card');

  // Display all character cards if search term is empty
  if (searchTerm.trim() === '') {
    Array.from(characterCards).forEach(card => {
      card.style.display = 'block';
    });
    return;
  }

  // Filter character cards based on the search term
  Array.from(characterCards).forEach(card => {
    const characterName = card.getAttribute('data-name');
    if (characterName.toLowerCase().includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Add event listener to search input field
document.getElementById('search-input').addEventListener('input', handleSearchInput);


// Call the fetchCharacterData function when the page is loaded to display all characters
window.addEventListener('load', () => {
  fetchCharacterData();
  renderFavorites(); // Render favorites from local storage
});

// Add event listeners to tab links
const tabLinks = document.querySelectorAll('.nav-link');
Array.from(tabLinks).forEach(tabLink => {
  tabLink.addEventListener('click', handleTabNavigation);
});

// // Add event listener to search button
// document.getElementById('search-button').addEventListener('click', handleSearch);
