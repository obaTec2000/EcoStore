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
import ProductCard from '../../components/ProductCard';
import AppColors from '../../constants/Colors';
import { useProductsStore } from '../../store/productStore';
import { Product } from '../../type';

export default function ShopScreen() {
  // Get incoming category from params with proper type handling
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { categories, products } = useProductsStore();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(category || null);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Combined products based on active category
  const displayedProducts = activeCategory ? filteredProducts : products;

  // Filter products based on search query
  const searchedProducts = React.useMemo(() => {
    if (!searchQuery) return displayedProducts;

    return displayedProducts.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [displayedProducts, searchQuery]);

  React.useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!activeCategory) return;

      try {
        setError("");
        setLoading(true);

        const response = await fetch(activeCategory);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFilteredProducts(data?.products || []);
      } catch (error: any) {
        setError(error.message || "Failed to fetch products");
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [activeCategory]);

  const handleCategoryPress = (url: string) => {
    setActiveCategory(prev => prev === url ? null : url);
  };

  return (
    <View style={styles.container}>
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
        {categories?.length > 0 ? (
          categories.map((category) => (
            <TouchableOpacity
              key={category.url}
              style={[
                styles.categoryButton,
                category.url === activeCategory && styles.activeCategoryButton,
                {
                  // Dynamic border color if needed
                  borderColor: category.url === activeCategory
                    ? AppColors.primary[500]
                    : AppColors.primary[300]
                }
              ]}
              onPress={() => handleCategoryPress(category.url)}
              activeOpacity={0.7} // Better press feedback
            >
              <AntDesign
                name="tag"
                size={16}
                style={styles.categoryIcon}
                color={
                  category.url === activeCategory
                    ? "white"
                    : AppColors.primary[500]
                }
              />
              <Text style={[
                styles.categoryText,
                category.url === activeCategory
                  ? styles.activeCategoryText
                  : styles.inactiveCategoryText
              ]}>
                {category.name?.charAt(0)?.toUpperCase() + category.name?.slice(1)}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.helpText}>No categories available</Text>
        )}
      </ScrollView>

      {/* Products List */}
      {loading && !filteredProducts.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={searchedProducts}
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
                <Text style={[styles.helpText, { color: AppColors.error }]}>
                  {error}
                </Text>
              ) : (
                <Text style={styles.helpText}>
                  {searchQuery
                    ? "No products match your search"
                    : "No products available"}
                </Text>
              )}
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    backgroundColor: AppColors.background.primary,
    gap: 14,
  },
  search: {
    borderWidth: 1,
    borderColor: AppColors.primary[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 12,
    color: AppColors.text.primary,
    backgroundColor: AppColors.background.secondary,
  },
  categoriesContainer: {
    paddingVertical: 8,
    gap: 12,
  },
 categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center', // Ensures content stays centered
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: AppColors.primary[300],
    backgroundColor: AppColors.background.secondary,
    minHeight: 40, // Minimum touch target size
    minWidth: 80, // Minimum width to prevent squeezing
  },

  activeCategoryButton: {
    backgroundColor: AppColors.primary[500],
    borderColor: AppColors.primary[500],
  },
  categoryText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13, // Slightly larger than 12
    marginLeft: 6,
    paddingVertical: 2, // Prevents text cutting
    includeFontPadding: false, // Removes extra padding around text
    textAlignVertical: 'center', // Better vertical alignment
  },

  activeCategoryText: {
    color: "white",
  },
  inactiveCategoryText: {
    color: AppColors.text.primary,
  },
  categoryIcon: {
    marginRight: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  columnWrapper: {
    gap: 16,
    paddingHorizontal: 8,
  },
  listContentContainer: {
    paddingBottom: 24,
    paddingTop: 8,
    gap: 16,
  },
  productContainer: {
    flex: 1,
    minWidth: '48%',
    maxWidth: '48%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  helpText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});