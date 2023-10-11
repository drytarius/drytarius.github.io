// Use fetch to load data from data.json
fetch('./preload/versioninfo.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    // Stringify the "versions" array and log it as a string
    const version = JSON.stringify(data.version);
    const name = JSON.stringify(data.name);
    const author = JSON.stringify(data.author);
    console.warn(`${name}, ${version} by ${author}`);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
