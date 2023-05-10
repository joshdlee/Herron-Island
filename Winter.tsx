import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import ferrySchedule from './ferrySchedule.json';
import { useTheme } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

const removeDuplicates = (times) => {
  return times.filter((time, index, self) => {
    return self.indexOf(time) === index;
  });
};

const WinterFerrySchedule = () => {
  const theme = useTheme();

  const getWeeklySchedule = () => {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const weeklySchedule = {};

    for (const day of daysOfWeek) {
      let schedule = ferrySchedule.winter[day];
      weeklySchedule[day] = schedule;
    }

    return weeklySchedule;
  };

  const weeklySchedule = getWeeklySchedule();

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={[styles(theme).container]}>
        <Text style={[styles(theme).heading, { color: theme.colors.onBackground }]}>Winter</Text>
        <View style={styles(theme).scheduleHeader}>
          <View style={styles(theme).column}>
            <Text style={[styles(theme).subHeading, { color: theme.colors.onBackground }]}>Island</Text>
          </View>
          <View style={styles(theme).column}>
            <Text style={[styles(theme).subHeading, { color: theme.colors.onBackground }]}>Mainland</Text>
          </View>
        </View>
        {Object.keys(weeklySchedule).map((day) => {
          const schedule = weeklySchedule[day];
          const mainlandTableData = removeDuplicates(schedule.mainland.departure_times).map((time) => [time]);
          const islandTableData = removeDuplicates(schedule.island.departure_times).map((time) => [time]);

          return (
            <View key={day} style={styles(theme).dayContainer}>
              <Text style={[styles(theme).dayHeading, { color: theme.colors.onBackground }]}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
              <View style={styles(theme).schedule}>
                <View style={styles(theme).column}>
                  <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.outline }}>
                    {islandTableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        style={[styles(theme).row, { backgroundColor: theme.colors.surface }]}
                        textStyle={{ ...styles(theme).rowText, color: theme.colors.onSurface }}
                      />
                    ))}
                  </Table>
                </View>
                <View style={styles(theme).column}>
                  <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.outline }}>
                    {mainlandTableData.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        style={[styles(theme).row, { backgroundColor: theme.colors.surface }]}
                        textStyle={{ ...styles(theme).rowText, color: theme.colors.onSurface }}
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
  const screenWidth = Dimensions.get('window').width;
  const dynamicWidth = screenWidth * 0.4;
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.colors.primary,
    },
    scheduleHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      },
      column: {
        flex: 1,
        marginHorizontal: 10,
        textAlign: 'center',
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
      subHeading: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 0,
        color: theme.colors.primary,
        textAlign: 'center',
      },
    dayContainer: {
      marginBottom: 20,
    },
    dayHeading: {
      fontSize: 18,
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
    row: {
      height: 40,
      backgroundColor: theme.colors.surface,
    },
    rowText: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors.onSurface,
    },
  });
};

export default WinterFerrySchedule;
