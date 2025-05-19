import { Tabs, router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Definindo tipos para evitar erros de tipagem
interface Route {
  key: string;
  name: string;
}

interface TabBarProps {
  state: {
    routes: Route[];
    index: number;
  };
  descriptors: any;
  navigation: any;
}

type IconName = 'appstore1' | 'team' | 'pluscircleo';

function MyTabBar({ state, descriptors, navigation }: TabBarProps) {
  // Verifica se a tela atual é a Splash para esconder a barra
  const currentRoute = state.routes[state.index];
  if (currentRoute.name === 'Splash') {
    return null; // Não renderiza nada para a tela Splash
  }

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: Route, index: number) => {
        // Ícones e títulos customizados
        let iconName: IconName | null = null;
        let label: string = '';
        
        if (route.name === 'StockList') {
          iconName = 'appstore1';
          label = 'Estoque';
        } else if (route.name === 'Team') {
          iconName = 'team';
          label = 'Equipe';
        } else if (route.name === 'AddProduct') {
          iconName = 'pluscircleo';
          label = 'Adicionar';
        } else {
          return null; // Não mostra splash ou outros
        }

        const isFocused = state.index === index;

        // Ação do botão adicionar
        const onPress = () => {
          if (route.name === 'AddProduct') {
            router.navigate({ pathname: "/Screens/AddProduct" });
          } else {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={[
              styles.tabItem,
              route.name === 'AddProduct' && styles.addButton,
            ]}
            activeOpacity={0.7}
          >
            {isFocused ? (
              <LinearGradient
                colors={['#2ecc71', '#27ae60']}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <AntDesign
                  name={iconName}
                  size={24}
                  color="#fff"
                  style={{ marginBottom: 2 }}
                />
              </LinearGradient>
            ) : (
              <AntDesign
                name={iconName}
                size={24}
                color="#bbb"
                style={{ marginBottom: 2 }}
              />
            )}
            <Text style={{
              color: isFocused ? '#fff' : '#bbb',
              fontWeight: isFocused ? 'bold' : 'normal',
              fontSize: 13,
            }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ScreensLayout() {
  return (
    <Tabs
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="Splash" />
      <Tabs.Screen name="StockList" />
      <Tabs.Screen name="Team" />
      <Tabs.Screen name="AddProduct" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#222',
    height: 65,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0,
    elevation: 8,
    paddingHorizontal: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  addButton: {
    // Estilos específicos para o botão adicionar, se necessário
  },
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  }
});

export default ScreensLayout;
