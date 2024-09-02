import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'asset/css/bucketList.css';
import { analyzeTheme } from 'asset/js/api';
import LoadingSpinner from './LoadingSpinner'; // 로딩 스피너 컴포넌트 임포트

function ThemeBucketList(props) {
    const [bucketList, setBucketList] = useState(['', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
    const navigate = useNavigate();

    const handleInputChange = (index, event) => {
        const newBucketList = [...bucketList];
        newBucketList[index] = event.target.value;
        setBucketList(newBucketList);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Submitted Bucket List:', bucketList);

        setIsLoading(true); // 로딩 시작
        try {
            const result = await analyzeTheme(bucketList);
            setIsLoading(false); // 로딩 끝
            navigate('/analyzetheme', { state: { theme: result.theme, reason: result.details.join('\n') } });
        } catch (error) {
            console.error('테마 분석 중 오류 발생:', error);
            setIsLoading(false); // 로딩 끝
        }
    };

    if (isLoading) {
        return <LoadingSpinner />; // 로딩 중일 때 로딩 스피너 표시
    }

    return (
        <div className="bucketlist-container">
            <div className="bucketlist-form-wrapper">
                <h2 className="bucketlist-title"> 나의 버킷리스트</h2>
                <form onSubmit={handleSubmit} className="bucketlist-form">
                    {bucketList.map((item, index) => (
                        <div key={index} className="bucketlist-input-group">
                            <label className="bucketlist-label">
                                항목 {index + 1}:
                            </label>
                            <input
                                type="text"
                                value={item}
                                onChange={(event) => handleInputChange(index, event)}
                                className="bucketlist-input"
                            />
                        </div>
                    ))}
                    <button type="submit" className="bucketlist-submit-button">제출하기</button>
                </form>
            </div>
        </div>
    );
}

export default ThemeBucketList;
