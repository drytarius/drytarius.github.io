// Constants && HTML element stuff

const outputTextArea = document.getElementById('outputText');

const floatingDiv = document.querySelector('.floating-div');
const dragHandle = document.querySelector('.drag-handle');

const prefixText = document.getElementById('prefixText');
const suffixText = document.getElementById('suffixText');

const inputField = document.getElementById('commandInput');
const filterField = document.getElementById('filterInput');
const suggestionsContainer = document.getElementById('autofillSuggestions');
const toggleSuggestionsButton = document.getElementById('hideList');
const navigationButtons = document.getElementById('pageNavigationButtons');

const infoBox = document.getElementById('infoContent');
const infoWrap = document.getElementById('infoContainer');
const infoToggleButton = document.getElementById('hideInfo');

const mainBox = document.getElementById('mainContent');
const mainWrap = document.getElementById('mainContainer');
const mainToggleButton = document.getElementById('hideMain');

const asciiBox = document.getElementById('asciiContent');
const asciiWrap = document.getElementById('asciiContainer');
const asciiToggleButton = document.getElementById('hideAscii');

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

//THE COMMAND LIST

let offsetX,
  offsetY,
  isDragging = false;

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
//const resizableDiv = document.getElementById('resizableDiv');
//const resizableHandleOutput = document.getElementById('resizableHandleOutput');
//let initialWidth;
//let initialX;
//
//// Add event listener for mousedown on the handle to start resizing
//resizableHandleOutput.addEventListener('mousedown', function (e) {
//  initialWidth = resizableDiv.offsetWidth;
//  initialX = e.clientX;
//  document.addEventListener('mousemove', resize);
//  document.addEventListener('mouseup', stopResize);
//});
//
//// Function to handle resizing
//function resize(e) {
//  const deltaX = e.clientX - initialX;
//  const newWidth = initialWidth - deltaX;
//  resizableDiv.style.width = newWidth + 'px';
//}
//
//// Function to stop resizing
//function stopResize() {
//  document.removeEventListener('mousemove', resize);
//  document.removeEventListener('mouseup', stopResize);
//}

