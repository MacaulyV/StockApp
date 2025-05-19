import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Modal, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, CameraView, CameraCapturedPicture, BarcodeScanningResult } from 'expo-camera';

interface BarcodeScannerProps {
  isVisible: boolean;
  onClose: () => void;
  onCodeScanned: (code: string) => void;
}

// Componente que exibe um modal pra escanear ou digitar código de barras
function BarcodeScanner({ isVisible, onClose, onCodeScanned }: BarcodeScannerProps) {
  const [manualCode, setManualCode] = useState('');           // código digitado pelo usuário
  const [mode, setMode] = useState<'manual' | 'camera'>('manual'); // escolhe modo manual ou câmera
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // permissão da câmera
  const [scanned, setScanned] = useState(false);             // evita múltiplas leituras

  useEffect(() => {
    // Pede permissão de câmera sempre que o modo for 'camera'
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    if (mode === 'camera') {
      getCameraPermissions();
    }
    // Ao fechar o modal, volta pro modo manual
    if (!isVisible) {
      setMode('manual');
    }
  }, [mode, isVisible]);

  // Lida com a leitura via câmera
  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanned) return;           // ignora leituras duplicadas
    setScanned(true);
    if (scanningResult.data) {
      onCodeScanned(scanningResult.data); // avisa o form com o código lido
      // volta pro manual, reseta estado e fecha modal após 500ms
      setTimeout(() => {
        setMode('manual');
        setScanned(false);
        onClose();
      }, 500);
    }
  };

  // Envia o código digitado manualmente
  const handleSubmitManualCode = () => {
    if (manualCode.trim()) {
      onCodeScanned(manualCode);
      setManualCode('');
      onClose();
    }
  };

  if (!isVisible) return null; // não renderiza nada se modal fechado

  // Renderiza a interface da câmera
  const renderCameraMode = () => {
    if (hasPermission === null) {
      return (
        <View style={styles.cameraContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.permissionText}>Solicitando permissão da câmera...</Text>
        </View>
      );
    }
    if (hasPermission === false) {
      return (
        <View style={styles.cameraContainer}>
          <MaterialIcons name="no-photography" size={60} color="rgba(255,100,100,0.8)" />
          <Text style={styles.permissionText}>Sem acesso à câmera</Text>
          <Text style={styles.permissionSubText}>
            É necessário permitir o acesso à câmera para usar o scanner.
          </Text>
          <TouchableOpacity 
            style={styles.returnButton}
            onPress={() => setMode('manual')} // volta para digitar
          >
            <Text style={styles.returnButtonText}>Digitar código manualmente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.scanner}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'ean13', 'ean8', 'code39', 'code128', 'itf14', 'upc_e'],
          }}
        />
        {/* Indicação visual de área de leitura */}
        <View style={styles.scanOverlay}>
          <View style={styles.scannerTargetBorder} />
        </View>
        <View style={styles.scanInstructions}>
          <Text style={styles.scannerText}>Posicione o código de barras dentro da área</Text>
        </View>
        {scanned && <ActivityIndicator size="large" color="white" style={styles.scanningIndicator} />}
        <TouchableOpacity 
          style={styles.modeSwitchButton}
          onPress={() => setMode('manual')} // alterna para input manual
        >
          <Text style={styles.modeSwitchButtonText}>Digitar código</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Renderiza o input manual
  const renderManualMode = () => (
    <View style={styles.manualContainer}>
      <View style={styles.iconContainer}>
        <AntDesign name="barcode" size={80} color="rgba(46, 204, 113, 0.8)" />
      </View>
      <Text style={styles.manualTitle}>Digite o código de barras do produto:</Text>
      <TextInput
        style={styles.input}
        value={manualCode}
        onChangeText={setManualCode}
        placeholder="Digite o código de barras"
        placeholderTextColor="rgba(0,0,0,0.5)"
        keyboardType="numeric"
        autoFocus
      />
      <TouchableOpacity 
        style={[styles.confirmButton, !manualCode.trim() && styles.disabledButton]}
        onPress={handleSubmitManualCode}
        disabled={!manualCode.trim()}
      >
        <LinearGradient
          colors={['rgba(46, 204, 113, 0.8)', 'rgba(52, 152, 219, 0.8)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.confirmGradient}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.scanWithCameraButton}
        onPress={() => setMode('camera')} // alterna para câmera
      >
        <LinearGradient
          colors={['rgba(52, 152, 219, 0.8)', 'rgba(46, 204, 113, 0.8)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.scanWithCameraGradient}
        >
          <View style={styles.scanWithCameraContent}>
            <MaterialIcons name="camera-alt" size={24} color="white" style={styles.cameraIcon} />
            <Text style={styles.buttonText}>Escanear com câmera</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose} // Android back button
    >
      <View style={styles.container}>
        {/* Fundo gradiente */}
        <View style={styles.backgroundContainer}>
          <LinearGradient
            colors={['#070F1B', '#0D1723', '#182B3A']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </View>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>CÓDIGO DE BARRAS</Text>
            <View style={styles.invisibleSpacer} />
          </View>
          {mode === 'manual' ? renderManualMode() : renderCameraMode()}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070F1B',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
    letterSpacing: 1,
  },
  closeButton: {
    padding: 8,
    width: 40,
  },
  invisibleSpacer: {
    width: 40,
  },
  manualContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  manualTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    marginBottom: 30,
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  confirmGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scanWithCameraButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },
  scanWithCameraGradient: {
    paddingVertical: 15,
  },
  scanWithCameraContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    marginRight: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTargetBorder: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'rgba(46, 204, 113, 0.8)',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scanInstructions: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scanningIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  modeSwitchButton: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  modeSwitchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  permissionSubText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    marginHorizontal: 30,
  },
  returnButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  returnButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default BarcodeScanner;