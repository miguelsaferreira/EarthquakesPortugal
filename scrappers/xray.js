const mongoose = require('mongoose');
const Earthquake = require('./models/earthquake');
const request = require('request');
const querystring = require('querystring');
const Xray = require('x-ray');

const x = Xray();

let i = 1995; // start year
let j = 12; // start month

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

function requestEnded() {
  console.log('Finished Scrapping :) ');
  process.exit();
}

/**
 * Make a POST request to an hidden API and scrape data with X-Ray
 *
 */
function getdata() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  if (i === currentYear && j === 13) {
    requestEnded();
  } else {
    // Form to be sent
    const form = {
      year: i.toString(),
      month: j.toString() === 13 ? j.toString() - 1 : 12,
      day: '01',
    };

    const formData = querystring.stringify(form);
    const contentLength = formData.length;

    // Make HTTP Request
    request({
      headers: {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      uri: 'https://www.ipma.pt/pt/geofisica/sismologia/',
      body: formData,
      method: 'POST',
    }, (err, res, html) => {
      // console.dir(body);
      if (err) {
        console.log(err.toString());
        return;
      }

      if (res) {
        x(html, '#divID0 > table > tr', [{
          date: '.block90w',
          lat: 'td:nth-child(2)',
          lon: 'td:nth-child(3)',
          prof: 'td:nth-child(4)',
          mag: 'td:nth-child(5)',
          local: 'td:nth-child(6)',
          degree: 'td:nth-child(7)',
        }])((error, obj) => {
          // console.dir(obj);

          if (error) {
            console.log(error.toString());
          }

          for (let k = 0; k < obj.length; k++) {
            const result = {
              date: obj[k].date,
              lat: obj[k].lat.replace(',', '.'),
              lon: obj[k].lon.replace(',', '.'),
              prof: obj[k].prof == '-' ? null : obj[k].prof.replace(',', '.'),
              mag: obj[k].mag.replace(',', '.'),
              local: obj[k].local,
              degree: obj[k].degree,
            };

            console.log(result);

            upsertEarthquake(result);
          }

          if (j === 12) {
            if (i === currentYear && j === currentMonth) {
              j = 13;
            } else {
              i++; // increment year
              j = 1; // month is january
            }

          } else {
            j++;
          }
          /*
          * Call the next request inside the callback, so we are sure that
          * the next request is ran just after this request has ended.
          */
          getdata();
        });

      }
    });
  }

}

getdata();
