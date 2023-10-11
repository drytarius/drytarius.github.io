//AUTOFILL CODE

filterField.addEventListener('input', () => {
  const filterValue = filterField.value.toLowerCase();
  showCustom = !filterValue.includes('-custom');
  showCommands = !filterValue.includes('-commands');
  showAudio = !filterValue.includes('-audio');
  showProps = !filterValue.includes('-props');
  showEntities = !filterValue.includes('-entities');
  showWeapons = !filterValue.includes('-weapons');
  currentPage = 1;
  updateSuggestions(); // Call the updateSuggestions function whenever the filter input changes
});

const autofillOptions = autofillOptionsCommands.concat(
  autofillOptionsCustom,
  autofillOptionsAudio,
  autofillOptionsProps,
  autofillOptionsEntities,
  autofillOptionsWeapons
);

const commandSuggestions = autofillOptions.filter((option) =>
  autofillOptionsCommands.includes(option)
);
const customSuggestions = autofillOptions.filter((option) =>
  autofillOptionsCustom.includes(option)
);
const audioSuggestions = autofillOptions.filter((option) =>
  autofillOptionsAudio.includes(option)
);
const propSuggestions = autofillOptions.filter((option) =>
  autofillOptionsProps.includes(option)
);
const entitySuggestions = autofillOptions.filter((option) =>
  autofillOptionsEntities.includes(option)
);
const weaponSuggestions = autofillOptions.filter((option) =>
  autofillOptionsWeapons.includes(option)
);

//console.log(autofillOptions.toString())

let matchingSuggestions = [];

filterField.value = `-audio -props -entities show:150`;

