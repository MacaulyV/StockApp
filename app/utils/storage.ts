import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface que define como um produto deve ser estruturado
export interface Product {
  id: string;
  name: string;
  manufacturingDate: string;
  expirationDate: string;
  quantity: number;
  batch: string;
  barcode: string;
  state: string;
  imageUri?: string; // URI da imagem do produto, se houver
  description?: string; // descrição opcional para o produto
}

const STORAGE_KEY = '@stock_products'; // chave usada para armazenar os produtos no AsyncStorage

// Salva o array de produtos no AsyncStorage, convertendo pra string JSON
export const saveProducts = async (products: Product[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    // Se der erro, loga no console pra ajudar no debug
    console.error('Erro ao salvar produtos:', error);
  }
};

// Recupera os produtos armazenados, se não achar nada retorna array vazio
export const getProducts = async (): Promise<Product[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    return [];
  }
};

// Adiciona um produto novo no array já salvo
export const addProduct = async (product: Product): Promise<void> => {
  try {
    const products = await getProducts();
    products.push(product);
    await saveProducts(products);
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
  }
};

// Atualiza um produto existente buscando pelo id
export const updateProduct = async (product: Product): Promise<void> => {
  try {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      await saveProducts(products);
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
  }
};

// Remove um produto pelo id, filtrando do array e salvando de novo
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const products = await getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    await saveProducts(filteredProducts);
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
  }
};

// Exporta todas as funções pra facilitar importação em outros arquivos
const Storage = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  saveProducts
};

export default Storage;
