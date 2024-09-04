import React, { useEffect, useState } from 'react';
import 'asset/css/bucketListStart.css'; // 스타일을 정의할 파일
import { useNavigate } from 'react-router-dom';

function BucketListStart(props) {
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 컴포넌트가 마운트된 후 애니메이션 시작
        setTimeout(() => {
            setAnimate(true);
        }, 1000); // 애니메이션 시작 전 지연 시간
    }, []);

    return (
        <div className="bucketlist-container">
            <div className={`text-wrapper ${animate ? 'animate' : ''}`}>
                <div className="text dream">여러분의 꿈</div>
                <div className="text soloplay">SOLoPlay가 응원합니다!</div>
            </div>
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
