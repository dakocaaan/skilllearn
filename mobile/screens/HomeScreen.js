
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import MaterialCard from "../components/MaterialCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const categories = ["All", "Dutch", "Japanese"];

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const [materials, setMaterials] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMaterials() {
      setLoading(true);
      setError("");

      try {
        const params = {};

        if (category !== "All") {
          params.category = category;
        }

        if (search.trim()) {
          params.search = search.trim();
        }

        const response = await api.get("/materials", {
          params
        });

        if (!cancelled) {
          setMaterials(response.data.materials || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            "Unable to load learning materials."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(loadMaterials, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [category, search]);

  const refreshMaterials = async () => {
    setRefreshing(true);

    try {
      const params = {};

      if (category !== "All") {
        params.category = category;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await api.get("/materials", {
        params
      });

      setMaterials(response.data.materials || []);
      setError("");
    } catch (err) {
      setError("Unable to refresh learning materials.");
    } finally {
      setRefreshing(false);
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <View style={styles.logoIcon}>
            <Ionicons
              name="book-outline"
              size={22}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.brandText}>SkillLearn</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          accessibilityLabel="Log out"
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#6945A5"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeBanner}>
        <Text style={styles.welcomeLabel}>
          HELLO, {user?.name?.split(" ")[0]?.toUpperCase() || "STUDENT"}!
        </Text>

        <Text style={styles.welcomeTitle}>
          What will you learn today?
        </Text>

        <Text style={styles.welcomeDescription}>
          Explore Dutch and Japanese learning resources
          at your own pace.
        </Text>

        <View style={styles.bannerIcon}>
          <Ionicons
            name="library-outline"
            size={60}
            color="#E4D4FF"
          />
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>
          Explore Courses
        </Text>

        <Text style={styles.sectionSubtitle}>
          Find something interesting to learn.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#9B91A9"
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search learning materials..."
          placeholderTextColor="#A49BAE"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch("")}
            accessibilityLabel="Clear search"
          >
            <Ionicons
              name="close-circle"
              size={19}
              color="#A49BAE"
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              category === item && styles.activeFilter
            ]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.filterText,
                category === item && styles.activeFilterText
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!loading && !error && (
        <Text style={styles.resultsText}>
          {materials.length} learning materials found
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={loading || error ? [] : materials}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <MaterialCard
            material={item}
            onPress={() =>
              navigation.navigate("MaterialDetail", {
                materialId: item._id
              })
            }
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.statusContainer}>
            {loading ? (
              <>
                <ActivityIndicator
                  size="large"
                  color="#6945A5"
                />
                <Text style={styles.statusText}>
                  Loading courses...
                </Text>
              </>
            ) : error ? (
              <>
                <Ionicons
                  name="alert-circle-outline"
                  size={36}
                  color="#B64057"
                />
                <Text style={styles.statusText}>
                  {error}
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="search-outline"
                  size={36}
                  color="#9B8CAF"
                />
                <Text style={styles.statusText}>
                  No learning materials found.
                </Text>
              </>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={refreshMaterials}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5FC"
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 35
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 22,
    paddingBottom: 24
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  logoIcon: {
    width: 39,
    height: 39,
    borderRadius: 11,
    backgroundColor: "#6945A5",
    justifyContent: "center",
    alignItems: "center"
  },
  brandText: {
    fontSize: 21,
    fontWeight: "800",
    color: "#34245F"
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEE6FA",
    alignItems: "center",
    justifyContent: "center"
  },
  welcomeBanner: {
    minHeight: 205,
    borderRadius: 19,
    padding: 23,
    backgroundColor: "#6945A5",
    overflow: "hidden",
    marginBottom: 30
  },
  welcomeLabel: {
    color: "#E9DCFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 13
  },
  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    lineHeight: 32,
    maxWidth: 240
  },
  welcomeDescription: {
    color: "#E7DDF5",
    fontSize: 12,
    lineHeight: 19,
    maxWidth: 220,
    marginTop: 12
  },
  bannerIcon: {
    position: "absolute",
    right: 15,
    bottom: 10,
    opacity: 0.6
  },
  sectionHeading: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#34245F"
  },
  sectionSubtitle: {
    color: "#898397",
    fontSize: 12,
    marginTop: 6
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E8E1F0",
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    marginBottom: 18
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#34245F",
    fontSize: 13
  },
  filterRow: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 20
  },
  filterButton: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E1F0"
  },
  activeFilter: {
    backgroundColor: "#6945A5",
    borderColor: "#6945A5"
  },
  filterText: {
    color: "#80748F",
    fontSize: 12,
    fontWeight: "700"
  },
  activeFilterText: {
    color: "#FFFFFF"
  },
  resultsText: {
    color: "#918A9D",
    fontSize: 11,
    marginBottom: 16
  },
  gridRow: {
    justifyContent: "space-between"
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    gap: 12
  },
  statusText: {
    color: "#918A9D",
    fontSize: 13,
    textAlign: "center"
  }
});
