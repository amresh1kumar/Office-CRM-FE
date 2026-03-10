import { Layout as AntLayout } from "antd";
import { useState } from "react";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

const { Sider, Content, Header } = AntLayout;


const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED = 80;

const Layout = ({ children }) => {

   const [collapsed, setCollapsed] = useState(false);

   return (
      <AntLayout className="min-h-screen">

         <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={SIDEBAR_WIDTH}
            collapsedWidth={SIDEBAR_COLLAPSED}
            theme="light"
            className="fixed left-0 top-0 bottom-0 z-50 h-screen overflow-y-auto"
            style={{
               position: "fixed",
               left: 0,
               top: 0,
               bottom: 0,
               height: "100vh",
               overflow: "auto"
            }}
         >
            <Sidebar collapsed={collapsed} />
         </Sider>

         <AntLayout
            style={{
               marginLeft: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
               transition: "margin-left 0.2s"
            }}
         >
            <Header
               className="bg-white shadow-sm p-0 z-40"
               style={{
                  position: "sticky",
                  top: 0,
                  padding: 0
               }}
            >
               <HeaderBar />
            </Header>

            <Content
               className="m-4 overflow-auto"
               style={{
                  minHeight: "calc(100vh - 64px)"
               }}
            >
               <div className="bg-white p-6 rounded-lg shadow-sm">
                  {children}
               </div>
            </Content>
         </AntLayout>

      </AntLayout>
   );
};

export default Layout;