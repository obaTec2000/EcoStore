// screens/ShopScreen.tsx
import ProductCard from '@/components/ProductCard';
import AppColors from '@/constants/Colors';
import { useProductsStore } from '@/store/productStore';
import { Product } from '@/type';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  FlatList,
  ScrollView, StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const mockProducts = [
  {
    id: '1',
    name: 'Button Blazer',
    price: 580,
    image: 'https://cdn.pixabay.com/photo/2016/03/23/04/01/blazer-1276669_1280.jpg',
  },
  {
    id: '2',
    name: 'Still Kelly',
    price: 280,
    image: 'https://cdn.pixabay.com/photo/2015/01/26/22/40/man-613601_960_720.jpg',
  },
  {
    id: '3',
    name: 'Dries Van Noten',
    price: 580,
    image: 'https://cdn.pixabay.com/photo/2018/05/20/21/19/fashion-3419829_960_720.jpg',
  },
  {
    id: '4',
    name: 'Wales Bonner',
    price: 280,
    image: 'https://cdn.pixabay.com/photo/2017/07/31/21/58/shoes-2563680_960_720.jpg',
  },
];

export default function ShopScreen() {
  //get incoming category from params
  const { category } = useLocalSearchParams<{ category: string }>();
  const { categories, products } = useProductsStore()
  const [error, setError] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [catUrl, setCatUrl] = React.useState<string | null>(category || null);


  React.useEffect(() => {
    const handleFectchCategories = async () => {
      try {
        if (!catUrl) return
        if (filteredProducts?.length > 0) setFilteredProducts([])
        setLoading(true)
        const request = await fetch(catUrl)
        const response = await request.json()
        setFilteredProducts(response?.products)
      }
      catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (catUrl) {
      handleFectchCategories()
    }
  }, [catUrl]);


  return (
    <View style={styles.container}>
      <TextInput placeholder="Search" style={styles.search} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories?.length > 0 ? (
          categories.map((category) => (
            <TouchableOpacity
              key={category.url}
              style={[styles.categoryButton, {backgroundColor: category.url === catUrl ? "#0a7ea4" : AppColors.background.primary}]}
              onPress={() => setCatUrl(category.url)}
            >
              <AntDesign
                name="tag"
                size={16}
                color={category.url === catUrl ? "white" : AppColors.primary[500]}
              />
              <Text style={[styles.categoryText, {color: category.url === catUrl ? "#0a7ea4" : AppColors.background.secondary}]}>
                {category?.name?.charAt(0)?.toUpperCase() + category?.name?.slice(1)}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No categories available</Text>
        )}
      </ScrollView>

      <FlatList
        data={catUrl ? filteredProducts : products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={{ marginHorizontal: 5, width: '48%' }}>
            <ProductCard product={item} compact />
          </View>
        )}
        ListEmptyComponent={
          <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>
            {loading ? 
            <Text style={styles.helpText}>Loading...</Text>
            : error ? 
            <Text style={[styles.helpText, {color: 'red'}]}>{error}</Text> : 
            <Text style={styles.helpText}>No Product Matches you filter</Text>
          }
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#F8F8F8' },
  search: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 10,
  },
  filters: { flexDirection: 'row', marginBottom: 10, gap: 10 },
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
  filterButton: {
    backgroundColor: '#FFD700', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 12, width: '48%',
  },
  productImage: { height: 100, borderRadius: 8, marginBottom: 6 },
  productName: { fontSize: 14, fontWeight: '500' },
  productPrice: { fontSize: 16, fontWeight: 'bold', marginVertical: 4 },
  cartButton: { alignItems: 'center', marginTop: 4 },
  cartButtonText: { fontSize: 20 },
  helpText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.text.primary
  }
});
