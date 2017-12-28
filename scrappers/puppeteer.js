const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Earthquake = require('./models/earthquake');

/**
 * Updates an entry in DB if already exists, else will insert a new one.
 *
 * @param {any} earthquakeObj
 */
function upsertEarthquake(earthquakeObj) {
  const DB_URL = 'mongodb://localhost/earthquakes';

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(DB_URL);
  }

  const conditions = earthquakeObj;
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  Earthquake.findOneAndUpdate(conditions, earthquakeObj, options, (err, res) => {
    if (err) throw err;
    if (res) console.log(res);
  });
}

/**
 * Launches puppeteer, extracts data, selects the year, month and day
 * from dropdown and then clicks on the search button. Repeats this task
 * until arrive at December 1995 on the dropdown.
 *
 */
async function run() {
  try {
    const browser = await puppeteer.launch();

    /* const browser = await puppeteer.launch({
      headless: false,
    }); */

    const page = await browser.newPage();
    await page.goto('https://www.ipma.pt/pt/geofisica/sismologia/');

    // Selectors
    const LENGTH_QUAKES_LIST = '#divID0 > table > tbody > tr';
    const DATE_SELECTOR = '#divID0 > table > tbody > tr:nth-child(INDEX) > td.block90w';
    const INFO_SELECTOR = '#divID0 > table > tbody > tr:nth-child(INDEX) > td:nth-child(POS)';
    const YEAR_SELECTOR = '#year > option:nth-child(INDEX)';
    const MONTH_SELECTOR = '#month > option:nth-child(INDEX)';
    const DAY_SELECTOR = '#day > option:nth-child(INDEX)';
    const SEARCH_SELECTOR = '#RightCol_container > table > tbody > tr:nth-child(2) > td > input';

    const d = new Date();
    let currmonth = d.getMonth() + 1;

    // Starting dropdown indexes for year and month
    let yearIndex = 2;
    let monthIndex = currmonth;

    for (let i = currmonth; i >= 1; i -= 1) {
      // Get the length of earthquakes list for each page
      await page.waitForSelector(LENGTH_QUAKES_LIST);
      const listLength = await page.evaluate(sel =>
        document.querySelectorAll(sel).length, LENGTH_QUAKES_LIST);

      for (let j = 3; j <= listLength; j += 1) {
        const result = await page.evaluate((index, seldate, selinfo) => {
          const dateSelector = seldate.replace('INDEX', index);
          const latSelector = selinfo.replace('INDEX', index).replace('POS', 2);
          const lonSelector = selinfo.replace('INDEX', index).replace('POS', 3);
          const profSelector = selinfo.replace('INDEX', index).replace('POS', 4);
          const magSelector = selinfo.replace('INDEX', index).replace('POS', 5);
          const locSelector = selinfo.replace('INDEX', index).replace('POS', 6);
          const degSelector = selinfo.replace('INDEX', index).replace('POS', 7);

          const date = document.querySelector(dateSelector).innerHTML;
          const lat = document.querySelector(latSelector).innerHTML.replace(',', '.');
          const lon = document.querySelector(lonSelector).innerHTML.replace(',', '.');
          const prof = '-' ? null : document.querySelector(profSelector).innerHTML.replace(',', '.');
          const mag = document.querySelector(magSelector).innerHTML.replace(',', '.');
          const local = document.querySelector(locSelector).innerHTML;
          const degree = document.querySelector(degSelector).innerHTML;

          return {
            date,
            lat,
            lon,
            prof,
            mag,
            local,
            degree,
          };
        }, j, DATE_SELECTOR, INFO_SELECTOR);

        // run update/insert function
        upsertEarthquake(result);
      }

      // If current month index is january jump to previous year(next index) and update indexes
      if (monthIndex === 1) {
        currmonth = 12;
        i = currmonth + 1;
        yearIndex += 1;
        monthIndex = 13;
      }

      // Select Year from dropdown
      await page.evaluate(
        sel =>
          document.querySelector(sel).setAttribute('selected', 'true')
        , YEAR_SELECTOR.replace('INDEX', yearIndex),
      );

      // Select Month from dropdown
      await page.evaluate(
        sel =>
          document.querySelector(sel).setAttribute('selected', 'true')
        , MONTH_SELECTOR.replace('INDEX', monthIndex),
      );

      monthIndex -= 1;

      if (yearIndex === 24 && monthIndex === 11) {
        break;
      }

      // Select first day from dropdown
      await page.evaluate(
        sel =>
          document.querySelector(sel).setAttribute('selected', 'true')
        , DAY_SELECTOR.replace('INDEX', 2),
      );

      // Wait for page to be loaded and click on search button
      await page.waitForSelector(SEARCH_SELECTOR);
      const navresponse = page.waitForNavigation(['networkidle0', 'load', 'domcontentloaded']);
      await page.click(SEARCH_SELECTOR);

      // await for navigation promise after the click to ensure navigation event is caught
      await navresponse;
    }

    await browser.close();
    process.exit(); // force node.js process to close
  } catch (error) {
    console.log(error);
  }
}

run();
