import React, { useEffect } from "react";

import classes from "./ThemeBox.module.scss";
import { articleActions } from "../../../../store/store";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "usehooks-ts";

function ThemeBox() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      return prev === "light" ? "dark" : "light";
    });
    dispatch(articleActions.changeTheme(theme));
  }
  return (
    <div className={classes.themeBox} onClick={() => toggleTheme()}>
      <div
        className={`${classes.toggle} ${
          theme === "dark" ? classes.darkMode : ""
        }`}></div>
    </div>
  );
}

export default ThemeBox;
