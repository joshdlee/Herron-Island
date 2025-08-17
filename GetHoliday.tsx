import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import { useTheme } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleGlass from './SimpleGlass';

const listDaySchedulesQuery = `
query MyQuery {
  listDaySchedules(limit: 50) {
    items {
      day
      id
      type
    }
  }
}
`;

const getDayScheduleQuery = `
query MyQuery($id: ID!) {
  getDaySchedule(id: $id) {
    id
    islandDepartures
    mainlandDepartures
    type
    day
  }
}
`;

async function getAllHolidays() {
    const result = await API.graphql(graphqlOperation(listDaySchedulesQuery));
    const holidays = result.data.listDaySchedules.items.filter(item => item.type === "holiday");
    return holidays;
}

async function getHolidayDetails(id) {
    const detailedInfo = await API.graphql(graphqlOperation(getDayScheduleQuery, { id: id }));
    return detailedInfo.data.getDaySchedule;
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

// async function fetchAllHolidayDetails() {

//     console.log("Fetching all holiday details...");  // Log start
//     const holidays = await getAllHolidays();
//     console.log("Fetched holidays:", holidays);  // Log fetched holidays

//     const detailedInfoList = [];

//     for (let holiday of holidays) {
//         const detailedInfo = await getHolidayDetails(holiday.id);
//         console.log("Fetched holiday details for:", holiday.id, detailedInfo);  // Log details for each holiday


//         detailedInfo.islandDepartures = convertTo24Hour(detailedInfo.islandDepartures);
//         detailedInfo.mainlandDepartures = convertTo24Hour(detailedInfo.mainlandDepartures);

//         detailedInfo.islandDepartures =
//         detailedInfo.islandDepartures.sort((a, b) => {
//           const timeA = parseInt(a.replace(":", ""));
//           const timeB = parseInt(b.replace(":", ""));
//           return timeA - timeB;
//         });
//       // convert back to AM and PM format
//       detailedInfo.islandDepartures =
//       detailedInfo.islandDepartures.map((time) => {
//           let [hours, minutes] = time.split(":");
//           if (hours > 12) {
//             hours = hours - 12;
//             return `${hours}:${minutes}PM`;
//           } else if (hours == 12) {
//             return `${hours}:${minutes}PM`;
//           } else {
//             return `${hours}:${minutes}AM`;
//           }
//         });

//         detailedInfo.mainlandDepartures =
//         detailedInfo.mainlandDepartures.sort((a, b) => {
//           const timeA = parseInt(a.replace(":", ""));
//           const timeB = parseInt(b.replace(":", ""));
//           return timeA - timeB;
//         });
//       // convert back to AM and PM format
//       detailedInfo.mainlandDepartures =
//       detailedInfo.mainlandDepartures.map((time) => {

//           let [hours, minutes] = time.split(":");
//           if (hours > 12) {
//             hours = hours - 12;
//             return `${hours}:${minutes}PM`;
//           } else if (hours == 12) {
//             return `${hours}:${minutes}PM`;
//           } else {
//             return `${hours}:${minutes}AM`;
//           }
//         });

//         detailedInfoList.push(detailedInfo);
//     }

//     return detailedInfoList;
// }

async function fetchAllHolidayDetails() {
    const holidays = await getAllHolidays();
    const detailedInfoList = [];

    for (let holiday of holidays) {
        const detailedInfo = await getHolidayDetails(holiday.id);

        // Convert each time in the arrays to 24-hour format
        detailedInfo.islandDepartures = detailedInfo.islandDepartures.map(time => convertTo24Hour(time));
        detailedInfo.mainlandDepartures = detailedInfo.mainlandDepartures.map(time => convertTo24Hour(time));

        // Check if data is an array and sort
        if (Array.isArray(detailedInfo.islandDepartures)) {
            detailedInfo.islandDepartures.sort((a, b) => {
                const timeA = parseInt(a.replace(":", ""));
                const timeB = parseInt(b.replace(":", ""));
                return timeA - timeB;
            });
        }

        // Convert back to AM and PM format
        detailedInfo.islandDepartures = detailedInfo.islandDepartures.map((time) => {
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

        // Check if data is an array and sort
        if (Array.isArray(detailedInfo.mainlandDepartures)) {
            detailedInfo.mainlandDepartures.sort((a, b) => {
                const timeA = parseInt(a.replace(":", ""));
                const timeB = parseInt(b.replace(":", ""));
                return timeA - timeB;
            });
        }

        // Convert back to AM and PM format
        detailedInfo.mainlandDepartures = detailedInfo.mainlandDepartures.map((time) => {
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

        detailedInfoList.push(detailedInfo);
    }

        // Sort by holiday date
        detailedInfoList.sort((a, b) => {
            const [monthA, dayA, yearA] = a.day.split("-");
            const dateA = new Date(yearA, monthA - 1, dayA);  // months are 0-based
    
            const [monthB, dayB, yearB] = b.day.split("-");
            const dateB = new Date(yearB, monthB - 1, dayB);  // months are 0-based
    
            return dateA - dateB;
        });

    return detailedInfoList;
}


function formatHolidayName(name) {
    return name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

const CACHE_KEY = 'HOLIDAY_SCHEDULES_CACHE';
const CACHE_DURATION = 24 * 60 * 60 * 1000;  // 24 hours in milliseconds

async function getStoredData() {
    try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
                return parsedData.data;
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching data from cache:", error);
        return null;
    }
}

async function storeData(data) {
    try {
        const toStore = {
            timestamp: Date.now(),
            data
        };
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(toStore));
    } catch (error) {
        console.error("Error storing data to cache:", error);
    }
}

export default function HolidaySchedules() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();

    const fetchData = async () => {
        setLoading(true);
        const details = await fetchAllHolidayDetails();

        storeData(details);
        setSchedules(details);
        setLoading(false);
    };

    const onRefresh = async () => {
      try {
          setRefreshing(true);
          await fetchData();
      } catch (error) {
          console.error('Error during refresh:', error);
      } finally {
          setRefreshing(false);
      }
  };
  

    useEffect(() => {
        getStoredData().then(data => {
            if (data) {
                setSchedules(data);
                setLoading(false);
            } else {
                fetchData();
            }
        });
    }, []);

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background }}>
            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                >
                    <Text style={{ fontWeight: "bold", marginBottom: 10, textAlign: "center", color: theme.colors.onBackground }}>
                        Holiday Schedules
                    </Text>
                    {schedules.map((schedule, index) => (
                        <View key={index} style={{ marginBottom: 20 }}>
                            <Text style={{ 
                                fontWeight: "bold", 
                                marginBottom: 10, 
                                textAlign: "center", 
                                color: theme.colors.onBackground 
                            }}>
                                {`${formatHolidayName(schedule.id.split("#")[0])} - ${schedule.id.split("#")[1]}`}
                            </Text>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: '100%' }}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Text style={{ fontWeight: "bold", marginBottom: 5, color: theme.colors.onBackground }}>
                                        Island Departures
                                    </Text>
                                    <SimpleGlass
                                        style={{
                                            flex: 1,
                                            marginRight: 5,
                                        }}
                                        borderRadius={8}
                                        theme={theme}
                                    >
                                        <View style={{ padding: 10 }}>
                                            {schedule.islandDepartures.map((time: any, i: any) => (
                                                <Text key={i} style={{ marginBottom: 5, color: theme.colors.onBackground, textAlign: "center", fontSize: 14 }}>
                                                    {time}
                                                </Text>
                                            ))}
                                        </View>
                                    </SimpleGlass>
                                </View>

                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={{ fontWeight: "bold", marginBottom: 5, color: theme.colors.onBackground }}>
                                        Mainland Departures
                                    </Text>
                                    <SimpleGlass
                                        style={{
                                            flex: 1,
                                            marginRight: 5,
                                        }}
                                        borderRadius={8}
                                        theme={theme}
                                    >
                                        <View style={{ padding: 10 }}>
                                            {schedule.mainlandDepartures.map((time: any, i: any) => (
                                                <Text key={i} style={{ marginBottom: 5, color: theme.colors.onBackground, textAlign: "center", fontSize: 14 }}>
                                                    {time}
                                                </Text>
                                            ))}
                                        </View>
                                    </SimpleGlass>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}
