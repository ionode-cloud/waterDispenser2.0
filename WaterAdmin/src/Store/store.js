import { configureStore } from "@reduxjs/toolkit";
import dispensionReducer from "../Store/Slices/dispensionSlice"

const store = configureStore({
  reducer: {
       dispension: dispensionReducer,
  },  
});


export default store;
