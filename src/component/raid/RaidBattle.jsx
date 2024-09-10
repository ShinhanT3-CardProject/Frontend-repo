import React, { useEffect, useRef, useState } from 'react';
import raidBackground from "asset/image/raidBackground.jpg";
import slimeWeak from "asset/image/slime25.png";
import slimeHalf from "asset/image/slime50.png";
import slimeWounded from "asset/image/slime75.png";
import slime from "asset/image/slime100.png";
import kingWeak from "asset/image/king25.png";
import kingHalf from "asset/image/king50.png";
import kingWounded from "asset/image/king75.png";
import king from "asset/image/king100.png";
import "asset/css/raidBattle.css";
import { useParams } from 'react-router-dom';
import axios from 'axios';

function RaidBattle() {
    const { raidId } = useParams();
    const [battleData, setBattleData] = useState(null);
    const [participantId, setParticipantId] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
    const attackLogRef = useRef(null);

    // 최초 로드 시 배틀 데이터 요청
    useEffect(() => {
        const fetchBattleData = async () => {
            try {
                const response = await axios.get(`/api/raid/battle/${raidId}`);
                const data = response.data;
                setBattleData(data);
                
                // 배틀 데이터에서 participantId를 추출하여 상태를 업데이트
                if (data.participants && data.participants.length > 0) {
                    setParticipantId(data.participants[data.participants.length-1].participantId);
                }
                setIsLoading(false); // 데이터 로드 후 로딩 상태 해제
            } catch (error) {
                console.error('Error fetching battle data:', error);
            }
        };

        fetchBattleData();
    }, [raidId]);

    useEffect(() => {
        // battleData가 변경될 때마다 스크롤을 가장 아래로 이동
        if (attackLogRef.current) {
          attackLogRef.current.scrollTop = attackLogRef.current.scrollHeight;
        }
      }, [battleData]);

    // 주기적으로 알림 데이터 요청
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`/api/raid/notification/${raidId}/${participantId}`);
                const data = response.data;

                // 기존 battleData.participants에 알림 데이터를 추가하여 병합
                setBattleData(prevData => ({
                    ...data,
                    participants: [
                        ...prevData.participants,
                        ...data.participants
                    ],
                    contribution: data.contribution,
                    buff: prevData.buff
                }));

                if (data.participants && data.participants.length > 0) {
                    setParticipantId(data.participants[data.participants.length-1].participantId);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        const intervalId = setInterval(fetchNotifications, 5000); // 5초마다 알림 요청

        // 컴포넌트 언마운트 시 클린업
        return () => clearInterval(intervalId);
    }, [raidId, participantId]);

    const getImageSrc = () => {
        let ratio = battleData.raid.hitPoint / battleData.raid.totalHitPoint;
        if (battleData.raid.totalHitPoint <= 100000) {
            if (ratio > 0.75) {
                return slime;
            } else if (ratio > 0.5) {
                return slimeWounded;
            } else if (ratio > 0.25) {
                return slimeHalf;
            } else if (ratio > 0 ) {
                return slimeWeak;
            } else {
                return null;
            }
        } else {
            if (ratio > 0.75) {
                return king;
            } else if (ratio > 0.5) {
                return kingWounded;
            } else if (ratio > 0.25) {
                return kingHalf;
            } else if (ratio > 0 ) {
                return kingWeak;
            } else {
                return null;
            }
        }
            
      };

    if (isLoading) {
        return <p>Loading battle data...</p>; // 데이터 로드 중일 때 로딩 메시지 표시
    }

    return (
        <div className="raidContainer">
            <div className="healthInformation">
                <div className="healthBarContainer">
                    <div
                        className="healthBar"
                        style={{ width: `${battleData.raid.hitPoint/battleData.raid.totalHitPoint*100}%` }}
                    ></div>
                </div>
                HP : {battleData.raid.hitPoint.toLocaleString()} / {battleData.raid.totalHitPoint.toLocaleString()}
            </div>
            <div className="raidInformation">
                <div className="monsterDisplay">
                    <img src={raidBackground} alt='Raid Background' className='raidBackground'/>
                    <img src={getImageSrc()} alt="Monster" className='monster'/>
                </div>
                <div className="raidUserContribution">
                    <p>『내 정보』</p>
                    <p>⚔️ 내가 준 피해량: {battleData.contribution.toLocaleString()}</p>
                    <p>✨ 테마 달성 보너스: x{battleData.buff}</p>
                    <p>💰 성공 시 보상: {Math.floor(battleData.raid.reward * battleData.contribution / battleData.raid.totalHitPoint).toLocaleString()}P</p>
                </div>
                <div className="attackLog" ref={attackLogRef}>
                    {battleData.participants.map((participant, index) => (
                        <p key={index}>
                            🗡️ {participant.userId} 님이 {participant.contribution.toLocaleString()} 피해를 입혔습니다. 
                        </p>
                    ))}
                </div>
            </div>
        </div>   
    );
}

export default RaidBattle;
