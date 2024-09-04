import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
function Registration(props) {
    // useState를 사용하여 폼 데이터를 관리합니다.
    const [formData, setFormData] = useState({
        userId: '',
        userPassword: '',
        userName: ''
    });
    const navigate = useNavigate(); 
    // 입력 필드 값이 변경될 때마다 상태를 업데이트합니다.
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    // 폼 제출 시 호출되는 함수입니다.
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(process.env.REACT_APP_SPRING_BASE_URL);
            const response = await axios.post('/api/auth/registration', formData);
            navigate('/auth/login'); 
            alert(response.data);  // 성공 시 서버에서 받은 메시지를 알림으로 표시
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data);  // 실패 시 서버에서 받은 메시지를 알림으로 표시
            } else {
                alert('오류가 발생했습니다.');  // 기타 오류 발생 시 기본 메시지
            }
        }
    };

    return (
        <div className="register app-pages app-section">
            <div className="container">
                <div className="pages-title">
                    <h3>Register</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-field">
                        <input
                            id="userId"
                            type="text"
                            className="validate"
                            value={formData.userId}
                            onChange={handleChange}
                        />
                        <label htmlFor="userId">ID</label>
                    </div>
                    <div className="input-field">
                        <input
                            id="userPassword"
                            type="password"
                            className="validate"
                            value={formData.userPassword}
                            onChange={handleChange}
                        />
                        <label htmlFor="userPassword">비밀번호</label>
                    </div>
                    <div className="input-field">
                        <input
                            id="userName"
                            type="text"
                            className="validate"
                            value={formData.userName}
                            onChange={handleChange}
                        />
                        <label htmlFor="userName">이름</label>
                    </div>
                    <button className="button" type="submit">Register</button>
                    <strong className="login-now">You're already registered? <a href="/auth/login">Login now</a></strong>
                </form>
            </div>
        </div>
    );
}

export default Registration;
