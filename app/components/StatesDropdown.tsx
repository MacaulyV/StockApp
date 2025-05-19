import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface StatesDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

// Componente de dropdown para selecionar o estado de origem do produto
function StatesDropdown({ value, onChange }: StatesDropdownProps) {
  const [isFocus, setIsFocus] = useState(false);

  // Lista fixa de estados brasileiros (label pra exibição, value pro valor interno)
  const states = [
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Estado de origem</Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'rgba(46, 204, 113, 0.7)' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        containerStyle={styles.dropdownContainer}
        activeColor={'rgba(255, 255, 255, 0.15)'}
        itemContainerStyle={styles.itemContainer}
        itemTextStyle={styles.itemText}
        data={states}
        search // habilita busca dentro do dropdown
        maxHeight={300} // limita a altura máxima
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Selecione o estado' : '...'}
        searchPlaceholder="Pesquisar..."
        value={value} // valor selecionado atualmente
        onFocus={() => setIsFocus(true)} // muda estilo ao focar
        onBlur={() => setIsFocus(false)} // remove estilo de foco ao perder foco
        onChange={item => {
          onChange(item.value); // envia valor pro form
          setIsFocus(false);     // fecha o dropdown após escolher
        }}
        renderItem={(item, selected) => (
          <View style={[
              styles.dropdownItem,
              selected && styles.selectedItem
            ]}>
            <Text style={[
                styles.itemText,
                selected && styles.selectedItemText
              ]}>
              {item.label}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

export default StatesDropdown;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  dropdown: {
    height: 50,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dropdownContainer: {
    backgroundColor: '#222222',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItem: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: 'white',
  },
  itemText: {
    fontSize: 16,
    color: 'white',
  },
  selectedItemText: {
    color: '#222222',
    fontWeight: 'bold',
  },
});

