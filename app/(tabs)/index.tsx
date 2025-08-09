// HomeScreen.tsx

import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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

import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import AppColors from "@/constants/Colors";
import { useProductsStore } from "@/store/productStore";
import HomeHeader from "../../components/HomeHeader";

export default function HomeScreen() {
  const router = useRouter();
  const {
    products,
    categories,
    loading,
    error,
    page,
    total,
    fetchProducts,
    fetchCategories,
  } = useProductsStore();
  const loadingPage = useRef<boolean>(false)
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

  if (loading && products.length === 0) {
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

  const loadMoreProducts = async () => {
    if (!loading && products.length < total && !loadingPage.current) {
      loadingPage.current = true
      const nextPage = page + 1
      await fetchProducts(nextPage);
      loadingPage.current = false
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <HomeHeader />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListHeaderComponent={
          <>
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
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ProductCard product={item} customStyle={{ width: "100%" }} />
          </View>
        )}
        ListEmptyComponent={
          <Text>No products available</Text>
        }
        contentContainerStyle={styles.scrollContent}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.9}
        ListFooterComponent={
          loading ? <LoadingSpinner /> : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
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
