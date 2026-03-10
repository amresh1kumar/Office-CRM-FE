import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {

   const { user, loading } = useContext(AuthContext);

   if (loading) return null;

   return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
