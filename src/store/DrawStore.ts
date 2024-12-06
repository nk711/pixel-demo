import { Color, PaintProps } from '@shopify/react-native-skia'
import { Point } from 'react-native-gesture-handler/lib/typescript/web/interfaces'
import { create}  from 'zustand'


export interface CompletedPoints {
  id: number;
  points: Point[];
  color: Color;
  width: number;
  style: PaintProps['style'];
}

interface PixelStore {
  selectedColor: string;
  filledCells: Map<string, string>;
  setColor: (color: string) => void;
  fillCell: (x: number, y: number, color: string) => void;
  clearCells: () => void;
}

export const usePixelStore = create<PixelStore>((set) => {
  const MAX_CELLS = 10000;

  return {
    selectedColor: "#06d6a0", // Default color
    filledCells: new Map(), // Initial empty map
    setColor: (color) => set({ selectedColor: color }),

    fillCell: (x, y, color) => {
      const cellKey = `${x},${y}`;

      set((state) => {
        if (state.filledCells.get(cellKey) === color) return state;

        state.filledCells.set(cellKey, color);

        // If we exceed MAX_CELLS, remove the oldest
        if (state.filledCells.size > MAX_CELLS) {
          const iterator = state.filledCells.keys();
          state.filledCells.delete(iterator.next().value); // Delete the oldest entry
        }

        return { filledCells: new Map(state.filledCells) }; // Return a new reference
      });
    },

    clearCells: () => set({ filledCells: new Map() }), // Clear all cells
  };
});