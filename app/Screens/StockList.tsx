import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Dimensions, Platform, StatusBar } from 'react-native';
import { AntDesign, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { getProducts, deleteProduct, Product } from '../utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import ProductDetailsModal from '../components/ProductDetailsModal';

const { width } = Dimensions.get('window'); // largura da tela pra ajustes de layout

// Formata string ISO em data brasileira
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Checa se faltam 1–30 dias para o produto vencer
const isNearExpiration = (dateString: string) => {
  const expirationDate = new Date(dateString);
  const today = new Date();
  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30 && diffDays > 0;
};

// Checa se o produto já venceu
const isExpired = (dateString: string) => {
  const expirationDate = new Date(dateString);
  const today = new Date();
  return expirationDate < today;
};

function StockListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'none' | 'expired' | 'nearExpiry'>('none');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Carrega produtos do AsyncStorage
  const loadProducts = async () => {
    setRefreshing(true);
    const data = await getProducts();
    setProducts(data);
    setRefreshing(false);
  };

  // Recarrega quando a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
      return () => {};
    }, [])
  );

  // Navega para edição passando o ID do produto
  const handleEdit = (product: Product) => {
    router.push({
      pathname: "/Screens/AddProduct",
      params: { id: product.id }
    });
  };

  // Abre o modal de detalhes
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailsModalVisible(true);
  };

  // Exclui produto com alerta de confirmação
  const handleDelete = (product: Product) => {
    Alert.alert(
      "Excluir Produto",
      `Tem certeza que deseja excluir "${product.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            await deleteProduct(product.id);
            loadProducts(); // atualiza lista
          }
        }
      ]
    );
  };

  // Mostra quando não há produtos cadastrados
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={100} color="rgba(255,255,255,0.2)" />
      <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
      <Text style={styles.emptySubText}>Adicione produtos usando o botão abaixo</Text>
      <TouchableOpacity 
        style={styles.emptyAddButton}
        onPress={() => router.push("/Screens/AddProduct")}
      >
        <LinearGradient
          colors={['rgba(46, 204, 113, 0.9)', 'rgba(52, 152, 219, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.emptyAddGradient}
        >
          <AntDesign name="plus" size={22} color="white" style={styles.addIcon} />
          <Text style={styles.emptyAddText}>Adicionar Produto</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // Aplica filtro de vencidos ou a vencer
  const filteredProducts = products.filter(product => {
    if (activeFilter === 'expired') return isExpired(product.expirationDate);
    if (activeFilter === 'nearExpiry') return isNearExpiration(product.expirationDate);
    return true;
  });

  // Renderiza cada item da lista
  const renderItem = ({ item }: { item: Product }) => {
    const expired = isExpired(item.expirationDate);
    const nearExpiry = isNearExpiration(item.expirationDate);
    
    return (
      <TouchableOpacity 
        style={[
          styles.itemContainer,
          expired && styles.expiredItem,
          nearExpiry && !expired && styles.nearExpiryItem
        ]}
        onPress={() => handleViewDetails(item)} // abre detalhes
        activeOpacity={0.8}
      >
        <View style={styles.itemHeader}>
          {item.imageUri ? (
            <Image 
              source={{ uri: item.imageUri }} 
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Feather name="package" size={35} color="rgba(255,255,255,0.5)" />
            </View>
          )}
          <View style={styles.productNameContainer}>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            {item.description && (
              <Text style={styles.itemDescription} numberOfLines={1}>
                {item.description}
              </Text>
            )}
          </View>
          <View style={styles.statusContainer}>
            {expired && (
              <View style={styles.statusBadge}>
                <MaterialIcons name="error-outline" size={14} color="white" />
                <Text style={styles.statusText}>Vencido</Text>
              </View>
            )}
            {nearExpiry && !expired && (
              <View style={[styles.statusBadge, styles.warningBadge]}>
                <Ionicons name="time-outline" size={14} color="white" />
                <Text style={styles.statusText}>A vencer</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.itemContent}>
          <View style={styles.infoGrid}>
            {/* Validade, quantidade, lote e UF */}
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color="rgba(52, 152, 219, 0.9)" />
              <Text style={styles.infoLabel}>Validade:</Text>
              <Text style={[
                styles.infoValue, 
                expired && styles.expiredText,
                nearExpiry && !expired && styles.warningText
              ]}>
                {formatDate(item.expirationDate)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="cube-outline" size={16} color="rgba(52, 152, 219, 0.9)" />
              <Text style={styles.infoLabel}>Qtd:</Text>
              <Text style={styles.infoValue}>{item.quantity}</Text>
            </View>
            <View style={styles.infoItem}>
              <Feather name="hash" size={16} color="rgba(52, 152, 219, 0.9)" />
              <Text style={styles.infoLabel}>Lote:</Text>
              <Text style={styles.infoValue}>{item.batch}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color="rgba(52, 152, 219, 0.9)" />
              <Text style={styles.infoLabel}>UF:</Text>
              <Text style={styles.infoValue}>{item.state}</Text>
            </View>
          </View>
          
          {/* Botões de editar e excluir */}
          <View style={styles.itemActions}>
            <TouchableOpacity 
              onPress={() => handleEdit(item)} 
              style={styles.actionButton}
            >
              <LinearGradient
                colors={['rgba(46, 204, 113, 0.8)', 'rgba(52, 152, 219, 0.8)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionGradient}
              >
                <AntDesign name="edit" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDelete(item)} 
              style={styles.actionButton}
            >
              <LinearGradient
                colors={['rgba(231, 76, 60, 0.9)', 'rgba(192, 57, 43, 0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionGradient}
              >
                <AntDesign name="delete" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070F1B" />
      
      {/* Fundo gradiente */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={['#070F1B', '#0D1723', '#182B3A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>
      
      {/* Cabeçalho com título, subtítulo e filtros */}
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Estoque</Text>
          <Text style={styles.subtitle}>{products.length} {products.length === 1 ? 'item' : 'itens'}</Text>
        </View>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'expired' && styles.filterButtonActive]} 
            onPress={() => setActiveFilter(activeFilter === 'expired' ? 'none' : 'expired')}
          >
            <MaterialIcons 
              name="error-outline" 
              size={18} 
              color={activeFilter === 'expired' ? "white" : "rgba(255,255,255,0.6)"} 
            />
            <Text style={[styles.filterText, activeFilter === 'expired' && styles.filterTextActive]}>
              Vencidos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'nearExpiry' && styles.filterButtonActive]} 
            onPress={() => setActiveFilter(activeFilter === 'nearExpiry' ? 'none' : 'nearExpiry')}
          >
            <Ionicons 
              name="time-outline" 
              size={18} 
              color={activeFilter === 'nearExpiry' ? "white" : "rgba(255,255,255,0.6)"} 
            />
            <Text style={[styles.filterText, activeFilter === 'nearExpiry' && styles.filterTextActive]}>
              A vencer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Lista de produtos ou componente vazio */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          styles.listContainer,
          filteredProducts.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
        ]}
        refreshing={refreshing}
        onRefresh={loadProducts}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Modal de detalhes do produto */}
      <ProductDetailsModal
        isVisible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        product={selectedProduct}
        onEdit={handleEdit}
        onDelete={(product) => {
          setDetailsModalVisible(false);
          setTimeout(() => handleDelete(product), 300);
        }}
      />
    </View>
  );
}

export default StockListScreen;

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
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
  },
  filterText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  listContainer: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyAddButton: {
    width: '70%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  emptyAddGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyAddText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addIcon: {
    marginRight: 8,
  },
  itemContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(46, 204, 113, 0.7)',
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderBottomColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  expiredItem: {
    borderLeftColor: 'rgba(231, 76, 60, 0.7)',
  },
  nearExpiryItem: {
    borderLeftColor: 'rgba(241, 196, 15, 0.7)',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  productImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
  },
  noImageContainer: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productNameContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  itemDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 3,
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  warningBadge: {
    backgroundColor: 'rgba(241, 196, 15, 0.9)',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  itemContent: {
    padding: 15,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 6,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  expiredText: {
    color: 'rgba(231, 76, 60, 0.9)',
  },
  warningText: {
    color: 'rgba(241, 196, 15, 0.9)',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    marginLeft: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 10,
    width: 40,
    alignItems: 'center',
  },
}); 