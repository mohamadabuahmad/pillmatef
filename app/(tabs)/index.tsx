// // import { StyleSheet } from 'react-native';

// // import EditScreenInfo from '@/components/EditScreenInfo';
// // import { Text, View } from '@/components/Themed';

// // export default function TabOneScreen() {
// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Tab One</Text>
// //       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
// //       <EditScreenInfo path="app/(tabs)/index.tsx" />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   title: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //   },
// //   separator: {
// //     marginVertical: 30,
// //     height: 1,
// //     width: '80%',
// //   },
// // });



// import { router } from "expo-router";
// import { signOut } from "firebase/auth";
// import { collection, onSnapshot } from "firebase/firestore";
// import React, { useEffect, useMemo, useState } from "react";
// import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// import DoseCard from "../../components/DoseCard";
// import type { Dose } from "../../constants/types";
// import { ensureNotificationPermissions, scheduleDoseNotification } from "../../hooks/notifications";
// import { auth, db } from "../../src/firebase";

// export default function Home() {
//   const [doses, setDoses] = useState<Dose[]>([]);

//   useEffect(() => {
//     ensureNotificationPermissions();
//   }, []);

//   useEffect(() => {
//     const uid = auth.currentUser?.uid;
//     if (!uid) return;

//     const ref = collection(db, "users", uid, "schedule");
//     const unsub = onSnapshot(ref, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Dose[];
//       setDoses(list);
//     });

//     return () => unsub();
//   }, []);

//   const nextDose = useMemo(() => doses.find((d) => d.enabled) ?? null, [doses]);

//   const onNotify = async (dose: Dose) => {
//     const ok = await ensureNotificationPermissions();
//     if (!ok) return Alert.alert("Notifications disabled", "Enable notifications in settings.");

//     const [hh, mm] = dose.time.split(":").map((n: string) => parseInt(n, 10));
//     await scheduleDoseNotification({
//       title: "Time to take your dose",
//       body: `${dose.medName} • ${dose.dose}`,
//       hour: hh,
//       minute: mm,
//     });

//     Alert.alert("Scheduled", `Reminder set for ${dose.time} (next occurrence).`);
//   };

//   const logout = async () => {
//     await signOut(auth);
//     router.replace("/(auth)/sign-in" as any);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.topRow}>
//         <Text style={styles.h1}>Home</Text>
//         <TouchableOpacity onPress={logout}>
//           <Text style={styles.logout}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.nextCard}>
//         <Text style={styles.nextTitle}>Next dose</Text>
//         <Text style={styles.nextValue}>{nextDose ? `${nextDose.time} — ${nextDose.medName}` : "No schedule yet"}</Text>
//       </View>

//       <Text style={styles.section}>Schedule</Text>

//       <FlatList
//         data={doses}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <DoseCard item={item} onNotify={onNotify} />}
//         ListEmptyComponent={<Text style={{ color: "#666" }}>No doses yet. Add them in Firestore for now.</Text>}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#f6f6f6" },
//   topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
//   h1: { fontSize: 28, fontWeight: "900" },
//   logout: { fontWeight: "800" },
//   nextCard: { backgroundColor: "white", padding: 14, borderRadius: 14, marginBottom: 14 },
//   nextTitle: { color: "#666", fontWeight: "700" },
//   nextValue: { marginTop: 6, fontSize: 16, fontWeight: "800" },
//   section: { marginBottom: 10, fontWeight: "800" },
// });





// without real notficaion

// import { router } from "expo-router";
// import { signOut } from "firebase/auth";
// import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
// import React, { useEffect, useMemo, useState } from "react";
// import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// import DoseCard from "../../components/DoseCard";
// import type { Dose } from "../../constants/types";
// // import { ensureNotificationPermissions, scheduleDoseNotification } from "../../hooks/notifications";
// import {
//   ensureNotificationPermissions,
//   scheduleDoseNotification
// } from "../../hooks/notifications";

// import { auth, db } from "../../src/firebase";

// export default function Home() {
//   const [doses, setDoses] = useState<Dose[]>([]);

//   // Form state
//   const [medName, setMedName] = useState("");
//   const [doseText, setDoseText] = useState("");
//   const [time, setTime] = useState("08:00"); // simple MVP format

//   useEffect(() => {
//     ensureNotificationPermissions();
//   }, []);

//   // Live schedule from Firestore
//   useEffect(() => {
//     const uid = auth.currentUser?.uid;
//     if (!uid) {
//       router.replace("/(auth)/sign-in" as any);
//       return;
//     }

