import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface UIState {
  activePage: string;
}

const initialState: UIState = {
  activePage: 'Dashboard',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActivePage(state, action: PayloadAction<string>) {
      state.activePage = action.payload;
    },
  },
});

export const { setActivePage } = uiSlice.actions;
export default uiSlice.reducer;
