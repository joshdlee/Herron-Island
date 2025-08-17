import * as React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import GetSchedule from "./GetScheduleV2";
import GetPrototype from "./GetPrototype";
import GetSummer from "./GetSummer";
import GetWinter from "./GetWinter";
import GetCancellations from "./GetCancellations";
import GetHoliday from "./GetHoliday";

const { width } = Dimensions.get('window');

export default function FerryTabSimpleGlass() {
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
      default:
        return null;
    }
  };

  const renderGlassButton = (title: string, iconName: any, colors: string[]) => {
    const isActive = activeComponent === title;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setActiveComponent(title)}
        style={styles.buttonWrapper}
      >
        <LinearGradient
          colors={isActive ? colors : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.glassButton,
            isActive && styles.activeButton,
          ]}
        >
          <View style={[
            styles.glassOverlay,
            { backgroundColor: isActive ? 'rgba(0,188,212,0.1)' : 'rgba(255,255,255,0.05)' }
          ]}>
            <MaterialCommunityIcons
              name={iconName}
              size={20}
              color={isActive ? theme.colors.primary : theme.colors.onSurface}
            />
            <Text style={[
              styles.buttonText,
              { color: isActive ? theme.colors.primary : theme.colors.onSurface }
            ]}>
              {title}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.scrollContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.buttonContainer}
          style={styles.buttonScroll}
        >
          {renderGlassButton("Today", "calendar-today", ['rgba(0,188,212,0.3)', 'rgba(0,188,212,0.1)'])}
          {renderGlassButton("Prototype", "test-tube", ['rgba(156,39,176,0.3)', 'rgba(156,39,176,0.1)'])}
          {renderGlassButton("Summer", "white-balance-sunny", ['rgba(255,193,7,0.3)', 'rgba(255,193,7,0.1)'])}
          {renderGlassButton("Winter", "snowflake", ['rgba(33,150,243,0.3)', 'rgba(33,150,243,0.1)'])}
          {renderGlassButton("Low Tides", "wave", ['rgba(0,150,136,0.3)', 'rgba(0,150,136,0.1)'])}
          {renderGlassButton("Holidays", "party-popper", ['rgba(233,30,99,0.3)', 'rgba(233,30,99,0.1)'])}
        </ScrollView>
        <View style={[styles.scrollIndicator, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={16} 
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      </View>
      
      <View style={styles.contentWrapper}>
        {renderComponent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    position: 'relative',
  },
  buttonScroll: {
    maxHeight: 65,
    flexGrow: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 6,
  },
  buttonWrapper: {
    marginHorizontal: 2,
  },
  glassButton: {
    width: 75,
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
  },
  glassOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeButton: {
    shadowColor: "#00BCD4",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  scrollIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
});