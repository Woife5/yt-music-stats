const fileSelector = document.getElementById('file-selector');
const chartSelector = document.getElementById('chart-selector');
const chartCtx = document.getElementById('chart').getContext('2d');

// Setup the file reader
const reader = new FileReader();
reader.onload = () => {
    data = JSON.parse(reader.result);

    switch (chartSelector.value) {
        case 'songs_per_month':
            displaySongsPerMonth(data);
            break;
        default:
            displaySongsPerMonth(data);
            break;
    }
};

// Initialize the data variable with null.
let data = null;
let chart = null;

// Add eventlistener to the file selector to always update the data when a new file is selected.
fileSelector.addEventListener('change', event => {
    const file = event.target.files[0];
    reader.readAsText(file);
});

function displaySongsPerMonth(data) {
    // Organize the data to be displayed.

    // Get only YT Music data
    let organizedData = data;
    organizedData = organizedData.filter(entry => entry.header === 'YouTube Music');

    let relevantData = {};
    organizedData.forEach(entry => {
        let key = entry.time.substring(0, 7);
        if (!relevantData[key]) {
            relevantData[key] = [];
        }

        // Just ignore the entry if the subtitles array is not set,
        // usually the video/music is no longer available when this happens.
        if (!entry.subtitles || !entry.subtitles[0] || !entry.subtitles[0].name) {
            return;
        }

        let artist = null;
        if (entry.subtitles[0].name.indexOf(' - Topic') === -1) {
            artist = entry.subtitles[0].name;
        } else {
            artist = entry.subtitles[0].name.substring(0, entry.subtitles[0].name.indexOf(' - Topic'));
        }

        let entryData = {
            title: entry.title.substring(8),
            artist: artist,
            time: entry.time,
        };

        relevantData[key].push(entryData);
    });

    chart = new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(relevantData).reverse(),
            datasets: [
                {
                    label: 'Songs played per month',
                    data: Object.values(relevantData)
                        .map(element => element.length)
                        .reverse(),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}
