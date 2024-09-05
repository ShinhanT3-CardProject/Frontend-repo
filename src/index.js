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
import LoadingGame from "component/theme/LoadingGame";

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
    <Routes>
      <Route path="/" element={<App />}>
        {/* 인증이 필요 없는 페이지들 */}
        <Route index element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/registration" element={<Registration />} />

        {/* 인증이 필요한 페이지들 */}
        <Route path="/point" element={<RequireAuth><PointMain /></RequireAuth>} />
        <Route path="/point/transfer" element={<RequireAuth><PointTransfer /></RequireAuth>} />
        <Route path="/point/transfer/complete" element={<RequireAuth><TransferComplete /></RequireAuth>} />

        {/* 쿠폰 */}
        <Route path="/coupon" element={<RequireAuth><CouponMain /></RequireAuth>} />

        {/* 카드 */}
        <Route path="/cardList" element={<RequireAuth><CardList /></RequireAuth>} />
        <Route path="/cardUsage" element={<RequireAuth><CardUsageHistory /></RequireAuth>} />
        <Route path="/cardRecommend" element={<RequireAuth><CardRecommend /></RequireAuth>} />

        {/* 레이드 */}
        <Route path="/raidHistory" element={<RequireAuth><RaidHistory /></RequireAuth>} />
        <Route path="/raidBattle/:raidId" element={<RequireAuth><RaidBattle /></RequireAuth>} />
        <Route path="/SearchRaid" element={<RequireAuth><SearchRaid /></RequireAuth>} />

        {/* 테마 */}
        <Route path="/themeSearchAll" element={<RequireAuth><ThemeSearchMain /></RequireAuth>} />
        <Route path="/myThemeSearch" element={<RequireAuth><MyThemeSearch /></RequireAuth>} />
        <Route path="/themeDetail/:themeId" element={<RequireAuth><ThemeDetail /></RequireAuth>} />
        <Route path="/myThemeDetail/:themeId" element={<RequireAuth><MyThemeDetail /></RequireAuth>} />
        <Route path="/themeRegister" element={<RequireAuth><ThemeRegister /></RequireAuth>} />
        <Route path="/startBucket" element={<RequireAuth><BucketListStart /></RequireAuth>} />
        <Route path="/bucketlist" element={<RequireAuth><ThemeBucketList /></RequireAuth>} />
        <Route path="/analyzetheme" element={<RequireAuth><ThemeAnalyzeResult /></RequireAuth>} />
        <Route path="/loadingGame" element={<RequireAuth><LoadingGame /></RequireAuth>} />
        <Route path="/stamp" element={<RequireAuth><StampBoard /></RequireAuth>} />
      </Route>
    </Routes>
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
