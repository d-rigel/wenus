import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState, articleActions } from "../store";

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

const { sidebarIsOpen } = articleActions;

export function toggleSidebars(): AppThunk {
  return (dispatch) => {
    dispatch(sidebarIsOpen());
  };
}
