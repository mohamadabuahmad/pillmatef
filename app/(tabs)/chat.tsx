import React, { useState, useEffect } from "react";
import { 
  FlatList, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { httpsCallable } from "firebase/functions";
import { DesignSystem, getThemeColors } from "../../constants/DesignSystem";
import { auth, db, functions } from "../../src/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { router } from "expo-router";

type Msg = { id: string; role: "user" | "assistant"; text: string };

export default function Chat() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors(isDark);
  const [messages, setMessages] = useState<Msg[]>([
    { 
      id: "m1", 
      role: "assistant", 
      text: "Hi! I'm your medication assistant. I can help you with:\n\n• Medication information and side effects\n• Drug interactions\n• Dosage questions\n• Medication scheduling\n• General medication advice\n\nWhat would you like to know?",
    },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [userMedications, setUserMedications] = useState<string[]>([]);
  const [authReady, setAuthReady] = useState(false);

  // Load user's medications for context
  useEffect(() => {
    const loadUserMedications = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const scheduleRef = collection(db, "users", uid, "schedule");
        const snapshot = await getDocs(scheduleRef);
        const medications = snapshot.docs
          .map(doc => doc.data().medName)
          .filter(Boolean) as string[];
        setUserMedications(medications);
      } catch (error) {
        console.error("Error loading medications:", error);
      }
    };

    loadUserMedications();
  }, []);

  const send = async () => {
    if (!text.trim() || loading) return;
    
    const userMsg: Msg = { 
      id: String(Date.now()), 
      role: "user", 
      text: text.trim() 
    };
    setMessages((prev) => [userMsg, ...prev]);
    setText("");
    setLoading(true);

    try {
      // Prepare messages for API (last 10 messages for context)
      const recentMessages = [userMsg, ...messages.slice(0, 9)].reverse();
      const apiMessages = recentMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.text,
      }));

      // Call Firebase Cloud Function
      const chatFunction = httpsCallable(functions, 'chatWithMedicationAI');
      const result = await chatFunction({
        messages: apiMessages,
        userMedications: userMedications,
      });

      const response = (result.data as any).response;
      
      const aiMsg: Msg = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: response,
      };
      
      setMessages((prev) => [aiMsg, ...prev]);
    } catch (error: any) {
      console.error("Chat error:", error);
      
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      
      if (error.code === 'unauthenticated') {
        errorMessage = "Please sign in to use the chat feature.";
      } else if (error.code === 'resource-exhausted') {
        errorMessage = "Too many requests. Please try again in a moment.";
      } else if (error.code === 'failed-precondition') {
        errorMessage = "Chat service is not configured. Please contact support.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
      
      const errorMsg: Msg = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: errorMessage,
      };
      setMessages((prev) => [errorMsg, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>💊 Medication Assistant</Text>
          {userMedications.length > 0 && (
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              I know about {userMedications.length} of your medications
            </Text>
          )}
        </View>

        <FlatList
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[
              styles.bubble, 
              item.role === "user" 
                ? [styles.user, { backgroundColor: colors.primary }] 
                : [styles.ai, { backgroundColor: colors.surface }]
            ]}>
              <Text style={[
                styles.text, 
                item.role === "assistant" && { color: colors.textPrimary }
              ]}>
                {item.text}
              </Text>
            </View>
          )}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>AI is thinking...</Text>
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
            placeholder="Ask about medications, interactions, or schedules..."
            placeholderTextColor={colors.textTertiary}
            value={text}
            onChangeText={setText}
            editable={!loading}
            multiline
            maxLength={500}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[
              styles.btn, 
              { backgroundColor: colors.primary },
              (loading || !text.trim()) && styles.btnDisabled
            ]}
            onPress={send}
            disabled={loading || !text.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: {
    padding: DesignSystem.spacing.base,
    paddingTop: Platform.OS === 'ios' ? DesignSystem.spacing.sm : DesignSystem.spacing.lg,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: DesignSystem.typography.fontSize.xl,
    fontWeight: DesignSystem.typography.fontWeight.extrabold,
    marginBottom: DesignSystem.spacing.xs,
  },
  headerSubtitle: {
    fontSize: DesignSystem.typography.fontSize.xs,
  },
  listContent: {
    padding: DesignSystem.spacing.md,
    paddingBottom: DesignSystem.spacing.lg,
  },
  bubble: { 
    padding: DesignSystem.spacing.md, 
    borderRadius: DesignSystem.borderRadius.lg, 
    marginVertical: DesignSystem.spacing.xs, 
    maxWidth: "80%",
    ...DesignSystem.shadows.base,
  },
  user: { 
    alignSelf: "flex-end",
  },
  ai: { 
    alignSelf: "flex-start",
  },
  text: { 
    color: "#fff", 
    fontWeight: DesignSystem.typography.fontWeight.medium,
    fontSize: DesignSystem.typography.fontSize.base,
    lineHeight: DesignSystem.typography.lineHeight.normal * DesignSystem.typography.fontSize.base,
  },
  inputContainer: { 
    flexDirection: "row", 
    gap: DesignSystem.spacing.sm, 
    padding: DesignSystem.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? DesignSystem.spacing['2xl'] : DesignSystem.spacing.md,
    borderTopWidth: 1,
  },
  input: { 
    flex: 1, 
    borderRadius: DesignSystem.borderRadius.full, 
    paddingHorizontal: DesignSystem.spacing.base, 
    paddingVertical: DesignSystem.spacing.md,
    fontSize: DesignSystem.typography.fontSize.base,
    maxHeight: 100,
    borderWidth: 1,
    fontWeight: DesignSystem.typography.fontWeight.regular,
    ...DesignSystem.shadows.sm,
  },
  btn: { 
    borderRadius: DesignSystem.borderRadius.full, 
    paddingHorizontal: DesignSystem.spacing.lg, 
    paddingVertical: DesignSystem.spacing.md,
    justifyContent: "center",
    alignSelf: 'flex-end',
    ...DesignSystem.shadows.md,
  },
  btnDisabled: { 
    opacity: 0.5,
  },
  btnText: { 
    color: "#fff", 
    fontWeight: DesignSystem.typography.fontWeight.bold,
    fontSize: DesignSystem.typography.fontSize.base,
  },
  loadingContainer: { 
    padding: DesignSystem.spacing.md, 
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    gap: DesignSystem.spacing.sm,
  },
  loadingText: {
    fontSize: DesignSystem.typography.fontSize.sm,
  },
});
