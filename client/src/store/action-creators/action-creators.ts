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
