
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

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(
        name.trim(),
        email.trim().toLowerCase(),
        password
      );

      // Successful registration switches to Home.
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
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
        <View style={styles.header}>
          <View style={styles.logoIcon}>
            <Ionicons
              name="book-outline"
              size={29}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.heading}>Create Account</Text>

          <Text style={styles.subtitle}>
            Join SkillLearn and start your language learning journey.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#958AA6"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#A9A1B3"
              value={name}
              onChangeText={setName}
              autoComplete="name"
            />
          </View>

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
              placeholder="Create a password"
              placeholderTextColor="#A9A1B3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="new-password"
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#958AA6"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#958AA6"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#A9A1B3"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
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
              styles.registerButton,
              loading && styles.disabledButton
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.registerButtonText}>
                  Create Account
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginLink}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingVertical: 35
  },
  header: {
    alignItems: "center",
    marginBottom: 25
  },
  logoIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: "#6945A5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
  heading: {
    fontSize: 27,
    fontWeight: "800",
    color: "#34245F",
    marginBottom: 8
  },
  subtitle: {
    maxWidth: 280,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 21,
    color: "#8E859C"
  },
  card: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEE8F5"
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#403451",
    marginBottom: 9
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1,
    borderColor: "#E6E0EF",
    borderRadius: 10,
    paddingHorizontal: 13,
    marginBottom: 19
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    color: "#34245F",
    fontSize: 14
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    marginBottom: 17,
    borderRadius: 9,
    backgroundColor: "#FFF0F2"
  },
  errorText: {
    flex: 1,
    color: "#B64057",
    fontSize: 12
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 53,
    marginTop: 5,
    borderRadius: 10,
    backgroundColor: "#6945A5"
  },
  disabledButton: {
    opacity: 0.6
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700"
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24
  },
  loginText: {
    color: "#8E859C",
    fontSize: 13
  },
  loginLink: {
    color: "#6945A5",
    fontSize: 13,
    fontWeight: "800"
  }
});
