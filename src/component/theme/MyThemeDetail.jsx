import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

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

import complete from "asset/image/complete.png";

function MyThemeDetail(props) {
  const [myDetailTheme, setMyDetailTheme] = useState("");
  const [initialThemeData, setInitialThemeData] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { themeId } = useParams();
  const [stamps, setStamps] = useState({}); /* 스탬프 변수 */
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (modalMessage !== "") randomModal();
  }, [modalMessage]);
  // 랜덤 포인트 지급
  const giveRandomPoint = async (themeContentId) => {
    try {
      const response = await axios.post("/api/theme/random", {
        themeContentId: themeContentId,
      });

      // 응답 데이터에서 메시지를 추출
      const result = response.data;

      if (response.status === 200) {
        setModalMessage(result);
      } else {
        setModalMessage("이미 지급된 포인트입니다.");
      }
    } catch (error) {
      if (error.response) {
        // 요청이 이루어졌고 서버가 상태 코드로 응답했지만, 요청이 실패했을 때
        console.error("응답 오류:", error.response.data); // 서버 응답 데이터
        setModalMessage("이미 지급된 포인트입니다.");
      } else if (error.request) {
        // 요청이 이루어졌지만 응답을 받지 못했을 때
        console.error("요청 오류:", error.request);
        setModalMessage("서버 응답을 받지 못했습니다.");
      } else {
        // 오류를 발생시킨 요청 설정 문제
        console.error("설정 오류:", error.message);
        setModalMessage("요청 설정에 오류가 발생했습니다.");
      }
      randomModal();
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  const receivedTheme = location.state?.theme || ""; // 소분류 테마를 받음
  const receivedMainCategory = location.state?.mainCategory || ""; // 추천받은 대분류 테마를 받음

  const themeImages = {
    생활: dailyLifeImage,
    쇼핑: shoppingImage,
    "외식/카페": diningImage,
    "문화/교육": cultureImage,
    "여행/교통": travelImage,
  };

  const [selectedThemes, setSelectedThemes] = useState(
    receivedTheme
      ? receivedTheme
          .split(", ")
          .map((item) => ({ themeSubCategoryName: item }))
      : []
  );
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [themeName, setThemeName] = useState(myDetailTheme.themeName || "");
  const [themeContent, setThemeContent] = useState("");
  const [backgroundImg, setBackgroundImg] = useState(
    receivedMainCategory ? themeImages[receivedMainCategory] : null
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get("/api/categories");
        setCategories(categoriesResponse.data);

        if (receivedMainCategory) {
          const category = categoriesResponse.data.find(
            (cat) => cat.themeMainCategoryName === receivedMainCategory
          );
          if (category) {
            setSelectedCategory(category.themeMainCategoryId);
            await fetchSubCategories(category.themeMainCategoryId);
            setBackgroundImg(themeImages[receivedMainCategory]); // 초기 로딩 시 이미지 설정
          }
        }
      } catch (error) {
        console.error("대분류 데이터를 불러오는데 실패했습니다 : ", error);
      }
    };

    fetchCategories();
  }, [receivedMainCategory]);

  // subCategory 데이터 수신
  const fetchSubCategories = async (mainCategoryId) => {
    try {
      const subCategoriesResponse = await axios.get(
        `/api/categories/${mainCategoryId}/subcategories`
      );
      setSubCategories(subCategoriesResponse.data);
    } catch (error) {
      console.error("소분류 데이터를 불러오는데 실패했습니다 : ", error);
    }
  };

  const handleCategoryChange = (event) => {
    const newCategoryId = event.target.value;
    const newMainCategory = categories.find(
      (cat) => cat.themeMainCategoryId === parseInt(newCategoryId)
    )?.themeMainCategoryName;

    if (newMainCategory) {
      setBackgroundImg(themeImages[newMainCategory]); // 대분류 변경 시 이미지 설정
    }
    setSelectedCategory(newCategoryId);
    setSubCategories([]);
    setSelectedThemes([]); // 새로운 대분류 선택 시 소분류 초기화
    fetchSubCategories(newCategoryId);
  };

  const handleSubCategorySelect = (event) => {
    const selectedSubCategory = subCategories.find(
      (sub) => sub.themeSubCategoryName === event.target.value
    );

    if (
      selectedSubCategory &&
      !selectedThemes.some(
        (theme) =>
          theme.themeSubCategoryName ===
          selectedSubCategory.themeSubCategoryName
      )
    ) {
      if (selectedThemes.length < 5) {
        setSelectedThemes((prevThemes) => [...prevThemes, selectedSubCategory]);
      } else {
        alert("선택할 수 있는 테마는 최대 5개까지 입니다.");
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

  useEffect(() => {
    if (selectedThemes.length > 0) {
      const mainCategoryCounts = selectedThemes.reduce((acc, curr) => {
        acc[curr.themeMainCategoryName] =
          (acc[curr.themeMainCategoryName] || 0) + 1;
        return acc;
      }, {});

      const mostSelectedMainCategory = Object.keys(mainCategoryCounts).reduce(
        (a, b) => (mainCategoryCounts[a] > mainCategoryCounts[b] ? a : b)
      );
      setBackgroundImg(themeImages[mostSelectedMainCategory]);
    } else if (receivedMainCategory && selectedCategory === "") {
      setBackgroundImg(themeImages[receivedMainCategory]);
    } else if (selectedThemes.length === 0) {
      setBackgroundImg(null); // 테마가 삭제되었을 때 배경 이미지를 초기화
    }
  }, [selectedThemes, receivedMainCategory]);

  //themeDetail 데이터 수신
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: myDetailThemeResponse } = await axios.get(
          `/api/theme/findThemeDetail/${themeId}`
        );
        console.log("myDetailThemeResponse : ", myDetailThemeResponse);
        setMyDetailTheme(myDetailThemeResponse);
        setInitialThemeData(myDetailThemeResponse);
        setThemeName(myDetailThemeResponse.themeName);
        setThemeContent(myDetailThemeResponse.themeDescription);
        setSelectedCategory(myDetailThemeResponse.themeMainCategoryId);

        const { data: categoryResponse } = await axios.get("/api/categories");
        setCategories(categoryResponse);

        if (myDetailThemeResponse.themeMainCategoryId) {
          await fetchSubCategories(myDetailThemeResponse.themeMainCategoryId);
          setBackgroundImg(
            themeImages[myDetailThemeResponse.themeMainCategoryName]
          ); // 원래 저장된 배경 이미지 설정
        }
        setSelectedThemes(myDetailThemeResponse.themeSubCategory || []);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
      }
    };
    fetchData();
  }, [themeId]);

  const getThemeBackgroundImage = (themeBackground) => {
    switch (themeBackground) {
      case "shoppingImage":
        return shoppingImage;
      case "travelImage":
        return travelImage;
      case "dailyLifeImage":
        return dailyLifeImage;
      case "diningImage":
        return diningImage;
      case "cultureImage":
        return cultureImage;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "themeIsPublic") {
      setMyDetailTheme((prev) => ({
        ...prev,
        themeIsPublic: value === "true",
      }));
    } else if (name === "themeIsActivated") {
      setMyDetailTheme((prev) => ({
        ...prev,
        themeIsActivated: value === "true",
      }));
    } else if (name === "themeMainCategoryId") {
      const selectedCategory = categories.find(
        (category) => category.themeMainCategoryName === value
      );

      if (selectedCategory) {
        fetchSubCategories(selectedCategory.themeMainCategoryId);
        setMyDetailTheme((prev) => ({
          ...prev,
          themeBackground: selectedCategory.themeMainCategoryName,
          themeMainCategoryId: selectedCategory.themeMainCategoryId,
        }));
        setBackgroundImg(themeImages[selectedCategory.themeMainCategoryName]); // 카테고리 변경 시 배경 이미지 설정
      }
      setSelectedThemes([]);
    } else {
      setMyDetailTheme((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 테마 데이터 삭제
  const handleRemoveClick = () => {
    Swal.fire({
      title: "정말 삭제 하시겠습니까?",
      text: "삭제 시 다시 되돌릴 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "#007FFF",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      reverseButtons: false, // 버튼 순서 거꾸로
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/theme/deleteTheme/${themeId}`)
          .then((response) => {
            console.log("테마가 성공적으로 삭제되었습니다.");
            navigate("/myThemeSearch");
          })
          .catch((error) => {
            console.error("삭제 중 오류가 발생했습니다.", error);
          });
        Swal.fire("삭제가 성공적으로 완료되었습니다.", "success");
      }
    });
  };

  // 랜덤포인트 모달
  const randomModal = () => {
    Swal.fire({
      text: modalMessage,
      icon: modalMessage === "이미 지급된 포인트입니다." ? "error" : "success",
      confirmButtonColor: "#007FFF",
      confirmButtonText: "확인",
    });
  };

  if (!myDetailTheme) {
    return <div>잠시만 기다려 주세요</div>;
  }

  // 수정 버튼 클릭 시 화면구성 변경
  const handleEditClick = async () => {
    // 기존에 저장된 테마 정보를 사용하여 selectedThemes 상태를 설정합니다.
    if (
      Array.isArray(myDetailTheme.themeContents) &&
      myDetailTheme.themeContents.length > 0
    ) {
      const initialSelectedThemes = myDetailTheme.themeContents.map(
        (content) => ({
          themeSubCategoryName: content.themeSubCategoryName,
          themeSubCategoryId: content.themeSubCategoryId,
        })
      );
      setSelectedThemes(initialSelectedThemes);
    }

    // 대분류 설정 및 소분류 불러오기
    if (myDetailTheme.themeMainCategoryName) {
      const selectedCategory = categories.find(
        (category) =>
          category.themeMainCategoryName === myDetailTheme.themeMainCategoryName
      );

      if (selectedCategory) {
        setSelectedCategory(selectedCategory.themeMainCategoryId);
        setBackgroundImg(themeImages[selectedCategory.themeMainCategoryName]);

        // 소분류 데이터를 불러옵니다.
        await fetchSubCategories(selectedCategory.themeMainCategoryId);
      }
    }
    setIsEditMode(true);
  };

  const handleCancleClick = () => {
    setMyDetailTheme(initialThemeData);
    setIsEditMode(false);
  };

  const handleEditSave = async () => {
    if (!selectedCategory || selectedThemes.length === 0) {
      alert("대분류와 최소 하나의 소분류를 선택해 주세요.");
      return;
    }

    const themeData = {
      themeName: themeName,
      themeDescription: themeContent,
      themeIsActivated: myDetailTheme.themeIsActivated,
      themeIsPublic: myDetailTheme.themeIsPublic,
      subCategory: selectedThemes.map((theme) => ({
        themeSubCategoryId: theme.themeSubCategoryId,
      })),
      mainCategory: { themeMainCategoryId: selectedCategory }, // 선택된 대분류 ID 추가
    };

    try {
      const response = await axios.put(
        `/api/theme/updateTheme/${themeId}`,
        themeData
      );
      if (response.status === 200) {
        Swal.fire("테마가 성공적으로 수정되었습니다!");
        navigate("/myThemeSearch");
      }
    } catch (error) {
      console.error("테마 수정 중 오류가 발생했습니다: ", error);
      alert("테마 수정 중 오류가 발생했습니다.");
    }
  };

  /* 스탬프 변수 */
  const getStampImage = (stampImage) => {
    switch (stampImage) {
      case "쇼핑":
        return shoppingIcon;
      case "여행/교통":
        return travelIcon;
      case "생활":
        return lifestyleIcon;
      case "외식/카페":
        return diningIcon;
      case "문화/교육":
        return cultureIcon;
      default:
        return null;
    }
  };

  /* 문구 가변으로 가져오기 */
  const getMissionNameDetail = (missionNameDetail) => {
    switch (missionNameDetail) {
      case "편의점":
        return "이용";
      case "마트":
        return "이용";
      case "전통시장":
        return "이용";
      case "택시":
        return "이용";
      case "병원":
        return "이용";
      case "세탁소":
        return "이용";
      case "약국":
        return "이용";
      case "헤어샵":
        return "이용";
      case "서점":
        return "이용";
      case "가구점":
        return "이용";
      case "가전제품":
        return "이용";
      case "백화점":
        return "이용";
      case "의류/패션":
        return "이용";
      case "스포츠용품":
        return "이용";
      case "카페":
        return "이용";
      case "양식":
        return "이용";
      case "베이커리":
        return "이용";
      case "한식":
        return "이용";
      case "일식":
        return "이용";
      case "중식":
        return "이용";
      case "패스트푸드":
        return "이용";
      case "술집":
        return "이용";
      case "영화/공연":
        return "이용";
      case "스터디카페":
        return "이용";
      case "노래방":
        return "이용";
      case "독서실":
        return "이용";
      case "문구점":
        return "이용";
      case "스포츠시설":
        return "이용";
      case "취미/오락":
        return "이용";
      case "학원":
        return "이용";
      case "면세점":
        return "이용";
      case "숙소":
        return "이용";
      case "여행사":
        return "이용";
      case "주유소":
        return "이용";
      case "주차장":
        return "이용";
      default:
        return null;
    }
  };

  const themeContents = myDetailTheme.themeContents;

  const themes = [
    {
      name: myDetailTheme.themeName,
      color: "black",
      icon: getStampImage(myDetailTheme.themeMainCategoryName),
      missions: [
        {
          name: `${
            themeContents[0].themeSubCategoryName
          } ${getMissionNameDetail(themeContents[0].themeSubCategoryName)}`,
          themeContentId: themeContents[0].themeContentId,
        },
        {
          name: `${
            themeContents[1].themeSubCategoryName
          } ${getMissionNameDetail(themeContents[1].themeSubCategoryName)}`,
          themeContentId: themeContents[1].themeContentId,
        },
        {
          name: `${
            themeContents[2].themeSubCategoryName
          } ${getMissionNameDetail(themeContents[2].themeSubCategoryName)}`,
          themeContentId: themeContents[2].themeContentId,
        },
        {
          name: `${
            themeContents[3].themeSubCategoryName
          } ${getMissionNameDetail(themeContents[3].themeSubCategoryName)}`,
          themeContentId: themeContents[3].themeContentId,
        },
        {
          name: `${
            themeContents[4].themeSubCategoryName
          } ${getMissionNameDetail(themeContents[4].themeSubCategoryName)}`,
          themeContentId: themeContents[4].themeContentId,
        },
      ],
    },
  ];

  const editThemes = [
    {
      name: themeName,
      color: "black",
      icon: getStampImage(myDetailTheme.themeMainCategoryName),
      missions: selectedThemes.slice(0, 5).map((theme, index) => {
        const subCategoryName = theme.themeSubCategoryName;
        const missionDetail = getMissionNameDetail(subCategoryName);
        return { name: `${subCategoryName} ${missionDetail}` };
      }),
    },
  ];

  const handleStamp = (themeName, missionName, themeContentId) => {
    setStamps((prev) => ({
      ...prev,
      [themeName]: {
        ...prev[themeName],
        [missionName]: true,
      },
    }));

    // 포인트 지급 요청
    giveRandomPoint(themeContentId);
  };

  return (
    <>
      <div className="faq app-pages app-section">
        <div className="container">
          <div className="themeDetailTitleContainer">
            <h2 style={{ textAlign: "left", lineHeight: 1.5 }}>
              <span
                style={{
                  fontWeight: "bold",
                  color: "#007FFF",
                  fontSize: "0.8em",
                }}
              >
                나의 테마 상세조회
              </span>{" "}
            </h2>
          </div>
          {isEditMode ? (
            <div className="themeBackgroundImg">
              {editThemes.map((theme, index) => (
                <div key={index} className="theme-selection">
                  {backgroundImg ? (
                    <img
                      src={backgroundImg}
                      className="background-image"
                      alt="Theme Background"
                    />
                  ) : (
                    <img
                      src={getThemeBackgroundImage(
                        myDetailTheme.themeBackground
                      )}
                      className="background-image"
                      alt={myDetailTheme.themeName}
                    />
                  )}
                  <div className="theme-path">
                    {theme.missions.map((mission, index) => (
                      <div
                        key={index}
                        className={`mission-node ${
                          stamps[theme.name]?.[mission.name] ? "stapmed" : ""
                        }`}
                        onClick={() =>
                          handleStamp(
                            theme.name,
                            mission.name,
                            mission.themeContentId
                          )
                        }
                      >
                        <img
                          src={theme.icon}
                          alt={`${theme.name} icon`}
                          className="mission-icon"
                        />
                        <div className="mission-name">{mission.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="themeBackgroundImg">
              {themes.map((theme, index) => (
                <div key={index} className="theme-selection">
                  <img
                    src={getThemeBackgroundImage(myDetailTheme.themeBackground)}
                    alt={myDetailTheme.themeName}
                    className="background-image"
                  />
                  <div className="theme-path">
                    {theme.missions.map((mission, index) => (
                      <div
                        key={index}
                        className={`mission-node ${
                          stamps[theme.name]?.[mission.name] ? "stapmed" : ""
                        }`}
                        onClick={() =>
                          themeContents[index].themeIsSuccess
                            ? giveRandomPoint(mission.themeContentId)
                            : ""
                        }
                      >
                        <img
                          src={
                            themeContents[index].themeIsSuccess
                              ? complete
                              : theme.icon
                          }
                          alt={`${theme.name} icon`}
                          className="mission-icon"
                        />
                        <div className="mission-name">{mission.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="themeInfoContainer">
            <div className="themeNameContainer">
              <span>테마명</span>
              {isEditMode ? (
                <input
                  value={themeName}
                  style={{
                    display: "inline-block",
                    height: "27px",
                    fontSize: "14px",
                  }}
                  onChange={handleThemeNameChange}
                />
              ) : (
                <p>{myDetailTheme.themeName}</p>
              )}
            </div>

            <div className="themeCategoryContainer">
              {isEditMode ? (
                <>
                  <div className="mainCategoryEditContainer">
                    <div className="mainCategoryAfterSpanContainer">
                      <span>대분류</span>
                    </div>
                    <div className="mainCategoryAfterSelectContainer">
                      <select
                        value={selectedCategory}
                        style={{
                          display: "inline-block",
                          height: "27px",
                          fontSize: "12px",
                        }}
                        onChange={handleCategoryChange}
                      >
                        <option value="">대분류 선택</option>
                        {categories.map((category) => (
                          <option
                            key={category.themeMainCategoryId}
                            value={category.themeMainCategoryId}
                          >
                            {category.themeMainCategoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span>대분류</span>
                  <p>{myDetailTheme.themeMainCategoryName}</p>
                </>
              )}

              {isEditMode ? (
                <>
                  <div className="subCategoryEditContainer">
                    <div className="themeSubCategoryContainer">
                      <div className="subCategoryAfterSpanContainer">
                        <span>소분류</span>
                      </div>
                      <div className="subCategoryAfterSelectContainer">
                        <select
                          style={{
                            display: "inline-block",
                            height: "27px",
                            fontSize: "12px",
                          }}
                          onChange={handleSubCategorySelect}
                        >
                          <option value="">소분류 선택</option>
                          {subCategories.map((subCategory) => (
                            <option
                              key={subCategory.themeSubCategoryId}
                              value={subCategory.themeSubCategoryName}
                            >
                              {subCategory.themeSubCategoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>

            {isEditMode ? (
              <div className="selectedThemes">
                {selectedThemes.length === 0 ? (
                  <p className="placeholder">
                    선택된 테마가 없습니다. 5개의 테마를 등록해주세요
                  </p>
                ) : (
                  selectedThemes.map((theme, index) => (
                    <div key={index} className="tag">
                      {theme.themeSubCategoryName}{" "}
                      <span
                        className="removeTag"
                        onClick={() => handleRemoveThemes(index)}
                      >
                        X
                      </span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <>
                <div className="themeSubCategoryContainer">
                  <span>소분류</span>
                  <p>
                    {Array.isArray(myDetailTheme.themeContents)
                      ? myDetailTheme.themeContents
                          .map((content) => content.themeSubCategoryName)
                          .join(", ")
                      : ""}
                  </p>
                </div>
              </>
            )}

            <div className="myThemeIsPublicContainer">
              <span>공개</span>
              {isEditMode ? (
                <select
                  name="themeIsPublic"
                  value={myDetailTheme.themeIsPublic ? "true" : "false"}
                  style={{
                    display: "inline-block",
                    height: "27px",
                    fontSize: "12px",
                  }}
                  onChange={handleChange}
                >
                  <option value="true">공개</option>
                  <option value="false">비공개</option>
                </select>
              ) : (
                <p>{myDetailTheme.themeIsPublic ? "공개" : "비공개"}</p>
              )}
            </div>
            <div className="myThemeIsActivtedContainer">
              <span>활성</span>
              {isEditMode ? (
                <select
                  name="themeIsActivated"
                  value={myDetailTheme.themeIsActivated ? "true" : "false"}
                  style={{
                    display: "inline-block",
                    height: "27px",
                    fontSize: "12px",
                  }}
                  onChange={handleChange}
                >
                  <option value="true">활성화</option>
                  <option value="false">비활성화</option>
                </select>
              ) : (
                <p>{myDetailTheme.themeIsActivated ? "활성" : "비활성"}</p>
              )}
            </div>
          </div>

          <div className="themeContentDiv">
            <span>테마 설명</span>
            {isEditMode ? (
              <Link to={"/myThemeSearch"}>
                <button className="themeSaveBtn" onClick={handleEditSave}>
                  저장
                </button>
              </Link>
            ) : (
              <button className="themeEditBtn" onClick={handleEditClick}>
                수정
              </button>
            )}
          </div>

          <div className="themeContentContainer">
            {isEditMode ? (
              <textarea
                className="themeContentEditContainer"
                value={themeContent}
                onChange={handleThemeContentChange}
                placeholder=" 여기에 테마 설명을 입력하세요. &#13;&#10;(추천받은 경우, 이유가 자동으로 입력됩니다.)"
                rows={10}
              />
            ) : (
              <p>{myDetailTheme.themeDescription}</p>
            )}
          </div>
          <div className="themeBottomBtnDiv">
            <Link to={"/myThemeSearch"}>
              <button className="moveThemeListBtn">목록보기</button>
            </Link>
            {isEditMode ? (
              <button
                className="themeEditCancleBtn"
                onClick={handleCancleClick}
              >
                취소
              </button>
            ) : (
              <button className="themeRemoveBtn" onClick={handleRemoveClick}>
                삭제
              </button>
            )}
          </div>
        </div>{" "}
      </div>{" "}
    </>
  );
}

export default MyThemeDetail;
