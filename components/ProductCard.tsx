import AppColors from "@/constants/Colors";
import { useProductsStore } from "@/store/productStore";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import Toast from "react-native-toast-message";
import { Product } from "./../type";
import Button from "./Button";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  customStyle?: StyleProp<ViewStyle>;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  compact = false,
  customStyle,
}) => {
  const {addToCart} = useProductsStore()
  const { id, title, price, images, category } = product ?? {} ;
  const router = useRouter();
  const handleProductRoute = () => {
    router.push(`/product/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
    Toast.show({
      type: "success",
      text1: "Product added to cart",
      text2: `${title} has been added to your cart`,
      visibilityTime: 2000,
    });
  };

  return (
    <TouchableOpacity
      onPress={handleProductRoute}
      style={[styles.card, compact && styles.compactCard, customStyle]}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: Array.isArray(images) ? images[0] : images }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.category}>{category.name}</Text>

        <Text
          style={styles.title}
          numberOfLines={compact ? 1 : 2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.price, !compact && { marginBottom: 7 }]}>
            ${price.toFixed(2)}
          </Text>
          {!compact && (
            <Button
              onPress={handleAddToCart}
              title="Add to Cart"
              size="small"
              variant="outline"
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.background.primary,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
    width: "48%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.gray[200],
  },
  compactCard: {
    width: 150,
    marginRight: 12,
  },
  imageContainer: {
    position: "relative",
    height: 150,
    backgroundColor: AppColors.background.primary,
    padding: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderColor: AppColors.warning,
  },
  content: {
    padding: 12,
    backgroundColor: AppColors.background.secondary,
  },
  category: {
    fontSize: 12,
    color: AppColors.text.tertiary,
    textTransform: "capitalize",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  footer: {
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.primary[600],
  },
});
