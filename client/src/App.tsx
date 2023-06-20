import React from "react";
import "./scss/App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import MainLayout from "./layout/MainLayout";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <MainLayout /> */}
        <MainPage />
      </div>
    </BrowserRouter>
  );
}

export default App;
