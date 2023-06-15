import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState, articleActions, useThunkDispatch } from "../../store/store";
import images from "../../constants/images";

export const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowSize();
  const location = useLocation();
  const { t } = useTranslation();

  const { isOpen } = useSelector((state: RootState) => state)

  function openSidebarHandler() {
    //for width>768(tablet size) if sidebar was open in width<768 was opened too.
    //just in case of tablet size and smaller then, sidebar__open can added.
    if (width <= 768) document.body.classList.toggle("sidebar__open");
  }
  return (
    <div>
      Sidebar
      <h3>hhhhd</h3>
    </div>
  );
};
