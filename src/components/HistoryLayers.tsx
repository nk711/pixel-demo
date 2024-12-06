import React, { useMemo } from "react";
import Cell from "./Cell"; // Assuming Cell is your cell component

interface HistoryLayerProps {
  map: Map<string, string>; // Map with cell data
  cellDimension: number; // Size of each cell
  layerIndex: number; // To ensure unique keys for React
}

const HistoryLayer = React.memo(({ map, cellDimension, layerIndex }: HistoryLayerProps) => {
  const cells = useMemo(() => {
    return Array.from(map.entries()).map(([key, color]) => {
      const [x, y] = key.split(",").map(Number);
      return (
        <Cell
          key={`${layerIndex}-${key}`}
          x={x * cellDimension}
          y={y * cellDimension}
          size={cellDimension}
          color={color}
        />
      );
    });
  }, [map, cellDimension, layerIndex]); // Only re-compute if map or cellDimension changes

  return <>{cells}</>;
});


HistoryLayer.displayName = "HistoryLayer";

export default HistoryLayer