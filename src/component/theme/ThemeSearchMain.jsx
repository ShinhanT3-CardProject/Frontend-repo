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
    const [url, setUrl] = useState('findAllTheme');
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태

    /* 페이징 영역 */

    const [firstNum, setFirstNum ] = useState(1);
    const [indexPage, setIndexPage] = useState(0);
    const [addIndex, setAddIndex] = useState(0);
    const lineCount = 10;
    const [lastIs, setLastIs] = useState(false);
    const [firstIs, setFirstIs] = useState(false);
    const lastIndex = Math.floor(totalPages/10);

    /* 페이징 영역 */

    useEffect(() => {
      axios.get(`/api/theme/${url}/${currentPage}`)
        .then(response => {
          const themeArray = Object.entries(response.data.content).map(([themeId, themeData]) => ({
            themeId, ...themeData
          }));
          setThemes(themeArray);
          setTotalPages(response.data.totalPages); // 총 페이지 수 업데이트
          if(response.data.totalPages <= 10){
            setIndexPage(response.data.totalPages);
          } else {
            setLastIs(true);
            setIndexPage(lineCount);
          }
        })
        .catch(error => {
          console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
        });

      // 페이지가 변경될 때마다 페이지 상단으로 스크롤
      window.scrollTo(0, 0);
    }, [currentPage, url]); // currentPage가 변경될 때마다 데이터 요청

    const handlePageChange = (page) => {
      setCurrentPage((indexPage*addIndex) + page);
      if(lastIndex === addIndex && page <= totalPages%10) {
        setLastIs(false);
      } else {
        setLastIs(true);
      }

      console.log("handlePageChange -> page : ", page);
      console.log("addIndex : ",addIndex);
      console.log("indexPage : ",indexPage);
      console.log("addIndex*indexPage : ", addIndex*indexPage);
      console.log("currentPage : ",currentPage);
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
      setAddIndex(0);
        if(selectedCategory === category) {
          setSelectedCategory(null);
        } else {
          setSelectedCategory(category);
          setSearchKeyword(null);
          setUrl('findByCategoryId/' + category);
          setFirstNum(1);
          setFirstIs(false);
          setCurrentPage(1);
        }
    };

    const handleSearchClick = () => {
        setAddIndex(0);
        if(searchKeyword.length < 2) {
          alert("검색어는 2글자 이상이어야 합니다.");
          return;
        } else {
          setUrl('search/' + searchKeyword);
          setFirstNum(1);
          setFirstIs(false);
          setCurrentPage(1);
        }
    };

    /* 페이징 영역 */
    
    const handlePrevRange = () => {
      setAddIndex(addIndex-1);
      console.log("prev");
      setFirstNum(firstNum - lineCount);
      setIndexPage(lineCount);
      setLastIs(true);
      if ((firstNum - lineCount) === 1) {
        setFirstIs(false);
      } else {
        setFirstIs(true);
      }
    }
    
    const handleNextRange = () => {
      setAddIndex(addIndex+1);
      console.log("Next");
      setFirstNum(firstNum + lineCount);
      setFirstIs(true);
      if(firstNum + lineCount + 9 > totalPages) {
        setLastIs(false);
        setIndexPage(totalPages%lineCount);
      } else if(firstNum + lineCount + 9 === totalPages) {
        setLastIs(false);
        setIndexPage(10);
      } else {
        setLastIs(true);
        setIndexPage(10);
      }

    }

    console.log("addIndex : ", addIndex);
    console.log("totalPages", totalPages);
    console.log("lastIndex : ", lastIndex);

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
                <input 
                  type = 'text' 
                  placeholder = '검색어를 입력해주세요.' 
                  value={searchKeyword} 
                  onChange={(e) => setSearchKeyword(e.target.value)} 
                />
                <button onClick={handleSearchClick}>검색</button>
            </div>
            {/* 분류 영역 */}
            <div className='category-container'>
                <span>분류</span>
                <button onClick={() => handleCategoryClick(1)}>생활</button>
                <button onClick={() => handleCategoryClick(2)}>쇼핑</button>
                <button onClick={() => handleCategoryClick(3)}>외식/카페</button>
                <button onClick={() => handleCategoryClick(4)}>문화/교육</button>
                <button onClick={() => handleCategoryClick(5)}>여행/교통</button>
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
          <div className="pageBox">
          {
            firstIs && <button className='pageArrow' onClick={() => handlePrevRange()}>&lt;&lt;</button>
          }
          <div className='paginationContainer'>
            {/* 페이지 내비게이션 */}

            {Array.from({ length: (totalPages - firstNum + 1) < 10 ? (totalPages - firstNum + 1) : 10 }, (_, index) => (
              <button className='pageBtn' key={index + 1} onClick={() => handlePageChange(index + 1)}>
                {firstNum + index}
              </button>
            ))}


          </div>
          {
            lastIs && <button className='pageArrow' onClick={() => handleNextRange()}>&gt;&gt;</button>
          }
          </div>
          
        </div> {/* container */}
      </div> {/* faq app-pages app-section */}
    </>
    );
}

export default ThemeSearchMain;