//     const ref = collection(db, "users", uid, "schedule");
//     const q = query(ref, orderBy("time", "asc"));
//     const unsub = onSnapshot(q, (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Dose[];
//       setDoses(list);
//     });

//     return () => unsub();
//   }, []);

//   const nextDose = useMemo(() => doses.find((d) => d.enabled) ?? null, [doses]);

//   const addMedication = async () => {
//     const uid = auth.currentUser?.uid;
//     if (!uid) return;

//     const name = medName.trim();
//     const d = doseText.trim();
//     const t = time.trim();

//     // basic validation for MVP
//     if (!name) return Alert.alert("Missing", "Enter medication name.");
//     if (!t.match(/^\d{2}:\d{2}$/)) return Alert.alert("Time format", "Use HH:MM (example 08:00).");

//     try {
//       await addDoc(collection(db, "users", uid, "schedule"), {
//         medName: name,
//         dose: d || "",
//         time: t,
//         enabled: true,
//         createdAt: serverTimestamp(),
//       });

//       setMedName("");
//       setDoseText("");
//       setTime("08:00");
//     } catch (e: any) {
//       Alert.alert("Failed to add", e?.message ?? "Unknown error");
//     }
//   };

//   const onNotify = async (dose: Dose) => {
//     const ok = await ensureNotificationPermissions();
//     if (!ok) return Alert.alert("Notifications disabled", "Enable notifications in settings.");

//     const [hh, mm] = dose.time.split(":").map((n: string) => parseInt(n, 10));
//     await scheduleDoseNotification({
//       title: "Time to take your dose",
//       body: `${dose.medName}${dose.dose ? ` • ${dose.dose}` : ""}`,
//       hour: hh,
//       minute: mm,
//     });

//     Alert.alert("Scheduled", `Reminder set for ${dose.time} (next occurrence).`);
//   };

//   const logout = async () => {
//     await signOut(auth);
//     router.replace("/(auth)/sign-in" as any);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.topRow}>
//         <Text style={styles.h1}>Home</Text>
//         <TouchableOpacity onPress={logout}>
//           <Text style={styles.logout}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.nextCard}>
//         <Text style={styles.nextTitle}>Next dose</Text>
//         <Text style={styles.nextValue}>{nextDose ? `${nextDose.time} — ${nextDose.medName}` : "No schedule yet"}</Text>
//       </View>

//       {/* ✅ Add medication form */}
//       <View style={styles.formCard}>
//         <Text style={styles.formTitle}>Add medication</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Medication name (e.g., Aspirin)"
//           value={medName}
//           onChangeText={setMedName}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Dose (optional, e.g., 100 mg)"
//           value={doseText}
//           onChangeText={setDoseText}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Time (HH:MM) e.g., 08:00"
//           value={time}
//           onChangeText={setTime}
//         />

//         <TouchableOpacity style={styles.btn} onPress={addMedication}>
//           <Text style={styles.btnText}>Add to schedule</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.section}>Schedule</Text>

//       <FlatList
//         data={doses}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <DoseCard item={item} onNotify={onNotify} />}
//         ListEmptyComponent={<Text style={{ color: "#666" }}>No doses yet. Add one above.</Text>}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#f6f6f6" },
//   topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
//   h1: { fontSize: 28, fontWeight: "900" },
//   logout: { fontWeight: "800" },

//   nextCard: { backgroundColor: "white", padding: 14, borderRadius: 14, marginBottom: 14 },
//   nextTitle: { color: "#666", fontWeight: "700" },
//   nextValue: { marginTop: 6, fontSize: 16, fontWeight: "800" },

//   formCard: { backgroundColor: "white", padding: 14, borderRadius: 14, marginBottom: 14 },
//   formTitle: { fontWeight: "900", marginBottom: 10, fontSize: 16 },
//   input: { backgroundColor: "#f3f3f3", padding: 12, borderRadius: 12, marginBottom: 10 },
//   btn: { backgroundColor: "#111", padding: 12, borderRadius: 12, alignItems: "center" },
//   btnText: { color: "white", fontWeight: "900" },

//   section: { marginBottom: 10, fontWeight: "800" },
// });






import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { signOut } from "firebase/auth";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";

import DoseCard from "../../components/DoseCard";
import type { Dose } from "../../constants/types";
import { auth, db } from "../../src/firebase";

import {
  cancelAllDoseNotifications,
  ensureNotificationPermissions,
  parseHHMM,
  scheduleDoseNotification,
} from "../../hooks/notifications";

