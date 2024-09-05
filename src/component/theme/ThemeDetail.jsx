import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import shoppingImage from 'asset/image/shoppingImage.jpg'; // 예시 이미지
import travelImage from 'asset/image/travelImage.jpg';
import dailyLifeImage from 'asset/image/dailyLifeImage.jpg';
import diningImage from 'asset/image/diningImage.jpg';
import cultureImage from 'asset/image/cultureImage.jpg';

import shoppingIcon from "asset/image/shoppingIcon2.png";
import travelIcon from "asset/image/travelcon.png";
import lifestyleIcon from "asset/image/lifestyleIcon.png";
import diningIcon from "asset/image/diningIcon.png";
import cultureIcon from "asset/image/cultreIcon.png";

function ThemeDetail(props) {
    const [detailTheme, setDetailTheme] = useState('');
    const { themeId } = useParams();

    const [stamps, setStamps]  = useState({}); /* 스탬프 변수 */
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`/api/theme/findThemeDetail/${themeId}`)
                .then(response => {
                    setDetailTheme(response.data);
                })
                .catch(error => {
                    console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
                });
    }, [themeId]);

    console.log(detailTheme);

    console.log('Theme ID: ', themeId);

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

        if(!detailTheme) {
            return <div>잠시만 기다려 주세요</div>;
        }
        /* 스탬프 변수 */
        const getStampImage = (stampImage) => {
            switch (stampImage) {
            case '쇼핑':
                return shoppingIcon;
            case '여행/교통':
                return travelIcon;
            case '생활':
                return lifestyleIcon;
            case '외식/카페':
                return diningIcon;
            case '문화/교육':
                return cultureIcon;
            default:
                return null;

            }
        };

        /* 문구 가변으로 가져오기 */
        const getMissionNameDetail = (missionNameDetail) => {
            switch (missionNameDetail) {
                case '편의점':
                    return '이용하기';
                case '마트':
                    return '이용하기';
                case '전통시장':
                    return '이용하기';
                case '택시':
                    return '이용하기';
                case '병원':
                  return '이용하기';
                case '세탁소':
                  return '이용하기';
                case '약국':
                  return '이용하기';
                case '헤어샵':
                  return '이용하기';
                case '서점':
                  return '이용하기';
                case '가구점':
                  return '이용하기';
                case '가전제품':
                  return '이용하기';
                case '백화점':
                    return '이용하기';
                case '의류/패션':
                    return '이용하기';
                case '스포츠용품':
                    return '이용하기';
                case '카페':
                    return '이용하기';
                case '양식':
                  return '이용하기';
                case '베이커리':
                  return '이용하기';
                case '한식':
                  return '이용하기';
                case '일식':
                  return '이용하기';
                case '중식':
                  return '이용하기';
                case '패스트푸드':
                  return '이용하기';
                case '술집':
                  return '이용하기';
                case '영화/공연':
                    return '이용하기';
                case '스터디카페':
                    return '이용하기';
                case '노래방':
                    return '이용하기';
                case '독서실':
                    return '이용하기';
                case '문구점':
                  return '이용하기';
                case '스포츠시설':
                  return '이용하기';
                case '취미/오락':
                  return '이용하기';
                case '학원':
                  return '이용하기';
                case '면세점':
                  return '이용하기';
                case '숙소':
                  return '이용하기';
                case '여행사':
                  return '이용하기';
                case '주유소':
                  return '이용하기';
                case '주차장':
                  return '이용하기';
                default: return null;
            }
        };

        /*테마 가져오기 */
        const handleRegister = () => {
            if(window.confirm("테마를 가져오시겠습니까?")){
                navigate('/themeRegister', {
                    state: {
                        theme: detailTheme.themeContents.map(content => content.themeSubCategoryName).join(", "),
                        reason: detailTheme.themeDescription,
                        mainCategory: detailTheme.themeMainCategoryName
                    }
                });
            }else{

            }
        }

        const themeContents = detailTheme.themeContents;

        const themes = [
            {
              name: detailTheme.themeName,
              color: "black",
              icon: getStampImage(detailTheme.themeMainCategoryName),
              missions: [
                  { name: `${themeContents[0].themeSubCategoryName} ${getMissionNameDetail(themeContents[0].themeSubCategoryName)}` },
                  { name: `${themeContents[1].themeSubCategoryName} ${getMissionNameDetail(themeContents[1].themeSubCategoryName)}` },
                  { name: `${themeContents[2].themeSubCategoryName} ${getMissionNameDetail(themeContents[2].themeSubCategoryName)}` },
                  { name: `${themeContents[3].themeSubCategoryName} ${getMissionNameDetail(themeContents[3].themeSubCategoryName)}` },
                  { name: `${themeContents[4].themeSubCategoryName} ${getMissionNameDetail(themeContents[4].themeSubCategoryName)}` },
            ],
            },];

            console.log('themes')
            console.log(themes)

            const handleStamp = (themeName, missionName) => {
                setStamps((prev) => ({
                ...prev,
                [themeName]: {
                    ...prev[themeName],
                    [missionName]: true,
                },
                }));
            };
            /* 스탬프 변수 */

    return (
        <>
        <div className="faq app-pages app-section">
            <div className="container">
                <div className='themeDetailTitleContainer'>
                <h2 style={{ textAlign: "left", lineHeight: 1.5 }}>
                        <span
                        style={{
                            fontWeight: "bold",
                            color: "#007FFF",
                            fontSize: "0.8em",
                        }}
                        >
                        테마 상세조회
                        </span>{" "}
                    </h2>
                </div>
                    {/* 스탬프 영역 */}
                <div className='themeBackgroundImg'>
                    {themes.map((theme, index) => (
                        <div key={index} className='theme-selection'>
                            <img src={getThemeBackgroundImage(detailTheme.themeBackground)} 
                            alt={detailTheme.themeName} className="background-image"/>
                            {/**/}
                            <div className='theme-path'>
                                {theme.missions.map((mission, index) => (
                                    <div key={index} className={`mission-node ${
                                        stamps[theme.name]?.[mission.name] ? "stapmed" : ""
                                    }`}
                                    onClick = {() => handleStamp(theme.name, mission.name)}>
                                    <img src={theme.icon} alt={`${theme.name} icon`} className='mission-icon' />
                                    <div className='mission-name'>{mission.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                    {/* 스탬프 영역 */}
                <div className='themeInfoContainer'>
                    <div className='themeNameContainer'>
                        <span>테마명</span>
                        <p>{detailTheme.themeName}</p>
                    </div>
                    <div className='themeCategoryContainer'>
                        <span>대분류</span>
                        <p>{detailTheme.themeMainCategoryName}</p>
                    </div>
                    <div className='themeSubCategoryContainer'>
                        <span>소분류</span>
                        <p>
                            {Array.isArray(detailTheme.themeContents) 
                                ? detailTheme.themeContents.map(content => content.themeSubCategoryName).join(", ")
                                : ''
                            }
                        </p>
                    </div>
                </div>
                <div className='themeContentDiv'>
                <span>테마 설명</span>
                </div>
                <div className='themeContentContainer'>
                    <p>{detailTheme.themeDescription}</p>
                </div>
                <div className='themeBottomBtnDiv'>
                    <Link to={'/themeSearchAll'}>
                    <button className='moveThemeListBtn'>목록보기</button>
                    </Link>
                    <button className='bringThemeBtn' onClick={handleRegister}>테마 가져오기</button>
                </div>

            </div> {/* container */}
        </div> {/* faq app-pages app-section */}
        </>
    );
}

export default ThemeDetail;