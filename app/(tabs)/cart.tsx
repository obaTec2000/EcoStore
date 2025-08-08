import EmptyCart from "@/components/Empty";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AppColors from "../../constants/Colors";
import { useProductsStore } from "../../store/productStore";

const CartScreen = () => {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, reduceProductQuantity } = useProductsStore();

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  const getTotalDiscountPrice = () => {
    return cart.reduce((total, item) => {
      const discount = (item.price * item.discountPercentage) / 100;
      return total + (item.price - discount) * (item.quantity || 1);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>View Cart</Text>

      <View style={{ flex: 1 }}>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Pressable onPress={() => router.push(`/product/${item.id}`)}>
                <Image source={{ uri: item.images[0] }} style={styles.image} />
              </Pressable>
              <Pressable onPress={() => router.push(`/product/${item.id}`)} style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.title}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                  {item.discountPercentage > 0 && (
                    <Text style={styles.oldPrice}>
                      ${(
                        item.price +
                        (item.price * item.discountPercentage) / 100
                      ).toFixed(2)}
                    </Text>
                  )}
                </View>
                {item.timestamp && <Text style={styles.timestamp}>🕓 {new Date(item?.timestamp).toLocaleTimeString()}</Text>}
              </Pressable>

              <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5}}>
                <TouchableOpacity
                  style={styles.trashIcon}
                  onPress={() => removeFromCart(item.id)}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color={AppColors.primary[700]}
                  />
                </TouchableOpacity>

                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    onPress={() => reduceProductQuantity(item.id)}
                  >
                    <Entypo name="minus" size={18} color={AppColors.primary[700]} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => addToCart(item)}
                  >
                    <Entypo name="plus" size={18} color={AppColors.primary[700]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <EmptyCart />
          }
        />
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text>Item Amount</Text>
          <Text>${getTotalAmount().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Discount</Text>
          <Text>${getTotalDiscountPrice().toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.totalText}>
            ${getTotalAmount().toFixed(2)}
          </Text>
        </View>
      </View>

      {cart.length > 0 && (
        <TouchableOpacity style={styles.shippingButton}>
          <Text style={styles.shippingText}>Shipping</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: AppColors.background.primary,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.primary[600],
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    position: "relative",
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 10,
    resizeMode: "contain",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontWeight: "600",
    fontSize: 14,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  price: {
    fontWeight: "700",
    color: AppColors.primary[700],
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: AppColors.gray[400],
  },
  timestamp: {
    fontSize: 12,
    color: AppColors.gray[500],
    marginTop: 2,
  },
  trashIcon: {

  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: AppColors.primary[500],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 50,
  },
  quantityText: {
    fontWeight: "600",
    color: AppColors.primary[600],
  },
  couponRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    padding: 12,
    backgroundColor: AppColors.primary[50],
    borderRadius: 10,
  },
  couponText: {
    fontWeight: "600",
  },
  summaryBox: {
    backgroundColor: AppColors.gray[100],
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalRow: {
    marginTop: 10,
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  shippingButton: {
    backgroundColor: AppColors.primary[600],
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  shippingText: {
    color: "#fff",
    fontWeight: "700",
  },
});
