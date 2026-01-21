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
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../constants/DesignSystem";

interface DoseCardProps {
  item: Dose;
  onNotify: (dose: Dose) => void;
  onEdit: (dose: Dose) => void;
  onDelete: (dose: Dose) => void;
  onToggle: (dose: Dose) => void;
}

export default function DoseCard({ item, onNotify, onEdit, onDelete, onToggle }: DoseCardProps) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  const handleNotify = () => {
    console.log("DoseCard: Notify button pressed for", item.medName);
    onNotify(item);
  };

  return (
    <View style={[
      styles.card,
      { backgroundColor: colors.surface, borderColor: colors.border },
      !item.enabled && styles.cardDisabled
    ]}>
      <View style={styles.cardContent}>
        <View style={[styles.timeBadge, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.timeText, { color: colors.primary }]}>{item.time}</Text>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={[
              styles.title,
              { color: colors.textPrimary },
              !item.enabled && { color: colors.textTertiary }
            ]}>{item.medName}</Text>
            <TouchableOpacity 
              style={[
                styles.toggleBtn,
                item.enabled 
                  ? { backgroundColor: isDark ? '#065F46' : '#d1fae5' }
                  : { backgroundColor: isDark ? '#7F1D1D' : '#fee2e2' }
              ]}
              onPress={() => onToggle(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, { color: item.enabled ? (isDark ? '#D1FAE5' : '#065F46') : (isDark ? '#FCA5A5' : '#991B1B') }]}>
                {item.enabled ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          </View>
          {item.dose && (
            <Text style={[
              styles.dose,
              { color: colors.textSecondary },
              !item.enabled && { color: colors.textTertiary }
            ]}>{item.dose}</Text>
          )}
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} 
          onPress={handleNotify}
          activeOpacity={0.7}
        >
          <Text style={styles.actionBtnText}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]} 
          onPress={() => onEdit(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionBtnText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.actionBtn,
            styles.deleteBtn,
            { backgroundColor: isDark ? '#7F1D1D' : '#fee2e2', borderColor: isDark ? '#991B1B' : '#fecaca' }
          ]} 
          onPress={() => onDelete(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    padding: 16, 
    borderRadius: 16, 
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  timeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 70,
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "800",
  },
  infoSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: { 
    fontSize: 17, 
    fontWeight: "800",
    flex: 1,
  },
  dose: { 
    fontSize: 14,
    fontWeight: "500",
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: "800",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 8,
  },
  actionBtn: { 
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  deleteBtn: {
  },
  actionBtnText: { 
    fontSize: 16,
  },
});
