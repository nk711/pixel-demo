import React from "react";
import { Rect } from "@shopify/react-native-skia";

interface CellProps {
  x: number;
  y: number;
  size: number;
  color: string;
}

const Cell: React.FC<CellProps> = React.memo(({ x, y, size, color }) => {
  return <Rect x={x} y={y} width={size} height={size} color={color} />;
});

Cell.displayName = 'Cell'

export default Cell;
