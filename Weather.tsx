import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleGlass from './SimpleGlass';
import BannerGlass from './BannerGlass';
// import { API_KEY } from '@env';

const API_KEY = '941a855f2988bdb2cef42cfa9e3669d3'

const LATITUDE = '47.2644';
const LONGITUDE = '-122.8343';
const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=imperial&appid=${API_KEY}`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=imperial&appid=${API_KEY}`;
const AURORA_URL = 'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json';
const BUOY_URL = 'https://www.ndbc.noaa.gov/data/realtime2/46121.txt';

// Calculate bioluminescence probability based on environmental factors
const getBioluminescenceScore = (temp: number, moonPhase: number, cloudCover: number, month: number) => {
  // Temperature score (optimal 55-65°F for Noctiluca scintillans in Puget Sound)
  let tempScore = 0;
  if (temp >= 55 && temp <= 65) {
    tempScore = 1.0;
  } else if (temp >= 50 && temp < 55) {
    tempScore = 0.7;
  } else if (temp > 65 && temp <= 70) {
    tempScore = 0.7;
  } else if (temp >= 45 && temp < 50) {
    tempScore = 0.4;
  } else if (temp > 70 && temp <= 75) {
    tempScore = 0.4;
  } else {
    tempScore = 0.1;
  }
  
  // Darkness score (new moon = 1.0, full moon = 0.3)
  const darknessScore = moonPhase < 0.25 || moonPhase > 0.75 ? 1.0 : 
                        moonPhase < 0.35 || moonPhase > 0.65 ? 0.8 :
                        moonPhase < 0.45 || moonPhase > 0.55 ? 0.5 : 0.3;
  
  // Cloud cover helps darkness
  const cloudScore = cloudCover > 80 ? 1.0 : cloudCover > 60 ? 0.8 : cloudCover > 40 ? 0.6 : 0.4;
  
  // Seasonal score (based on Herron Island observations)
  const seasonScore = month === 7 || month === 8 ? 1.0 :      // Excellent (Jul-Aug)
                     month === 9 ? 0.8 :                      // Good (Sep) 
                     month === 6 ? 0.7 :                      // Good (Jun)
                     month === 5 || month === 10 ? 0.3 :      // Occasional (May, Oct)
                     month === 4 ? 0.2 :                      // Uncommon (Apr)
                     month === 3 || month === 11 ? 0.15 :     // Rare (Mar, Nov)
                     0.05;                                     // Very rare (Dec-Feb)
  
  // Weighted average
  const totalScore = (tempScore * 0.35 + darknessScore * 0.25 + cloudScore * 0.15 + seasonScore * 0.25) * 100;
  
  return {
    score: Math.round(totalScore),
    tempScore,
    darknessScore,
    seasonScore,
    factors: {
      temperature: temp,
      optimal: temp >= 55 && temp <= 65,
      darkness: darknessScore > 0.7,
      season: seasonScore > 0.6
    }
  };
};

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
  
  return { phase: moonPhase, description: getMoonPhaseDescription(moonPhase) };
};

