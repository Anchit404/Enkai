import React from "react";
import api from "../utils/axios";


export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
 const[user, setUser] = React.useState(() => {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
 const[loading, setLoading] = React.useState(false);
 
React.useEffect(() => {
}, []);

const login = async (email, password) => {
 try {
  const {data} = await api.post("/auth/login", {email, password});
  setUser(data);
  sessionStorage.setItem("user", JSON.stringify(data));
  sessionStorage.setItem("token", data.token);
  return data;
 } catch (error) {
  console.error("Login failed:", error);
  throw error;
 }
};

const register = async (name, email, password) => {
    try {
        const {data} = await api.post("/auth/register", {name, email, password});
        return data;
    } catch (error) {
        console.error("Register failed:", error);
        throw error;
    }
}

const verifyOtp = async (email, otp) =>{
    try {
     const {data} = await api.post("/auth/verify-otp", { email, otp });
     setUser(data);
     sessionStorage.setItem("user", JSON.stringify(data));
     sessionStorage.setItem("token", data.token);
     return data;
    } catch (error) {
     console.error("Verify OTP failed:", error);
     throw error;
    }
}

const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
}
return (
  <AuthContext.Provider value={{ user, setUser, loading, setLoading, login, verifyOtp, logout, register }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};