import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export class NotificationService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform() || this.isInitialized) {
      return;
    }

    try {
      // Request permission to use push notifications
      const permStatus = await PushNotifications.requestPermissions();
      
      if (permStatus.receive === 'granted') {
        // Register with Apple / Google to receive push notifications
        await PushNotifications.register();

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration', (token) => {
          console.info('Registration token: ', token.value);
          // Send token to your backend
          this.sendTokenToBackend(token.value);
        });

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError', (error) => {
          console.error('Error on registration: ' + JSON.stringify(error));
        });

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received: ', notification);
          this.handleNotificationReceived(notification);
        });

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push notification action performed', notification);
          this.handleNotificationTapped(notification);
        });

        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  private async sendTokenToBackend(token: string): Promise<void> {
    try {
      // In a real app, send this token to your backend
      console.log('Sending token to backend:', token);
      
      // Simulate backend API call
      // await fetch('/api/register-device', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, userId: 'current-user-id' })
      // });
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }

  private handleNotificationReceived(notification: any): void {
    // Handle notification when app is in foreground
    console.log('Notification received in foreground:', notification);
    
    // You can show a custom toast or alert here
    // For now, we'll just log it
  }

  private handleNotificationTapped(notification: any): void {
    // Handle notification tap
    console.log('Notification tapped:', notification);
    
    // Navigate based on notification data
    const data = notification.notification.data;
    if (data?.type === 'order_update') {
      // Navigate to order details
      window.location.href = `/orders/${data.orderId}`;
    }
  }

  async sendLocalNotification(title: string, body: string, data?: any): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      // For web, you could use the Web Notifications API
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, data });
      }
      return;
    }

    try {
      await PushNotifications.createChannel({
        id: 'longchau',
        name: 'Long Châu Notifications',
        description: 'Notifications for Long Châu Pharmacy',
        importance: 4,
        visibility: 1,
      });

      // Schedule local notification
      // Note: This requires the Local Notifications plugin
      console.log('Local notification scheduled:', { title, body, data });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Simulate order status notifications
  async simulateOrderNotifications(orderId: string): Promise<void> {
    const notifications = [
      {
        title: 'Đơn hàng đã được xác nhận',
        body: `Đơn hàng ${orderId} đã được xác nhận và đang được chuẩn bị.`,
        delay: 2000
      },
      {
        title: 'Đơn hàng đang được chuẩn bị',
        body: `Nhà thuốc đang chuẩn bị đơn hàng ${orderId} của bạn.`,
        delay: 5000
      },
      {
        title: 'Đơn hàng sẵn sàng lấy',
        body: `Đơn hàng ${orderId} đã sẵn sàng. Vui lòng đến nhà thuốc để lấy hàng.`,
        delay: 10000
      }
    ];

    for (const notification of notifications) {
      setTimeout(() => {
        this.sendLocalNotification(
          notification.title,
          notification.body,
          { type: 'order_update', orderId }
        );
      }, notification.delay);
    }
  }
}

export const notificationService = new NotificationService();