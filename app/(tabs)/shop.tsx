// screens/ShopScreen.tsx
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import AppColors from '../../constants/Colors';
import { useProductsStore } from '../../store/productStore';
import { Product } from '../../type';

export default function ShopScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { categories, products, fetchProducts, loading: productLoading, page } = useProductsStore();

  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(category || null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchedProducts, setSearchedProducts] = React.useState<Product[]>([]);

  const displayedProducts = activeCategory ? filteredProducts : products;

  // Fetch products by category
  React.useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!activeCategory) return;
      try {
        if (error) setError("");
        setLoading(true);
        const response = await fetch(activeCategory);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setFilteredProducts(data?.products || []);
      } catch (error: any) {
        setError(error.message || "Failed to fetch products");
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (activeCategory) {
      fetchCategoryProducts();
    }
    fetchCategoryProducts();
  }, [activeCategory]);

  // Debounced API search
  React.useEffect(() => {
    const handler = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchedProducts(displayedProducts);
        return;
      }
      try {
        setError("");
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSearchedProducts(data?.products || []);
      } catch (error: any) {
        setError(error.message || "Failed to search products");
        setSearchedProducts([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, displayedProducts]);

  const handleCategoryPress = (url: string) => {
    setActiveCategory(prev => prev === url ? null : url);
  };

  const loadMore = () => {
    if (!activeCategory && !searchQuery && !productLoading) {
      const nextPage = page + 1;
      fetchProducts(nextPage);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <TextInput
        placeholder="Search"
        style={styles.search}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={AppColors.text.secondary}
      />

      {/* Categories Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {categories?.length > 0 ? (
            categories.map((category) => (
              <TouchableOpacity
                key={category.url}
                style={[
                  styles.categoryButton,
                  category.url === activeCategory && styles.activeCategoryButton,
                  { borderColor: category.url === activeCategory ? AppColors.primary[500] : AppColors.primary[300] }
                ]}
                onPress={() => handleCategoryPress(category.url)}
                activeOpacity={0.7}
              >
                <AntDesign
                  name="tag"
                  size={16}
                  style={styles.categoryIcon}
                  color={category.url === activeCategory ? "white" : AppColors.primary[500]}
                />
                <Text style={[
                  styles.categoryText,
                  category.url === activeCategory ? styles.activeCategoryText : styles.inactiveCategoryText
                ]}>
                  {category.name?.charAt(0)?.toUpperCase() + category.name?.slice(1)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.helpText}>No categories available</Text>
          )}
        </View>
      </ScrollView>

      {/* Products List */}
      {loading && !(searchQuery ? searchedProducts.length : displayedProducts.length) ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={searchQuery ? searchedProducts : displayedProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <ProductCard product={item} compact />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {error ? (
                <Text style={[styles.helpText, { color: AppColors.error }]}>{error}</Text>
              ) : (
                <Text style={styles.helpText}>
                  {searchQuery
                    ? "No products match your search"
                    : "No products available"}
                </Text>
              )}
            </View>
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.9}
          ListFooterComponent={
            productLoading ? <ActivityIndicator size="large" style={{ margin: 20 }} /> : null
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 26, backgroundColor: AppColors.background.primary, gap: 14 },
  search: {
    borderWidth: 1, borderColor: AppColors.primary[300], borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 12,
    color: AppColors.text.primary, backgroundColor: AppColors.background.secondary,
  },
  categoriesContainer: { paddingVertical: 8, gap: 12 },
  categoryButton: {
    flexDirection: "row", alignItems: "center", justifyContent: 'center',
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1.5,
    backgroundColor: AppColors.background.secondary, minHeight: 40, minWidth: 80, maxHeight: 80,
  },
  activeCategoryButton: { backgroundColor: AppColors.primary[500], borderColor: AppColors.primary[500] },
  categoryText: { fontFamily: "Inter-SemiBold", fontSize: 13, marginLeft: 6, paddingVertical: 2 },
  activeCategoryText: { color: "white" },
  inactiveCategoryText: { color: AppColors.text.primary },
  categoryIcon: { marginRight: 6 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  columnWrapper: { gap: 16, paddingHorizontal: 8 },
  listContentContainer: { paddingBottom: 24, paddingTop: 8, gap: 16 },
  productContainer: { flex: 1, minWidth: '48%', maxWidth: '48%' },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  helpText: { fontFamily: "Inter-Medium", fontSize: 14, color: AppColors.text.secondary, textAlign: 'center', lineHeight: 20 },
});
