import {
    Canvas,
    Atlas,
    rect,
    useTexture,
    useRSXformBuffer,
    Group,
    Rect,
  } from "@shopify/react-native-skia";
  import { GestureDetector, Gesture } from "react-native-gesture-handler";
  import { useSharedValue } from "react-native-reanimated";
  
  const gridSize = { rows: 20, cols: 20 }; // Grid dimensions
  const cellSize = 16; // Size of each pixel (box)
  const strokeWidth = 1; // Width of the grid line
  const textureSize = { width: cellSize, height: cellSize };
  
  export const AtlasExample = () => {
    // Shared state: Record of filled cells
    const filledCells = useSharedValue(new Set<number>());
  
    // Create textures for filled and empty cells
    const filledTexture = useTexture(
      <Group>
        <Rect
          rect={rect(strokeWidth, strokeWidth, cellSize - strokeWidth * 2, cellSize - strokeWidth * 2)}
          color="cyan"
        />
        <Rect
          rect={rect(0, 0, cellSize, cellSize)}
          color="black"
          style="stroke"
          strokeWidth={strokeWidth}
        />
      </Group>,
      textureSize
    );
  
    // Gesture handling to toggle cell fill state
    const gesture = Gesture.Tap().onEnd((e) => {
      "worklet";
      const col = Math.floor(e.x / cellSize);
      const row = Math.floor(e.y / cellSize);
      const index = row * gridSize.cols + col;
  
      if (index >= 0 && index < gridSize.rows * gridSize.cols) {
        if (filledCells.value.has(index)) {
          // Remove cell from filled state
          filledCells.value.delete(index);
        } else {
          // Add cell to filled state
          filledCells.value.add(index);
        }
      }
    });
  
    // Generate transforms dynamically based on filled cells
    const transforms = useRSXformBuffer(filledCells.value.size, (val, i) => {
      "worklet";
      const indices = Array.from(filledCells.value);
      const index = indices[i];
      const x = (index % gridSize.cols) * cellSize;
      const y = Math.floor(index / gridSize.cols) * cellSize;
      val.set(1, 0, x, y);
    });
  
    // Generate sprites for the filled cells
    const sprites = new Array(filledCells.value.size)
      .fill(0)
      .map(() => rect(0, 0, cellSize, cellSize));
  
    return (
      <GestureDetector gesture={gesture}>
        <Canvas style={{ flex: 1 }}>
          <Atlas image={filledTexture} sprites={sprites} transforms={transforms} />
        </Canvas>
      </GestureDetector>
    );
  };
  