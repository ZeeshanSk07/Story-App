import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSmallScreen: false,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setScreenSize(state, action) {
      const { isSmallScreen } = action.payload;
      state.isSmallScreen = isSmallScreen;
    },
  },
});

export const { setScreenSize } = layoutSlice.actions;

export default layoutSlice.reducer;
