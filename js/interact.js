const workspace = document.getElementById('workspace');
let isWorkspaceDragging = false;
let initialX, initialY;
let currentX = 103;
let currentY = 200;
let currentScale = 0.847332; // Initial scale factor

const header = document.getElementById('header');
const scrollThreshold = 100; // Adjust the threshold as needed

workspace.style.transformOrigin = 'top left'; // Set the transform origin to the top-left corner

workspace.addEventListener('mousedown', (e) => {
  // Check if the clicked element should be exempted
  if (!shouldExemptElement(e.target)) {
    isWorkspaceDragging = true;
    initialX = e.clientX;
    initialY = e.clientY;
    workspace.style.transition = 'none'; // Disable transition during drag
  }
});

workspace.addEventListener('mousemove', (e) => {
  if (!isWorkspaceDragging) return;
  const deltaX = e.clientX - initialX;
  const deltaY = e.clientY - initialY;
  currentX += deltaX;
  currentY += deltaY;
  workspace.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
  initialX = e.clientX;
  initialY = e.clientY;
});

workspace.addEventListener('mouseup', () => {
  isWorkspaceDragging = false;
  workspace.style.transition = ''; // Re-enable transition after drag
});

// Zoom in and out using the scroll wheel on the workspace
workspace.addEventListener('wheel', (e) => {
  //e.preventDefault();

  // Check if the clicked element should be exempted
  if (!shouldExemptElement(e.target)) {
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Determine zoom direction (scroll down for zoom out, scroll up for zoom in)
    currentScale *= zoomFactor;
    workspace.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
  }
});

// Handle zooming when scrolling and dragging from the body
document.body.addEventListener('wheel', (e) => {
  //e.preventDefault();

  // Check if the clicked element should be exempted
  if (!shouldExemptElement(e.target)) {
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Determine zoom direction (scroll down for zoom out, scroll up for zoom in)
    currentScale *= zoomFactor;
    workspace.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
  }
});

document.body.addEventListener('mousedown', (e) => {
  // Check if the clicked element should be exempted
  if (!shouldExemptElement(e.target)) {
    isWorkspaceDragging = true;
    initialX = e.clientX;
    initialY = e.clientY;
    workspace.style.transition = 'none'; // Disable transition during drag
  }
});

document.body.addEventListener('mousemove', (e) => {
  if (!isWorkspaceDragging) return;
  const deltaX = e.clientX - initialX;
  const deltaY = e.clientY - initialY;
  currentX += deltaX;
  currentY += deltaY;
  workspace.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
  initialX = e.clientX;
  initialY = e.clientY;
});

document.body.addEventListener('mouseup', () => {
  isWorkspaceDragging = false;
  workspace.style.transition = ''; // Re-enable transition after drag
});

// Function to check if an element should be exempted from workspace dragging based on specific conditions
function shouldExemptElement(element) {
  // Check if the element has the class 'exempted'
  if (element.classList.contains('exempted')) {
    return false; // Allow interaction with elements that have the class 'exempted'
  }

  return true; // Exempt elements that do not have the class 'exempted'
}

window.addEventListener('load', (event) => {
  workspace.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
  workspace.style.opacity = 1;
});

// Header opacity fixing

const thresholdY = 170;
const thresholdScale = 0.95;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const mainContent = document.getElementById('mainContent');
  const mainContentScrollY = mainContent.scrollTop;

  if (scrollY > scrollThreshold || mainContentScrollY > scrollThreshold) {
    const opacity =
      1 - (Math.max(scrollY, mainContentScrollY) - scrollThreshold) / 100;
    header.style.opacity = opacity < 0 ? 0 : opacity; // Opacity should not go below 0
  } else {
    header.style.opacity = 1;
  }
});

// Event listener for workspace resizing
//workspace.addEventListener('resize', () => {
//  console.log(currentY, thresholdY)
//  if (currentY < thresholdY) {
//    header.style.opacity = 0;
//  } else {
//    header.style.opacity = 1;
//  }
//});

// Event listener for workspace moving
window.addEventListener('mousemove', () => {
  //console.log(currentY, thresholdY, currentScale, thresholdScale)
  if (currentY < thresholdY || currentScale > thresholdScale) {
    header.style.opacity = 0;
  } else {
    header.style.opacity = 1;
  }
});

// Event listener for workspace rescaling
window.addEventListener('wheel', () => {
  //console.log(currentY, thresholdY, currentScale, thresholdScale)
  if (currentY < thresholdY || currentScale > thresholdScale) {
    header.style.opacity = 0;
  } else {
    header.style.opacity = 1;
  }
});















// Drag && Drop

const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    imageInput.files = files;
    handleImageSelect();
  }
});

dropZone.addEventListener('click', () => {
  imageInput.click();
});

imageInput.addEventListener('change', handleImageSelect);