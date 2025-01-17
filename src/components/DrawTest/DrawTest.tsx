import {Skia, drawAsImage, Group, Rect, Canvas, Atlas, rect, useColorBuffer} from "@shopify/react-native-skia";
 

export const DrawTest = () => {
  const numberOfBoxes = 150;
  const pos = { x: 128, y: 128 };
  const width = 350;

  const size = { width: 25, height: 25 };
const strokeWidth = 2;
const imageSize = {
    width: size.width + strokeWidth,
    height: size.height + strokeWidth,
};
const image = drawAsImage(
    <Group>
    <Rect
        rect={rect(strokeWidth / 2, strokeWidth / 2, size.width, size.height)}
        color="red"
    />
    <Rect
        rect={rect(strokeWidth / 2, strokeWidth / 2, size.width, size.height)}
        color="orange"
        style="stroke"
        strokeWidth={strokeWidth}
    />
    </Group>,
    imageSize
);
 

  const sprites = new Array(numberOfBoxes)
    .fill(0)
    .map(() => rect(0, 0, imageSize.width, imageSize.height));

  const transforms = new Array(numberOfBoxes).fill(0).map((_, i) => {
    const tx = 5 + ((i * size.width) % width);
    const ty = 25 + Math.floor(i / (width / size.width)) * size.width;
    return Skia.(1,0, tx, ty);
  });
 
  const colours = useColorBuffer(numberOfBoxes, (rect, i) => {

  });
  
   return (
    <Canvas style={{ flex: 1 }}>
      <Atlas image={image} sprites={sprites} transforms={transforms} color={} />
    </Canvas>
  );
};