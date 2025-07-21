import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [registeredUsers, setRegisteredUsers] = useState([]);

    const registerUser = (userData) => {
        setRegisteredUsers(prevUsers => [...prevUsers, userData]);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, registeredUsers, registerUser }}>
            {children}
        </AuthContext.Provider>
    );
}