function updateSuggestions() {
  userInput = inputField.value.toLowerCase();
  lastWordStart = userInput.lastIndexOf(' ') + 1;
  lastWord = userInput.substring(lastWordStart);

  const filterValue = filterField.value;
  if (filterValue.includes('-custom')) {
    showCustom = false;
  }
  if (filterValue.includes('-commands')) {
    showCommands = false;
  }
  if (filterValue.includes('-audio')) {
    showAudio = false;
  }
  if (filterValue.includes('-props')) {
    showProps = false;
  }
  if (filterValue.includes('-entities')) {
    showEntities = false;
  }
  if (filterValue.includes('-weapons')) {
    showWeapons = false;
  }
  if (
    !filterValue.includes('-commands') &&
    !filterValue.includes('-custom') &&
    !filterValue.includes('-audio') &&
    !filterValue.includes('-props') &&
    !filterValue.includes('-entities') &&
    !filterValue.includes('-weapons')
  ) {
    showCommands = true;
    showAudio = true;
    showProps = true;
    showEntities = true;
    showWeapons = true;
  }
  if (filterValue.includes('show:')) {
    const showPattern = /show:(\d+)/i;
    const matches = filterValue.match(showPattern);
    if (matches && matches[1]) {
      suggestionsPerPage = parseInt(matches[1]);
      //console.log(`Will show this much: ${suggestionsPerPage}`);
    } else if (filterValue.includes('show:all')) {
      suggestionsPerPage = 'all';
    }
  }

  // Always filter suggestions based on the input text
  if (showAudio && showCommands && showProps && showEntities && showWeapons) {
    matchingSuggestions = autofillOptions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    );
  } else {
    // Reset the matchingSuggestions array
    matchingSuggestions = [];

    // Check if each condition is true and concatenate the corresponding filtered suggestions
    if (showCommands) {
      matchingSuggestions = matchingSuggestions.concat(
        commandSuggestions.filter((option) =>
          option.toLowerCase().startsWith(lastWord)
        )
      );
    }

    if (showCustom) {
      matchingSuggestions = matchingSuggestions.concat(
        customSuggestions.filter((option) =>
          option.toLowerCase().startsWith(lastWord)
        )
      );
    }

    if (showAudio) {
      matchingSuggestions = matchingSuggestions.concat(
        audioSuggestions.filter((option) =>
          option.toLowerCase().startsWith(lastWord)
        )
      );
    }

    if (showProps) {
      matchingSuggestions = matchingSuggestions.concat(
        propSuggestions.filter((option) =>
          option.toLowerCase().startsWith(lastWord)
        )
      );
    }

    if (showEntities) {
      matchingSuggestions = matchingSuggestions.concat(
        entitySuggestions.filter((option) =>
          option.toLowerCase().startsWith(lastWord)
        )
      );
    }

    if (showWeapons) {
      matchingSuggestions = matchingSuggestions.concat(
        weaponSuggestions.filter((option) =>
          option.toLowerCase().startsWith(lastWord)
        )
      );
    }
  }

  // Apply pagination
  let paginatedSuggestions;
  if (suggestionsPerPage == 'all') {
    paginatedSuggestions = matchingSuggestions;
  } else {
    const startIndex = (currentPage - 1) * suggestionsPerPage;
    const endIndex = startIndex + suggestionsPerPage;
    paginatedSuggestions = matchingSuggestions.slice(startIndex, endIndex);
  }

  // Clear previous suggestions
  suggestionsContainer.innerHTML = '';

  // Display matching suggestions
  paginatedSuggestions.forEach((suggestion, index) => {
    const suggestionElement = document.createElement('div');

    // Create the link to list of CVAR(s)
    const suggestionLink = document.createElement('a');
    suggestionLink.textContent = '? ';
    suggestionLink.href =
      'https://developer.valvesoftware.com/wiki/' + suggestion;
    suggestionLink.target = '_blank';
    suggestionLink.style.textDecoration = 'none';
    suggestionLink.addEventListener('mouseover', () => {
      suggestionLink.style.color = 'red';
    });
    suggestionLink.addEventListener('mouseout', () => {
      suggestionLink.style.color = 'var(--default_suggestion_info_text_color)';
    });

    // Create the suggestion text element
    const suggestionText = document.createElement('span');
    suggestionText.textContent = suggestion;
    suggestionText.style.cursor = 'pointer';

    // Check if the suggestion is an audio or a prop item
    const isCustomItem = autofillOptionsCustom.includes(suggestion);
    const isAudioItem = autofillOptionsAudio.includes(suggestion);
    const isPropItem = autofillOptionsProps.includes(suggestion);
    const isEntityItem = autofillOptionsEntities.includes(suggestion);
    const isWeaponItem = autofillOptionsWeapons.includes(suggestion);

    // Append both the suggestionLink and suggestionText to suggestionElement
    suggestionElement.appendChild(suggestionLink);
    suggestionElement.appendChild(suggestionText);

    // If it's a custom item, create a new span with the class "custom" and append it to suggestionElement
    if (isCustomItem) {
      suggestionText.textContent = suggestion + ' (custom)'; // You can add any additional text to indicate it's a custom item
      suggestionText.classList.add('custom');
      suggestionElement.appendChild(suggestionText);
    }

    // If it's an audio item, create a new span with the class "audio" and append it to suggestionElement
    if (isAudioItem) {
      suggestionText.textContent = suggestion + ' (audio)'; // You can add any additional text to indicate it's an audio item
      suggestionText.classList.add('audio');
      suggestionElement.appendChild(suggestionText);
    }

    // If it's a prop item, create a new span with the class "prop" and append it to suggestionElement
    if (isPropItem) {
      suggestionText.textContent = suggestion + ' (prop)'; // You can add any additional text to indicate it's a prop item
      suggestionText.classList.add('prop');
      suggestionElement.appendChild(suggestionText);
    }

    // If it's an entity item, create a new span with the class "entity" and append it to suggestionElement
    if (isEntityItem) {
      suggestionText.textContent = suggestion + ' (entity)'; // You can add any additional text to indicate it's a prop item
      suggestionText.classList.add('entity');
      suggestionElement.appendChild(suggestionText);
    }

    // If it's a weapon item, create a new span with the class "weapon" and append it to suggestionElement
    if (isWeaponItem) {
      suggestionText.textContent = suggestion + ' (weapon)'; // You can add any additional text to indicate it's a prop item
      suggestionText.classList.add('weapon');
      suggestionElement.appendChild(suggestionText);
    }

    // Code for the suggestion element
    suggestionText.addEventListener('click', () => {
      const newInput = userInput.substring(0, lastWordStart) + suggestion;
      inputField.value = newInput + ' ';
      suggestionsContainer.innerHTML = '';
    });
    suggestionElement.addEventListener('mouseover', () => {
      selectedSuggestionIndex = index;
      highlightSelectedSuggestion();
    });

    suggestionsContainer.appendChild(suggestionElement);
  });

  // Highlight the selected suggestion (initially none selected)
  selectedSuggestionIndex = -1;
  highlightSelectedSuggestion();
}

