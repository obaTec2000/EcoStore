import {
  Feather,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppColors from "../constants/Colors";
import { useProductsStore } from "../store/productStore";

interface Props {
  isFav?: boolean;
  showCart?: boolean;
  handleToggleFavorite?: () => void;
}

const CommonHeader = ({ isFav, showCart, handleToggleFavorite }: Props) => {
  const { cart } = useProductsStore();
  const router = useRouter();
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Feather name="arrow-left" size={20} color={AppColors.text.primary} />
      </TouchableOpacity>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => router.push("/(tabs)/cart")}
        >
          <MaterialCommunityIcons
            name="cart-outline"
            size={20}
            color={AppColors.primary[700]}
          />
          <View style={styles.itemsView}>
            <Text style={styles.itemsText}>{cart.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  searchButton: {
    backgroundColor: AppColors.primary[50],
    borderRadius: 5,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: AppColors.primary[500],
    position: "relative",
  },
  itemsView: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 50,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: AppColors.primary[500],
    backgroundColor: AppColors.background.primary,
  },
  itemsText: {
    fontSize: 10,
    color: AppColors.accent[500],
    fontWeight: 800,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonView: {
    flexDirection: "row",
    alignItems: "center",
  },
});
