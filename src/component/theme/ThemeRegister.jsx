import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import shoppingIcon from "asset/image/shoppingIcon2.png";
import travelIcon from "asset/image/travelcon.png";
import lifestyleIcon from "asset/image/lifestyleIcon.png";
import diningIcon from "asset/image/diningIcon.png";
import cultureIcon from "asset/image/cultreIcon.png";
import Swal from 'sweetalert2';

function ThemeRegister(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const receivedTheme = location.state?.theme || "";  // 소분류 테마를 받음
    const receivedReason = location.state?.reason || "";  // 테마 선정 이유를 받음
    const receivedMainCategory = location.state?.mainCategory || "";  // 추천받은 대분류 테마를 받음

    const [stamps, setStamps]  = useState({}); /* 스탬프 변수 */

    const themeImages = {
        "생활": require('../../asset/image/dailyLifeImage.jpg'),
        "쇼핑": require('../../asset/image/shoppingImage.jpg'),
        "외식/카페": require('../../asset/image/diningImage.jpg'),
        "문화/교육": require('../../asset/image/cultureImage.jpg'),
        "여행/교통": require('../../asset/image/travelImage.jpg')
    };

    const [selectedThemes, setSelectedThemes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [themeName, setThemeName] = useState("");
    const [themeContent, setThemeContent] = useState(receivedReason);
    const [backgroundImg, setBackgroundImg] = useState(receivedMainCategory ? themeImages[receivedMainCategory] : null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesResponse = await axios.get('/api/categories');
                setCategories(categoriesResponse.data);

                if (receivedMainCategory) {
                    const category = categoriesResponse.data.find(cat => cat.themeMainCategoryName === receivedMainCategory);
                    if (category) {
                        setSelectedCategory(category.themeMainCategoryId);
                        fetchSubCategories(category.themeMainCategoryId);

                        // 초기 로딩 시 receivedTheme 반영
                        const themeSubCategories = category.subCategories.filter(sub => 
                            receivedTheme.split(", ").includes(sub.themeSubCategoryName)
                        );
                        setSelectedThemes(themeSubCategories);

                        setBackgroundImg(themeImages[receivedMainCategory]);  // 초기 로딩 시 이미지 설정
                    }
                }
            } catch (error) {
                console.error('대분류 데이터를 불러오는데 실패했습니다 : ', error);
            }
        };

        fetchCategories();
    }, []);

    const fetchSubCategories = async (mainCategoryId) => {
        try {
            const subCategoriesResponse = await axios.get(`/api/categories/${mainCategoryId}/subcategories`);
            setSubCategories(subCategoriesResponse.data);

            // 만약 receivedTheme이 있을 경우 subCategories와 매칭
            const themeSubCategories = subCategoriesResponse.data.filter(sub => 
                receivedTheme.split(", ").includes(sub.themeSubCategoryName)
            );
            setSelectedThemes(themeSubCategories);
        } catch (error) {
            console.error('소분류 데이터를 불러오는데 실패했습니다 : ', error);
        }
    };

    const handleCategoryChange = (event) => {
        const newCategoryId = event.target.value;
        const newMainCategory = categories.find(cat => cat.themeMainCategoryId === parseInt(newCategoryId))?.themeMainCategoryName;

        if (newMainCategory) {
            setBackgroundImg(themeImages[newMainCategory]);
        }
        setSelectedCategory(newCategoryId);
        setSubCategories([]);
        setSelectedThemes([]);
        fetchSubCategories(newCategoryId);
    };

    const handleSubCategorySelect = (event) => {
        const selectedSubCategory = subCategories.find(sub => sub.themeSubCategoryName === event.target.value);

        if (selectedSubCategory && !selectedThemes.some(theme => theme.themeSubCategoryName === selectedSubCategory.themeSubCategoryName)) {
            if (selectedThemes.length < 5) {
                setSelectedThemes([...selectedThemes, selectedSubCategory]);
            } else {
                alert('선택할 수 있는 테마는 최대 5개까지 입니다.');
            }
        }
    };

    const handleThemeNameChange = (event) => {
        setThemeName(event.target.value);
    };

    const handleThemeContentChange = (event) => {
        setThemeContent(event.target.value);
    };

    const handleRemoveThemes = (index) => {
        const updateThemes = selectedThemes.filter((_, i) => i !== index);
        setSelectedThemes(updateThemes);
    };

    const handleRegister = async () => {
        
        const themeData = {
            themeName: themeName,
            themeDescription: themeContent,
            themeIsActivated: false,
            themeIsPublic: false,
            subCategory: selectedThemes.map(theme => ({
                themeSubCategoryId: theme.themeSubCategoryId
            })),
            mainCategory: { "themeMainCategoryId": selectedCategory }
        };
        console.log(themeData);
        try {
            // 먼저 테마 개수 확인
            const themeCountResponse = await axios.get('/api/categories/themeCount');
            const themeCount = themeCountResponse.data;

            if (themeCount >= 3) {
                alert('테마는 최대 3개 까지 등록 가능합니다.');
                return;  // 등록 중단
            }

            // 테마 등록 진행
            const themeData = {
                themeName: themeName,
                themeDescription: themeContent,
                themeIsActivated: false,
                themeIsPublic: true,
                subCategory: selectedThemes.map(theme => ({
                    themeSubCategoryId: theme.themeSubCategoryId
                })),
                mainCategory: { "themeMainCategoryId": selectedCategory }
            };
            console.log(themeData);
                Swal.fire({
                    title: '테마를 등록하시겠습니까?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'green',
                    cancelButtonColor: 'red',
                    confirmButtonText: '등록',
                    cancelButtonText: '취소',
                    reverseButtons: false, // 버튼 순서 거꾸로
                    
                  }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post('/api/theme/insertTheme', themeData)
                          .then(response => {
                            navigate('/myThemeSearch');
                          })
                          .catch(error => {
                            console.error("테마 등록 중 오류가 발생했습니다.", error);
                          });
                      Swal.fire(
                        '테마가 성공적으로 등록되었습니다!',
                        'success'
                      )
                    }
                  }); 
        } catch (error) {
            console.error('테마 등록 중 오류가 발생했습니다: ', error);
            alert('테마 등록 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        if (selectedThemes.length > 0) {
            const mainCategoryCounts = selectedThemes.reduce((acc, curr) => {
                acc[curr.themeMainCategoryName] = (acc[curr.themeMainCategoryName] || 0) + 1;
                return acc;
            }, {});

            const mostSelectedMainCategory = Object.keys(mainCategoryCounts).reduce((a, b) =>
                mainCategoryCounts[a] > mainCategoryCounts[b] ? a : b
            );
            setBackgroundImg(themeImages[mostSelectedMainCategory]);
        } else if (receivedMainCategory && selectedCategory === "") {
            setBackgroundImg(themeImages[receivedMainCategory]);
        } else if (selectedThemes.length === 0) {
            setBackgroundImg(null);
        }
    }, [selectedThemes, receivedMainCategory, themeImages, selectedCategory]);


    /* 스템프 영역 */

    //배경이미지 가져오기 (조회용)
    const getThemeBackgroundImage = (themeBackground) => {
        switch (themeBackground) {
            case 'shoppingImage':
            return themeImages.쇼핑;
            case 'travelImage':
            return themeImages['여행/교통'];
            case 'dailyLifeImage':
            return themeImages.생활;
            case 'diningImage':
            return themeImages['외식/카페'];
            case 'cultureImage':
            return themeImages['문화/교육'];
            default:
            return null;
        }
        };

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
                return '이용';
            case '마트':
                return '이용';
            case '전통시장':
                return '이용';
            case '택시':
                return '이용';
            case '병원':
              return '이용';
            case '세탁소':
              return '이용';
            case '약국':
              return '이용';
            case '헤어샵':
              return '이용';
            case '서점':
              return '이용';
            case '가구점':
              return '이용';
            case '가전제품':
              return '이용';
            case '백화점':
                return '이용';
            case '의류/패션':
                return '이용';
            case '스포츠용품':
                return '이용';
            case '카페':
                return '이용';
            case '양식':
              return '이용';
            case '베이커리':
              return '이용';
            case '한식':
              return '이용';
            case '일식':
              return '이용';
            case '중식':
              return '이용';
            case '패스트푸드':
              return '이용';
            case '술집':
              return '이용';
            case '영화/공연':
                return '이용';
            case '스터디카페':
                return '이용';
            case '노래방':
                return '이용';
            case '독서실':
                return '이용';
            case '문구점':
              return '이용';
            case '스포츠시설':
              return '이용';
            case '취미/오락':
              return '이용';
            case '학원':
              return '이용';
            case '면세점':
              return '이용';
            case '숙소':
              return '이용';
            case '여행사':
              return '이용';
            case '주유소':
              return '이용';
            case '주차장':
              return '이용';
            default: return null;
        }
    };

    const registThemes = [
        {
          name: themeName,
          color: "black",
          icon: getStampImage(selectedThemes.length > 0 ? selectedThemes[0].themeMainCategoryName : ""),

          missions: selectedThemes.slice(0, 5).map((theme, index) => {
            const subCategoryName = theme.themeSubCategoryName;
            const missionDetail = getMissionNameDetail(subCategoryName);
            return { name: `${subCategoryName} ${missionDetail}` };
          })
        }];


    const handleStamp = (themeName, missionName) => {
        setStamps((prev) => ({
        ...prev,
        [themeName]: {
            ...prev[themeName],
            [missionName]: true,
        },
        }));
    };

    console.log("selectedCategory", selectedCategory);

    /* 스템프 영역 */

    console.log("selectedThemes : ", selectedThemes);
    console.log("selectedThemes.ddd : ", selectedThemes.length > 0 ? selectedThemes[0].themeMainCategoryName : "");
    console.log("registThemes : ", registThemes);

    return (
        <>
            <div className="faq app-pages app-section">
                <div className="container">
                    <div className='themeDetailTitleContainer'>
                        <h2 style={{ textAlign: "left", lineHeight: 1.5 }}>
                            <span style={{ fontWeight: "bold", color: "#007FFF", fontSize: "0.8em" }}>
                                테마 등록
                            </span>{" "}
                        </h2>
                    </div>
                    <div className='themeBackgroundImg'>
                    {registThemes.map((theme, index) => (
                        <div key={index} className='theme-selection'>
                              {backgroundImg ? ( <img src={backgroundImg} className="background-image" alt="Theme Background" />
                            ) : (
                               <img src={getThemeBackgroundImage(selectedThemes.themeBackground)}  className="background-image" alt={selectedThemes.themeName} />
                            )}
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

                    <div className='themeInfoContainer'>
                        <div className='themeNameContainer'>
                            <span className='themeNameSpan'>테마명</span>
                            <input value={themeName} onChange={handleThemeNameChange} />
                        </div>

                        <div className='themeCategoryContainer'>
                            <div className='mainCategoryEditContainer'>
                                <div className='mainCategoryAfterSpanContainer'>
                                <span>대분류</span>
                                </div>
                                <div className='mainCategoryAfterSelectContainer'>
                                    <select value={selectedCategory} style={{display:'inline-block', height:'27px', fontSize:'12px'}}
                                    onChange={handleCategoryChange}>
                                        <option value="">대분류 선택</option>
                                        {categories.map((category) => (
                                            <option key={category.themeMainCategoryId} value={category.themeMainCategoryId}>
                                                {category.themeMainCategoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='subCategoryEditContainer'>
                                <div className='subCategoryAfterSpanContainer'>
                                    <span>소분류</span>
                                </div>
                                <div className='subCategoryAfterSelectContainer'>
                                    <select style={{display:'inline-block', height:'27px', fontSize:'12px'}}
                                    onChange={handleSubCategorySelect}>
                                        <option value="">소분류 선택</option>
                                        {subCategories.map((subCategory) => (
                                            <option key={subCategory.themeSubCategoryId} value={subCategory.themeSubCategoryName}>
                                                {subCategory.themeSubCategoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='selectedThemes'>
                            {selectedThemes.length === 0 ? (
                                <p className='placeholder'>선택된 테마가 없습니다. 5개의 테마를 등록해주세요</p>
                            ) : (
                                selectedThemes.map((theme, index) => (
                                    <div key={index} className='tag'>
                                        {theme.themeSubCategoryName}{" "}
                                        <span className='removeTag' onClick={() => handleRemoveThemes(index)}>
                                            X
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className='themeContentDiv'>
                    <span>테마 설명</span>
                    </div>

                    <div className="themeContentContainer">
                        <textarea
                            className='themeContentEditContainer'
                            value={themeContent} 
                            onChange={handleThemeContentChange}
                            placeholder="여기에 테마 설명을 입력하세요. (추천받은 경우, 이유가 자동으로 입력됩니다.)"
                            rows={10}
                        />
                    </div>

                    <div className="themeBottomBtnDiv">
                        <Link to={'/themeSearchAll'}>
                            <button className='moveThemeListBtn'>목록보기</button>
                        </Link>
                        <button className='registerBtn' onClick={handleRegister}>등록</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ThemeRegister;
