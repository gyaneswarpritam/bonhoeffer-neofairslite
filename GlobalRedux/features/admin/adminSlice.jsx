"use client"; //this is a client side component

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

export const AdminSlice = createSlice({
  name: "adminStore",
  initialState,
  reducers: {},
});

export const {} = AdminSlice.actions;

export default AdminSlice.reducer;
