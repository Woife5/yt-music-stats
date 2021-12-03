# YoutTube Music Stats

This little project visualizes your YouTube Music listening history.

The project is acessible [here](https://woife5.github.io/yt-music-stats/).

Currently this dashboard only supports displaying the amount of songs played per month.

## Usage

Download your data (see [Obtaining your data](#obtaining-your-data)) and then open the [Website](https://woife5.github.io/yt-music-stats/). Click "Choose a file" and select the `watch-history.json` file located in `<path-to>/Takeout/YouTube and YouTube Music/history/watch-history.json`

## Export to CSV

You can export your entire YouTube Music history to a CSV file. This file can be imported to Excel or other spreadsheet software. Within this software you can create more detailed statistics. If you want to have really detailed statistics, you can import your data to [Google Sheets](https://docs.google.com/spreadsheets/u/0/) and then use [Google Datastudio](https://datastudio.google.com/) to create a report.

## Obtaining your data

To get your data, first visit [Google Takeout](https://takeout.google.com). Click the "Deselect all" button at the top and then scroll to the very bottom and only select YouTube data.

![Select only YouTube data](https://i.ibb.co/kgSMbfR/choose-only-youtube.png)

Make sure you configure the following as well by clicking the two buttons directly underneath YouTube:

-   Change history format to `JSON`
-   Select only the history to be downloaded

### Choose JSON format

Click "Multiple formats" and then select "JSON" next to "history".
![Choose JSON format](https://i.ibb.co/1GbtW9v/choose-json-format.png)

### Select only history

Click "All YouTube data is included", then "Deselect all" and then only select "history"
![Select only watch history](https://i.ibb.co/5nkB6dV/choose-only-history.png)
