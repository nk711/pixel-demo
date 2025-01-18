import React, { ReactNode } from "react";
import { Rect, Canvas } from "@shopify/react-native-skia";
import { Cell, usePixelStore } from "@/src/store/DrawStore";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

interface CurrentAnnotationProps {
  checkeredBackground: ReactNode;
  gridLayout: ReactNode;
  completedAnnotations: ReactNode;
  canvasSize: number; // Total size of the canvas
  gridSize: number; 
}

const CurrentAnnotationCanvas = ({
  checkeredBackground,
  gridLayout,
  completedAnnotations,
  canvasSize,
  gridSize,
}: CurrentAnnotationProps) => {
  const cellSize = canvasSize / gridSize; 
  const { selectedColor, currentAnnotation: annotation, startAnnotation, updateCurrentAnnotation, completeAnnotation} = usePixelStore();
  
  const mapToGrid = (x: number, y: number) => {
    const cellSize = canvasSize / gridSize;
    return {
      x: Math.floor(x / cellSize),
      y: Math.floor(y / cellSize),
    };
  };

  const onStartFunc = (gx: number, gy: number) => {
    const { x, y } = mapToGrid(gx, gy);
    startAnnotation(selectedColor);
    updateCurrentAnnotation({x, y})
  }
  const onUpdateFunc = (gx: number, gy: number) => {
    const { x, y } = mapToGrid(gx, gy);
    updateCurrentAnnotation({x, y})
  }

  const pan = Gesture.Pan()
    .onStart((g) => {
      'worklet'
      runOnJS(onStartFunc)(g.x, g.y);
    })
    .onUpdate((g) => {
      runOnJS(onUpdateFunc)(g.x, g.y);
    })
    .onEnd(() => {
      runOnJS(completeAnnotation)();
    });


  const gestures = Gesture.Race(pan);

  return (
    <GestureDetector gesture={gestures}>
      <Canvas style={{ width: canvasSize, height: canvasSize }}>
        { checkeredBackground }
        { completedAnnotations }
        {annotation && annotation.cells.map((cell: Cell, index: number) => {
          const x = cell.x * cellSize;
          const y = cell.y * cellSize;
          return (
            <Rect
              key={`${annotation.id}-${index}`}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              color={annotation.color}
            />
          );
        })}
        {gridLayout }
      </Canvas>
    </GestureDetector>
  );
};

CurrentAnnotationCanvas.displayName = 'CurrentAnnotationCanvas'

export default React.memo(CurrentAnnotationCanvas);
