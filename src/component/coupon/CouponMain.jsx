import React, { useEffect, useState } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import axios from "axios";
import "asset/css/coupon.css";

function CouponMain(props) {
  const [couponList, setCouponList] = useState([]);

  useEffect(() => {
    fetchCouponList();
    // Component가 렌더링된 후 MaterializeCSS 초기화
    const elems = document.querySelectorAll(".collapsible");
    M.Collapsible.init(elems);
  }, []);

  const fetchCouponList = async () => {
    try {
      const response = await axios.get(`/api/coupon/usable`);
      setCouponList(response.data); // 응답 데이터에서 포인트 리스트 설정
    } catch (error) {
      console.error("포인트 리스트 데이터를 가져오는 중 오류 발생:", error);
    }
  };
  return (
    <>
      <div className="faq app-pages app-section">
        <div className="container">
          <div className="coupon-pages-title">
            <br></br>
            <div style={{ textAlign: "center", marginBottom: 15 }}>
              <span
                style={{
                  fontWeight: "normal",
                  fontSize: "15px",
                  marginRight: 30,
                  color: "black",
                }}
              >
                쿠폰 등록{" "}
              </span>
              <input
                type="text"
                id="coupon-number"
                name="coupon-number"
                placeholder="쿠폰 코드를 입력해주세요"
                style={{
                  width: "60%",
                  height: "35px",
                  padding: "8px",
                  margin: "8px 0",
                  borderRadius: "4px",
                  border: "1px solid black",
                }}
              />
            </div>
            <br></br>
            <h4 style={{ textAlign: "left", fontSize: 15 }}>
              받은 쿠폰{" "}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                {couponList.length}장
              </span>
            </h4>
            <hr></hr>
          </div>
          <div className="entry">
            <ul className="collapsible" data-collapsible="accordion">
              {couponList.map((coupon, index) => (
                <li key={index}>
                  <div
                    className="collapsible-header faq-collapsible"
                    style={{ display: "block" }}
                  >
                    <div>{coupon.couponName}</div>
                    <div>
                      <span style={{ color: "#007FFF", fontSize: "1.2em" }}>
                        <br></br>
                        최대 할인 : {coupon.maxDiscount.toLocaleString()}
                      </span>
                      <i className="fa fa-plus"></i>
                    </div>
                  </div>

                  <div className="collapsible-body">
                    <p style={{ margin: "-15px 0" }}>
                      할인율 : {coupon.discountRate} %
                    </p>
                    <p style={{ margin: "-15px 0" }}>
                      사용 기한 :{" "}
                      {(() => {
                        const date = new Date(coupon.expirationDate);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        ); // 월은 0부터 시작하므로 +1
                        const day = String(date.getDate()).padStart(2, "0");
                        const hours = String(date.getHours()).padStart(2, "0");
                        const minutes = String(date.getMinutes()).padStart(
                          2,
                          "0"
                        );
                        return `${year}-${month}-${day} ${hours}:${minutes}`;
                      })()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default CouponMain;
