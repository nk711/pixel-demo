import React, { useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Canvas, Rect, Skia, Path } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native-unistyles";
import Button from "../Button/Button";

interface PixelCanvasProps {
  gridSize: number; // e.g., 16 for 16x16 grid
  cellSize?: number; // Optional size for each cell
  initialColor: string; // Color passed down as a prop
  tileSize?: number;
}

export default function PixelCanvas({
  gridSize = 16,
  cellSize,
  initialColor,
  tileSize = 16, 
}: PixelCanvasProps) {
  const [filledCells, setFilledCells] = useState<Map<string, string>>(new Map());
  const screenWidth = Dimensions.get("window").width;
  const cellDimension = Math.round(screenWidth / gridSize / 16) * 16;
  const canvasSize = cellDimension * gridSize;

  const [showGrid, setShowGrid] = useState(true); // State for toggling the grid visibility

  // Utility to encode a cell's coordinates as a key
  const getKey = (x: number, y: number) => `${x},${y}`;

  // Function to fill a cell with the current color
  const fillCell = (x: number, y: number) => {
    setFilledCells((prev) => {
      const newCells = new Map(prev);
      newCells.set(getKey(x, y), initialColor);
      return newCells;
    });
  };

  // Gesture for tap and drag drawing
  const pan = Gesture.Pan()
    .onStart((g) => {
      const x = Math.floor(g.x / cellDimension);
      const y = Math.floor(g.y / cellDimension);
      fillCell(x, y);
    })
    .onUpdate((g) => {
      const x = Math.floor(g.x / cellDimension);
      const y = Math.floor(g.y / cellDimension);
      fillCell(x, y);
    });

  const tap = Gesture.Tap().onEnd((g) => {
    const x = Math.floor(g.x / cellDimension);
    const y = Math.floor(g.y / cellDimension);
    fillCell(x, y);
  });

  const gestures = Gesture.Race(pan, tap);

  const clearAll = () => setFilledCells(new Map());

  const toggleGrid = () => setShowGrid((prev) => !prev);

    // Memoizing grid lines to avoid unnecessary recalculations
  const gridPaths = useMemo(() => {
      const gridMap = new Map<string, JSX.Element>();
    
      // Generate vertical lines and store in the map
      Array.from({ length: gridSize }).forEach((_, colIndex) => {
        const path = Skia.Path.Make();
        path.moveTo(colIndex * cellDimension, 0);
        path.lineTo(colIndex * cellDimension, canvasSize);
        gridMap.set(`v-${colIndex}`, (
          <Path key={`v-${colIndex}`} path={path} color="#C8C8C8" strokeWidth={1} style="stroke" />
        ));
      });
    
      // Generate horizontal lines and store in the map
      Array.from({ length: gridSize }).forEach((_, rowIndex) => {
        const path = Skia.Path.Make();
        path.moveTo(0, rowIndex * cellDimension);
        path.lineTo(canvasSize, rowIndex * cellDimension);
        gridMap.set(`h-${rowIndex}`, (
          <Path key={`h-${rowIndex}`} path={path} color="#C8C8C8" strokeWidth={1} style="stroke" />
        ));
      });
    
      console.log('RERENDER - lines')

      return gridMap;
  }, [gridSize, cellDimension, canvasSize]);
    

    
  // Memoizing checkered background calculation with Map
  const checkeredBackground = useMemo(() => {
    const checkeredMap = new Map<string, JSX.Element>();

    // Adjust the tile size (16x the cell dimension)
    const tileDimension = cellDimension * tileSize;

    // Efficiently generate checkered pattern without nested loops
    const tileCount = gridSize * gridSize;
    for (let i = 0; i < tileCount; i++) {
      const rowIndex = Math.floor(i / gridSize);
      const colIndex = i % gridSize;

      const isEvenRow = rowIndex % 2 === 0;
      const isEvenCol = colIndex % 2 === 0;
      const tileColor = (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)
        ? "#D3D3D3" // Lighter Grey (Aesprite-like)
        : "#A9A9A9"; // Darker Grey (Aesprite-like)

      // Store tile data in the map, with unique key for each tile
      checkeredMap.set(`tile-${i}`, (
        <Rect
          key={`tile-${i}`}
          x={colIndex * tileDimension}
          y={rowIndex * tileDimension}
          width={tileDimension}
          height={tileDimension}
          color={tileColor}
        />
      ));
    }
    return checkeredMap; // Return the precomputed map
  }, [cellDimension, tileSize, gridSize]);

  const renderDrawing = () => {
    return Array.from(filledCells.entries()).map(([key, color]) => {
        const [x, y] = key.split(",").map(Number);
        return (
          <Rect
            key={key}
            x={x * cellDimension}
            y={y * cellDimension}
            width={cellDimension}
            height={cellDimension}
            color={color}
          />
        );
    })
  }
  return (
    <View style={{ flex: 1 }}>
      <Button onPress={clearAll}>Clear All</Button>
      <Button onPress={toggleGrid}>
        {showGrid ? "Hide Grid Lines" : "Show Grid Lines"}
      </Button>

      <GestureDetector gesture={gestures}>
        <View style={[styles.canvas, { marginTop: cellDimension }]}>
          <Canvas style={{ width: canvasSize, height: canvasSize }}>
            {/* {Array.from(checkeredBackground.values())} */}
            {renderDrawing()}
             {/* {showGrid && Array.from(gridPaths.values())} */}
          </Canvas>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: 'white',
    alignSelf: "center",
    justifyContent: "center",
  },
});
