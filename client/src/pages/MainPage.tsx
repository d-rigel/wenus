import React from "react";
import MainLayout from "../layout/MainLayout";
import Article from "../components/article/Article";

const MainPage = () => {
  return (
    <MainLayout>
      <div>
        <Article />
      </div>
    </MainLayout>
  );
};

export default MainPage;
