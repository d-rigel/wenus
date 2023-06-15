import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../initial-state/initial-state";

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
  },
});
