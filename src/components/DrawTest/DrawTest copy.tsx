import React, { useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { Skia, drawAsImage, Atlas, rect, Canvas, Group, Rect } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Button from "../Button/Button";
import { runOnJS } from "react-native-reanimated";

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
  const [squares, setSquares] = useState<{ x: number; y: number }[]>([]);

  const toggleGrid = () => setShowGrid((prev) => !prev);


  test ++;
  console.log('re-renders', test)
  // Pre-rendered square image
  const squareImage = useMemo(() => {
    return drawAsImage(
      <Rect rect={rect(0, 0, cellDimension, cellDimension)} color="cyan" />,
      { width: cellDimension, height: cellDimension }
    );
  }, [cellDimension]);

  // Transforms for added squares
  const squareTransforms = useMemo(() => {
    return squares.map((square) =>
      Skia.RSXform(1, 0, square.x * cellDimension, square.y * cellDimension)
    );
  }, [squares, cellDimension]);

  // Add a square to the grid
  const addSquare = (x: number, y: number) => {
    const gridX = Math.floor(x / cellDimension);
    const gridY = Math.floor(y / cellDimension);

    // Prevent duplicates
    if (!squares.some((sq) => sq.x === gridX && sq.y === gridY)) {
      setSquares((prev) => [...prev, { x: gridX, y: gridY }]);
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
            image={squareImage}
            sprites={squareTransforms.map(() => rect(0, 0, cellDimension, cellDimension))}
            transforms={squareTransforms}
          />
        </Canvas>
      </GestureDetector>
    </View>
  );
};

export default DrawTest;
