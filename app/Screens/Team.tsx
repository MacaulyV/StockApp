import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, StatusBar, TouchableOpacity, Platform, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

interface TeamMember {
  name: string;
  rm: string;
  avatar: any;
  github?: string;
  linkedin?: string;
}

function TeamScreen() {
  // Dados da equipe, cada um com nome, RM, foto e links
  const teamMembers: TeamMember[] = [
    {
      name: "Daniel Bezerra da Silva Melo",
      rm: "RM 553792",
      avatar: require('../../assets/daniel.png'),
      github: "https://github.com/Daniel151296",
      linkedin: "https://www.linkedin.com/in/daniel357/"
    },
    {
      name: "José Alexandre Farias",
      rm: "RM 553973",
      avatar: require('../../assets/jose.png'),
      github: "https://github.com/ycastiel",
      linkedin: "https://www.linkedin.com/in/alexandre-de-farias-61a90a308/"
    },
    {
      name: "Macauly Vivaldo da Silva",
      rm: "RM 553350",
      avatar: require('../../assets/macauly.png'),
      github: "https://github.com/MacaulyV",
      linkedin: "https://www.linkedin.com/in/macauly-vivaldo-da-silva-1a1514277/"
    }
  ];

  // Abre um link externo (GitHub ou LinkedIn)
  const openURL = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Não foi possível abrir o URL: " + url);
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070F1B" />

      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#070F1B', '#0D1723', '#182B3A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>

      {/* Cabeçalho com título e subtítulo */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Nossa Equipe</Text>
        <Text style={styles.subtitle}>Os responsáveis por trás do StockApp</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Renderiza um card para cada membro */}
        {teamMembers.map((member, index) => (
          <View key={index} style={styles.memberCardContainer}>
            <View style={styles.memberCard}>
              {/* Avatar do membro */}
              <View style={styles.avatarContainer}>
                <Image source={member.avatar} style={styles.avatar} />
              </View>

              <Text style={styles.memberName}>{member.name}</Text>
              
              {/* Exibe o RM dentro de um gradiente */}
              <LinearGradient
                colors={['rgba(46, 204, 113, 0.6)', 'rgba(52, 152, 219, 0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.rmContainer}
              >
                <View style={styles.rmInnerContainer}>
                  <Text style={styles.rmLabel}>FIAP ID</Text>
                  <Text style={styles.memberRM}>{member.rm}</Text>
                </View>
              </LinearGradient>
              
              {/* Ícones clicáveis para GitHub e LinkedIn */}
              <View style={styles.socialIcons}>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => openURL(member.github || '')}
                >
                  <AntDesign name="github" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => openURL(member.linkedin || '')}
                >
                  <AntDesign name="linkedin-square" size={24} color="#0077B5" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Rodapé com créditos */}
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>StockApp © 2025</Text>
          <Text style={styles.footerSubText}>FIAP - Análise e Desenvolvimento de Sistemas</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default TeamScreen;

const { width } = Dimensions.get('window');

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
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  memberCardContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  memberCard: {
    width: width - 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 40,
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  rmContainer: {
    borderRadius: 18,
    paddingHorizontal: 3,
    paddingVertical: 3,
    marginBottom: 20,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  rmInnerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  rmLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: 2,
  },
  memberRM: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  footerContent: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 5,
  },
  footerSubText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
}); 