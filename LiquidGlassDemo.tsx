import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LiquidGlass from './LiquidGlass';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LiquidGlassDemo = ({ route }) => {
  const theme = route?.params?.theme || { colors: { primary: '#00BCD4', background: '#121212', onSurface: '#ffffff' }};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Liquid Glass Effects
        </Text>
        
        <View style={styles.demoContainer}>
          <LiquidGlass
            style={styles.card}
            blurIntensity={25}
            borderRadius={24}
            elasticity={0.4}
            displacementScale={20}
          >
            <View style={styles.cardContent}>
              <MaterialCommunityIcons 
                name="ferry" 
                size={48} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Ferry Schedule
              </Text>
              <Text style={[styles.cardText, { color: theme.colors.onSurface, opacity: 0.8 }]}>
                Drag me to see the liquid effect!
              </Text>
            </View>
          </LiquidGlass>

          <LiquidGlass
            style={styles.card}
            blurIntensity={30}
            borderRadius={20}
            elasticity={0.25}
            displacementScale={25}
            gradientColors={['rgba(0,188,212,0.2)', 'rgba(0,188,212,0.05)']}
          >
            <View style={styles.cardContent}>
              <MaterialCommunityIcons 
                name="wave" 
                size={48} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Tide Information
              </Text>
              <Text style={[styles.cardText, { color: theme.colors.onSurface, opacity: 0.8 }]}>
                Interactive glass morphing
              </Text>
            </View>
          </LiquidGlass>

          <LiquidGlass
            style={styles.wideCard}
            blurIntensity={20}
            borderRadius={16}
            elasticity={0.5}
            displacementScale={15}
          >
            <View style={styles.wideCardContent}>
              <View style={styles.iconRow}>
                <MaterialCommunityIcons 
                  name="weather-partly-cloudy" 
                  size={32} 
                  color={theme.colors.primary} 
                />
                <MaterialCommunityIcons 
                  name="thermometer" 
                  size={32} 
                  color={theme.colors.primary} 
                />
                <MaterialCommunityIcons 
                  name="water-percent" 
                  size={32} 
                  color={theme.colors.primary} 
                />
              </View>
              <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Weather Dashboard
              </Text>
              <Text style={[styles.cardText, { color: theme.colors.onSurface, opacity: 0.8 }]}>
                Smooth elastic animation
              </Text>
            </View>
          </LiquidGlass>

          <View style={styles.row}>
            <LiquidGlass
              style={styles.smallCard}
              blurIntensity={35}
              borderRadius={16}
              elasticity={0.3}
              displacementScale={30}
              glassColor='rgba(255, 255, 255, 0.15)'
            >
              <View style={styles.smallCardContent}>
                <MaterialCommunityIcons 
                  name="island" 
                  size={40} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.smallCardTitle, { color: theme.colors.onSurface }]}>
                  Island
                </Text>
              </View>
            </LiquidGlass>

            <LiquidGlass
              style={styles.smallCard}
              blurIntensity={35}
              borderRadius={16}
              elasticity={0.3}
              displacementScale={30}
              glassColor='rgba(255, 255, 255, 0.15)'
            >
              <View style={styles.smallCardContent}>
                <MaterialCommunityIcons 
                  name="compass" 
                  size={40} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.smallCardTitle, { color: theme.colors.onSurface }]}>
                  Navigate
                </Text>
              </View>
            </LiquidGlass>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  demoContainer: {
    paddingHorizontal: 20,
  },
  card: {
    width: width - 40,
    height: 180,
    marginBottom: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
  },
  wideCard: {
    width: width - 40,
    height: 140,
    marginBottom: 20,
  },
  wideCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallCard: {
    width: (width - 50) / 2,
    height: 120,
    marginBottom: 20,
  },
  smallCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  smallCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default LiquidGlassDemo;