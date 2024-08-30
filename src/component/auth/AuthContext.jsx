import React, { createContext, useState } from 'react';

// AuthContext를 생성합니다.
export const AuthContext = createContext();

// AuthProvider 컴포넌트를 생성하여 전역적으로 상태를 관리할 수 있도록 합니다.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};