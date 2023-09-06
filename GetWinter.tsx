import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { customListDaySchedules } from "./src/API";
import { useTheme } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function GetWinterSchedules() {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const [schedules, setSchedules] = useState({});

  const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWinterSchedules();
    setRefreshing(false);
};

  async function fetchWinterSchedules() {
    const season = "winter";
    const fetchedSchedules = {};
  
    for (const day of daysOfWeek) {
      const schedule = await fetchSchedule(season, day);

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
  
      // Sort the departures if a schedule was found
      if (schedule) {
        // Sort mainlandDepartures
        schedule.mainlandDepartures = schedule.mainlandDepartures.map(time => convertTo24Hour(time))
            .sort((a, b) => {
                const timeA = parseInt(a.replace(":", ""));
                const timeB = parseInt(b.replace(":", ""));
                return timeA - timeB;
            })
            .map(time => {
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
  
        // Sort islandDepartures (similar logic)
        schedule.islandDepartures = schedule.islandDepartures.map(time => convertTo24Hour(time))
            .sort((a, b) => {
                const timeA = parseInt(a.replace(":", ""));
                const timeB = parseInt(b.replace(":", ""));
                return timeA - timeB;
            })
            .map(time => {
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
  
      fetchedSchedules[day] = schedule;
    }
    setSchedules(fetchedSchedules);
    saveDataToLocalState(fetchedSchedules);
    setLoading(false);
  }

  const saveDataToLocalState = async (data) => {
    try {
        await AsyncStorage.setItem('winterSchedules', JSON.stringify(data));
        await AsyncStorage.setItem('lastUpdated', Date.now().toString()); // save the timestamp
    } catch (error) {
        console.error("Error saving data to local state:", error);
    }
};


  const fetchDataFromLocalState = async () => {
    try {
        const savedData = await AsyncStorage.getItem('summerSchedules');
        const lastUpdated = await AsyncStorage.getItem('lastUpdated');

        if (savedData !== null && lastUpdated !== null) {
            const timeElapsed = Date.now() - parseInt(lastUpdated);
            const oneDay = 24 * 60 * 60 * 1000; // in milliseconds

            if (timeElapsed > oneDay) {
                fetchWinterSchedules(); // fetch new data if more than 24 hours old
            } else {
                setSchedules(JSON.parse(savedData));
                setLoading(false);
            }
        } else {
            fetchWinterSchedules(); // if no data is found, fetch it
        }
    } catch (error) {
        console.error("Error fetching data from local state:", error);
    }
};


  useEffect(() => {
    fetchDataFromLocalState();
  }, []);

  const getMaxWidth = (data) => {
    const maxContentWidth = Math.max(
      ...data.map((content) => content.length)
    );
    return maxContentWidth * 10; // Adjust the multiplication factor as needed
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {loading ? ( // If loading is true, show ActivityIndicator
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : ( // Otherwise, render your main content
        <>
          <Text
            style={{
              fontWeight: "bold",
              color: theme.colors.onBackground,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Winter Daily Schedules
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
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

          <ScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{
        justifyContent: "center",
        padding: 20,
        paddingTop: 50,
    }}
    refreshControl={
        <RefreshControl refreshing={refreshing}
         onRefresh={handleRefresh}
         colors={[theme.colors.primary]}
         tintColor={theme.colors.primary}
         />    }
>
            {daysOfWeek.map((day) => (
              <View key={day} style={{ alignItems: "center", width: '100%' }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: theme.colors.onBackground,
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  {`${day.charAt(0).toUpperCase() + day.slice(1)}`}
                </Text>
                {schedules[day] &&
                  schedules[day].islandDepartures.map((time, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 10,
                        width: '100%',
                      }}
                    >
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
                            color: theme.colors.onBackground,
                            textAlign: "center",
                          }}
                        >
                          {time}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          padding: 5,
                          borderRadius: 5,
                          borderColor: theme.colors.primary,
                          marginLeft: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.onBackground,
                            textAlign: "center",
                          }}
                        >
                          {schedules[day].mainlandDepartures[index]}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

