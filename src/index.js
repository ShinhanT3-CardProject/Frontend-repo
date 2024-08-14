import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "App";

import "asset/css/font-awesome.min.css";
import "asset/css/materialize.min.css";
import "asset/css/slick.css";
import "asset/css/slick-theme.css";
import "asset/css/owl.carousel.css";
import "asset/css/owl.theme.css";
import "asset/css/owl.transitions.css";
import "asset/css/lightbox.min.css";
import "asset/css/style.css";
import PointTransfer from "component/point/PointTransfer";
import PointMain from "component/point/PointMain";
import Navbar from "component/common/NavBar";
import Footer from "component/common/Footer";
import PanelControl from "component/common/PanelControl";
import NavBar from "component/common/NavBar";
import Home from "component/common/Home";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* 메인 */}
          <Route index element={<Home />} />
          {/* 포인트 */}
          <Route path="/point" element={<PointMain />} />
          <Route path="/transfer" element={<PointTransfer />} />
          {/* 라우터 추가 */}
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
