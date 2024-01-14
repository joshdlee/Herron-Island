import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { useTheme } from "react-native-paper";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { customListLowTides } from "./src/API";
import { createLowTide } from "./src/graphql/mutations";
import { TouchableOpacity } from "react-native";
import { updateLowTide } from "./src/graphql/mutations";
import { Alert } from "react-native";

async function fetchAllLowTides() {
  Amplify.Logger.LOG_LEVEL = "DEBUG";
  const result = await API.graphql(graphqlOperation(customListLowTides));
  console.log("Low Tides:", result.data?.listLowTides?.items || []);
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

  useEffect(() => {
    async function fetchData() {
      const tideItems = await fetchAllLowTides();

      for (let tideData of tideItems) {
        if (tideData.mainlandDepartures) {
          tideData.mainlandDepartures = tideData.mainlandDepartures.map(
            (time) => convertTo24Hour(time)
          );
          tideData.mainlandDepartures = tideData.mainlandDepartures.sort(
            (a, b) => {
              const timeA = parseInt(a.replace(":", ""));
              const timeB = parseInt(b.replace(":", ""));
              return timeA - timeB;
            }
          );
          tideData.mainlandDepartures = tideData.mainlandDepartures.map(
            (time) => {
              let [hours, minutes] = time.split(":");
              if (hours > 12) {
                hours = hours - 12;
                return `${hours}:${minutes}PM`;
              } else if (hours == 12) {
                return `${hours}:${minutes}PM`;
              } else {
                return `${hours}:${minutes}AM`;
              }
            }
          );
        }

        if (tideData.islandDepartures) {
          tideData.islandDepartures = tideData.islandDepartures.map((time) =>
            convertTo24Hour(time)
          );
          tideData.islandDepartures = tideData.islandDepartures.sort((a, b) => {
            const timeA = parseInt(a.replace(":", ""));
            const timeB = parseInt(b.replace(":", ""));
            return timeA - timeB;
          });
          tideData.islandDepartures = tideData.islandDepartures.map((time) => {
            let [hours, minutes] = time.split(":");
            if (hours > 12) {
              hours = hours - 12;
              return `${hours}:${minutes}PM`;
            } else if (hours == 12) {
              return `${hours}:${minutes}PM`;
            } else {
              return `${hours}:${minutes}AM`;
            }
          });
        }
      }

      const sortedTideData = sortLowTidesByDate(tideItems);
      setLowTides(sortedTideData);
      setLoading(false);
    }

    fetchData();
  }, []);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingTide, setEditingTide] = useState(null);

  const handleEdit = (tide) => {
    setEditingTide(tide);
    setEditModalVisible(true);
  };

  const validateInput = () => {
    const dateRegex = /^(1[0-2]|[1-9])-(3[01]|[12][0-9]|[1-9])-\d{4}$/;
    const timeRegex = /^([1-9]|1[0-2]):[0-5][0-9](AM|PM)$|^$/;
  
    if (!dateRegex.test(editingTide.date)) {
      Alert.alert(
        "Invalid Date",
        `Please enter a valid date in M-D-YYYY format. Invalid input: ${editingTide.date}`
      );
      return false;
    }
  
    for (const time of [
      ...editingTide.cancelMainland,
      ...editingTide.cancelIsland,
      ...editingTide.rescheduleMainland,
      ...editingTide.rescheduleIsland,
    ]) {
      if (!timeRegex.test(time)) {
        Alert.alert(
          "Invalid Time",
          `Please enter a valid time in H:MMAM/PM format. Invalid input: ${time}`
        );
        return false;
      }
    }
  
    return true;
  };
  
  

  const handleSaveEdit = async () => {
    if (editingTide && validateInput()) {
      try {
        // Find the index of the tide being edited in the lowTides array
        const index = lowTides.findIndex(tide => tide.id === editingTide.id);
        if (index !== -1) {
          // Update the tide in the lowTides array
          const updatedLowTides = [...lowTides];
          updatedLowTides[index] = editingTide;
          
          // Call the updateLowTide mutation or any other API to save the changes
          await API.graphql(graphqlOperation(updateLowTide, { input: editingTide }));
          console.log("Updated tide:", editingTide);
          
          // Update the lowTides state with the updated array
          setLowTides(updatedLowTides);
        }
      } catch (error) {
        console.error("Error updating LowTide:", error);
      }
    }
    setEditModalVisible(false);
    setEditingTide(null);
  };
  

  const handleNew = async () => {
    // Gather the necessary input data
    const input = {
      date: "9-23-2022", // Replace with the actual date
      id: "9-23-2022", // Replace with the actual date
      cancelMainland: ["08:00AM"], // Replace with the actual cancellations for mainland
      cancelIsland: ["07:30AM"], // Replace with the actual cancellations for island
      rescheduleMainland: ["02:00PM"], // Replace with the actual reschedules for mainland
      rescheduleIsland: ["03:00PM"], // Replace with the actual reschedules for island
    };

    try {
      // Call the createLowTide mutation
      const result = await API.graphql(
        graphqlOperation(createLowTide, { input })
      );
      console.log("New LowTide created:", result);

      // Optionally, you can refresh the list of low tides
      const tideItems = await fetchAllLowTides();
      const sortedTideData = sortLowTidesByDate(tideItems);
      setLowTides(sortedTideData);
    } catch (error) {
      console.error("Error creating new LowTide:", error);
    }
  };

  return (
    <View
      style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background }}
    >
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
          color: theme.colors.onBackground,
        }}
      >
        Admin Mode - Edit Cancelations / Reschedules
      </Text>
      <TouchableOpacity
        onPress={handleNew}
        style={{
          padding: 10,
          backgroundColor: "lightcoral",
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>New</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color={"lightcoral"} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
<Modal
  animationType="slide"
  transparent={true}
  visible={isEditModalVisible}
  onRequestClose={() => {
    setEditModalVisible(false);
    setEditingTide(null);
  }}
>
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 300,
        padding: 20,
        backgroundColor: "grey",
        borderRadius: 10,
      }}
    >
      <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
        Edit Cancelations / Reschedules
      </Text>
      <Text style={{ marginBottom: 5 }}>Date:</Text>
      <TextInput
        placeholder="Enter Date"
        value={editingTide?.date}
        onChangeText={(text) =>
          setEditingTide({ ...editingTide, date: text })
        }
      />
      <Text style={{ marginTop: 10, marginBottom: 5 }}>Cancelations (Mainland):</Text>
      <TextInput
        placeholder="Enter Cancelations for Mainland"
        value={editingTide?.cancelMainland.join(", ")}
        onChangeText={(text) =>
          setEditingTide({
            ...editingTide,
            cancelMainland: text.split(", "),
          })
        }
      />
      <Text style={{ marginTop: 10, marginBottom: 5 }}>Cancelations (Island):</Text>
      <TextInput
        placeholder="Enter Cancelations for Island"
        value={editingTide?.cancelIsland.join(", ")}
        onChangeText={(text) =>
          setEditingTide({
            ...editingTide,
            cancelIsland: text.split(", "),
          })
        }
      />
      <Text style={{ marginTop: 10, marginBottom: 5 }}>Reschedules (Mainland):</Text>
      <TextInput
        placeholder="Enter Reschedules for Mainland"
        value={editingTide?.rescheduleMainland.join(", ")}
        onChangeText={(text) =>
          setEditingTide({
            ...editingTide,
            rescheduleMainland: text.split(", "),
          })
        }
      />
      <Text style={{ marginTop: 10, marginBottom: 5 }}>Reschedules (Island):</Text>
      <TextInput
        placeholder="Enter Reschedules for Island"
        value={editingTide?.rescheduleIsland.join(", ")}
        onChangeText={(text) =>
          setEditingTide({
            ...editingTide,
            rescheduleIsland: text.split(", "),
          })
        }
      />
      <Button title="Save" onPress={handleSaveEdit} />
    </View>
  </View>
</Modal>

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
                      borderColor: "lightcoral",
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
                      borderColor: "lightcoral",
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
              <TouchableOpacity
                onPress={() => handleEdit(tide)}
                style={{ alignSelf: "center", marginTop: 10 }}
              >
                <Text style={{ color: "lightcoral" }}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
