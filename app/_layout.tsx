import { Stack } from 'expo-router';

// Layout raiz que controla a navegação entre as telas do app
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // remove o cabeçalho padrão das telas pra ficar tudo mais limpo
      }}
    />
  );
}
