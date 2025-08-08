import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        // TODO: Replace with API call
        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }
        await AsyncStorage.setItem("authToken", "my-secret-token");
        router.replace("/(tabs)");
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.inner}>
                    {/* Logo / Brand */}
                    <Text style={styles.logo}>🛒 OBATECH</Text>

                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Log in to continue shopping</Text>

                    {/* Email */}
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                    />

                    {/* Password */}
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        secureTextEntry
                    />

                    {/* Forgot Password */}
                    <TouchableOpacity
                        style={{ alignSelf: "flex-end", marginBottom: 20 }}
                        onPress={() => router.push("/auth/forgot-password")}
                    >
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>

                    {/* Register Link */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>{"Don't have an account? "}</Text>
                        <TouchableOpacity onPress={() => router.push("/auth/register")}>
                            <Text style={styles.registerLink}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    logo: {
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: "#f57c00",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#f3f4f6",
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    forgotText: {
        fontSize: 14,
        color: "#f57c00",
        fontWeight: "500",
    },
    button: {
        backgroundColor: "#f57c00",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    registerText: {
        fontSize: 14,
        color: "#6b7280",
    },
    registerLink: {
        fontSize: 14,
        fontWeight: "600",
        color: "#f57c00",
    },
});
