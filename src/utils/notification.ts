import * as Notifications from 'expo-notifications';

export async function sendLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>
) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: data || {},
        },
        trigger: null, // null means send immediately
    });
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}