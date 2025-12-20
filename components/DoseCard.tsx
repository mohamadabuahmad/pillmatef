// import React from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import type { Dose } from "../constants/types";

// export default function DoseCard({
//   item,
//   onNotify,
// }: {
//   item: Dose;
//   onNotify: (dose: Dose) => void;
// }) {
//   return (
//     <View style={styles.card}>
//       <View style={{ flex: 1 }}>
//         <Text style={styles.title}>{item.medName}</Text>
//         <Text style={styles.sub}>{item.dose} • {item.time}</Text>
//         <Text style={[styles.badge, item.enabled ? styles.on : styles.off]}>
//           {item.enabled ? "Enabled" : "Disabled"}
//         </Text>
//       </View>

//       <TouchableOpacity style={styles.btn} onPress={() => onNotify(item)}>
//         <Text style={styles.btnText}>Notify</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: { padding: 14, borderRadius: 14, backgroundColor: "#fff", marginBottom: 12, flexDirection: "row", gap: 12, alignItems: "center" },
//   title: { fontSize: 16, fontWeight: "800" },
//   sub: { marginTop: 4, color: "#555" },
//   badge: { marginTop: 8, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
//   on: { backgroundColor: "#e7f7ef", color: "#0f7a3a" },
//   off: { backgroundColor: "#eee", color: "#444" },
//   btn: { backgroundColor: "#111", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
//   btnText: { color: "white", fontWeight: "800" },
// });




import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Dose } from "../constants/types";

export default function DoseCard({ item, onNotify }: { item: Dose; onNotify: (dose: Dose) => void }) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.medName}</Text>
        <Text style={styles.sub}>
          {item.dose ? `${item.dose} • ` : ""}{item.time}
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => onNotify(item)}>
        <Text style={styles.btnText}>Notify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 14, backgroundColor: "#fff", marginBottom: 12, flexDirection: "row", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "800" },
  sub: { marginTop: 4, color: "#555" },
  btn: { backgroundColor: "#111", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: "white", fontWeight: "800" },
});
