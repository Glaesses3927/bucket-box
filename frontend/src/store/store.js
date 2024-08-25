import { configureStore } from "@reduxjs/toolkit";
import showReducer from "./showSlice.js";
import filterBoxReducer from "./filterBoxSlice.js";
import targetReducer from "./targetSlice.js";

const store = configureStore({
  reducer: {
    show: showReducer,
    filter: filterBoxReducer,
    target: targetReducer,
  },
});

export default store;