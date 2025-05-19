import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';

// Componente de Splash Screen customizada que será exibida após a splash nativa
export default function SplashScreenCustom() {
  useEffect(() => {
    // Esconde a splash screen nativa quando este componente montar
    SplashScreen.hideAsync().catch(() => {
      // Ignora erros silenciosamente
    });

    // Timer para navegar para a tela principal após 7 segundos
    const timer = setTimeout(() => {
      router.replace('/Screens/StockList');
    }, 7000);

    // Limpa o timer se o componente desmontar antes do tempo
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#070F1B', '#0D1723', '#182B3A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>
      <Image 
        source={require('../../assets/Logo-Splash.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070F1B',
    alignItems: 'center',
    justifyContent: 'center',
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
  logo: {
    width: '120%',
    height: '120%',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginTop: 20,
    position: 'absolute',
    bottom: 50,
  }
}); 