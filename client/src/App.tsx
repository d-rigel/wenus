import React from "react";
import "./scss/App.scss";
import store from "./store/store";
import { Provider } from "react-redux/es/exports";
import { MainLayout } from "./layout/MainLayout";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MainLayout />
      </div>
    </Provider>
  );
}

export default App;
