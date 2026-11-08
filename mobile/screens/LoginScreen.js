
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
      // App.js automatically switches to Home.
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons
              name="book-outline"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.logoText}>SkillLearn</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Welcome Back!</Text>

          <Text style={styles.subtitle}>
            Sign in to continue your learning journey.
          </Text>

          <Text style={styles.label}>Email Address</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#958AA6"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#A9A1B3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <Text style={styles.label}>Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#958AA6"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#A9A1B3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="current-password"
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color="#958AA6"
              />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color="#B64057"
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.disabledButton
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>
                  Sign In
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              Don't have an account?{" "}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.registerLink}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Learn Dutch and Japanese with SkillLearn
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F3FB"
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 55
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32
  },
  logoIcon: {
    width: 66,
    height: 66,
    borderRadius: 19,
    backgroundColor: "#6945A5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14
  },
  logoText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#34245F"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 25,
    borderWidth: 1,
    borderColor: "#EEE8F5"
  },
  heading: {
    fontSize: 27,
    fontWeight: "800",
    color: "#34245F",
    marginBottom: 9
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#8E859C",
    marginBottom: 30
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#403451",
    marginBottom: 10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    borderWidth: 1,
    borderColor: "#E6E0EF",
    borderRadius: 11,
    paddingHorizontal: 14,
    marginBottom: 22,
    backgroundColor: "#FFFFFF"
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 11,
    color: "#34245F",
    fontSize: 14
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#FFF0F2",
    borderRadius: 9,
    padding: 12,
    marginBottom: 18
  },
  errorText: {
    flex: 1,
    color: "#B64057",
    fontSize: 12
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    backgroundColor: "#6945A5",
    borderRadius: 11,
    marginTop: 5
  },
  disabledButton: {
    opacity: 0.6
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700"
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 26
  },
  registerText: {
    color: "#8E859C",
    fontSize: 13
  },
  registerLink: {
    color: "#6945A5",
    fontSize: 13,
    fontWeight: "800"
  },
  footer: {
    textAlign: "center",
    marginTop: 28,
    color: "#9A91A7",
    fontSize: 12
  }
});
