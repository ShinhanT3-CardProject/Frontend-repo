import React, { useState, useEffect } from 'react';
import 'asset/css/LoadingGame.css';
import characterImage from 'asset/image/king100.png';
import hitEffectImage from 'asset/image/hitEffect.png';

function LoadingGame({ loadingTime = 10000, onComplete, onSkip }) {
    const [score, setScore] = useState(0);
    const [position, setPosition] = useState({ top: '50%', left: '50%' });
    const [timeLeft, setTimeLeft] = useState(loadingTime);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const [hitEffect, setHitEffect] = useState(null); // 맞는 이펙트 상태 관리

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsLoadingComplete(true);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1000);
            setPosition({
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleCharacterClick = () => {
        if (!isLoadingComplete) {
            setScore((prevScore) => prevScore + 1);
            setPosition({
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
            });
            // 맞는 이펙트 표시
            setHitEffect({ top: position.top, left: position.left });
            // 이펙트를 잠시 후에 제거
            setTimeout(() => setHitEffect(null), 500);
        }
    };

    return (
        <div className="loading-game-container">
            {!isLoadingComplete ? (
                <>
                    <div className="score-board">점수: {score}</div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${
                                    ((loadingTime - timeLeft) / loadingTime) * 100
                                }%`,
                            }}
                        />
                    </div>
                    <img
                        src={characterImage}
                        alt="캐릭터"
                        className="game-character"
                        style={position}
                        onClick={handleCharacterClick}
                    />
                    {hitEffect && (
                        <img
                            src={hitEffectImage}
                            alt="Hit Effect"
                            className="hit-effect"
                            style={{ top: hitEffect.top, left: hitEffect.left }}
                        />
                    )}
                    <p className="loading-text">앗, 야생의 슬라임이 나타났다!</p>
                    <p className="loading-text">슬라임으로부터 버킷리스트를 지켜내세요!!</p>
                    <button className="skip-button" onClick={onSkip}>Skip</button>
                </>
            ) : (
                <div className="loading-complete">
                    <h2>분석 완료!</h2>
                    <p>최종 점수: {score}</p>
                    <button className="result-button" onClick={onComplete}>
                        분석 결과 확인하기
                    </button>
                </div>
            )}
        </div>
    );
}

export default LoadingGame;