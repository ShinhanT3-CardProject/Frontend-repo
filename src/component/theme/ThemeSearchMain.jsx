import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import shoppingImage from 'asset/image/shoppingImage.jpg'; // 예시 이미지
import travelImage from 'asset/image/travelImage.jpg';
import dailyLifeImage from 'asset/image/dailyLifeImage.jpg';
import diningImage from 'asset/image/diningImage.jpg';
import cultureImage from 'asset/image/cultureImage.jpg';

function ThemeSearchMain(props) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [themes, setThemes] = useState([]);

    const navigate = useNavigate();
    const moveToDetail = (themeId) => {
      navigate(`/themeDetail/${themeId}`);
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

    const handleFilterSearch = themes.filter(theme => {
      const nameSearch = searchKeyword.toLowerCase();
      const keywordSearch = nameSearch === '' || 
            theme.themeName.toLowerCase().includes(nameSearch) || 
            theme.themeMainCategoryName.toLowerCase().includes(searchKeyword.toLowerCase());
      
      const categorySearch = selectedCategory === null || theme.themeMainCategoryName.toLowerCase().includes(selectedCategory.toLowerCase());

      return keywordSearch && categorySearch;
    });
      

    const handleCategoryClick = (category) => {
        if(selectedCategory === category) {
          setSelectedCategory(null)
        } else {
          setSelectedCategory(category);
        }
    };

    //백엔드 데이터 가져오기
    useEffect(() => {
      axios.get('/theme/findAllTheme')
           .then(response => {
            const themeArray = Object.entries(response.data).map(([themeId, themeData]) => ({
              themeId, ...themeData
            }));
            setThemes(themeArray);
           })
           .catch(error => {
            console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
           });
    }, []);

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
                전체 테마 조회
              </span>{" "}
            </h2>
            <h4 style={{ textAlign: "left", fontSize: 15 }}>
              <Link
                to="/MythemeSearch"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                나의 테마 조회 &gt;
              </Link>
            </h4>
        </div>

        <div className="themeSearchContainer">
            {/* 검색 영역 */}
            <div className='search-container'>
                <span>검색</span>
                <input type = 'text' placeholder = '검색어를 입력해주세요.' value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
            {/* <button onClick={handleFilterSearch}>검색</button> */}
            </div>
            {/* 분류 영역 */}
            <div className='category-container'>
                <span>분류</span>
                <button onClick={() => handleCategoryClick('생활')}>생활</button>
                <button onClick={() => handleCategoryClick('쇼핑')}>쇼핑</button>
                <button onClick={() => handleCategoryClick('외식/카페')}>외식/카페</button>
                <button onClick={() => handleCategoryClick('문화/교육')}>문화/교육</button>
                <button onClick={() => handleCategoryClick('여행/교통')}>여행/교통</button>
            </div>
          </div>
          <div className="entry">
            <ul className="collapsible theme-grid" data-collapsible="accordion">
                {handleFilterSearch.map(theme => (
                  <li key={theme.themeId} onClick={() => moveToDetail(theme.themeId)}>
                    <div className="collapsible-header">
                      <div className='themeThumbnail'>
                        <img src={getThemeBackgroundImage(theme.themeBackground)} alt={theme.themeName} />
                      </div>
                    </div>
                    <span className='themeTitle'>{theme.themeName}</span>
                  </li>

                ))}
            </ul>
          </div>
        </div> {/* container */}
      </div> {/* faq app-pages app-section */}
    </>
    );
}

export default ThemeSearchMain;