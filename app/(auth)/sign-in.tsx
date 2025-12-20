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
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../src/firebase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(device)/link" as any); // next screen: connect box
    } catch (e: any) {
      Alert.alert("Sign in failed", e?.message ?? "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>PillMate</Text>
      <Text style={styles.p}>Sign in</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={onSignIn}>
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>

      <Link href="./sign-up" style={styles.link}>
        Don’t have an account? Sign up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f6f6f6" },
  h1: { fontSize: 34, fontWeight: "900" },
  p: { marginTop: 6, marginBottom: 20, color: "#555" },
  input: { backgroundColor: "white", padding: 14, borderRadius: 12, marginBottom: 12 },
  btn: { backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 6 },
  btnText: { color: "white", fontWeight: "800" },
  link: { marginTop: 14, color: "#111", fontWeight: "700", textAlign: "center" },
});
