import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Impede que a splash screen nativa seja escondida automaticamente
// Isso permite que nossa tela de splash customizada seja exibida depois
SplashScreen.preventAutoHideAsync().catch(() => {
  /* rejeição silenciosa */
});

export default function Index() {
  // Redireciona imediatamente para a tela de splash customizada
  return <Redirect href="/Screens/Splash" />;
}
