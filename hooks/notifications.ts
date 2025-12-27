import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Add notification listeners for debugging
Notifications.addNotificationReceivedListener((notification) => {
  console.log("🔔 Notification received:", {
    identifier: notification.request.identifier,
    title: notification.request.content.title,
    body: notification.request.content.body,
    trigger: notification.request.trigger,
  });
});

Notifications.addNotificationResponseReceivedListener((response) => {
  console.log("👆 Notification tapped:", {
    identifier: response.notification.request.identifier,
    actionIdentifier: response.actionIdentifier,
  });
});

export async function ensureNotificationPermissions() {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("dose-reminders", {
        name: "Dose reminders",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const res = await Notifications.requestPermissionsAsync();
      return res.status === "granted";
    }
    return true;
  } catch (error) {
    console.error("Error ensuring notification permissions:", error);
    return false;
  }
}

export async function scheduleDoseNotification(params: {
  title: string;
  body: string;
  hour: number;
  minute: number;
}) {
  try {
    console.log(`Scheduling notification for ${params.hour}:${params.minute.toString().padStart(2, '0')}`);
    
    // Use daily recurring trigger - automatically repeats every day
    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: params.hour,
      minute: params.minute,
      channelId: Platform.OS === "android" ? "dose-reminders" : undefined,
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { 
        title: params.title, 
        body: params.body, 
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    console.log(`✅ Notification scheduled with ID: ${notificationId} for ${params.hour}:${params.minute.toString().padStart(2, '0')}`);
    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    throw error;
  }
}

export async function cancelAllDoseNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error canceling notifications:", error);
    // Don't throw - it's okay if canceling fails
  }
}

export function parseHHMM(time: string) {
  try {
    const [hh, mm] = time.split(":").map((n: string) => parseInt(n, 10));
    if (isNaN(hh) || isNaN(mm)) {
      throw new Error(`Invalid time format: ${time}`);
    }
    return { hh, mm };
  } catch (error) {
    console.error("Error parsing time:", error);
    throw error;
  }
}

export async function getAllScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error getting scheduled notifications:", error);
    return [];
  }
}

export async function scheduleTestNotification(minutesFromNow: number = 1) {
  try {
    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: minutesFromNow * 60,
      repeats: false,
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "🧪 Test Notification",
        body: `This is a test notification scheduled ${minutesFromNow} minute(s) ago`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    console.log(`✅ Test notification scheduled for ${minutesFromNow} minute(s) from now (ID: ${notificationId})`);
    return notificationId;
  } catch (error) {
    console.error("Error scheduling test notification:", error);
    throw error;
  }
}

