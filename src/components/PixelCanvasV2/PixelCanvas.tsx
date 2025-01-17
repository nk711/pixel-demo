import React, { useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { Rect, Skia, Path } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native-unistyles";
import Button from "../Button/Button";
import CompletedAnnotationsCanvas from "./CompletedAnnotations/CompletedAnnotations";
import CurrentAnnotationCanvas from "./CurrentAnnotationCanvas/CurrentAnnotations";

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

  const screenWidth = Dimensions.get("window").width;
  const cellDimension = Math.round(screenWidth / gridSize / 16) * 16;
  const canvasSize = cellDimension * gridSize;
  const limit = gridSize - 1 

  const [showGrid, setShowGrid] = useState(true); 


  const toggleGrid = () => setShowGrid((prev) => !prev);

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
    
      return gridMap;
  }, [gridSize, cellDimension, canvasSize]);
    

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
  }, [cellDimension, tileSize, gridSize]);  

  return (
    <View style={{ flex: 1 }}>
      {/* <Button onPress={clearAnnotations}>Clear All</Button> */}
      <Button onPress={toggleGrid}>
        {showGrid ? "Hide Grid Lines" : "Show Grid Lines"}
      </Button>
        <View style={[styles.canvas, { marginTop: cellDimension }]}>
            <CurrentAnnotationCanvas 
              checkeredBackground={checkeredBackground} 
              completedAnnotations= {<CompletedAnnotationsCanvas canvasSize={canvasSize} gridSize={gridSize} /> }
              gridLayout={showGrid && Array.from(gridPaths.values())}
              canvasSize={canvasSize} gridSize={gridSize}  />
        </View>
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
