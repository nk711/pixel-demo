import React, { ReactNode } from "react";
import { Rect, Canvas } from "@shopify/react-native-skia";
import { Cell, usePixelStore } from "@/src/store/DrawStore";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

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

  
  const mapToGrid = (x: number, y: number, canvasSize: number, gridSize: number) => {
    const cellSize = canvasSize / gridSize;
    return {
      x: Math.floor(x / cellSize),
      y: Math.floor(y / cellSize),
    };
  };

  const pan = Gesture.Pan()
    .onStart((g) => {
      const { x, y } = mapToGrid(g.x, g.y, canvasSize, gridSize);
      startAnnotation(selectedColor);
      updateCurrentAnnotation({x, y})
    })
    .onUpdate((g) => {
      const { x, y } = mapToGrid(g.x, g.y, canvasSize, gridSize);
      updateCurrentAnnotation({x, y})
    })
    .onEnd(() => {
      completeAnnotation();
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
