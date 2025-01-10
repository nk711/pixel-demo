import React from "react";
import { Rect } from "@shopify/react-native-skia";
import { Cell, usePixelStore } from "@/src/store/DrawStore";

interface CompletedAnnotationsProps {
  canvasSize: number;
  gridSize: number; 
}

const CompletedAnnotationsCanvas = ({
  canvasSize,
  gridSize,
}: CompletedAnnotationsProps) => {
  const cellSize = canvasSize / gridSize;

  const annotations = usePixelStore((state) => state.annotations);
  return (
    <>
      {annotations.map((annotation) =>
        annotation.cells.map((cell: Cell, index: number) => {
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
        })
      )}
    </>
  );
};

export default CompletedAnnotationsCanvas;
