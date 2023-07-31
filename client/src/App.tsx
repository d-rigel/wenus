import React from "react";
import "./scss/App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticleDetails from "./pages/article-details/ArticleDetails";
import MainPage from "./pages/main-page/MainPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <MainPage /> */}
        <ArticleDetails />
      </div>
    </BrowserRouter>
  );
}

export default App;
