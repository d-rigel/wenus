import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import sidebarNav from "../../config/sidebarNav";
import images from "../../constants/images";
import { Icon } from "@iconify/react";
import classes from "./Sidebar.module.scss";

export const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowSize();
  const location = useLocation();
  const { t } = useTranslation();

  const { isOpen } = useSelector((state: RootState) => state);

  function openSidebarHandler() {
    //for width>768(tablet size) if sidebar was open in width<768 was opened too.
    //just in case of tablet size and smaller then, sidebar__open can added.
    if (width <= 768) document.body.classList.toggle("sidebar__open");
  }

  // function logoutHandler() {
  //   openSidebarHandler();
  //   loginCtx.toggleLogin();
  // }

  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = sidebarNav.findIndex((item) => item.section === curPath);

    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);
  return (
    <div className={`${classes.sidebar} ${!isOpen && classes.sidebar_close}`}>
      <div className={classes.sidebar__logo}>
        <img src={images.logo} alt="bar" />
      </div>
      <div className={classes.sidebar__menu}>
        {sidebarNav.map((nav, index) => (
          <Link
            to={nav.link}
            key={`nav-${index}`}
            className={`${classes.sidebar__menu__item} ${
              activeIndex === index && classes.active
            }`}
            onClick={openSidebarHandler}>
            <div className={classes.sidebar__menu__item__icon}>
              <Icon icon={nav.icon} />
            </div>
            <div className={classes.sidebar__menu__item__txt}>
              {t(nav.section)}
            </div>
          </Link>
        ))}
      </div>

      <div className={[classes.sidebar__menu, classes.logout].join("")}>
        <Link
          to="/login"
          className={classes.sidebar__menu__item}
          // onClick={logoutHandler}
        >
          <div className={classes.sidebar__menu__item__icon}>
            <Icon icon="tabler:logout" />
          </div>
          <div className={classes.sidebar__menu__item__txt}>{t("logout")}</div>
        </Link>
      </div>
    </div>
  );
};
