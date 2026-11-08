
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function MaterialCard({ material, onPress }) {
  const isDutch = material.category === "Dutch";

  const fallbackImage = isDutch
    ? "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800"
    : "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: material.thumbnail || fallbackImage }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.typeBadge}>
          <Ionicons
            name={
              material.type === "video"
                ? "play-circle-outline"
                : "book-outline"
            }
            size={12}
            color="#6945A5"
          />
          <Text style={styles.typeText}>
            {material.type}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.category}>
          {material.category.toUpperCase()} · {material.level}
        </Text>

        <Text style={styles.title} numberOfLines={2}>
          {material.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {material.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.source} numberOfLines={1}>
            {material.sourceName}
          </Text>

          <Ionicons
            name="arrow-forward-circle-outline"
            size={20}
            color="#6945A5"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEE8F5",
    marginBottom: 16
  },
  imageWrapper: {
    height: 120,
    backgroundColor: "#EAE3F5"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  typeBadge: {
    position: "absolute",
    top: 9,
    right: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: "#FFFFFF"
  },
  typeText: {
    color: "#6945A5",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize"
  },
  content: {
    padding: 13
  },
  category: {
    color: "#805DB3",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 9
  },
  title: {
    color: "#34245F",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    minHeight: 40,
    marginBottom: 7
  },
  description: {
    color: "#898397",
    fontSize: 11,
    lineHeight: 17,
    minHeight: 34,
    marginBottom: 13
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: "#F0ECF5"
  },
  source: {
    flex: 1,
    color: "#918A9D",
    fontSize: 10
  }
});
