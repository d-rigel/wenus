import React, { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import { useOnClickOutside } from "usehooks-ts";

import { articleActions } from "../../../../store/store";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "usehooks-ts";
import i18n from "../../../../locale";

import classes from "./LangBox.module.scss";

function LangBox() {
  const [showLangBox, setShowLangBox] = useState(false);
  const langBoxRef = useRef<HTMLDivElement>(null);

  const [lang, setLang] = useLocalStorage("language", "en");

  const dispatch = useDispatch();
  const toggleLang = (sLang: string) => {
    setLang(sLang);
    dispatch(articleActions.changeLanguage(sLang));
  };

  const showBoxHandler = function toDo() {
    setShowLangBox((prev) => !prev);
  };

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    document.documentElement.lang = lang === "en" ? "en" : "fa";
  }, [lang]);
  const checkIfClickedOutside = useCallback(() => {
    // If the menu is open and the clicked target is not within the menu,
    // then close the menu
    if (showLangBox && langBoxRef.current) {
      setShowLangBox(false);
    }
  }, [showLangBox]);

  //custom hook - when click outside of langbox, it will close.
  useOnClickOutside(langBoxRef, checkIfClickedOutside);

  return (
    <div className={classes.lang} ref={langBoxRef}>
      <div className={classes.lanBox} onClick={showBoxHandler}>
        <Icon icon="clarity:language-line" width="20" />

        <div className={classes.lang_slc}>{lang}</div>

        <Icon icon="ep:arrow-down-bold" width="10" />
      </div>
      <div
        className={`${classes.lang_menu} ${showLangBox ? classes.show : ""}`}>
        <div
          onClick={() => {
            toggleLang("en");
            showBoxHandler();
          }}>
          English (en)
        </div>
        <div
          onClick={() => {
            toggleLang("fa");
            showBoxHandler();
          }}>
          Farsi (fa)
        </div>
      </div>
    </div>
  );
}

export default LangBox;
