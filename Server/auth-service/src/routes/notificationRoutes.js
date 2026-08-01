import express from 'express';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  createNotification, 
  registerPushToken, 
  updateNotificationPreferences 
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.post('/push-token', registerPushToken);
router.put('/preferences', updateNotificationPreferences);

export default router;