// Call updateSuggestions once to initialize the suggestions based on the initial showCommands and showAudio values
updateSuggestions();

// Listen for changes in the showCommands and showAudio variables and update suggestions accordingly
filterField.addEventListener('change', () => {
  updateSuggestions();
});

// Function to go to the previous page
function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    //console.log('Current page', currentPage);
    updateSuggestions();
  }
}

// Function to go to the next page
function goToNextPage() {
  const totalPages = Math.ceil(matchingSuggestions.length / suggestionsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    //console.log('Current page', currentPage);
    updateSuggestions();
  }
}

// Event listeners for previous and next buttons
const previousButton = document.getElementById('previousPage');
const nextButton = document.getElementById('nextPage');

previousButton.addEventListener('click', goToPreviousPage);
nextButton.addEventListener('click', goToNextPage);

function highlightSelectedSuggestion() {
  //const suggestions = suggestionsContainer.children;
  const suggestions = suggestionsContainer.querySelectorAll('span');
  for (let i = 0; i < suggestions.length; i++) {
    suggestions[i].classList.remove('selected');
    const suggestionText = suggestions[i].textContent.toLowerCase();
    //console.log(suggestionText)

    if (suggestionText.includes(' (custom)')) {
      suggestions[i].style.color = '#d99c29';
    } else if (suggestionText.includes(' (audio)')) {
      suggestions[i].style.color = '#ffe666';
    } else if (suggestionText.includes(' (prop)')) {
      suggestions[i].style.color = '#dc5e5e';
    } else if (suggestionText.includes(' (entity)')) {
      suggestions[i].style.color = '#28649c';
    } else if (suggestionText.includes(' (weapon)')) {
      suggestions[i].style.color = '#50555e';
    } else if (
      suggestionText.startsWith('+') ||
      suggestionText.startsWith('-')
    ) {
      suggestions[i].style.color = '#d10fce';
    } else if (
      suggestionText.startsWith('cl') ||
      suggestionText.startsWith('mp')
    ) {
      suggestions[i].style.color = '#e55d1f';
    } else if (suggestionText.includes('_')) {
      suggestions[i].style.color = '#238722';
    } else {
      suggestions[i].style.color = '#b4c7d9';
    }
  }

  if (
    selectedSuggestionIndex >= 0 &&
    selectedSuggestionIndex < suggestions.length
  ) {
    suggestions[selectedSuggestionIndex].classList.add('selected');

    // Scroll the container to bring the selected suggestion into view
    const selectedSuggestionElement = suggestions[selectedSuggestionIndex];
    const containerRect = suggestionsContainer.getBoundingClientRect();
    const selectedRect = selectedSuggestionElement.getBoundingClientRect();

    if (selectedRect.top < containerRect.top) {
      suggestionsContainer.scrollTop -= containerRect.top - selectedRect.top;
    } else if (selectedRect.bottom > containerRect.bottom) {
      suggestionsContainer.scrollTop +=
        selectedRect.bottom - containerRect.bottom;
    }
  }
}

function runFixedUpdateSuggestions() {
  currentPage = 1;
  updateSuggestions();
}

inputField.addEventListener('input', runFixedUpdateSuggestions);

