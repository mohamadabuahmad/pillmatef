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





// import { Link, router } from "expo-router";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { collection, getDocs } from "firebase/firestore";
// import React, { useState } from "react";
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { auth, db } from "../../src/firebase";

// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const checkForLinkedDevice = async (uid: string): Promise<boolean> => {
//     try {
//       const devicesRef = collection(db, "users", uid, "devices");
//       const snapshot = await getDocs(devicesRef);
//       return !snapshot.empty; // Returns true if user has at least one linked device
//     } catch (error) {
//       console.error("Error checking for linked device:", error);
//       return false;
//     }
//   };

//   const onSignIn = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
//       const uid = userCredential.user.uid;
      
//       // Check if user already has a linked device
//       const hasDevice = await checkForLinkedDevice(uid);
      
//       if (hasDevice) {
//         // User already has a device, go directly to home
//         router.replace("/(tabs)" as any);
//       } else {
//         // No device linked, go to link page
//         router.replace("/(device)/link" as any);
//       }
//     } catch (e: any) {
//       Alert.alert("Sign in failed", e?.message ?? "Unknown error");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.h1}>PillMate</Text>
//       <Text style={styles.p}>Sign in</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.btn} onPress={onSignIn}>
//         <Text style={styles.btnText}>Sign In</Text>
//       </TouchableOpacity>

//       <Link href="./sign-up" style={styles.link}>
//         Don’t have an account? Sign up
//       </Link>
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
import { collection, getDocs } from "firebase/firestore";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DesignSystem } from "../../constants/DesignSystem";
import { auth, db } from "../../src/firebase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const checkForLinkedDevice = async (uid: string): Promise<boolean> => {
    try {
      const devicesRef = collection(db, "users", uid, "devices");
      const snapshot = await getDocs(devicesRef);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking for linked device:", error);
      return false;
    }
  };

  const onSignIn = async () => {
    setErrorMessage("");
    
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCredential.user.uid;
      
      const hasDevice = await checkForLinkedDevice(uid);
      
      if (hasDevice) {
        router.replace("/(tabs)" as any);
      } else {
        router.replace("/(device)/link" as any);
      }
    } catch (e: any) {
      let errorMsg = "Sign in failed. Please try again.";
      
      if (e.code === "auth/user-not-found") {
        errorMsg = "No account found with this email address.";
      } else if (e.code === "auth/wrong-password") {
        errorMsg = "Incorrect password. Please check and try again.";
      } else if (e.code === "auth/invalid-email") {
        errorMsg = "Invalid email address format.";
      } else if (e.code === "auth/too-many-requests") {
        errorMsg = "Too many failed attempts. Please try again later.";
      } else if (e.code === "auth/network-request-failed") {
        errorMsg = "Network error. Please check your connection.";
      } else if (e.code === "auth/invalid-credential") {
        errorMsg = "Invalid email or password.";
      }
      
      setErrorMessage(errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>PillMate</Text>
        <Text style={styles.subtitle}>Welcome back</Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <TextInput
          style={[styles.input, errorMessage && styles.inputError]}
          placeholder="Email"
          placeholderTextColor={DesignSystem.colors.textTertiary}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage("");
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <TextInput
          style={[styles.input, errorMessage && styles.inputError]}
          placeholder="Password"
          placeholderTextColor={DesignSystem.colors.textTertiary}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
          }}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
        />

        <TouchableOpacity 
          style={styles.btn} 
          onPress={onSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="./sign-up" style={styles.link}>
          <Text style={styles.linkText}>Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: DesignSystem.layout.containerPadding, 
    justifyContent: "center", 
    backgroundColor: DesignSystem.colors.background 
  },
  header: {
    marginBottom: DesignSystem.spacing['3xl'],
  },
  h1: { 
    fontSize: DesignSystem.typography.fontSize['4xl'], 
    fontWeight: DesignSystem.typography.fontWeight.extrabold,
    color: DesignSystem.colors.textPrimary,
    letterSpacing: DesignSystem.typography.letterSpacing.tight,
    marginBottom: DesignSystem.spacing.xs,
  },
  subtitle: { 
    fontSize: DesignSystem.typography.fontSize.base,
    color: DesignSystem.colors.textSecondary,
    fontWeight: DesignSystem.typography.fontWeight.regular,
  },
  form: {
    marginTop: DesignSystem.spacing['2xl'],
  },
  input: { 
    backgroundColor: DesignSystem.colors.surface, 
    padding: DesignSystem.layout.inputPadding, 
    borderRadius: DesignSystem.borderRadius.base, 
    marginBottom: DesignSystem.spacing.md,
    fontSize: DesignSystem.typography.fontSize.base,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border,
    color: DesignSystem.colors.textPrimary,
    fontWeight: DesignSystem.typography.fontWeight.regular,
    ...DesignSystem.shadows.sm,
  },
  inputError: {
    borderColor: DesignSystem.colors.error,
    borderWidth: 2,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.base,
    marginBottom: DesignSystem.spacing.base,
    borderWidth: 1,
    borderColor: DesignSystem.colors.error,
  },
  errorText: {
    color: DesignSystem.colors.error,
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  btn: { 
    backgroundColor: DesignSystem.colors.primary, 
    padding: DesignSystem.layout.buttonPadding, 
    borderRadius: DesignSystem.borderRadius.base, 
    alignItems: "center", 
    marginTop: DesignSystem.spacing.md,
    ...DesignSystem.shadows.md,
  },
  btnText: { 
    color: "#fff", 
    fontWeight: DesignSystem.typography.fontWeight.extrabold,
    fontSize: DesignSystem.typography.fontSize.base,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: DesignSystem.spacing.xl,
  },
  footerText: {
    fontSize: DesignSystem.typography.fontSize.base,
    color: DesignSystem.colors.textSecondary,
  },
  link: {
    marginTop: 0,
  },
  linkText: {
    color: DesignSystem.colors.primary,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    fontSize: DesignSystem.typography.fontSize.base,
  },
});