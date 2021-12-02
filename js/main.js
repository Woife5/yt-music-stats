const fileSelector = document.getElementById('file-selector');

// Setup the file reader
const reader = new FileReader();
reader.onload = () => {
    data = JSON.parse(reader.result);
    console.log(data);
};

// Initialize the data variable with null.
let data = null;

// Add eventlistener to the file selector to always update the data when a new file is selected.
fileSelector.addEventListener('change', event => {
    const file = event.target.files[0];
    reader.readAsText(file);
});