const getMoonPhaseDescription = (moonPhase: number) => {
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
  const [auroraChance, setAuroraChance] = useState(null);
  const [buoyData, setBuoyData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchWeatherData = async () => {
        try {
          const [currentResponse, forecastResponse, auroraResponse, buoyResponse] = await Promise.all([
            fetch(API_URL),
            fetch(FORECAST_URL),
            fetch(AURORA_URL),
            fetch(BUOY_URL)
          ]);

          const currentData = await currentResponse.json();
          const forecast = await forecastResponse.json();
          const auroraData = await auroraResponse.json();
          const buoyText = await buoyResponse.text();
          
          // Find aurora probability for Herron Island location
          if (auroraData && auroraData.coordinates) {
            // Convert our longitude to 0-360 range (NOAA uses 0-360)
            const normLon = parseFloat(LONGITUDE) < 0 ? 360 + parseFloat(LONGITUDE) : parseFloat(LONGITUDE);
            const lat = parseFloat(LATITUDE);
            
            // Find the closest grid point
            let closestProb = 0;
            let minDistance = Infinity;
            
            for (const coord of auroraData.coordinates) {
              const [gridLon, gridLat, prob] = coord;
              const distance = Math.sqrt(
                Math.pow(gridLon - normLon, 2) + Math.pow(gridLat - lat, 2)
              );
              if (distance < minDistance) {
                minDistance = distance;
                closestProb = prob;
              }
            }
            
            setAuroraChance(closestProb);
          }
          
          // Parse buoy data (NDBC format)
          const buoyLines = buoyText.split('\n');
          if (buoyLines.length > 2) {
            // Skip header lines, get most recent data
            const dataLine = buoyLines[2].split(/\s+/);
            console.log('Buoy data line:', dataLine);
            if (dataLine.length >= 9) {
              const parsedBuoyData = {
                waveHeight: parseFloat(dataLine[8]) || null, // WVHT (m)
                wavePeriod: parseFloat(dataLine[9]) || null, // DPD (sec)
                windSpeed: parseFloat(dataLine[6]) || null, // WSPD (m/s)
                windDirection: parseFloat(dataLine[5]) || null, // WDIR (deg)
                // Note: Water temp not reliably available from this buoy
                timestamp: `${dataLine[0]}-${dataLine[1]}-${dataLine[2]} ${dataLine[3]}:${dataLine[4]}`
              };
              console.log('Parsed buoy data:', parsedBuoyData);
              setBuoyData(parsedBuoyData);
            }
          }

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
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
  const feelsLike = weatherData?.main?.feels_like ? Math.round(weatherData.main.feels_like) : 'N/A';
  const humidity = weatherData?.main?.humidity ?? 'N/A';
  const windSpeed = weatherData?.wind?.speed ? Math.round(weatherData.wind.speed) : 'N/A';
  const windGust = weatherData?.wind?.gust ? Math.round(weatherData.wind.gust) : null;
  const windDeg = weatherData?.wind?.deg;
  const pressure = weatherData?.main?.pressure ?? 'N/A';
  const visibility = weatherData?.visibility ? Math.round(weatherData.visibility / 1609.34) : 'N/A'; // Convert meters to miles
  const cloudCover = weatherData?.clouds?.all ?? 'N/A';
  
  // Convert wind degrees to compass direction
  const getWindDirection = (degrees) => {
    if (degrees === undefined || degrees === null) return '';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };
  
  const windDirection = getWindDirection(windDeg);
  
  // Get sea conditions from NOAA buoy data (Station 46121 - Carr Inlet)
  const getSeaConditions = (buoyData, fallbackWindSpeed, fallbackWindGust) => {
    if (buoyData && buoyData.waveHeight !== null) {
      const waveHeightFt = buoyData.waveHeight * 3.28084; // Convert meters to feet
      if (waveHeightFt <= 1) return { text: 'Calm', color: '#4CAF50', source: 'buoy', wave: waveHeightFt };
      if (waveHeightFt <= 2) return { text: 'Light Chop', color: '#4CAF50', source: 'buoy', wave: waveHeightFt };
      if (waveHeightFt <= 3) return { text: 'Moderate', color: '#FFC107', source: 'buoy', wave: waveHeightFt };
      if (waveHeightFt <= 4) return { text: 'Choppy', color: '#FF9800', source: 'buoy', wave: waveHeightFt };
      if (waveHeightFt <= 6) return { text: 'Rough', color: '#FF5722', source: 'buoy', wave: waveHeightFt };
      return { text: 'Very Rough', color: '#F44336', source: 'buoy', wave: waveHeightFt };
    }
    
    // Fallback to wind estimation if buoy data unavailable
    const maxWind = fallbackWindGust || fallbackWindSpeed;
    if (maxWind <= 5) return { text: 'Calm', color: '#4CAF50', source: 'wind' };
    if (maxWind <= 10) return { text: 'Light Chop', color: '#4CAF50', source: 'wind' };
    if (maxWind <= 15) return { text: 'Moderate', color: '#FFC107', source: 'wind' };
    if (maxWind <= 20) return { text: 'Choppy', color: '#FF9800', source: 'wind' };
    if (maxWind <= 25) return { text: 'Rough', color: '#FF5722', source: 'wind' };
    return { text: 'Very Rough', color: '#F44336', source: 'wind' };
  };
  
  const seaConditions = getSeaConditions(buoyData, windSpeed, windGust);
  const nowWeather = weatherData?.weather?.[0]?.description ?? 'Unknown';
  const nowIcon = weatherData?.weather?.[0]?.icon 
    ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`
    : null;
  const sunriseTime = weatherData?.sys?.sunrise 
    ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : 'N/A';
  const sunsetTime = weatherData?.sys?.sunset
    ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : 'N/A';

  const moonPhaseData = getMoonPhase(new Date());
  const moonPhaseInfo = moonPhaseData.description;
  
  // Calculate bioluminescence probability
  // Use actual water temperature from buoy if available, otherwise estimate from air temp (water typically 5° cooler)
  const estimatedWaterTemp = typeof nowTemp === 'number' ? nowTemp - 5 : 60;
  const waterTemp = buoyData?.waterTemp ? (buoyData.waterTemp * 9/5 + 32) : estimatedWaterTemp;
  const currentMonth = new Date().getMonth() + 1;
  const bioScore = getBioluminescenceScore(waterTemp, moonPhaseData.phase, typeof cloudCover === 'number' ? cloudCover : 50, currentMonth);

  const styles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
      textAlign: 'center',
      marginBottom: 8,
    },
    weatherCard: {
      marginBottom: 16,
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
      marginBottom: 16,
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
      marginBottom: 16,
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
              <BannerGlass
                key={index}
                style={{ marginBottom: 8 }}
                borderRadius={12}
                glassColor={'rgba(244, 67, 54, 0.12)'}
                gradientColors={['rgba(244, 67, 54, 0.25)', 'rgba(244, 67, 54, 0.08)']}
              >
                <View style={[styles(theme).alertCard, { backgroundColor: 'transparent', borderWidth: 0, elevation: 0, shadowOpacity: 0 }]}>
                  <MaterialCommunityIcons name="alert" size={24} color={theme.colors.error} />
                  <View style={styles(theme).alertContent}>
                    <Text style={[styles(theme).alertTitle, { color: theme.colors.error }]}>{alert.event}</Text>
                    <Text style={[styles(theme).alertDescription, { color: theme.colors.onBackground }]}>{alert.description}</Text>
                  </View>
                </View>
              </BannerGlass>
            ))}
          </View>
        )}
                
        {/* PRIORITY 1: Sea Conditions for Ferry */}
        <SimpleGlass
          style={{ marginBottom: 16 }}
          borderRadius={12}
          theme={theme}
        >
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
              <MaterialCommunityIcons name="waves" size={28} color={seaConditions.color} />
              <Text style={{ 
                marginLeft: 10,
                fontSize: 22, 
                fontWeight: 'bold',
                color: seaConditions.color
              }}>
                Sea Conditions: {seaConditions.text}
              </Text>
            </View>
            
            {seaConditions.source === 'buoy' && seaConditions.wave && (
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ 
                  color: theme.colors.onBackground, 
                  fontSize: 16,
                  fontWeight: '500'
                }}>
                  Wave Height: {seaConditions.wave.toFixed(1)} ft
                </Text>
                <Text style={{ 
                  color: theme.colors.onBackground, 
                  fontSize: 12,
                  opacity: 0.7,
                  fontStyle: 'italic'
                }}>
                  NOAA Buoy 46121 (Carr Inlet)
                </Text>
              </View>
            )}
            
            {buoyData && buoyData.wavePeriod && (
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ 
                  color: theme.colors.onBackground, 
                  fontSize: 14,
                  opacity: 0.8
                }}>
                  Wave Period: {buoyData.wavePeriod.toFixed(0)}s
                  {buoyData.waterTemp && ` • Water Temp: ${(buoyData.waterTemp * 9/5 + 32).toFixed(0)}°F`}
                </Text>
              </View>
            )}
            
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-around',
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: theme.colors.outline,
              opacity: 0.8
            }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, backgroundColor: '#4CAF50', borderRadius: 6, marginRight: 5 }} />
                  <Text style={{ color: theme.colors.onBackground, fontSize: 12 }}>Calm - Light</Text>
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, backgroundColor: '#FFC107', borderRadius: 6, marginRight: 5 }} />
                  <Text style={{ color: theme.colors.onBackground, fontSize: 12 }}>Moderate</Text>
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, backgroundColor: '#FF5722', borderRadius: 6, marginRight: 5 }} />
                  <Text style={{ color: theme.colors.onBackground, fontSize: 12 }}>Rough</Text>
                </View>
              </View>
            </View>
          </View>
        </SimpleGlass>

        {/* PRIORITY 2: Current Weather & Wind (for ferry/boating) */}
        <SimpleGlass
          style={styles(theme).weatherCard}
          borderRadius={16}
          theme={theme}
        >
          <View style={[styles(theme).currentWeather, { padding: 20 }]}>
            <Text style={styles(theme).temperature}>{nowTemp}°F</Text>
            <View style={styles(theme).weatherDetails}>
              {nowIcon && <Image source={{ uri: nowIcon }} style={styles(theme).weatherIcon} />}
              <Text style={styles(theme).description}>{nowWeather}</Text>
            </View>
          </View>
        </SimpleGlass>


        {/* PRIORITY 3: Wind & Visibility (critical for boating/ferry) */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          <SimpleGlass
            style={{ flex: 1 }}
            borderRadius={10}
            theme={theme}
          >
            <View style={{ padding: 15, alignItems: 'center' }}>
              <MaterialCommunityIcons 
                name={buoyData?.windSpeed ? "waves" : "weather-windy"} 
                size={24} 
                color={theme.colors.primary} 
              />
              <Text style={{ color: theme.colors.onBackground, marginTop: 4, fontSize: 12 }}>
                {buoyData?.windSpeed ? 'Marine Wind' : 'Wind'}
              </Text>
              <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 18 }}>
                {buoyData?.windSpeed ? 
                  `${(buoyData.windSpeed * 2.237).toFixed(0)} mph` :
                  `${windDirection} ${windSpeed} mph`
                }
              </Text>
              {buoyData?.windDirection && (
                <Text style={{ color: theme.colors.onBackground, fontSize: 11, opacity: 0.7 }}>
                  {getWindDirection(buoyData.windDirection)}
                </Text>
              )}
              {windGust && (
                <Text style={{ color: theme.colors.error, fontSize: 11 }}>
                  Gusts: {windGust} mph
                </Text>
              )}
            </View>
          </SimpleGlass>
          
          <SimpleGlass
            style={{ flex: 1 }}
            borderRadius={10}
            theme={theme}
          >
            <View style={{ padding: 15, alignItems: 'center' }}>
              <MaterialCommunityIcons name="eye" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onBackground, marginTop: 4, fontSize: 12 }}>Visibility</Text>
              <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 16 }}>{visibility} mi</Text>
            </View>
          </SimpleGlass>
          
          <SimpleGlass
            style={{ flex: 1 }}
            borderRadius={10}
            theme={theme}
          >
            <View style={{ padding: 15, alignItems: 'center' }}>
              <MaterialCommunityIcons name="thermometer" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onBackground, marginTop: 4, fontSize: 12 }}>Feels Like</Text>
              <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 18 }}>{feelsLike}°F</Text>
            </View>
          </SimpleGlass>
        </View>

        {/* PRIORITY 4: 3-Day Forecast (planning ferry trips) */}
        <SimpleGlass
          style={styles(theme).forecastCard}
          borderRadius={12}
          theme={theme}
        >
          <View style={{ padding: 20 }}>
            <Text style={styles(theme).forecastTitle}>3-Day Forecast</Text>
            <View style={styles(theme).forecastContainer}>
              {forecastData.map((day, index) => (
                <View key={index} style={[styles(theme).forecastDay, { flex: 1 }]}>
                  <Text style={styles(theme).forecastDate}>
                    {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
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
        </SimpleGlass>

        {/* PRIORITY 5: Sun times (outdoor activities) */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          <SimpleGlass
            style={{ flex: 1 }}
            borderRadius={10}
            theme={theme}
          >
            <View style={{ padding: 15, alignItems: 'center' }}>
              <MaterialCommunityIcons name="weather-sunset-up" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onBackground, marginTop: 4, fontSize: 12 }}>Sunrise</Text>
              <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 16 }}>{sunriseTime}</Text>
            </View>
          </SimpleGlass>
          
          <SimpleGlass
            style={{ flex: 1 }}
            borderRadius={10}
            theme={theme}
          >
            <View style={{ padding: 15, alignItems: 'center' }}>
              <MaterialCommunityIcons name="weather-sunset-down" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onBackground, marginTop: 4, fontSize: 12 }}>Sunset</Text>
              <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 16 }}>{sunsetTime}</Text>
            </View>
          </SimpleGlass>
        </View>

        {/* PRIORITY 6: Special island features */}
        <SimpleGlass
          style={{ marginBottom: 16 }}
          borderRadius={12}
          theme={theme}
        >
          <View style={{ padding: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons 
                name="shimmer" 
                size={24} 
                color={bioScore.score > 70 ? '#00E5FF' : bioScore.score > 50 ? '#40C4FF' : bioScore.score > 30 ? '#82B1FF' : theme.colors.primary} 
              />
              <Text style={{ 
                marginLeft: 8,
                fontSize: 16, 
                fontWeight: 'bold',
                color: theme.colors.onBackground 
              }}>
                Bioluminescence: {bioScore.score >= 90 ? 'Excellent' : bioScore.score >= 70 ? 'Good' : bioScore.score >= 60 ? 'Fair' : 'Poor'}
                {bioScore.score >= 90 ? ' ✨' : bioScore.score >= 70 ? ' ✨' : ''}
              </Text>
            </View>
          </View>
        </SimpleGlass>

        {/* PRIORITY 7: Secondary weather details */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          <SimpleGlass
            style={{ flex: 1 }}
            borderRadius={10}
            theme={theme}
          >
            <View style={{ padding: 15, alignItems: 'center' }}>
              <MaterialCommunityIcons name="water-percent" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onBackground, marginTop: 4, fontSize: 12 }}>Humidity</Text>
              <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 18 }}>{humidity}%</Text>
            </View>
          </SimpleGlass>
          
          <SimpleGlass
            style={{ flex: 1 }}
            borderRadius={10}
            theme={theme}
          >
            <View style={{ padding: 15, alignItems: 'center' }}>
              <MaterialCommunityIcons name="gauge" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onBackground, marginTop: 4, fontSize: 12 }}>Pressure</Text>
              <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 16 }}>{pressure} mb</Text>
            </View>
          </SimpleGlass>
          
          <SimpleGlass
            style={{ flex: 1 }}
            borderRadius={10}
            theme={theme}
          >
            <View style={{ padding: 15, alignItems: 'center' }}>
              <MaterialCommunityIcons name="weather-cloudy" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onBackground, marginTop: 4, fontSize: 12 }}>Cloud Cover</Text>
              <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 16 }}>{cloudCover}%</Text>
            </View>
          </SimpleGlass>
        </View>

        {/* PRIORITY 8: Nice-to-have celestial info */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          <SimpleGlass
            style={{ flex: 1 }}
            borderRadius={10}
            theme={theme}
          >
            <View style={{ padding: 15, alignItems: 'center' }}>
              <MaterialCommunityIcons name="moon-waxing-crescent" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onBackground, marginTop: 4, fontSize: 12 }}>Moon Phase</Text>
              <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>{moonPhaseInfo}</Text>
            </View>
          </SimpleGlass>
          
          {auroraChance !== null && (
            <SimpleGlass
              style={{ flex: 1 }}
              borderRadius={10}
              theme={theme}
            >
              <View style={{ padding: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons 
                  name="weather-night" 
                  size={24} 
                  color={auroraChance > 10 ? '#4CAF50' : auroraChance > 5 ? '#FFC107' : theme.colors.primary} 
                />
                <Text style={{ color: theme.colors.onBackground, marginTop: 4, fontSize: 12 }}>Aurora</Text>
                <Text style={{ 
                  color: auroraChance > 10 ? '#4CAF50' : auroraChance > 5 ? '#FFC107' : theme.colors.onBackground, 
                  fontWeight: 'bold', 
                  fontSize: 16 
                }}>
                  {auroraChance.toFixed(1)}%
                </Text>
                {auroraChance > 10 && <Text style={{ fontSize: 12 }}>🌟</Text>}
              </View>
            </SimpleGlass>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Weather;
