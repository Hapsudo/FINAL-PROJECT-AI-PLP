import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import DiseaseDetectionScreen from './src/screens/DiseaseDetectionScreen';
import MarketScreen from './src/screens/MarketScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VoiceAssistantScreen from './src/screens/VoiceAssistantScreen';
import LoanAssessmentScreen from './src/screens/LoanAssessmentScreen';

// Import components
import CustomTabBar from './src/components/CustomTabBar';
import LoadingScreen from './src/components/LoadingScreen';

// Import theme and store
import { theme } from './src/theme/theme';
import { useAuthStore } from './src/store/authStore';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const queryClient = new QueryClient();

// Main Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Animatable.View
              animation={focused ? 'pulse' : undefined}
              duration={500}
            >
              {/* Icon component will be in CustomTabBar */}
            </Animatable.View>
          ),
        }}
      />
      <Tab.Screen 
        name="Disease" 
        component={DiseaseDetectionScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Animatable.View
              animation={focused ? 'pulse' : undefined}
              duration={500}
            >
              {/* Icon component will be in CustomTabBar */}
            </Animatable.View>
          ),
        }}
      />
      <Tab.Screen 
        name="Market" 
        component={MarketScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Animatable.View
              animation={focused ? 'pulse' : undefined}
              duration={500}
            >
              {/* Icon component will be in CustomTabBar */}
            </Animatable.View>
          ),
        }}
      />
      <Tab.Screen 
        name="Weather" 
        component={WeatherScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Animatable.View
              animation={focused ? 'pulse' : undefined}
              duration={500}
            >
              {/* Icon component will be in CustomTabBar */}
            </Animatable.View>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Animatable.View
              animation={focused ? 'pulse' : undefined}
              duration={500}
            >
              {/* Icon component will be in CustomTabBar */}
            </Animatable.View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
function StackNavigator() {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="VoiceAssistant" component={VoiceAssistantScreen} />
      <Stack.Screen name="LoanAssessment" component={LoanAssessmentScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <LinearGradient
              colors={['#4CAF50', '#2E7D32', '#1B5E20']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <NavigationContainer>
                <StackNavigator />
              </NavigationContainer>
              <StatusBar style="light" />
            </LinearGradient>
          </SafeAreaProvider>
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
} 