import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
   Card,
   Row,
   Col,
   Statistic,
   DatePicker,
   Button,
   Spin,
   Empty
} from "antd";
import {
   UserOutlined,
   ProjectOutlined,
   TeamOutlined,
   DollarOutlined,
   ClockCircleOutlined,
   CalendarOutlined,
   RiseOutlined,
   WarningOutlined,
   CheckCircleOutlined,
   FilterOutlined,
   ReloadOutlined,
   PieChartOutlined,
   LineChartOutlined
} from "@ant-design/icons";
import {
   PieChart,
   Pie,
   Cell,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   Tooltip,
   CartesianGrid,
   LineChart,
   Line,
   ResponsiveContainer,
   Legend
} from "recharts";
import axios from "../../api/axios";
import { AuthContext } from "../context/AuthContext";

const { RangePicker } = DatePicker;

const Dashboard = () => {

   const navigate = useNavigate();
   const { user } = useContext(AuthContext);

   const [loading, setLoading] = useState(true);
   const [summary, setSummary] = useState({
      overdue: 0,
      today: 0,
      upcoming: 0
   });
   const [stats, setStats] = useState({});
   const [revenueData, setRevenueData] = useState({
      totalRevenue: 0,
      monthlyRevenue: []
   });
   const [dateRange, setDateRange] = useState([]);
   const [conversionChartData, setConversionChartData] = useState([]);
   const [conversionRate, setConversionRate] = useState(0);
   const [salesStats, setSalesStats] = useState({});
   const [weeklyData, setWeeklyData] = useState([]);
   const [monthlyData, setMonthlyData] = useState([]);
   const [licenseStats, setLicenseStats] = useState(null);

   const [weeklyLoading, setWeeklyLoading] = useState(true);
   const [monthlyLoading, setMonthlyLoading] = useState(true);
   const [projectStats, setProjectStats] = useState([]);
   const [unassignedCount, setUnassignedCount] = useState(0);
   const [pendingUsers, setPendingUsers] = useState(0);

   const COLORS = ["#52c41a", "#ff4d4f"];
   const MONTHLY_COLORS = ["#1890ff", "#faad14"];

   const monthlyRevenue = revenueData.monthlyRevenue || [];

   const thisMonthRevenue =
      monthlyRevenue.length > 0
         ? Number(monthlyRevenue[monthlyRevenue.length - 1].revenue)
         : 0;

   const avgMonthlyRevenue =
      monthlyRevenue.length > 0
         ? monthlyRevenue.reduce((sum, item) => sum + Number(item.revenue), 0) /
         monthlyRevenue.length
         : 0;


   // Fetch all data
   useEffect(() => {
      const fetchAllData = async () => {
         setLoading(true);
         try {
            const [statsRes, summaryRes, revenueRes, conversionRes] = await Promise.all([
               axios.get("/dashboard-stats"),
               axios.get("/followups-summary"),
               axios.get("/dashboard/revenue"),
               axios.get("/dashboard/conversion")
            ]);

            setStats(statsRes.data);
            setSummary(summaryRes.data);
            setRevenueData(revenueRes.data);

            const total = Number(conversionRes.data.totalLeads) || 0;
            const converted = Number(conversionRes.data.closedWon) || 0;
            setConversionChartData([
               { name: "Converted", value: converted },
               { name: "Not Converted", value: total - converted }
            ]);
            setConversionRate(conversionRes.data.conversionRate || 0);

         } catch (err) {
            console.log(err);
         } finally {
            setLoading(false);
         }
      };

      fetchAllData();
   }, []);



   // useEffect(() => {
   //    axios.get("/users/pending-count")
   //       .then(res => {
   //          setPendingUsers(res.data.pendingUsers);
   //       });

   // }, []);


   useEffect(() => {
      if (user?.role === "admin") {
         axios.get("/users/pending-count")
            .then(res => {
               setPendingUsers(res.data.pendingUsers);
            })
            .catch(err => console.log("Pending users error:", err));
      }
   }, [user]);

   useEffect(() => {
      axios.get("/dashboard/project-stats")
         .then(res => setProjectStats(res.data))
         .catch(err => console.log(err));
   }, []);

   useEffect(() => {
      axios.get("/dashboard/unassigned-count")
         .then(res => setUnassignedCount(res.data.total))
         .catch(err => console.log(err));
   }, []);


   // ✅ Fixed: Weekly & Monthly data fetch with proper error handling
   useEffect(() => {
      // Weekly Data
      setWeeklyLoading(true);
      axios.get("/dashboard/report-summary?type=weekly")
         .then(res => {
            console.log("Weekly API Response:", res.data); // Debug log
            const data = res.data;

            if (data && (data.converted !== undefined || data.notConverted !== undefined)) {
               setWeeklyData([
                  { name: "Converted", value: Number(data.converted) || 0 },
                  { name: "Not Converted", value: Number(data.notConverted) || 0 }
               ]);
            }
         })
         .catch(err => {
            console.error("Weekly data fetch error:", err);
         })
         .finally(() => setWeeklyLoading(false));

      // Monthly Data
      setMonthlyLoading(true);
      axios.get("/dashboard/report-summary?type=monthly")
         .then(res => {
            console.log("Monthly API Response:", res.data); // Debug log
            const data = res.data;

            if (data && (data.converted !== undefined || data.notConverted !== undefined)) {
               setMonthlyData([
                  { name: "Converted", value: Number(data.converted) || 0 },
                  { name: "Not Converted", value: Number(data.notConverted) || 0 }
               ]);
            }
         })
         .catch(err => {
            console.error("Monthly data fetch error:", err);
         })
         .finally(() => setMonthlyLoading(false));

   }, []);


   useEffect(() => {
      axios.get("/sales-stats")
         .then(res => setSalesStats(res.data))
         .catch(err => console.log(err));
   }, []);


   const fetchRevenue = (startDate, endDate) => {
      let url = "/dashboard/revenue";
      if (startDate && endDate) {
         url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      axios.get(url).then(res => setRevenueData(res.data));
   };


   // useEffect(() => {
   //    axios.get("/license-stats")
   //       .then(res => setLicenseStats(res.data))
   //       .catch(err => console.log(err));
   // }, []);


   useEffect(() => {
      if (user?.role === "admin") {
         axios.get("/license-stats")
            .then(res => setLicenseStats(res.data))
            .catch(err => console.log("License stats error:", err));
      }
   }, [user]);
   // Follow-up Cards Data
   const followupCards = [
      {
         title: "Overdue",
         count: summary.overdue,
         icon: <WarningOutlined className="text-2xl" />,
         bgColor: "bg-red-50",
         textColor: "text-red-600",
         borderColor: "border-red-200",
         type: "overdue"
      },
      {
         title: "Today",
         count: summary.today,
         icon: <CalendarOutlined className="text-2xl" />,
         bgColor: "bg-orange-50",
         textColor: "text-orange-600",
         borderColor: "border-orange-200",
         type: "today"
      },
      {
         title: "Upcoming",
         count: summary.upcoming,
         icon: <ClockCircleOutlined className="text-2xl" />,
         bgColor: "bg-green-50",
         textColor: "text-green-600",
         borderColor: "border-green-200",
         type: "upcoming"
      }
   ];

   // Stats Cards Data
   const statsCards = [
      {
         title: "Total Leads",
         value: stats.totalLeads || 0,
         icon: <UserOutlined />,
         color: "#1890ff",
         bgColor: "bg-blue-50"
      },
      {
         title: "Unassigned Leads",
         value: unassignedCount,
         icon: <WarningOutlined />,
         color: "#faad14",
         bgColor: "bg-yellow-50"
      },
      {
         title: "Total Projects",
         value: projectStats.length || 0,
         icon: <ProjectOutlined />,
         color: "#722ed1",
         bgColor: "bg-purple-50"
      },
      ...(user?.role === "admin" ? [{
         title: "Pending Users",  // ✅ Fixed typo
         value: pendingUsers,
         icon: <TeamOutlined />,
         color: "#13c2c2",
         bgColor: "bg-cyan-50"
      }] : []),
      {
         title: "Total Sales",
         value: salesStats.totalSales || 0,
         icon: <DollarOutlined />,
         color: "#52c41a",
         bgColor: "bg-green-50"
      }
   ];

   if (loading) {
      return (
         <div className="flex justify-center items-center h-96">
            <Spin size="large" />
         </div>
      );
   }

   return (
      <div className="space-y-6">

         {/* Page Header */}
         <div className="bg-white rounded-lg shadow-sm p-1 pl-2">
            <h1 className="text-2xl font-bold text-gray-800 m-0">
               Dashboard Overview
            </h1>
            <p className="text-gray-500 m-0 mt-1">
               Welcome back! Here's what's happening with your leads today.
            </p>
         </div>

         {/* Follow-ups Section */}
         <div>
            <div className="flex items-center gap-2 mb-2 pl-2">
               <CalendarOutlined className="text-xl text-blue-500" />
               <h2 className="text-lg font-semibold text-gray-700 m-0">
                  Follow-ups Summary
               </h2>
            </div>

            <Row gutter={[16, 16]}>
               {followupCards.map((card, index) => (
                  <Col xs={24} sm={8} key={index}>
                     <div
                        className={`
                           ${card.bgColor} ${card.borderColor}
                           p-5 rounded-lg border cursor-pointer
                           transition-all duration-300
                           hover:shadow-lg hover:scale-105
                        `}
                        onClick={() => navigate(`/followups?type=${card.type}`)}
                     >
                        <div className="flex items-center justify-between">
                           <div>
                              <p className={`${card.textColor} font-medium mb-1`}>
                                 {card.title}
                              </p>
                              <p className={`text-3xl font-bold ${card.textColor}`}>
                                 {card.count}
                              </p>
                           </div>
                           <div className={`${card.textColor} opacity-80`}>
                              {card.icon}
                           </div>
                        </div>
                     </div>
                  </Col>
               ))}
            </Row>
         </div>

         {/* Stats Cards Section */}
         <div>
            <div className="flex items-center gap-2 mb-4 pl-2">
               <RiseOutlined className="text-xl text-blue-500" />
               <h2 className="text-lg font-semibold text-gray-700 m-0">
                  Quick Stats
               </h2>
            </div>

            <Row gutter={[16, 16]}>
               {statsCards.map((card, index) => (
                  <Col xs={24} sm={12} md={6} key={index}>
                     <Card
                        className={`${card.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}
                     >
                        <div className="flex items-center justify-between">
                           <Statistic
                              title={
                                 <span className="text-gray-600 font-medium">
                                    {card.title}
                                 </span>
                              }
                              value={card.value}
                              valueStyle={{
                                 color: card.color,
                                 fontWeight: "bold"
                              }}
                           />
                           <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white"
                              style={{ backgroundColor: card.color }}
                           >
                              {card.icon}
                           </div>
                        </div>
                     </Card>
                  </Col>
               ))}
            </Row>
         </div>


         {/* {user?.role === "admin" && licenseStats && (
            <Card className="shadow-sm">
               <Row gutter={16}>
                  <Col span={12}>
                     <Statistic
                        title="Users Used"
                        value={`${licenseStats.totalUsers} / ${licenseStats.maxUsers}`}
                     />
                  </Col>

                  <Col span={12}>
                     <Statistic
                        title="Admins"
                        value={`${licenseStats.adminCount} / ${licenseStats.maxAdmin}`}
                     />
                  </Col>
               </Row>
            </Card>
         )} */}

         {/* Project Performance Section */}
         <Card
            title={
               <div className="flex items-center gap-2">
                  <ProjectOutlined className="text-purple-500" />
                  <span>Project Performance</span>
               </div>
            }
            className="shadow-sm  h-50 overflow-scroll"
         >
            {projectStats.length > 0 ? (
               <Row gutter={[16, 16]}>
                  {projectStats.map(project => (
                     <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
                        <Card className="text-center border hover:shadow-md transition-all">
                           <h3 className="font-semibold text-gray-700">
                              {project.project_name}
                           </h3>

                           <p className="text-lg mt-2">
                              Leads: <b>{project.total_leads}</b>
                           </p>

                           <p className="text-green-600">
                              Closed Won: {project.closed_won || 0}
                           </p>

                           <p className="text-blue-600">
                              Revenue: ₹{project.revenue || 0}
                           </p>
                        </Card>
                     </Col>
                  ))}
               </Row>
            ) : (
               <div className="flex justify-center items-center h-40 text-gray-400">
                  No project data available
               </div>
            )}
         </Card>


         <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectStats}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="project_name" />
               <YAxis domain={[0, 'dataMax']}
                  allowDecimals={false} />
               <Tooltip />
               <Bar dataKey="total_leads" fill="#722ed1" />
            </BarChart>
         </ResponsiveContainer>
         {/* Charts Section */}
         <Row gutter={[16, 16]}>

            {/* Conversion Rate Chart */}
            <Col xs={24} lg={14}>
               <Card
                  title={
                     <div className="flex items-center gap-2">
                        <PieChartOutlined className="text-blue-500" />
                        <span>Lead Conversion Rate</span>
                     </div>
                  }
                  className="shadow-sm h-full"
               >
                  {conversionChartData.length > 0 ? (
                     <div>
                        <ResponsiveContainer width="100%" height={280}>
                           <PieChart>
                              <Pie
                                 data={conversionChartData}
                                 dataKey="value"
                                 nameKey="name"
                                 cx="50%"
                                 cy="50%"
                                 outerRadius={90}
                                 innerRadius={50}
                                 label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(1)}%`
                                 }
                              >
                                 {conversionChartData.map((entry, index) => (
                                    <Cell
                                       key={`cell-${index}`}
                                       fill={COLORS[index % COLORS.length]}
                                    />
                                 ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                           </PieChart>
                        </ResponsiveContainer>

                        <div className="text-center mt-4 p-4 bg-gray-50 rounded-lg">
                           <p className="text-gray-500 mb-1">Overall Conversion Rate</p>
                           <p className="text-3xl font-bold text-blue-600">
                              {conversionRate}%
                           </p>
                        </div>
                     </div>
                  ) : (
                     <div className="flex justify-center items-center h-64 text-gray-400">
                        No data available
                     </div>
                  )}
               </Card>
            </Col>

            {/* Revenue Card */}
            <Col xs={24} lg={10}>
               <Card
                  title={
                     <div className="flex items-center gap-2">
                        <DollarOutlined className="text-green-500" />
                        <span>Revenue Overview</span>
                     </div>
                  }
                  className="shadow-sm h-full"
               >
                  <div className="flex flex-wrap gap-3 mb-6">
                     <RangePicker
                        onChange={(dates, dateStrings) => {
                           setDateRange(dateStrings);
                        }}
                        className="flex-1 min-w-48"
                     />
                     <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={() => fetchRevenue(dateRange[0], dateRange[1])}
                     >
                        Apply
                     </Button>
                     <Button
                        icon={<ReloadOutlined />}
                        onClick={() => fetchRevenue()}
                     >
                        Reset
                     </Button>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white mb-4">
                     <p className="text-green-100 mb-2">Total Revenue</p>
                     <p className="text-4xl font-bold">
                        ₹ {revenueData.totalRevenue?.toLocaleString() || 0}
                     </p>
                  </div>

                  <Row gutter={16}>
                     <Col span={24}>
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                           <p className="text-gray-500 text-sm">This Month</p>
                           <p className="text-xl font-bold text-blue-600">
                              ₹ {thisMonthRevenue.toLocaleString()}
                           </p>
                        </div>
                     </Col>

                     {/* <Col span={12}>
                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                           <p className="text-gray-500 text-sm">Avg Monthly</p>
                           <p className="text-xl font-bold text-purple-600">
                              ₹ {Math.round(avgMonthlyRevenue).toLocaleString()}
                           </p>
                        </div>
                     </Col> */}
                  </Row>
               </Card>
            </Col>
         </Row>


         {/* ✅ FIXED: Weekly & Monthly Performance Charts */}
         <Row gutter={[16, 16]}>

            {/* Weekly Report */}
            <Col xs={24} md={12}>
               <Card
                  title={
                     <div className="flex items-center gap-2">
                        <PieChartOutlined className="text-green-500" />
                        <span>Weekly Performance</span>
                     </div>
                  }
                  className="shadow-sm"
               >
                  {weeklyLoading ? (
                     <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                     </div>
                  ) : weeklyData.length > 0 && weeklyData.some(d => d.value > 0) ? (
                     <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                           <Pie
                              data={weeklyData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, value }) => `${name}: ${value}`}
                           >
                              {/* ✅ Fixed: Map Cell components */}
                              {weeklyData.map((entry, index) => (
                                 <Cell
                                    key={`weekly-cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                 />
                              ))}
                           </Pie>
                           <Tooltip />
                           <Legend />
                        </PieChart>
                     </ResponsiveContainer>
                  ) : (
                     <div className="flex justify-center items-center h-64">
                        <Empty description="No weekly data available" />
                     </div>
                  )}
               </Card>
            </Col>

            {/* Monthly Report */}
            <Col xs={24} md={12}>
               <Card
                  title={
                     <div className="flex items-center gap-2">
                        <PieChartOutlined className="text-blue-500" />
                        <span>Monthly Performance</span>
                     </div>
                  }
                  className="shadow-sm"
               >
                  {monthlyLoading ? (
                     <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                     </div>
                  ) : monthlyData.length > 0 && monthlyData.some(d => d.value > 0) ? (
                     <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                           <Pie
                              data={monthlyData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, value }) => `${name}: ${value}`}
                           >
                              {/* ✅ Fixed: Map Cell components */}
                              {monthlyData.map((entry, index) => (
                                 <Cell
                                    key={`monthly-cell-${index}`}
                                    fill={MONTHLY_COLORS[index % MONTHLY_COLORS.length]}
                                 />
                              ))}
                           </Pie>
                           <Tooltip />
                           <Legend />
                        </PieChart>
                     </ResponsiveContainer>
                  ) : (
                     <div className="flex justify-center items-center h-64">
                        <Empty description="No monthly data available" />
                     </div>
                  )}
               </Card>
            </Col>

         </Row>

         {/* Monthly Revenue Trend */}
         <Card
            title={
               <div className="flex items-center gap-2">
                  <LineChartOutlined className="text-blue-500" />
                  <span>Monthly Revenue Trend</span>
               </div>
            }
            className="shadow-sm"
         >
            {revenueData.monthlyRevenue?.length > 0 ? (
               <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueData.monthlyRevenue}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                     <XAxis
                        dataKey="month"
                        tick={{ fill: "#666" }}
                        axisLine={{ stroke: "#d9d9d9" }}
                     />
                     <YAxis
                        tick={{ fill: "#666" }}
                        axisLine={{ stroke: "#d9d9d9" }}
                        tickFormatter={(value) => `₹${value / 1000}k`}
                     />
                     <Tooltip
                        formatter={(value) => [`₹ ${value.toLocaleString()}`, "Revenue"]}
                        contentStyle={{
                           backgroundColor: "#fff",
                           border: "1px solid #d9d9d9",
                           borderRadius: "8px"
                        }}
                     />
                     <Legend />
                     <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1890ff"
                        strokeWidth={3}
                        dot={{ r: 6, fill: "#1890ff" }}
                        activeDot={{ r: 8, fill: "#096dd9" }}
                        name="Revenue"
                     />
                  </LineChart>
               </ResponsiveContainer>
            ) : (
               <div className="flex justify-center items-center h-64 text-gray-400">
                  No revenue data available
               </div>
            )}
         </Card>



         {/* License/User Limit Card - Beautiful Design */}
         {user?.role === "admin" && licenseStats && (
            <Card
               className="shadow-sm overflow-hidden"
               bodyStyle={{ padding: 0 }}
            >
               {/* Header */}
               <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <TeamOutlined className="text-white text-xl" />
                     </div>
                     <div>
                        <h3 className="text-white font-semibold text-lg m-0">
                           License Overview
                        </h3>
                        <p className="text-indigo-100 text-sm m-0">
                           User & Admin Limits
                        </p>
                     </div>
                  </div>
               </div>

               {/* Stats Content */}
               <div className="p-6">
                  <Row gutter={[24, 24]}>
                     {/* Users Card */}
                     <Col xs={24} sm={12}>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                           <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                 <UserOutlined className="text-white text-xl" />
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${licenseStats.totalUsers >= licenseStats.maxUsers
                                 ? 'bg-red-100 text-red-600'
                                 : 'bg-green-100 text-green-600'
                                 }`}>
                                 {licenseStats.totalUsers >= licenseStats.maxUsers ? 'Limit Reached' : 'Available'}
                              </span>
                           </div>

                           <p className="text-gray-500 text-sm mb-1">Total Users</p>
                           <p className="text-3xl font-bold text-gray-800 mb-3">
                              {licenseStats.totalUsers}
                              <span className="text-lg text-gray-400 font-normal">
                                 {' '}/ {licenseStats.maxUsers}
                              </span>
                           </p>

                           {/* Progress Bar */}
                           <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                 className={`h-2.5 rounded-full transition-all duration-500 ${(licenseStats.totalUsers / licenseStats.maxUsers) >= 0.9
                                    ? 'bg-red-500'
                                    : (licenseStats.totalUsers / licenseStats.maxUsers) >= 0.7
                                       ? 'bg-yellow-500'
                                       : 'bg-blue-500'
                                    }`}
                                 style={{
                                    width: `${Math.min((licenseStats.totalUsers / licenseStats.maxUsers) * 100, 100)}%`
                                 }}
                              />
                           </div>
                           <p className="text-xs text-gray-400 mt-2">
                              {licenseStats.maxUsers - licenseStats.totalUsers} slots remaining
                           </p>
                        </div>
                     </Col>

                     {/* Admins Card */}
                     <Col xs={24} sm={12}>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                           <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                                 <CheckCircleOutlined className="text-white text-xl" />
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${licenseStats.adminCount >= licenseStats.maxAdmin
                                 ? 'bg-red-100 text-red-600'
                                 : 'bg-green-100 text-green-600'
                                 }`}>
                                 {licenseStats.adminCount >= licenseStats.maxAdmin ? 'Limit Reached' : 'Available'}
                              </span>
                           </div>

                           <p className="text-gray-500 text-sm mb-1">Admin Users</p>
                           <p className="text-3xl font-bold text-gray-800 mb-3">
                              {licenseStats.adminCount}
                              <span className="text-lg text-gray-400 font-normal">
                                 {' '}/ {licenseStats.maxAdmin}
                              </span>
                           </p>

                           {/* Progress Bar */}
                           <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                 className={`h-2.5 rounded-full transition-all duration-500 ${(licenseStats.adminCount / licenseStats.maxAdmin) >= 0.9
                                    ? 'bg-red-500'
                                    : (licenseStats.adminCount / licenseStats.maxAdmin) >= 0.7
                                       ? 'bg-yellow-500'
                                       : 'bg-purple-500'
                                    }`}
                                 style={{
                                    width: `${Math.min((licenseStats.adminCount / licenseStats.maxAdmin) * 100, 100)}%`
                                 }}
                              />
                           </div>
                           <p className="text-xs text-gray-400 mt-2">
                              {licenseStats.maxAdmin - licenseStats.adminCount} slots remaining
                           </p>
                        </div>
                     </Col>
                  </Row>
               </div>
            </Card>
         )}

      </div>
   );
};

export default Dashboard;