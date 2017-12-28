import express from 'express';
import earthquakeRoutes from './earthquake.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount earthquake routes at /earthquakes
router.use('/earthquakes', earthquakeRoutes);

export default router;
