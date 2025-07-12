import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme, spacing, borderRadius, shadows } from '../theme/theme';

const { width, height } = Dimensions.get('window');

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: string[];
  route: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface MarketData {
  crop: string;
  price: number;
  change: number;
  unit: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 28,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
  });

  const [marketData] = useState<MarketData[]>([
    { crop: 'Maize', price: 3200, change: 2.5, unit: 'KES/90kg' },
    { crop: 'Beans', price: 180, change: -1.2, unit: 'KES/kg' },
    { crop: 'Tomatoes', price: 120, change: 5.8, unit: 'KES/kg' },
  ]);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Disease Detection',
      subtitle: 'Scan crop photos',
      icon: 'camera-alt',
      color: '#4CAF50',
      gradient: ['#4CAF50', '#2E7D32'],
      route: 'Disease',
    },
    {
      id: '2',
      title: 'Voice Assistant',
      subtitle: 'Speak in Swahili',
      icon: 'mic',
      color: '#2196F3',
      gradient: ['#2196F3', '#1976D2'],
      route: 'VoiceAssistant',
    },
    {
      id: '3',
      title: 'Market Prices',
      subtitle: 'Live updates',
      icon: 'trending-up',
      color: '#FF9800',
      gradient: ['#FF9800', '#F57C00'],
      route: 'Market',
    },
    {
      id: '4',
      title: 'Weather Forecast',
      subtitle: 'Local conditions',
      icon: 'wb-sunny',
      color: '#9C27B0',
      gradient: ['#9C27B0', '#7B1FA2'],
      route: 'Weather',
    },
    {
      id: '5',
      title: 'Loan Assessment',
      subtitle: 'Get credit score',
      icon: 'account-balance',
      color: '#607D8B',
      gradient: ['#607D8B', '#455A64'],
      route: 'LoanAssessment',
    },
    {
      id: '6',
      title: 'Farming Tips',
      subtitle: 'Best practices',
      icon: 'eco',
      color: '#795548',
      gradient: ['#795548', '#5D4037'],
      route: 'Tips',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleQuickAction = (action: QuickAction) => {
    // @ts-ignore
    navigation.navigate(action.route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header Section */}
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Jambo! 👋</Text>
              <Text style={styles.userName}>Mkulima Mzuri</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <MaterialIcons name="account-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
          </View>
        </Animatable.View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Weather Card */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.weatherCard}>
          <LinearGradient
            colors={['#64B5F6', '#42A5F5']}
            style={styles.weatherGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.weatherContent}>
              <View style={styles.weatherLeft}>
                <Text style={styles.weatherTemp}>{weatherData.temperature}°C</Text>
                <Text style={styles.weatherCondition}>Sunny</Text>
                <Text style={styles.weatherLocation}>Nairobi, Kenya</Text>
              </View>
              <View style={styles.weatherRight}>
                <MaterialIcons name="wb-sunny" size={60} color="white" />
                <View style={styles.weatherDetails}>
                  <Text style={styles.weatherDetail}>Humidity: {weatherData.humidity}%</Text>
                  <Text style={styles.weatherDetail}>Wind: {weatherData.windSpeed} km/h</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Quick Actions Grid */}
        <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Animatable.View
                key={action.id}
                animation="zoomIn"
                delay={600 + index * 100}
                style={styles.actionContainer}
              >
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleQuickAction(action)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={action.gradient}
                    style={styles.actionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name={action.icon} size={32} color="white" />
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

        {/* Market Prices */}
        <Animatable.View animation="fadeInUp" delay={800} style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Market Prices</Text>
          <View style={styles.marketContainer}>
            {marketData.map((item, index) => (
              <Animatable.View
                key={item.crop}
                animation="slideInRight"
                delay={1000 + index * 200}
                style={styles.marketItem}
              >
                <View style={styles.marketItemLeft}>
                  <Text style={styles.cropName}>{item.crop}</Text>
                  <Text style={styles.cropUnit}>{item.unit}</Text>
                </View>
                <View style={styles.marketItemRight}>
                  <Text style={styles.cropPrice}>KES {item.price.toLocaleString()}</Text>
                  <View style={[
                    styles.changeContainer,
                    { backgroundColor: item.change >= 0 ? '#4CAF50' : '#F44336' }
                  ]}>
                    <MaterialIcons
                      name={item.change >= 0 ? 'trending-up' : 'trending-down'}
                      size={16}
                      color="white"
                    />
                    <Text style={styles.changeText}>
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </Text>
                  </View>
                </View>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

        {/* Tips Section */}
        <Animatable.View animation="fadeInUp" delay={1200} style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Farming Tip</Text>
          <View style={styles.tipCard}>
            <LinearGradient
              colors={['#C8E6C9', '#A5D6A7']}
              style={styles.tipGradient}
            >
              <MaterialCommunityIcons name="lightbulb-on" size={40} color="#2E7D32" />
              <Text style={styles.tipTitle}>Water Conservation</Text>
              <Text style={styles.tipText}>
                Use drip irrigation systems to reduce water wastage by up to 60%. 
                This method delivers water directly to plant roots, minimizing evaporation.
              </Text>
            </LinearGradient>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  profileButton: {
    padding: spacing.xs,
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  weatherCard: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  weatherGradient: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  weatherCondition: {
    fontSize: 20,
    color: 'white',
    marginTop: spacing.xs,
  },
  weatherLocation: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: spacing.xs,
  },
  weatherRight: {
    alignItems: 'center',
  },
  weatherDetails: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  weatherDetail: {
    fontSize: 14,
    color: 'white',
    marginTop: spacing.xs,
  },
  section: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionContainer: {
    width: (width - spacing.md * 3) / 2,
    marginBottom: spacing.md,
  },
  actionButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  actionGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  marketContainer: {
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  marketItemLeft: {
    flex: 1,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  cropUnit: {
    fontSize: 12,
    color: '#757575',
    marginTop: spacing.xs,
  },
  marketItemRight: {
    alignItems: 'flex-end',
  },
  cropPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  changeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  tipCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  tipGradient: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen; 