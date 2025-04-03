"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const getUserId = () => {
        return user ? user.id : null;
    };

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}