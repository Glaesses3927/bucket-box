import { createSlice } from "@reduxjs/toolkit";

const targetSlice = createSlice({
  name: "target",
  initialState: {
    bucketList: [],
    bucketTable: [],
    chosenItemId: -1,
    chosenItemTable: "",
  },
  reducers: {
    setBucketList: (state, action) => {
      state.bucketList = action.payload;
    },
    setBucketTable: (state, action) => {
      state.bucketTable = action.payload;
    },
    setChosenItemId: (state, action) => {
      state.chosenItemId = action.payload;
    },
    setChosenItemTable: (state, action) => {
      state.chosenItemTable = action.payload;
    },
  },
});

export const { setBucketList, setBucketTable, setChosenItemId, setChosenItemTable } = targetSlice.actions;
export default targetSlice.reducer;