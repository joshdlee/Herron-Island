import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as queries from "./src/graphql/queries";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { customListDaySchedules, customListLowTides } from "./src/API";
import { listBanners } from "./src/graphql/queries";
import { useTheme, Modal, Portal } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { Card } from 'react-native-paper';
import { Dimensions } from 'react-native';
import { config } from './src/config';

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

  // Check if we should use prototype schedule based on feature flag and date range
  if (config.featureFlags.usePrototypeSchedule) {
    if (date >= config.featureFlags.prototypeScheduleStartDate && 
        date <= config.featureFlags.prototypeScheduleEndDate) {
      return {
        season: "prototype",
        day: dayOfWeek,
      };
    }
  }

  return {
    season: month >= 4 && month <= 9 ? "summer" : "winter",
    day: dayOfWeek,
  };
}

async function fetchAllSchedules() {
  try {
    Amplify.Logger.LOG_LEVEL = "DEBUG";
    const result = await API.graphql(graphqlOperation(customListDaySchedules));
    // Filter out banner items and any items without required fields
    const items = result.data?.listDaySchedules?.items || [];
    return items.filter(item => 
      item.type !== 'banner' && 
      item.day && 
      item.mainlandDepartures && 
      item.islandDepartures
    );
  } catch (error) {
    console.error("Error fetching all schedules:", error);
    return [];
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

async function fetchBanner() {
  try {
    // Fetch from the new Banner table
    const result: any = await API.graphql(graphqlOperation(listBanners));
    
    const banners = result.data?.listBanners?.items || [];
    console.log("Banners from table:", banners);
    
    // Filter for active banners within date range
    const today = new Date();
    const activeBanners = banners.filter(banner => {
      if (!banner.isActive) return false;
      const startDate = new Date(banner.startDate);
      const endDate = new Date(banner.endDate);
      return today >= startDate && today <= endDate;
    });
    
    // Sort by priority (lower number = higher priority)
    activeBanners.sort((a, b) => (a.priority || 999) - (b.priority || 999));
    
    if (activeBanners.length > 0) {
      console.log("Active banner:", activeBanners[0]);
      return activeBanners[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching banner:", error);
    return null;
  }
}

function adjustScheduleForLowTides(schedule, lowTides) {
  // Check if lowTides is null or undefined
  if (!lowTides) {
    return schedule;
  }

  console.log("Adjusting schedule for low tides:", lowTides);

  let updatedMainlandDepartures = schedule.mainlandDepartures.filter(
    (time) => !lowTides.cancelMainland.includes(time)
  );

  updatedMainlandDepartures = [
    ...updatedMainlandDepartures,
    ...lowTides.rescheduleMainland.filter(time => time.trim() !== "")
  ];

  let updatedIslandDepartures = schedule.islandDepartures.filter(
    (time) => !lowTides.cancelIsland.includes(time)
  );

  updatedIslandDepartures = [
    ...updatedIslandDepartures,
    ...lowTides.rescheduleIsland.filter(time => time.trim() !== "")
  ];

  // Check if there are any cancellations due to low tides and specify the type
  let alertMessage = "";

  // Check for Island cancellations
  const islandCancellations = lowTides.cancelIsland.filter(
    (time) => time.trim() !== ""
  );
  if (islandCancellations.length > 0) {
    alertMessage += `Island departures cancelled: ${islandCancellations.join(
      ", "
    )}. `;
  }

  // Check for Mainland cancellations
  const mainlandCancellations = lowTides.cancelMainland.filter(
    (time) => time.trim() !== ""
  );
  if (mainlandCancellations.length > 0) {
    alertMessage += `Mainland departures cancelled: ${mainlandCancellations.join(
      ", "
    )}. `;
  }

  if (alertMessage) {
    // Make sure Alert is imported at the top of the file
    Alert.alert("Tide Cancellation", alertMessage.trim(), [{ text: "OK" }]);
  }

  return {
    ...schedule,
    mainlandDepartures: updatedMainlandDepartures,
    islandDepartures: updatedIslandDepartures,
  };
}

export default function GetScheduleV2() {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const columnGap = screenWidth * 0.05; // 5% of screen width for gap
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [banner, setBanner] = useState(null);

  // Move styles inside component to access theme
  const styles = {
    headerText: {
      fontSize: 16,
      fontWeight: 'bold' as const,
      textAlign: 'center' as const,
      color: theme.colors.onBackground,
    },
    timeBox: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      padding: 12,
      margin: 2,
      width: '98%' as const,
    },
    timeText: {
      fontSize: 16,
      textAlign: 'center' as const,
      color: theme.colors.onSurface,
    },
  };

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      
      // Fetch banner message
      const bannerData = await fetchBanner();
      console.log("Setting banner state:", bannerData);
      setBanner(bannerData);
      
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

      // Process islandDepartures after the changes for mainlandDepartures
      fetchedSchedule.islandDepartures = fetchedSchedule.islandDepartures
        .map((time) => convertTo24Hour(time))
        .filter((time) => time !== null && time.includes(":")) // Ensure valid times
        .sort((a, b) => {
          const timeA = parseInt(a.replace(":", ""));
          const timeB = parseInt(b.replace(":", ""));
          return timeA - timeB;
        })
        .map((time) => formatDate(time)); // Format back to AM/PM

      console.log(
        "function and sorted Island Departures:",
        fetchedSchedule.islandDepartures
      );
      setSchedule(fetchedSchedule);

      setLoading(false);
    }

    fetchInitialData();
  }, []); // The empty dependency array ensures this hook runs only once, when the component mounts.

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

  // 2. Simplify the onChange handler to match the old code
  const onChange = async (event, selectedDate) => {
    console.log("Date selected:", selectedDate); // Debug log
    setShowPicker(false);

    if (selectedDate) {
      setLoading(true);
      try {
        setDate(selectedDate);
        let fetchedSchedule = await fetchScheduleForDate(selectedDate);
        console.log("Fetched schedule:", fetchedSchedule); // Debug log

        const lowTides = await fetchLowTides(selectedDate);
        
        if (fetchedSchedule) {
          fetchedSchedule = adjustScheduleForLowTides(
            fetchedSchedule,
            lowTides || {
              cancelMainland: [],
              cancelIsland: [],
              rescheduleMainland: [],
              rescheduleIsland: [],
            }
          );

          // Process mainland departures
          fetchedSchedule.mainlandDepartures = fetchedSchedule.mainlandDepartures
            .map((time) => convertTo24Hour(time))
            .filter((time) => time !== null && time.includes(":"))
            .sort((a, b) => {
              const timeA = parseInt(a.replace(":", ""));
              const timeB = parseInt(b.replace(":", ""));
              return timeA - timeB;
            })
            .map((time) => formatTime(time));

          // Process island departures
          fetchedSchedule.islandDepartures = fetchedSchedule.islandDepartures
            .map((time) => convertTo24Hour(time))
            .filter((time) => time !== null && time.includes(":"))
            .sort((a, b) => {
              const timeA = parseInt(a.replace(":", ""));
              const timeB = parseInt(b.replace(":", ""));
              return timeA - timeB;
            })
            .map((time) => formatTime(time));

          console.log("Processed schedule:", fetchedSchedule); // Debug log
          setSchedule(fetchedSchedule);
        }
      } catch (error) {
        console.error("Error updating schedule:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  function formatDate(d) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return d.toLocaleDateString(undefined, options);
  }

  // 3. Add helper function for time formatting
  const formatTime = (time) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    if (hours > 12) {
      return `${hours - 12}:${minutes}PM`;
    } else if (hours === 12) {
      return `${hours}:${minutes}PM`;
    } else if (hours === 0) {
      return `12:${minutes}AM`;
    } else {
      return `${hours}:${minutes}AM`;
    }
  };

  console.log("Date:", date);
  console.log("Schedule:", schedule);

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background,
      width: '100%',
    }}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <View style={{ flex: 1, width: '100%' }}>
          {/* Banner Message */}
          {banner && (
            <View style={{
              backgroundColor: banner.backgroundColor || theme.colors.primary,
              padding: 12,
              marginHorizontal: 10,
              marginTop: 10,
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: banner.severity === 'warning' ? '#FF9800' : 
                             banner.severity === 'error' ? '#F44336' : 
                             banner.severity === 'success' ? '#4CAF50' : '#2196F3',
            }}>
              <Text style={{
                color: banner.textColor || theme.colors.onPrimary,
                fontSize: 14,
                textAlign: 'center',
                fontWeight: '500',
              }}>
                {banner.message}
              </Text>
            </View>
          )}
          
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
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="inline"
                  onChange={onChange}
                  themeVariant={theme.dark ? "dark" : "light"}
                  accentColor={theme.colors.primary}
                  textColor={theme.colors.primary}
                />
              )}
            </Modal>
          </Portal>

          {/* Date Picker with adjusted styling */}
          <View style={{ 
            backgroundColor: theme.colors.primary,
            marginHorizontal: 20,  // Increased horizontal margin
            marginVertical: 10,    // Keep vertical margin
            borderRadius: 8,
            paddingVertical: 12,   // Reduced vertical padding
            paddingHorizontal: 16, // Added horizontal padding
          }}>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 15,           // Added gap between icon and text
              }}
            >
              <Icon 
                name="calendar" 
                size={22}          // Slightly smaller icon
                color={theme.colors.onPrimary} 
              />
              <Text style={{ 
                color: theme.colors.onPrimary,
                fontSize: 18,
                fontWeight: '500'
              }}>
                {formatDate(date)}
              </Text>
            </TouchableOpacity>
          </View>

          {schedule && (
            <View style={{ flex: 1, width: '100%', padding: 10 }}>
              <View style={{ 
                flexDirection: 'row',
                paddingVertical: 15,
                width: '100%',
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.headerText}>
                    Island Departures
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.headerText}>
                    Mainland Departures
                  </Text>
                </View>
              </View>

              <ScrollView style={{ width: '100%' }}>
                {schedule.islandDepartures.map((time, index) => (
                  <View 
                    key={index}
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 5,
                      width: '100%',
                    }}
                  >
                    <View style={{ 
                      flex: 1,
                      paddingHorizontal: 1,
                    }}>
                      <View style={styles.timeBox}>
                        <Text style={styles.timeText}>
                          {time}
                        </Text>
                      </View>
                    </View>
                    <View style={{ 
                      flex: 1,
                      paddingHorizontal: 1,
                    }}>
                      <View style={styles.timeBox}>
                        <Text style={styles.timeText}>
                          {schedule.mainlandDepartures[index]}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

