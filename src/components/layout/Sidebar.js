import { Menu } from "antd";
import {
   DashboardOutlined,
   UserOutlined,
   TeamOutlined,
   DollarOutlined,
   SettingOutlined,
   CalendarOutlined,
   FileTextOutlined,
   CustomerServiceOutlined,
   BarChartOutlined,
   ProjectOutlined
} from "@ant-design/icons";
import { FaHandshake } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ collapsed }) => {

   const location = useLocation();
   const navigate = useNavigate();
   const { user } = useContext(AuthContext);

   if (!user) return null;

   const items = [
      {
         key: "/dashboard",
         icon: <DashboardOutlined />,
         label: <Link to="/dashboard">Dashboard</Link>
      },
      {
         key: "/leads",
         icon: <TeamOutlined />,
         label: <Link to="/leads">Leads</Link>
      },
      user?.role === "admin" && {
         key: "/projects",
         icon: <ProjectOutlined />,
         label: <Link to="/projects">Projects</Link>

      },
      {
         key: "/followups",
         icon: <CalendarOutlined />,
         label: <Link to="/followups">Follow-ups</Link>
      },
      {
         key: "/sales",
         icon: <DollarOutlined />,
         label: <Link to="/sales">Sales</Link>
      },
      user?.role === "admin" && {
         key: "/users",
         icon: <UserOutlined />,
         label: <Link to="/users">Users</Link>
      },

      {
         key: "/reports",
         icon: <BarChartOutlined />,
         label: "Reports"
      },

      // {
      //    key: "/pipeline",
      //    icon: <ProjectOutlined />,
      //    label: "Pipeline",
      // }

      // user?.role === "admin" && {
      //    key: "/settings",
      //    icon: <SettingOutlined />,
      //    label: <Link to="/settings">Settings</Link>
      // }
   ].filter(Boolean);

   return (
      <div className="h-full flex flex-col">

         <div className="h-16 flex items-center justify-center  border-b border-gray-100">
            {collapsed ? (
               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SP</span>
               </div>
            ) : (
               <div className="flex items-center gap-2">

                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                     <FaHandshake className="text-white text-lg" />
                  </div>

                  {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                     <span className="text-white font-bold text-xl">SP</span>
                  </div> */}
                  <div>
                     <h1 className="text-black font-bold text-lg m-0 leading-tight">
                        SP Advertising
                     </h1>
                     <p className="text-gray-400 text-xs m-0">
                        Lead Management
                     </p>
                  </div>
               </div>

            )}
         </div>

         {/* Menu */}
         <Menu
            theme="light"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={(e) => navigate(e.key)}
            className="flex-1 border-r-0"
         />

      </div>
   );
};

export default Sidebar;