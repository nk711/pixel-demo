import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet } from 'react-native-unistyles'
import ColourPicker from "../components/ColourPicker/ColourPicker";
import PixelCanvasV2 from "../components/PixelCanvasV2/PixelCanvasV2";

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}> Canvas </Text>
      <ColourPicker/>
      <PixelCanvasV2 gridSize={100} /> 
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