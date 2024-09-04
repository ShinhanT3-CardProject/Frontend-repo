import axios from 'axios';
import React, { useEffect, useState } from 'react';
import HistoryCard from './HistoryCard';
import slime100 from "asset/image/slime100.png";
import king100 from "asset/image/king100.png";
function RaidHistory(props) {
    const [history, setHistory] = useState([]);


    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyDataMap = new Map(); // raid_id를 키로 사용하기 위해 Map을 사용
                
                // 1차 데이터 가져오기
                const response = await axios.get('/api/raid/raidHistory');
                
                // 2차 데이터 가져오기 (모든 데이터 가져올 때까지 대기)
                const promises = response.data.map(async (item) => {
                    const params = { raidId: item.raidId };
                    const detailResponse = await axios.get('/api/raid/raidHistory/detail', { params });
                    const data = detailResponse.data;
    
                    // 기존에 raid_id가 있는지 확인
                    if (historyDataMap.has(item.raidId)) {
                        const existingItem = historyDataMap.get(item.raidId);
    
                        // contribution을 합산
                        existingItem.contribution += item.contribution;
    
                        // percentage 재계산
                        existingItem.percentage = Math.floor((existingItem.contribution / data.totalHitPoint) * 100);
                        
                        // isRewarded와 같은 단일 필드는 조건에 따라 업데이트
                        if (!existingItem.isRewarded) {
                            existingItem.isRewarded = item.isRewarded;
                        }
                    } else {
                        // Map에 새로운 항목 추가
                        historyDataMap.set(item.raidId, {
                            merchantName: data.merchantName,
                            contribution: item.contribution,
                            percentage: Math.floor((item.contribution / data.totalHitPoint) * 100),
                            startTime: data.startTime,
                            endTime: data.endTime,
                            isRewarded: item.isRewarded,
                            image: data.totalHitPoint > 100000 ? king100 : slime100,
                            isSuccess: data.isSuccess,
                            raidId: item.raidId,
                        });
                    }
                });
    
                // 모든 비동기 작업이 완료될 때까지 기다림
                await Promise.all(promises);
    
                // Map을 배열로 변환하여 상태 업데이트
                const historyData = Array.from(historyDataMap.values());
                setHistory(historyData);
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchHistory();
    }, []);
    
    return (
        <div>
            <h5 className='history-title'>[레이드 참여내역 조회]</h5>
            <div className="raid-card-wrapper">
                {history.map((item, index) => (
                    <HistoryCard key={index} {...item} />
                ))}
            </div>
        </div>
    );
}

export default RaidHistory;