inputField.addEventListener('keydown', (event) => {
  if (event.key == 'Tab') {
    event.preventDefault();
    const userInput = inputField.value.toLowerCase();
    const lastWordStart = userInput.lastIndexOf(' ') + 1;
    const lastWord = userInput.substring(lastWordStart);

    const matchingSuggestions = autofillOptions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    );

    if (matchingSuggestions.length > 0) {
      // Use selectedSuggestionIndex to get the currently selected suggestion
      const selectedSuggestion =
        suggestionsContainer.querySelectorAll('span')[selectedSuggestionIndex]
          .textContent;

      // Check if the selected suggestion is a custom item (contains the text "(custom)" at the end)
      const isCustomItem = selectedSuggestion.endsWith('(custom)');

      // Check if the selected suggestion is an audio item (contains the text "(audio)" at the end)
      const isAudioItem = selectedSuggestion.endsWith('(audio)');

      // Check if the selected suggestion is a prop item (contains the text "(prop)" at the end)
      const isPropItem = selectedSuggestion.endsWith('(prop)');

      // Check if the selected suggestion is an entity item (contains the text "(entity)" at the end)
      const isEntityItem = selectedSuggestion.endsWith('(entity)');

      // Check if the selected suggestion is a weapon item (contains the text "(weapon)" at the end)
      const isWeaponItem = selectedSuggestion.endsWith('(weapon)');

      // If it's a specific item, remove the text from the suggestion
      const suggestionWithoutExtra = isCustomItem
        ? selectedSuggestion.slice(0, -9)
        : isAudioItem
        ? selectedSuggestion.slice(0, -8)
        : isPropItem
        ? selectedSuggestion.slice(0, -7)
        : isEntityItem
        ? selectedSuggestion.slice(0, -9)
        : isWeaponItem
        ? selectedSuggestion.slice(0, -9)
        : selectedSuggestion;

      const newInput =
        userInput.substring(0, lastWordStart) + suggestionWithoutExtra;
      inputField.value = newInput + ' ';
    }
  } else if (event.key == 'ArrowDown') {
    event.preventDefault();
    const suggestions = suggestionsContainer.querySelectorAll('span');
    selectedSuggestionIndex =
      (selectedSuggestionIndex + 1) % suggestions.length;
    highlightSelectedSuggestion();
  } else if (event.key == 'ArrowUp') {
    event.preventDefault();
    const suggestions = suggestionsContainer.querySelectorAll('span');
    selectedSuggestionIndex =
      (selectedSuggestionIndex - 1 + suggestions.length) % suggestions.length;
    highlightSelectedSuggestion();
  } else if (event.key == 'Enter' && selectedSuggestionIndex !== -1) {
    event.preventDefault();
    const userInput = inputField.value.toLowerCase();
    const lastWordStart = userInput.lastIndexOf(' ') + 1;
    const selectedSuggestion =
      suggestionsContainer.querySelectorAll('span')[selectedSuggestionIndex]
        .textContent;

    // Check if the selected suggestion is a custom item (contains the text "(custom)" at the end)
    const isCustomItem = selectedSuggestion.endsWith('(custom)');

    // Check if the selected suggestion is an audio item (contains the text "(audio)" at the end)
    const isAudioItem = selectedSuggestion.endsWith('(audio)');

    // Check if the selected suggestion is a prop item (contains the text "(prop)" at the end)
    const isPropItem = selectedSuggestion.endsWith('(prop)');

    // Check if the selected suggestion is an entity item (contains the text "(entity)" at the end)
    const isEntityItem = selectedSuggestion.endsWith('(entity)');

    // Check if the selected suggestion is a weapon item (contains the text "(weapon)" at the end)
    const isWeaponItem = selectedSuggestion.endsWith('(weapon)');

    // If it's a specific item, remove the text from the suggestion
    const suggestionWithoutExtra = isCustomItem
      ? selectedSuggestion.slice(0, -9)
      : isAudioItem
      ? selectedSuggestion.slice(0, -8)
      : isPropItem
      ? selectedSuggestion.slice(0, -7)
      : isEntityItem
      ? selectedSuggestion.slice(0, -9)
      : isWeaponItem
      ? selectedSuggestion.slice(0, -9)
      : selectedSuggestion;

    const newInput =
      userInput.substring(0, lastWordStart) + suggestionWithoutExtra;
    inputField.value = newInput + ' ';
    suggestionsContainer.innerHTML = '';
  }
});
