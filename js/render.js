// For CSS/HTML

const visibilitySettings = {
  hideSize: '25px',
  showSize: '80vh',
  hideOpacity: '.5',
  showOpacity: '1',
};

const contentVisibility = {
  autofillSuggestions: true,
  infoContent: false,
  mainContent: false,
  asciiContent: false,
};

function toggleVisibility(section, toggleButton, wrap, content) {
  const contentID = content.id.toString();
  const isSectionVisible = contentVisibility[contentID];

  wrap.classList.add('height-transition');

  //console.log(isSectionVisible)

  if (isSectionVisible) {
    content.style.backgroundColor = 'none';
    toggleButton.innerHTML = '(▼)';
    contentVisibility[contentID] = false;
  } else {
    content.style.display = 'block';
    toggleButton.innerHTML = '(▲)';
    contentVisibility[contentID] = true;
  }

  wrap.style.height = isSectionVisible
    ? visibilitySettings.hideSize
    : visibilitySettings.showSize;
  wrap.style.opacity = isSectionVisible
    ? visibilitySettings.hideOpacity
    : visibilitySettings.showOpacity;

  wrap.addEventListener('transitionend', () => {
    wrap.classList.remove('height-transition');
  });
}

const sections = [
  {
    toggleButton: toggleSuggestionsButton,
    wrap: floatingDiv,
    content: suggestionsContainer,
  },
  {
    toggleButton: infoToggleButton,
    wrap: infoWrap,
    content: infoBox,
  },
  {
    toggleButton: mainToggleButton,
    wrap: mainWrap,
    content: mainBox,
  },
  {
    toggleButton: asciiToggleButton,
    wrap: asciiWrap,
    content: asciiBox,
  },
];

sections.forEach((section) => {
  section.toggleButton.addEventListener('click', () => {
    toggleVisibility(
      section,
      section.toggleButton,
      section.wrap,
      section.content
    );
  });
});

// Initial visibility state
sections.forEach((section) => {
  toggleVisibility(
    section,
    section.toggleButton,
    section.wrap,
    section.content
  );
});

// Check the width of the screen
const screenWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
const mobileScreenWidthThreshold = 768; // Adjust this value based on your design's breakpoint

if (screenWidth < mobileScreenWidthThreshold) {
  console.log('Website loaded on a mobile device.');
  console.log('No actions are taken.');
  console.log(
    "Hey, hey! i'm a wazy devewopew, awnd my website isn't wesponsive!"
  );
  currentScale = 1;
  currentX = 0;
  currentY = 0;

  lockInteraction = true;
  externalTransform();
} else {
  console.log('Website not loaded on a mobile device.');
  console.log('No actions are taken.');
}

window.addEventListener('resize', () => {
  if (window.innerWidth < mobileScreenWidthThreshold) {
    currentScale = 1;
    currentX = 0;
    currentY = 0;
  
    lockInteraction = true;
    externalTransform();
  } else {
    lockInteraction = false;
  }
});

//For the sake of it, I'm not going to use this function.
//But if I see a single person complaining that the website isn't responsive
//because they can't f*cking load the website on their Steam Deck or something,
//I will go crazy... please I don't want to spend another week making this thing responsive.

//function excuseMaker(){
//  let randomNumber = Math.floor(Math.random() * 1000) + 1;
//  if(randomNumber == 621){
//    console.log('Responsive? I was going to be responsive once. They locked me in a responsive website. A small website! A small website with big divs, and divs make me crazy.')
//  } else {
//    console.log('Not passed.')
//  }
//}
//
//excuseMaker();

// FUN STUFF
// Toggle Themes

//const toggleThemes = document.getElementById('toggleTheme');

//let isChanged = false;

//toggleThemes.addEventListener('click', function () {
//  const body = document.body;
//  const textareas = document.getElementsByTagName('textarea');
//  const rootElement = document.documentElement;
//
//  if (isChanged) {
//    //console.log('off')
//    body.classList.remove('gradient2');
//    body.classList.add('gradient1');
//
//    rootElement.style.setProperty('--default_text_color', 'black');
//    rootElement.style.setProperty(
//      '--default_suggestion_info_text_color',
//      'black'
//    );
//    rootElement.style.setProperty('--default_emphasize_color', 'lightgray');
//    rootElement.style.setProperty('--default_header_color', 'black');
//
//    isChanged = false;
//  } else {
//    //console.log('on')
//    body.classList.remove('gradient1');
//    body.classList.add('gradient2');
//
//    rootElement.style.setProperty('--default_text_color', 'white');
//    rootElement.style.setProperty(
//      '--default_suggestion_info_text_color',
//      'black'
//    );
//    rootElement.style.setProperty(
//      '--default_emphasize_color',
//      'var(--e6_blue)'
//    );
//    rootElement.style.setProperty('--default_header_color', 'var(--e6_yellow)');
//
//    for (const textarea of textareas) {
//      textarea.style.backgroundColor = 'none';
//    }
//    isChanged = true;
//  }
//});

const iLikeBoys = document.getElementById('forTheFurInYou');

iLikeBoys.addEventListener('click', function() {
  console.log('%c*meow*\n\n-dt123', 'background-color: blue; color: #FFC0CB');
})