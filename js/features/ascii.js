// Image to ascii
const imageInput = document.getElementById('image-input');
const aspectSizeSlider = document.getElementById('aspect-size-slider');
const aspectRatioLabel = document.getElementById('aspect-ratio');
const aspectSizeMultiplierInput = document.getElementById(
  'aspect-size-multiplier'
);
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

function changeASCIIFontSize() {
  asciiArtContainer.style.fontSize = asciiFontSizeInput.value + 'px';

  //console.log(asciiFontSizeInput.value);
}

changeASCIIFontSize();

const settings = {
  last_canvas: null,
  last_dithering: null,
  last_source: '',

  width: 62,
  greyscale_mode: 'luminance',
  inverted: false,
  dithering: false,
  monospace: false,
};

dropdownGreyscale.addEventListener('change', function () {
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
});

dropdownASCIIBackground.addEventListener('change', function () {
  const dropdownASCIIBackground = document.getElementById(
    'dropdownASCIIBackground'
  );
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
});

function handleImageSelect() {
  const file = imageInput.files[0];
  const displayUploadStatus = document.getElementById('uploadStatus');

  console.log(file)
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const image = new Image();
    image.onload = function () {
      handleImageLoad(image);

      // Handle image loading errors
      displayUploadStatus.innerHTML = 'File loaded successfully.';
      // Turn the color into darkgreen
      displayUploadStatus.style.color = 'darkgreen';
    };
    image.onerror = function () {
      // Handle image loading errors
      displayUploadStatus.innerHTML =
        'Error loading the file. Supported file types: .jpg, .jpeg, .png, .gif, .bmp, .webp, .svg.';
      // Turn the color into darkred
      displayUploadStatus.style.color = 'darkred';
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

function settingsCheckboxChecker(aspectSize, aspectSizeMultiplier) {
  if (invertedCheckbox.checked) {
    settings.inverted = true;
  } else {
    settings.inverted = false;
  }

  if (ditheringCheckbox.checked) {
    settings.dithering = true;
  } else {
    settings.dithering = false;
  }

  if (monospaceCheckbox.checked) {
    settings.monospace = true;
  } else {
    settings.monospace = false;
  }

  settings.width = aspectSize * aspectSizeMultiplier;
}

function handleAspectSizeChangeBefore() {
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
  image.onload = function () {
    createAsciiCanvas(image);
  };
  image.onerror = function () {
    // Handle image loading errors
    console.error('Error: Unable to load the image.');
  };
  image.src = imageSrc;
}

function createAsciiCanvas(image) {
  const canvas = document.createElement('CANVAS');

  let width = image.width;
  let height = image.height;
  if (image.width != settings.width * 2) {
    width = settings.width * 2;
    height = (width * image.height) / image.width;
  }

  //nearest multiple
  canvas.width = width - (width % 2);
  canvas.height = height - (height % 4);

  ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF'; //get rid of alpha
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  canvasToText(canvas, image);
  //console.log('created canvas?')
}

function toGreyscale(r, g, b) {
  switch (settings.greyscale_mode) {
    case 'luminance':
      return 0.22 * r + 0.72 * g + 0.06 * b;

    case 'lightness':
      return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;

    case 'average':
      return (r + g + b) / 3;

    case 'value':
      return Math.max(r, g, b);

    default:
  }
}

function dithering(canvas) {
  this.canvas = canvas;
  this.image_data = new Uint8Array(
    canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
  ); //clone

  let oldpixel;
  let newpixel;
  let quant_error;
  let err_red, err_green, err_blue;

  const _getPixel = (x, y) => {
    const index = (x + y * canvas.width) * 4;
    return [
      this.image_data[index + 0],
      this.image_data[index + 1],
      this.image_data[index + 2],
    ];
  };

  const _setPixel = (x, y, colour) => {
    const index = (x + y * canvas.width) * 4;
    this.image_data[index + 0] = Math.floor(colour[0] + 0.5);
    this.image_data[index + 1] = Math.floor(colour[1] + 0.5);
    this.image_data[index + 2] = Math.floor(colour[2] + 0.5);
    this.image_data[index + 3] = 255;
  };

  const _closestPalleteColour = (pixel) => {
    return 0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2] > 128
      ? [255, 255, 255]
      : [0, 0, 0];
  };

  const _colourDifference = (one, two) => {
    return [one[0] - two[0], one[1] - two[1], one[2] - two[2]];
  };

  const _colourAddError = (x, y, err_red, err_green, err_blue) => {
    const clip = (x) => (x < 0 ? 0 : x > 255 ? 255 : x);
    const index = (x + y * canvas.width) * 4;
    this.image_data[index + 0] = clip(this.image_data[index + 0] + err_red);
    this.image_data[index + 1] = clip(this.image_data[index + 1] + err_green);
    this.image_data[index + 2] = clip(this.image_data[index + 2] + err_blue);
    this.image_data[index + 3] = 255;
  };

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      oldpixel = _getPixel(x, y);
      newpixel = _closestPalleteColour(oldpixel);
      _setPixel(x, y, newpixel);
      quant_error = _colourDifference(oldpixel, newpixel);

      err_red = quant_error[0];
      err_green = quant_error[1];
      err_blue = quant_error[2];

      if (x + 1 < canvas.width)
        _colourAddError(
          x + 1,
          y,
          (7 / 16) * err_red,
          (7 / 16) * err_green,
          (7 / 16) * err_blue
        );
      if (x - 1 > 0 && y + 1 < canvas.height)
        _colourAddError(
          x - 1,
          y + 1,
          (3 / 16) * err_red,
          (3 / 16) * err_green,
          (3 / 16) * err_blue
        );
      if (y + 1 < canvas.height)
        _colourAddError(
          x,
          y + 1,
          (5 / 16) * err_red,
          (5 / 16) * err_green,
          (5 / 16) * err_blue
        );
      if (x + 1 < canvas.width)
        _colourAddError(
          x + 1,
          y + 1,
          (1 / 16) * err_red,
          (1 / 16) * err_green,
          (1 / 16) * err_blue
        );
    }
  }
}

