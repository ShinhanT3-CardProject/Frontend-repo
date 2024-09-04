import React, { useState } from "react";
import "asset/css/StampBoard.css";
import shoppingImage from "asset/image/shoppingImage.jpg"; // 예시 이미지
import travelImage from "asset/image/travelImage.jpg";
import dailyLifeImage from "asset/image/dailyLifeImage.jpg";
import diningImage from "asset/image/diningImage.jpg";
import cultureImage from "asset/image/cultureImage.jpg";

import shoppingIcon from "asset/image/shoppingIcon2.png";
import travelIcon from "asset/image/travelcon.png";
import lifestyleIcon from "asset/image/lifestyleIcon.png";
import diningIcon from "asset/image/diningIcon.png";
import cultureIcon from "asset/image/cultreIcon.png";

function StampBoard() {
  const themes = [
    {
      name: "쇼핑",
      color: "black",
      backgroundImage: shoppingImage,
      icon: shoppingIcon,
      missions: [
        { name: "마트에서 쇼핑" },
        { name: "전통시장 쇼핑" },
        { name: "서점에서 도서 구매" },
        { name: "가구점에서 쇼핑" },
        { name: "가전제품 구매" },
      ],
    },
    {
      name: "여행/교통",
      color: "black",
      backgroundImage: travelImage,
      icon: travelIcon,
      missions: [
        { name: "숙소 결제" },
        { name: "카페 방문" },
        { name: "주유소 방문" },
        { name: "술집 방문" },
        { name: "택시 이용" },
      ],
    },
    {
      name: "생활",
      color: "black",
      backgroundImage: dailyLifeImage,
      icon: lifestyleIcon,
      missions: [
        { name: "편의점 이용" },
        { name: "마트 방문" },
        { name: "전통시장 방문" },
        { name: "택시 이용" },
        { name: "병원 방문" },
      ],
    },
    {
      name: "외식/카페",
      color: "black",
      backgroundImage: diningImage,
      icon: diningIcon,
      missions: [
        { name: "카페 방문" },
        { name: "베이커리 방문" },
        { name: "한식당에서 식사" },
        { name: "일식당에서 식사" },
        { name: "중식당에서 식사" },
      ],
    },
    {
      name: "문화/교육",
      color: "black",
      backgroundImage: cultureImage,
      icon: cultureIcon,
      missions: [
        { name: "스터디카페 방문" },
        { name: "서점에서 도서 구입" },
        { name: "노래방 방문" },
        { name: "독서실 방문" },
        { name: "문구점에서 쇼핑" },
      ],
    },
  ];

  // 스탬프 상태 관리, 각 테마와 미션의 달성 여부를 저장
  const [stamps, setStamps] = useState({});

  // 미션 클릭하면 해당 미션의 상태를 'true'로 업데이트
  const handleStamp = (themeName, missionName) => {
    setStamps((prev) => ({
      ...prev,
      [themeName]: {
        ...prev[themeName],
        [missionName]: true,
      },
    }));
  };

  return (
    <div className="stamp-board">
      {themes.map((theme, index) => (
        <div key={index} className="theme-section">
          {/* 각 테마의 배경 이미지 표시 */}
          <img
            src={theme.backgroundImage}
            alt={`${theme.name} background`}
            className="background-image"
          />
          {/*테마 이름 표시*/}
          <h2 className="theme-header" style={{ color: theme.color }}>
            {theme.name}
          </h2>

          {/* 미션 아이콘과 이름을 표시하는 영역 */}
          <div className="theme-path">
            {theme.missions.map((mission, idx) => (
              <div
                key={idx}
                className={`mission-node ${
                  stamps[theme.name]?.[mission.name] ? "stamped" : ""
                }`}
                onClick={() => handleStamp(theme.name, mission.name)}
              >
                {/*미션 아이콘을 표시*/}
                <img
                  src={theme.icon} // 이미지 아이콘 사용
                  alt={`${theme.name} icon`}
                  className="mission-icon"
                />
                {/* <div className="mission-icon">{theme.icon}</div> */}
                {/* 미션 내용 표시 */}
                <div className="mission-name">{mission.name}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StampBoard;