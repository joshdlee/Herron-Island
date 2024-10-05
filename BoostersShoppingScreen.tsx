import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Alert,
} from "react-native";
import { useTheme, Chip } from "react-native-paper";
import { API, graphqlOperation } from 'aws-amplify';
import { listProductsWithSizes } from './src/graphql/customQueries';
import { CartContext } from './src/CartContext';
import { useFocusEffect } from '@react-navigation/native';

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  sizes: Size[];
}

interface Size {
  size: string;
  stock: number;
}

interface ListProductsResponse {
  data: {
    listProducts: {
      items: Product[];
    };
  };
}

const BoostersShoppingScreen = () => {
  const theme = useTheme();
  const { cart, addToCart } = useContext(CartContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: string }>({});
  const [animationValues, setAnimationValues] = useState<{ [key: string]: Animated.Value }>({});

  const fetchProducts = async () => {
    try {
      const productData = await API.graphql(graphqlOperation(listProductsWithSizes)) as ListProductsResponse;
      if (productData.data && productData.data.listProducts && productData.data.listProducts.items) {
        setProducts(productData.data.listProducts.items);
        const initialAnimationValues = productData.data.listProducts.items.reduce((acc, product) => {
          acc[product.id] = new Animated.Value(1);
          return acc;
        }, {} as { [key: string]: Animated.Value });
        setAnimationValues(initialAnimationValues);
      } else {
        console.log('Error: Unexpected data structure', productData);
      }
    } catch (error) {
      console.log('Error fetching products', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const getCartQuantity = (productId: string, size: string) => {
    return cart.filter(item => item.id === productId && item.size === size).length;
  };

  const handleAddToCart = (product: Product, size: string) => {
    const cartQuantity = getCartQuantity(product.id, size);
    const selectedProduct = product.sizes.find(s => s.size === size);

    if (selectedProduct && cartQuantity < selectedProduct.stock) {
      addToCart({ ...product, size });
      const animationValue = animationValues[product.id];
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Alert.alert('Stock limit reached', `Only ${selectedProduct?.stock} items available in stock.`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView>
        <Text style={styles(theme).note}>
          Note: Your purchase will be securely processed via the Boosters Square payment service. After you checkout, you'll receive a confirmation email. The Herron Island Boosters will follow up to arrange a convenient pickup for your merchandise on Herron Island. Thank you for your support!
        </Text>
        <View style={styles(theme).container}>
          {products.map((product) => (
            <View key={product.id} style={styles(theme).card}>
              <Image source={{ uri: product.imageUrl }} style={styles(theme).image} />
              <Text style={styles(theme).name}>{product.name}</Text>
              <Text style={styles(theme).price}>${product.price.toFixed(2)}</Text>
              <View style={styles(theme).sizesContainer}>
                {product.sizes.map((size) => (
                  size.stock > 0 && (
                    <Chip
                      key={size.size}
                      selected={selectedSize[product.id] === size.size}
                      onPress={() => setSelectedSize({ ...selectedSize, [product.id]: size.size })}
                      style={styles(theme).chip}
                    >
                      {size.size}
                    </Chip>
                  )
                ))}
              </View>
              {selectedSize[product.id] && (
                <TouchableOpacity
                  style={styles(theme).button}
                  onPress={() => handleAddToCart(product, selectedSize[product.id])}
                >
                  <Animated.Text
                    style={[styles(theme).buttonText, { transform: [{ scale: animationValues[product.id] }] }]}
                  >
                    Add to Cart
                  </Animated.Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = (theme: any) => {
  const screenWidth = Dimensions.get("window").width;
  const dynamicWidth = screenWidth * 0.45;
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      padding: 10,
    },
    card: {
      backgroundColor: theme.colors.surface,
      margin: 10,
      padding: 10,
      width: dynamicWidth,
      borderRadius: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      border: 0,
      borderWidth: 1,
      borderColor: theme.colors.primary
    },
    image: {
      width: dynamicWidth - 20,
      height: dynamicWidth - 20,
      borderRadius: 10,
    },
    name: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    price: {
      marginTop: 5,
      fontSize: 16,
      color: theme.colors.text,
    },
    sizesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginVertical: 10,
    },
    chip: {
      margin: 5,
      backgroundColor: theme.colors.primary
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: theme.colors.background,
      fontWeight: "bold",
    },
    note: {
      padding: 10,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      fontSize: 14,
      textAlign: "justify",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.accent,
    },
  });
};

export default BoostersShoppingScreen;
