import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
  Platform,
} from "react-native";
import { useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Switch, RadioButton, Divider } from "react-native-paper";
import SimpleGlass from './SimpleGlass';
// import app json for version number 
import * as appJson from "./app.json";

// const pricingData = {
//   prices: {
//     vehicle_driver: {
//       member: 10,
//       guest: 20,
//     },
//     passengers_walk_ons: {
//       age_12_and_over: 3,
//       age_5_to_11: 1,
//       under_age_5: 0,
//     },
//     vehicle_length_fares: [
//       {
//         length_range: [0, 21],
//         member: 0,
//         guest: 0,
//       },
//       {
//         length_range: [22, 30],
//         member: 10,
//         guest: 20,
//       },
//       {
//         length_range: [31, 40],
//         member: 20,
//         guest: 40,
//       },
//       {
//         length_range: [41, 50],
//         member: 30,
//         guest: 60,
//       },
//       {
//         length_range: [51, 60],
//         member: 40,
//         guest: 80,
//       },
//       {
//         length_range: ["special"],
//         member: 190,
//         guest: 180,
//       },
//       {
//         length_range: ["walk on"],
//         member: -10,
//         guest: -20,
//       },
//     ],
//     special_runs: 200,
//   },
// };
const ferryFees = [
  { description: 'Car and Driver under 22 feet', member: '$10', other: '$25' },
  { description: 'Car and Driver under 22 feet and width over 7\'', member: '$20', other: '$35' },
  { description: 'Walk-on or Vehicle Passenger Age 12 and up', member: '$5', other: '$5' },
  { description: 'Vehicle Passenger Age 5-11', member: '$1', other: '$1' },
  { description: 'Vehicle Passenger Age 4 and under', member: 'Free', other: 'Free' },
  { description: 'Vehicle Length 22\'-30\'', member: '$20', other: '$40' },
  { description: 'Vehicle Length 31\'-40\'', member: '$30', other: '$60' },
  { description: 'Vehicle Length 41\'-50\'', member: '$40', other: '$80' },
  { description: 'Vehicle Length 51\'-60\'', member: '$50', other: '$100' },
  { description: 'Special Runs (One Way)', member: '$250', other: '$250' },
  { description: 'Book Of 10 $10 Tickets', member: '$90', other: 'N/A' },
  { description: 'Book of 25 $5 Tickets', member: '$120', other: 'N/A' },
  { description: '911 Initiated Runs', member: 'Free', other: 'Free' }
];

