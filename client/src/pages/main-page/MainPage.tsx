import React from "react";
import MainLayout from "../../layout/MainLayout";
import Article from "../../components/article/Article";
import classes from "./MainPage.module.scss";

const MainPage = () => {
  return (
    <MainLayout>
      <div className={classes.ar__container}>
        <Article />
        <Article />
        <Article />
        <Article />
        <Article />
        <Article />
        <Article />
        <Article />
      </div>
    </MainLayout>
  );
};

export default MainPage;
