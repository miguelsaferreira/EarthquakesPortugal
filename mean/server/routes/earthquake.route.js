import express from 'express';
import earthquakeCtrl from '../controllers/earthquake.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/earthquakes - Get list of earthquakes */
  .get(earthquakeCtrl.list)

router.route('/:earthquakeId')
  /** GET /api/earthquakes/:earthquakeId - Get earthquake */
  .get(earthquakeCtrl.get)

router.route('/date/:date')
  /** GET /api/earthquakes/date/:date - List earthquakes for specific month by date  */
  .get(earthquakeCtrl.get)

/** Load earthquake when API with earthquakeId route parameter is hit */
router.param('earthquakeId', earthquakeCtrl.load);
router.param('date', earthquakeCtrl.loadDate);

export default router;
