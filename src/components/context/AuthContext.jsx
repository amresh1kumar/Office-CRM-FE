import { createContext, useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const logoutTimer = useRef(null);

   useEffect(() => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
         setUser(JSON.parse(storedUser));
         handleToken(token);
      }

      setLoading(false);   //ye page refresh karne pe login page pe nhi redirect krega
   }, []);


   const login = (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      handleToken(data.token);
   };

   const logout = () => {

      if (logoutTimer.current) {
         clearTimeout(logoutTimer.current);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
   };

   const handleToken = (token) => {
      try {
         const decoded = jwtDecode(token);
         const expiryTime = decoded.exp * 1000;
         const currentTime = Date.now();

         if (expiryTime <= currentTime) {
            logout();
         } else {
            const timeout = expiryTime - currentTime;

            logoutTimer.current = setTimeout(() => {
               logout();
            }, timeout);
         }

      } catch (err) {
         logout();
      }
   };

   return (
      <AuthContext.Provider value={{ user, login, logout, loading }}>
         {children}
      </AuthContext.Provider>
   );
};
