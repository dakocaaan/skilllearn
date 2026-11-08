
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import api from "../services/api";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadFavorites() {
        setLoading(true);
        setError("");

        try {
          const response = await api.get("/favorites");

          if (active) {
            setFavorites(
              (response.data.favorites || []).filter(
                (item) => item.material
              )
            );
          }
        } catch (err) {
          if (active) {
            setError("Unable to load your favorites.");
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      loadFavorites();

      return () => {
        active = false;
      };
    }, [])
  );

  const openMaterial = (materialId) => {
    navigation.navigate("MaterialDetail", {
      materialId
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={loading || error ? [] : favorites}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>My Favorites</Text>
            <Text style={styles.subtitle}>
              Your saved learning resources in one place.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openMaterial(item.material._id)}
          >
            <View style={styles.iconBox}>
              <Ionicons
                name="book-outline"
                size={25}
                color="#6945A5"
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.category}>
                {item.material.category} · {item.material.level}
              </Text>

              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.material.title}
              </Text>

              <Text style={styles.source}>
                {item.material.sourceName}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#958AA6"
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {loading ? (
              <ActivityIndicator size="large" color="#6945A5" />
            ) : (
              <>
                <Ionicons
                  name={error ? "alert-circle-outline" : "heart-outline"}
                  size={50}
                  color="#A78FC5"
                />
                <Text style={styles.emptyTitle}>
                  {error ? "Something went wrong" : "No favorites yet"}
                </Text>
                <Text style={styles.emptyDescription}>
                  {error || "Open a learning material and tap Add to Favorites."}
                </Text>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5FC"
  },
  content: {
    padding: 20,
    flexGrow: 1
  },
  header: {
    marginBottom: 25
  },
  title: {
    color: "#34245F",
    fontSize: 26,
    fontWeight: "800"
  },
  subtitle: {
    color: "#898397",
    fontSize: 13,
    marginTop: 8
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEE8F5",
    marginBottom: 13
  },
  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: "#EEE6FA",
    alignItems: "center",
    justifyContent: "center"
  },
  cardContent: {
    flex: 1
  },
  category: {
    color: "#805DB3",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 5
  },
  cardTitle: {
    color: "#34245F",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5
  },
  source: {
    color: "#898397",
    fontSize: 11
  },
  emptyState: {
    flex: 1,
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  emptyTitle: {
    color: "#34245F",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 16
  },
  emptyDescription: {
    color: "#898397",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 9
  }
});
