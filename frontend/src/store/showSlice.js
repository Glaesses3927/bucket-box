import { createSlice } from "@reduxjs/toolkit";

const showSlice = createSlice({
  name: "showMenuModal",
  initialState: {
    showAddModal: false,
    showMenu: false,
    editting: false,
  },
  reducers: {
    setShowAddModal: (state, action) => {
      state.showAddModal = action.payload;
    },
    setShowMenu: (state, action) => {
      state.showMenu = action.payload;
    },
    setEditting: (state, action) => {
      state.editting = action.payload;
    },
  },
});

export const { setShowAddModal, setShowMenu, setEditting } = showSlice.actions;
export default showSlice.reducer;