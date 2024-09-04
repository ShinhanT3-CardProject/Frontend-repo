import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "component/common/NavBar";
import PanelControl from "component/common/PanelControl";
import { AuthContext } from "component/auth/AuthContext";
import "./App.css";
import Footer from "component/common/Footer";
function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [user, setUser] = useState(null); // 사용자 상태 관리
  const panelRef = useRef(null);
  const navIconRef = useRef(null); // 사이드바 아이콘 참조

  const togglePanel = (event) => {
    event.preventDefault(); // 기본 링크 동작 방지
    setIsPanelOpen((prevState) => !prevState);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  useEffect(() => {
    // 사이드바 외부 클릭
    const handleClickOutside = (event) => {
      if (
        panelRef.current && //
        !panelRef.current.contains(event.target) &&
        navIconRef.current &&
        !navIconRef.current.contains(event.target)
      ) {
        closePanel(); // 사이드바 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavBar togglePanel={togglePanel} navIconRef={navIconRef} />
      <div className="App">
        <div className="main">
          {isPanelOpen && (
            <PanelControl closePanel={closePanel} ref={panelRef} />
          )}{" "}
          {/* 사이드바 표시 여부 */}
          <div className="content">
            {/* 현재 경로에 맞는 자식 컴포넌트를 렌더링 */}
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </AuthContext.Provider>
  );
}

export default App;
