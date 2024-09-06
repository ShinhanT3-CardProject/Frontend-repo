import React, { forwardRef, useEffect, useState } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import { Link } from "react-router-dom";

// PanelControl 컴포넌트는 사이드바를 렌더링합니다.
const PanelControl = forwardRef(({ closePanel }, ref) => {
  const [userId, setUserId] = useState(null); // 사용자 ID를 저장할 상태 변수

  useEffect(() => {
    // MaterializeCSS의 사이드바를 초기화합니다.
    const sidenavElems = document.querySelectorAll("#slide-out-left");
    M.Sidenav.init(sidenavElems);

    // 모든 .collapsible 요소를 초기화합니다.
    const collapsibleElems = document.querySelectorAll(".collapsible");
    M.Collapsible.init(collapsibleElems);

    // 세션 스토리지에서 사용자 정보를 가져옵니다.
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser); // JSON 문자열을 객체로 변환
      setUserId(user.userId); // 사용자 ID 설정
    }
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행됩니다.

  const handleClickInside = (event) => {
    event.stopPropagation(); // 클릭 이벤트 전파를 막습니다.
  };

  return (
    <div
      className="panel-control-left"
      ref={ref} // 전달된 ref를 div에 바인딩
      style={{ position: "fixed", zIndex: 5, marginTop: "-10px" }}
      onClick={handleClickInside}
    >
      <ul
        id="slide-out-left"
        className="side-nav collapsible"
        data-collapsible="accordion"
      >
        <li>
          <div className="photos">
            {/* 로그인된 사용자가 있으면 userId를, 없으면 "Guest"를 표시 */}
            <h3>{userId ? userId : "Guest"}</h3>
          </div>
        </li>
        <li className="first-list">
          {/* 카드 관리 섹션 */}
          <div
            className="collapsible-header"
            style={{ borderBottom: "none", padding: "1.5rem" }}
          >
            <i className="fa fa-credit-card"></i>카드관리
          </div>
          <div className="collapsible-body" style={{ borderBottom: "none" }}>
            <ul className="side-nav-panel">
              <li>
                <Link to="/cardList" onClick={closePanel}>
                  카드 조회
                </Link>
              </li>
              <li>
                <Link to="/cardUsage" onClick={closePanel}>
                  카드 사용 내역
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li>
          {/* 테마 관련 섹션 */}
          <div
            className="collapsible-header"
            style={{ borderBottom: "none", padding: "1.5rem" }}
          >
            <i className="fa fa-users"></i>SOL로 플레이
          </div>
          <div className="collapsible-body" style={{ borderBottom: "none" }}>
            <ul className="side-nav-panel">
              <li>
                <Link to="/themeSearchAll" onClick={closePanel}>
                  테마 조회
                </Link>
              </li>
              <li>
                <Link to="/startBucket" onClick={closePanel}>
                  테마 추천 받기
                </Link>
              </li>
              <li>
                <Link to="/themeRegister" onClick={closePanel}>
                  테마 등록
                </Link>
              </li>
              <li>
                <Link to="/SearchRaid" onClick={closePanel}>
                  레이드 조회
                </Link>
              </li>
              <li>
                <Link to="/raidHistory" onClick={closePanel}>
                  레이드 내역 조회
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li>
          {/* 리워드 관리 섹션 */}
          <div
            className="collapsible-header"
            style={{ borderBottom: "none", padding: "1.5rem" }}
          >
            <i className="fa fa-krw"></i>리워드 관리
          </div>
          <div className="collapsible-body" style={{ borderBottom: "none" }}>
            <ul className="side-nav-panel">
              <li>
                <Link to="/point" onClick={closePanel}>
                  포인트 관리
                </Link>
              </li>
              <li>
                <Link to="/coupon" onClick={closePanel}>
                  쿠폰 관리
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li>{/* 이벤트 섹션 (현재 주석 처리되어 있음) */}</li>
      </ul>
    </div>
  );
});

export default PanelControl;
