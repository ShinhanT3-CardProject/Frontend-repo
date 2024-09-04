import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'asset/css/ThemeResultPage.css';
import axios from 'axios';
import Modal from 'react-modal';
import ThemedBalloons from './ThemedBalloons';

Modal.setAppElement('#root');

function ThemeAnalyzeResult(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, reason } = location.state || { theme: '테마 없음', reason: '이유 없음' };
    const [subcategories, setSubcategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const reasonsArray = reason.split("\n");

    // 테마별 강조할 키워드 목록
    const themeKeywords = {
        "생활": ["집", "청소", "정리", "가전", "생활용품", "편의점", "마트", "미용"],
        "쇼핑": ["구매", "쇼핑", "할인", "세일", "상점", "거래"],
        "외식/카페": ["음식", "식사", "레스토랑", "카페", "커피", "한식"],
        "문화/교육": ["영화", "공연", "책", "교육", "강의", "문화", "문화재", "유적지"],
        "여행/교통": ["여행", "교통", "비행기", "기차", "숙소", "탐험", "시야"]
    };

    // reason에서 키워드를 강조하는 함수
    const highlightKeywordsInReason = (text, theme) => {
        const keywords = themeKeywords[theme] || [];
        const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) => 
            keywords.some(keyword => new RegExp(keyword, 'gi').test(part)) ? (
                <span key={index} className="highlighted">{part}</span>
            ) : (
                part
            )
        );
    };

    const highlightedReasons = reasonsArray.map(line => highlightKeywordsInReason(line, theme));

    const handleRecommendTheme = async () => {
        try {
            const response = await axios.post('/api/theme/recommend', {
                theme: theme,
                details: reason.split("\n")
            });
            setSubcategories(response.data.subCategories || []);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error recommending subcategories:", error);
            setSubcategories([]);
        }
    };

    const handleRegisterTheme = () => {
        navigate('/themeRegister', {
            state: {
                theme: subcategories.join(", "),
                reason: reason,
                mainCategory: theme
            }
        });
    };

    const handleRetry = () => {
        navigate('/bucketlist');
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="theme-result-container">
            <section className="result-section">
                <h2 className="result-theme">분석 결과 : {theme} 테마</h2>
                <ThemedBalloons reasons={highlightedReasons} />
                <div className="button-group">
                    <button className="register-button" onClick={handleRecommendTheme}>
                        소분류 테마 확인하기
                    </button>
                </div>
            </section>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="소분류 테마"
                className="Modal"
                overlayClassName="Overlay"
            >
                <h3 className="subcategory-title">추천된 소분류 항목</h3>
                <ul className="subcategory-list">
                    {subcategories.map((subcategory, index) => (
                        <li key={index}>{subcategory}</li>
                    ))}
                </ul>
                <div className="modal-button-group">
                    <button className="register-button" onClick={handleRegisterTheme}>
                        테마 등록하기
                    </button>
                    <button className="retry-button" onClick={handleRetry}>
                        재추천 받기
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default ThemeAnalyzeResult;
