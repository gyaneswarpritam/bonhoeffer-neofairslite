"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dialogReducer from "./features/dialogs/dialogSlice";
import stallviewReducer from "./features/stallview/stallView";
import commonReducer from "./features/common/commonSlice";
import neofairsliteReducer from "./features/neofairslite/neofairsLiteSlice";

const rootReducer = combineReducers({
  dialog: dialogReducer,
  stallview: stallviewReducer,
  commonStore: commonReducer,
  neofairsLite: neofairsliteReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
