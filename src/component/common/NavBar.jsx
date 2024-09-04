import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import LoginImg from "asset/image/login.png";
import LogoutImg from "asset/image/logout.png";
import axios from "axios";
import "asset/css/nav.css";

// NavBar 컴포넌트는 상단 네비게이션 바를 렌더링합니다.
function NavBar({ togglePanel, navIconRef }) {
  // AuthContext에서 user와 setUser 함수를 가져옵니다.
  const { user, setUser } = useContext(AuthContext);

  // 로그아웃 버튼을 클릭했을 때 호출되는 함수
  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청을 보냅니다.
      const response = await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        // 로그아웃이 성공하면, 클라이언트 측에서 사용자 정보를 초기화합니다.
        setUser(null);
        sessionStorage.removeItem("user"); // 세션 스토리지에서 사용자 정보 제거
      } else {
        console.error("로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="panel-control-left">
          {/* 패널을 열기 위한 아이콘 */}
          <a
            href="#"
            onClick={togglePanel}
            ref={navIconRef}
            className="sidenav-control"
          >
            <i className="fa fa-align-left"></i>
          </a>
        </div>
        <div className="site-title">
          {/* 메인 페이지로 이동하기 위한 로고 */}
          <Link to="/" className="logo">
            <div className="soloplay-logo-container">
              <h1 className="soloplay-text">SOLoPLAY</h1>
            </div>
          </Link>
        </div>
        <div className="panel-control-right">
          {/* 로그인 여부에 따라 로그인/로그아웃 아이콘 표시 */}
          {user ? (
            <div className="user-controls">
              {/* 로그아웃 아이콘을 클릭하면 로그아웃 처리 */}
              <img
                src={LogoutImg}
                alt="Logout"
                className="logout-icon"
                onClick={handleLogout}
              />
            </div>
          ) : (
            <Link to="/auth/login" className="user-icon">
              {/* 로그인 페이지로 이동 */}
              <img src={LoginImg} alt="Login" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
