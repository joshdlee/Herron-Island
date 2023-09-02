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

const pricingData = {
  prices: {
    vehicle_driver: {
      member: 10,
      guest: 20,
    },
    passengers_walk_ons: {
      age_12_and_over: 3,
      age_5_to_11: 1,
      under_age_5: 0,
    },
    vehicle_length_fares: [
      {
        length_range: [0, 21],
        member: 0,
        guest: 0,
      },
      {
        length_range: [22, 30],
        member: 10,
        guest: 20,
      },
      {
        length_range: [31, 40],
        member: 20,
        guest: 40,
      },
      {
        length_range: [41, 50],
        member: 30,
        guest: 60,
      },
      {
        length_range: [51, 60],
        member: 40,
        guest: 80,
      },
      {
        length_range: ["special"],
        member: 190,
        guest: 180,
      },
      {
        length_range: ["walk on"],
        member: -10,
        guest: -20,
      },
    ],
    special_runs: 200,
  },
};

const getPriceForVehicleLength = (index, isMember) => {
  const fare = pricingData.prices.vehicle_length_fares[index];
  return isMember ? fare.member : fare.guest;
};

const HerronIsland = () => {
  const theme = useTheme();

  const [membership, setMembership] = useState("Member");
  const [vehicleLength, setVehicleLength] = useState(0);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [price, setPrice] = useState(0);

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
    const address = "20801 Isted Rd NW, Lakebay, WA";
    const url = Platform.select({
      ios: `maps://maps.apple.com/?daddr=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });

    openURL(url);
  };

  const calculatePrice = () => {
    const isMember = membership === "Member";
    const vehicleCost = getPriceForVehicleLength(
      Number(vehicleLength),
      isMember
    );
    const driverCost = isMember
      ? pricingData.prices.vehicle_driver.member
      : pricingData.prices.vehicle_driver.guest;
    const adultCost =
      Number(adults) * pricingData.prices.passengers_walk_ons.age_12_and_over;
    const childCost =
      Number(children) * pricingData.prices.passengers_walk_ons.age_5_to_11;
    console.log(
      `vehicleCost:(${vehicleCost}) + driverCost=(${driverCost}) + adultCost:(${adultCost}) + childCost:(${childCost})`,
      vehicleCost + driverCost + adultCost + childCost
    );
    setPrice(vehicleCost + driverCost + adultCost + childCost);
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={styles(theme).container}>
        <Text
          style={[styles(theme).heading, { color: theme.colors.onBackground }]}
        >
          Herron Island Ferry Schedule
        </Text>
        <Text
          style={[
            styles(theme).description,
            { color: theme.colors.onBackground },
          ]}
        >
          This application offers ferry schedule details for the Herron Island
          ferry, using information derived from the schedule published on
          herronisland.org. Please note that this application is not officially
          endorsed or supported by the Herron Management Company (HMC).{" "}
        </Text>
        <TouchableOpacity onPress={() => openURL("http://herronisland.org/")}>
          <Text style={[styles(theme).link, { color: theme.colors.primary }]}>
            Visit Herron Island Website
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openMap}>
          <Text style={[styles(theme).link, { color: theme.colors.primary }]}>
            Get directions to Herron Island Ferry Dock
          </Text>
        </TouchableOpacity>

        <Divider style={{ marginVertical: 16 }} />

        {/* Pricing calculator component */}
        <Text
          style={[
            styles(theme).subHeading,
            { color: theme.colors.onBackground },
          ]}
        >
          Ferry Pricing Calculator
        </Text>

        {/* Membership Switch */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
            width: 150,
          }}
        >
          <Text
            style={[
              styles(theme).description,
              { color: theme.colors.onBackground },
            ]}
          >
            Membership:{" "}
          </Text>
          <Switch
            value={membership === "Member"}
            onValueChange={(value) => setMembership(value ? "Member" : "Guest")}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles(theme).description,
              { color: theme.colors.onBackground },
            ]}
          >
            {membership}
          </Text>
        </View>
        <Divider style={{ marginVertical: 16 }} />

        {/* Vehicle Length Radio Buttons */}
        <Text
          style={[
            styles(theme).description,
            { color: theme.colors.onBackground },
          ]}
        >
          Vehicle Length:
        </Text>
        <View style={styles(theme).switchContainer}>
          {pricingData.prices.vehicle_length_fares.map((fare, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <View style={{ width: 150 }}>
                <Text
                  style={[
                    styles(theme).description,
                    { color: theme.colors.onBackground },
                  ]}
                >
                  {fare.length_range[0] === "special"
                    ? "Special"
                    : fare.length_range[0] === "walk on"
                    ? "Walk On"
                    : `${fare.length_range[0]} - ${fare.length_range[1]} ft`}
                </Text>
              </View>
              <Switch
                color={theme.colors.primary}
                onValueChange={() => setVehicleLength(index)}
                value={vehicleLength === index}
              />
            </View>
          ))}
        </View>

        <Divider style={{ marginVertical: 16 }} />

        {/* Passengers (excluding driver) */}
        <Text
          style={[
            styles(theme).description,
            { color: theme.colors.onBackground },
          ]}
        >
          Passengers (excluding driver):
        </Text>

        <Text
          style={[
            styles(theme).description,
            { color: theme.colors.onBackground },
          ]}
        >
          Adults (Age 12 and Over):
        </Text>
        <View style={styles(theme).counterContainer}>
          <TouchableOpacity
            onPress={() => setAdults(Math.max(0, adults - 1))}
            style={styles(theme).counterButton}
          >
            <Text style={{ fontSize: 24, color: theme.colors.onBackground }}>
              -
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 16, color: theme.colors.onBackground }}>
            {adults}
          </Text>
          <TouchableOpacity
            onPress={() => setAdults(adults + 1)}
            style={styles(theme).counterButton}
          >
            <Text style={{ fontSize: 24, color: theme.colors.onBackground }}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles(theme).description,
            { color: theme.colors.onBackground },
          ]}
        >
          Children (Age 5 - 11):
        </Text>
        <View style={styles(theme).counterContainer}>
          <TouchableOpacity
            onPress={() => setChildren(Math.max(0, children - 1))}
            style={styles(theme).counterButton}
          >
            <Text style={{ fontSize: 24, color: theme.colors.onBackground }}>
              -
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 16, color: theme.colors.onBackground }}>
            {children}
          </Text>
          <TouchableOpacity
            onPress={() => setChildren(children + 1)}
            style={styles(theme).counterButton}
          >
            <Text style={{ fontSize: 24, color: theme.colors.onBackground }}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles(theme).description,
            { color: theme.colors.onBackground },
          ]}
        >
          Children (Under age 5): Free
        </Text>
        <Divider style={{ marginVertical: 16 }} />

        <TouchableOpacity
          onPress={calculatePrice}
          style={styles(theme).CalcButton}
        >
          <Text style={{ fontSize: 24, color: theme.colors.onBackground }}>
            Calculate Price
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles(theme).description,
            { color: theme.colors.onBackground },
          ]}
        >
          Total Price: ${price.toFixed(2)}
        </Text>
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
  });
};

export default HerronIsland;
