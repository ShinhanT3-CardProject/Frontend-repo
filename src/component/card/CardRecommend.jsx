import React from 'react';
import "asset/css/cardrecommend.css";

function CardRecommend() {
  const cards = [
    {
      id: 1,
      name: '신한카드 Point Plan+',
      benefit: '일상 생활비 0.7~3% 적립/주말 외식비 최대 5천 포인트 적립/교통·통신·OTT 최대 1만2천 포인트 적립',
      imageUrl: 'https://soloplaybucket.s3.ap-northeast-2.amazonaws.com/1.png',
    },
    {
      id: 2,
      name: '신한카드 Point Plan',
      benefit: '일상생활비 0.5~3% 적립/주말 외식비 포인트 적립/정기결제 자동납부 포인트 적립',
      imageUrl: 'https://soloplaybucket.s3.ap-northeast-2.amazonaws.com/2.png',
    },
    {
      id: 3,
      name: '신한카드 처음',
      benefit: '음식·생활·패션 5% 적립/통신·구독·멤버십 최대 20% 적립/소비관리 보너스 매월 최대 1만P',
      imageUrl: 'https://soloplaybucket.s3.ap-northeast-2.amazonaws.com/3.png',
    },
  ];

  return (
    <div className="recommendation-container">
      <div className="recommendation-header">
        <h2>
          <span className="highlight">생활</span> 테마를 선택한 <br />
          <span className="highlight">USER</span> 님에게<br />
          딱 어울리는 카드는
        </h2>
      </div>
      <div className="card-list">
        {cards.map((card) => (
          <div key={card.id} className="card-item">
            <img src={card.imageUrl} alt={card.name} className="card-image" />
            <div className="card-content">
              <h3>{card.name}</h3>
              <p>{card.benefit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardRecommend;
