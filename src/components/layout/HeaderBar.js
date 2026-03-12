// import { io } from "socket.io-client";
// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { Button, Badge, Dropdown, Modal, message } from "antd";
// import { BellOutlined } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "../../api/axios";

// const HeaderBar = () => {

//    const { user, logout } = useContext(AuthContext);
//    const navigate = useNavigate();
//    const [notifications, setNotifications] = useState([]);
//    // const [socket, setSocket] = useState(null);
//    const [timeLeft, setTimeLeft] = useState(null);
//    const [warningShown, setWarningShown] = useState(false);

//    /* ================= SOCKET ================= */

//    useEffect(() => {

//       const newSocket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");
//       // setSocket(newSocket);

//       if (user?.id) {
//          newSocket.emit("joinRoom", user.id);
//       }

//       newSocket.on("newNotification", () => {
//          fetchNotifications();
//       });

//       return () => newSocket.disconnect();

//    }, [user]);

//    /* ================= SESSION TIMER ================= */

//    useEffect(() => {

//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const expiryTime = payload.exp * 1000;

//       const interval = setInterval(() => {

//          const remaining = expiryTime - Date.now();

//          if (remaining <= 0) {
//             clearInterval(interval);
//             setTimeLeft("00:00");
//             return;
//          }

//          const minutes = Math.floor(remaining / 60000);
//          const seconds = Math.floor((remaining % 60000) / 1000);

//          setTimeLeft(
//             `${minutes.toString().padStart(2, "0")}:${seconds
//                .toString()
//                .padStart(2, "0")}`
//          );

//          if (remaining <= 60000 && !warningShown) {
//             message.warning("⚠️ Session will expire in 1 minute!");
//             setWarningShown(true);
//          }

//       }, 1000);

//       return () => clearInterval(interval);

//    }, [warningShown]);

//    /* ================= FETCH ================= */

//    const fetchNotifications = () => {
//       axios.get("/notifications")
//          .then(res => setNotifications(res.data))
//          .catch(err => console.log(err));
//    };

//    useEffect(() => {
//       fetchNotifications();
//    }, []);

//    /* ================= MARK SINGLE ================= */

//    const handleMarkAsRead = (id) => {
//       axios.put(`/notifications/${id}/read`)
//          .then(() => {
//             setNotifications(prev =>
//                prev.map(n =>
//                   n.id === id ? { ...n, is_read: 1 } : n
//                )
//             );
//          });
//    };

//    /* ================= MARK ALL ================= */

//    const handleMarkAllRead = async () => {
//       try {
//          // 🔥 FIX: route corrected
//          const res = await axios.get("/notifications");
//          const all = res.data;

//          await Promise.all(
//             all.map(n =>
//                axios.put(`/notifications/${n.id}/read`)
//             )
//          );

//          setNotifications(prev =>
//             prev.map(n => ({ ...n, is_read: 1 }))
//          );

//       } catch (err) {
//          console.log(err);
//       }
//    };

//    /* ================= CLEAR ALL ================= */

//    const handleClearAll = () => {
//       Modal.confirm({
//          title: "Are you sure?",
//          content: "Do you want to clear all notifications?",
//          okText: "Yes",
//          cancelText: "Cancel",
//          onOk: async () => {
//             await axios.delete("/notifications/clear-all");
//             message.success("All notifications cleared");
//             fetchNotifications();
//          }
//       });
//    };

//    const notificationItems =
//       notifications.length > 0
//          ? [
//             {
//                key: "actions",
//                label: (
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                      <span
//                         style={{ color: "#1890ff", cursor: "pointer" }}
//                         onClick={handleMarkAllRead}
//                      >
//                         Mark All Read
//                      </span>

//                      <span
//                         style={{ color: "red", cursor: "pointer" }}
//                         onClick={handleClearAll}
//                      >
//                         Clear All
//                      </span>
//                   </div>
//                )
//             },
//             {
//                type: "divider"
//             },
//             ...notifications.map(item => ({
//                key: item.id,
//                label: (
//                   <div
//                      onClick={() => handleMarkAsRead(item.id)}
//                      style={{
//                         background: item.is_read ? "#fff" : "#f6ffed",
//                         padding: "8px"
//                      }}
//                   >
//                      <div>{item.message}</div>
//                      <small style={{ color: "#888" }}>
//                         {new Date(item.created_at).toLocaleString()}
//                      </small>
//                   </div>
//                )
//             }))
//          ]
//          : [
//             {
//                key: "empty",
//                label: <div style={{ padding: 8 }}>No notifications</div>
//             }
//          ];

