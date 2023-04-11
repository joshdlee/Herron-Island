import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ferrySchedule from './ferrySchedule.json';
import lowTides from './low_tides.json';
import { Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Portal, Button, Provider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';



const removeDuplicates = (times) => {
  return times.filter((time, index, self) => {
    return self.indexOf(time) === index;
  });
};

const TodayFerrySchedule = () => {
  const theme = useTheme();
  const applyLowTideModifications = (schedule, date) => {
    const dateStr = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
    const lowTideInfo = lowTides.low_tides[dateStr];

    if (!lowTideInfo) {
      return schedule;
    }

    const modifiedSchedule = { ...schedule };

    const convertTo24Hour = (time) => {
      const [hour, minute] = time.split(':');
      const period = time.slice(-2);
      let hour24 = parseInt(hour);

      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
      }

      return `${hour24.toString().padStart(2, '0')}:${minute.slice(0, -2)}`;
    };

    ['mainland', 'island'].forEach((location) => {
      if (lowTideInfo.cancel && lowTideInfo.cancel[location]) {
        modifiedSchedule[location].departure_times = modifiedSchedule[location].departure_times.filter(
          (time) => !lowTideInfo.cancel[location].departure_times.includes(time)
        );
      }

      if (lowTideInfo.reschedule && lowTideInfo.reschedule[location]) {
        modifiedSchedule[location].departure_times = [
          ...modifiedSchedule[location].departure_times,
          ...lowTideInfo.reschedule[location].departure_times,
        ].sort((a, b) => {
          const aTime24 = convertTo24Hour(a);
          const bTime24 = convertTo24Hour(b);

          const aTime = aTime24.split(':').map((x, i) => i === 0 ? parseInt(x) * 60 : parseInt(x));
          const bTime = bTime24.split(':').map((x, i) => i === 0 ? parseInt(x) * 60 : parseInt(x));
          return (aTime[0] + aTime[1]) - (bTime[0] + bTime[1]);
        });
      }

      if (lowTideInfo.reschedule && lowTideInfo.reschedule[location]) {
        modifiedSchedule[location].reschedule = lowTideInfo.reschedule[location].departure_times;
      }
  
      if (lowTideInfo.cancel && lowTideInfo.cancel[location]) {
        modifiedSchedule[location].cancel = lowTideInfo.cancel[location].departure_times;
      }
    });
  
    return modifiedSchedule;

  };
  const renderNote = (location) => {
    const rescheduleItems = schedule[location].reschedule ? schedule[location].reschedule.map((time) => (
      <Chip
        key={time}
        textStyle={{ fontSize: 10 }}
        icon={() => <MaterialCommunityIcons name="clock-outline" size={10} color="white" />}
        style={{ backgroundColor: theme.colors.secondary, margin: 1 }}
          >
        {time} Added
      </Chip>
    )) : null;
  
    const cancelItems = schedule[location].cancel ? schedule[location].cancel.map((time) => (
      <Chip
        key={time}
        textStyle={{ fontSize: 10 }}
        icon={() => <MaterialCommunityIcons name="cancel" size={10} color="white" />}
        style={{ backgroundColor: theme.colors.error, margin: 1 }}
      >
        {time} Removed
      </Chip>
    )) : null;
  
    return (
      <View style={styles.noteContainer}>
        {rescheduleItems}
        {cancelItems}
      </View>
    );
  };
  
  const isHoliday = (date, holidays) => {
    const currentDateStr = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;

    for (const holidayKey of Object.keys(holidays)) {
      const holidayDateStr = holidayKey.split('#')[1];
      if (currentDateStr === holidayDateStr) {
        return true;
      }
    }
    return false;
  };

  // Add a state to store the selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Add a state to control the visibility of the date picker modal
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const hideModal = () => setVisible(false);

  
    // Add this function to handle date changes and update modal visibility
    const handleDateChange = (event, date) => {
      if (date) {
        setSelectedDate(date);
      }
      setShowModal(false);
    };
    useFocusEffect(
      React.useCallback(() => {
        setSelectedDate(new Date());
      }, [])
    );
  const getTodaySchedule = () => {
    const currentDate = selectedDate;
    const today = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][currentDate.getDay()];
    const isSummer = (currentDate.getMonth() >= 3 && currentDate.getDate() >= 1) && (currentDate.getMonth() <= 8 && currentDate.getDate() <= 30);

    let schedule = isSummer ? ferrySchedule.summer[day] : ferrySchedule.winter[day];

    // Check for holidays
    for (const holidayKey in ferrySchedule.holiday) {
      const holidayDate = holidayKey.split("#")[1];
      if (today === holidayDate) {
        schedule = ferrySchedule.holiday[holidayKey];
        break;
      }
    }

    // Apply low tide modifications
    schedule = applyLowTideModifications(schedule, currentDate);

    return schedule;
  };
  
  const schedule = getTodaySchedule();

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
    hideModal();
  };

  const mainlandTableData = removeDuplicates(schedule.mainland.departure_times).map((time) => [time]);
  const islandTableData = removeDuplicates(schedule.island.departure_times).map((time) => [time]);

  const renderScrollIndicator = () => {
    return (
      <View>
        <LinearGradient
          colors={['rgba(0,0,0,0)', theme.colors.background]}
        />
        <Icon
          name="chevron-down"
          size={24}
          color={theme.colors.primary}
        />
      </View>
    );
  };
    // Render the date picker modal
    const renderDatePicker = () => {
      return (
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles(theme).modalContent}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
              maximumDate={new Date(new Date().getFullYear(), 11, 31)}
            />
          </Modal>
        </Portal>
      );
    };
    // Format the date for display
    const formatDate = (date) => {
      return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
    };
