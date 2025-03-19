"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  verify: true,
  haveAccount: false,
  isPro: true,
};

export const neofairsLiteSlice = createSlice({
  name: "neofairsLite",
  initialState,
  reducers: {
    verifyButton: (state, action) => {
      state.verify = action.payload;
    },
    haveAccount: (state, action) => {
      state.haveAccount = action.payload;
    },
    upgradePro: (state, action) => {
      state.isPro = action.payload;
    },
  },
});

export const { verifyButton, haveAccount, upgradePro } =
  neofairsLiteSlice.actions;
export default neofairsLiteSlice.reducer;
