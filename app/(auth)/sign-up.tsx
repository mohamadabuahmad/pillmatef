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
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../src/firebase";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUp = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

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
      <Text style={styles.h1}>Create account</Text>

      <TextInput style={styles.input} placeholder="Full name" value={fullName} onChangeText={setFullName} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.btn} onPress={onSignUp}>
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f6f6f6" },
  h1: { fontSize: 26, fontWeight: "900", marginBottom: 14 },
  input: { backgroundColor: "white", padding: 14, borderRadius: 12, marginBottom: 12 },
  btn: { backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 6 },
  btnText: { color: "white", fontWeight: "800" },
  link: { marginTop: 14, color: "#111", fontWeight: "800", textAlign: "center" },
});