return (
  <View style={[styles(theme).container, { backgroundColor: theme.colors.background }]}>
    <View style={styles(theme).dateContainer}>
    <TouchableOpacity style={styles(theme).button} onPress={() => setShowModal(true)}>
  <Text style={[styles(theme).buttonText, { color: "white" }]}>
    {formatDate(selectedDate)}
  </Text>
</TouchableOpacity>
    </View>
        <Portal>
          <Modal visible={showModal} onDismiss={() => setShowModal(false)} contentContainerStyle={styles(theme).modalContainer}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="inline"
              minimumDate={new Date()}
              maximumDate={new Date(new Date().getFullYear(), 11, 31)}
              onChange={handleDateChange}
              themeVariant={theme.dark ? 'dark' : 'light'}
              accentColor={theme.colors.primary}
              textColor={theme.colors.primary}
            />
            <Button onPress={() => setShowModal(false)}>Close</Button>
          </Modal>
        </Portal>

    <View style={styles(theme).schedule}>
      <View style={styles(theme).column}>
        <Text style={[styles(theme).subHeading, { color: theme.colors.onBackground, textAlign: 'center' }]}>Island</Text>
        {renderNote('island')}
        <ScrollView>
          <View style={{ minHeight: islandTableData.length * 40 }}>
            <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.outline }}>
              {islandTableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  style={[styles(theme).row, { backgroundColor: theme.colors.surface }]}
                  textStyle={[styles(theme).rowText, { color: theme.colors.onSurface }]}
                />
              ))}
            </Table>
          </View>
          {renderScrollIndicator()}
        </ScrollView>
      </View>
      <View style={styles(theme).column}>
        <Text style={[styles(theme).subHeading, { color: theme.colors.onBackground, textAlign: 'center'  }]}>Mainland</Text>
        {renderNote('mainland')}
        <ScrollView>
          <View style={{ minHeight: mainlandTableData.length * 40 }}>
            <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.outline }}>
              {mainlandTableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  style={[styles(theme).row, { backgroundColor: theme.colors.surface }]}
                  textStyle={[styles(theme).rowText, { color: theme.colors.onSurface }]}
                />
              ))}
            </Table>
          </View>
          {renderScrollIndicator()}
        </ScrollView>
      </View>
    </View>
  </View>
);
};

const styles = (theme) => {
  const screenWidth = Dimensions.get('window').width;
  const dynamicWidth = screenWidth * 0.7;
  return StyleSheet.create({
    modalContainer: {
      backgroundColor: theme.colors.background,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 20,
      flexDirection: 'row',
    },
    buttonText: {
      marginLeft: 2,
      fontSize: 20,
      fontWeight: 'bold',
    },
    modalContent: {
      // backgroundColor: theme.colors.background,
      padding: 20,
      alignSelf: 'center',
    },
    tableHeader: {
      height: 40,
      backgroundColor: theme.colors.primary,
    },
    tableHeaderText: {
      fontSize: 6,
      color: theme.colors.onPrimary,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    tableRow: {
      height: 40,
      backgroundColor: theme.colors.surface,
    },
    tableRowText: {
      fontSize: 16,
      color: theme.colors.onSurface,
      textAlign: 'center',
    },
    noteHeading: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
      color: theme.colors.onSurface,
    },
    noteText: {
      fontSize: 14,
      marginBottom: 5,
      color: theme.colors.onSurface,
    },
    strikeThrough: {
      textDecorationLine: 'line-through',
      color: theme.colors.onSurface,
    },
    rescheduleText: {
      fontSize: 14,
      color: theme.colors.success,
      marginLeft: 5,
    },
    lowTideText: {
      fontSize: 14,
      color: theme.colors.error,
      marginLeft: 5,
    },
    container: {
      flex: 1,
      padding: 5,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.colors.primary,
    },
    schedule: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      minWidth: dynamicWidth,
    },
    column: {
      flex: 1,
      marginHorizontal: 10,
    },
    subHeading: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 0,
      color: theme.colors.primary,
    },
    row: {
      height: 40,
      backgroundColor: theme.colors.surface,
    },
    rowText: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors.onSurface,
    },
    ferryIcon: {
      marginLeft: 10,
    },
    chip: {
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: theme.colors.secondary,
      marginLeft: 10,
    },
    chipText: {
      fontSize: 8,
      color: theme.colors.onSecondary,
    },
    tableHeader: {
      height: 40,
      backgroundColor: theme.colors.primary,
    },
    tableHeaderText: {
      fontSize: 16,
      color: theme.colors.onPrimary,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    tableRow: {
      height: 40,
      backgroundColor: theme.colors.surface,
    },
    tableRowText: {
      fontSize: 16,
      color: theme.colors.onSurface,
      textAlign: 'center',
    },
    scrollIndicatorContainer: {
      position: 'absolute',
      right: 0,
      top: 0, // Adjust this value to position the indicator at the top
      zIndex: 10,
    },    
    scrollIndicatorGradient: {
      position: 'absolute',
      top: -20,
      width: '100%',
      height: 20,
    },
    scrollIndicatorIcon: {
      textAlign: 'center',
      marginBottom: 4,
      transform: [{ rotate: '180deg' }], // Rotate the indicator by 180 degrees
    },
  });
};


export default TodayFerrySchedule;
  