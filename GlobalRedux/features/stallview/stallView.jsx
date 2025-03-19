"use client"; //this is a client side component

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  num: null,
  list: [],
  active: 0,
  initialName: "",
};

export const stallviewSlice = createSlice({
  name: "stalls",
  initialState,
  reducers: {
    numChange: (state, action) => {
      state.num = action.payload;
    },
    listChange: (state, action) => {
      state.list = action.payload;
    },
    activeChange: (state, action) => {
      state.active = state.active + action.payload;
    },
    initialValueChange: (state, action) => {
      state.initialName = action.payload;
    },
  },
});

export const { numChange, listChange, activeChange, initialValueChange } =
  stallviewSlice.actions;

export default stallviewSlice.reducer;
