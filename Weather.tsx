import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
// import { API_KEY } from '@env';

const API_KEY = '941a855f2988bdb2cef42cfa9e3669d3'

const LATITUDE = '47.2644';
const LONGITUDE = '-122.8343';
const API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${LATITUDE}&lon=${LONGITUDE}&units=imperial&appid=${API_KEY}`;

const Weather = () => {
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);


  useFocusEffect(
    React.useCallback(() => {
      const fetchWeatherData = async () => {
        const response = await fetch(API_URL);
        const data = await response.json();
        setWeatherData(data);
        if (data.alerts) {
          setAlerts(data.alerts);
        }
      };
      
      fetchWeatherData();
    }, [])
  );

  if (!weatherData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderAlerts = () => {
    return alerts.map((alert, index) => (
      <View key={index} style={styles.alert}>
        <Text style={styles.alertTitle}>{alert.event}</Text>
        <Text style={styles.alertSender}>{alert.sender_name}</Text>
        <Text style={styles.alertDescription}>{alert.description}</Text>
      </View>
    ));
  };
  
  

  const nowTemp = Math.round(weatherData.current.temp);
  const nowWeather = weatherData.current.weather[0].description;
  const nowIcon = `https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}.png`;
  const sunriseTime = new Date(weatherData.current.sunrise * 1000).toLocaleTimeString();
  const sunsetTime = new Date(weatherData.current.sunset * 1000).toLocaleTimeString();
  const moonPhase = weatherData.daily[0].moon_phase;
  const forecastData = weatherData.daily.slice(1, 4).map(item => {
    const date = new Date(item.dt * 1000);
    const highTemp = Math.round(item.temp.max);
    const lowTemp = Math.round(item.temp.min);
    const weather = item.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    return {
      date: date.toLocaleDateString(),
      highTemp,
      lowTemp,
      weather,
      icon,
    };
  });

  const moonPhaseText = (phase) => {
    if (phase >= 0 && phase < 0.25) {
      return 'New Moon';
    } else if (phase >= 0.25 && phase < 0.5) {
      return 'First Quarter';
    } else if (phase >= 0.5 && phase < 0.75) {
      return 'Full Moon';
    } else {
      return 'Last Quarter';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 10,
    },
    currentWeather: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
      shadowColor: theme.colors.secondary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    nowIcon: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
    nowTemp: {
      fontSize: 20,
      flex: 1,
      flexWrap: 'wrap',
      color: theme.colors.onSurface
    },
    forecast: {
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      padding: 10,
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
    forecastTitle: {
      fontSize: 20,
      marginBottom: 10,
      color: theme.colors.onSurface
    },
    forecastItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      color: theme.colors.onSurface
    },
    forecastDate: {
      width: 100,
      fontSize: 16,
        color: theme.colors.onSurface
    },
    forecastInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      color: theme.colors.onSurface
    },
    forecastIcon: {
      width: 30,
      height: 30,
      marginRight: 10,
      color: theme.colors.onSurface
    },
    forecastTextContainer: {
      flex: 1,
      color: theme.colors.onSurface
    },
    forecastText: {
      fontSize: 16,
      color: theme.colors.onSurface
    },
    sunMoonInfo: {
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      padding: 10,
      marginTop: 20,
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
    sunMoonText: {
      fontSize: 16,
      marginBottom: 5,
      color: theme.colors.onSurface
    },
    alert: {
        backgroundColor: theme.colors.error,
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        color: theme.colors.onError,
        shadowColor: theme.colors.secondary,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      alertTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: theme.colors.onError
      },
      alertSender: {
        fontSize: 16,
        marginBottom: 5,
        color: theme.colors.onError
      },
      alertDescription: {
        fontSize: 14,
        color: theme.colors.onError
      },
      
  });

  return (
    <View style={styles.container}>
        {alerts.length > 0 && renderAlerts()}
      <View style={styles.currentWeather}>
        <Image style={styles.nowIcon} source={{ uri: nowIcon }} />
        <Text style={styles.nowTemp}>
          Current Weather: {nowWeather}, {nowTemp}°F
        </Text>
      </View>
      <View style={styles.forecast}>
        <Text style={styles.forecastTitle}>Next 3 days:</Text>
        {forecastData.map(item => (
        <View key={item.date} style={styles.forecastItem}>
            <Text style={styles.forecastDate}>{item.date}</Text>
            <View style={styles.forecastInfo}>
            <Image style={styles.forecastIcon} source={{ uri: item.icon }} />
            <View style={styles.forecastTextContainer}>
                <Text
                style={styles.forecastText}
                numberOfLines={2}
                ellipsizeMode="tail"
                >
                {item.weather}, High: {item.highTemp}°F, Low: {item.lowTemp}°F
                </Text>
            </View>
            </View>
        </View>
        ))}
      </View>
      <View style={styles.sunMoonInfo}>
        <Text style={styles.sunMoonText}>Sunrise: {sunriseTime}</Text>
        <Text style={styles.sunMoonText}>Sunset: {sunsetTime}</Text>
        <Text style={styles.sunMoonText}>Moon Phase: {moonPhaseText(moonPhase)}</Text>
      </View>
    </View>
  );
};

export default Weather;
