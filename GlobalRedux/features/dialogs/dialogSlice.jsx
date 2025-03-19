"use client"; //this is a client side component

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  isopen: false,
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    modelChange: (state, action) => {
      state.name = action.payload;
    },
    modelOpen: (state) => {
      state.isopen = true;
    },
    modelClose: (state) => {
      state.isopen = false;
    },
  },
});

export const { modelChange, modelOpen, modelClose } = dialogSlice.actions;

export default dialogSlice.reducer;