function generateOutput() {
  const inputText = document.getElementById('inputText');
  const lines = inputText.value.split('\n'); // Split the text
  const incrementChecker = document.getElementById('incrementCheckbox');
  const increment = incrementChecker.value;

  // Prefix and Suffix
  const prefix = prefixText.value;
  const suffix = suffixText.value;

  // Add the Prefix and Suffix to the lines
  const modifiedLines = lines.map((line) => {
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

  if (incrementChecker.checked) {
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
      //      if (countAlt == 0) {
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
    const lastNumIndex = step1Text.toLowerCase().lastIndexOf('[%num]'); // Convert to lowercase before finding the last index

    if (lastNumIndex !== -1) {
      // Replace last [%num] with 1.
      const modifiedText =
        step1Text.substring(0, lastNumIndex) +
        '1' +
        step1Text.substring(lastNumIndex + 6); // 6, length of the [%NUM]

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

//SPELLCHECKING

function spellCheck(text) {
  if (!text) {
    return [];
  }

  const words = text.toLowerCase().match(/(?:\[%\w+\]|\+\w+|\w+)/g);

  if (!words) {
    return [];
  }

  const escapedAutofillOptions = autofillOptions.map((option) =>
    option.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  );

  try {
    if (text.length > 0) {
      const misspelledWords = words.filter((word) => {
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
  if (userInput.toString().length > 0) {
    try {
      if (misspelledWords.length > 0) {
        resultContainer.innerHTML = `Potential typo(s): ${misspelledWords.join(
          ', '
        )}`;
        resultContainer.style.color = 'darkred';
      } else {
        resultContainer.innerHTML = 'Seems like there are no typos.';
        resultContainer.style.color = 'darkgreen';
      }
    } catch (err) {
      console.error(
        'An error occured, maybe the value was undefined due to the length?: ',
        err
      );
    }
  }
}

// Add the "input" event listener to the input.
document
  .getElementById('commandInput')
  .addEventListener('input', updateSpellCheckResult);

// Create an object to store presets and their values
const presets = {
  empty: { input: '', prefix: '', suffix: '' },
  preset1: {
    input: `//alias "asciiscript" "ascii[%NUM]";\n\n//! Put your ASCII art between here:\n\n//!\n\n//! You can replace "." with the key you want to bind the ASCII art to.\n\n//bind "." "asciiscript";`,
    prefix: 'alias "ascii[%NUMALT]" "say ',
    suffix: '[%NUMIN]; alias asciiscript ascii[%NUM]";',
  },
  preset2: {
    input: `//alias +duckjump "+jump; +duck";\n//alias -duckjump "-jump; -duck";\n\n//bind "c" "+duckjump";`,
    prefix: '',
    suffix: '',
  },
  preset3: { input: `//bind e "+use; r_cleardecals";`, prefix: '', suffix: '' },
  preset4: { input: `//bind mwheeldown "+jump";\n//bind mwheelup "+jump";`, prefix: '', suffix: '' },
  preset5: { input: `//bind h "toggle cl_righthand 0 1";`, prefix: '', suffix: '' },
  preset6: { input: `//! WARNING: USE THIS AT YOUR OWN RISK!

// DE-SUBTICK BINDS

// MOVEMENT
alias "+dontjump" "+jump"
alias "-dontjump" "-jump"
bind "mwheeldown" "+dontjump"

alias "+dontjump" "+jump"
alias "-dontjump" "-jump"
bind "mwheelup" "+dontjump"

alias "_checkw" "-forward; alias checkw"
alias "+w" "+forward; alias checkw _checkw"
alias "-w" "checkw"
bind "w" "+w"

alias "_checks" "-back; alias checks"
alias "+s" "+back; alias checks _checks"
alias "-s" "checks"
bind "s" "+s"

alias "_checka" "-left; alias checka"
alias "+a" "+left; alias checka _checka"
alias "-a" "checka"
bind "a" "+a"

alias "_checkd" "-right; alias checkd"
alias "+d" "+right; alias checkd _checkd"
alias "-d" "checkd"
bind "d" "+d"

alias "_checkcrouch" "-duck; alias checkcrouch"
alias "+crouch" "+duck; alias checkcrouch _checkcrouch"
alias "-crouch" "checkcrouch"
bind "alt" "+crouch"

alias "_checkcrouch" "-duck; alias checkcrouch"
alias "+crouch" "+duck; alias checkcrouch _checkcrouch"
alias "-crouch" "checkcrouch"
bind "ctrl" "+crouch"

alias "_checkwalk" "-sprint; alias checkwalk"
alias "+walk" "+sprint; alias checkwalk _checkwalk"
alias "-walk" "checkwalk"
bind "shift" "+walk"

// SHOOTING
alias "_shooty" "-attack; alias shooty"

alias "+shooty" "+attack; alias shooty _shooty"
alias "-shooty" "shooty"
bind "MOUSE1" "+shooty"`, prefix: '', suffix: ''},
  preset7: { input: `// Check Michael Jackson Variables
alias "check_mj_forward_1" "forwardback 0 0 0"
alias "check_mj_back_1" "forwardback 0 0 0"
alias "check_mj_left_1" "rightleft 0 0 0"
alias "check_mj_right_1" rightleft 0 0 0"
alias "check_mj_forward_2" ""
alias "check_mj_back_2" ""
alias "check_mj_left_2" ""
alias "check_mj_right_2" ""
alias "check_mj_forward_3" "+forward"
alias "check_mj_back_3" "+back"
alias "check_mj_left_3" "+left"
alias "check_mj_right_3" "+right"
 
// Calculations?
alias "+mj_forward" "check_mj_forward_3; forwardback 0.5 0 0; alias check_mj_forward_1 forwardback 0.5 0 0; alias check_mj_forward_2 +forward"
alias "+mj_back" "check_mj_back_3; forwardback -0.5 0 0; alias check_mj_back_1 forwardback -0.5 0 0; alias check_mj_back_2 +back"
alias "+mj_left" "check_mj_left_3; rightleft -0.5 0 0; alias check_mj_left_1 rightleft -0.5 0 0; alias check_mj_left_2 +left"
alias "+mj_right" "check_mj_right_3; rightleft 0.5 0 0; alias check_mj_right_1 rightleft 0.5 0 0; alias check_mj_right_2 +right"
alias "-mj_forward" "-forward; check_mj_back_1; alias check_mj_forward_1 forwardback 0 0 0; alias check_mj_forward_2"
alias "-mj_back" "-back; check_mj_forward_1; alias check_mj_back_1 forwardback 0 0 0; alias check_mj_back_2"
alias "-mj_left" "-left; check_mj_right_1; alias check_mj_left_1 rightleft 0 0 0; alias check_mj_left_2"
alias "-mj_right" "-right; check_mj_left_1; alias check_mj_right_1 rightleft 0 0 0; alias check_mj_right_2"
alias "+michael_jackson" "-forward; -back; -left; -right; alias check_mj_forward_3; alias check_mj_back_3; alias check_mj_left_3; alias check_mj_right_3"
alias "-michael_jackson" "check_mj_forward_2; check_mj_back_2; check_mj_left_2; check_mj_right_2; alias check_mj_forward_3 +forward; alias check_mj_back_3 +back; alias check_mj_left_3 +left; alias check_mj_right_3 +right"

// Bind Michael Jackson Peak to WSAD + ALT modifier
bind "w" "+mj_forward"
bind "s" "+mj_back"
bind "a" "+mj_left"
bind "d" "+mj_right"
bind "mouse4" "+michael_jackson"
`}
};

// Add event listener to the dropdown to listen for changes
dropdown.addEventListener('change', function () {
  const selectedValue = dropdown.value;
  const { input, prefix, suffix } = presets[selectedValue];

  // Set the input, prefix, and suffix based on the selected value
  inputText.value = input;
  prefixText.value = prefix;
  suffixText.value = suffix;
});


function appendGeneratedCommandTextToParagraph() {
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
  navigator.clipboard
    .writeText(outputTextArea.value)
    .then(() => {
      console.log('Text copied to clipboard successfully.');
      copyTextAlert.innerHTML =
        'Text copied to clipboard successfully! Character size: ' +
        outputTextArea.value.length +
        '.';
      copyTextAlert.style.color = 'darkgreen';
    })
    .catch((err) => {
      console.error('Error copying text to clipboard: ', err);
      copyTextAlert.innerHTML = 'Error copying text to clipboard: ' + err;
      copyTextAlert.style.color = 'darkred';
    });
}

function copyCommandOutputValue() {
  // Select the text inside the inputText
  const copyTextAlert = document.getElementById('copyChecker');
  inputField.select();

  // Use the Clipboard API to copy the selected text to the clipboard
  navigator.clipboard
    .writeText(inputField.value)
    .then(() => {
      console.log('Text copied to clipboard successfully.');
      copyTextAlert.innerHTML =
        'Text copied to clipboard successfully! Character size: ' +
        inputField.value.length +
        '.';
      copyTextAlert.style.color = 'darkgreen';
    })
    .catch((err) => {
      console.error('Error copying text to clipboard: ', err);
      copyTextAlert.innerHTML = 'Error copying text to clipboard: ' + err;
      copyTextAlert.style.color = 'darkred';
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

  if (
    keyListener &&
    (preventKeys.includes(event.key) ||
      (event.ctrlKey && ['r', 'i', 'j', 'c'].includes(event.key.toLowerCase())))
  ) {
    event.preventDefault(); // Prevent the default behavior
  }

  if (keyListener) {
    const pressedKey = event.code;
    const keyName = keyNames[pressedKey];

    if (keyName) {
      console.log(keyName);
      inputField.value = inputField.value + keyName + ' ';
      keyListener = false;
      keyListenerButton.innerHTML = 'Listen for KeyButton(s)...';
      keyListenerButton.style.backgroundColor = 'rgba(50, 205, 50, .5)';
    }
  }
}

// Toggle keyListener
function toggleKeyListener() {
  keyListener = !keyListener;
  //console.log('keyListener is now:', keyListener);
  if (keyListener) {
    keyListenerButton.innerHTML = 'Listening...';
    keyListenerButton.style.backgroundColor = 'rgba(255, 195, 0, .5)';
  } else {
    keyListenerButton.innerHTML = 'Listen for KeyButton(s)...';
    keyListenerButton.style.backgroundColor = 'rgba(50, 205, 50, .5)';
  }
}

// Add event listener to the window for keydown event
window.addEventListener('keydown', handleKeyPress);

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
  if (
    fileNameInput.value.length > 0 &&
    !prohibitedChars.test(fileNameInput.value)
  ) {
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
