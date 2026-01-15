// import React from "react";
// import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useLanguage } from "../../contexts/LanguageContext";
// import { useTheme } from "../../contexts/ThemeContext";

// export default function SettingsTab() {
//   const { t, language, setLanguage } = useLanguage();
//   const { theme, setTheme, isDark } = useTheme();

//   const languages = [
//     { code: 'en' as const, name: 'English', flag: '🇬🇧' },
//     { code: 'ar' as const, name: 'العربية', flag: '🇸🇦' },
//     { code: 'he' as const, name: 'עברית', flag: '🇮🇱' },
//   ];

//   const themes = [
//     { code: 'light' as const, name: t('light') },
//     { code: 'dark' as const, name: t('dark') },
//     { code: 'auto' as const, name: t('auto') },
//   ];

//   const colors = isDark
//     ? {
//         background: '#1a1a1a',
//         card: '#2a2a2a',
//         text: '#fff',
//         textSecondary: '#aaa',
//         border: '#333',
//       }
//     : {
//         background: '#f8f9fa',
//         card: '#fff',
//         text: '#1a1a1a',
//         textSecondary: '#666',
//         border: '#e0e0e0',
//       };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
//       <View style={[styles.header, { borderBottomColor: colors.border }]}>
//         <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings')}</Text>
//       </View>

//       <ScrollView style={styles.content}>
//         {/* Language Selection */}
//         <View style={[styles.section, { backgroundColor: colors.card }]}>
//           <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('language')}</Text>
//           {languages.map((lang) => (
//             <TouchableOpacity
//               key={lang.code}
//               style={[
//                 styles.option,
//                 { borderBottomColor: colors.border },
//                 language === lang.code && { backgroundColor: '#f0f4ff' },
//               ]}
//               onPress={() => setLanguage(lang.code)}
//             >
//               <Text style={styles.optionIcon}>{lang.flag}</Text>
//               <Text style={[styles.optionText, { color: colors.text }]}>{lang.name}</Text>
//               {language === lang.code && <Text style={styles.checkmark}>✓</Text>}
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Theme Selection */}
//         <View style={[styles.section, { backgroundColor: colors.card }]}>
//           <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('theme')}</Text>
//           {themes.map((th) => (
//             <TouchableOpacity
//               key={th.code}
//               style={[
//                 styles.option,
//                 { borderBottomColor: colors.border },
//                 theme === th.code && { backgroundColor: '#f0f4ff' },
//               ]}
//               onPress={() => setTheme(th.code)}
//             >
//               <Text style={[styles.optionText, { color: colors.text }]}>{th.name}</Text>
//               {theme === th.code && <Text style={styles.checkmark}>✓</Text>}
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//     paddingTop: Platform.OS === 'ios' ? 10 : 20,
//     borderBottomWidth: 1,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '800',
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   section: {
//     borderRadius: 16,
//     marginBottom: 20,
//     overflow: 'hidden',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     padding: 16,
//     paddingBottom: 12,
//   },
//   option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//   },
//   optionIcon: {
//     fontSize: 24,
//     marginRight: 12,
//   },
//   optionText: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   checkmark: {
//     fontSize: 20,
//     color: '#6366f1',
//     fontWeight: '700',
//   },
// });


import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DesignSystem, getThemeColors } from "../../constants/DesignSystem";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { auth } from "../../src/firebase";

export default function SettingsTab() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'ar' as const, name: 'العربية', flag: '🇸🇦' },
    { code: 'he' as const, name: 'עברית', flag: '🇮🇱' },
  ];

  const themes = [
    { code: 'light' as const, name: t('light') },
    { code: 'dark' as const, name: t('dark') },
    { code: 'auto' as const, name: t('auto') },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/(auth)/sign-in" as any);
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to logout");
            }
          },
        },
      ]
    );
  };

  const colors = getThemeColors(isDark);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{t('settings')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Language Selection */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('language')}</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.option,
                { borderBottomColor: colors.border },
                language === lang.code && { backgroundColor: colors.primary + '15' },
              ]}
              onPress={() => setLanguage(lang.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionIcon}>{lang.flag}</Text>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>{lang.name}</Text>
              {language === lang.code && <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Selection */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('theme')}</Text>
          {themes.map((th) => (
            <TouchableOpacity
              key={th.code}
              style={[
                styles.option,
                { borderBottomColor: colors.border },
                theme === th.code && { backgroundColor: colors.primary + '15' },
              ]}
              onPress={() => setTheme(th.code)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>{th.name}</Text>
              {theme === th.code && <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.logoutOption}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: DesignSystem.spacing.base,
    paddingTop: Platform.OS === 'ios' ? DesignSystem.spacing.sm : DesignSystem.spacing.lg,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: DesignSystem.typography.fontSize['2xl'],
    fontWeight: DesignSystem.typography.fontWeight.extrabold,
  },
  content: {
    flex: 1,
    padding: DesignSystem.layout.containerPadding,
  },
  section: {
    borderRadius: DesignSystem.borderRadius.lg,
    marginBottom: DesignSystem.spacing.lg,
    overflow: 'hidden',
    ...DesignSystem.shadows.base,
  },
  sectionTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    padding: DesignSystem.spacing.base,
    paddingBottom: DesignSystem.spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.spacing.base,
    borderBottomWidth: 1,
  },
  optionIcon: {
    fontSize: DesignSystem.typography.fontSize['2xl'],
    marginRight: DesignSystem.spacing.md,
  },
  optionText: {
    flex: 1,
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  checkmark: {
    fontSize: DesignSystem.typography.fontSize.xl,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  logoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignSystem.spacing.base,
  },
  logoutIcon: {
    fontSize: DesignSystem.typography.fontSize['2xl'],
    marginRight: DesignSystem.spacing.md,
  },
  logoutText: {
    flex: 1,
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
});