// src/BoostersShoppingTab.tsx
import * as React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import BoostersShoppingScreen from "./BoostersShoppingScreen";
import CartScreen from "./CartScreen";

export default function BoostersShoppingTab() {
  const theme = useTheme();
  const [activeComponent, setActiveComponent] = React.useState("Products");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Products":
        return <BoostersShoppingScreen />;
      case "Cart":
        return <CartScreen />;
      default:
        return null;
    }
  };

  const renderButton = (title, iconName) => {
    const isActive = activeComponent === title;
    return (
      <TouchableOpacity
        style={[
          styles.iconButton,
          {
            backgroundColor: isActive
              ? theme.colors.primary
              : "rgba(0, 0, 0, 0.1)",
            opacity: isActive ? 1 : 0.6,
          },
        ]}
        onPress={() => setActiveComponent(title)}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={isActive ? "white" : theme.colors.primary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.scrollContainer}>
        <ScrollView 
          horizontal={true} 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.buttonContainer}
        >
          {renderButton("Products", "shopping")}
          {renderButton("Cart", "cart")}
        </ScrollView>
      </View>
      <View style={styles.componentContainer}>{renderComponent()}</View>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollContainer: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center align the buttons
    alignItems: "center",
    width: "100%",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5, // Add some space between buttons
  },
  componentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexShrink: 10,
    width: "100%",
    paddingHorizontal: 0,
  },
});
