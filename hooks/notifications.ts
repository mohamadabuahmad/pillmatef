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

export async function ensureNotificationPermissions() {
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
}

export async function scheduleDoseNotification(params: {
  title: string;
  body: string;
  hour: number;
  minute: number;
}) {
  const now = new Date();

  const target = new Date();
  target.setHours(params.hour);
  target.setMinutes(params.minute);
  target.setSeconds(0);
  target.setMilliseconds(0);

  if (target <= now) target.setDate(target.getDate() + 1);

  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: target,
  };

  return Notifications.scheduleNotificationAsync({
    content: { title: params.title, body: params.body, sound: true },
    trigger,
  });
}

export async function cancelAllDoseNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function parseHHMM(time: string) {
  const [hh, mm] = time.split(":").map((n: string) => parseInt(n, 10));
  return { hh, mm };
}

