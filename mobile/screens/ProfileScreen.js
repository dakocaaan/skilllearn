
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalFavorites: 0,
    totalStarted: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadProfile() {
        setLoading(true);
        setError("");

        try {
          const response = await api.get("/profile");

          if (active) {
            setProfile(response.data.user);
            setStats(response.data.stats);
          }
        } catch (err) {
          if (active) {
            setError("Unable to load profile statistics.");
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      loadProfile();

      return () => {
        active = false;
      };
    }, [])
  );

  const confirmLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: logout
        }
      ]
    );
  };

  const displayUser = profile || user;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>My Profile</Text>
      <Text style={styles.subtitle}>
        Manage your SkillLearn account.
      </Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons
            name="person-outline"
            size={38}
            color="#6945A5"
          />
        </View>

        <Text style={styles.name}>
          {displayUser?.name || "Student"}
        </Text>

        <Text style={styles.email}>
          {displayUser?.email || ""}
        </Text>

        <View style={styles.studentBadge}>
          <Text style={styles.studentBadgeText}>
            SkillLearn Student
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Learning Overview
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6945A5"
          style={{ marginVertical: 25 }}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons
              name="book-outline"
              size={23}
              color="#6945A5"
            />
            <Text style={styles.statNumber}>
              {stats.totalMaterials}
            </Text>
            <Text style={styles.statLabel}>
              Courses
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="heart-outline"
              size={23}
              color="#6945A5"
            />
            <Text style={styles.statNumber}>
              {stats.totalFavorites}
            </Text>
            <Text style={styles.statLabel}>
              Favorites
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="time-outline"
              size={23}
              color="#6945A5"
            />
            <Text style={styles.statNumber}>
              {stats.totalStarted}
            </Text>
            <Text style={styles.statLabel}>
              Started
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Account Information
      </Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons
            name="person-outline"
            size={19}
            color="#805DB3"
          />
          <View>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>
              {displayUser?.name}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons
            name="mail-outline"
            size={19}
            color="#805DB3"
          />
          <View>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue}>
              {displayUser?.email}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={confirmLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color="#B64057"
        />

        <Text style={styles.logoutText}>
          Log Out
        </Text>
      </TouchableOpacity>
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
    paddingBottom: 40
  },
  heading: {
    color: "#34245F",
    fontSize: 26,
    fontWeight: "800"
  },
  subtitle: {
    color: "#898397",
    fontSize: 13,
    marginTop: 7,
    marginBottom: 25
  },
  profileCard: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#EEE8F5",
    marginBottom: 30
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#EEE6FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15
  },
  name: {
    color: "#34245F",
    fontSize: 21,
    fontWeight: "800"
  },
  email: {
    color: "#898397",
    fontSize: 13,
    marginTop: 7
  },
  studentBadge: {
    backgroundColor: "#EEE6FA",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 15
  },
  studentBadgeText: {
    color: "#6945A5",
    fontSize: 11,
    fontWeight: "800"
  },
  sectionTitle: {
    color: "#34245F",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 15
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: 9,
    paddingVertical: 19,
    paddingHorizontal: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEE8F5",
    borderRadius: 12
  },
  statNumber: {
    color: "#34245F",
    fontSize: 23,
    fontWeight: "800"
  },
  statLabel: {
    color: "#898397",
    fontSize: 11
  },
  infoCard: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEE8F5"
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 8
  },
  infoLabel: {
    color: "#918A9D",
    fontSize: 11,
    marginBottom: 5
  },
  infoValue: {
    color: "#34245F",
    fontSize: 14,
    fontWeight: "700"
  },
  divider: {
    height: 1,
    backgroundColor: "#F0ECF5",
    marginVertical: 15
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#F0C8D0",
    borderRadius: 11,
    backgroundColor: "#FFF3F5"
  },
  logoutText: {
    color: "#B64057",
    fontSize: 14,
    fontWeight: "800"
  },
  errorText: {
    color: "#B64057",
    marginBottom: 25
  }
});
