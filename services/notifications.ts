import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import StorageService from './storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private checkInNotificationId: string | null = null;

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }
    
    return true;
  }

  /**
   * Schedule daily tip notification
   */
  async scheduleDailyTipNotification(hour: number = 9): Promise<void> {
    await this.cancelDailyTipNotification();
    
    const trigger = {
      hour,
      minute: 0,
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your Daily Experiment 🧪",
        body: "Ready to try something new today? Check out your daily tip!",
        data: { type: 'daily_tip' },
      },
      trigger,
    });
  }

  /**
   * Cancel daily tip notification
   */
  async cancelDailyTipNotification(): Promise<void> {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const dailyTipNotifications = scheduledNotifications.filter(
      notif => notif.content.data?.type === 'daily_tip'
    );
    
    for (const notif of dailyTipNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  /**
   * Schedule evening check-in notification
   */
  async scheduleEveningCheckIn(tipId: string, hour: number = 19): Promise<void> {
    // Cancel any existing check-in
    if (this.checkInNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(this.checkInNotificationId);
    }

    // Calculate seconds until the check-in time
    const now = new Date();
    const checkInTime = new Date();
    checkInTime.setHours(hour, 0, 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (checkInTime <= now) {
      checkInTime.setDate(checkInTime.getDate() + 1);
    }
    
    const secondsUntilCheckIn = Math.floor((checkInTime.getTime() - now.getTime()) / 1000);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "How did your experiment go? 📊",
        body: "Take a moment to reflect on today's tip",
        data: { type: 'check_in', tipId },
      },
      trigger: {
        seconds: secondsUntilCheckIn,
      },
    });

    this.checkInNotificationId = notificationId;
  }

  /**
   * Cancel evening check-in notification
   */
  async cancelEveningCheckIn(): Promise<void> {
    if (this.checkInNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(this.checkInNotificationId);
      this.checkInNotificationId = null;
    }
  }

  /**
   * Schedule a motivational notification
   */
  async scheduleMotivationalNotification(daysSinceStart: number): Promise<void> {
    const messages = [
      { title: "You're doing great! 🌟", body: "Small changes add up to big results" },
      { title: "Keep it up! 💪", body: "Every experiment teaches you something valuable" },
      { title: "Progress, not perfection 🎯", body: "You're learning what works for you" },
      { title: "Celebrate your wins! 🎉", body: "You've been consistent for " + daysSinceStart + " days" },
    ];

    const message = messages[daysSinceStart % messages.length];

    await Notifications.scheduleNotificationAsync({
      content: {
        ...message,
        data: { type: 'motivational' },
      },
      trigger: {
        seconds: 1, // Send immediately
      },
    });
  }

  /**
   * Handle notification response (when user taps on notification)
   */
  setupNotificationListeners(
    onDailyTip: () => void,
    onCheckIn: (tipId: string) => void,
    onMotivational: () => void
  ): () => void {
    // Handle notifications when app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Handle notification taps
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      switch (data.type) {
        case 'daily_tip':
          onDailyTip();
          break;
        case 'check_in':
          onCheckIn(data.tipId);
          break;
        case 'motivational':
          onMotivational();
          break;
      }
    });

    // Return cleanup function
    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }

  /**
   * Get all scheduled notifications (for debugging)
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.checkInNotificationId = null;
  }
}

export default new NotificationService();