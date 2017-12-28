import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Earthquake Schema
 */
const EarthquakeSchema = new mongoose.Schema({
  date: Date,
  lat: Number,
  lon: Number,
  prof: Number,
  mag: Number,
  local: String,
  degree: String,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
EarthquakeSchema.method({
});

/**
 * Statics
 */
EarthquakeSchema.statics = {
  /**
   * Get earthquake
   * @param {ObjectId} id - The objectId of earthquake.
   * @returns {Promise<Earthquake, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((earthquake) => {
        if (earthquake) {
          return earthquake;
        }
        const err = new APIError('No such earthquake exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  
  listByDate(d) {
    const date = new Date(d);
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1); // first day of month
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0); // last day on month

    return this.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort('-date')
      .exec()
      .then((earthquake) => {
        if (earthquake) {
          return earthquake;
        }
        const err = new APIError('No such earthquake date interval exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List earthquakes in descending order of 'date' timestamp.
   * @param {number} skip - Number of earthquakes to be skipped.
   * @param {number} limit - Limit number of earthquakes to be returned.
   * @returns {Promise<Earthquake[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ date: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

/**
 * @typedef Earthquake
 */
export default mongoose.model('Earthquake', EarthquakeSchema);
