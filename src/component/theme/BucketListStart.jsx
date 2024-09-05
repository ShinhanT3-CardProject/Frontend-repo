import React, { useEffect, useState } from 'react';
import 'asset/css/bucketListStart.css'; // 스타일 정의
import { useNavigate } from 'react-router-dom';
import noteImage from 'asset/image/writeNote.png';
import aiImage from 'asset/image/airobot.png';
import monsterImage from 'asset/image/king100.png';

function BucketListStart() {
    const [currentStep, setCurrentStep] = useState(0); // 현재 단계 인덱스
    const [animate, setAnimate] = useState(false); // 애니메이션 상태
    const [slidesVisible, setSlidesVisible] = useState(false); // 슬라이드 보이기 상태
    const navigate = useNavigate();

    // 튜토리얼 단계 데이터
    const steps = [
        {
            image: noteImage, // 이미지 경로
            description: "여러분의 버킷리스트를 작성해보세요!"
        },
        {
            image: aiImage,
            description: "버킷리스트를 분석하여 소비 패턴에 맞는 테마를 추천해드립니다."
        },
        {
            image: monsterImage,
            description: "장난기 가득한 몬스터가 방해하러 옵니다. 몬스터로부터 버킷리스트를 지켜내주세요!"
        }
    ];

        // 애니메이션이 끝나면 슬라이드를 보여주는 함수
        useEffect(() => {
            setTimeout(() => {
                setAnimate(true);
            }, 1000); // 애니메이션 시작 전 지연 시간
    
            setTimeout(() => {
                setSlidesVisible(true); // 애니메이션 종료 후 슬라이드 표시
            }, 3000); // 애니메이션이 끝난 후 슬라이드가 보이게 지연
        }, []);

    // 슬라이드 이동 함수
    const handleNextStep = () => {
        setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
    };

    const handlePrevStep = () => {
        setCurrentStep((prevStep) => (prevStep - 1 + steps.length) % steps.length);
    };

    return (
        <div className="bucketlist-container">
            {!slidesVisible ? (
            // 애니메이션이 끝나기 전
                <div className={`text-wrapper ${animate ? 'animate' : ''}`}>
                <div className="text dream">여러분의 꿈</div>
                <div className="text soloplay">SOLoPlay가 응원합니다!</div>
                </div>
            ) : (
            <div className="tutorial-slide">
                {/* 슬라이드 이미지 및 텍스트 */}
                <div className="slide-content">
                    {/* 왼쪽 화살표 버튼 */}
                    <button className="prev-button" onClick={handlePrevStep}>&lt;</button>
                    <img src={steps[currentStep].image} alt="설명 이미지" className="tutorial-image" />
                    {/* 오른쪽 화살표 버튼 */}
                    <button className="next-button" onClick={handleNextStep}>&gt;</button>
                    <h2 className="tutorial-title">{steps[currentStep].title}</h2>
                    <p className="tutorial-description">{steps[currentStep].description}</p>
                </div>

            </div>
            )}
            {/* 버킷리스트 작성 버튼 */}
            <button 
                className="bucketlist-button" 
                onClick={() => navigate('/bucketlist')}
            >
                버킷리스트 작성하기
            </button>
        </div>
    );
}

export default BucketListStart;