//    const handleLogout = () => {
//       logout();
//       navigate("/");
//    };

//    return (
//       <div className="h-16 bg-white shadow flex justify-between items-center px-6">

//          <h2 className="text-lg font-semibold">
//             Welcome, {user?.name}
//          </h2>

//          <div className="flex items-center gap-6">

//             <div style={{ fontSize: "13px", color: "#888" }}>
//                Session out : {timeLeft}
//             </div>

//             <Dropdown

//                menu={{
//                   items: notificationItems,
//                   style: { maxHeight: 300, overflowY: "auto" }
//                }}
//                trigger={["click"]}
//                placement="bottomRight"
//             >
//                <Badge
//                   count={notifications.filter(n => !n.is_read).length}
//                   overflowCount={9}
//                >
//                   <BellOutlined
//                      style={{
//                         fontSize: 22,
//                         cursor: "pointer"
//                      }}
//                   />
//                </Badge>
//             </Dropdown>

//             <Link to="/users">
//                <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
//                   <div className="flex items-center gap-3">
//                      <div
//                         className="w-8 h-8 rounded-full flex items-center justify-center"
//                         style={{ backgroundColor: "#10b981" }}
//                      >
//                         <span className="text-white text-sm font-medium">
//                            {user?.name?.charAt(0)?.toUpperCase()}
//                         </span>
//                      </div>
//                   </div>
//                   <div className="hidden md:block">
//                      <p className="text-sm font-medium text-slate-700 m-0">
//                         {user?.name}
//                      </p>
//                      <p className="text-xs text-slate-500 m-0 capitalize">
//                         {user?.role} Panel
//                      </p>
//                   </div>
//                </div>
//             </Link>

//             <Button danger onClick={handleLogout}>
//                Logout
//             </Button>

//          </div>
//       </div>
//    );
// };

// export default HeaderBar;


