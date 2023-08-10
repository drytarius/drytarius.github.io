const outputTextArea = document.getElementById('outputText');


//THE COMMAND LIST

const floatingDiv = document.querySelector('.floating-div');
const dragHandle = document.querySelector('.drag-handle');

let offsetX, offsetY, isDragging = false;

// Function to handle mouse down event on the drag handle
function handleMouseDown(event) {
  isDragging = true;
  offsetX = event.clientX - floatingDiv.getBoundingClientRect().left;
  offsetY = event.clientY - floatingDiv.getBoundingClientRect().top;
}

// Function to handle mouse move event when dragging
function handleMouseMove(event) {
  if (isDragging) {
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;
    floatingDiv.style.left = `${x}px`;
    floatingDiv.style.top = `${y}px`;
  }
}

// Function to handle mouse up event when dragging ends
function handleMouseUp() {
  isDragging = false;
}

// Add event listeners to the drag handle
dragHandle.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mouseup', handleMouseUp);



//THE DIV ON THE RIGHT

// Get the resizable div element and handle element
const resizableDiv = document.getElementById('resizableDiv');
const resizableHandleOutput = document.getElementById('resizableHandleOutput');
let initialWidth;
let initialX;

// Add event listener for mousedown on the handle to start resizing
resizableHandleOutput.addEventListener('mousedown', function (e) {
  initialWidth = resizableDiv.offsetWidth;
  initialX = e.clientX;
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
});

// Function to handle resizing
function resize(e) {
  const deltaX = e.clientX - initialX;
  const newWidth = initialWidth - deltaX;
  resizableDiv.style.width = newWidth + 'px';
}

// Function to stop resizing
function stopResize() {
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
}



























const prefixText = document.getElementById('prefixText');
const suffixText = document.getElementById('suffixText');


function generateOutput() {
    const inputText = document.getElementById('inputText');
    const lines = inputText.value.split('\n'); // Split the text
    const incrementChecker = document.getElementById('incrementCheckbox');
    const increment = incrementChecker.value;
    
    // Prefix and Suffix
    const prefix = prefixText.value;
    const suffix = suffixText.value;
    
    // Add the Prefix and Suffix to the lines
    const modifiedLines = lines.map(line => {
      if (/^\s*$/.test(line)) {
        // For lines consisting only of spaces or line breaks, keep them unchanged
        return line;
      } else if (line.trim().startsWith('//')) {
        // For lines starting with //, keep them unchanged
        return line;
      } else {
        // For other lines, add the prefix and suffix
        return prefix + line + suffix;
      }
    });

//console.log(modifiedLines);

// Combine the result and change the value to the result
inputText.value = modifiedLines.join('\n');




  if(incrementChecker.checked){
    //console.log('CHECKBOX CHECKED.');

    const inputText = document.getElementById('inputText');
    const text = inputText.value;
    
    // /\[%NUM\]/gi regex matches [%NUM].
    const regex = /\[%NUM\]/gi;
    const regexAlt = /\[%NUMALT\]/gi;
    const regexIncrement = /\[%NUMIN\]/gi;
    
    // For replacing, create different functions
    function replaceFunc(match) {
      return `${count++}`;
    }
    
    function replaceFuncInc(match) {
      return `${countInc++}`;
    }
    
    function replaceFuncAlt(match) {
      return `${countAlt++}`;

// THIS IS NOT NEEDED, UNLESS YOU WANT TO CROP THE FIRST %numalt.
//      if (countAlt === 0) {
//        countAlt++;
//        return " "; // Change first `%numalt` to an empty string
//      } else {
//        return `${countAlt++}`;
//      }
    }
    
    let count = 1;
    let countAlt = 1;
    let countInc = 1;
    
    const step0Text = text.replace(regexIncrement, replaceFuncInc);
    
    // STEP ONE: [%numalt] gets changed with `countAlt` variables.
    const step1Text = step0Text.replace(regexAlt, replaceFuncAlt);
    
    // LASTLY: Find [%numalt]'s index.
    const lastNumIndex = step1Text.toLowerCase().lastIndexOf("[%num]"); // Convert to lowercase before finding the last index
    
    if (lastNumIndex !== -1) {
      // Replace last [%num] with 1.
      const modifiedText = step1Text.substring(0, lastNumIndex) + "1" + step1Text.substring(lastNumIndex + 6); // 6, length of the [%NUM]
    
      // Replace the remaining [%num] with `count`.
      const finalText = modifiedText.replace(regex, replaceFunc);
    
      //console.log(finalText);
    
      // Update the result
      inputText.value = finalText;
    } else {
      //console.log(step1Text);
    
      // Update the result
      inputText.value = step1Text;
    }
  }
}







//AUTOFILL CODE

const inputField = document.getElementById('commandInput');
const filterField = document.getElementById('filterInput');
const suggestionsContainer = document.getElementById('autofillSuggestions');
const toggleSuggestionsButton = document.getElementById('hideList');
const navigationButtons = document.getElementById('pageNavigationButtons');
let selectedSuggestionIndex = -1;
let userInput;
let lastWordStart;
let lastWord;

