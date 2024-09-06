import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import "asset/css/point.css";

function PointMain(props) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalAccumulatedPoints, setTotalAccumulatedPoints] = useState(0);
  const [pointList, setPointList] = useState([]);
  const [selected, setSelected] = useState("전체");
  const [userName, setUserName] = useState("");
  const [itemsToShow, setItemsToShow] = useState(5);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      stacked: true,
      stackType: "100%",
      toolbar: {
        show: false,
      },
      events: {
        click: (event, chartContext, config) => {},
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      categories: ["포인트 비율"],
      labels: {
        show: false,
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    dataLabels: {
      enabled: false, // 데이터 레이블 비활성화
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return `${Math.floor(value).toLocaleString()} %`;
        },
      },
    },
  });

  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    // Component가 렌더링된 후 MaterializeCSS 초기화
    const elems = document.querySelectorAll(".collapsible");
    M.Collapsible.init(elems);

    fetchUserInfo();
    fetchTotalPoints();
    fetchCategoryData();
    fetchPointsListByType();
  }, [selected]);

  const fetchTotalPoints = async () => {
    try {
      const response = await axios.get(`/api/point/total`);
      setTotalPoints(response.data); // 응답 데이터에서 총 포인트 설정
    } catch (error) {
      console.error("총 포인트 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  //선택에 따라 포인트 리스트를 가져옴
  const fetchPointsListByType = async () => {
    try {
      let response;
      if (selected === "전체") {
        response = await axios.get(`/api/point/all`);
      } else if (selected === "적립") {
        response = await axios.get(`/api/point/added`);
      } else if (selected === "사용") {
        response = await axios.get(`/api/point/used`);
      }

      // 날짜순으로 정렬
      const sortedPoints = response.data.sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      );
      setPointList(sortedPoints); // 정렬된 포인트 리스트 설정
    } catch (error) {
      console.error(
        `${selected} 포인트 리스트 데이터를 가져오는 중 오류 발생:`,
        error
      );
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`api/point/info`);
      setUserName(response.data.userName);
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(`/api/point/calc-category`);
      const data = response.data;

      // 카테고리별 총합과 비율 데이터 설정
      const categoryTotals = data.categoryTotals || {};
      const categoryRatios = data.categoryRatios || {};

      const totalAccumulatedPoints = Object.values(categoryTotals).reduce(
        (acc, value) => acc + value,
        0
      );
      setTotalAccumulatedPoints(totalAccumulatedPoints);

      const seriesData = [
        {
          name: "테마 포인트 ",
          data: [categoryRatios["테마"] || 0],
          total: categoryTotals["테마"] || 0,
        },
        {
          name: "레이드 포인트 ",
          data: [categoryRatios["레이드"] || 0],
          total: categoryTotals["레이드"] || 0,
        },
        {
          name: "기타 ",
          data: [categoryRatios["기타"] || 0],
          total: categoryTotals["기타"] || 0,
        },
      ];

      setChartSeries(seriesData);

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        legend: {
          formatter: (seriesName, { seriesIndex }) => {
            const total = seriesData[seriesIndex]?.total || 0;
            return `${seriesName}: ${total.toLocaleString()} 원`;
          },
        },
      }));
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  // 더보기 5개씩 증가하도록
  const loadMore = () => {
    setItemsToShow((prev) => prev + 5);
  };

  const handleClick = (select) => {
    setSelected(select); // 클릭한 항목을 selected 상태로 설정
  };

  return (
    <>
      <div className="faq app-pages app-section">
        <div className="container">
          <div className="point-pages-title">
            <h2 className="point-h2">
              {userName}님의 포인트는
              <br />
              <span
                style={{
                  fontWeight: "bold",
                  color: "#007FFF",
                  fontSize: "1.2em",
                }}
              >
                {totalPoints.toLocaleString()}P&nbsp;
                <h3 className="point-h3">
                  (총 누적 {totalAccumulatedPoints.toLocaleString()}P)
                </h3>
              </span>{" "}
            </h2>
            <br></br>

            <div id="chart" style={{ width: "100%", height: "140px" }}>
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={140}
              />
            </div>
            <br></br>

            <h4 style={{ textAlign: "left", fontSize: 15 }}>
              <Link
                to="/point/transfer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                포인트 전환 &gt;
              </Link>
            </h4>
            <hr></hr>
            <div style={{ display: "flex", marginTop: "15px" }}>
              <h4
                onClick={() => handleClick("전체")}
                style={{
                  textAlign: "left",
                  fontSize: 15,
                  color: selected === "전체" ? "black" : "inherit",
                  cursor: "pointer",
                }}
              >
                전체
              </h4>
              &nbsp;&nbsp;&nbsp;
              <h4
                onClick={() => handleClick("적립")}
                style={{
                  textAlign: "left",
                  fontSize: 15,
                  color: selected === "적립" ? "black" : "inherit",
                  cursor: "pointer",
                }}
              >
                적립
              </h4>
              &nbsp;&nbsp;&nbsp;
              <h4
                onClick={() => handleClick("사용")}
                style={{
                  textAlign: "left",
                  fontSize: 15,
                  color: selected === "사용" ? "black" : "inherit",
                  cursor: "pointer",
                }}
              >
                사용
              </h4>
            </div>
          </div>
          <div className="entry">
            <ul className="collapsible" data-collapsible="accordion">
              {pointList.length > 0 ? (
                pointList.slice(0, itemsToShow).map((point, index) => (
                  <li key={index}>
                    <div
                      className="collapsible-header faq-collapsible"
                      style={{ display: "block" }}
                    >
                      <div>{point.pointName}</div>
                      <div style={{ alignItems: "center" }}>
                        <span
                          style={{
                            color: point.isAdd === 1 ? "#007FFF" : "#ff0000",
                            fontSize: "1.2em",
                          }}
                        >
                          {point.isAdd === 1 ? "+" : "-"}{" "}
                          {point.amount.toLocaleString()}P
                        </span>
                        <i className="fa fa-plus"></i>
                      </div>
                    </div>

                    <div className="collapsible-body">
                      <p style={{ margin: "-15px 0" }}>{point.pointName}</p>
                      <p style={{ margin: "-15px 0" }}>
                        {new Date(point.createDate).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li>
                  <div className="collapsible-header faq-collapsible">
                    <div>포인트 내역이 없습니다.</div>
                  </div>
                </li>
              )}
            </ul>
            {itemsToShow < pointList.length && (
              <button onClick={loadMore} className="btn-load-more">
                더보기
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PointMain;
