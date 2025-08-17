import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { API_KEY } from '@env';

const API_KEY = '941a855f2988bdb2cef42cfa9e3669d3'

const LATITUDE = '47.2644';
const LONGITUDE = '-122.8343';
const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=imperial&appid=${API_KEY}`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=imperial&appid=${API_KEY}`;

const getMoonPhase = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Calculate approximate moon phase using the Conway algorithm
  let r = year % 100;
  r %= 19;
  if (r > 9) r -= 19;
  r = ((r * 11) % 30) + month + day;
  if (month < 3) r += 2;
  r -= ((year < 2000) ? 4 : 8.3);
  r = Math.floor(r + 0.5) % 30;
  // Convert to percentage (0-1)
  const moonPhase = r / 30;
  
  // Return moon phase description
  if (moonPhase < 0.05 || moonPhase > 0.95) return 'New Moon 🌑';
  if (moonPhase < 0.20) return 'Waxing Crescent 🌒';
  if (moonPhase < 0.30) return 'First Quarter 🌓';
  if (moonPhase < 0.45) return 'Waxing Gibbous 🌔';
  if (moonPhase < 0.55) return 'Full Moon 🌕';
  if (moonPhase < 0.70) return 'Waning Gibbous 🌖';
  if (moonPhase < 0.80) return 'Last Quarter 🌗';
  return 'Waning Crescent 🌘';
};

const Weather = () => {
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchWeatherData = async () => {
        try {
          const [currentResponse, forecastResponse] = await Promise.all([
            fetch(API_URL),
            fetch(FORECAST_URL)
          ]);

          const currentData = await currentResponse.json();
          const forecast = await forecastResponse.json();

          // Check for alerts in the API response
          if (forecast.alerts) {
            setAlerts(forecast.alerts);
          } else {
            setAlerts([]);
          }

          setWeatherData(currentData);
          
          // Process forecast data to get next 3 days
          const threeDayForecast = forecast.list
            .filter(item => item.dt_txt.includes('12:00:00')) // Get noon forecasts
            .slice(0, 3)
            .map(item => ({
              date: new Date(item.dt * 1000),
              highTemp: Math.round(item.main.temp_max),
              lowTemp: Math.round(item.main.temp_min),
              description: item.weather[0].description,
              icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`
            }));
          
          setForecastData(threeDayForecast);
        } catch (err) {
          console.error('Weather API Error:', err);
          setError(err.message);
        }
      };

      fetchWeatherData();
    }, [])
  );

  if (!weatherData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.error }}>Error loading weather data: {error}</Text>
      </View>
    );
  }

  const nowTemp = weatherData?.main?.temp ? Math.round(weatherData.main.temp) : 'N/A';
  const nowWeather = weatherData?.weather?.[0]?.description ?? 'Unknown';
  const nowIcon = weatherData?.weather?.[0]?.icon 
    ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`
    : null;
  const sunriseTime = weatherData?.sys?.sunrise 
    ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()
    : 'N/A';
  const sunsetTime = weatherData?.sys?.sunset
    ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()
    : 'N/A';

  const moonPhaseInfo = getMoonPhase(new Date());

  const styles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 16,
    },
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 24,
    },
    weatherCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 5,
      padding: 20,
      marginBottom: 16,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    currentWeather: {
      alignItems: 'center',
    },
    temperature: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
      textAlign: 'center',
    },
    weatherDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    weatherIcon: {
      width: 50,
      height: 50,
      marginRight: 8,
    },
    description: {
      fontSize: 20,
      color: theme.colors.onBackground,
      textTransform: 'capitalize',
      textAlign: 'center',
    },
    sunTimesCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 5,
      padding: 20,
      marginBottom: 16,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    sunTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    sunTimeText: {
      fontSize: 16,
      color: theme.colors.onBackground,
      marginLeft: 8,
      textAlign: 'center',
    },
    forecastCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 5,
      padding: 20,
      marginBottom: 16,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    forecastTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.colors.onSurface,
    },
    alertsContainer: {
      marginBottom: 16,
    },
    alertCard: {
      backgroundColor: theme.colors.error,
      borderRadius: 5,
      padding: 16,
      marginBottom: 8,
      borderColor: theme.colors.error,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    alertContent: {
      flex: 1,
      marginLeft: 12,
    },
    alertTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    alertDescription: {
      color: '#fff',
      fontSize: 14,
    },
    forecastContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    forecastDay: {
      alignItems: 'center',
      flex: 1,
    },
    forecastIcon: {
      width: 40,
      height: 40,
      marginVertical: 8,
    },
    forecastDate: {
      fontSize: 16,
      color: theme.colors.onBackground,
      marginBottom: 4,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    forecastTemp: {
      fontSize: 14,
      color: theme.colors.onBackground,
      marginTop: 4,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles(theme).container}>
      <ScrollView contentContainerStyle={styles(theme).scrollContent}>
        {alerts.length > 0 && (
          <View style={styles(theme).alertsContainer}>
            {alerts.map((alert, index) => (
              <View key={index} style={styles(theme).alertCard}>
                <MaterialCommunityIcons name="alert" size={24} color="#fff" />
                <View style={styles(theme).alertContent}>
                  <Text style={styles(theme).alertTitle}>{alert.event}</Text>
                  <Text style={styles(theme).alertDescription}>{alert.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
                
        <View style={styles(theme).weatherCard}>
          <View style={styles(theme).currentWeather}>
            <Text style={styles(theme).temperature}>{nowTemp}°F</Text>
            <View style={styles(theme).weatherDetails}>
              {nowIcon && <Image source={{ uri: nowIcon }} style={styles(theme).weatherIcon} />}
              <Text style={styles(theme).description}>{nowWeather}</Text>
            </View>
          </View>
        </View>

        <View style={styles(theme).sunTimesCard}>
          <View style={styles(theme).sunTimeRow}>
            <MaterialCommunityIcons name="weather-sunset-up" size={24} color={theme.colors.primary} />
            <Text style={styles(theme).sunTimeText}>Sunrise: {sunriseTime}</Text>
          </View>
          <View style={styles(theme).sunTimeRow}>
            <MaterialCommunityIcons name="weather-sunset-down" size={24} color={theme.colors.primary} />
            <Text style={styles(theme).sunTimeText}>Sunset: {sunsetTime}</Text>
          </View>
          <View style={styles(theme).sunTimeRow}>
            <MaterialCommunityIcons name="moon-waxing-crescent" size={24} color={theme.colors.primary} />
            <Text style={styles(theme).sunTimeText}>Moon Phase: {moonPhaseInfo}</Text>
          </View>
        </View>

        <View style={styles(theme).forecastCard}>
          <Text style={styles(theme).forecastTitle}>3-Day Forecast</Text>
          <View style={styles(theme).forecastContainer}>
            {forecastData.map((day, index) => (
              <View key={index} style={styles(theme).forecastDay}>
                <Text style={styles(theme).forecastDate}>
                  {day.date.toLocaleDateString('en-US', { weekday: 'long' })}
                </Text>
                <Image 
                  source={{ uri: day.icon }} 
                  style={styles(theme).forecastIcon} 
                />
                <Text style={styles(theme).forecastTemp}>
                  {day.highTemp}° / {day.lowTemp}°
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Weather;
