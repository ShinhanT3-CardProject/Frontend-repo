import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'asset/css/bucketList.css';
import { analyzeTheme } from 'asset/js/api';
import LoadingGame from './LoadingGame';

function ThemeBucketList(props) {
    const [bucketList, setBucketList] = useState(['', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null); // 분석 결과 저장
    const navigate = useNavigate();

    const handleInputChange = (index, event) => {
        const newBucketList = [...bucketList];
        newBucketList[index] = event.target.value;
        setBucketList(newBucketList);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Submitted Bucket List:', bucketList);

        setIsLoading(true);
        try {
            const analysisResult = await analyzeTheme(bucketList);
            setResult(analysisResult); // 분석 결과 저장
        } catch (error) {
            console.error('테마 분석 중 오류 발생:', error);
            setIsLoading(false);
        }
    };

    const handleLoadingComplete = () => {
        if (result) {
            navigate('/analyzetheme', {
                state: {
                    theme: result.theme,
                    reason: result.details.join('\n'),
                },
            });
        }
    };

    const handleSkip = () => {
        setIsLoading(false);
        handleLoadingComplete();
    };

    if (isLoading) {
        return (
            <LoadingGame
                onComplete={handleLoadingComplete}
                onSkip={handleSkip}
            />
        );
    }

    return (
        <div className="bucketlist-container">
            <div className="bucketlist-form-wrapper">
                <h2 className="bucketlist-title">나의 버킷리스트</h2>
                <form onSubmit={handleSubmit} className="bucketlist-form">
                    {bucketList.map((item, index) => (
                        <div key={index} className="bucketlist-input-group">
                            <label className="bucketlist-label">
                                항목 {index + 1}:
                            </label>
                            <input
                                type="text"
                                value={item}
                                onChange={(event) =>
                                    handleInputChange(index, event)
                                }
                                className="bucketlist-input"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="bucketlist-submit-button"
                    >
                        제출하기
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ThemeBucketList;
