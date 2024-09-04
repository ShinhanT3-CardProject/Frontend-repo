import React, { useEffect, useState } from "react";
import completeIcon from "asset/image/completeIcon.png";
import "asset/css/point.css";
import { Link } from "react-router-dom";
import axios from "axios";

function TransferComplete(props) {
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    fetchTotalPoints();
  }, []);

  const fetchTotalPoints = async () => {
    try {
      const response = await axios.get(`/api/point/total`);
      setTotalPoints(response.data); // 응답 데이터에서 총 포인트 설정
    } catch (error) {
      console.error("총 포인트 데이터를 가져오는 중 오류 발생:", error);
    }
  };
  return (
    <div className="faq app-pages app-section">
      <div className="container">
        <div className="point-complete-pages-title">
          <h2 className="point-complete-h2">
            포인트 전환이 완료되었습니다.
            <br />
          </h2>
          <br />
          <h2 className="point-complete-point">
            잔여 포인트 : {totalPoints.toLocaleString()}P
            <br />
          </h2>

          <div className="image-container">
            <img src={completeIcon} />
          </div>

          <br></br>
          <br></br>

          <button
            type="button"
            style={{
              width: "100%",
              height: "60px",
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#007FFF",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Link
              to="/"
              style={{
                color: "#fff",
              }}
            >
              메인 화면으로 이동
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransferComplete;
