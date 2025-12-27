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
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";

import { signOut } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";

import DoseCard from "../../components/DoseCard";
import Sidebar from "../../components/Sidebar";
import type { Dose } from "../../constants/types";
import { auth, db } from "../../src/firebase";
import { useTheme } from "../../contexts/ThemeContext";

import {
  cancelAllDoseNotifications,
  ensureNotificationPermissions,
  parseHHMM,
  scheduleDoseNotification,
} from "../../hooks/notifications";

export default function Home() {
  const [doses, setDoses] = useState<Dose[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { isDark } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);

  const colors = isDark
    ? {
        background: '#1a1a1a',
        card: '#2a2a2a',
        text: '#fff',
        textSecondary: '#aaa',
      }
    : {
        background: '#f8f9fa',
        card: '#fff',
        text: '#1a1a1a',
        textSecondary: '#666',
      };

  // Form state
  const [medName, setMedName] = useState("");
  const [doseText, setDoseText] = useState("");
  const [time, setTime] = useState("08:00");

  // Edit state
  const [editingDose, setEditingDose] = useState<Dose | null>(null);
  const [editMedName, setEditMedName] = useState("");
  const [editDoseText, setEditDoseText] = useState("");
  const [editTime, setEditTime] = useState("08:00");

  useEffect(() => {
    ensureNotificationPermissions();
  }, []);

  // Get user's display name
  useEffect(() => {
    const user = auth.currentUser;
    if (user?.displayName) {
      setUserName(user.displayName);
    } else {
      // Fallback to email username if no display name
      const emailName = user?.email?.split("@")[0] || null;
      setUserName(emailName);
    }
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

  const handleEdit = (dose: Dose) => {
    setEditingDose(dose);
    setEditMedName(dose.medName);
    setEditDoseText(dose.dose || "");
    setEditTime(dose.time);
  };

  const handleSaveEdit = async () => {
    if (!editingDose) return;

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const name = editMedName.trim();
    const d = editDoseText.trim();
    const t = editTime.trim();

    if (!name) {
      Alert.alert("Missing", "Enter medication name.");
      return;
    }
    if (!t.match(/^\d{2}:\d{2}$/)) {
      Alert.alert("Time format", "Use HH:MM (example 08:00).");
      return;
    }

    try {
      const doseRef = doc(db, "users", uid, "schedule", editingDose.id);
      await updateDoc(doseRef, {
        medName: name,
        dose: d || "",
        time: t,
      });

      setEditingDose(null);
      setEditMedName("");
      setEditDoseText("");
      setEditTime("08:00");
    } catch (e: any) {
      Alert.alert("Failed to update", e?.message ?? "Unknown error");
    }
  };

  const handleDelete = (dose: Dose) => {
    Alert.alert(
      "Delete Medication",
      `Are you sure you want to delete ${dose.medName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const uid = auth.currentUser?.uid;
            if (!uid) return;

            try {
              const doseRef = doc(db, "users", uid, "schedule", dose.id);
              await deleteDoc(doseRef);
            } catch (e: any) {
              Alert.alert("Failed to delete", e?.message ?? "Unknown error");
            }
          },
        },
      ]
    );
  };

  const handleToggle = async (dose: Dose) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const doseRef = doc(db, "users", uid, "schedule", dose.id);
      await updateDoc(doseRef, {
        enabled: !dose.enabled,
      });
    } catch (e: any) {
      Alert.alert("Failed to update", e?.message ?? "Unknown error");
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setSidebarVisible(true)}>
            <Text style={[styles.menuBtnText, { color: colors.text }]}>☰</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Hello{userName ? `, ${userName}` : ""}! 👋
            </Text>
            <Text style={[styles.h1, { color: colors.text }]}>Your Medications</Text>
          </View>
          <View style={styles.menuBtn} />
        </View>

        {/* Next Dose Card */}
        <View style={[styles.nextCard, { backgroundColor: isDark ? '#6366f1' : '#6366f1' }]}>
          <View style={styles.nextCardHeader}>
            <Text style={styles.nextCardIcon}>⏰</Text>
            <Text style={styles.nextTitle}>Next Dose</Text>
          </View>
          <Text style={styles.nextValue}>
            {nextDose ? (
              <>
                <Text style={styles.nextTime}>{nextDose.time}</Text>
                <Text style={styles.nextMedName}> • {nextDose.medName}</Text>
              </>
            ) : (
              "No schedule yet"
            )}
          </Text>
        </View>

        {/* Add medication form */}
        {!editingDose ? (
          <View style={[styles.formCard, { backgroundColor: colors.card }]}>
            <Text style={styles.formTitle}>➕ Add New Medication</Text>

            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#333' : '#f5f5f5', color: colors.text, borderColor: isDark ? '#444' : '#e8e8e8' }]}
              placeholder="Medication name (e.g., Aspirin)"
              placeholderTextColor={colors.textSecondary}
              value={medName}
              onChangeText={setMedName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#333' : '#f5f5f5', color: colors.text, borderColor: isDark ? '#444' : '#e8e8e8' }]}
              placeholder="Dose (optional, e.g., 100 mg)"
              placeholderTextColor={colors.textSecondary}
              value={doseText}
              onChangeText={setDoseText}
            />

            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#333' : '#f5f5f5', color: colors.text, borderColor: isDark ? '#444' : '#e8e8e8' }]}
              placeholder="Time (HH:MM) e.g., 08:00"
              placeholderTextColor={colors.textSecondary}
              value={time}
              onChangeText={setTime}
            />

            <TouchableOpacity style={styles.btn} onPress={addMedication} activeOpacity={0.8}>
              <Text style={styles.btnText}>Add to Schedule</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.formCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>✏️ Edit Medication</Text>

            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#333' : '#f5f5f5', color: colors.text, borderColor: isDark ? '#444' : '#e8e8e8' }]}
              placeholder="Medication name (e.g., Aspirin)"
              placeholderTextColor={colors.textSecondary}
              value={editMedName}
              onChangeText={setEditMedName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#333' : '#f5f5f5', color: colors.text, borderColor: isDark ? '#444' : '#e8e8e8' }]}
              placeholder="Dose (optional, e.g., 100 mg)"
              placeholderTextColor={colors.textSecondary}
              value={editDoseText}
              onChangeText={setEditDoseText}
            />

            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#333' : '#f5f5f5', color: colors.text, borderColor: isDark ? '#444' : '#e8e8e8' }]}
              placeholder="Time (HH:MM) e.g., 08:00"
              placeholderTextColor={colors.textSecondary}
              value={editTime}
              onChangeText={setEditTime}
            />

            <View style={styles.editButtons}>
              <TouchableOpacity 
                style={[styles.btn, styles.cancelBtn]} 
                onPress={() => {
                  setEditingDose(null);
                  setEditMedName("");
                  setEditDoseText("");
                  setEditTime("08:00");
                }} 
                activeOpacity={0.8}
              >
                <Text style={[styles.btnText, styles.cancelBtnText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={handleSaveEdit} activeOpacity={0.8}>
                <Text style={styles.btnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Schedule Section */}
        <View style={styles.scheduleSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Schedule</Text>
          {doses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No medications scheduled yet</Text>
              <Text style={styles.emptySubtext}>Add one above to get started</Text>
            </View>
          ) : (
            <FlatList
              data={doses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <DoseCard 
                  item={item} 
                  onNotify={onNotify}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              )}
              scrollEnabled={false}
              contentContainerStyle={styles.doseList}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    marginTop: 10,
  },
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  menuBtnText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  h1: { 
    fontSize: 32, 
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },

  nextCard: { 
    backgroundColor: "#6366f1",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  nextCardIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  nextTitle: { 
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    opacity: 0.9,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  nextValue: { 
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  nextTime: {
    fontSize: 28,
    fontWeight: "900",
  },
  nextMedName: {
    fontSize: 20,
    opacity: 0.95,
  },

  formCard: { 
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: { 
    fontWeight: "800",
    marginBottom: 16,
    fontSize: 18,
  },
  input: { 
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  btn: { 
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
  },
  btnText: { 
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  editButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  cancelBtnText: {
    color: "#666",
  },

  scheduleSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  doseList: {
    gap: 12,
    paddingBottom: 0,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
});
