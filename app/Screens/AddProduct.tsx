import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Platform, Image, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addProduct, getProducts, updateProduct, Product } from '../utils/storage';
import BarcodeScanner from '../components/BarcodeScanner';
import StatesDropdown from '../components/StatesDropdown';
import { format, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

// Tela para adicionar ou editar produtos, com formulário completo, validações, opções de imagem e scanner de código de barras
function AddProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [manufacturingDate, setManufacturingDate] = useState(new Date());
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [quantity, setQuantity] = useState('');
  const [batch, setBatch] = useState('');
  const [barcode, setBarcode] = useState('');
  const [state, setState] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  
  const [showMfgDatePicker, setShowMfgDatePicker] = useState(false);
  const [showExpDatePicker, setShowExpDatePicker] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  // Estados para validação
  const [nameError, setNameError] = useState('');
  const [expirationDateError, setExpirationDateError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [batchError, setBatchError] = useState('');
  const [stateError, setStateError] = useState('');

  // Efeito para carregar produto em modo edição, resetar formulário em modo criação e solicitar permissão de câmera
  useEffect(() => {
    if (isEditing) {
      loadProduct();
    } else {
      resetForm();
    }
    
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, [id]);

  // Limpa todos os campos do formulário e reseta mensagens de erro
  const resetForm = () => {
    setName('');
    setManufacturingDate(new Date());
    setExpirationDate(new Date());
    setQuantity('');
    setBatch('');
    setBarcode('');
    setState('');
    setImageUri(null);
    setDescription('');
    
    // Também resetar os erros
    setNameError('');
    setExpirationDateError('');
    setQuantityError('');
    setBatchError('');
    setStateError('');
  };

  // Gera um ID numérico de 6 dígitos para novos produtos
  const generateSixDigitId = () => {
    // Gera um número aleatório entre 100000 e 999999 (6 dígitos)
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Valida o nome do produto (obrigatório, apenas letras e números)
  const validateName = (value: string) => {
    // Permite apenas letras e números - sem símbolos
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (!value.trim()) {
      setNameError('Nome do produto é obrigatório');
      return false;
    } else if (!regex.test(value)) {
      setNameError('Nome deve conter apenas letras e números');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  // Valida se a data de validade é posterior à data de hoje
  const validateExpirationDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!isAfter(date, today)) {
      setExpirationDateError('Data de validade deve ser posterior à data atual');
      return false;
    } else {
      setExpirationDateError('');
      return true;
    }
  };

  // Valida se a quantidade é um número positivo
  const validateQuantity = (value: string) => {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      setQuantityError('Quantidade deve ser um número positivo');
      return false;
    } else {
      setQuantityError('');
      return true;
    }
  };

  // Valida o lote (deve conter letras e números, sem espaços)
  const validateBatch = (value: string) => {
    // Deve conter pelo menos 1 letra E 1 número, sem espaços
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasNoSpaces = !/\s/.test(value);
    const onlyAlphaNumeric = /^[a-zA-Z0-9]+$/.test(value);

    if (!value.trim()) {
      setBatchError('Lote é obrigatório');
      return false;
    } else if (!hasLetter || !hasNumber || !hasNoSpaces || !onlyAlphaNumeric) {
      setBatchError('Lote deve conter pelo menos 1 letra e 1 número, sem espaços ou símbolos');
      return false;
    } else {
      setBatchError('');
      return true;
    }
  };

  // Valida seleção do estado de origem no dropdown
  const validateState = (value: string) => {
    if (!value) {
      setStateError('Estado de origem é obrigatório');
      return false;
    } else {
      setStateError('');
      return true;
    }
  };

  // Handler para alteração do nome, filtra caracteres inválidos e atualiza estado
  const handleNameChange = (value: string) => {
    // Substitui caracteres não permitidos
    const filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
    setName(filteredValue);
    validateName(filteredValue);
  };

  // Handler para alteração da quantidade, permite apenas dígitos
  const handleQuantityChange = (value: string) => {
    // Permite apenas números
    const filteredValue = value.replace(/[^0-9]/g, '');
    setQuantity(filteredValue);
    validateQuantity(filteredValue);
  };

  // Handler para alteração do lote, permite apenas caracteres alfanuméricos sem espaços
  const handleBatchChange = (value: string) => {
    // Permite apenas letras e números, sem espaços
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
    setBatch(filteredValue);
    validateBatch(filteredValue);
  };

  // Handler do DateTimePicker para alterar a data de validade e revalidar campo
  const handleExpirationDateChange = (event: any, selectedDate?: Date) => {
    setShowExpDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setExpirationDate(selectedDate);
      validateExpirationDate(selectedDate);
    }
  };

  // Handler para atualizar o estado selecionado no dropdown
  const handleStateChange = (value: string) => {
    setState(value);
    validateState(value);
  };

  // Carrega dados de um produto existente para edição, preenchendo formulário e validando campos
  const loadProduct = async () => {
    try {
      const products = await getProducts();
      const product = products.find(p => p.id === id);
      
      if (product) {
        setName(product.name);
        setManufacturingDate(new Date(product.manufacturingDate));
        const expDate = new Date(product.expirationDate);
        setExpirationDate(expDate);
        setQuantity(product.quantity.toString());
        setBatch(product.batch);
        setBarcode(product.barcode);
        setState(product.state);
        if (product.imageUri) {
          setImageUri(product.imageUri);
        }
        if (product.description) {
          setDescription(product.description);
        }
        
        // Validar os campos carregados
        validateName(product.name);
        validateExpirationDate(expDate);
        validateQuantity(product.quantity.toString());
        validateBatch(product.batch);
        validateState(product.state);
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do produto');
    }
  };

  // Valida campos e salva produto (novo ou edição), exibindo alertas e navegando para lista
  const handleSave = async () => {
    // Validação completa antes de salvar
    const isNameValid = validateName(name);
    const isExpirationValid = validateExpirationDate(expirationDate);
    const isQuantityValid = validateQuantity(quantity);
    const isBatchValid = validateBatch(batch);
    const isStateValid = validateState(state);
    
    if (!isNameValid || !isExpirationValid || !isQuantityValid || !isBatchValid || !isStateValid) {
      Alert.alert('Erro de validação', 'Por favor, corrija os campos destacados em vermelho');
      return;
    }

    if (!barcode.trim()) {
      Alert.alert('Erro', 'Código de barras é obrigatório');
      return;
    }

    try {
      // Verifica se estamos editando ou criando um novo produto
      const productId = isEditing ? id : generateSixDigitId();
      
      const product: Product = {
        id: productId,
        name,
        manufacturingDate: manufacturingDate.toISOString(),
        expirationDate: expirationDate.toISOString(),
        quantity: Number(quantity),
        batch,
        barcode,
        state,
        imageUri: imageUri || undefined,
        description: description.trim() || undefined
      };

      if (isEditing) {
        await updateProduct(product);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso');
      } else {
        await addProduct(product);
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso');
      }

      // Navegue explicitamente para a tela de listagem em vez de usar router.back()
      router.replace("/Screens/StockList");
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Alert.alert('Erro', 'Não foi possível salvar o produto');
    }
  };

  // Handler para alteração da data de fabricação e revalidação da data de validade
  const handleManufacturingDateChange = (event: any, selectedDate?: Date) => {
    setShowMfgDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setManufacturingDate(selectedDate);
      // Também revalidamos a data de expiração, pois ela depende da data de fabricação
      validateExpirationDate(expirationDate);
    }
  };

  // Formata Date em string dd/MM/yyyy usando date-fns
  const formatDate = (date: Date) => {
    try {
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '01/01/2023';
    }
  };

  // Abre a galeria para o usuário selecionar uma imagem do produto
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
    setShowImageOptions(false);
  };

  // Abre a câmera para o usuário capturar foto do produto
  const takePhoto = async () => {
    try {
      if (hasCameraPermission) {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

        if (!result.canceled) {
          setImageUri(result.assets[0].uri);
        }
      } else {
        Alert.alert('Permissão necessária', 'Permissão para acessar a câmera é necessária');
      }
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      Alert.alert('Erro', 'Não foi possível capturar a foto');
    }
    setShowImageOptions(false);
  };

  // Limita a descrição a 500 caracteres enquanto o usuário digita
  const handleDescriptionChange = (text: string) => {
    // Limitando a 500 caracteres
    if (text.length <= 500) {
      setDescription(text);
    }
  };

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
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Produto</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              value={name}
              onChangeText={handleNameChange}
              placeholder="Digite o nome do produto"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição (Opcional)</Text>
            <View style={styles.descriptionContainer}>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={handleDescriptionChange}
                placeholder="Digite uma descrição para o produto (opcional)"
                placeholderTextColor="rgba(255,255,255,0.5)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {description.length}/500
              </Text>
            </View>
          </View>

          <View style={styles.imageSection}>
            <Text style={styles.label}>Imagem do Produto</Text>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => setShowImageOptions(true)}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.productImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <AntDesign name="camerao" size={40} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.placeholderText}>Adicionar imagem</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Fabricação</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowMfgDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(manufacturingDate)}</Text>
              <AntDesign name="calendar" size={20} color="#fff" />
            </TouchableOpacity>
            {showMfgDatePicker && (
              <DateTimePicker
                value={manufacturingDate}
                mode="date"
                display="default"
                onChange={handleManufacturingDateChange}
                themeVariant="dark"
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Validade</Text>
            <TouchableOpacity 
              style={[styles.dateInput, expirationDateError ? styles.inputError : null]}
              onPress={() => setShowExpDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(expirationDate)}</Text>
              <AntDesign name="calendar" size={20} color="#fff" />
            </TouchableOpacity>
            {showExpDatePicker && (
              <DateTimePicker
                value={expirationDate}
                mode="date"
                display="default"
                onChange={handleExpirationDateChange}
                themeVariant="dark"
              />
            )}
            {expirationDateError ? <Text style={styles.errorText}>{expirationDateError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              style={[styles.input, quantityError ? styles.inputError : null]}
              value={quantity}
              onChangeText={handleQuantityChange}
              placeholder="Digite a quantidade"
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="numeric"
            />
            {quantityError ? <Text style={styles.errorText}>{quantityError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lote</Text>
            <TextInput
              style={[styles.input, batchError ? styles.inputError : null]}
              value={batch}
              onChangeText={handleBatchChange}
              placeholder="Digite o lote (letras e números)"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            {batchError ? <Text style={styles.errorText}>{batchError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Código de Barras</Text>
            <View style={styles.barcodeContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10 }]}
                value={barcode}
                onChangeText={setBarcode}
                placeholder="Digite ou escaneie o código"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setShowScanner(true)}
              >
                <AntDesign name="scan1" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <StatesDropdown 
            value={state} 
            onChange={handleStateChange} 
          />
          {stateError ? <Text style={[styles.errorText, { marginTop: -15, marginBottom: 15 }]}>{stateError}</Text> : null}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <LinearGradient
              colors={['rgba(46, 204, 113, 0.8)', 'rgba(52, 152, 219, 0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Atualizar' : 'Salvar'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={showImageOptions}
        animationType="fade"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha uma opção</Text>
            
            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <MaterialIcons name="photo-camera" size={26} color="#fff" />
              <Text style={styles.modalOptionText}>Tirar foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
              <FontAwesome name="photo" size={24} color="#fff" />
              <Text style={styles.modalOptionText}>Escolher da galeria</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomWidth: 0 }]} 
              onPress={() => setShowImageOptions(false)}
            >
              <AntDesign name="close" size={24} color="#e74c3c" />
              <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BarcodeScanner
        isVisible={showScanner}
        onClose={() => setShowScanner(false)}
        onCodeScanned={setBarcode}
      />
    </View>
  );
}

export default AddProductScreen;

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
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    fontSize: 16,
    color: 'white',
  },
  inputError: {
    borderColor: 'rgba(231, 76, 60, 0.7)',
  },
  errorText: {
    color: 'rgba(231, 76, 60, 0.9)',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  dateInput: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: 'white',
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: 'rgba(46, 204, 113, 0.7)',
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageSection: {
    marginBottom: 20,
  },
  imageContainer: {
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#182B3A',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalOptionText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 16,
  },
  descriptionContainer: {
    position: 'relative',
  },
  descriptionInput: {
    minHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    fontSize: 16,
    color: 'white',
    textAlignVertical: 'top',
  },
  characterCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
}); 