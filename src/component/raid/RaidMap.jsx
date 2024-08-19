import markerPic from 'asset/image/coffeeMonster.png';
import axios from 'axios';
import { useEffect, useState } from 'react';
import RaidModal from './RaidModal';
const { kakao } = window;
const style = { width: "80%", height: "500px", margin: "0 auto" };
var geocoder;
var map;
var data;

function RaidMap(props) {
    const [modalOpen, setModalOpen] = useState(false);      //모달창 상태 관리
    const [selectedData, setSelectedData] = useState(null); //선택한 마커 데이터
    useEffect(() => {       //페이지 로드 될 떄 호출
        if (kakao) {
            kakao.maps.load(() => {
                var mapContainer = document.getElementById('map'),      //지도 설정
                    mapOption = {
                        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                        level: 3 // 지도의 확대 레벨
                    };

                map = new kakao.maps.Map(mapContainer, mapOption);      // 지도를 생성
                geocoder = new kakao.maps.services.Geocoder();          //실시간 위치 조회

                if (navigator.geolocation) {        //진행중인 레이드 데이터 조회
                    axios({
                        url: "/raid/raidList",
                        method: "get"
                    }).then((response) => {
                        data = response.data;
                        response.data.map((item, index) => {
                            setLocation(index);     //마커에 데이터 index 부여
                        });
                    }).catch((error) => {
                        console.log(error);
                    });

                    navigator.geolocation.getCurrentPosition(function (position) { 
                        var lat = position.coords.latitude;     //현재 위치의 위도&경도
                        var lon = position.coords.longitude; 

                        var locPosition = new kakao.maps.LatLng(lat, lon); 
                        var message = '<div style="padding:5px;">현재 위치</div>'; 

                        displayMarker(locPosition, message);    //현재 위치 지도에 마커로 표시
                        map.setCenter(locPosition);             //지도 중심좌표를 현재 위치로 지정
                    });

                } else { 
                    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667);     //현재 위치 조회 실패했을 경우
                    var message = 'geolocation을 사용할수 없어요..';

                    displayMarker(locPosition, message);
                    map.setCenter(locPosition);
                }
            })
        }

    }, []);

    function displayMarker(locPosition, message, index = null) {        //index 주지 않는 경우, 즉 현재 위치는 index를 기본 값 null을 가진다.

        var imageSrc = markerPic;       //마커 이미지 지정
        var imageSize = new kakao.maps.Size(50, 50);    //이미지 사이즈
        var imageOption = { offset: new kakao.maps.Point(27, 69) };     //표시 할 위치
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);     //커스텀 마커 디자인 생성

        var marker = new kakao.maps.Marker({        //마커 생성
            map: map,
            position: locPosition,
            image: markerImage
        });

        marker.setMap(map);     //마커 지도에 등록

        //마커와 같이 보여줄 장소 커스텀 인포
        var content = `<div style="width:100%;text-align:center;padding:5px 10px; background-color:rgba(175, 102, 75, 0.82); color:white; font-weight:bold; border-radius:20px; border: none;">${message}</div>`;
        var customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: locPosition,
            content: content,
            yAnchor: 1
        });

        if (index !== null) {       //진행중인 레이드 마커에 클릭이벤트 등록
            kakao.maps.event.addListener(marker, 'click', function () {
                setSelectedData(data[index]); // data[index]를 선택된 데이터로 설정
                setModalOpen(true);      //모달창 열리는 이벤트 등록
            });
        }
    }

    function setLocation(index) {
        geocoder.addressSearch(data[index].merchantAddress, function (result, status) {     //선택한 장소 주소로 위도&경도 수집
            if (status === kakao.maps.services.Status.OK) {
                var locPosition = new kakao.maps.LatLng(result[0].y, result[0].x);  //장소 마커 표시할 지점 생성
                displayMarker(locPosition, data[index].merchantName, index);        //마커 등록 이벤트 호출
            }
        });
    }

        
    return (
        <div>
            <div style={style} id="map"></div>

            <RaidModal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                selectedData={selectedData}
            />
        </div>
    );
}

export default RaidMap;