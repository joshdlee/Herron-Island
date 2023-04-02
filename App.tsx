import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform, useColorScheme } from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import TideChart from './TideChart';
import { lightTheme, darkTheme } from './theme';
import FerryTab from './FerryTab';
import Weather from './Weather';

const Tab = createMaterialBottomTabNavigator();

function MyTabs({ theme }) {
  return (
    <Tab.Navigator
      initialRouteName="Ferry"
      activeColor={theme.colors.accent}
      inactiveColor={theme.colors.onSurfaceVariant}
      barStyle={{ backgroundColor: theme.colors.surfaceVariant,
        borderTopColor: theme.colors.outline,
        borderTopWidth: 1,
       }}
    >
      <Tab.Screen
        name="FerrySchedule"
        component={ FerryTab }
        options={{
          tabBarLabel: 'Ferry',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="ferry" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="TideChart"
        component={ TideChart }
        options={{
          tabBarLabel: 'Tides',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="wave" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Weather"
        component={ Weather }
        options={{
          tabBarLabel: 'Weather',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cloud" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerWrapper}>
          <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>Herron Island</Text>
            <Button 
              mode="contained" 
              onPress={toggleTheme} 
              labelStyle={{ color: theme.colors.onPrimary }}
              icon={isDarkMode ? "weather-sunny" : "weather-night"}>
              {isDarkMode ? 'Light' : 'Dark'}
            </Button>
          </View>
        </View>
        <NavigationContainer>
          <MyTabs theme={theme} />
        </NavigationContainer>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerWrapper: {
    paddingTop: Platform.OS === 'ios' ? 40 : 0, // Add the padding for iOS devices
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: Platform.OS === 'ios' ? 16 : 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
   
