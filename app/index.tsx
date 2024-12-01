import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet } from 'react-native-unistyles'

export default function Index() {
  const width = 256;
  const height = 256;
  const r = width * 0.33;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}> Canvas </Text>
      <View style={{flex:1}}>
      <Canvas style={{ width, height}}>
      <Group blendMode="multiply">
        <Circle cx={r} cy={r} r={r} color="cyan" />
        <Circle cx={width - r} cy={r} r={r} color="magenta" />
        <Circle cx={width / 2} cy={width - r} r={r} color="yellow" />
      </Group>
    </Canvas>
      </View>
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