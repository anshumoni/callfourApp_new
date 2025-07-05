import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchItems } from '../services/callfourservice';

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  // 🔄 Reset facing when screen focused
  useFocusEffect(() => {
    setFacing('back');
  });

  // 🔐 Unlock QR scanning when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        qrLock.current = false;
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  // 🚫 No permission yet
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  // ✅ Handle QR Code scan
  const handleQRCode = async (data: any) => {
    if (!data?.data || qrLock.current) return;

    qrLock.current = true;

    const qrSegments = data.data.split('/');
    const code = qrSegments[qrSegments.length - 1];


    try {
      const response = await searchItems(code);
      

      if (response) {
        Alert.alert('QR Code Scanned Successfully');
        navigateToProfile(response);
      } else {
        Alert.alert('Invalid QR Code. Please try again.');
        //navigateToProfile(null);
      }
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Error scanning QR code. Please try again.');
      navigateToProfile(null);
    } finally {
      // Unlock after short delay to allow next scan
      setTimeout(() => {
        qrLock.current = false;
      }, 1000);
    }
  };

  const navigateToProfile = (response: any) => {
    router.push({
      pathname: '/profile',
      params: { response },
    });
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {Platform.OS === 'android' && <StatusBar hidden />}
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleQRCode}
        >
          {/* 🔳 Scanner Overlay */}
          <View style={styles.overlay}>
            <View style={styles.scannerFrame} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Scan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderColor: '#00FF00',
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
});
