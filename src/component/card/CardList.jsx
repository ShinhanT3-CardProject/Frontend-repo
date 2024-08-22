import React, { useEffect, useState } from "react";
import "asset/css/cardlist.css";

function CardList() {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

  useEffect(() => {
    fetch("/card/list")
      .then((response) => response.json())
      .then((data) => setCards(data))
      .catch((error) => console.error("Error fetching cards:", error));
  }, []);

  // 검색어에 따라 카드 필터링 (카드 이름과 혜택 모두를 기준으로)
  const filteredCards = cards.filter((card) =>
    card.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.cardBenefit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 카드 이미지 URL 생성 함수
  const getCardImageUrl = (cardId) => {
    return `https://soloplaybucket.s3.ap-northeast-2.amazonaws.com/${cardId}.gif`;
  };

  return (
    <>
      <div className="app-pages app-section">
        <div className="container">
          <div className="pages-title">
            <h2 style={{ textAlign: "left", lineHeight: 1.5 }}>
              신한카드
            </h2>
            <hr style={{ marginTop: "20px", marginBottom: "20px" }} />
          </div>

          {/* 검색어 입력 필드 */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="카드 이름 또는 혜택으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="card-grid">
            {filteredCards.map((card) => (
              <div key={card.cardId} className="card-item">
                <img
                  src={getCardImageUrl(card.cardId)} // 카드 ID에 따라 이미지 URL 설정
                  alt={card.cardName}
                  className="card-image"
                />
                <div className="card-content">
                  <h5>
                    <a
                      href={card.cardLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-link"
                    >
                      {card.cardName}
                    </a>
                  </h5>
                  <p>
                    <a
                      href={card.cardLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-link"
                    >
                      {card.cardBenefit}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CardList;
