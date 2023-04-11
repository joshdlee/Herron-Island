import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import ferrySchedule from './ferrySchedule.json';
import { useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const HolidaySchedule = () => {
  const theme = useTheme();
  const holidaySchedule = ferrySchedule.holiday;

  return (
    <View style={[styles(theme).container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles(theme).heading, { color: theme.colors.onBackground }]}>Holiday Schedule</Text>
      <View style={styles(theme).scheduleHeader}>
        <View style={[styles(theme).column, { alignItems: 'center' }]}>
          <Text style={[styles(theme).subHeading, { color: theme.colors.onBackground, textAlign: 'center' }]}>Island</Text>
        </View>
        <View style={[styles(theme).column, { alignItems: 'center' }]}>
          <Text style={[styles(theme).subHeading, { color: theme.colors.onBackground, textAlign: 'center' }]}>Mainland</Text>
        </View>
      </View>
      <View style={styles(theme).schedule}>
        <ScrollView>
          {Object.keys(holidaySchedule).map((holidayName, index) => {
            const holiday = holidaySchedule[holidayName];

            const mainlandDepartureTimes = holiday.mainland.departure_times;
            const islandDepartureTimes = holiday.island.departure_times;

            const date = holidayName.split('#')[1];
            console.log(`date :${date}`);
            const holidayNameWithoutDate = holidayName.split('#')[0];
            const holidayDate = new Date(date);
            console.log(`holidayDate :${holidayDate}`);
            const formattedDate = holidayDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
            const holidayWithDate = holidayNameWithoutDate.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
            return (
              <View key={index} style={styles(theme).dayContainer}>
                <Text style={[styles(theme).heading2, { color: theme.colors.onSurface }]}>{holidayWithDate}</Text>
                <View style={styles(theme).tableContainer}>
                <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.outline }}>
                    {islandDepartureTimes.map((time, index) => {
                      return (
                      <Row
                        key={index}
                        data={[time]}
                        widthArr={[StyleSheet.flatten(styles(theme).tableColumn).width]}
                        style={[styles(theme).tableRow, { backgroundColor: theme.colors.surface }]}
                        textStyle={[styles(theme).tableRowText, { color: theme.colors.onSurface }]}
                      />
                      );
                    })}
                  </Table>
                  <Text>
                  <View style={{ width: 20 }} /> {/* gap between column */}
                  <Table borderStyle={{ borderWidth: 1, borderColor: theme.colors.outline }}>
                    {mainlandDepartureTimes.map((time, index) => {
                      return (
                      <Row
                        key={index}
                        data={[time]}
                        widthArr={[StyleSheet.flatten(styles(theme).tableColumn).width]}
                        style={[styles(theme).tableRow, { backgroundColor: theme.colors.surface }]}
                        textStyle={[styles(theme).tableRowText, { color: theme.colors.onSurface }]}
                      />
                      );
                    })}
                  </Table>
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = (theme) => {
  const screenWidth = Dimensions.get('window').width;
  const dynamicWidth = screenWidth * 0.3;
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
marginBottom: 10,
color: theme.colors.primary,
textAlign: 'center',
},
heading2: {
fontSize: 15,
fontWeight: 'bold',
marginBottom: 10,
color: theme.colors.onSurface,
textAlign: 'center',
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
fontSize: 13,
fontWeight: 'bold',
marginBottom: 10,
textAlign: 'center',
color: theme.colors.onSurface,
},
schedule: {
flex: 1,
minWidth: dynamicWidth
},
tableContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
},
tableHeader: {
height: 40,
justifyContent: 'center',
},
tableHeaderText: {
textAlign: 'center',
fontWeight: 'bold',
color: theme.colors.onPrimary,
},
tableRow: {
height: 40,
justifyContent: 'center',
},
tableRowText: {
textAlign: 'center',
color: theme.colors.onSurface,
},
tableColumn: {
  width: dynamicWidth,
},
});
};


export default HolidaySchedule;