import React, { useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { Skia, drawAsImage, Atlas, rect, Canvas, Group, Rect, useRectBuffer, useRSXformBuffer, useTexture } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Button from "../Button/Button";
import { runOnJS, useDerivedValue, useSharedValue } from "react-native-reanimated";

interface PixelCanvasProps {
  gridSize: number; // e.g., 16 for 16x16 grid
  tileSize?: number;
}

let test= 0;

const DrawTest = ({ gridSize = 16, tileSize = 4 }: PixelCanvasProps) => {
  const screenWidth = Dimensions.get("window").width;
  const cellDimension = Math.floor(screenWidth / gridSize);
  const canvasSize = cellDimension * gridSize;

  const [showGrid, setShowGrid] = useState(true);
  // const [squares, setSquares] = useState<{ x: number; y: number }[]>([]);

  const toggleGrid = () => setShowGrid((prev) => !prev);


  test ++;
  console.log('re-renders', test)

  const squares = useSharedValue<{ x: number; y: number; color: string }[]>([]);

  const squareTexture = useTexture(
    <Group>
      <Rect rect={rect(0, 0, cellDimension, cellDimension)} color="cyan" />
    </Group>,
    { width: cellDimension, height: cellDimension }
  );
  
  // Static sprites array for all squares (same size)
  const sprites = useMemo(() => {
    return new Array(gridSize * gridSize)
      .fill(0)
      .map(() => rect(0, 0, cellDimension, cellDimension));
  }, [gridSize, cellDimension]);

  // RSXform buffer for transforms (position)
  const transformBuffer = useRSXformBuffer(squares.value.length, (transform, i) => {
    "worklet";
    const square = squares.value[i];
    transform.set(1, 0, square.x * cellDimension, square.y * cellDimension);
  });


  // Pre-rendered square image
  const squareImage = useMemo(() => {
    return drawAsImage(
      <Rect rect={rect(0, 0, cellDimension, cellDimension)} color="cyan" />,
      { width: cellDimension, height: cellDimension }
    );
  }, [cellDimension]);


  // Rect buffer for sprites
  const rectBuffer = useRectBuffer(squares.value.length, (rect, i) => {
    "worklet";
    const square = squares.value[i];
    rect.setXYWH(square.x * cellDimension, square.y * cellDimension, cellDimension, cellDimension);
  });


  

  const addSquare = (x: number, y: number) => {
    const gridX = Math.floor(x / cellDimension);
    const gridY = Math.floor(y / cellDimension);

    // Prevent duplicates
    if (!squares.value.some((sq) => sq.x === gridX && sq.y === gridY)) {
      // setSquares((prev) => [...prev, { x: gridX, y: gridY }]);
      squares.modify((value) => {
        'worklet';
        value.push({
          x: gridX, y: gridY,
          color: "red"
        }); // ✅
        return value;
      });
    }
  };

  // Gesture handler for adding squares
  const gesture = Gesture.Pan()
    .onStart((event) => {
      "worklet";
      runOnJS(addSquare)(event.x, event.y);
    })
    .onUpdate((event) => {
      "worklet";
      console.log('test',  squares.get());
      runOnJS(addSquare)(event.x, event.y);
    });

  // Grid lines pre-rendering
  const gridImage = useMemo(() => {
    const strokeWidth = 1;
    return drawAsImage(
      <Group>
        <Rect rect={rect(0, 0, canvasSize, strokeWidth)} color="#C8C8C8" />
        <Rect rect={rect(0, 0, strokeWidth, canvasSize)} color="#C8C8C8" />
      </Group>,
      { width: canvasSize, height: canvasSize }
    );
  }, [canvasSize]);

  // Transforms for grid lines
  const gridLines = useMemo(() => {
    if (!showGrid) return null;

    const sprites = [];
    const transforms = [];

    for (let i = 0; i <= gridSize; i++) {
      // Vertical lines
      sprites.push(rect(0, 0, canvasSize, 1));
      transforms.push(Skia.RSXform(1, 0, i * cellDimension, 0));
      // Horizontal lines
      sprites.push(rect(0, 0, 1, canvasSize));
      transforms.push(Skia.RSXform(1, 0, 0, i * cellDimension));
    }

    return { sprites, transforms };
  }, [gridSize, canvasSize, cellDimension, showGrid]);

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={toggleGrid}>
        {showGrid ? "Hide Grid Lines" : "Show Grid Lines"}
      </Button>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width: canvasSize, height: canvasSize, alignSelf: "center" }}>
          {/* Render grid lines */}
          {/* {showGrid && gridLines && (
            <Atlas image={gridImage} sprites={gridLines.sprites} transforms={gridLines.transforms} />
          )} */}
          {/* Render added squares */}
          
          <Atlas
            image={squareTexture}
            sprites={sprites}
            transforms={transformBuffer}
          />

        </Canvas>
      </GestureDetector>
    </View>
  );
};

export default DrawTest;
