import React from 'react';
import git from "asset/image/github.jpg";

function Footer(props) {
    return (
        <div>
            <footer>
                <div className="container">
                    <h6>SOLoPlay</h6>
                    <p>[ 소비를 게임처럼 ]</p>
                    <div className="tel-fax-mail">
                        <ul>
                            <li>
                                <a href='https://github.com/ShinhanT3-CardProject'>
                                    <img src={git} alt="GitHub" />
                                </a>
                            </li>
                            <div className="separator"></div> {/* 세로선 추가 */}
                            <div className="developer-container">
                                <div className="developer-list">
                                    <li>김시형</li>
                                    <li>김혜진</li>
                                    <li>심은정</li>
                                    <li>양준성</li>
                                    <li>이종경</li>
                                    <li>조윤재</li>
                                    <li>최재명</li>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className="ft-bottom">
                    <span>@SHDS3-6 삼은정조 SOLOPLAY 프로젝트</span>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