let showCustom = true; // Set to true to show custom suggestions
let showCommands = true; // Set to true to show command suggestions
let showAudio = true; // Set to true to show audio suggestions
let showProps = true; // Set to true to show prop suggestions
let showEntities = true; // Set to true to show entity suggestions
let showWeapons = true; // Set to true to show weapon suggestions

let suggestionsPerPage;
let currentPage = 1;

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

// Variable to track the visibility of the suggestions container
let isSuggestionsVisible = false;

// Function to toggle the visibility of the suggestions container
function toggleSuggestionsVisibility() {
  floatingDiv.classList.add('height-transition');
  

  if (isSuggestionsVisible) {
    navigationButtons.style.display = 'none';
    suggestionsContainer.style.display = 'none';
    isSuggestionsVisible = false;
    toggleSuggestionsButton.innerHTML = '(▼)';
    floatingDiv.style.height = '25px';
    floatingDiv.style.opacity = '.5';
  } else {
    navigationButtons.style.display = 'block';
    suggestionsContainer.style.display = 'block';
    isSuggestionsVisible = true;
    toggleSuggestionsButton.innerHTML = '(▲)';
    floatingDiv.style.height = '854px';
    floatingDiv.style.opacity = '1';
  }

  // Listen for the transitionend event and remove the heightTransition class after the transition is complete
  floatingDiv.addEventListener('transitionend', () => {
    floatingDiv.classList.remove('height-transition');
  });
}



const autofillOptions = autofillOptionsCommands.concat(autofillOptionsCustom, autofillOptionsAudio, autofillOptionsProps, autofillOptionsEntities, autofillOptionsWeapons);

const commandSuggestions = autofillOptions.filter(option => autofillOptionsCommands.includes(option));
const customSuggestions = autofillOptions.filter(option => autofillOptionsCustom.includes(option));
const audioSuggestions = autofillOptions.filter(option => autofillOptionsAudio.includes(option));
const propSuggestions = autofillOptions.filter(option => autofillOptionsProps.includes(option));
const entitySuggestions = autofillOptions.filter(option => autofillOptionsEntities.includes(option));
const weaponSuggestions = autofillOptions.filter(option => autofillOptionsWeapons.includes(option));


//console.log(autofillOptions.toString())

let matchingSuggestions = [];

filterField.value = `-audio -props -entities show:150`

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
  if(!filterValue.includes('-commands') && !filterValue.includes('-custom') && !filterValue.includes('-audio') && !filterValue.includes('-props') && !filterValue.includes('-entities') && !filterValue.includes('-weapons')) {
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
    matchingSuggestions = matchingSuggestions.concat(commandSuggestions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    ));
  }

  if (showCustom) {
    matchingSuggestions = matchingSuggestions.concat(customSuggestions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    ));
  }

  if (showAudio) {
    matchingSuggestions = matchingSuggestions.concat(audioSuggestions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    ));
  }

  if (showProps) {
    matchingSuggestions = matchingSuggestions.concat(propSuggestions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    ));
  }

  if (showEntities) {
    matchingSuggestions = matchingSuggestions.concat(entitySuggestions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    ));
  }

  if (showWeapons) {
    matchingSuggestions = matchingSuggestions.concat(weaponSuggestions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    ));
  }
}

  // Apply pagination
  let paginatedSuggestions;
  if (suggestionsPerPage === 'all') {
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
    suggestionLink.href = 'https://developer.valvesoftware.com/wiki/' + suggestion;
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

    if(suggestionText.includes(' (custom)')){
      suggestions[i].style.color = '#d99c29';
    } else if (suggestionText.includes(' (audio)')) {
      suggestions[i].style.color = '#ffe666';
    } else if(suggestionText.includes(' (prop)')){
      suggestions[i].style.color = '#dc5e5e';
    } else if(suggestionText.includes(' (entity)')){
      suggestions[i].style.color = '#28649c';
    } else if(suggestionText.includes(' (weapon)')){
      suggestions[i].style.color = '#50555e';
    } else if (suggestionText.startsWith('+') || suggestionText.startsWith('-')) {
      suggestions[i].style.color = '#d10fce';
    } else if (suggestionText.startsWith('cl') || suggestionText.startsWith('mp')) {
      suggestions[i].style.color = '#e55d1f';
    } else if (suggestionText.includes('_')) {
      suggestions[i].style.color = '#238722';
    } else {
      suggestions[i].style.color = '#b4c7d9';
    }
  }

  if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
    suggestions[selectedSuggestionIndex].classList.add('selected');

    // Scroll the container to bring the selected suggestion into view
    const selectedSuggestionElement = suggestions[selectedSuggestionIndex];
    const containerRect = suggestionsContainer.getBoundingClientRect();
    const selectedRect = selectedSuggestionElement.getBoundingClientRect();

    if (selectedRect.top < containerRect.top) {
      suggestionsContainer.scrollTop -= containerRect.top - selectedRect.top;
    } else if (selectedRect.bottom > containerRect.bottom) {
      suggestionsContainer.scrollTop += selectedRect.bottom - containerRect.bottom;
    }
  }
}

function runFixedUpdateSuggestions(){
  currentPage = 1;
  updateSuggestions();
}

inputField.addEventListener('input', runFixedUpdateSuggestions);

