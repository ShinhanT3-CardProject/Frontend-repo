import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import shoppingImage from 'asset/image/shoppingImage.jpg'; // 예시 이미지
import travelImage from 'asset/image/travelImage.jpg';
import dailyLifeImage from 'asset/image/dailyLifeImage.jpg';
import diningImage from 'asset/image/diningImage.jpg';
import cultureImage from 'asset/image/cultureImage.jpg';

function MyThemeSearch(props) {
    const [myThemes, setMyThemes] = useState([]);

    const navigate = useNavigate();
    const moveToDetail = (themeId) => {
      navigate(`/myThemeDetail/${themeId}`);
    };

        //배경이미지 가져오기
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
                  console.log(response.data);
                  const myThemeArray = Object.entries(response.data).map(([id, themeData]) => ({
                    id, ...themeData
                  }))
                  setMyThemes(myThemeArray);
                })
                .catch(error => {
                  console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
                });
        }, []);
        console.log("myThemes : " + myThemes);

    return (
        <>
        <div className="faq app-pages app-section">
          <div className="container">
            <div className="themeTitleContainer">
              <h2 style={{ textAlign: "left", lineHeight: 1.5 }}>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#007FFF",
                    fontSize: "0.8em",
                  }}
                >
                  나의 테마 조회
                </span>{" "}
              </h2>
              <h4 style={{ textAlign: "left", fontSize: 15 }}>
                <Link
                  to="/themeSearchAll"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  전체 테마 조회 &gt;
                </Link>
              </h4>
            </div>
            <div className="entry">
              <ul className="collapsible theme-grid" data-collapsible="accordion">
                {myThemes.map(myTheme => (
                <li key={myTheme.themeId} onClick={() => moveToDetail(myTheme.themeId)}>
                  <div className="collapsible-header">
                    <div className='themeThumbnail'>
                    <img src={getThemeBackgroundImage(myTheme.themeBackground)} alt={myTheme.themeName} />
                    </div>
                  </div>
                  <span className='themeTitle'>{myTheme.themeName}</span>
                </li>

                ))}
              </ul>
            </div>
          </div> {/* container */}
        </div> {/* faq app-pages app-section */}
      </>
    );
}

export default MyThemeSearch;