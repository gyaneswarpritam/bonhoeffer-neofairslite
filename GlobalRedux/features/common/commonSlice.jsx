"use client"; //this is a client side component

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showNavbar: true,
  showEntry: false,
};

export const CommonSlice = createSlice({
  name: "commonStore",
  initialState,
  reducers: {
    toggleNavbar: (state, action) => {
      return {
        ...state,
        showNavbar: action.payload,
      };
    },
    showNavbar: (state) => {
      return {
        ...state,
        showNavbar: true,
      };
    },
    entryVisibility: (state, action) => {
      return {
        ...state,
        showEntry: action.payload,
        showNavbar: false,
      };
    },
  },
});

export const { toggleNavbar, entryVisibility, showNavbar } =
  CommonSlice.actions;

export default CommonSlice.reducer;
