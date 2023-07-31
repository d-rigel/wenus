import React from "react";
import { Icon } from "@iconify/react";
import { useWindowSize } from "usehooks-ts";
import { articleActions } from "../../store/store";
import SearchBox from "./searchBox/SearchBox";
import TopNavRightBox from "./rightBox/TopNavRightBox";
import { useDispatch } from "react-redux";

import classes from "./TopNav.module.scss";

function TopNav() {
  const { width } = useWindowSize();
  const dispatch = useDispatch();

  function openSidebarHandler() {
    dispatch(articleActions.sidebarIsOpen());
    if (width <= 768) document.body.classList.toggle("sidebar__open");
  }

  return (
    <div className={classes.topNav}>
      <div className={classes.topNav_left}>
        <div
          className={classes.topNav_left_menu_icon}
          onClick={openSidebarHandler}>
          <Icon icon="ci:menu-alt-03" width="24" />
        </div>
        <div className={classes.topNav_left_menu} onClick={openSidebarHandler}>
          <div className="topNav_left_menu_open">
            <Icon icon="ci:menu-alt-03" width="24" />
          </div>

          <div className="topNav_left_menu_close">
            <Icon icon="eva:close-fill" width="24" />
          </div>
        </div>
        <div className={classes.search_desktop_wrapper}>
          <SearchBox />
        </div>
      </div>
      <TopNavRightBox />
      <br />
      <div className={classes.search_tablet_wrapper}>
        <SearchBox />
      </div>
    </div>
  );
}

export default TopNav;
