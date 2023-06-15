import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { articleStateSlice } from "./state-slice/state-slice";

const store = configureStore({
  reducer: articleStateSlice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export const articleActions = articleStateSlice.actions;
export const useThunkDispatch = () => useDispatch<typeof store.dispatch>();

export default store;
