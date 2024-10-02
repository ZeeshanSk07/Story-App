import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./component/Layout/LayoutSlice.js"

const store = configureStore({
  reducer: {
    layout: layoutReducer,
  },
});

export default store;
