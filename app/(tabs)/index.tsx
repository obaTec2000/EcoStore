// HomeScreen.tsx

import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "@/components/HomeHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import AppColors from "@/constants/Colors";
import { useProductsStore } from "@/store/productStore";

export default function HomeScreen() {
  const router = useRouter();
  const {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
  } = useProductsStore();

  const [refreshing, setRefreshing] = useState(false);

  const featuredProducts = useMemo(() => [...products].reverse(), [products]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    await fetchCategories();
    setRefreshing(false);
  };

  const navigateToCategory = (category: string) => {
    router.push({
      pathname: "/(tabs)/shop",
      params: { category },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar />
      <HomeHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories?.length > 0 ? (
              categories.map((category) => (
                <TouchableOpacity
                  key={category.url}
                  style={styles.categoryButton}
                  onPress={() => navigateToCategory(`${category.name}`)}
                >
                  <AntDesign
                    name="tag"
                    size={16}
                    color={AppColors.primary[500]}
                  />
                  <Text style={styles.categoryText}>
                    {category?.name?.charAt(0)?.toUpperCase() + category?.name?.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No categories available</Text>
            )}
          </ScrollView>
        </View>

        {/* Featured Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/shop")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={featuredProducts}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredProducts}
            renderItem={({ item }) => (
              <View style={styles.featuredProductCard}>
                <ProductCard product={item} compact />
              </View>
            )}
          />
        </View>

        {/* Newest Arrivals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Newest Arrivals</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/shop")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <View key={product.id} style={styles.gridItem}>
                  <ProductCard product={product} customStyle={{ width: "100%" }} />
                </View>
              ))
            ) : (
              <Text>No products available</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ----------------- Styles -----------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.background.primary,
  },
  scrollContent: {
    paddingBottom: 300,
    paddingLeft: 20,
    paddingRight: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: AppColors.text.primary,
  },
  seeAllText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.primary[500],
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.background.secondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  categoryText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.text.primary,
    marginLeft: 8,
  },
  featuredProducts: {
    gap: 12,
  },
  featuredProductCard: {
    marginRight: 10,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  gridItem: {
    width: "48%",
  },
  errorText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: AppColors.error,
    textAlign: "center",
  },
});
