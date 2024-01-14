import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import EditCancelations from './EditCancelations';

function AdminTab() {
  const theme = useTheme();
  const [activeComponent, setActiveComponent] = useState("Summer");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Summer":
        // Return Summer Component
        return <Text>Summer Schedule</Text>;
      case "Winter":
        // Return Winter Component
        return <Text>Winter Schedule</Text>;
      case "Cancelations":
        // Cancelations Component
        return <EditCancelations />;
      case "Holidays":
        // Return Holidays Component
        return <Text>Holiday Schedule</Text>;
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
            backgroundColor: isActive ? 'lightcoral' : "rgba(0, 0, 0, 0.1)", // Light red background
            opacity: isActive ? 1 : 0.6,
          },
        ]}
        onPress={() => setActiveComponent(title)}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={isActive ? "white" : "coral"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <View style={styles.scrollContainer}>
        <ScrollView 
          horizontal={true} 
          showsHorizontalScrollIndicator={false} 
          style={styles.buttonContainer}
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        >
          {renderButton("Summer", "weather-sunny")}
          {renderButton("Winter", "weather-snowy")}
          {renderButton("Cancelations", "waves")}
          {renderButton("Holidays", "calendar-star")}
        </ScrollView>
      </View>
      <View style={styles.componentContainer}>{renderComponent()}</View>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  scrollContainer: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 5,
    width: "100%",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: screenWidth / 4 - 20,
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

export default AdminTab;
