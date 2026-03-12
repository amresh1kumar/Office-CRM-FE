// import { createContext, useState, useEffect, useRef } from "react";
// import { jwtDecode } from "jwt-decode";


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//    const [user, setUser] = useState(null);
//    const [loading, setLoading] = useState(true);
//    const logoutTimer = useRef(null);

//    useEffect(() => {
//       const token = localStorage.getItem("token");
//       const storedUser = localStorage.getItem("user");

//       if (token && storedUser) {
//          setUser(JSON.parse(storedUser));
//          handleToken(token);
//       }

//       setLoading(false);   //ye page refresh karne pe login page pe nhi redirect krega
//    }, []);


//    const login = (data) => {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setUser(data.user);
//       handleToken(data.token);
//    };

//    const logout = () => {

//       if (logoutTimer.current) {
//          clearTimeout(logoutTimer.current);
//       }

//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       setUser(null);
//    };

//    const handleToken = (token) => {
//       try {
//          const decoded = jwtDecode(token);
//          const expiryTime = decoded.exp * 1000;
//          const currentTime = Date.now();

//          if (expiryTime <= currentTime) {
//             logout();
//          } else {
//             const timeout = expiryTime - currentTime;

//             logoutTimer.current = setTimeout(() => {
//                logout();
//             }, timeout);
//          }

//       } catch (err) {
//          logout();
//       }
//    };

//    return (
//       <AuthContext.Provider value={{ user, login, logout, loading }}>
//          {children}
//       </AuthContext.Provider>
//    );
// };


import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const logoutTimer = useRef(null);

   // Logout function with cleanup
   const logout = useCallback(() => {
      if (logoutTimer.current) {
         clearTimeout(logoutTimer.current);
         logoutTimer.current = null;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
   }, []);

   // Token validation
   const validateAndSetTimer = useCallback((token) => {
      try {
         const decoded = jwtDecode(token);
         const expiryTime = decoded.exp * 1000;
         const currentTime = Date.now();
         const timeUntilExpiry = expiryTime - currentTime;

         if (timeUntilExpiry <= 0) {
            logout();
            return false;
         }

         // Clear existing timer if any
         if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
         }

         // Set new timer
         logoutTimer.current = setTimeout(() => {
            logout();
         }, timeUntilExpiry);

         return true;
      } catch (err) {
         console.error("Token validation error:", err);
         logout();
         return false;
      }
   }, [logout]);

   // Initial load effect
   useEffect(() => {
      const initAuth = () => {
         const token = localStorage.getItem("token");
         const storedUser = localStorage.getItem("user");

         if (token && storedUser) {
            try {
               const userData = JSON.parse(storedUser);
               if (validateAndSetTimer(token)) {
                  setUser(userData);
               }
            } catch (err) {
               console.error("Error parsing user data:", err);
               logout();
            }
         }

         setLoading(false);
      };

      initAuth();
   }, [validateAndSetTimer, logout]);

   // Login function
   const login = useCallback((data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      validateAndSetTimer(data.token);
   }, [validateAndSetTimer]);

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
         }
      };
   }, []);

   return (
      <AuthContext.Provider value={{ user, login, logout, loading }}>
         {children}
      </AuthContext.Provider>
   );
};