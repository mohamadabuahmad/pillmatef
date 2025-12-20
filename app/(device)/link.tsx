import { router } from "expo-router";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../src/firebase";

export default function LinkDevice() {
  const [deviceId, setDeviceId] = useState("");
  const [pairCode, setPairCode] = useState("");

  const link = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert("Not signed in", "Please sign in again.");
      router.replace("/(auth)/sign-in" as any);
      return;
    }

    if (!deviceId.trim() || !pairCode.trim()) {
      Alert.alert("Missing info", "Enter deviceId and pair code.");
      return;
    }

    // MVP: store link. Later: validate pairCode via Cloud Function for security.
    await setDoc(doc(db, "devices", deviceId.trim()), {
      ownerUid: uid,
      pairCode: pairCode.trim(),
      model: "M5Stack",
      linkedAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    }, { merge: true });

    Alert.alert("Connected", "Device linked successfully.");
    router.replace("/(tabs)" as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Connect your box</Text>
      <Text style={styles.p}>Enter the Device ID and Pair Code from the PillMate box.</Text>

      <TextInput style={styles.input} placeholder="Device ID (e.g., PM-0001)" value={deviceId} onChangeText={setDeviceId} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Pair Code" value={pairCode} onChangeText={setPairCode} autoCapitalize="none" />

      <TouchableOpacity style={styles.btn} onPress={link}>
        <Text style={styles.btnText}>Link Device</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/(tabs)" as any)}>
        <Text style={styles.skip}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f6f6f6" },
  h1: { fontSize: 26, fontWeight: "900" },
  p: { marginTop: 8, marginBottom: 18, color: "#555" },
  input: { backgroundColor: "white", padding: 14, borderRadius: 12, marginBottom: 12 },
  btn: { backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 6 },
  btnText: { color: "white", fontWeight: "800" },
  skip: { marginTop: 14, color: "#111", fontWeight: "700", textAlign: "center" },
});