function pixelsToCharacter(pixels_lo_hi) {
  //expects an array of 8 bools
  const shift_values = [0, 1, 2, 6, 3, 4, 5, 7]; //correspond to dots in braille chars compared to the given array
  let codepoint_offset = 0;
  for (const i in pixels_lo_hi) {
    codepoint_offset += +pixels_lo_hi[i] << shift_values[i];
  }

  if (codepoint_offset == 0 && settings.monospace == false) {
    //pixels were all blank
    codepoint_offset = 4; //0x2800 is a blank braille char, 0x2804 is a single dot
  }
  return String.fromCharCode(0x2800 + codepoint_offset);
}

function canvasToText(canvas, image) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  let image_data = [];
  if (settings.dithering) {
    if (
      settings.last_dithering == null ||
      settings.last_dithering.canvas !== canvas
    ) {
      settings.last_dithering = new dithering(canvas);
    }
    image_data = settings.last_dithering.image_data;
  } else {
    image_data = new Uint8Array(
      ctx.getImageData(0, 0, width, height).data.buffer
    );
  }

  let output = '';

  for (let imgy = 0; imgy < height; imgy += 4) {
    for (let imgx = 0; imgx < width; imgx += 2) {
      const braille_info = [0, 0, 0, 0, 0, 0, 0, 0];
      let dot_index = 0;
      for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 4; y++) {
          const index = (imgx + x + width * (imgy + y)) * 4;
          const pixel_data = image_data.slice(index, index + 4); //ctx.getImageData(imgx+x,imgy+y,1,1).data
          if (pixel_data[3] >= 128) {
            //account for alpha
            const grey = toGreyscale(
              pixel_data[0],
              pixel_data[1],
              pixel_data[2]
            );
            if (settings.inverted) {
              if (grey >= 128) braille_info[dot_index] = 1;
            } else {
              if (grey <= 128) braille_info[dot_index] = 1;
            }
          }
          dot_index++;
        }
      }
      output += pixelsToCharacter(braille_info);
    }
    output += '\n';
  }

  //console.log(output)
  asciiArtContainer.textContent = output;
  asciiArtContainer.setAttribute('data-image-src', image.src);

  if (asciiArtContainer.textContent.length == 0) {
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
  tempTextArea.classList.add('no-display');

  // Set the value of the textarea to the text content of the div (asciiArtContainer)
  tempTextArea.value = asciiArtContainer.textContent;

  // Append the textarea to the document (it doesn't have to be visible)
  document.body.appendChild(tempTextArea);

  // Select the text inside the textarea
  tempTextArea.select();

  // Use the Clipboard API to copy the selected text to the clipboard
  navigator.clipboard
    .writeText(tempTextArea.value)
    .then(() => {
      console.log('Text copied to clipboard successfully.');
      copyTextAlert.innerHTML =
        'Text copied to clipboard successfully! Character size: ' +
        tempTextArea.value.length +
        '.';
      copyTextAlert.style.color = 'darkgreen';
    })
    .catch((err) => {
      console.error('Error copying text to clipboard: ', err);
      copyTextAlert.innerHTML = 'Error copying text to clipboard: ' + err;
      copyTextAlert.style.color = 'darkred';
    })
    .finally(() => {
      // Remove the temporary textarea from the document
      document.body.removeChild(tempTextArea);
    });
}
