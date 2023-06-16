import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../initial-state/initial-state";
import { useLocalStorage } from "usehooks-ts";

export const articleStateSlice = createSlice({
  name: "Articles",
  initialState: initialState,
  reducers: {
    sidebarIsOpen(state) {
      state.isOpen = !state.isOpen;
    },
    sideBarToggle(state, action: PayloadAction<() => void>) {
      state.toggleSidebar = action.payload;
    },
    changeLanguage(state, action: PayloadAction<string>) {
      state.lang = action.payload;
    },
  },
});
