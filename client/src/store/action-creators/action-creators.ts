import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState, articleActions } from "../store";
import { useLocalStorage } from "usehooks-ts";

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

const { sidebarIsOpen, changeLanguage } = articleActions;

export function toggleSidebars(): AppThunk {
  return (dispatch) => {
    dispatch(sidebarIsOpen());
  };
}

// export function toggleLaguage(lang: string): AppThunk {

//   return (dispatch, getState) => {
//     // let lan = lang;
//     // dispatch(sidebarIsOpen());
//    if (getState().lang === "en") {
//     dispatch(changeLanguage("change"))
//     useLocalStorage("language", "en")
//    } else {
//     dispatch(changeLanguage("change"))
//     useLocalStorage("language", `${lang}`)
//    }
//   };
// }