export default function Home() {
  const [doses, setDoses] = useState<Dose[]>([]);

  // Form state
  const [medName, setMedName] = useState("");
  const [doseText, setDoseText] = useState("");
  const [time, setTime] = useState("08:00");

  useEffect(() => {
    ensureNotificationPermissions();
  }, []);

  // Live schedule from Firestore + auto notification scheduling
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      router.replace("/(auth)/sign-in" as any);
      return;
    }

    const ref = collection(db, "users", uid, "schedule");
    const q = query(ref, orderBy("time", "asc"));

    const unsub = onSnapshot(q, async (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Dose[];
      setDoses(list);

      // ✅ auto schedule notifications for all enabled doses
      const ok = await ensureNotificationPermissions();
      if (!ok) return;

      await cancelAllDoseNotifications();

      for (const d of list) {
        if (!d.enabled) continue;

        const { hh, mm } = parseHHMM(d.time);

        await scheduleDoseNotification({
          title: "Time to take your dose",
          body: `${d.medName}${d.dose ? ` • ${d.dose}` : ""}`,
          hour: hh,
          minute: mm,
        });
      }
    });

    return () => unsub();
  }, []);

  const nextDose = useMemo(() => doses.find((d) => d.enabled) ?? null, [doses]);

  const addMedication = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const name = medName.trim();
    const d = doseText.trim();
    const t = time.trim();

    if (!name) return Alert.alert("Missing", "Enter medication name.");
    if (!t.match(/^\d{2}:\d{2}$/)) return Alert.alert("Time format", "Use HH:MM (example 08:00).");

    try {
      await addDoc(collection(db, "users", uid, "schedule"), {
        medName: name,
        dose: d || "",
        time: t,
        enabled: true,
        createdAt: serverTimestamp(),
      });

      setMedName("");
      setDoseText("");
      setTime("08:00");
    } catch (e: any) {
      Alert.alert("Failed to add", e?.message ?? "Unknown error");
    }
  };

  // manual notify button (still useful for testing)
  const onNotify = async (dose: Dose) => {
    const ok = await ensureNotificationPermissions();
    if (!ok) return Alert.alert("Notifications disabled", "Enable notifications in settings.");

    const { hh, mm } = parseHHMM(dose.time);

    await scheduleDoseNotification({
      title: "Time to take your dose",
      body: `${dose.medName}${dose.dose ? ` • ${dose.dose}` : ""}`,
      hour: hh,
      minute: mm,
    });

    Alert.alert("Scheduled", `Reminder set for ${dose.time} (next occurrence).`);
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/(auth)/sign-in" as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.h1}>Home</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.nextCard}>
        <Text style={styles.nextTitle}>Next dose</Text>
        <Text style={styles.nextValue}>
          {nextDose ? `${nextDose.time} — ${nextDose.medName}` : "No schedule yet"}
        </Text>
      </View>

      {/* Add medication form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Add medication</Text>

        <TextInput
          style={styles.input}
          placeholder="Medication name (e.g., Aspirin)"
          value={medName}
          onChangeText={setMedName}
        />

        <TextInput
          style={styles.input}
          placeholder="Dose (optional, e.g., 100 mg)"
          value={doseText}
          onChangeText={setDoseText}
        />

        <TextInput
          style={styles.input}
          placeholder="Time (HH:MM) e.g., 08:00"
          value={time}
          onChangeText={setTime}
        />

        <TouchableOpacity style={styles.btn} onPress={addMedication}>
          <Text style={styles.btnText}>Add to schedule</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.section}>Schedule</Text>

      <FlatList
        data={doses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DoseCard item={item} onNotify={onNotify} />}
        ListEmptyComponent={<Text style={{ color: "#666" }}>No doses yet. Add one above.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f6f6f6" },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  h1: { fontSize: 28, fontWeight: "900" },
  logout: { fontWeight: "800" },

  nextCard: { backgroundColor: "white", padding: 14, borderRadius: 14, marginBottom: 14 },
  nextTitle: { color: "#666", fontWeight: "700" },
  nextValue: { marginTop: 6, fontSize: 16, fontWeight: "800" },

  formCard: { backgroundColor: "white", padding: 14, borderRadius: 14, marginBottom: 14 },
  formTitle: { fontWeight: "900", marginBottom: 10, fontSize: 16 },
  input: { backgroundColor: "#f3f3f3", padding: 12, borderRadius: 12, marginBottom: 10 },
  btn: { backgroundColor: "#111", padding: 12, borderRadius: 12, alignItems: "center" },
  btnText: { color: "white", fontWeight: "900" },

  section: { marginBottom: 10, fontWeight: "800" },
});
