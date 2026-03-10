import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// const RoleRoute = ({ children, allowedRoles }) => {
//    const { user } = useContext(AuthContext);

//    if (!user) return <Navigate to="/" />;

//    if (!allowedRoles.includes(user.role)) {
//       return <Navigate to="/dashboard" />;
//    }

//    return children;
// };

const RoleRoute = ({ children, allowedRoles }) => {
   const { user, loading } = useContext(AuthContext);

   if (loading) return null;   // wait until auth loads

   if (!user) return <Navigate to="/" />;

   if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
   }

   return children;
};



export default RoleRoute;
