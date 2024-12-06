import { usePixelStore } from '@/src/store/DrawStore';
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colors = [
  '#06d6a0', '#ff6f61', '#4e4b8b', '#ffcc00', '#ff64b1', '#00aaff', '#fa5c7c', '#ffffff', '#000000',
];

const ColourPicker = () => {
  const { selectedColor, setColor } = usePixelStore();
  return (
    <View style={styles.container}>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorBox,
            { backgroundColor: color },
            selectedColor === color && styles.selected,
          ]}
          onPress={() => setColor(color)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    padding: 10,
    justifyContent: 'center',
  },
  colorBox: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  selected: {
    borderColor: '#000000',
  },
});

export default ColourPicker;
