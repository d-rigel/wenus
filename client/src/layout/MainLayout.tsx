import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/sidebar/Sidebar";
import TopNav from "../components/topNav/TopNav";

import { RootState } from "../store/store";
import { useSelector } from "react-redux";

import classes from "./MainLayout.module.scss";

const MainLayout = () => {
  const { isOpen } = useSelector((state: RootState) => state);

  useEffect(() => {
    if (document.body.classList.contains("sidebar__open"))
      document.body.classList.remove("sidebar__open");
  }, []);

  return (
    <div className={classes.container}>
      <Sidebar />
      <div className={classes.main}>
        <div
          className={`${classes.main__content} ${
            !isOpen ? classes.close_sidebar : ""
          } main_wrapper`}>
          <TopNav />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
