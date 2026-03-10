import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../dashboard/Dashboard";
import Layout from "../layout/Layout";
import RoleRoute from "./RoleRoute";
import Users from "../users/Users";
import Leads from "../leads/Leads";
import LeadDetails from "../leads/LeadDetails";
import FollowupsPage from "../followups/FollowupsPage";
import Sales from "../sales/Sales";
import Reports from "../report/Report";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Projects from "../projects/ProjectList";

const AppRoutes = () => {
   return (
      <HashRouter>
         <Routes>
            <Route path="/" element={<Login />} />

            <Route
               path="/dashboard"
               element={
                  <Layout>
                     <Dashboard />
                  </Layout>
               }
            />

            <Route
               path="/users"
               element={
                  <RoleRoute allowedRoles={["admin"]}>
                     <Layout>
                        <Users />
                     </Layout>
                  </RoleRoute>
               }
            />

            <Route
               path="/leads"
               element={
                  <Layout>
                     <Leads />
                  </Layout>
               }
            />

            <Route
               path="/leads/:id"
               element={
                  <RoleRoute allowedRoles={["admin", "staff"]}>
                     <Layout>
                        <LeadDetails />
                     </Layout>
                  </RoleRoute>
               }
            />

            <Route
               path="/followups"
               element={
                  <RoleRoute allowedRoles={["admin", "staff"]}>
                     <Layout>
                        <FollowupsPage />
                     </Layout>
                  </RoleRoute>
               }
            />

            <Route
               path="/sales"
               element={
                  <Layout>
                     <Sales />
                  </Layout>
               }
            />

            <Route path="/reports" element={
               <Layout>
                  <Reports />
               </Layout>
            } />


            <Route path="/projects" element={
               <RoleRoute allowedRoles={["admin"]}>
                  <Layout>
                     <Projects />
                  </Layout>

               </RoleRoute>

            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />



         </Routes>
      </HashRouter >
   );
};

export default AppRoutes;
