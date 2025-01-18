import { StyleSheet, Text } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
// import { StyleSheet } from 'react-native-unistyles'
import ColourPicker from "../components/ColourPicker/ColourPicker";
import PixelCanvasV2 from "../components/PixelCanvasV2/PixelCanvas";
import { AtlasExample } from "../components/AtlasExample/AtlasExample";
import GestureExample from "../components/DrawTest/GestureExample";
import DrawTest from "../components/DrawTest/DrawTest copy";

export default function Index() {
  return (
    <GestureHandlerRootView>

    <ScrollView style={styles.container}>
      <Text style={styles.text}> Canvas </Text>
      <ColourPicker/>
      {/* <DrawTest gridSize={100}/>  */}
      {/* <GestureExample/> */}
      <PixelCanvasV2 gridSize={150}/> 
    </ScrollView>
    </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  container: {
     flex:1,
    //  backgroundColor: theme.colors.backgroundColor
  },
  text: {
    color: 'black'
  }
})