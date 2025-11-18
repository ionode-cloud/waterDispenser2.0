
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  total: { count: 3, color: "home-total-card" },
  available: { count: 3, color: "home-available-card" },
  unavailable: { count: 0, color: "home-unavailable-card" },
  faulted: { count: 0, color: "home-faulted-card" },
};

const dispensionSlice = createSlice({
  name: "dispension",
  initialState,
  reducers: {
    updateTotal: (state, action) => {
      state.total.count = action.payload;
    },
    updateAvailable: (state, action) => {
      state.available.count = action.payload;
    },
    updateUnavailable: (state, action) => {
      state.unavailable.count = action.payload;
    },
    updateFaulted: (state, action) => {
      state.faulted.count = action.payload;
    },
  },
});

export const {
  updateTotal,
  updateAvailable,
  updateUnavailable,
  updateFaulted,
} = dispensionSlice.actions;

export default dispensionSlice.reducer;
