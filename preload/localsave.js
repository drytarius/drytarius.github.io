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
    console.log(
      `Loaded data ${localStorageKey}: \n\nSaved Data Content Name:\n${savedData.contentName}\n\nSaved Data Content:\n${savedData.content}\n\nSaved on ${savedData.timestamp}.\n\nTo see the content of the data, type "localSaveInfo" in the console.`
    );
    consoleAliasMessage = `Loaded data: ${localStorageKey}, Content Name: ${savedData.contentName}, Content: ${savedData.content}, Saved on: ${savedData.timestamp}.`;
  } catch (err) {
    console.error('Error displaying the data:', err);
  }
} else {
  createPopup();
}

function createPopup() {
  // Create the overlay div
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'welcomePopup';

  // Create the popup div
  const popup = document.createElement('div');
  popup.className = 'popup';

  // Create the close button
  const closeButton = document.createElement('a');
  closeButton.className = 'close';
  closeButton.textContent = '×';

  // Create the h2 element
  const h2 = document.createElement('h2');
  h2.textContent = 'Welcome to "CS2 Config Maker"!';

  // Create the content div
  const content = document.createElement('div');
  content.className = 'content';
  content.innerHTML =
    'Here, you can create your very own CS2 configs.<br/>Make sure to check out the info box to get a heads up!<br/><br/>WARN!!: SOME OF THE COMMANDS MIGHT BE OUTDATED. IF YOU ENCOUNTER ANY, PLEASE CONSIDER REPORTING THEM.<br/><br/>https://github.com/drytarius';

  const image = document.createElement('img');
  image.src = './content/images/cs2.jpg';
  image.style.marginTop = '25px';
  image.style.width = '100%';
  image.style.height = '100%';
  image.style.borderRadius = '4px';

  // Append elements to the popup
  popup.appendChild(h2);
  popup.appendChild(closeButton);
  popup.appendChild(content);
  popup.appendChild(image);

  // Append popup to overlay
  overlay.appendChild(popup);

  // Append overlay to the body
  document.body.appendChild(overlay);

  // Add event listener to close the popup
  document.addEventListener('click', (e) => {
    const closeButton = document.querySelector('.overlay .close');
    if (e.target == closeButton) {
      const overlay = document.getElementById('welcomePopup');
      if (overlay) {
        document.body.removeChild(overlay);
      }
    }
  });
}

// Function to show the success message and fade it out after a delay
function showSaveMessage() {
  const displaySavingStatus = document.getElementById('saveStatus');
  displaySavingStatus.innerHTML = 'Saved successfully!';

  // Show the saveStatus
  displaySavingStatus.classList.remove('hidden');

  // Turn the color into darkgreen
  displaySavingStatus.style.color = 'darkgreen';

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
  try {
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
  console.log(selectedFile.name);

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