const HerronIsland = () => {
  const theme = useTheme();

  const openURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const openMap = () => {
    const address = "1814 N Herron Rd NW Anderson Island, WA  98349";
    const url = Platform.select({
      ios: `maps://maps.apple.com/?daddr=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });

    openURL(url);
  };

  // get version number from app json expo version
  const version = appJson.expo.version;

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={styles(theme).container}>
        <SimpleGlass
          style={{ marginBottom: 20, padding: 20, width: '100%' }}
          borderRadius={12}
          theme={theme}
        >
          <View style={{ alignItems: 'center', marginBottom: 15 }}>
            <MaterialCommunityIcons name="ferry" size={40} color={theme.colors.primary} />
            <Text style={[styles(theme).heading, { color: theme.colors.onBackground, marginTop: 10, marginBottom: 0 }]}>Herron Island Ferry</Text>
          </View>
          
          <View style={{ 
            backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
            borderRadius: 8, 
            padding: 12,
            marginBottom: 15
          }}>
            <Text style={[styles(theme).description, { 
              color: theme.colors.onBackground, 
              marginBottom: 0,
              fontSize: 14,
              lineHeight: 20,
              textAlign: 'center'
            }]}>
              Unofficial schedule app using data from herronisland.org
            </Text>
            <Text style={[styles(theme).description, { 
              color: theme.colors.onBackground, 
              opacity: 0.7,
              marginBottom: 0,
              marginTop: 5,
              fontSize: 12,
              textAlign: 'center',
              fontStyle: 'italic'
            }]}>
              Not endorsed by HMC
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity 
              onPress={() => openURL("http://herronisland.org/")} 
              style={{ 
                alignItems: 'center', 
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginRight: 5
              }}
            >
              <MaterialCommunityIcons name="web" size={24} color={theme.colors.primary} />
              <Text style={[styles(theme).linkText, { color: theme.colors.primary, marginTop: 5 }]}>Official Website</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={openMap} 
              style={{ 
                alignItems: 'center', 
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginLeft: 5
              }}
            >
              <MaterialCommunityIcons name="map-marker" size={24} color={theme.colors.primary} />
              <Text style={[styles(theme).linkText, { color: theme.colors.primary, marginTop: 5 }]}>Ferry Dock</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles(theme).versionText, { 
            color: theme.colors.onBackground, 
            opacity: 0.4, 
            textAlign: 'center', 
            marginTop: 15,
            fontSize: 11
          }]}>
            v{version}
          </Text>
        </SimpleGlass>
        <Text style={[styles(theme).subHeading, { color: theme.colors.onBackground, textAlign: 'center', marginBottom: 15, marginTop: 10 }]}>Ferry Fees</Text>
        
        <View style={{ width: '100%', paddingHorizontal: 10 }}>
          {/* Table Header */}
          <SimpleGlass
            style={{ marginBottom: 5, width: '100%' }}
            borderRadius={8}
            theme={theme}
          >
            <View style={[styles(theme).headerRow, { backgroundColor: 'transparent' }]}>
              <Text style={[styles(theme).headerCell, { flex: 3, color: theme.colors.onBackground, fontWeight: 'bold' }]}>Description</Text>
              <Text style={[styles(theme).headerCell, { flex: 1, color: theme.colors.onBackground, fontWeight: 'bold' }]}>Member</Text>
              <Text style={[styles(theme).headerCell, { flex: 1, color: theme.colors.onBackground, fontWeight: 'bold' }]}>Other</Text>
            </View>
          </SimpleGlass>

          {/* Table Rows */}
          {ferryFees.map((fee, index) => (
            <SimpleGlass
              key={index}
              style={{ marginVertical: 2, width: '100%' }}
              borderRadius={6}
              theme={theme}
            >
              <View style={[styles(theme).row, { borderBottomWidth: 0 }]}>
                <Text style={[styles(theme).cell, { flex: 3, fontSize: 13 }]}>{fee.description || 'N/A'}</Text>
                <Text style={[styles(theme).cell, { flex: 1, fontWeight: 'bold' }]}>{fee.member || 'N/A'}</Text>
                <Text style={[styles(theme).cell, { flex: 1, fontWeight: 'bold' }]}>{fee.other || 'N/A'}</Text>
              </View>
            </SimpleGlass>
          ))}
        </View>
      </View>
    </ScrollView>
  );
  
};

const styles = (theme) => {
  const screenWidth = Dimensions.get("window").width;
  const dynamicWidth = screenWidth * 0.45;
  return StyleSheet.create({
    switchContainer: {
      flexDirection: "column",
      alignItems: "center", // change this line
      justifyContent: "center",
      marginBottom: 16,
      width: "100%",
    },
    counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      width: "100%",
      marginBottom: 16,
    },
    counterButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    CalcButton: {
      elevation: 8,
      backgroundColor: "#009688",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.colors.primary,
    },
    subHeading: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.colors.primary,
    },
    description: {
      fontSize: 16,
      marginBottom: 16,
      textAlign: "justify",
      color: theme.colors.onBackground,
    },
    input: {
      height: 40,
      width: "100%",
      borderColor: "gray",
      borderWidth: 1,
      paddingLeft: 10,
      marginBottom: 16,
    },
    link: {
      fontSize: 16,
      textDecorationLine: "underline",
      marginBottom: 8,
      color: theme.colors.primary,
    },
    linkText: {
      fontSize: 12,
      marginTop: 4,
    },
    versionText: {
      fontSize: 12,
    },
    table: {
      width: '100%',
    },
    headerRow: {
      flexDirection: 'row',
      padding: 10,
    },
    headerCell: {
      textAlign: 'center',
      paddingHorizontal: 4,
    },
    row: {
      flexDirection: 'row',
      padding: 10,
    },
    cell: {
      textAlign: 'center',
      paddingHorizontal: 4,
      color: theme.colors.onBackground, // Dynamically set text color based on theme
    },
  });
};

export default HerronIsland;
