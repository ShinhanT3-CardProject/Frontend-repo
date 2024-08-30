import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from 'component/common/NavBar';
import PanelControl from 'component/common/PanelControl';
import { AuthContext } from 'component/auth/AuthContext';
import './App.css';
import Footer from 'component/common/Footer';

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [user, setUser] = useState(null); // 사용자 상태 관리

  const togglePanel = (event) => {
    event.preventDefault(); // 기본 링크 동작 방지
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavBar togglePanel={togglePanel} />
      <div className="App">
        <div className="main">
          {isPanelOpen && <PanelControl />} {/* 사이드바 표시 여부 */}
          <div className="content">
            {/* 현재 경로에 맞는 자식 컴포넌트를 렌더링 */}
            <Outlet />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </AuthContext.Provider>
  );
}

export default App;