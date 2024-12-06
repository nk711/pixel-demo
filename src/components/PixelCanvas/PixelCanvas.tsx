import React, { useMemo, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Canvas } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native-unistyles";
import Button from "../Button/Button";
import { usePixelStore } from "@/src/store/DrawStore";
import HistoryLayer from "../HistoryLayers";

interface PixelCanvasProps {
  gridSize: number;
  tileSize?: number;
}

export default function PixelCanvas({
  gridSize = 16,
  tileSize = 16,
}: PixelCanvasProps) {
  const { selectedColor, clearCells, filledCells } = usePixelStore();

  const screenWidth = Dimensions.get("window").width;
  const cellDimension = Math.round(screenWidth / gridSize / 16) * 16;
  const canvasSize = cellDimension * gridSize;
  const limit = gridSize - 1;

  const [history, setHistory] = useState<Map<string, string>[]>([]); // Stores drawing history
  const [currentMap, setCurrentMap] = useState<Map<string, string>>(new Map());
  const lastDrawnCell = useRef<{ x: number; y: number } | null>(null);

  const [, rerender] = useState(0);
  const clearCanvas = () => {
    setHistory([]);
    setCurrentMap(new Map());
    clearCells();
  };

  const fillLine = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    let x = x1;
    let y = y1;

    const updatedMap = new Map(currentMap);

    while (true) {
      updatedMap.set(`${x},${y}`, selectedColor);
      
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

    setCurrentMap(updatedMap);
  };

  const pan = Gesture.Pan()
    .onStart((g) => {
      if (g.x < 0 || g.y < 0) return;
      const x = Math.floor(g.x / cellDimension);
      const y = Math.floor(g.y / cellDimension);
      if (x > limit || y > limit) return;

      const updatedMap = new Map(currentMap);
      updatedMap.set(`${x},${y}`, selectedColor);
      setCurrentMap(updatedMap);
      lastDrawnCell.current = { x, y };
      rerender((prev)=> prev+1)
    })
    .onUpdate((g) => {
      if (g.x < 0 || g.y < 0) return;
      const x = Math.floor(g.x / cellDimension);
      const y = Math.floor(g.y / cellDimension);
      if (x > limit || y > limit) return;

      if (lastDrawnCell.current) {
        const prevX = lastDrawnCell.current.x;
        const prevY = lastDrawnCell.current.y;
        if (prevX !== x || prevY !== y) {
          fillLine(prevX, prevY, x, y);
          lastDrawnCell.current = { x, y };
        }
      }
    })
    .onEnd(() => {
      setHistory((prev) => [...prev, new Map(currentMap)]);
      setCurrentMap(new Map());
    });

  const tap = Gesture.Tap().onEnd((g) => {
    if (g.x < 0 || g.y < 0) return;
    const x = Math.floor(g.x / cellDimension);
    const y = Math.floor(g.y / cellDimension);
    if (x > limit || y > limit) return;

    const updatedMap = new Map(currentMap);
    updatedMap.set(`${x},${y}`, selectedColor);
    setCurrentMap(updatedMap);

    setHistory((prev) => [...prev, updatedMap]);
    setCurrentMap(new Map());
  });

  const gestures = Gesture.Race(pan, tap);
  
  const renderDrawing = useMemo(() => {
    return history.map((map, index) => (
      <HistoryLayer
        key={index}
        map={map}
        cellDimension={cellDimension}
        layerIndex={index}
      />
    ));
  }, [history, cellDimension, filledCells]);

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={clearCanvas}>Clear All</Button>

      <GestureDetector gesture={gestures}>
        <View style={[styles.canvas, { marginTop: cellDimension }]}>
          <Canvas style={{ width: canvasSize, height: canvasSize }}>
            {renderDrawing}
          </Canvas>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
  },
});
