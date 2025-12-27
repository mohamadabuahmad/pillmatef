import { router } from "expo-router";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from "react-native";
import { auth } from "../src/firebase";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

export default function ChangePasswordScreen() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = isDark
    ? {
        background: '#1a1a1a',
        card: '#2a2a2a',
        text: '#fff',
        textSecondary: '#aaa',
        border: '#333',
        input: '#333',
      }
    : {
        background: '#f8f9fa',
        card: '#fff',
        text: '#1a1a1a',
        textSecondary: '#666',
        border: '#e0e0e0',
        input: '#f5f5f5',
      };

  const handleChangePassword = async () => {
    if (!user || !user.email) {
      Alert.alert("Error", "User not found");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert("Success", "Password changed successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backBtnText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('changePassword')}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.text }]}>{t('currentPassword')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder={t('currentPassword')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
          />

          <Text style={[styles.label, { color: colors.text }]}>{t('newPassword')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t('newPassword')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
          />

          <Text style={[styles.label, { color: colors.text }]}>{t('confirmPassword')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('confirmPassword')}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.btnText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 4,
  },
  btn: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

