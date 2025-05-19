import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Dimensions, 
  Platform
} from 'react-native';
import { AntDesign, Feather, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Product } from '../utils/storage';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window'); // largura da tela para ajustar componentes

interface ProductDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// Converte ISO string em data local
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Verifica se falta menos de 30 dias para vencer
const isNearExpiration = (dateString: string) => {
  const expirationDate = new Date(dateString);
  const today = new Date();
  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30 && diffDays > 0;
};

// Verifica se já venceu
const isExpired = (dateString: string) => {
  const expirationDate = new Date(dateString);
  const today = new Date();
  return expirationDate < today;
};

function ProductDetailsModal({ 
  isVisible, 
  onClose, 
  product, 
  onEdit, 
  onDelete 
}: ProductDetailsModalProps) {
  if (!product) return null; // não mostra nada sem produto

  const expired = isExpired(product.expirationDate);
  const nearExpiry = isNearExpiration(product.expirationDate);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose} // back button no Android
    >
      <View style={styles.modalContainer}>
        {/* Fundo borrado pra destacar modal */}
        <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
          <View style={styles.modalContent}>
            {/* Cabeçalho com imagem ou ícone */}
            <View style={styles.imageHeader}>
              {product.imageUri ? (
                <Image 
                  source={{ uri: product.imageUri }} 
                  style={styles.headerImage} 
                  resizeMode="cover"
                />
              ) : (
                <LinearGradient
                  colors={['#182B3A', '#20293A']}
                  style={styles.headerImage}
                >
                  <Feather name="package" size={60} color="rgba(255,255,255,0.3)" />
                </LinearGradient>
              )}
              {/* Gradiente pra texto do header */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.headerGradient}
              />
              {/* Botão de fechar */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            {/* Conteúdo rolável dos detalhes */}
            <ScrollView style={styles.detailsContainer}>
              {/* Nome e status de validade */}
              <View style={styles.titleSection}>
                <Text style={styles.productName}>{product.name}</Text>
                {expired && (
                  <View style={styles.statusTag}>
                    <MaterialIcons name="error-outline" size={16} color="white" />
                    <Text style={styles.statusText}>Vencido</Text>
                  </View>
                )}
                {nearExpiry && !expired && (
                  <View style={[styles.statusTag, styles.warningTag]}>
                    <Ionicons name="time-outline" size={16} color="white" />
                    <Text style={styles.statusText}>A vencer</Text>
                  </View>
                )}
              </View>
              
              {/* Descrição, se existir */}
              {product.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>{product.description}</Text>
                </View>
              )}
              
              {/* Informações principais: validade, quantidade, lote, estado */}
              <View style={styles.mainInfoContainer}>
                <Text style={styles.sectionTitle}>Informações Principais</Text>
                <View style={styles.infoGrid}>
                  {/* Data de Validade */}
                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <LinearGradient
                        colors={['rgba(46, 204, 113, 0.2)', 'rgba(46, 204, 113, 0.1)']}
                        style={styles.iconBackground}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="calendar-outline" size={20} color="rgba(46, 204, 113, 1)" />
                      </LinearGradient>
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Data de Validade</Text>
                      <Text style={[
                        styles.infoValue,
                        expired && styles.expiredText,
                        nearExpiry && !expired && styles.warningText
                      ]}>
                        {formatDate(product.expirationDate)}
                      </Text>
                    </View>
                  </View>
                  {/* Quantidade */}
                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <LinearGradient
                        colors={['rgba(52, 152, 219, 0.2)', 'rgba(52, 152, 219, 0.1)']}
                        style={styles.iconBackground}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="cube-outline" size={20} color="rgba(52, 152, 219, 1)" />
                      </LinearGradient>
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Quantidade</Text>
                      <Text style={styles.infoValue}>{product.quantity}</Text>
                    </View>
                  </View>
                  {/* Lote */}
                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <LinearGradient
                        colors={['rgba(241, 196, 15, 0.2)', 'rgba(241, 196, 15, 0.1)']}
                        style={styles.iconBackground}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Feather name="hash" size={20} color="rgba(241, 196, 15, 1)" />
                      </LinearGradient>
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Lote</Text>
                      <Text style={styles.infoValue}>{product.batch}</Text>
                    </View>
                  </View>
                  {/* Estado */}
                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <LinearGradient
                        colors={['rgba(155, 89, 182, 0.2)', 'rgba(155, 89, 182, 0.1)']}
                        style={styles.iconBackground}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="location-outline" size={20} color="rgba(155, 89, 182, 1)" />
                      </LinearGradient>
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Estado</Text>
                      <Text style={styles.infoValue}>{product.state}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Dados adicionais: fabricação, código de barras, ID */}
              <View style={styles.additionalInfo}>
                <Text style={styles.sectionTitle}>Informações Adicionais</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoCardRow}>
                    <Text style={styles.infoCardLabel}>Data de Fabricação:</Text>
                    <Text style={styles.infoCardValue}>{formatDate(product.manufacturingDate)}</Text>
                  </View>
                  <View style={styles.infoCardRow}>
                    <Text style={styles.infoCardLabel}>Código de Barras:</Text>
                    <Text style={styles.infoCardValue}>{product.barcode}</Text>
                  </View>
                  <View style={styles.infoCardRow}>
                    <Text style={styles.infoCardLabel}>ID:</Text>
                    <Text style={styles.infoCardValue}>{product.id}</Text>
                  </View>
                </View>
              </View>
              
              {/* Botões de ação: editar e excluir */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => onEdit(product)}
                >
                  <LinearGradient
                    colors={['rgba(46, 204, 113, 0.8)', 'rgba(52, 152, 219, 0.8)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionGradient}
                  >
                    <AntDesign name="edit" size={20} color="white" style={styles.actionIcon} />
                    <Text style={styles.actionText}>Editar</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => onDelete(product)}
                >
                  <LinearGradient
                    colors={['rgba(231, 76, 60, 0.8)', 'rgba(192, 57, 43, 0.8)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionGradient}
                  >
                    <AntDesign name="delete" size={20} color="white" style={styles.actionIcon} />
                    <Text style={styles.actionText}>Excluir</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

export default ProductDetailsModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: '85%',
    backgroundColor: '#121A24',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  imageHeader: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  titleSection: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  warningTag: {
    backgroundColor: 'rgba(241, 196, 15, 0.8)',
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  mainInfoContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginBottom: 20,
  },
  infoIconContainer: {
    marginRight: 22,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  expiredText: {
    color: 'rgba(231, 76, 60, 1)',
  },
  warningText: {
    color: 'rgba(241, 196, 15, 1)',
  },
  additionalInfo: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
  },
  infoCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  infoCardLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    width: '40%',
  },
  infoCardValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    width: '58%',
    textAlign: 'right',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    width: '47%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});