import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// 외부 라이브라리 및 프레임워크
import "materialize-css/dist/css/materialize.min.css";
import "asset/css/font-awesome.min.css";
import "asset/css/slick.css";
import "asset/css/slick-theme.css";
import "asset/css/owl.carousel.css";
import "asset/css/owl.theme.css";
import "asset/css/owl.transitions.css";
import "asset/css/lightbox.min.css";
import "asset/css/style.css";
import "asset/css/theme.css"; /** 테마 메뉴 통합 css 추가 */

// 컴포넌트
import App from "App";
import PointTransfer from "component/point/PointTransfer";
import PointMain from "component/point/PointMain";
import Home from "component/common/Home";
import ThemeSearchMain from "component/theme/ThemeSearchMain";
import MyThemeSearch from "component/theme/MyThemeSearch";
import ThemeDetail from "component/theme/ThemeDetail";
import MyThemeDetail from "component/theme/MyThemeDetail";
import ThemeRegister from "component/theme/ThemeRegister";
import TransferComplete from "component/point/TransferComplete";
import CouponMain from "component/coupon/CouponMain";
import CardList from "component/card/CardList";
import CardUsageHistory from "component/card/CardUsageHistory";
import Login from "component/auth/Login";
import Registration from "component/auth/Registration";
import RaidBattle from "component/raid/RaidBattle";
import ThemeBucketList from "component/theme/ThemeBucketList";
import ThemeAnalyzeResult from "component/theme/ThemeAnalyzeResult";
import StampBoard from "component/theme/StampBoard";
import RaidHistory from "component/raid/RaidHistory";
import BucketListStart from "component/theme/BucketListStart";
import CardRecommend from "component/card/CardRecommend";
import SearchRaid from "component/raid/SearchRaid";

const root = ReactDOM.createRoot(document.getElementById("root"));

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = sessionStorage.getItem('user'); // 세션에서 'user' 키 확인
    if (!user) {
      navigate('/auth/login'); // 로그인 정보가 없으면 로그인 페이지로 리디렉션
    }
  }, [navigate]);

  return children;
};

const AppWrapper = () => {
  return (
    <RequireAuth>
      <Routes>
        <Route path="/" element={<App />}>
          {/* 메인 */}
          <Route index element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/registration" element={<Registration />} />
          
          {/* 포인트 */}
          <Route path="/point" element={<PointMain />} />
          <Route path="/point/transfer" element={<PointTransfer />} />
          <Route path="/point/transfer/complete" element={<TransferComplete />} />

          {/* 쿠폰 */}
          <Route path="/coupon" element={<CouponMain />} />

          {/* 카드 */}
          <Route path="/cardList" element={<CardList />} />
          <Route path="/cardUsage" element={<CardUsageHistory />} />
          <Route path="/cardRecommend" element={<CardRecommend />} />

          {/* 레이드 */}
          <Route path="/raidHistory" element={<RaidHistory />} />
          <Route path="/raidBattle/:raidId" element={<RaidBattle />} />
          <Route path="/SearchRaid" element={<SearchRaid />} />

          {/* 테마 */}
          <Route path="/themeSearchAll" element={<ThemeSearchMain />} />
          <Route path="/myThemeSearch" element={<MyThemeSearch />} />
          <Route path="/themeDetail/:themeId" element={<ThemeDetail />} />
          <Route path="/myThemeDetail/:themeId" element={<MyThemeDetail />} />
          <Route path="/themeRegister" element={<ThemeRegister />} />
          <Route path="/startBucket" element={<BucketListStart />} />
          <Route path="/bucketlist" element={<ThemeBucketList />} />
          <Route path="/analyzetheme" element={<ThemeAnalyzeResult />} />
          <Route path="/stamp" element={<StampBoard />} />
        </Route>
      </Routes>
    </RequireAuth>
  );
};

root.render(
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
