import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import shoppingImage from 'asset/image/shoppingImage.jpg'; // 예시 이미지
import travelImage from 'asset/image/travelImage.jpg';
import dailyLifeImage from 'asset/image/dailyLifeImage.jpg';
import diningImage from 'asset/image/diningImage.jpg';
import cultureImage from 'asset/image/cultureImage.jpg';

function ThemeSearchResult(props) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [themes, setThemes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태

    useEffect(() => {
      axios.get(`/theme/findAllTheme/${currentPage}`)
        .then(response => {
          const themeArray = Object.entries(response.data.content).map(([themeId, themeData]) => ({
            themeId, ...themeData
          }));
          setThemes(themeArray);
          setTotalPages(response.data.totalPages); // 총 페이지 수 업데이트
        })
        .catch(error => {
          console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
        });

      // 페이지가 변경될 때마다 페이지 상단으로 스크롤
      window.scrollTo(0, 0);
    }, [currentPage]); // currentPage가 변경될 때마다 데이터 요청

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

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

    const handleCategoryClick = (category) => {
        if(selectedCategory === category) {
          setSelectedCategory(null)
        } else {
          setSelectedCategory(category);
        }
    };

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
                <button>검색</button>
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
                {themes.map(theme => (
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
          <div>
            {/* 페이지 내비게이션 */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div> {/* container */}
      </div> {/* faq app-pages app-section */}
    </>
    );
}

export default ThemeSearchResult;