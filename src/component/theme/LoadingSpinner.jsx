import React from 'react';
import 'asset/css/LoadingSpinner.css'; // 스타일 시트 경로에 맞게 변경

function LoadingSpinner() {
    return (
        <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p className="loading-text">분석 중입니다. 잠시만 기다려 주세요...</p>
        </div>
    );
}

export default LoadingSpinner;
