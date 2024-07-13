import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useTheme } from "react-native-paper";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { customListLowTides } from "./src/API";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, Linking, TextInput, Platform } from "react-native";
import { StyleSheet } from "react-native";

async function fetchAllLowTides() {
  Amplify.Logger.LOG_LEVEL = "DEBUG";
  const result = await API.graphql(graphqlOperation(customListLowTides));
  return result.data?.listLowTides?.items || [];
}

function convertTo24Hour(time) {
  if (!time || time.length === 0) {
    return time;
  }

  let [hours, minutes] = time.split(":");

  if (!hours || !minutes) {
    return time;
  }

  const AMPM = minutes.slice(-2);
  minutes = minutes.slice(0, -2);

  if (AMPM === "PM" && hours !== "12") {
    hours = parseInt(hours) + 12;
  } else if (AMPM === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
}

export default function GetCancellations() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [lowTides, setLowTides] = useState([]);

  function sortLowTidesByDate(tides) {
    return tides.sort((a, b) => {
      const [monthA, dayA, yearA] = a.date.split("-");
      const [monthB, dayB, yearB] = b.date.split("-");

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA - dateB;
    });
  }

  const openURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

//   useEffect(() => {
//     async function fetchData() {
//       const tideItems = await fetchAllLowTides();

//       for (let tideData of tideItems) {
//         if (tideData.mainlandDepartures) {
//           tideData.mainlandDepartures = tideData.mainlandDepartures.map(
//             (time) => convertTo24Hour(time)
//           );
//           tideData.mainlandDepartures = tideData.mainlandDepartures.sort(
//             (a, b) => {
//               const timeA = parseInt(a.replace(":", ""));
//               const timeB = parseInt(b.replace(":", ""));
//               return timeA - timeB;
//             }
//           );
//           tideData.mainlandDepartures = tideData.mainlandDepartures.map(
//             (time) => {
//               let [hours, minutes] = time.split(":");
//               if (hours > 12) {
//                 hours = hours - 12;
//                 return `${hours}:${minutes}PM`;
//               } else if (hours == 12) {
//                 return `${hours}:${minutes}PM`;
//               } else {
//                 return `${hours}:${minutes}AM`;
//               }
//             }
//           );
//         }

//         if (tideData.islandDepartures) {
//           tideData.islandDepartures = tideData.islandDepartures.map((time) =>
//             convertTo24Hour(time)
//           );
//           tideData.islandDepartures = tideData.islandDepartures.sort((a, b) => {
//             const timeA = parseInt(a.replace(":", ""));
//             const timeB = parseInt(b.replace(":", ""));
//             return timeA - timeB;
//           });
//           tideData.islandDepartures = tideData.islandDepartures.map((time) => {
//             let [hours, minutes] = time.split(":");
//             if (hours > 12) {
//               hours = hours - 12;
//               return `${hours}:${minutes}PM`;
//             } else if (hours == 12) {
//               return `${hours}:${minutes}PM`;
//             } else {
//               return `${hours}:${minutes}AM`;
//             }
//           });
//         }
//       }

//       const sortedTideData = sortLowTidesByDate(tideItems);
//       setLowTides(sortedTideData);
//       setLoading(false);
//       console.log(sortedTideData);
//     }

//     fetchData();
//   }, []);

useEffect(() => {
    async function fetchData() {
        const allTideItems = await fetchAllLowTides();

        // Filter for the year 2024 and sort the data
        const tideItems = allTideItems.filter(tide => {
            const year = tide.date.split("-")[2]; // Assumes the date format is MM-DD-YYYY
            return year === "2024";
        });

        // Sort the filtered data by date
        const sortedTideData = sortLowTidesByDate(tideItems);

        // Process each tide data entry
        sortedTideData.forEach(tideData => {
            if (tideData.mainlandDepartures) {
                tideData.mainlandDepartures = tideData.mainlandDepartures.map(convertTo24Hour)
                    .sort((a, b) => parseInt(a.replace(":", "")) - parseInt(b.replace(":", "")))
                    .map(time => {
                        let [hours, minutes] = time.split(":");
                        return hours > 12 ? `${hours - 12}:${minutes}PM` :
                               hours == 12 ? `${hours}:${minutes}PM` : `${hours}:${minutes}AM`;
                    });
            }

            if (tideData.islandDepartures) {
                tideData.islandDepartures = tideData.islandDepartures.map(convertTo24Hour)
                    .sort((a, b) => parseInt(a.replace(":", "")) - parseInt(b.replace(":", "")))
                    .map(time => {
                        let [hours, minutes] = time.split(":");
                        return hours > 12 ? `${hours - 12}:${minutes}PM` :
                               hours == 12 ? `${hours}:${minutes}PM` : `${hours}:${minutes}AM`;
                    });
            }
        });

        setLowTides(sortedTideData);
        setLoading(false);
    }

    fetchData();
}, []);


  return (
    <View
      style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background }}
    >
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
              color: theme.colors.onBackground,
            }}
          >
            Low Tides Changes
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
              <Text style={{ color: theme.colors.primary, marginLeft: 5 }}>
                2024 Ferry Cancellations/Reschedules PDF
              </Text>
            </View>
          </TouchableOpacity>
            <View style={{ height: 20 }} />
          {lowTides.map((tide, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 10,
                  textAlign: "center",
                  color: theme.colors.onBackground,
                }}
              >
                {tide.date}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginBottom: 5,
                      color: theme.colors.onBackground,
                    }}
                  >
                    Island Departures
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      padding: 5,
                      borderRadius: 5,
                      borderColor: theme.colors.primary,
                      marginRight: 5,
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 5,
                        color: theme.colors.onBackground,
                      }}
                    >
                      Cancellations: {tide.cancelIsland.join(", ")}
                    </Text>
                    <Text
                      style={{
                        marginBottom: 5,
                        color: theme.colors.onBackground,
                      }}
                    >
                      Reschedules: {tide.rescheduleIsland.join(", ")}
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginBottom: 5,
                      color: theme.colors.onBackground,
                    }}
                  >
                    Mainland Departures
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      padding: 5,
                      borderRadius: 5,
                      borderColor: theme.colors.primary,
                      marginRight: 5,
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 5,
                        color: theme.colors.onBackground,
                      }}
                    >
                      Cancellations: {tide.cancelMainland.join(", ")}
                    </Text>
                    <Text
                      style={{
                        marginBottom: 5,
                        color: theme.colors.onBackground,
                      }}
                    >
                      Reschedules: {tide.rescheduleMainland.join(", ")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
