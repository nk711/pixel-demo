import React from "react";
import { Rect } from "@shopify/react-native-skia";
import { Annotation, Cell, usePixelStore } from "@/src/store/DrawStore";

interface AnnotationProps {
  annotation: Annotation;
  cellSize: number;
}

const AnnotationT = React.memo(({ annotation, cellSize }: AnnotationProps) => {
  console.log(`Rendering Annotation: ${annotation.id}`);

  return (
    <>
      {annotation.cells.map((cell, index) => {
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
    </>
  );
}, (prevProps, nextProps) => {
  // Only re-render if annotation has changed
  return prevProps.annotation === nextProps.annotation;
});

interface CompletedAnnotationsProps {
  canvasSize: number;
  gridSize: number;
}

let test = 0;
const CompletedAnnotationsCanvas = ({
  canvasSize,
  gridSize,
}: CompletedAnnotationsProps) => {
  const cellSize = canvasSize / gridSize;
  test++;
  // Fetch annotations from the store
  const annotations = usePixelStore((state) => state.annotations);

  return (
    <>
      {annotations.map((annotation) => (
        <AnnotationT key={annotation.id} annotation={annotation} cellSize={cellSize} />
      ))}
    </>
  );
};

export default CompletedAnnotationsCanvas;
