import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Table, Row } from "react-native-table-component";
import lowTides from "./low_tides.json";
import { useTheme, Chip } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "react-native-paper";
import { TouchableOpacity, Linking, TextInput, Platform } from "react-native";

const LowTides = () => {
  const openURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const theme = useTheme();
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={styles(theme).container}>
        <Text
          style={[styles(theme).heading, { color: theme.colors.onBackground }]}
        >
          Low Tide Changes
        </Text>
        <TouchableOpacity
          onPress={() =>
            openURL(
              "https://www.hmchi.org/file/document/3715548852/SnAZB58vLCpncqHH.pdf"
            )
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="open-in-new"
              size={20}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles(theme).link,
                { color: theme.colors.primary, marginLeft: 5 },
              ]}
            >
              2024 Ferry Cancellations/Reschedules PDF
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles(theme).container}>
          <Text style={styles(theme).heading2}>
            this icon means route was added{" "}
            <MaterialCommunityIcons
              name="clock-outline"
              size={26}
              color={theme.colors.secondary}
            />
          </Text>
          <Text style={styles(theme).heading2}>
            this icon means route was removed{" "}
            <MaterialCommunityIcons
              name="cancel"
              size={25}
              color={theme.colors.primary}
            />
          </Text>

          {/* <TouchableOpacity onPress={() => openURL('http://herronisland.org/home/sked/2023%20ferry%20cancellations%20and%20reschedules.pdf')}>
        <MaterialCommunityIcons name="open-in-new" size={20} color={theme.colors.primary} />
  <Text style={[styles(theme).link, { color: theme.colors.primary }]}>Official 2023 Herron Island Low Tide Ferry Cancellations/Reschedules </Text>
</TouchableOpacity> */}
        </View>
        <View style={styles(theme).scheduleHeader}>
          <View style={styles(theme).column}>
            <Text
              style={[
                styles(theme).subHeading,
                { color: theme.colors.onBackground },
              ]}
            >
              Island
            </Text>
          </View>
          <View style={styles(theme).column}>
            <Text
              style={[
                styles(theme).subHeading,
                { color: theme.colors.onBackground },
              ]}
            >
              Mainland
            </Text>
          </View>
        </View>
        {Object.keys(lowTides.low_tides).map((date) => {
          const schedule = lowTides.low_tides[date];
          const islandCancelTableData =
            schedule.cancel.island?.departure_times?.map((time) => [
              <View style={styles(theme).cellContent}>
                <Text style={styles(theme).timeText}>
                  {time}{" "}
                  <MaterialCommunityIcons
                    name="cancel"
                    size={14}
                    color={theme.colors.primary}
                  />
                </Text>
              </View>,
            ]) ?? [];
          const islandRescheduleTableData =
            schedule.reschedule.island?.departure_times?.map((time) => [
              <View style={styles(theme).cellContent}>
                <Text style={styles(theme).timeText}>
                  {time}{" "}
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={18}
                    color={theme.colors.secondary}
                  />
                </Text>
              </View>,
            ]) ?? [];
          const mainlandCancelTableData =
            schedule.cancel.mainland?.departure_times?.map((time) => [
              <View style={styles(theme).cellContent}>
                <Text style={styles(theme).timeText}>
                  {time}{" "}
                  <MaterialCommunityIcons
                    name="cancel"
                    size={14}
                    color={theme.colors.primary}
                  />
                </Text>
              </View>,
            ]) ?? [];
          const mainlandRescheduleTableData =
            schedule.reschedule.mainland?.departure_times?.map((time) => [
              <View style={styles(theme).cellContent}>
                <Text style={styles(theme).timeText}>
                  {time}{" "}
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={18}
                    color={theme.colors.secondary}
                  />
                </Text>
              </View>,
            ]) ?? [];

          return (
            <View key={date} style={styles(theme).dayContainer}>
              <Text
                style={[
                  styles(theme).dayHeading,
                  { color: theme.colors.onBackground },
                ]}
              >
                {date}
              </Text>
              <View style={styles(theme).schedule}>
                <View style={styles(theme).column}>
                  <Table
                    borderStyle={{
                      borderWidth: 1,
                      borderColor: theme.colors.outline,
                    }}
                  >
                    {islandCancelTableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        style={[
                          styles(theme).row,
                          { backgroundColor: theme.colors.surface },
                        ]}
                        textStyle={{
                          ...styles(theme).rowText,
                          color: theme.colors.onSurface,
                        }}
                      />
                    ))}
                    {islandRescheduleTableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        style={[
                          styles(theme).row,
                          { backgroundColor: theme.colors.surface },
                        ]}
                        textStyle={{
                          ...styles(theme).rowText,
                          color: theme.colors.onSurface,
                        }}
                      />
                    ))}
                  </Table>
                </View>
                <View style={styles(theme).column}>
                  <Table
                    borderStyle={{
                      borderWidth: 1,
                      borderColor: theme.colors.outline,
                    }}
                  >
                    {mainlandCancelTableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        style={[
                          styles(theme).row,
                          { backgroundColor: theme.colors.surface },
                        ]}
                        textStyle={{
                          ...styles(theme).rowText,
                          color: theme.colors.onSurface,
                        }}
                      />
                    ))}
                    {mainlandRescheduleTableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        style={[
                          styles(theme).row,
                          { backgroundColor: theme.colors.surface },
                        ]}
                        textStyle={{
                          ...styles(theme).rowText,
                          color: theme.colors.onSurface,
                        }}
                      />
                    ))}
                  </Table>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
const styles = (theme) => {
  const screenWidth = Dimensions.get("window").width;
  const dynamicWidth = screenWidth * 0.45;
  return StyleSheet.create({
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
      marginBottom: 0,
      color: theme.colors.primary,
    },
    heading2: {
      fontSize: 13,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.colors.onSurface,
      textAlign: "left",
    },
    scheduleHeader: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    column: {
      flex: 1,
      marginHorizontal: 10,
      textAlign: "center",
      color: theme.colors.onSurface,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    subHeading: {
      fontSize: 15,
      fontWeight: "bold",
      marginBottom: 0,
      color: theme.colors.primary,
      textAlign: "center",
    },
    link: {
      fontSize: 16,
      textDecorationLine: "underline",
      marginBottom: 8,
      color: theme.colors.primary,
    },
    // column: {
    // flex: 1,
    // marginHorizontal: 10,
    // },
    // subHeading: {
    // fontSize: 20,
    // fontWeight: 'bold',
    // marginBottom: 0,
    // color: theme.colors.primary,
    // textAlign: 'center',
    // },
    dayContainer: {
      marginBottom: 20,
    },
    dayHeading: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      color: theme.colors.primary,
    },
    schedule: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      minWidth: dynamicWidth,
    },
    row: {
      height: 40,
      backgroundColor: theme.colors.surface,
      color: theme.colors.onSurface,
      shadowColor: theme.colors.secondary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    rowText: {
      fontSize: 16,
      textAlign: "center",
      color: theme.colors.onSurface,
    },
    cellContent: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      alignContent: "center",
    },
    timeText: {
      fontSize: 16,
      color: theme.colors.onSurface,
      textAlign: "center",
    },
  });
};

export default LowTides;
