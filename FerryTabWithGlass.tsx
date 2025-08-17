import * as React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import LiquidGlass from "./LiquidGlass";
import GetSchedule from "./GetScheduleV2";
import GetPrototype from "./GetPrototype";
import GetSummer from "./GetSummer";
import GetWinter from "./GetWinter";
import GetCancellations from "./GetCancellations";
import GetHoliday from "./GetHoliday";

const { width } = Dimensions.get('window');

export default function FerryTabWithGlass() {
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
      <View style={styles.buttonWrapper}>
        <LiquidGlass
          style={[
            styles.glassButton,
            isActive && styles.activeButton,
          ]}
          blurIntensity={isActive ? 30 : 20}
          borderRadius={16}
          elasticity={0.35}
          displacementScale={15}
          gradientColors={isActive ? colors : ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
          glassColor={isActive ? 'rgba(0,188,212,0.15)' : 'rgba(255,255,255,0.1)'}
          disableDrag={true}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveComponent(title)}
            style={styles.touchableContent}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name={iconName}
                size={28}
                color={isActive ? theme.colors.primary : theme.colors.onSurface}
              />
              <Text style={[
                styles.buttonText,
                { color: isActive ? theme.colors.primary : theme.colors.onSurface }
              ]}>
                {title}
              </Text>
            </View>
          </TouchableOpacity>
        </LiquidGlass>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
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
      
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          {renderComponent()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonScroll: {
    maxHeight: 100,
    flexGrow: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 10,
  },
  buttonWrapper: {
    marginHorizontal: 5,
  },
  glassButton: {
    width: 100,
    height: 70,
  },
  activeButton: {
    shadowColor: "#00BCD4",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  touchableContent: {
    flex: 1,
  },
  buttonContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  contentWrapper: {
    flex: 1,
    padding: 15,
  },
  contentGlass: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
});