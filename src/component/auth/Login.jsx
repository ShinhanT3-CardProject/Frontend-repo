import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from './AuthContext';

function Login(props) {
    const [formData, setFormData] = useState({
        userId: '',
        userPassword: ''
    });
    const { setUser } = useContext(AuthContext); // Context에서 setUser 함수 가져오기
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
    
            // 로그인 성공 시 사용자 정보를 세션 스토리지에 저장하고 상태 업데이트
            if (response.status === 200 && response.data.user) {
                sessionStorage.setItem('user', JSON.stringify(response.data.user)); // 사용자 정보 저장
                setUser(response.data.user); // 사용자 상태 업데이트
                navigate('/');  // navigate 함수를 사용해 "/" 경로로 이동
            } else {
                console.error("User data is undefined in the response");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert('오류가 발생했습니다.');
            }
            navigate('/auth/login');
        }
    };
    
    return (
        <div className="login app-pages app-section">
            <div className="container">
                <div className="pages-title">
                    <h3>Login</h3>
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
                        <label htmlFor="userPassword">Password</label>
                    </div>
                    <button className="button" type="submit">Login</button>
                    <div className="create-account">Not Registered? <a href="/auth/registration">Create an account</a></div>
                </form>
            </div>
        </div>
    );
}

export default Login;
