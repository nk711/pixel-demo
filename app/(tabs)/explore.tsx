import React from 'react';
import { SafeAreaView, StyleSheet, Text, View} from 'react-native';
import { Canvas , Circle, Rect, RoundedRect } from "@shopify/react-native-skia";
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';

export default function TabTwoScreen() {
  const size = useSharedValue({ width: 0, height: 0 });
  const rectangleWidth = 100;

  const circleCenter = useDerivedValue(() => {
    return size.value.width / 2;
  }, [size]);

  const rectangleCenterCenter = useDerivedValue(() => {
    return size.value.width / 2 - rectangleWidth / 2;
  }, [size]);

  return (
    <View style={styles.container}>
      <Canvas style={styles.container} onSize={size}>
        <Circle cx={circleCenter} cy={225} r={50} color={"darkgreen"} />
        <Rect
          x={rectangleCenterCenter}
          y={325}
          height={50}
          width={100}
          color={"green"}
        />
        <RoundedRect
          x={rectangleCenterCenter}
          y={425}
          height={75}
          width={100}
          color={"lightgreen"}
          r={25}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
