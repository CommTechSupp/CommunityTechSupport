import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from './screens/DashboardScreen';
import TutorialsScreen from './screens/TutorialsScreen';
import HiringScreen from './screens/HiringScreen';
import LocationScreen from './screens/LocationScreen';

import { COLORS } from './constants/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Tab bar icon config
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Dashboard: focused ? 'home' : 'home-outline',
              Tutorials: focused ? 'hammer' : 'hammer-outline',
              Hiring: focused ? 'people' : 'people-outline',
              Location: focused ? 'map' : 'map-outline',
            };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.muted,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            paddingBottom: 6,
            paddingTop: 6,
            height: 62,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: COLORS.surface,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="Tutorials" component={TutorialsScreen} options={{ title: 'DIY Tutorials' }} />
        <Tab.Screen name="Hiring" component={HiringScreen} options={{ title: 'Find Help' }} />
        <Tab.Screen name="Location" component={LocationScreen} options={{ title: 'Nearby' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
import React from 'react';
import { ThemeProvider } from './src/theme/ThemeContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}
