import Earthquake from '../models/earthquake.model';

/**
 * Load earthquake and append to req.
 */
function load(req, res, next, id) {
  Earthquake.get(id)
    .then((earthquake) => {
      req.earthquake = earthquake; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Load earthquake and append to req.
 */
function loadDate(req, res, next, date) {
  Earthquake.listByDate(date)
    .then((earthquake) => {
      req.earthquake = earthquake; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get earthquake
 * @returns {Earthquake}
 */
function get(req, res) {
  return res.json(req.earthquake);
}

/**
 * Get earthquake list.
 * @property {number} req.query.skip - Number of earthquakes to be skipped.
 * @property {number} req.query.limit - Limit number of earthquakes to be returned.
 * @returns {Earthquake[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Earthquake.list({ limit, skip })
    .then(earthquakes => res.json(earthquakes))
    .catch(e => next(e));
}

export default { load, loadDate, get, list };
