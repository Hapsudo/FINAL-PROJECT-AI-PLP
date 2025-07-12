import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme, spacing, borderRadius, shadows } from '../theme/theme';

const { width, height } = Dimensions.get('window');

interface DiseaseResult {
  disease: string;
  confidence: number;
  description: string;
  treatment: string;
  prevention: string;
  severity: 'low' | 'medium' | 'high';
}

const DiseaseDetectionScreen: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [cropType, setCropType] = useState<string>('maize');

  const cropTypes = [
    { id: 'maize', name: 'Maize', icon: '🌽' },
    { id: 'beans', name: 'Beans', icon: '🫘' },
    { id: 'tomatoes', name: 'Tomatoes', icon: '🍅' },
    { id: 'potatoes', name: 'Potatoes', icon: '🥔' },
    { id: 'cassava', name: 'Cassava', icon: '🥔' },
    { id: 'coffee', name: 'Coffee', icon: '☕' },
  ];

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setResult(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setResult(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResult: DiseaseResult = {
        disease: 'Northern Leaf Blight',
        confidence: 94.5,
        description: 'A fungal disease that causes long, elliptical lesions on maize leaves. The lesions are grayish-green to tan in color and can cause significant yield loss.',
        treatment: 'Apply fungicides containing azoxystrobin or pyraclostrobin. Remove and destroy infected plant debris. Practice crop rotation.',
        prevention: 'Plant resistant varieties. Maintain proper spacing between plants. Avoid overhead irrigation. Monitor weather conditions.',
        severity: 'high',
      };
      
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#4CAF50';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'high': return 'High Risk';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animatable.View animation="fadeInDown" style={styles.headerContent}>
          <Text style={styles.headerTitle}>🌿 Disease Detection</Text>
          <Text style={styles.headerSubtitle}>AI-Powered Crop Health Analysis</Text>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Crop Selection */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.section}>
          <Text style={styles.sectionTitle}>Select Crop Type</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cropScroll}
          >
            {cropTypes.map((crop, index) => (
              <Animatable.View
                key={crop.id}
                animation="zoomIn"
                delay={300 + index * 100}
              >
                <TouchableOpacity
                  style={[
                    styles.cropButton,
                    cropType === crop.id && styles.cropButtonActive
                  ]}
                  onPress={() => setCropType(crop.id)}
                >
                  <Text style={styles.cropIcon}>{crop.icon}</Text>
                  <Text style={[
                    styles.cropName,
                    cropType === crop.id && styles.cropNameActive
                  ]}>
                    {crop.name}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </ScrollView>
        </Animatable.View>

        {/* Image Selection */}
        <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
          <Text style={styles.sectionTitle}>Upload or Take Photo</Text>
          
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => setSelectedImage(null)}
              >
                <MaterialIcons name="refresh" size={24} color="white" />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadContainer}>
              <LinearGradient
                colors={['#E8F5E8', '#C8E6C9']}
                style={styles.uploadArea}
              >
                <MaterialCommunityIcons name="camera-plus" size={80} color="#4CAF50" />
                <Text style={styles.uploadText}>Select or take a photo of your crop</Text>
                <Text style={styles.uploadSubtext}>Ensure good lighting and clear focus</Text>
              </LinearGradient>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.buttonGradient}
              >
                <MaterialIcons name="camera-alt" size={24} color="white" />
                <Text style={styles.buttonText}>Take Photo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
              <LinearGradient
                colors={['#FF9800', '#F57C00']}
                style={styles.buttonGradient}
              >
                <MaterialIcons name="photo-library" size={24} color="white" />
                <Text style={styles.buttonText}>Choose Photo</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Analysis Button */}
        {selectedImage && !result && (
          <Animatable.View animation="fadeInUp" delay={600} style={styles.section}>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={analyzeImage}
              disabled={isAnalyzing}
            >
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.analyzeGradient}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="white" size="large" />
                ) : (
                  <>
                    <MaterialIcons name="psychology" size={32} color="white" />
                    <Text style={styles.analyzeText}>Analyze with AI</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        )}

        {/* Results */}
        {result && (
          <Animatable.View animation="fadeInUp" delay={800} style={styles.section}>
            <Text style={styles.sectionTitle}>Analysis Results</Text>
            
            <View style={styles.resultCard}>
              <LinearGradient
                colors={['#FFF3E0', '#FFE0B2']}
                style={styles.resultGradient}
              >
                <View style={styles.resultHeader}>
                  <View style={styles.diseaseInfo}>
                    <Text style={styles.diseaseName}>{result.disease}</Text>
                    <Text style={styles.confidenceText}>
                      {result.confidence}% Confidence
                    </Text>
                  </View>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(result.severity) }
                  ]}>
                    <Text style={styles.severityText}>
                      {getSeverityText(result.severity)}
                    </Text>
                  </View>
                </View>

                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>Description</Text>
                  <Text style={styles.resultText}>{result.description}</Text>
                </View>

                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>Treatment</Text>
                  <Text style={styles.resultText}>{result.treatment}</Text>
                </View>

                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>Prevention</Text>
                  <Text style={styles.resultText}>{result.prevention}</Text>
                </View>
              </LinearGradient>
            </View>
          </Animatable.View>
        )}
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: spacing.md,
  },
  cropScroll: {
    paddingRight: spacing.md,
  },
  cropButton: {
    alignItems: 'center',
    padding: spacing.md,
    marginRight: spacing.md,
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    minWidth: 80,
    ...shadows.small,
  },
  cropButtonActive: {
    backgroundColor: '#4CAF50',
  },
  cropIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  cropName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  cropNameActive: {
    color: 'white',
  },
  uploadContainer: {
    marginBottom: spacing.md,
  },
  uploadArea: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.lg,
  },
  retakeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retakeText: {
    color: 'white',
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  analyzeButton: {
    marginTop: spacing.md,
  },
  analyzeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  analyzeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  resultCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  resultGradient: {
    padding: spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: spacing.xs,
  },
  confidenceText: {
    fontSize: 14,
    color: '#757575',
  },
  severityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  severityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  resultSection: {
    marginBottom: spacing.lg,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: spacing.sm,
  },
  resultText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
});

export default DiseaseDetectionScreen; 