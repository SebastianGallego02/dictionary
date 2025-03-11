import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define la estructura de un elemento del historial
export interface HistoryItem {
  word: string;
  timestamp: number;
}

interface HistoryState {
  searchHistory: HistoryItem[];
}

const initialState: HistoryState = {
  searchHistory: []
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<string>) => {
      // Comprueba si la palabra ya está en el historial
      const existingIndex = state.searchHistory.findIndex(item => 
        item.word.toLowerCase() === action.payload.toLowerCase());
      
      if (existingIndex !== -1) {
        // Si existe, elimina la entrada antigua
        state.searchHistory.splice(existingIndex, 1);
      }
      
      // Añade la nueva búsqueda al principio del array
      state.searchHistory.unshift({
        word: action.payload,
        timestamp: Date.now()
      });
      
      // Limita el historial a las últimas 20 búsquedas
      if (state.searchHistory.length > 20) {
        state.searchHistory = state.searchHistory.slice(0, 20);
      }
    },
    clearHistory: (state) => {
      state.searchHistory = [];
    }
  }
});

export const { addToHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;