// import { Link, router } from "expo-router";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import React, { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { auth } from "../../src/firebase";

// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const onSignIn = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email.trim(), password);
//       // After login, go link device (MVP)
//       router.replace("/(device)/link" as any);
//     } catch (e: any) {
//       Alert.alert("Sign in failed", e?.message ?? "Unknown error");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.h1}>PillMate</Text>
//       <Text style={styles.p}>Sign in</Text>

//       <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
//       <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

//       <TouchableOpacity style={styles.btn} onPress={onSignIn}>
//         <Text style={styles.btnText}>Sign In</Text>
//       </TouchableOpacity>

//       <Link href="./sign-up" style={styles.link}>Don’t have an account? Sign up</Link>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f6f6f6" },
//   h1: { fontSize: 34, fontWeight: "900" },
//   p: { marginTop: 6, marginBottom: 20, color: "#555" },
//   input: { backgroundColor: "white", padding: 14, borderRadius: 12, marginBottom: 12 },
//   btn: { backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 6 },
//   btnText: { color: "white", fontWeight: "800" },
//   link: { marginTop: 14, color: "#111", fontWeight: "700", textAlign: "center" },
// });




import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth } from "../../src/firebase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(device)/link" as any);
    } catch (e: any) {
      Alert.alert("Sign in failed", e?.message ?? "Unknown error");
    }
  };

return (
  <View style={styles.container}>
    {/* Profile Avatar */}
    <View style={styles.avatar}>
      <Image
        source={require("../../assets/images/default-profile.png")}
        style={styles.avatarImage}
        resizeMode="cover"
      />
    </View>

    <Text style={styles.h1}>PillMate</Text>
      <Text style={styles.subtitle}>
        Smart medication management made simple
      </Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={onSignIn}>
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.badge}>💊 Smart Pill Box connection</Text>

      <Link href="./sign-up" style={styles.link}>
        Don’t have an account? Sign up
      </Link>
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
  avatarText: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
  },

  h1: {
    fontSize: 34,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    color: "#4B5563",
    marginBottom: 20,
    textAlign: "center",
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

  badge: {
    marginTop: 18,
    color: "#c52222ff",
    fontWeight: "700",
  },

  link: {
    marginTop: 18,
    color: "#2563EB",
    fontWeight: "700",
  },
});
