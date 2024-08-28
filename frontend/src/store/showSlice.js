import { createSlice } from "@reduxjs/toolkit";

const showSlice = createSlice({
  name: "showMenuModal",
  initialState: {
    showAddModal: false,
    showMenu: false,
    editting: false,
    isLoading: false,
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
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setShowAddModal, setShowMenu, setEditting, setIsLoading } = showSlice.actions;
export default showSlice.reducer;