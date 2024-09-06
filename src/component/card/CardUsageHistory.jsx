import React, { useEffect, useState } from "react";
import "asset/css/cardusagehistory.css";

function CardUsageHistory() {
  const [usageHistory, setUsageHistory] = useState({});
  const [selectedCard, setSelectedCard] = useState(null); // 사용자가 선택한 카드
  const [showCardNumber, setShowCardNumber] = useState(false); // 카드번호 표시 여부
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    fetch(`/api/card/history`)
      .then((response) => response.json())
      .then((data) => {
        setUsageHistory(data);
        setLoading(false);
        // 첫 번째 카드가 존재할 경우, 디폴트로 선택
        const firstCardNum = Object.keys(data)[0];
        if (firstCardNum) {
          setSelectedCard(firstCardNum);
        }
      })
      .catch((error) => {
        console.error("Error fetching usage history:", error);
        setLoading(false); // 로딩 종료
      });
  }, []);

  // 카드 선택 시 
  const handleCardSelect = (cardNum) => {
    setSelectedCard(cardNum);
    setShowCardNumber(false); // 새로운 카드를 선택할 때 카드번호 숨김
  };

  // 카드번호 보기 버튼 클릭 시  
  const toggleCardNumber = () => {
    setShowCardNumber((prevShow) => !prevShow);
  };

  // 카드 선택 변경 시 
  const handleCardChange = (event) => {
    const cardNum = event.target.value;
    handleCardSelect(cardNum);
  };

  // 카드 번호 마스킹 함수
  const maskCardNumber = (cardNum) => { 
    return cardNum.slice(0, -4).replace(/\d/g, "*") + cardNum.slice(-4);
  };

  const hasCards = Object.keys(usageHistory).length > 0;
  const selectedCardHasUsage = selectedCard && usageHistory[selectedCard] && usageHistory[selectedCard].usageHistory.length > 0;

  return (
    <>
      <div className="usage-history app-pages app-section">
        <div className="container">
          <div className="pages-title"> 
            <hr />
          </div>
          <div className="entry">
            {/* 카드 선택을 위한 select 박스 */}
            <div className="card-selection">
              <label htmlFor="card-select">카드를 선택하세요</label>
              <select
                id="card-select"
                value={selectedCard || ''}
                onChange={handleCardChange}
                className="card-select-dropdown"
                disabled={loading} // 로딩 중에는 select 박스 비활성화
              >
                <option value="" disabled>카드를 선택하세요</option>
                {!loading && !hasCards ? (
                  <option value="">카드가 없습니다.</option>
                ) : (
                  hasCards && Object.keys(usageHistory).map((cardNum) => (
                    <option key={cardNum} value={cardNum}>
                      {usageHistory[cardNum].cardName}
                    </option>
                  ))
                )}
              </select>
              {/* 결제내역이 없는 경우의 메시지 */}
              {!loading && !hasCards && (
                <p className="centered-message">결제내역이 없습니다.</p>
              )}
            </div>

            {/* 로딩 중 메시지 */}
            {loading && <p>결제내역을 불러오는 중입니다...</p>}

            {/* 선택된 카드의 결제 내역 표시 */}
            {selectedCard && !loading ? (
              <div className="card-usage-section">
                <h3 className="card-name">
                  {usageHistory[selectedCard].cardName}
                </h3>
                <div className="card-number-section">
                  {showCardNumber ? (
                    <>
                      <h5 className="card-number">{selectedCard}</h5>
                      <button
                        onClick={toggleCardNumber}
                        className="toggle-card-number-button"
                      >
                        카드번호 숨기기
                      </button>
                    </>
                  ) : (
                    <>
                      <h5 className="card-number">{maskCardNumber(selectedCard)}</h5>
                      <button
                        onClick={toggleCardNumber}
                        className="toggle-card-number-button"
                      >
                        카드번호 보기
                      </button>
                    </>
                  )}
                </div>
                <div className="order">
                  {selectedCardHasUsage ? (
                    usageHistory[selectedCard].usageHistory
                      .sort((a,b) => new Date(b.transactionDate) - new Date(a.transactionDate))  // 결제내역을 내림차순으로 정렬
                      .map((usage) => (
                      <div key={usage.usageId} className="row order-row">
                        <div className="col s8 custom-left-margin">
                          <p className="order-date">
                            <strong>
                              {new Date(usage.transactionDate).toLocaleDateString()}
                            </strong>
                          </p>
                        </div>
                        <div className="col s12 custom-left-margin">
                          <p className="order-detail">
                            <span>{usage.merchantName}</span>
                            <span className="order-amount">
                              {usage.amount.toLocaleString()} 원
                            </span>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="centered-message">결제 내역이 없습니다.</p>
                  )}
                </div>
              </div>
            ) : (
              !loading && !hasCards && <p className="centered-message">결제내역이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CardUsageHistory;