import { io } from "socket.io-client";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Badge, Dropdown, Modal, message, Avatar, Tooltip } from "antd";
import {
   BellOutlined,
   LogoutOutlined,
   ClockCircleOutlined,
   UserOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const HeaderBar = () => {
   const { user, logout } = useContext(AuthContext);
   const navigate = useNavigate();
   const [notifications, setNotifications] = useState([]);
   const [timeLeft, setTimeLeft] = useState(null);
   const [warningShown, setWarningShown] = useState(false);

   /* ================= SOCKET ================= */
   useEffect(() => {
      const newSocket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");

      if (user?.id) {
         newSocket.emit("joinRoom", user.id);
      }

      newSocket.on("newNotification", () => {
         fetchNotifications();
      });

      return () => newSocket.disconnect();
   }, [user]);

   /* ================= SESSION TIMER ================= */
   useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;

      const interval = setInterval(() => {
         const remaining = expiryTime - Date.now();

         if (remaining <= 0) {
            clearInterval(interval);
            setTimeLeft("00:00");
            return;
         }

         const minutes = Math.floor(remaining / 60000);
         const seconds = Math.floor((remaining % 60000) / 1000);

         setTimeLeft(
            `${minutes.toString().padStart(2, "0")}:${seconds
               .toString()
               .padStart(2, "0")}`
         );

         if (remaining <= 60000 && !warningShown) {
            message.warning("⚠️ Session will expire in 1 minute!");
            setWarningShown(true);
         }
      }, 1000);

      return () => clearInterval(interval);
   }, [warningShown]);

   /* ================= FETCH ================= */
   const fetchNotifications = () => {
      axios.get("/notifications")
         .then(res => setNotifications(res.data))
         .catch(err => console.log(err));
   };

   useEffect(() => {
      fetchNotifications();
   }, []);

   const handleMarkAsRead = (id) => {
      axios.put(`/notifications/${id}/read`)
         .then(() => {
            setNotifications(prev =>
               prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
            );
         });
   };

   const handleMarkAllRead = async () => {
      try {
         const res = await axios.get("/notifications");
         const all = res.data;

         await Promise.all(
            all.map(n => axios.put(`/notifications/${n.id}/read`))
         );

         setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      } catch (err) {
         console.log(err);
      }
   };

   const handleClearAll = () => {
      Modal.confirm({
         title: "Are you sure?",
         content: "Do you want to clear all notifications?",
         okText: "Yes",
         cancelText: "Cancel",
         onOk: async () => {
            await axios.delete("/notifications/clear-all");
            message.success("All notifications cleared");
            fetchNotifications();
         }
      });
   };

   const notificationItems =
      notifications.length > 0
         ? [
            {
               key: "actions",
               label: (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                     <span
                        style={{ color: "#1890ff", cursor: "pointer" }}
                        onClick={handleMarkAllRead}
                     >
                        Mark All Read
                     </span>
                     <span
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={handleClearAll}
                     >
                        Clear All
                     </span>
                  </div>
               )
            },
            {
               type: "divider"
            },
            ...notifications.map(item => ({
               key: item.id,
               label: (
                  <div
                     onClick={() => handleMarkAsRead(item.id)}
                     style={{
                        background: item.is_read ? "#fff" : "#f6ffed",
                        padding: "8px"
                     }}
                  >
                     <div>{item.message}</div>
                     <small style={{ color: "#888" }}>
                        {new Date(item.created_at).toLocaleString()}
                     </small>
                  </div>
               )
            }))
         ]
         : [
            {
               key: "empty",
               label: <div style={{ padding: 8 }}>No notifications</div>
            }
         ];

   const handleLogout = () => {
      logout();
      navigate("/");
   };

   // Get greeting based on time
   const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 17) return "Good afternoon";
      return "Good evening";
   };

   // Timer color based on remaining time
   const getTimerColor = () => {
      if (!timeLeft) return "#6b7280";
      const [minutes] = timeLeft.split(':').map(Number);
      if (minutes < 5) return "#ef4444";
      if (minutes < 15) return "#f59e0b";
      return "#10b981";
   };

   return (
      <header className="h-16 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
         <style>{`
            .header-profile {
               transition: all 0.2s ease;
               border-radius: 12px;
            }
            .header-profile:hover {
               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .header-profile:hover p {
               color: white !important;
            }
            .notification-btn {
               transition: all 0.2s ease;
            }
            .notification-btn:hover {
               transform: scale(1.05);
            }
         `}</style>

         <div className="h-full px-6 flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-3">
               <div className="hidden md:block">
                  <h2 className="text-lg font-semibold text-gray-800 m-0">
                     {getGreeting()}, <span className="text-indigo-600">{user?.name}</span>
                  </h2>
                  <p className="text-xs text-gray-500 m-0">
                     {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                     })}
                  </p>
               </div>
               <div className="md:hidden">
                  <h2 className="text-lg font-semibold text-gray-800 m-0">
                     Hi, <span className="text-indigo-600">{user?.name?.split(' ')[0]}</span>
                  </h2>
               </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
               {/* Session Timer */}
               <Tooltip title="Session time remaining">
                  <div
                     className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                     style={{
                        backgroundColor: `${getTimerColor()}10`,
                        borderColor: `${getTimerColor()}30`
                     }}
                  >
                     <ClockCircleOutlined
                        style={{ color: getTimerColor(), fontSize: '14px' }}
                        className={timeLeft && timeLeft.startsWith('00:') ? 'animate-pulse' : ''}
                     />
                     <span className="text-sm font-medium" style={{ color: getTimerColor() }}>
                        {timeLeft || "Loading..."}
                     </span>
                  </div>
               </Tooltip>

               {/* Notifications - ORIGINAL STYLE */}
               <Dropdown
                  menu={{
                     items: notificationItems,
                     style: { maxHeight: 300, overflowY: "auto" }
                  }}
                  trigger={["click"]}
                  placement="bottomRight"
               >
                  <Badge
                     count={notifications.filter(n => !n.is_read).length}
                     overflowCount={9}
                  >
                     <BellOutlined
                        style={{
                           fontSize: 22,
                           cursor: "pointer"
                        }}
                     />
                  </Badge>
               </Dropdown>

               {/* User Profile */}
               <Link to="/users">
                  <div className="header-profile flex items-center gap-3 px-3 py-2 cursor-pointer">
                     <Avatar
                        size={34}
                        style={{
                           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                           boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
                        }}
                        icon={<UserOutlined />}
                     >
                        {user?.name?.charAt(0)?.toUpperCase()}
                     </Avatar>
                     <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-gray-700 m-0">
                           {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 m-0">
                           {user?.role === 'admin' ? (
                              <span className="text-indigo-600 font-medium">Administrator</span>
                           ) : (
                              <span className="capitalize">{user?.role}</span>
                           )}
                        </p>
                     </div>
                  </div>
               </Link>

               <div className="h-8 w-px bg-gray-200" />

               {/* Logout */}
               <Button
                  danger
                  onClick={handleLogout}
               >
                  Logout
               </Button>
            </div>
         </div>
      </header>
   );
};

export default HeaderBar;