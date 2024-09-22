import express from 'express';
import { createOrUpdateEvents, getEvents } from '../controllers/eventsController.js';


const router = express.Router();

router.get('/', getEvents);
router.post('/', createOrUpdateEvents);

export default router;