import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppColors from '../constants/Colors';

const EmptyCart = () => {
    const router = useRouter();
  const scaleValue = React.useRef(new Animated.Value(0.8)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.emptyContainer,
        {
          opacity: opacityValue,
          transform: [{ scale: scaleValue }]
        }
      ]}
    >
      <View style={styles.cartIconContainer}>
        <MaterialIcons 
          name="remove-shopping-cart" 
          size={80} 
          color={AppColors.primary[300]} 
        />
        <View style={styles.circleBackground} />
      </View>
      
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven&#39;t added anything to your cart yet
      </Text>
      
      <TouchableOpacity 
      style={styles.continueButton}
      activeOpacity={0.8}
      onPress={() => router.push('/')} // or your homepage route
    >
      <Text style={styles.continueButtonText}>Browse Products</Text>
      <MaterialIcons 
        name="arrow-forward" 
        size={20} 
        color="white" 
        style={{ marginLeft: 8 }} 
      />
    </TouchableOpacity>
    </Animated.View>
  );
};
export default EmptyCart;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cartIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  circleBackground: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.primary[50],
    zIndex: -1,
    top: -20,
    left: -20,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: AppColors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: AppColors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
    lineHeight: 24,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 2,
  },
  continueButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});