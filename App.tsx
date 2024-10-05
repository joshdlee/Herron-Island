// App.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet, Platform, useColorScheme, StatusBar, Image } from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import TideChart from './TideChart';
import { lightTheme, darkTheme } from './theme';
import FerryTab from './FerryTab';
import Weather from './Weather';
import HerronIsland from './HerronIsland';
import {Amplify, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import BoostersShoppingTab from './BoosterShoppingTab';
import { CartProvider } from './src/CartContext';

Amplify.configure(awsconfig);

const Tab = createMaterialBottomTabNavigator();

function MyTabs({ theme }: { theme: any }) {
  return (
    <Tab.Navigator
      initialRouteName="Ferry"
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurface}
      barStyle={{
        backgroundColor: theme.colors.surfaceVariant,
        borderTopColor: theme.colors.outline,
        borderTopWidth: 1,
      }}
    >
      <Tab.Screen
        name="FerrySchedule"
        component={FerryTab}
        options={{
          tabBarLabel: 'Ferry',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="ferry" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="TideChart"
        component={TideChart}
        options={{
          tabBarLabel: 'Tides',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="wave" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Weather"
        component={Weather}
        options={{
          tabBarLabel: 'Weather',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cloud" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="HerronIsland"
        component={HerronIsland}
        options={{
          tabBarLabel: 'Herron Island',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="island" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="BoostersShopping"
        component={BoostersShoppingTab}
        options={{
          tabBarLabel: 'Boosters Merch',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="shopping" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const [userTheme, setUserTheme] = useState<'light' | 'dark' | null>(null);

  const toggleTheme = () => {
    setUserTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const theme = userTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <CartProvider>
      <PaperProvider theme={theme}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.headerWrapper}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image
                  source={require('./assets/Herron-Island-Teal.png')}
                  style={{ resizeMode: 'contain', height: 40 }}
                />
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Button onPress={toggleTheme} style={{ justifyContent: 'center' }}>
                  <MaterialCommunityIcons
                    name={userTheme === 'dark' ? 'weather-night' : 'weather-sunny'}
                    color={theme.colors.onSurface}
                    size={20}
                  />
                </Button>
              </View>
            </View>
          </View>
          <NavigationContainer>
            <MyTabs theme={theme} />
          </NavigationContainer>
        </View>
      </PaperProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerWrapper: {
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
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
