# Earthquakes Portugal 💥

This app displays earthquakes in Portugal including Madeira, Açores and near coast Country since December 1995 untill the month of the current Year.

## Screenshots

| ![Scraping](https://github.com/miguelsaferreira/earthquakesPortugal/blob/master/mean/src/assets/img/scraping.gif)  | ![Screenshot](https://github.com/miguelsaferreira/earthquakesPortugal/blob/master/mean/src/assets/img/screenshot.png) |
|-|-|

The project  is divided in two parts:
* 1st: A scrapper that will get data for a specific date interval from [IPMA.pt](https://www.ipma.pt/pt/geofisica/sismologia/) and save it to a Mongo Database. I built two scrappers for practice purposes one using Puppeteer and other using X-Ray, they get the same results but work in different ways. Puppeteer selects date from the dropdown, then extracts data multiple times from the DOM and saves to Mongo DB (Takes ~14min to extract 3.4Mb data). X-Ray is making multiple requests to an hidden/unnoficial API, parsing the HTML result and saving to Mongo DB. (Takes ~10min to extract the same 3.4Mb data ).
* 2nd: MEAN single app with an API and Angular Google Maps Components integration that interacts with the data gathered by the selected scrapper. (TODO: cron job to execute X-Ray for the current month).


## Getting started 
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes

### Prerequisites

* You will need to have Node Js, Angular and Mongo DB Pre-Installed on your machine.
*  Google Maps API Key


### Installing

```
Run npm install on both mean and scrappers folder to install the dependencies in the local node_modules folder
```

## Development server
* Run `sudo mongod` to start mongo server. 
* Run `mongo` to start a new mongo instance.
* To execute a scrapper go to scrappers folder and run `node xray.js` (~10min) or `node puppeteer.js` (~14min).
* To start MEAN single app go to mean folder and run `npm start`. Default browser will start on `http://localhost:3000/`. The app will automatically reload if you change any of the source files.



## API
* /api/date/:date - Get earthquakes by Date (Lists earthquakes for selected month of a year).
* /api/earthquakeId - Get earthquake by ID.


## TODOS
* Cron Job to execute X-Ray for the current month of the year at least 3 times per day.
* Remove unused depedencies from the default MEAN boilerplate.

## Built with
* [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Chrome Headless  Browser for Web Scrapping
* [X-Ray](https://github.com/matthewmueller/x-ray) - Web scrapper
* [MEAN](https://github.com/linnovate/mean) - MEAN stack boilerplate
* [AGM](https://github.com/SebastianM/angular-google-maps) - Angular 2+ Google Maps Components
* [Bulmaswatch](https://github.com/jenil/bulmaswatch) - Bulma free themes


## Author
Miguel Ferreira [@miguelsaferreira](https://github.com/miguelsaferreira)
