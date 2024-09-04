import "asset/css/home.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import cultureImage from 'asset/image/cultureImage.jpg';
import dailyLifeImage from 'asset/image/dailyLifeImage.jpg';
import diningImage from 'asset/image/diningImage.jpg';
import shoppingImage from 'asset/image/shoppingImage.jpg';
import travelImage from 'asset/image/travelImage.jpg';
import ThemeList from "component/theme/ThemeList";
import SearchRaid from "component/raid/SearchRaid";

import cardIcon from "asset/image/cardIcon.png";


function Home() {
  const navigate = useNavigate();


  const [themes, setThemes] = useState([]);

  const moveToDetail = (themeId) => {
    navigate(`/themeDetail/${themeId}`);
};


const getThemeBackgroundImage = (themeBackground) => {
  switch (themeBackground) {
      case 'shoppingImage':
          return shoppingImage;
      case 'travelImage':
          return travelImage;
      case 'dailyLifeImage':
          return dailyLifeImage;
      case 'diningImage':
          return diningImage;
      case 'cultureImage':
          return cultureImage;
      default:
          return null;
  }
};

  useEffect(() => {
    axios.get('/api/theme/findMyTheme')
        .then(response => {
            const themeArray = Object.entries(response.data).map(([id, themeData]) => ({
                id, ...themeData
            }));
            setThemes(themeArray);
        })
        .catch(error => {
            console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
        });
}, []);

function cardClick() {
  navigate(`/cardList`);
}

  return (
    <div>
      <ThemeList 
          themes={themes} 
          moveToDetail={moveToDetail} 
          getThemeBackgroundImage={getThemeBackgroundImage} 
      />

      <h6 className="main-sub-title">[ 레이드 검색 ]</h6>
      <SearchRaid></SearchRaid>

      <h6 className="main-sub-title">[ 카드 혜택 Check! ]</h6>
      <div onClick={() => cardClick()} className="card-wrapper">
        <img src={cardIcon} className="main-card-icon"></img>
        <span className="card-comment">다채로운 신한카드의 혜택⭐ <br/> 지금 확인해보세요!! </span>
      </div>

    </div>
  );
}

export default Home;