import React, { useMemo, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Canvas, Rect, Skia, Path, usePictureAsTexture, Image } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native-unistyles";
import Button from "../Button/Button";
import { usePixelStore } from "@/src/store/DrawStore";
import Cell from "../Cell";

interface PixelCanvasProps {
  gridSize: number; // e.g., 16 for 16x16 grid
  tileSize?: number;
}
 

let counter = 0
export default function PixelCanvas({
  gridSize = 16,
  tileSize = 16, 
}: PixelCanvasProps) {

  counter++;
  console.log('re-render', counter)


  const { selectedColor, filledCells, fillCell, clearCells } = usePixelStore();

  const screenWidth = Dimensions.get("window").width;
  const cellDimension = Math.round(screenWidth / gridSize / 16) * 16;
  const canvasSize = cellDimension * gridSize;
  const limit = gridSize - 1 

  const [showGrid, setShowGrid] = useState(true); // State for toggling the grid visibility

  const lastDrawnCell = useRef<{ x: number, y: number } | null>(null);

  

  const fillLine = (x1: number, y1: number, x2: number, y2: number) => {
    // Bresenham's line algorithm to draw a line between two points
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
  
    let x = x1;
    let y = y1;
  
    while (true) {
      fillCell(x, y, selectedColor); // Fill the current cell
      if (x === x2 && y === y2) break;
  
      const e2 = err * 2;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  };
  


  // Gesture for tap and drag drawing
  const pan = Gesture.Pan()
  .onStart((g) => {
    if (g.x < 0 || g.y < 0) return;
    const x = Math.floor(g.x / cellDimension);
    const y = Math.floor(g.y / cellDimension);
    if (x > limit|| y > limit) return;

    // Draw the first cell immediately when touch starts
    fillCell(x, y, selectedColor);
    
    // Store the initial cell
    lastDrawnCell.current = { x, y }; 
  })
  .onUpdate((g) => {
    if (g.x < 0 || g.y < 0) return;
    const x = Math.floor(g.x / cellDimension);
    const y = Math.floor(g.y / cellDimension);
    if (x > limit|| y > limit) return;

    // console.log(x,y, '---', g.x, g.y )
    // setposition(`${g.x}, ${g.y},${x},${y}`)

    // Only draw if the cell has changed
    if (lastDrawnCell.current) {
      const prevX = lastDrawnCell.current.x;
      const prevY = lastDrawnCell.current.y;
      // Check if the current position is different from the last drawn one
      if (prevX !== x || prevY !== y) {
        // Draw a line between the previous and current cell (fill in the gap)
        fillLine(prevX, prevY, x, y); // Fill all the cells between the two positions
        lastDrawnCell.current = { x, y }; // Update the last drawn cell
      }
    }
  });

  const tap = Gesture.Tap().onEnd((g) => {
    if (g.x < 0 || g.y < 0) return;
    const x = Math.floor(g.x / cellDimension);
    const y = Math.floor(g.y / cellDimension);
    if (x > limit|| y > limit) return;

    fillCell(x, y, selectedColor);
  });

  const gestures = Gesture.Race(pan, tap);

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
          <Path key={`v-${colIndex}`} path={path} color="#C8C8C8" strokeWidth={2} style="stroke" />
        ));
      });
    
      // Generate horizontal lines and store in the map
      Array.from({ length: gridSize }).forEach((_, rowIndex) => {
        const path = Skia.Path.Make();
        path.moveTo(0, rowIndex * cellDimension);
        path.lineTo(canvasSize, rowIndex * cellDimension);
        gridMap.set(`h-${rowIndex}`, (
          <Path key={`h-${rowIndex}`} path={path} color="#C8C8C8" strokeWidth={2} style="stroke" />
        ));
      });
    
      console.log('RERENDER - lines')

      return gridMap;
  }, [gridSize, cellDimension, canvasSize]);
    

    
  // Memoizing checkered background calculation with Map
  const checkeredBackground = useMemo(() => {
    const checkeredTiles: JSX.Element[] = [];
    const tileDimension = cellDimension * tileSize;
    const totalTiles = Math.ceil(gridSize / tileSize) ** 2;
  
    for (let i = 0; i < totalTiles; i++) {
      const rowIndex = Math.floor(i / Math.ceil(gridSize / tileSize));
      const colIndex = i % Math.ceil(gridSize / tileSize);
  
      const isEvenRow = rowIndex % 2 === 0;
      const isEvenCol = colIndex % 2 === 0;
      const tileColor =
        (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)
          ? "#D3D3D3"
          : "#A9A9A9";
  
      checkeredTiles.push(
        <Rect
          key={`tile-${i}`}
          x={colIndex * tileDimension}
          y={rowIndex * tileDimension}
          width={tileDimension}
          height={tileDimension}
          color={tileColor}
        />
      );
    }
    return checkeredTiles;
  }, [cellDimension, tileSize, gridSize]);  // Ensure it's recomputed only when these value


  const renderDrawing =  useMemo(() => {
    return Array.from(filledCells.entries()).map(([key, color]) => {
        const [x, y] = key.split(",").map(Number);
        return (
          <Cell
            key={key}
            x={x * cellDimension}
            y={y * cellDimension}
            size={cellDimension}
            color={color}
          />
        );
    })
  }, [cellDimension, filledCells])

  
  return (
    <View style={{ flex: 1 }}>
      <Button onPress={clearCells}>Clear All</Button>
      <Button onPress={toggleGrid}>
        {showGrid ? "Hide Grid Lines" : "Show Grid Lines"}
      </Button>

      <GestureDetector gesture={gestures}>
        <View style={[styles.canvas, { marginTop: cellDimension }]}>
          <Canvas style={{ width: canvasSize, height: canvasSize }}>
            {checkeredBackground}
            {renderDrawing}
            {showGrid && Array.from(gridPaths.values())}
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
