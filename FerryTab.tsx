import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TodayFerrySchedule from './Today';
import SummerFerrySchedule from './Summer';
import WinterFerrySchedule from './Winter';
import LowTides from './LowTides';
import { useTheme } from 'react-native-paper';
import HolidaySchedule from './Holiday';

export default function FerryTab() {
  const theme = useTheme();
  const [activeComponent, setActiveComponent] = React.useState('Today');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Today':
        return <TodayFerrySchedule />;
      case 'Summer':
        return <SummerFerrySchedule />;
      case 'Winter':
        return <WinterFerrySchedule />;
      case 'Low Tides':
        return <LowTides />;
      case 'Holidays':
        return <HolidaySchedule />;
      default:
        return null;
    }
  };

  const renderButton = (title, iconName) => {
    const isActive = activeComponent === title;
    return (
      <TouchableOpacity
        style={[
          styles.iconButton,
          {
            backgroundColor: isActive ? theme.colors.primary : 'rgba(0, 0, 0, 0.1)',
            opacity: isActive ? 1 : 0.6,
          },
        ]}
        onPress={() => setActiveComponent(title)}
      >
        <MaterialCommunityIcons name={iconName} size={24} color={isActive ? 'white' : theme.colors.primary} />
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.buttonContainer}>
        {renderButton('Today', 'calendar-today')}
        {renderButton('Summer', 'weather-sunny')}
        {renderButton('Winter', 'weather-snowy')}
        {renderButton('Low Tides', 'waves')}
        {renderButton('Holidays', 'calendar-star')}
      </View>
      <View style={styles.componentContainer}>{renderComponent()}</View>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: screenWidth / 4 - 20,
  },
  componentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 10,
    width: '100%',
    paddingHorizontal: 0,
  },
});
