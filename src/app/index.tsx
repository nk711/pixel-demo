import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet } from 'react-native-unistyles'
import PixelCanvas from "../components/PixelCanvas/PixelCanvas";
import ColourPicker from "../components/ColourPicker/ColourPicker";
import {  useState } from "react";

export default function Index() {
  const [selectedColor, setSelectedColor] = useState('#06d6a0'); // Default color

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}> Canvas </Text>
      <ColourPicker selectedColor={selectedColor} onColorSelect={setSelectedColor} />
      <PixelCanvas gridSize={100} initialColor={selectedColor}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
     flex:1,
     backgroundColor: theme.colors.backgroundColor
  },
  text: {
    color: theme.colors.typography
  }
}))