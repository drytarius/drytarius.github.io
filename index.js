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
let selectedSuggestionIndex = -1;
let userInput;
let lastWordStart;
let lastWord;



let showAudio = true; // Set to true to show audio suggestions
let showCommands = true; // Set to true to show command suggestions

filterField.addEventListener('input', () => {
  const filterValue = filterField.value.toLowerCase();
  showCommands = !filterValue.includes('-commands');
  showAudio = !filterValue.includes('-audio');
  updateSuggestions(); // Call the updateSuggestions function whenever the filter input changes
});

// Variable to track the visibility of the suggestions container
let isSuggestionsVisible = true;

// Function to toggle the visibility of the suggestions container
function toggleSuggestionsVisibility() {
  floatingDiv.classList.add('height-transition');

  if (isSuggestionsVisible) {
    suggestionsContainer.style.display = 'none';
    isSuggestionsVisible = false;
    toggleSuggestionsButton.innerHTML = '(▼)';
    floatingDiv.style.height = '25px';
  } else {
    suggestionsContainer.style.display = 'block';
    isSuggestionsVisible = true;
    toggleSuggestionsButton.innerHTML = '(▲)';
    floatingDiv.style.height = '854px';
  }

  // Listen for the transitionend event and remove the heightTransition class after the transition is complete
  floatingDiv.addEventListener('transitionend', () => {
    floatingDiv.classList.remove('height-transition');
  });
}



const autofillOptions = autofillOptionsCommands.concat(autofillOptionsAudio);

const audioSuggestions = autofillOptions.filter(option => autofillOptionsAudio.includes(option));
const commandSuggestions = autofillOptions.filter(option => !autofillOptionsAudio.includes(option));

function updateSuggestions() {
  userInput = inputField.value.toLowerCase();
  lastWordStart = userInput.lastIndexOf(' ') + 1;
  lastWord = userInput.substring(lastWordStart);

  let matchingSuggestions = [];

  const filterValue = filterField.value;
  if (filterValue.includes('-commands')) {
    showCommands = false;
  } 
  if (filterValue.includes('-audio')) {
    showAudio = false;
  } 
  if(!filterValue.includes('-commands') && !filterValue.includes('-audio')) {
    showCommands = true;
    showAudio = true;
  }

  if (showAudio && showCommands) {
    // If both showAudio and showCommands are true, display all suggestions
    matchingSuggestions = autofillOptions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    );
  } else if (showAudio) {
    // If showAudio is true, display audio suggestions
    matchingSuggestions = audioSuggestions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    );
  } else if (showCommands) {
    // If showCommands is true, display command suggestions
    matchingSuggestions = commandSuggestions.filter((option) =>
      option.toLowerCase().startsWith(lastWord)
    );
  }

  // Clear previous suggestions
  suggestionsContainer.innerHTML = '';

  // Display matching suggestions
  matchingSuggestions.forEach((suggestion, index) => {
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

    // Check if the suggestion is an audio item
    const isAudioItem = autofillOptionsAudio.includes(suggestion);

    // Append both the suggestionLink and suggestionText to suggestionElement
    suggestionElement.appendChild(suggestionLink);
    suggestionElement.appendChild(suggestionText);

    // If it's an audio item, create a new span with the class "audio" and append it to suggestionElement
    if (isAudioItem) {
      suggestionText.textContent = suggestion + ' (audio)'; // You can add any additional text to indicate it's an audio item
      suggestionText.classList.add('audio');
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

function highlightSelectedSuggestion() {
  //const suggestions = suggestionsContainer.children;
  const suggestions = suggestionsContainer.querySelectorAll('span');
  for (let i = 0; i < suggestions.length; i++) {
    suggestions[i].classList.remove('selected');
    const suggestionText = suggestions[i].textContent.toLowerCase();
    //console.log(suggestionText)

    if (suggestionText.includes(' (audio)')) {
      suggestions[i].style.color = '#ffe666';
    } else if (suggestionText.startsWith('+') || suggestionText.startsWith('-')) {
      suggestions[i].style.color = '#d10fce';
    } else if (suggestionText.startsWith('[')) {
      suggestions[i].style.color = '#d99c29';
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

inputField.addEventListener('input', updateSuggestions);

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
      
      // Check if the selected suggestion is an audio item (contains the text "(audio)" at the end)
      const isAudioItem = selectedSuggestion.endsWith('(audio)');

      // If it's an audio item, remove the "(audio)" text from the suggestion
      const suggestionWithoutAudio = isAudioItem ? selectedSuggestion.slice(0, -8) : selectedSuggestion;

      const newInput = userInput.substring(0, lastWordStart) + suggestionWithoutAudio;
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
    
    // Check if the selected suggestion is an audio item (contains the text "(audio)" at the end)
    const isAudioItem = selectedSuggestion.endsWith('(audio)');

    // If it's an audio item, remove the "(audio)" text from the suggestion
    const suggestionWithoutAudio = isAudioItem ? selectedSuggestion.slice(0, -8) : selectedSuggestion;

    const newInput = userInput.substring(0, lastWordStart) + suggestionWithoutAudio;
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