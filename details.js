// Function to fetch character details from the Marvel API based on character ID
function fetchCharacterDetails(characterId) {
  
    fetch(`https://gateway.marvel.com/v1/public/characters/${characterId}?&ts=8/7/2023, 7:39:15&apikey=35bdfbdaa573c732bf66fcd2fef95339&hash=f928f3878fc3ac05554fac846953f13a`)
      .then(response => response.json())
      .then(data => {
        const character = data.data.results[0];
        const characterName = character.name;
        const characterComics = character.comics.available;
        const characterEvents = character.events.available;
        //console.log(character);
        const characterLast = character.modified;
        const characterImageUrl = character.thumbnail.path + '.' + character.thumbnail.extension;
        const characterDescription = character.description;
        
        //
        // var charStories = '';
        // for (let i = 0; i <character.stories.length; i++) {
        //     charStories += `<li>${character.stories[i].name}</li>`;
        //   }
        // Display character details
        const characterDetailsContainer = document.getElementById('character-details');
        characterDetailsContainer.innerHTML = `
          <div class="card">
            <img src="${characterImageUrl}" class="card-img-top" alt="${characterName} Image">
            <div class="card-body">
              <h5 class="card-title">${characterName}</h5>
              <p class="card-text">${characterDescription}</p>
              <p class="card-text">Last Modified: ${characterLast}</p>
              <p class="card-text">Comics: ${characterComics}</p>
              <p class="card-text">Events: ${characterEvents}</p>
            </div>
          </div>
        `;
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
  
  // Get character ID from the query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get('characterId');
  
  // Fetch and display character details
  window.addEventListener('load', () => {
    if (characterId) {
      fetchCharacterDetails(characterId);
    }
  });
  