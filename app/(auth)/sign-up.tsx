// import { router } from "expo-router";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, serverTimestamp, setDoc } from "firebase/firestore";
// import React, { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { auth, db } from "../../src/firebase";

// export default function SignUp() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const onSignUp = async () => {
//     try {
//       const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
//       await setDoc(doc(db, "users", cred.user.uid), {
//         name: fullName,
//         createdAt: serverTimestamp(),
//       });
//       router.replace("/(device)/link" as any);
//     } catch (e: any) {
//       Alert.alert("Sign up failed", e?.message ?? "Unknown error");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.h1}>Create account</Text>

//       <TextInput style={styles.input} placeholder="Full name" value={fullName} onChangeText={setFullName} />
//       <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
//       <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

//       <TouchableOpacity style={styles.btn} onPress={onSignUp}>
//         <Text style={styles.btnText}>Sign Up</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.back()}>
//         <Text style={styles.link}>Back to Sign In</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f6f6f6" },
//   h1: { fontSize: 26, fontWeight: "900", marginBottom: 14 },
//   input: { backgroundColor: "white", padding: 14, borderRadius: 12, marginBottom: 12 },
//   btn: { backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 6 },
//   btnText: { color: "white", fontWeight: "800" },
//   link: { marginTop: 14, color: "#111", fontWeight: "800", textAlign: "center" },
// });



import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
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
import { auth, db } from "../../src/firebase";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUp = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(doc(db, "users", cred.user.uid), {
        name: fullName,
        createdAt: serverTimestamp(),
      });

      router.replace("/(device)/link" as any);
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.message ?? "Unknown error");
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

      <Text style={styles.h1}>Create account</Text>
      <Text style={styles.subtitle}>
        Start managing your medication smartly
      </Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
        />

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

        <TouchableOpacity style={styles.btn} onPress={onSignUp}>
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Back to Sign In</Text>
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
    fontSize: 32,
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

  link: {
    marginTop: 18,
    color: "#2563EB",
    fontWeight: "700",
  },
});
