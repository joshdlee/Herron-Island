import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as queries from "./src/graphql/queries";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { customListDaySchedules, customListLowTides } from "./src/API";
import { useTheme, Modal, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from '@react-navigation/native';


function getSeasonAndDay(date: Date) {
  const month = date.getMonth() + 1;
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayOfWeek = days[date.getDay()];

  return {
    season: month >= 4 && month <= 9 ? "summer" : "winter",
    day: dayOfWeek,
  };
}

async function fetchAllSchedules() {
  try {
    Amplify.Logger.LOG_LEVEL = "DEBUG";
    const result = await API.graphql(graphqlOperation(customListDaySchedules));
    return result.data?.listDaySchedules?.items || [];
  } catch (error) {
    console.error("Error fetching all schedules:", error);
    // Handle or rethrow the error as needed
  }
}

async function fetchScheduleForDate(date) {
  const dateString = `${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getFullYear()}`;
  const allSchedules = await fetchAllSchedules();

  const holidaySchedule = allSchedules.find((schedule) =>
    schedule.id.includes(dateString)
  );

  if (holidaySchedule) {
    return holidaySchedule;
  } else {
    const { season, day } = getSeasonAndDay(date);
    return await fetchSchedule(season, day);
  }
}

async function fetchSchedule(season, day) {
  Amplify.Logger.LOG_LEVEL = "DEBUG";
  const result = await API.graphql(
    graphqlOperation(customListDaySchedules, {
      filter: { id: { eq: `${season}#${day}` } },
    })
  );
  console.log(`Fetching schedule for: ${season}#${day}`);
  console.log("Fetch Schedule Result:", result);

  return result.data?.listDaySchedules?.items[0] || null;
}

async function fetchLowTides(date) {
  const dateString = `${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getFullYear()}`;
  Amplify.Logger.LOG_LEVEL = "DEBUG";
  const result = await API.graphql({
    query: customListLowTides,
    variables: { filter: { date: { eq: dateString } } },
  });
  console.log(`Fetching low tides for: ${dateString}`);
  console.log("Fetch Low Tides Result:", result);
  console.log("Date String in fetchLowTides:", dateString);

  return result.data?.listLowTides?.items[0] || null;
}

function adjustScheduleForLowTides(schedule, lowTides) {
  let updatedMainlandDepartures = schedule.mainlandDepartures.filter(
    (time) => !lowTides.cancelMainland.includes(time)
  );

  updatedMainlandDepartures = [
    ...updatedMainlandDepartures,
    ...lowTides.rescheduleMainland,
  ];

  let updatedIslandDepartures = schedule.islandDepartures.filter(
    (time) => !lowTides.cancelIsland.includes(time)
  );

  updatedIslandDepartures = [
    ...updatedIslandDepartures,
    ...lowTides.rescheduleIsland,
  ];

    // Check if there are any cancellations due to low tides and specify the type
    let alertMessage = "";

    // Check for Island cancellations
    const islandCancellations = lowTides.cancelIsland.filter(time => time.trim() !== "");
    if (islandCancellations.length > 0) {
        alertMessage += `Island departures cancelled: ${islandCancellations.join(", ")}. `;
    }

    // Check for Mainland cancellations
    const mainlandCancellations = lowTides.cancelMainland.filter(time => time.trim() !== "");
    if (mainlandCancellations.length > 0) {
        alertMessage += `Mainland departures cancelled: ${mainlandCancellations.join(", ")}. `;
    }

    if (alertMessage) {
        Alert.alert("Tide Cancellation", alertMessage.trim(), [{ text: "OK" }]);
    }

  return {
    ...schedule,
    mainlandDepartures: updatedMainlandDepartures,
    islandDepartures: updatedIslandDepartures,
  };
}

const styles = {
  timeText: {
    flex: 1,
    textAlign: "center",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
};

export default function GetSchedule() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
  setLoading(true);
      let fetchedSchedule = await fetchScheduleForDate(date);
      const lowTides = await fetchLowTides(date);

      fetchedSchedule = adjustScheduleForLowTides(
        fetchedSchedule,
        lowTides || {
          cancelMainland: [],
          cancelIsland: [],
          rescheduleMainland: [],
          rescheduleIsland: [],
        }
      );

            // Convert and sort times
      // iterate through fetchedSchedule.mainlandDepartures and convert each time to 24 hour time
      fetchedSchedule.mainlandDepartures =
        fetchedSchedule.mainlandDepartures.map((time) => convertTo24Hour(time));
      // convert to 24 hour time interger and sort
      fetchedSchedule.mainlandDepartures =
        fetchedSchedule.mainlandDepartures.sort((a, b) => {
          const timeA = parseInt(a.replace(":", ""));
          const timeB = parseInt(b.replace(":", ""));
          return timeA - timeB;
        });
      // convert back to AM and PM format
      fetchedSchedule.mainlandDepartures =
        fetchedSchedule.mainlandDepartures.map((time) => {
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

      console.log(
        "function and sorted Mainland Departures:",
        fetchedSchedule.mainlandDepartures
      );

      fetchedSchedule.islandDepartures = fetchedSchedule.islandDepartures.map(
        (time) => convertTo24Hour(time)
      );
      fetchedSchedule.islandDepartures = fetchedSchedule.islandDepartures.sort(
        (a, b) => {
          const timeA = parseInt(a.replace(":", ""));
          const timeB = parseInt(b.replace(":", ""));
          return timeA - timeB;
        }
      );
      fetchedSchedule.islandDepartures = fetchedSchedule.islandDepartures.map(
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

      console.log(
        "function and sorted Island Departures:",
        fetchedSchedule.islandDepartures
      );
      setSchedule(fetchedSchedule);

      setLoading(false);
    }

    fetchInitialData();
  }, []); // The empty dependency array ensures this hook runs only once, when the component mounts.

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [schedule, setSchedule] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const today = new Date();
      setDate(today);
  
      // Call the existing onChange function with the new date
      onChange(null, today);
  
      return () => {
        // Optional cleanup code
      };
    }, [])
  );
  
  

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

  const onChange = async (event, selectedDate) => {
    setShowPicker(false);
    setLoading(true);

    if (selectedDate) {
      setDate(selectedDate);

      let fetchedSchedule = await fetchScheduleForDate(selectedDate);

      const lowTides = await fetchLowTides(selectedDate);

      // Adjust the schedule for low tides, even if there's no actual low tide data.
      fetchedSchedule = adjustScheduleForLowTides(
        fetchedSchedule,
        lowTides || {
          cancelMainland: [],
          cancelIsland: [],
          rescheduleMainland: [],
          rescheduleIsland: [],
        }
      );

      // Convert and sort times
      // iterate through fetchedSchedule.mainlandDepartures and convert each time to 24 hour time
      fetchedSchedule.mainlandDepartures =
        fetchedSchedule.mainlandDepartures.map((time) => convertTo24Hour(time));
      // convert to 24 hour time interger and sort
      fetchedSchedule.mainlandDepartures =
        fetchedSchedule.mainlandDepartures.sort((a, b) => {
          const timeA = parseInt(a.replace(":", ""));
          const timeB = parseInt(b.replace(":", ""));
          return timeA - timeB;
        });
      // convert back to AM and PM format
      fetchedSchedule.mainlandDepartures =
        fetchedSchedule.mainlandDepartures.map((time) => {
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

      console.log(
        "function and sorted Mainland Departures:",
        fetchedSchedule.mainlandDepartures
      );

      fetchedSchedule.islandDepartures = fetchedSchedule.islandDepartures.map(
        (time) => convertTo24Hour(time)
      );
      fetchedSchedule.islandDepartures = fetchedSchedule.islandDepartures.sort(
        (a, b) => {
          const timeA = parseInt(a.replace(":", ""));
          const timeB = parseInt(b.replace(":", ""));
          return timeA - timeB;
        }
      );
      fetchedSchedule.islandDepartures = fetchedSchedule.islandDepartures.map(
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

      console.log(
        "function and sorted Island Departures:",
        fetchedSchedule.islandDepartures
      );
      setSchedule(fetchedSchedule);
      setLoading(false);
    }
  };

  function formatDate(d) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return d.toLocaleDateString(undefined, options);
  }

  console.log("Date:", date);
  console.log("Schedule:", schedule);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: theme.colors.background,
      }}
    >
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <Portal>
            <Modal
              visible={showPicker}
              onDismiss={() => setShowPicker(false)}
              contentContainerStyle={{
                padding: 20,
                backgroundColor: theme.colors.surface,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <DateTimePicker
                value={date}
                mode="date"
                display="inline"
                onChange={onChange}
                themeVariant={theme.dark ? "dark" : "light"}
                accentColor={theme.colors.primary}
                textColor={theme.colors.primary}
              />
            </Modal>
          </Portal>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
              backgroundColor: theme.colors.primary,
              padding: 10,
              borderRadius: 5,
              justifyContent: "center",
            }}
          >
            <Icon
              name="calendar"
              size={20}
              color={theme.colors.onPrimary}
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: theme.colors.onPrimary }}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>

          {schedule && (
            <>
              <View style={{ flexDirection: "row", marginVertical: 10 }}>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: theme.colors.onBackground,
                  }}
                >
                  Island Departures
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: theme.colors.onBackground,
                  }}
                >
                  Mainland Departures
                </Text>
              </View>

              {schedule.islandDepartures.map((time, index) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", marginVertical: 5 }}
                >
                  <Text
                    style={{
                      ...styles.timeText,
                      borderColor: theme.colors.primary,
                      color: theme.colors.onBackground,
                    }}
                  >
                    {time}
                  </Text>
                  <Text
                    style={{
                      ...styles.timeText,
                      borderColor: theme.colors.primary,
                      color: theme.colors.onBackground,
                    }}
                  >
                    {schedule.mainlandDepartures[index]}
                  </Text>
                </View>
              ))}
            </>
          )}
        </>
      )}
    </View>
);

                  }