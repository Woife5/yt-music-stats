const fileSelector = document.getElementById('file-selector');
const chartSelector = document.getElementById('chart-selector');
const exportButton = document.getElementById('export-button');
const chartCtx = document.getElementById('chart').getContext('2d');

// Setup the file reader
const reader = new FileReader();
reader.onload = () => {
    data = JSON.parse(reader.result);

    updateGraph(data);
};

// Initialize the data variable with null.
let data = null;
let chart = null;

// Add eventlistener to the file selector to always update the data when a new file is selected.
fileSelector.addEventListener('change', event => {
    const file = event.target.files[0];
    reader.readAsText(file);
});

chartSelector.addEventListener('change', event => {
    updateGraph(data);
});

exportButton.addEventListener('click', () => {
    let relevantData = getOnlyYTMusicData(data);

    let csvData = 'Title;Artist;Time\n';
    relevantData.forEach(entry => {
        let entryData = getRelevantData(entry);
        if (!entryData) return;
        csvData += `${entryData.title};${entryData.artist};${entryData.time}\n`;
    });

    let link = document.createElement('a');
    link.download = 'ytmusic-watch-history.csv';
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
    link.click();
});

function updateGraph(data) {
    switch (chartSelector.value) {
        case 'songs_per_month':
            displaySongsPerMonth(data);
            break;
        case 'top_artists':
            displayTopArtists(data);
            break;
        case 'top_songs':
            displayTopSongs(data);
            break;
        default:
            displaySongsPerMonth(data);
            break;
    }
}

/**
 * Displays the top 25 songs by plays within the last year.
 * @param {watch-history.json} data YouTube watch history data
 */
function displayTopSongs(data) {
    let relevantData = getOnlyYTMusicData(data);

    let organizedData = [];
    relevantData.forEach(entry => {
        let entryData = getRelevantData(entry);

        if (entryData) {
            for (let i = 0; i < organizedData.length; i++) {
                if (organizedData[i].name === entryData.title) {
                    organizedData[i].plays++;
                    return;
                }
            }

            organizedData.push({
                name: entryData.title,
                plays: 1,
            });
        }
    });

    organizedData.sort((a, b) => b.plays - a.plays);

    // Only get the Top 25 artists
    organizedData = organizedData.slice(0, 25);

    createChart(
        organizedData.map(element => element.name),
        organizedData.map(element => element.plays)
    );
}

/**
 * Displays the number of times you have listened to a specific artist within the last year.
 * @param {watch-history.json} data YouTube watch history data
 */
function displaySongsPerMonth(data) {
    let relevantData = getOnlyYTMusicData(data);

    let organizedData = {};
    relevantData.forEach(entry => {
        let entryData = getRelevantData(entry);

        if (entryData) {
            let key = entryData.time.substring(0, 7);

            if (!organizedData[key]) {
                organizedData[key] = [];
            }
            organizedData[key].push(entryData);
        }
    });

    createChart(
        Object.keys(organizedData).reverse(),
        Object.values(organizedData)
            .map(element => element.length)
            .reverse()
    );
}

/**
 * Displays the number of songs played per month.
 * @param {watch-history.json} data YouTube watch history data
 */
function displayTopArtists(data) {
    // Organize the data to be displayed.

    // Get only YT Music data
    let relevantData = getOnlyYTMusicData(data);

    let organizedData = [];
    relevantData.forEach(entry => {
        let entryData = getRelevantData(entry);

        if (entryData) {
            for (let i = 0; i < organizedData.length; i++) {
                if (organizedData[i].name === entryData.artist) {
                    organizedData[i].plays++;
                    return;
                }
            }

            organizedData.push({
                name: entryData.artist,
                plays: 1,
            });
        }
    });

    organizedData.sort((a, b) => b.plays - a.plays);

    // Only get the Top 25 artists
    organizedData = organizedData.slice(0, 25);

    createChart(
        organizedData.map(element => element.name),
        organizedData.map(element => element.plays)
    );
}

function createChart(labels, data) {
    if (chart) {
        chart.destroy();
        chart = null;
    }

    chart = new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Plays per artist',
                    data: data,
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

function getRelevantData(entry) {
    // Just ignore the entry if the subtitles array is not set,
    // usually the video/music is no longer available when this happens.
    if (!entry.subtitles || !entry.subtitles[0] || !entry.subtitles[0].name) {
        return null;
    }

    let artist = null;
    if (entry.subtitles[0].name.indexOf(' - Topic') === -1) {
        artist = entry.subtitles[0].name;
    } else {
        artist = entry.subtitles[0].name.substring(0, entry.subtitles[0].name.indexOf(' - Topic'));
    }

    return {
        title: entry.title.substring(8),
        artist: artist,
        time: entry.time,
    };
}

function getOnlyYTMusicData(data) {
    return data.filter(entry => entry.header === 'YouTube Music');
}
