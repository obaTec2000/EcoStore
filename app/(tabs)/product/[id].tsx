import ProductDetailScreen from "@/components/ui/ProductDetailScreen";
import AppColors from "@/constants/Colors";
import { getProduct } from "@/lib/api";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CommonHeader from "../../../components/CommonHeader";
import { Product } from "../../../type";

const SingleProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idNum = Number(id);
  
  
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const data = await getProduct(idNum);
        setProduct(data);
      } catch (error) {
        setError("Failed to fetch product data");
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    // if (id) {
    //   fetchProductData();
    // }
  }, [id]);

  console.log(product, "product");

  return (
    <View
      style={styles.container}
    >
      <CommonHeader />
      <View style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : product ? (
          <ProductDetailScreen product={product} />
        ) : null}
      </View>
      </View>
  );
};

export default SingleProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  }
});
