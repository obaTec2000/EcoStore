import AppColors from '@/constants/Colors';
import { useProductsStore } from '@/store/productStore';
import { Product } from '@/type';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../Button';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ product }: {product: Product}) => {
    const [quantity, setQuantity] = useState(1);
      const {addToCart} = useProductsStore()
        const {title } = product ?? {} ;

    
      const handleAddToCart = () => {
        addToCart(product);
        Toast.show({
          type: "success",
          text1: "Product added to cart",
          text2: `${title} has been added to your cart`,
          visibilityTime: 2000,
        });
      };

    const handleQuantityChange = (value: number) => {
        const newQuantity = quantity + value;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
                <View style={{ flex: 1 }}>
                    {/* Product Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: product.images[0] }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Product Info */}
                    <View style={styles.content}>
                        <Text style={styles.category}>{product.category.name}</Text>
                        <Text style={styles.title}>{product.title}</Text>

                        <View style={styles.ratingContainer}>
                            {/* <StarRating rating={product.rating.rate} size={20} /> */}
                            <Text style={styles.ratingText}>({product.rating.count} reviews)</Text>
                        </View>

                        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Action Bar */}
            <View style={styles.actionBar}>
                <View style={styles.quantitySelector}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(-1)}
                    >
                        <Icon name="remove" size={20} color={AppColors.primary[500]} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(1)}
                    >
                        <Icon name="add" size={20} color={AppColors.primary[500]} />
                    </TouchableOpacity>
                </View>

                <Button
                    title="Add to Cart"
                    onPress={handleAddToCart}
                    style={styles.addButton}
                    textStyle={styles.addButtonText}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background.primary,
    },
    scrollContent: {
        paddingBottom: 80, // Space for action bar
    },
    imageContainer: {
        height: width * 0.8,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        paddingHorizontal: 16,
    },
    category: {
        fontSize: 14,
        color: AppColors.text.tertiary,
        textTransform: 'capitalize',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: AppColors.text.primary,
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingText: {
        marginLeft: 8,
        color: AppColors.text.secondary,
    },
    price: {
        fontSize: 28,
        fontWeight: '700',
        color: AppColors.primary[500],
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: AppColors.text.secondary,
        marginBottom: 20,
    },
    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: AppColors.gray[200],
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppColors.gray[100],
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        width: 40,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        flex: 1,
        marginLeft: 16,
        backgroundColor: AppColors.primary[500],
    },
    addButtonText: {
        color: 'white',
    },
});

export default ProductDetailScreen;