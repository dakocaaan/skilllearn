
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

export default function MaterialDetailScreen({ route, navigation }) {
  const { materialId } = route.params;

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMaterial() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/materials/${materialId}`
        );

        if (!cancelled) {
          setMaterial(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            "Unable to load this material."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMaterial();

    return () => {
      cancelled = true;
    };
  }, [materialId]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function checkFavorite() {
        try {
          const response = await api.get("/favorites");

          const saved = response.data.favorites.some(
            (item) => item.material?._id === materialId
          );

          if (active) {
            setIsFavorite(saved);
          }
        } catch (err) {
          console.error("Failed to load favorites:", err);
        }
      }

      checkFavorite();

      return () => {
        active = false;
      };
    }, [materialId])
  );

  const toggleFavorite = async () => {
    if (!material || favoriteLoading) return;

    setFavoriteLoading(true);

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${materialId}`);
        setIsFavorite(false);
      } else {
        await api.post("/favorites", {
          materialId
        });

        setIsFavorite(true);
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message ||
          "Unable to update Favorites."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const startLearning = async () => {
    if (!material || opening) return;

    const url = material.resourceUrl;

    // Allow only normal web links.
    if (!/^https?:\/\//i.test(url || "")) {
      Alert.alert(
        "Invalid link",
        "This learning resource has an invalid URL."
      );
      return;
    }

    setOpening(true);

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert(
          "Cannot open link",
          "Your device cannot open this resource."
        );
        return;
      }

      await Linking.openURL(url);

      // Record the activity only after the link opens.
      try {
        await api.post("/history", {
          materialId
        });
      } catch (historyError) {
        console.error(
          "Failed to record learning activity:",
          historyError
        );
      }
    } catch (err) {
      Alert.alert(
        "Error",
        "Unable to open the learning resource."
      );
    } finally {
      setOpening(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6945A5" />
        <Text style={styles.statusText}>
          Loading learning material...
        </Text>
      </View>
    );
  }

  if (error || !material) {
    return (
      <View style={styles.centered}>
        <Ionicons
          name="alert-circle-outline"
          size={45}
          color="#B64057"
        />

        <Text style={styles.errorTitle}>
          Material unavailable
        </Text>

        <Text style={styles.statusText}>
          {error || "Material not found."}
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            Back to Courses
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isDutch = material.category === "Dutch";

  const fallbackImage = isDutch
    ? "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200"
    : "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200";

  const infoRows = [
    ["Language", material.category],
    ["Difficulty", material.level],
    ["Content Type", material.type],
    ["Provider", material.sourceName],
    ["Access", material.isFree ? "Free" : "Check provider"]
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroWrapper}>
        <Image
          source={{
            uri: material.thumbnail || fallbackImage
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.tags}>
        <View style={[styles.tag, styles.primaryTag]}>
          <Ionicons
            name="globe-outline"
            size={14}
            color="#6945A5"
          />

          <Text style={styles.primaryTagText}>
            {material.category}
          </Text>
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagText}>
            {material.level}
          </Text>
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagText}>
            {material.type}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>
        {material.title}
      </Text>

      <Text style={styles.description}>
        {material.description}
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>
          Course Information
        </Text>

        {infoRows.map(([label, value]) => (
          <View style={styles.infoRow} key={label}>
            <Text style={styles.infoLabel}>
              {label}
            </Text>

            <Text style={styles.infoValue}>
              {value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <View style={styles.sectionTitleRow}>
          <Ionicons
            name="book-outline"
            size={21}
            color="#6945A5"
          />

          <Text style={styles.cardTitle}>
            About this Resource
          </Text>
        </View>

        <Text style={styles.bodyText}>
          {material.description}
        </Text>

        <Text style={styles.bodyText}>
          This resource is provided by {material.sourceName}.
          You can access the learning content through
          the original provider's website.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.sectionTitleRow}>
          <Ionicons
            name="checkmark-circle-outline"
            size={21}
            color="#6945A5"
          />

          <Text style={styles.cardTitle}>
            How to Get Started
          </Text>
        </View>

        <Text style={styles.stepText}>
          1. Review the material information.
        </Text>

        <Text style={styles.stepText}>
          2. Tap Start Learning.
        </Text>

        <Text style={styles.stepText}>
          3. Study on the original provider's website.
        </Text>

        <Text style={styles.stepText}>
          4. Return to SkillLearn for more resources.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.favoriteButton,
          isFavorite && styles.favoriteButtonSaved
        ]}
        onPress={toggleFavorite}
        disabled={favoriteLoading}
      >
        {favoriteLoading ? (
          <ActivityIndicator color="#6945A5" />
        ) : (
          <>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color="#6945A5"
            />

            <Text style={styles.favoriteButtonText}>
              {isFavorite
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.startButton,
          opening && styles.disabledButton
        ]}
        onPress={startLearning}
        disabled={opening}
      >
        {opening ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.startButtonText}>
              Start Learning
            </Text>

            <Ionicons
              name="open-outline"
              size={20}
              color="#FFFFFF"
            />
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.externalNote}>
        This resource opens on the original provider's website.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5FC"
  },
  content: {
    padding: 20,
    paddingBottom: 45
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    padding: 25,
    backgroundColor: "#F7F5FC"
  },
  statusText: {
    color: "#898397",
    fontSize: 14,
    textAlign: "center"
  },
  errorTitle: {
    color: "#34245F",
    fontSize: 20,
    fontWeight: "800"
  },
  backButton: {
    backgroundColor: "#6945A5",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 10
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  heroWrapper: {
    height: 215,
    borderRadius: 17,
    overflow: "hidden",
    backgroundColor: "#EAE3F5"
  },
  heroImage: {
    width: "100%",
    height: "100%"
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 22,
    marginBottom: 18
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEEAF3"
  },
  primaryTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EAE0F8"
  },
  tagText: {
    color: "#777083",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize"
  },
  primaryTagText: {
    color: "#6945A5",
    fontSize: 11,
    fontWeight: "800"
  },
  title: {
    color: "#34245F",
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 35,
    marginBottom: 14
  },
  description: {
    color: "#81788F",
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 25
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEE8F5",
    borderRadius: 15,
    padding: 22,
    marginBottom: 20
  },
  cardTitle: {
    color: "#34245F",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 18
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F0ECF5"
  },
  infoLabel: {
    color: "#918A9D",
    fontSize: 12
  },
  infoValue: {
    flexShrink: 1,
    color: "#403451",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    textTransform: "capitalize"
  },
  bodyText: {
    color: "#81788F",
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 12
  },
  stepText: {
    color: "#81788F",
    fontSize: 13,
    lineHeight: 25,
    marginBottom: 8
  },
  favoriteButton: {
    height: 54,
    borderWidth: 1,
    borderColor: "#CDBCE5",
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8
  },
  favoriteButtonSaved: {
    backgroundColor: "#EEE6FA",
    borderColor: "#6945A5"
  },
  favoriteButtonText: {
    color: "#6945A5",
    fontSize: 14,
    fontWeight: "800"
  },
  startButton: {
    height: 56,
    borderRadius: 11,
    backgroundColor: "#6945A5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 11,
    marginTop: 12
  },
  disabledButton: {
    opacity: 0.6
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800"
  },
  externalNote: {
    color: "#9A93A5",
    fontSize: 11,
    textAlign: "center",
    marginTop: 14,
    lineHeight: 18
  }
});
