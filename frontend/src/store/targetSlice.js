import { createSlice } from "@reduxjs/toolkit";

const targetSlice = createSlice({
  name: "target",
  initialState: {
    bucketList: [],
    chosenItem: -1,
  },
  reducers: {
    setBucketList: (state, action) => {
      state.bucketList = action.payload;
    },
    setChosenItem: (state, action) => {
      state.chosenItem = action.payload;
    },
  },
});

export const { setBucketList, setChosenItem } = targetSlice.actions;
export default targetSlice.reducer;