inputField.addEventListener('keydown', event => {
  if (event.key === 'Tab') {
    event.preventDefault();
    const userInput = inputField.value.toLowerCase();
    const lastWordStart = userInput.lastIndexOf(' ') + 1;
    const lastWord = userInput.substring(lastWordStart);

    const matchingSuggestions = autofillOptions.filter(option =>
      option.toLowerCase().startsWith(lastWord)
    );

    if (matchingSuggestions.length > 0) {
      // Use selectedSuggestionIndex to get the currently selected suggestion
      const selectedSuggestion = suggestionsContainer.querySelectorAll('span')[selectedSuggestionIndex].textContent;
      
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
        
      const newInput = userInput.substring(0, lastWordStart) + suggestionWithoutExtra;
      inputField.value = newInput + ' ';
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    const suggestions = suggestionsContainer.querySelectorAll('span');
    selectedSuggestionIndex = (selectedSuggestionIndex + 1) % suggestions.length;
    highlightSelectedSuggestion();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    const suggestions = suggestionsContainer.querySelectorAll('span');
    selectedSuggestionIndex = (selectedSuggestionIndex - 1 + suggestions.length) % suggestions.length;
    highlightSelectedSuggestion();
  } else if (event.key === 'Enter' && selectedSuggestionIndex !== -1) {
    event.preventDefault();
    const userInput = inputField.value.toLowerCase();
    const lastWordStart = userInput.lastIndexOf(' ') + 1;
    const selectedSuggestion = suggestionsContainer.querySelectorAll('span')[selectedSuggestionIndex].textContent;
    
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
        
    const newInput = userInput.substring(0, lastWordStart) + suggestionWithoutExtra;
    inputField.value = newInput + ' ';
    suggestionsContainer.innerHTML = '';
  }
});








//SPELLCHECKING

function spellCheck(text) {
  if (!text) {
    return [];
  }

  const words = text.toLowerCase().match(/(?:\[%\w+\]|\+\w+|\w+)/g);

  if (!words) {
    return [];
  }

  const escapedAutofillOptions = autofillOptions.map(option =>
    option.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  );

  try {
    if (text.length > 0) {
      const misspelledWords = words.filter(word => {
        return !new RegExp(escapedAutofillOptions.join('|'), 'i').test(word);
      });

      return misspelledWords;
    }
  } catch (err) {
    console.error('An error occurred: ', err);
  }

  return [];
}

function updateSpellCheckResult() {
  const misspelledWords = spellCheck(userInput.toString());

  const resultContainer = document.getElementById('spellCheckResult');
  if(userInput.toString().length > 0){
  try{
  if (misspelledWords.length > 0) {
    resultContainer.innerHTML = `Potential typo(s): ${misspelledWords.join(', ')}`;
    resultContainer.style.color = "darkred";
  } else {
    resultContainer.innerHTML = 'Seems like there are no typos.';
    resultContainer.style.color = "darkgreen";
  }
  } catch (err){
    console.error('An error occured, maybe the value was undefined due to the length?: ', err);
  }
  }
}

// Add the "input" event listener to the input.
document.getElementById('commandInput').addEventListener('input', updateSpellCheckResult);



// Add event listener to the dropdown to listen for changes
dropdown.addEventListener('change', function() {
  // Get the selected value from the dropdown
  const dropdown = document.getElementById('dropdown');
  const selectedValue = dropdown.value;

  // Perform the action based on the selected value
  switch (selectedValue) {
    case 'empty':
      // Clear everything (except the output)
      //console.log('Preset: empty');

      inputText.value = '';
      prefixText.value = '';
      suffixText.value = '';
      break;
    case 'preset1':
      // Preset for ASCII art
      //console.log('Preset: preset1');

      inputText.value = `//alias "asciiscript" "ascii[%NUM]";
//! Put your ASCII art between here:

//!

//! You can replace "." with the key you want to bind the ASCII art to.
//bind "." "asciiscript";`;
      prefixText.value = 'alias "ascii[%NUMALT]" "say ';
      suffixText.value = '[%NUMIN]; alias asciiscript ascii[%NUM]";';
      break;
    case 'preset2':
      // Crouchjump preset
      //console.log('Preset: preset2');

      inputText.value = `//alias +duckjump "+jump; +duck";
//alias -duckjump "-jump; -duck";
//bind "c" "+duckjump";`;
      prefixText.value = '';
      suffixText.value = '';
      break;
    case 'preset3':
      //Preset for Other
      //console.log('Preset: preset3');

      inputText.value = `//bind e "+use; r_cleardecals";`
      prefixText.value = '';
      suffixText.value = '';
      break;
    case 'preset4':
    //console.log('Preset: preset4')
    inputText.value = `//bind mwheeldown "+jump";
//bind mwheelup "+jump";`
      prefixText.value = '';
      suffixText.value = '';
      break;
    case 'preset5':
    //console.log('Preset: preset5')
    inputText.value = `//bind h "toggle cl_righthand 0 1";`
      prefixText.value = '';
      suffixText.value = '';
    default:
      // Do something for default case (if needed)

      //console.log('No presets selected.');
      break;
  }
});
















function appendGeneratedCommandTextToParagraph(){
    //document.getElementById('generatedCommandOutput').innerHTML = userInput;
    const cropOutput = inputText.value.replace(/\/\/(!.*)?(\n|$)/g, '');
    const cleanOutput = cropOutput.replace(/\/\//g, '');
    outputTextArea.value = cleanOutput;
    //outputTextArea.value = userInput;
}

function copyTextOutputValue() {
  // Select the text inside the inputText
  const copyTextAlert = document.getElementById('copyChecker');
  outputTextArea.select();

  // Use the Clipboard API to copy the selected text to the clipboard
  navigator.clipboard.writeText(outputTextArea.value)
    .then(() => {
      console.log('Text copied to clipboard successfully.');
      copyTextAlert.innerHTML = ("Text copied to clipboard successfully! Character size: " + outputTextArea.value.length + ".");
      copyTextAlert.style.color = "darkgreen";
    })
    .catch((err) => {
      console.error('Error copying text to clipboard: ', err);
      copyTextAlert.innerHTML = ('Error copying text to clipboard: ' + err);
      copyTextAlert.style.color = "darkred";
    });
}

function copyCommandOutputValue() {
  // Select the text inside the inputText
  const copyTextAlert = document.getElementById('copyChecker');
  inputField.select();

  // Use the Clipboard API to copy the selected text to the clipboard
  navigator.clipboard.writeText(inputField.value)
    .then(() => {
      console.log('Text copied to clipboard successfully.');
      copyTextAlert.innerHTML = ("Text copied to clipboard successfully! Character size: " + inputField.value.length + ".");
      copyTextAlert.style.color = "darkgreen";
    })
    .catch((err) => {
      console.error('Error copying text to clipboard: ', err);
      copyTextAlert.innerHTML = ('Error copying text to clipboard: ' + err);
      copyTextAlert.style.color = "darkred";
    });
}































let keyListener = false;
const keyListenerButton = document.getElementById('toggleKeyListenerButton');

        // Event listener function
function handleKeyPress(event) {
  const preventKeys = [
    'F1',
    'F5',
    'F11',
    'F12',
    'r', // Ctrl + R (Windows) or Command + R (Mac)
    'i', // Ctrl + Shift + I (Windows) or Command + Option + I (Mac)
    'j', // Ctrl + Shift + J (Windows) or Command + Option + J (Mac)
    'c', // Ctrl + Shift + C (Windows) or Command + Option + C (Mac)
];

if (keyListener && (preventKeys.includes(event.key) || (event.ctrlKey && ['r', 'i', 'j', 'c'].includes(event.key.toLowerCase())))) {
    event.preventDefault(); // Prevent the default behavior
}

if (keyListener) {
    const pressedKey = event.code;
    const keyName = keyNames[pressedKey];

if (keyName) {
    console.log(keyName);
    inputField.value = inputField.value + keyName + ' ';
    keyListener = false;
    keyListenerButton.innerHTML = "Listen for KeyButton(s)...";
    keyListenerButton.style.backgroundColor = "rgba(50, 205, 50, .5)";
   }
}
}

// Toggle keyListener
function toggleKeyListener(){
  keyListener = !keyListener;
  //console.log('keyListener is now:', keyListener);
  if(keyListener){
    keyListenerButton.innerHTML = "Listening...";
    keyListenerButton.style.backgroundColor = "rgba(255, 195, 0, .5)";
  } else {
    keyListenerButton.innerHTML = "Listen for KeyButton(s)...";
    keyListenerButton.style.backgroundColor = "rgba(50, 205, 50, .5)";
  }
}

// Add event listener to the window for keydown event
window.addEventListener("keydown", handleKeyPress);














// Save the inputText to localStorage
// Function to get the current date and time in a readable format
function getCurrentDateTime() {
  const now = new Date();
  return now.toLocaleString(); // Adjust the format as needed
}

// Define a variable to store the key used to save the data in localStorage
const localStorageKey = 'userInputData';
const fileNameInput = document.getElementById('fileName');

let consoleAliasMessage = '';

// Get the saved data from localStorage and set it to the inputField
const savedData = JSON.parse(localStorage.getItem(localStorageKey));
if (savedData) {
  inputText.value = savedData.content;
  fileNameInput.value = savedData.contentName;

  // Log the loaded data and the date and time it was saved to localStorage
  try {
  console.log(`Loaded data ${localStorageKey}: \n\nSaved Data Content Name:\n${savedData.contentName}\n\nSaved Data Content:\n${savedData.content}\n\nSaved on ${savedData.timestamp}.\n\nTo see the content of the data, type "localSaveInfo" in the console.`);
  consoleAliasMessage = `Loaded data: ${localStorageKey}, Content Name: ${savedData.contentName}, Content: ${savedData.content}, Saved on: ${savedData.timestamp}.`;
  } catch (err) { 
  console.error('Error displaying the data:', err);
  }
}

// Function to show the success message and fade it out after a delay
function showSaveMessage() {
  const displaySavingStatus = document.getElementById('saveStatus');
  displaySavingStatus.innerHTML = 'Saved successfully!';

  // Show the saveStatus
  displaySavingStatus.classList.remove('hidden');

  // Turn the color into darkgreen
  displaySavingStatus.style.color = "darkgreen";

  // Remove the fade-out class if it was previously added
  displaySavingStatus.classList.remove('fade-out');

  // After 3 seconds, add the fade-out class to trigger the transition effect
  setTimeout(() => {
    displaySavingStatus.classList.add('fade-out');
  }, 3000);
}



function saveDataToLocalStorage() {
  const content = inputText.value;
  const contentName = fileNameInput.value;
  const currentTime = getCurrentDateTime();
  const dataToSave = {
    content,
    contentName,
    timestamp: currentTime,
  };
  try{
  localStorage.setItem('userInputData', JSON.stringify(dataToSave));
  consoleAliasMessage = `Loaded data: ${localStorageKey}, Content Name: ${savedData.contentName}, Content: ${savedData.content}, Saved on: ${savedData.timestamp}.`;
  showSaveMessage();
  //console.log('Data saved:', content);
  } catch (err) {
    console.error('Error saving the data:', err);
  }
}

// Listen for changes in the textarea and update the localStorage accordingly
inputText.addEventListener('input', saveDataToLocalStorage);
fileNameInput.addEventListener('input', saveDataToLocalStorage);
// Set up autosave to run every minute (60000 milliseconds)
setInterval(saveDataToLocalStorage, 60000);


// Define the function that will be executed when you type "localSaveInfo" in the console
function displaySavedDataInfo() {
  return consoleAliasMessage;
}

// Add the alias "localSaveInfo" to the console by adding the function to the window object
window.localSaveInfo = displaySavedDataInfo();
























// Load user's file(s)

// Get references to the file input and textarea elements
const fileInput = document.getElementById('fileInput');
// Event listener for when a file is selected
fileInput.addEventListener('change', handleFileSelect);

// Function to handle the selected file
function handleFileSelect(event) {
  const selectedFile = event.target.files[0];

  // Check if a file is selected
  if (!selectedFile) return;
  console.log(selectedFile.name)

  // Read the contents of the file
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const fileContent = event.target.result;

    // Set the file content to the textarea
    inputText.value = fileContent;
  };

  // Read the file as text
  fileReader.readAsText(selectedFile);
}



// Save the output as

const saveButton = document.getElementById('saveButton');

// Event listener for the save button
saveButton.addEventListener('click', saveAsCFGFile);

// Function to save the content of the textarea as a .txt file
function saveAsCFGFile() {
  let randomNumber = Math.floor(Math.random() * 1000000) + 1;
  const prohibitedChars = /[:<>"/\\|?*]/; // Regular expression for prohibited characters
  const textContent = outputTextArea.value;
  const blob = new Blob([textContent], { type: 'text/plain' });
  let fileName;
  if (fileNameInput.value.length > 0 && !prohibitedChars.test(fileNameInput.value)) {
    fileName = fileNameInput.value + '.cfg';
  } else {
    fileName = 'config_' + randomNumber + '.cfg';
  }

  // Create a temporary anchor element to trigger the download
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = fileName;
  downloadLink.style.display = 'none';

  // Append the anchor to the body and trigger the download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up the temporary anchor
  document.body.removeChild(downloadLink);
}



























// Image to ascii
const imageInput = document.getElementById('image-input');
const aspectSizeSlider = document.getElementById('aspect-size-slider');
const aspectRatioLabel = document.getElementById('aspect-ratio');
const aspectSizeMultiplierInput = document.getElementById('aspect-size-multiplier');
const asciiFontSizeInput = document.getElementById('asciiFontSize');
const asciiArtContainer = document.getElementById('ascii-art-container');

const invertedCheckbox = document.getElementById('invertedCheckbox');
const ditheringCheckbox = document.getElementById('ditheringCheckbox');
const monospaceCheckbox = document.getElementById('monospaceCheckbox');

imageInput.addEventListener('change', handleImageSelect);
aspectSizeSlider.addEventListener('input', handleConfigurationChange);
aspectSizeMultiplierInput.addEventListener('input', handleConfigurationChange);

invertedCheckbox.addEventListener('change', handleConfigurationChange);
ditheringCheckbox.addEventListener('change', handleConfigurationChange);
monospaceCheckbox.addEventListener('change', handleConfigurationChange);

asciiFontSizeInput.addEventListener('change', changeASCIIFontSize);

function changeASCIIFontSize(){
  asciiArtContainer.style.fontSize = asciiFontSizeInput.value + 'px';

  //console.log(asciiFontSizeInput.value);
}

changeASCIIFontSize();


const settings = {
	last_canvas: null,
	last_dithering: null,
	last_source: "",

	width: 62,
	greyscale_mode: "luminance",
	inverted: false,
	dithering: false,
	monospace: false,
}

dropdownGreyscale.addEventListener('change', function(){

  const dropdownGreyscale = document.getElementById('dropdownGreyscale');
  const selectedGreyscale = dropdownGreyscale.value;

  switch (selectedGreyscale) {
    case 'luminance':
			settings.greyscale_mode = 'luminance';

      handleConfigurationChange();
      //console.log(settings.greyscale_mode);
      break;
		case 'lightness':
			settings.greyscale_mode = 'lightness';

      handleConfigurationChange();
      //console.log(settings.greyscale_mode);
      break;
		case 'average':
			settings.greyscale_mode = 'average';

      handleConfigurationChange();
      //console.log(settings.greyscale_mode);
      break;
		case 'value':
			settings.greyscale_mode = 'value';

      handleConfigurationChange();
      //console.log(settings.greyscale_mode); 
      break;
		default:
      //console.log(settings.greyscale_mode);
      break;
	}
})

dropdownASCIIBackground.addEventListener('change', function(){

  const dropdownASCIIBackground = document.getElementById('dropdownASCIIBackground');
  const selectedASCIITheme = dropdownASCIIBackground.value;

  switch (selectedASCIITheme) {
    case 'light':
			asciiArtContainer.style.backgroundColor = 'white';
      asciiArtContainer.style.color = 'black';

      break;
		case 'dark':
			asciiArtContainer.style.backgroundColor = 'black';
      asciiArtContainer.style.color = 'white';

      break;
		default:

      break;
	}
})

function handleImageSelect() {
    const file = imageInput.files[0];
    const displayUploadStatus = document.getElementById('uploadStatus');
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function () {
      const image = new Image();
      image.onload = function () {
        handleImageLoad(image);

        // Handle image loading errors
        displayUploadStatus.innerHTML = 'File loaded successfully.';
        // Turn the color into darkgreen
        displayUploadStatus.style.color = "darkgreen";
      };
      image.onerror = function () {
        // Handle image loading errors
        displayUploadStatus.innerHTML = 'Error loading the file. Supported file types: .jpg, .jpeg, .png, .gif, .bmp, .webp, .svg.';
        // Turn the color into darkred
        displayUploadStatus.style.color = "darkred";
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function handleImageLoad(image) {
    const aspectSize = aspectSizeSlider.value;
    const aspectSizeMultiplier = aspectSizeMultiplierInput.value;
    aspectRatioLabel.textContent = `Aspect Ratio: 1:${aspectSize}`;
    settingsCheckboxChecker(aspectSize, aspectSizeMultiplier);
    createAsciiCanvas(image, aspectSize, aspectSizeMultiplier);
  }


function settingsCheckboxChecker(aspectSize, aspectSizeMultiplier){
  if(invertedCheckbox.checked){
    settings.inverted = true;
  } else {
    settings.inverted = false;
  }

  if(ditheringCheckbox.checked){
    settings.dithering = true;
  } else {
    settings.dithering = false;
  }

  if(monospaceCheckbox.checked){
    settings.monospace = true;
  } else {
    settings.monospace = false;
  }

  settings.width = aspectSize * aspectSizeMultiplier;
}

function handleAspectSizeChangeBefore(){
  const aspectSize = aspectSizeSlider.value;
  const aspectSizeMultiplier = aspectSizeMultiplierInput.value;
  settings.width = aspectSize * aspectSizeMultiplier;
  aspectRatioLabel.textContent = `Aspect Ratio: 1:${aspectSize}`;
}

handleAspectSizeChangeBefore();

function handleConfigurationChange() {
    const imageSrc = asciiArtContainer.getAttribute('data-image-src');

    const aspectSize = aspectSizeSlider.value;
    const aspectSizeMultiplier = aspectSizeMultiplierInput.value;
    settingsCheckboxChecker(aspectSize, aspectSizeMultiplier);
    //console.log(aspectSize)
    settings.width = aspectSize * aspectSizeMultiplier;
    aspectRatioLabel.textContent = `Aspect Ratio: 1:${aspectSize}`;
    if (!imageSrc) return; // If no image is loaded, return early
    
    const image = new Image();
    image.onload = function() {
        createAsciiCanvas(image);
    };
    image.onerror = function () {
      // Handle image loading errors
      console.error('Error: Unable to load the image.');
    };
    image.src = imageSrc;
  }

  function createAsciiCanvas(image) {
    const canvas = document.createElement("CANVAS");

        let width = image.width;
        let height = image.height;
        if(image.width != (settings.width * 2)) {
            width = settings.width * 2;
            height = width * image.height / image.width;
        }

        //nearest multiple
        canvas.width = width - (width % 2);
        canvas.height = height - (height % 4);

        

        ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF"; //get rid of alpha
        ctx.fillRect(0,0, canvas.width,canvas.height);

        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(image, 0,0, canvas.width,canvas.height);

        canvasToText(canvas, image);
        //console.log('created canvas?')
  }


  function toGreyscale(r, g, b) {
	switch(settings.greyscale_mode) {
		case "luminance":
			return (0.22 * r) + (0.72 * g) + (0.06 * b);

		case "lightness":
			return (Math.max(r,g,b) + Math.min(r,g,b)) / 2;

		case "average":
			return (r + g + b) / 3;

		case "value":
			return Math.max(r,g,b);

		default:
			
	}
}

function dithering(canvas) {
	this.canvas = canvas;
	this.image_data = new Uint8Array(canvas.getContext("2d").getImageData(0,0, canvas.width, canvas.height).data); //clone

	let oldpixel;
	let newpixel;
	let quant_error;
	let err_red, err_green, err_blue;

	const _getPixel = (x, y) => {
		const index = (x + y * canvas.width) * 4;
		return [ this.image_data[index+0], this.image_data[index+1], this.image_data[index+2] ];
	}

	const _setPixel = (x, y, colour) => {
		const index = (x + y * canvas.width) * 4;
		this.image_data[index+0] = Math.floor(colour[0]+0.5);
		this.image_data[index+1] = Math.floor(colour[1]+0.5);
		this.image_data[index+2] = Math.floor(colour[2]+0.5);
		this.image_data[index+3] = 255;
	}

	const _closestPalleteColour = (pixel) => {
		return (0.2126*pixel[0] + 0.7152*pixel[1] + 0.0722*pixel[2]) > 128 ? [255,255,255] : [0,0,0];
	}

	const _colourDifference = (one, two) => {
		return [(one[0] - two[0]), (one[1] - two[1]), (one[2] - two[2])];
	}

	const _colourAddError = (x, y, err_red, err_green, err_blue) => {
		const clip = (x) => (x < 0 ? 0 : (x > 255 ? 255 : x));
		const index = (x + y * canvas.width) * 4;
		this.image_data[index+0] = clip(this.image_data[index+0] + err_red)
		this.image_data[index+1] = clip(this.image_data[index+1] + err_green)
		this.image_data[index+2] = clip(this.image_data[index+2] + err_blue)
		this.image_data[index+3] = 255;
	}

	for(let y = 0; y < canvas.height; y++) {
		for(let x = 0; x < canvas.width; x++) {
			oldpixel = _getPixel(x, y);
			newpixel = _closestPalleteColour(oldpixel);
			_setPixel(x, y, newpixel);
			quant_error = _colourDifference(oldpixel, newpixel);

			err_red = quant_error[0];
			err_green = quant_error[1];
			err_blue = quant_error[2];

			if(x+1 < canvas.width)             _colourAddError(x+1, y,   (7/16) * err_red, (7/16) * err_green, (7/16) * err_blue);
			if(x-1 > 0 && y+1 < canvas.height) _colourAddError(x-1, y+1, (3/16) * err_red, (3/16) * err_green, (3/16) * err_blue);
			if(y+1 < canvas.height)            _colourAddError(x,   y+1, (5/16) * err_red, (5/16) * err_green, (5/16) * err_blue);
			if(x+1 < canvas.width)             _colourAddError(x+1, y+1, (1/16) * err_red, (1/16) * err_green, (1/16) * err_blue);
		}
	}
}

function pixelsToCharacter(pixels_lo_hi) { //expects an array of 8 bools
	const shift_values = [0, 1, 2, 6, 3, 4, 5, 7]; //correspond to dots in braille chars compared to the given array
	let codepoint_offset = 0;
	for(const i in pixels_lo_hi) {
		codepoint_offset += (+pixels_lo_hi[i]) << shift_values[i];
	}

	if(codepoint_offset === 0 && settings.monospace === false) { //pixels were all blank
		codepoint_offset = 4; //0x2800 is a blank braille char, 0x2804 is a single dot
	}
    return String.fromCharCode(0x2800 + codepoint_offset);
}

function canvasToText(canvas, image) {
	const ctx = canvas.getContext("2d");
	const width = canvas.width;
	const height = canvas.height;



	let image_data = [];
	if(settings.dithering) {
		if(settings.last_dithering === null || settings.last_dithering.canvas !== canvas) {
			settings.last_dithering = new dithering(canvas);
		}
		image_data = settings.last_dithering.image_data;
	} else {
		image_data = new Uint8Array(ctx.getImageData(0,0,width,height).data.buffer);
	}

	let output = "";

	for(let imgy = 0; imgy < height; imgy += 4) {
		for(let imgx = 0; imgx < width; imgx += 2) {
			const braille_info = [0,0,0,0,0,0,0,0];
			let dot_index = 0;
			for(let x = 0; x < 2; x++) {
				for(let y = 0; y < 4; y++) {
					const index = (imgx+x + width * (imgy+y)) * 4;
					const pixel_data = image_data.slice(index, index+4); //ctx.getImageData(imgx+x,imgy+y,1,1).data
					if(pixel_data[3] >= 128) { //account for alpha
						const grey = toGreyscale(pixel_data[0], pixel_data[1], pixel_data[2]);
						if(settings.inverted) {
							if(grey >= 128) braille_info[dot_index] = 1;
						} else {
							if(grey <= 128) braille_info[dot_index] = 1;
						}
					}
					dot_index++;
				}
			}
			output += pixelsToCharacter(braille_info);
		}
		output += "\n";
	}

  //console.log(output)
	asciiArtContainer.textContent = output;
  asciiArtContainer.setAttribute('data-image-src', image.src);

  if (asciiArtContainer.textContent.length === 0) {
    asciiArtContainer.style.border = 'none';
  } else {
    asciiArtContainer.style.border = '1px solid black';
  }
}







// Copy the ASCII art
function copyASCIIOutputValue() {
  const copyTextAlert = document.getElementById('copyChecker');
  
  // Create a temporary textarea element
  const tempTextArea = document.createElement('textarea');
  
  // Set the value of the textarea to the text content of the div (asciiArtContainer)
  tempTextArea.value = asciiArtContainer.textContent;
  
  // Append the textarea to the document (it doesn't have to be visible)
  document.body.appendChild(tempTextArea);
  
  // Select the text inside the textarea
  tempTextArea.select();
  
  // Use the Clipboard API to copy the selected text to the clipboard
  navigator.clipboard.writeText(tempTextArea.value)
    .then(() => {
      console.log('Text copied to clipboard successfully.');
      copyTextAlert.innerHTML = ("Text copied to clipboard successfully! Character size: " + tempTextArea.value.length + ".");
      copyTextAlert.style.color = "darkgreen";
    })
    .catch((err) => {
      console.error('Error copying text to clipboard: ', err);
      copyTextAlert.innerHTML = ('Error copying text to clipboard: ' + err);
      copyTextAlert.style.color = "darkred";
    })
    .finally(() => {
      // Remove the temporary textarea from the document
      document.body.removeChild(tempTextArea);
    });
}

















const infoBox = document.getElementById('infoContent');
const infoWrap = document.getElementById('infoContainer');
const infoToggleButton = document.getElementById('hideInfo');



const mainBox = document.getElementById('mainContent');
const mainWrap = document.getElementById('mainContainer');
const mainToggleButton = document.getElementById('hideMain');

let isInfoBoxVisible = true;
let isMainBoxVisible = true;


// Toggle infoBox visibilitylet isSuggestionsVisible = false;
function toggleInfoBoxVisibility() {
  infoWrap.classList.add('height-transition');

  if (isInfoBoxVisible) {
    infoBox.style.display = 'none';
    isInfoBoxVisible = false;
    infoToggleButton.innerHTML = '(▼)';
    infoWrap.style.height = '25px';
    infoWrap.style.opacity = '.5';
  } else {
    infoBox.style.display = 'block';
    isInfoBoxVisible = true;
    infoToggleButton.innerHTML = '(▲)';
    infoWrap.style.height = '562px';
    infoWrap.style.opacity = '1';
  }

  // Listen for the transitionend event and remove the heightTransition class after the transition is complete
  infoWrap.addEventListener('transitionend', () => {
    infoWrap.classList.remove('height-transition');
  });
}



function toggleMainBoxVisibility() {
  mainWrap.classList.add('height-transition');

  if (isMainBoxVisible) {
    mainBox.style.display = 'none';
    isMainBoxVisible = false;
    mainToggleButton.innerHTML = '(▼)';
    mainWrap.style.height = '25px';
    mainWrap.style.opacity = '.5';
  } else {
    mainBox.style.display = 'block';
    isMainBoxVisible = true;
    mainToggleButton.innerHTML = '(▲)';
    mainWrap.style.height = '970px';
    mainWrap.style.opacity = '1';
  }

  // Listen for the transitionend event and remove the heightTransition class after the transition is complete
  mainWrap.addEventListener('transitionend', () => {
    mainWrap.classList.remove('height-transition');
  });
}



const header = document.getElementById('header');
const scrollThreshold = 100; // Adjust the threshold as needed

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > scrollThreshold) {
    const opacity = 1 - (scrollY - scrollThreshold) / 100;
    header.style.opacity = opacity < 0 ? 0 : opacity; // Opacity should not go below 0
  } else {
    header.style.opacity = 1;
  }
});










// Check the width of the screen
const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const mobileScreenWidthThreshold = 768; // Adjust this value based on your design's breakpoint

if (screenWidth < mobileScreenWidthThreshold) {
  console.log('Website loaded on a mobile device.');
  console.log('No actions are taken.');
  console.log("Hey, hey! i'm a wazy devewopew, awnd my website isn't wesponsive!");
} else {
  console.log('Website not loaded on a mobile device.');
  console.log('No actions are taken.');
}

//For the sake of it, I'm not going to use this function.
//But if I see a single person complaining that the website isn't responsive
//because they can't f*cking load the website on their Steam Deck or something,
//I will go crazy... please I don't want to spend another week making this thing responsive.

//function excuseMaker(){
//  let randomNumber = Math.floor(Math.random() * 1000) + 1;
//  if(randomNumber === 621){
//    console.log('Responsive? I was going to be responsive once. They locked me in a responsive website. A small website! A small website with big divs, and divs make me crazy.')
//  } else {
//    console.log('Not passed.')
//  }
//}
//
//excuseMaker();


// FUN STUFF
// Toggle Themes

const toggleThemes = document.getElementById('forTheFurInYou');

let isChanged = false;

toggleThemes.addEventListener('click', function () {
    const body = document.body;
    const textareas = document.getElementsByTagName('textarea');
    const rootElement = document.documentElement;

    if (isChanged) {
    //console.log('off')
    body.classList.remove('gradient2');
    body.classList.add('gradient1');

    rootElement.style.setProperty('--default_text_color', 'black');
    rootElement.style.setProperty('--default_suggestion_info_text_color', 'black');
    rootElement.style.setProperty('--default_emphasize_color', 'lightgray');
    rootElement.style.setProperty('--default_header_color', 'black');

    isChanged = false;
  } else {
    //console.log('on')
    body.classList.remove('gradient1');
    body.classList.add('gradient2');

    rootElement.style.setProperty('--default_text_color', 'white');
    rootElement.style.setProperty('--default_suggestion_info_text_color', 'white');
    rootElement.style.setProperty('--default_emphasize_color', 'var(--e6_blue)');
    rootElement.style.setProperty('--default_header_color', 'var(--e6_yellow)');



    for (const textarea of textareas) {
    textarea.style.backgroundColor = "none";
    }   
    isChanged = true;
  }
});