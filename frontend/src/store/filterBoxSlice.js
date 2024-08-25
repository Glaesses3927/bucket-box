import { createSlice } from "@reduxjs/toolkit";

const filterBoxSlice = createSlice({
  name: "filterBox",
  initialState: {
    showComp: true,
    showOver: true,
  },
  reducers: {
    setShowComp: (state, action) => {
      state.showComp = action.payload;
    },
    setShowOver: (state, action) => {
      state.showOver = action.payload;
    },
  },
});

export const { setShowComp, setShowOver } = filterBoxSlice.actions;
export default filterBoxSlice.reducer;