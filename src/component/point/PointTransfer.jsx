import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "asset/css/point.css";

function PointTransfer(props) {
  const [transferPoints, setTransferPoints] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchTotalPoints();
  }, []);

  const handleTransfer = async () => {
    if (!transferPoints || parseInt(transferPoints) <= 0) {
      alert("유효한 전환 포인트를 입력하세요.");
      return;
    }

    const pointDTO = {
      pointName: "포인트 전환",
      amount: parseInt(transferPoints), // 포인트 차감
      isAdd: -1, // -1은 차감, 1은 추가
    };

    try {
      const response = await axios.post(`/api/point/create`, pointDTO); // 서버로 포인트 전환 요청 보내기
      console.log(response);
      if (response.data === 0) {
        alert("포인트 전환이 실패했습니다. 포인트 잔액을 확인하세요.");
      } else {
        navigate("/point/transfer/complete"); // 전환 완료 페이지로 이동
      }
    } catch (error) {
      console.error("포인트 전환 중 오류 발생:", error);
      alert("포인트 전환 중 오류가 발생했습니다.");
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`/api/point/info`);
      setUserName(response.data.userName);
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
    }
  };
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
              {totalPoints.toLocaleString()}P
            </span>{" "}
            입니다.
          </h2>
          <br></br>
          <hr></hr>
          <br></br>
          <h4 className="point-account-h4"> 계좌 번호를 입력해주세요 </h4>
          <br></br>
          <form>
            <div className="form-group">
              <select
                id="bank"
                name="bank"
                defaultValue="신한"
                style={{
                  width: "100%",
                  height: "60px",
                  padding: "8px",
                  margin: "8px 0",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                  display: "block",
                }}
              >
                <option value="신한">신한은행</option>
                <option value="국민">국민은행</option>
                <option value="우리">우리은행</option>
                <option value="NH농협">NH농협은행</option>
                <option value="하나">하나은행</option>
                <option value="새마을">새마을은행</option>
                <option value="카카오뱅크">카카오뱅크</option>
                <option value="토스뱅크">토스뱅크</option>
              </select>
            </div>

            <div
              className="form-group"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={{ width: "100px" }}>
                <label htmlFor="account-number" style={{ marginRight: "10px" }}>
                  계좌 번호
                </label>
              </div>

              <input
                type="text"
                id="account-number"
                name="account-number"
                placeholder="'-' 없이 입력"
                style={{
                  width: "90%",
                  height: "43px",
                  padding: "8px",
                  margin: "8px 0",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div
              className="form-group"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={{ width: "100px" }}>
                <label htmlFor="account-holder" style={{ marginRight: "10px" }}>
                  예금주
                </label>
              </div>

              <input
                type="text"
                id="account-holder"
                name="account-holder"
                style={{
                  width: "90%",
                  height: "43px",
                  padding: "8px",
                  margin: "8px 0",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div
              className="form-group"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={{ width: "100px" }}>
                <label htmlFor="account-holder" style={{ marginRight: "10px" }}>
                  전환신청 포인트
                </label>
              </div>

              <input
                type="number"
                id="transfer-points"
                name="transfer-points"
                value={transferPoints}
                onChange={(e) => setTransferPoints(e.target.value)}
                style={{
                  width: "30%",
                  height: "43px",
                  padding: "8px",
                  margin: "8px 0",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <br />
            <button
              type="button"
              onClick={handleTransfer}
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
              전환하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PointTransfer;
