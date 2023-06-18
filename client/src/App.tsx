import React from "react";
import "./scss/App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MainLayout />
      </div>
    </BrowserRouter>
  );
}

export default App;
