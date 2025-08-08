import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = still checking

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🚀 Force logout every time app reloads during development
        await AsyncStorage.removeItem("authToken");  

        // If you want real checking later, comment above line and uncomment below:
        // const token = await AsyncStorage.getItem("authToken");
        // setIsAuthenticated(!!token);

        setIsAuthenticated(false); // Always false so login shows first
      } catch (error) {
        console.log("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (!loaded || isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="auth/index" /> 
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </>
  );
}
