// src/redux/slices/domSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DomState {
  projectDomId: string | null;
}

const initialState: DomState = {
  projectDomId: null,
};

export const domSlice = createSlice({
  name: 'dom',
  initialState,
  reducers: {
    setProjectDomId: (state, action: PayloadAction<string>) => {
      state.projectDomId = action.payload;
    },
    clearProjectDomId: (state) => {
      state.projectDomId = null;
    },
  },
});

export const { setProjectDomId, clearProjectDomId } = domSlice.actions;
export default domSlice.reducer;