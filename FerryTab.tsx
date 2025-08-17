import * as React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import TodayFerrySchedule from "./Today";
import SummerFerrySchedule from "./Summer";
import WinterFerrySchedule from "./Winter";
import LowTides from "./LowTides";
import HolidaySchedule from "./Holiday";
import GetSchedule from "./GetScheduleV2";
import GetPrototype from "./GetPrototype";
import GetSummer from "./GetSummer";
import GetWinter from "./GetWinter";
import GetCancellations from "./GetCancellations";
import GetHoliday from "./GetHoliday";
import AdminScreen from "./AdminScreen";
import AdminTab from "./AdminTab";

export default function FerryTab() {
  const theme = useTheme();
  const [activeComponent, setActiveComponent] = React.useState("Today");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Today":
        return <GetSchedule />;
      case "Prototype":
        return <GetPrototype />;
      case "Summer":
        return <GetSummer />;
      case "Winter":
        return <GetWinter />;
      case "Low Tides":
        return <GetCancellations />;
      case "Holidays":
        return <GetHoliday />;
      // case "Admin":
      //   return <AdminScreen onLoginSuccess={() => setActiveComponent('AdminTab')} />;
      // case "AdminTab":
      //   return <AdminTab />;
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
    style={styles.buttonContainer}
    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
  >
    {renderButton("Today", "calendar-today")}
    {renderButton("Prototype", "test-tube")}
    {renderButton("Summer", "weather-sunny")}
    {renderButton("Winter", "weather-snowy")}
    {renderButton("Low Tides", "waves")}
    {renderButton("Holidays", "calendar-star")}
    {/* {renderButton("Admin", "account-cog")} */}
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
    height: 40,  // Reduced from 50 to 40
    width: '100%',
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 2,  // Reduced from 5 to 2
    width: "100%",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 8,  // Reduced from 10 to 8
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
