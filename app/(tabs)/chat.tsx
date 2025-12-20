import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Msg = { id: string; role: "user" | "assistant"; text: string };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m1", role: "assistant", text: "Hi! Ask me about your medications or schedule." },
  ]);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: String(Date.now()), role: "user", text: text.trim() };
    setMessages((prev) => [userMsg, ...prev]);
    setText("");

    setTimeout(() => {
      setMessages((prev) => [
        { id: String(Date.now() + 1), role: "assistant", text: "MVP UI only — we’ll connect real AI next." },
        ...prev,
      ]);
    }, 400);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === "user" ? styles.user : styles.ai]}>
            <Text style={[styles.text, item.role === "assistant" && { color: "#111" }]}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="Type a message..." value={text} onChangeText={setText} />
        <TouchableOpacity style={styles.btn} onPress={send}>
          <Text style={styles.btnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6", padding: 12 },
  bubble: { padding: 12, borderRadius: 14, marginVertical: 6, maxWidth: "85%" },
  user: { alignSelf: "flex-end", backgroundColor: "#111" },
  ai: { alignSelf: "flex-start", backgroundColor: "white" },
  text: { color: "white", fontWeight: "600" },
  row: { flexDirection: "row", gap: 10, paddingVertical: 10 },
  input: { flex: 1, backgroundColor: "white", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 },
  btn: { backgroundColor: "#111", borderRadius: 12, paddingHorizontal: 14, justifyContent: "center" },
  btnText: { color: "white", fontWeight: "800" },
});
