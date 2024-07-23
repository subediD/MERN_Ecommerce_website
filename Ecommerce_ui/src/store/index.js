import { configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "./slices/snackbar.slice";
import productReducer from "./slices/productSlice";

const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    product: productReducer,
  },
});

export default store;
