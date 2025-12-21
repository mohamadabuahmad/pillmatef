import { router } from "expo-router";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert, Animated, Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
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
      Alert.alert("Missing info", "Enter Device ID and Pair Code.");
      return;
    }

    await setDoc(
      doc(db, "devices", deviceId.trim()),
      {
        ownerUid: uid,
        pairCode: pairCode.trim(),
        model: "M5Stack",
        linkedAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    Alert.alert("Connected", "Your PillMate box is now connected.");
    router.replace("/(tabs)" as any);
  };
//new animation for the device image 
const pulse = React.useRef(new Animated.Value(1)).current;

React.useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.15,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Image
          source={require("../../assets/images/default-profile.png")}
          style={styles.avatarImage}
        />
      </View>

      <Text style={styles.h1}>Connect your PillMate</Text>
      <Text style={styles.subtitle}>
        Follow the steps below to link your smart pill box
      </Text>
<Animated.View
  style={[
    styles.wifiContainer,
    {
      transform: [{ scale: pulse }],
    },
  ]}
>
  <Text style={styles.wifiIcon}>📶</Text>
</Animated.View>

      {/* Guide */}
      <View style={styles.guideCard}>
        <Text style={styles.step}>① Turn on the PillMate box</Text>
        <Text style={styles.step}>
          ② Connect the box to Wi-Fi using its screen
        </Text>
        <Text style={styles.step}>
          ③ Enter the Device ID and Pair Code shown on the box
        </Text>
      </View>

      {/* Form */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Device ID (e.g. PM-0001)"
          placeholderTextColor="#999"
          value={deviceId}
          onChangeText={setDeviceId}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Pair Code"
          placeholderTextColor="#999"
          value={pairCode}
          onChangeText={setPairCode}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.btn} onPress={link}>
          <Text style={styles.btnText}>Link Device</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.replace("/(tabs)" as any)}>
        <Text style={styles.skip}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  h1: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111827",
  },

  subtitle: {
    color: "#4B5563",
    marginBottom: 16,
    textAlign: "center",
  },

  guideCard: {
    width: "100%",
    backgroundColor: "#F0F9FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  step: {
    color: "#1E3A8A",
    fontWeight: "700",
    marginBottom: 6,
  },

  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },

  input: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  btn: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  btnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },

  skip: {
    marginTop: 18,
    color: "#2563EB",
    fontWeight: "700",
  },

  wifiIcon: {
    fontSize: 48,
  },

  wifiContainer: {
    marginBottom: 24,
  },
});
