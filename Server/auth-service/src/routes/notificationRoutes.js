import express from 'express';
import { getNotifications, markAsRead, createNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.put('/:id/read', markAsRead);

export default router;
