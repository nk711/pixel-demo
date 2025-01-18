import { create } from 'zustand';

export interface Cell {
  x: number;
  y: number;
}

export interface Annotation {
  id: number;
  cells: Cell[]; 
  color: string;
}

//TODO: Split store into 2

interface PixelStore {
  selectedColor: string;
  annotations: Annotation[];
  currentAnnotation: Annotation | null;
  startAnnotation: (color: string) => void;
  updateCurrentAnnotation: (cell: Cell) => void;
  setColor: (color: string) => void;
  completeAnnotation: () => void;
  clearAnnotations: () => void;
}

export const interpolateCells = (start: Cell, end: Cell) => {
  const cells = [];
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  const steps = Math.max(dx, dy);

  for (let i = 1; i <= steps; i++) {
    const x = Math.round(start.x + ((end.x - start.x) * i) / steps);
    const y = Math.round(start.y + ((end.y - start.y) * i) / steps);
    cells.push({ x, y });
  }

  return cells;
};

export const usePixelStore = create<PixelStore>((set) => {
  return {
    selectedColor: "#06d6a0",
    annotations: [],
    currentAnnotation: null,

    setColor: (color) => set({ selectedColor: color }),

    startAnnotation: (color) =>
      set({
        currentAnnotation: {
          id: Date.now(),
          cells: [],
          color,
        },
      }),

      updateCurrentAnnotation: (cell) => {
        set((state) => {
          if (!state.currentAnnotation) return state;
      
          const cellKey = `${cell.x},${cell.y}`;
          const existingCells = new Set(
            state.currentAnnotation.cells.map((c) => `${c.x},${c.y}`)
          );
      
          if (existingCells.has(cellKey)) return state;
      
          const lastCell = state.currentAnnotation.cells[state.currentAnnotation.cells.length - 1];
          if (lastCell) {
            const interpolatedCells = interpolateCells(lastCell, cell);
            return {
              currentAnnotation: {
                ...state.currentAnnotation,
                cells: [...state.currentAnnotation.cells, ...interpolatedCells],
              },
            };
          }
      
          return {
            currentAnnotation: {
              ...state.currentAnnotation,
              cells: [...state.currentAnnotation.cells, cell],
            },
          };
        });
      },

    completeAnnotation: () =>
      set((state) => {
        if (!state.currentAnnotation) return state;
        return {
          annotations: [...state.annotations, state.currentAnnotation],
          currentAnnotation: null,
        };
      }),

    clearAnnotations: () => set({ annotations: [], currentAnnotation: null }),
  };
});
