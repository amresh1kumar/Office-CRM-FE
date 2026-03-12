// import { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//    Card,
//    Row,
//    Col,
//    Statistic,
//    DatePicker,
//    Button,
//    Spin,
//    Empty
// } from "antd";
// import {
//    UserOutlined,
//    ProjectOutlined,
//    TeamOutlined,
//    DollarOutlined,
//    ClockCircleOutlined,
//    CalendarOutlined,
//    RiseOutlined,
//    WarningOutlined,
//    CheckCircleOutlined,
//    FilterOutlined,
//    ReloadOutlined,
//    PieChartOutlined,
//    LineChartOutlined
// } from "@ant-design/icons";
// import {
//    PieChart,
//    Pie,
//    Cell,
//    BarChart,
//    Bar,
//    XAxis,
//    YAxis,
//    Tooltip,
//    CartesianGrid,
//    LineChart,
//    Line,
//    ResponsiveContainer,
//    Legend
// } from "recharts";
// import axios from "../../api/axios";
// import { AuthContext } from "../context/AuthContext";

// const { RangePicker } = DatePicker;

// const Dashboard = () => {

//    const navigate = useNavigate();
//    const { user } = useContext(AuthContext);

//    const [loading, setLoading] = useState(true);
//    const [summary, setSummary] = useState({
//       overdue: 0,
//       today: 0,
//       upcoming: 0
//    });
//    const [stats, setStats] = useState({});
//    const [revenueData, setRevenueData] = useState({
//       totalRevenue: 0,
//       monthlyRevenue: []
//    });
//    const [dateRange, setDateRange] = useState([]);
//    const [conversionChartData, setConversionChartData] = useState([]);
//    const [conversionRate, setConversionRate] = useState(0);
//    const [salesStats, setSalesStats] = useState({});
//    const [weeklyData, setWeeklyData] = useState([]);
//    const [monthlyData, setMonthlyData] = useState([]);
//    const [licenseStats, setLicenseStats] = useState(null);

//    const [weeklyLoading, setWeeklyLoading] = useState(true);
//    const [monthlyLoading, setMonthlyLoading] = useState(true);
//    const [projectStats, setProjectStats] = useState([]);
//    const [unassignedCount, setUnassignedCount] = useState(0);
//    const [pendingUsers, setPendingUsers] = useState(0);

//    const COLORS = ["#52c41a", "#ff4d4f"];
//    const MONTHLY_COLORS = ["#1890ff", "#faad14"];

//    const monthlyRevenue = revenueData.monthlyRevenue || [];

//    const thisMonthRevenue =
//       monthlyRevenue.length > 0
//          ? Number(monthlyRevenue[monthlyRevenue.length - 1].revenue)
//          : 0;

//    // const avgMonthlyRevenue =
//    //    monthlyRevenue.length > 0
//    //       ? monthlyRevenue.reduce((sum, item) => sum + Number(item.revenue), 0) /
//    //       monthlyRevenue.length
//    //       : 0;


//    // Fetch all data
//    useEffect(() => {
//       const fetchAllData = async () => {
//          setLoading(true);
//          try {
//             const [statsRes, summaryRes, revenueRes, conversionRes] = await Promise.all([
//                axios.get("/dashboard-stats"),
//                axios.get("/followups-summary"),
//                axios.get("/dashboard/revenue"),
//                axios.get("/dashboard/conversion")
//             ]);

//             setStats(statsRes.data);
//             setSummary(summaryRes.data);
//             setRevenueData(revenueRes.data);

//             const total = Number(conversionRes.data.totalLeads) || 0;
//             const converted = Number(conversionRes.data.closedWon) || 0;
//             setConversionChartData([
//                { name: "Converted", value: converted },
//                { name: "Not Converted", value: total - converted }
//             ]);
//             setConversionRate(conversionRes.data.conversionRate || 0);

//          } catch (err) {
//             console.log(err);
//          } finally {
//             setLoading(false);
//          }
//       };

//       fetchAllData();
//    }, []);



//    // useEffect(() => {
//    //    axios.get("/users/pending-count")
//    //       .then(res => {
//    //          setPendingUsers(res.data.pendingUsers);
//    //       });

//    // }, []);


//    useEffect(() => {
//       if (user?.role === "admin") {
//          axios.get("/users/pending-count")
//             .then(res => {
//                setPendingUsers(res.data.pendingUsers);
//             })
//             .catch(err => console.log("Pending users error:", err));
//       }
//    }, [user]);

//    useEffect(() => {
//       axios.get("/dashboard/project-stats")
//          .then(res => setProjectStats(res.data))
//          .catch(err => console.log(err));
//    }, []);

//    useEffect(() => {
//       axios.get("/dashboard/unassigned-count")
//          .then(res => setUnassignedCount(res.data.total))
//          .catch(err => console.log(err));
//    }, []);


//    // ✅ Fixed: Weekly & Monthly data fetch with proper error handling
//    useEffect(() => {
//       // Weekly Data
//       setWeeklyLoading(true);
//       axios.get("/dashboard/report-summary?type=weekly")
//          .then(res => {
//             console.log("Weekly API Response:", res.data); // Debug log
//             const data = res.data;

//             if (data && (data.converted !== undefined || data.notConverted !== undefined)) {
//                setWeeklyData([
//                   { name: "Converted", value: Number(data.converted) || 0 },
//                   { name: "Not Converted", value: Number(data.notConverted) || 0 }
//                ]);
//             }
//          })
//          .catch(err => {
//             console.error("Weekly data fetch error:", err);
//          })
//          .finally(() => setWeeklyLoading(false));

//       // Monthly Data
//       setMonthlyLoading(true);
//       axios.get("/dashboard/report-summary?type=monthly")
//          .then(res => {
//             console.log("Monthly API Response:", res.data); // Debug log
//             const data = res.data;

//             if (data && (data.converted !== undefined || data.notConverted !== undefined)) {
//                setMonthlyData([
//                   { name: "Converted", value: Number(data.converted) || 0 },
//                   { name: "Not Converted", value: Number(data.notConverted) || 0 }
//                ]);
//             }
//          })
//          .catch(err => {
//             console.error("Monthly data fetch error:", err);
//          })
//          .finally(() => setMonthlyLoading(false));

//    }, []);


//    useEffect(() => {
//       axios.get("/sales-stats")
//          .then(res => setSalesStats(res.data))
//          .catch(err => console.log(err));
//    }, []);


//    const fetchRevenue = (startDate, endDate) => {
//       let url = "/dashboard/revenue";
//       if (startDate && endDate) {
//          url += `?startDate=${startDate}&endDate=${endDate}`;
//       }
//       axios.get(url).then(res => setRevenueData(res.data));
//    };


//    // useEffect(() => {
//    //    axios.get("/license-stats")
//    //       .then(res => setLicenseStats(res.data))
//    //       .catch(err => console.log(err));
//    // }, []);


//    useEffect(() => {
//       if (user?.role === "admin") {
//          axios.get("/license-stats")
//             .then(res => setLicenseStats(res.data))
//             .catch(err => console.log("License stats error:", err));
//       }
//    }, [user]);
//    // Follow-up Cards Data
//    const followupCards = [
//       {
//          title: "Overdue",
//          count: summary.overdue,
//          icon: <WarningOutlined className="text-2xl" />,
//          bgColor: "bg-red-50",
//          textColor: "text-red-600",
//          borderColor: "border-red-200",
//          type: "overdue"
//       },
//       {
//          title: "Today",
//          count: summary.today,
//          icon: <CalendarOutlined className="text-2xl" />,
//          bgColor: "bg-orange-50",
//          textColor: "text-orange-600",
//          borderColor: "border-orange-200",
//          type: "today"
//       },
//       {
//          title: "Upcoming",
//          count: summary.upcoming,
//          icon: <ClockCircleOutlined className="text-2xl" />,
//          bgColor: "bg-green-50",
//          textColor: "text-green-600",
//          borderColor: "border-green-200",
//          type: "upcoming"
//       }
//    ];

//    // Stats Cards Data
//    const statsCards = [
//       {
//          title: "Total Leads",
//          value: stats.totalLeads || 0,
//          icon: <UserOutlined />,
//          color: "#1890ff",
//          bgColor: "bg-blue-50"
//       },
//       {
//          title: "Unassigned Leads",
//          value: unassignedCount,
//          icon: <WarningOutlined />,
//          color: "#faad14",
//          bgColor: "bg-yellow-50"
//       },
//       {
//          title: "Total Projects",
//          value: projectStats.length || 0,
//          icon: <ProjectOutlined />,
//          color: "#722ed1",
//          bgColor: "bg-purple-50"
//       },
//       ...(user?.role === "admin" ? [{
//          title: "Pending Users",  // ✅ Fixed typo
//          value: pendingUsers,
//          icon: <TeamOutlined />,
//          color: "#13c2c2",
//          bgColor: "bg-cyan-50"
//       }] : []),
//       {
//          title: "Total Sales",
//          value: salesStats.totalSales || 0,
//          icon: <DollarOutlined />,
//          color: "#52c41a",
//          bgColor: "bg-green-50"
//       }
//    ];

//    if (loading) {
//       return (
//          <div className="flex justify-center items-center h-96">
//             <Spin size="large" />
//          </div>
//       );
//    }

//    return (
//       <div className="space-y-6">

//          {/* Page Header */}
//          <div className="bg-white rounded-lg shadow-sm p-1 pl-2">
//             <h1 className="text-2xl font-bold text-gray-800 m-0">
//                Dashboard Overview
//             </h1>
//             <p className="text-gray-500 m-0 mt-1">
//                Welcome back! Here's what's happening with your leads today.
//             </p>
//          </div>

//          {/* Follow-ups Section */}
//          <div>
//             <div className="flex items-center gap-2 mb-2 pl-2">
//                <CalendarOutlined className="text-xl text-blue-500" />
//                <h2 className="text-lg font-semibold text-gray-700 m-0">
//                   Follow-ups Summary
//                </h2>
//             </div>

//             <Row gutter={[16, 16]}>
//                {followupCards.map((card, index) => (
//                   <Col xs={24} sm={8} key={index}>
//                      <div
//                         className={`
//                            ${card.bgColor} ${card.borderColor}
//                            p-5 rounded-lg border cursor-pointer
//                            transition-all duration-300
//                            hover:shadow-lg hover:scale-105
//                         `}
//                         onClick={() => navigate(`/followups?type=${card.type}`)}
//                      >
//                         <div className="flex items-center justify-between">
//                            <div>
//                               <p className={`${card.textColor} font-medium mb-1`}>
//                                  {card.title}
//                               </p>
//                               <p className={`text-3xl font-bold ${card.textColor}`}>
//                                  {card.count}
//                               </p>
//                            </div>
//                            <div className={`${card.textColor} opacity-80`}>
//                               {card.icon}
//                            </div>
//                         </div>
//                      </div>
//                   </Col>
//                ))}
//             </Row>
//          </div>

//          {/* Stats Cards Section */}
//          <div>
//             <div className="flex items-center gap-2 mb-4 pl-2">
//                <RiseOutlined className="text-xl text-blue-500" />
//                <h2 className="text-lg font-semibold text-gray-700 m-0">
//                   Quick Stats
//                </h2>
//             </div>

//             <Row gutter={[16, 16]}>
//                {statsCards.map((card, index) => (
//                   <Col xs={24} sm={12} md={6} key={index}>
//                      <Card
//                         className={`${card.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}
//                      >
//                         <div className="flex items-center justify-between">
//                            <Statistic
//                               title={
//                                  <span className="text-gray-600 font-medium">
//                                     {card.title}
//                                  </span>
//                               }
//                               value={card.value}
//                               valueStyle={{
//                                  color: card.color,
//                                  fontWeight: "bold"
//                               }}
//                            />
//                            <div
//                               className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white"
//                               style={{ backgroundColor: card.color }}
//                            >
//                               {card.icon}
//                            </div>
//                         </div>
//                      </Card>
//                   </Col>
//                ))}
//             </Row>
//          </div>


//          {/* {user?.role === "admin" && licenseStats && (
//             <Card className="shadow-sm">
//                <Row gutter={16}>
//                   <Col span={12}>
//                      <Statistic
//                         title="Users Used"
//                         value={`${licenseStats.totalUsers} / ${licenseStats.maxUsers}`}
//                      />
//                   </Col>

//                   <Col span={12}>
//                      <Statistic
//                         title="Admins"
//                         value={`${licenseStats.adminCount} / ${licenseStats.maxAdmin}`}
//                      />
//                   </Col>
//                </Row>
//             </Card>
//          )} */}

//          {/* Project Performance Section */}
//          <Card
//             title={
//                <div className="flex items-center gap-2">
//                   <ProjectOutlined className="text-purple-500" />
//                   <span>Project Performance</span>
//                </div>
//             }
//             className="shadow-sm  h-50 overflow-scroll"
//          >
//             {projectStats.length > 0 ? (
//                <Row gutter={[16, 16]}>
//                   {projectStats.map(project => (
//                      <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
//                         <Card className="text-center border hover:shadow-md transition-all">
//                            <h3 className="font-semibold text-gray-700">
//                               {project.project_name}
//                            </h3>

//                            <p className="text-lg mt-2">
//                               Leads: <b>{project.total_leads}</b>
//                            </p>

//                            <p className="text-green-600">
//                               Closed Won: {project.closed_won || 0}
//                            </p>

//                            <p className="text-blue-600">
//                               Revenue: ₹{project.revenue || 0}
//                            </p>
//                         </Card>
//                      </Col>
//                   ))}
//                </Row>
//             ) : (
//                <div className="flex justify-center items-center h-40 text-gray-400">
//                   No project data available
//                </div>
//             )}
//          </Card>


//          <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={projectStats}>
//                <CartesianGrid strokeDasharray="3 3" />
//                <XAxis dataKey="project_name" />
//                <YAxis domain={[0, 'dataMax']}
//                   allowDecimals={false} />
//                <Tooltip />
//                <Bar dataKey="total_leads" fill="#722ed1" />
//             </BarChart>
//          </ResponsiveContainer>
//          {/* Charts Section */}
//          <Row gutter={[16, 16]}>

//             {/* Conversion Rate Chart */}
//             <Col xs={24} lg={14}>
//                <Card
//                   title={
//                      <div className="flex items-center gap-2">
//                         <PieChartOutlined className="text-blue-500" />
//                         <span>Lead Conversion Rate</span>
//                      </div>
//                   }
//                   className="shadow-sm h-full"
//                >
//                   {conversionChartData.length > 0 ? (
//                      <div>
//                         <ResponsiveContainer width="100%" height={280}>
//                            <PieChart>
//                               <Pie
//                                  data={conversionChartData}
//                                  dataKey="value"
//                                  nameKey="name"
//                                  cx="50%"
//                                  cy="50%"
//                                  outerRadius={90}
//                                  innerRadius={50}
//                                  label={({ name, percent }) =>
//                                     `${name}: ${(percent * 100).toFixed(1)}%`
//                                  }
//                               >
//                                  {conversionChartData.map((entry, index) => (
//                                     <Cell
//                                        key={`cell-${index}`}
//                                        fill={COLORS[index % COLORS.length]}
//                                     />
//                                  ))}
//                               </Pie>
//                               <Tooltip />
//                               <Legend />
//                            </PieChart>
//                         </ResponsiveContainer>

//                         <div className="text-center mt-4 p-4 bg-gray-50 rounded-lg">
//                            <p className="text-gray-500 mb-1">Overall Conversion Rate</p>
//                            <p className="text-3xl font-bold text-blue-600">
//                               {conversionRate}%
//                            </p>
//                         </div>
//                      </div>
//                   ) : (
//                      <div className="flex justify-center items-center h-64 text-gray-400">
//                         No data available
//                      </div>
//                   )}
//                </Card>
//             </Col>

//             {/* Revenue Card */}
//             <Col xs={24} lg={10}>
//                <Card
//                   title={
//                      <div className="flex items-center gap-2">
//                         <DollarOutlined className="text-green-500" />
//                         <span>Revenue Overview</span>
//                      </div>
//                   }
//                   className="shadow-sm h-full"
//                >
//                   <div className="flex flex-wrap gap-3 mb-6">
//                      <RangePicker
//                         onChange={(dates, dateStrings) => {
//                            setDateRange(dateStrings);
//                         }}
//                         className="flex-1 min-w-48"
//                      />
//                      <Button
//                         type="primary"
//                         icon={<FilterOutlined />}
//                         onClick={() => fetchRevenue(dateRange[0], dateRange[1])}
//                      >
//                         Apply
//                      </Button>
//                      <Button
//                         icon={<ReloadOutlined />}
//                         onClick={() => fetchRevenue()}
//                      >
//                         Reset
//                      </Button>
//                   </div>

//                   <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white mb-4">
//                      <p className="text-green-100 mb-2">Total Revenue</p>
//                      <p className="text-4xl font-bold">
//                         ₹ {revenueData.totalRevenue?.toLocaleString() || 0}
//                      </p>
//                   </div>

//                   <Row gutter={16}>
//                      <Col span={24}>
//                         <div className="bg-blue-50 rounded-lg p-4 text-center">
//                            <p className="text-gray-500 text-sm">This Month</p>
//                            <p className="text-xl font-bold text-blue-600">
//                               ₹ {thisMonthRevenue.toLocaleString()}
//                            </p>
//                         </div>
//                      </Col>

//                      {/* <Col span={12}>
//                         <div className="bg-purple-50 rounded-lg p-4 text-center">
//                            <p className="text-gray-500 text-sm">Avg Monthly</p>
//                            <p className="text-xl font-bold text-purple-600">
//                               ₹ {Math.round(avgMonthlyRevenue).toLocaleString()}
//                            </p>
//                         </div>
//                      </Col> */}
//                   </Row>
//                </Card>
//             </Col>
//          </Row>


//          {/* ✅ FIXED: Weekly & Monthly Performance Charts */}
//          <Row gutter={[16, 16]}>

//             {/* Weekly Report */}
//             <Col xs={24} md={12}>
//                <Card
//                   title={
//                      <div className="flex items-center gap-2">
//                         <PieChartOutlined className="text-green-500" />
//                         <span>Weekly Performance</span>
//                      </div>
//                   }
//                   className="shadow-sm"
//                >
//                   {weeklyLoading ? (
//                      <div className="flex justify-center items-center h-64">
//                         <Spin size="large" />
//                      </div>
//                   ) : weeklyData.length > 0 && weeklyData.some(d => d.value > 0) ? (
//                      <ResponsiveContainer width="100%" height={250}>
//                         <PieChart>
//                            <Pie
//                               data={weeklyData}
//                               dataKey="value"
//                               nameKey="name"
//                               cx="50%"
//                               cy="50%"
//                               outerRadius={80}
//                               label={({ name, value }) => `${name}: ${value}`}
//                            >
//                               {/* ✅ Fixed: Map Cell components */}
//                               {weeklyData.map((entry, index) => (
//                                  <Cell
//                                     key={`weekly-cell-${index}`}
//                                     fill={COLORS[index % COLORS.length]}
//                                  />
//                               ))}
//                            </Pie>
//                            <Tooltip />
//                            <Legend />
//                         </PieChart>
//                      </ResponsiveContainer>
//                   ) : (
//                      <div className="flex justify-center items-center h-64">
//                         <Empty description="No weekly data available" />
//                      </div>
//                   )}
//                </Card>
//             </Col>

//             {/* Monthly Report */}
//             <Col xs={24} md={12}>
//                <Card
//                   title={
//                      <div className="flex items-center gap-2">
//                         <PieChartOutlined className="text-blue-500" />
//                         <span>Monthly Performance</span>
//                      </div>
//                   }
//                   className="shadow-sm"
//                >
//                   {monthlyLoading ? (
//                      <div className="flex justify-center items-center h-64">
//                         <Spin size="large" />
//                      </div>
//                   ) : monthlyData.length > 0 && monthlyData.some(d => d.value > 0) ? (
//                      <ResponsiveContainer width="100%" height={250}>
//                         <PieChart>
//                            <Pie
//                               data={monthlyData}
//                               dataKey="value"
//                               nameKey="name"
//                               cx="50%"
//                               cy="50%"
//                               outerRadius={80}
//                               label={({ name, value }) => `${name}: ${value}`}
//                            >
//                               {/* ✅ Fixed: Map Cell components */}
//                               {monthlyData.map((entry, index) => (
//                                  <Cell
//                                     key={`monthly-cell-${index}`}
//                                     fill={MONTHLY_COLORS[index % MONTHLY_COLORS.length]}
//                                  />
//                               ))}
//                            </Pie>
//                            <Tooltip />
//                            <Legend />
//                         </PieChart>
//                      </ResponsiveContainer>
//                   ) : (
//                      <div className="flex justify-center items-center h-64">
//                         <Empty description="No monthly data available" />
//                      </div>
//                   )}
//                </Card>
//             </Col>

//          </Row>

//          {/* Monthly Revenue Trend */}
//          <Card
//             title={
//                <div className="flex items-center gap-2">
//                   <LineChartOutlined className="text-blue-500" />
//                   <span>Monthly Revenue Trend</span>
//                </div>
//             }
//             className="shadow-sm"
//          >
//             {revenueData.monthlyRevenue?.length > 0 ? (
//                <ResponsiveContainer width="100%" height={350}>
//                   <LineChart data={revenueData.monthlyRevenue}>
//                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                      <XAxis
//                         dataKey="month"
//                         tick={{ fill: "#666" }}
//                         axisLine={{ stroke: "#d9d9d9" }}
//                      />
//                      <YAxis
//                         tick={{ fill: "#666" }}
//                         axisLine={{ stroke: "#d9d9d9" }}
//                         tickFormatter={(value) => `₹${value / 1000}k`}
//                      />
//                      <Tooltip
//                         formatter={(value) => [`₹ ${value.toLocaleString()}`, "Revenue"]}
//                         contentStyle={{
//                            backgroundColor: "#fff",
//                            border: "1px solid #d9d9d9",
//                            borderRadius: "8px"
//                         }}
//                      />
//                      <Legend />
//                      <Line
//                         type="monotone"
//                         dataKey="revenue"
//                         stroke="#1890ff"
//                         strokeWidth={3}
//                         dot={{ r: 6, fill: "#1890ff" }}
//                         activeDot={{ r: 8, fill: "#096dd9" }}
//                         name="Revenue"
//                      />
//                   </LineChart>
//                </ResponsiveContainer>
//             ) : (
//                <div className="flex justify-center items-center h-64 text-gray-400">
//                   No revenue data available
//                </div>
//             )}
//          </Card>



//          {/* License/User Limit Card - Beautiful Design */}
//          {user?.role === "admin" && licenseStats && (
//             <Card
//                className="shadow-sm overflow-hidden"
//                bodyStyle={{ padding: 0 }}
//             >
//                {/* Header */}
//                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
//                   <div className="flex items-center gap-3">
//                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                         <TeamOutlined className="text-white text-xl" />
//                      </div>
//                      <div>
//                         <h3 className="text-white font-semibold text-lg m-0">
//                            License Overview
//                         </h3>
//                         <p className="text-indigo-100 text-sm m-0">
//                            User & Admin Limits
//                         </p>
//                      </div>
//                   </div>
//                </div>

//                {/* Stats Content */}
//                <div className="p-6">
//                   <Row gutter={[24, 24]}>
//                      {/* Users Card */}
//                      <Col xs={24} sm={12}>
//                         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
//                            <div className="flex items-center justify-between mb-4">
//                               <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
//                                  <UserOutlined className="text-white text-xl" />
//                               </div>
//                               <span className={`px-3 py-1 rounded-full text-sm font-medium ${licenseStats.totalUsers >= licenseStats.maxUsers
//                                  ? 'bg-red-100 text-red-600'
//                                  : 'bg-green-100 text-green-600'
//                                  }`}>
//                                  {licenseStats.totalUsers >= licenseStats.maxUsers ? 'Limit Reached' : 'Available'}
//                               </span>
//                            </div>

//                            <p className="text-gray-500 text-sm mb-1">Total Users</p>
//                            <p className="text-3xl font-bold text-gray-800 mb-3">
//                               {licenseStats.totalUsers}
//                               <span className="text-lg text-gray-400 font-normal">
//                                  {' '}/ {licenseStats.maxUsers}
//                               </span>
//                            </p>

//                            {/* Progress Bar */}
//                            <div className="w-full bg-gray-200 rounded-full h-2.5">
//                               <div
//                                  className={`h-2.5 rounded-full transition-all duration-500 ${(licenseStats.totalUsers / licenseStats.maxUsers) >= 0.9
//                                     ? 'bg-red-500'
//                                     : (licenseStats.totalUsers / licenseStats.maxUsers) >= 0.7
//                                        ? 'bg-yellow-500'
//                                        : 'bg-blue-500'
//                                     }`}
//                                  style={{
//                                     width: `${Math.min((licenseStats.totalUsers / licenseStats.maxUsers) * 100, 100)}%`
//                                  }}
//                               />
//                            </div>
//                            <p className="text-xs text-gray-400 mt-2">
//                               {licenseStats.maxUsers - licenseStats.totalUsers} slots remaining
//                            </p>
//                         </div>
//                      </Col>

//                      {/* Admins Card */}
//                      <Col xs={24} sm={12}>
//                         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
//                            <div className="flex items-center justify-between mb-4">
//                               <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
//                                  <CheckCircleOutlined className="text-white text-xl" />
//                               </div>
//                               <span className={`px-3 py-1 rounded-full text-sm font-medium ${licenseStats.adminCount >= licenseStats.maxAdmin
//                                  ? 'bg-red-100 text-red-600'
//                                  : 'bg-green-100 text-green-600'
//                                  }`}>
//                                  {licenseStats.adminCount >= licenseStats.maxAdmin ? 'Limit Reached' : 'Available'}
//                               </span>
//                            </div>

//                            <p className="text-gray-500 text-sm mb-1">Admin Users</p>
//                            <p className="text-3xl font-bold text-gray-800 mb-3">
//                               {licenseStats.adminCount}
//                               <span className="text-lg text-gray-400 font-normal">
//                                  {' '}/ {licenseStats.maxAdmin}
//                               </span>
//                            </p>

//                            {/* Progress Bar */}
//                            <div className="w-full bg-gray-200 rounded-full h-2.5">
//                               <div
//                                  className={`h-2.5 rounded-full transition-all duration-500 ${(licenseStats.adminCount / licenseStats.maxAdmin) >= 0.9
//                                     ? 'bg-red-500'
//                                     : (licenseStats.adminCount / licenseStats.maxAdmin) >= 0.7
//                                        ? 'bg-yellow-500'
//                                        : 'bg-purple-500'
//                                     }`}
//                                  style={{
//                                     width: `${Math.min((licenseStats.adminCount / licenseStats.maxAdmin) * 100, 100)}%`
//                                  }}
//                               />
//                            </div>
//                            <p className="text-xs text-gray-400 mt-2">
//                               {licenseStats.maxAdmin - licenseStats.adminCount} slots remaining
//                            </p>
//                         </div>
//                      </Col>
//                   </Row>
//                </div>
//             </Card>
//          )}

//       </div>
//    );
// };

// export default Dashboard;

import { useState, useEffect, useContext } from "react";
import { CiHome } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import {
   Card,
   Row,
   Col,
   Statistic,
   DatePicker,
   Button,
   Spin,
   Empty,
   Progress
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
   LineChartOutlined,
   ThunderboltOutlined,
   CrownOutlined,
   FireOutlined,
   TrophyOutlined
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
   ResponsiveContainer,
   Legend,
   Area,
   AreaChart
} from "recharts";
import axios from "../../api/axios";
import { AuthContext } from "../context/AuthContext";

const { RangePicker } = DatePicker;

const PREMIUM_GRADIENTS = {
   primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
   success: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
   warning: "linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)",
   danger: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
   info: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
   purple: "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)",
   mint: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)"
};

const Dashboard = () => {
   const navigate = useNavigate();
   const { user } = useContext(AuthContext);

   const [loading, setLoading] = useState(true);
   const [summary, setSummary] = useState({ overdue: 0, today: 0, upcoming: 0 });
   const [stats, setStats] = useState({});
   const [revenueData, setRevenueData] = useState({ totalRevenue: 0, monthlyRevenue: [] });
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

   const COLORS = ["#10b981", "#ef4444"];
   const MONTHLY_COLORS = ["#6366f1", "#f59e0b"];
   const CHART_COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e"];

   const monthlyRevenue = revenueData.monthlyRevenue || [];
   const thisMonthRevenue = monthlyRevenue.length > 0
      ? Number(monthlyRevenue[monthlyRevenue.length - 1].revenue)
      : 0;

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

   useEffect(() => {
      if (user?.role === "admin") {
         axios.get("/users/pending-count")
            .then(res => setPendingUsers(res.data.pendingUsers))
            .catch(err => console.log(err));
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

   useEffect(() => {
      setWeeklyLoading(true);
      axios.get("/dashboard/report-summary?type=weekly")
         .then(res => {
            const data = res.data;
            if (data && (data.converted !== undefined || data.notConverted !== undefined)) {
               setWeeklyData([
                  { name: "Converted", value: Number(data.converted) || 0 },
                  { name: "Not Converted", value: Number(data.notConverted) || 0 }
               ]);
            }
         })
         .catch(err => console.error(err))
         .finally(() => setWeeklyLoading(false));

      setMonthlyLoading(true);
      axios.get("/dashboard/report-summary?type=monthly")
         .then(res => {
            const data = res.data;
            if (data && (data.converted !== undefined || data.notConverted !== undefined)) {
               setMonthlyData([
                  { name: "Converted", value: Number(data.converted) || 0 },
                  { name: "Not Converted", value: Number(data.notConverted) || 0 }
               ]);
            }
         })
         .catch(err => console.error(err))
         .finally(() => setMonthlyLoading(false));
   }, []);

   useEffect(() => {
      axios.get("/sales-stats")
         .then(res => setSalesStats(res.data))
         .catch(err => console.log(err));
   }, []);

   useEffect(() => {
      if (user?.role === "admin") {
         axios.get("/license-stats")
            .then(res => setLicenseStats(res.data))
            .catch(err => console.log(err));
      }
   }, [user]);

   const fetchRevenue = (startDate, endDate) => {
      let url = "/dashboard/revenue";
      if (startDate && endDate) {
         url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      axios.get(url).then(res => setRevenueData(res.data));
   };

   const followupCards = [
      {
         title: "Overdue",
         count: summary.overdue,
         icon: <WarningOutlined />,
         gradient: PREMIUM_GRADIENTS.danger,
         iconColor: "#ef4444",
         type: "overdue"
      },
      {
         title: "Today",
         count: summary.today,
         icon: <FireOutlined />,
         gradient: PREMIUM_GRADIENTS.warning,
         iconColor: "#f59e0b",
         type: "today"
      },
      {
         title: "Upcoming",
         count: summary.upcoming,
         icon: <ClockCircleOutlined />,
         gradient: PREMIUM_GRADIENTS.success,
         iconColor: "#10b981",
         type: "upcoming"
      }
   ];

   const statsCards = [
      {
         title: "Total Leads",
         value: stats.totalLeads || 0,
         icon: <UserOutlined />,
         gradient: PREMIUM_GRADIENTS.primary,
         color: "#6366f1",
         bgColor: "#eef2ff"
      },
      {
         title: "Unassigned Leads",
         value: unassignedCount,
         icon: <WarningOutlined />,
         gradient: PREMIUM_GRADIENTS.warning,
         color: "#f59e0b",
         bgColor: "#fffbeb"
      },
      {
         title: "Total Projects",
         value: projectStats.length || 0,
         icon: <ProjectOutlined />,
         gradient: PREMIUM_GRADIENTS.purple,
         color: "#8b5cf6",
         bgColor: "#f5f3ff"
      },
      ...(user?.role === "admin" ? [{
         title: "Pending Users",
         value: pendingUsers,
         icon: <TeamOutlined />,
         gradient: PREMIUM_GRADIENTS.info,
         color: "#06b6d4",
         bgColor: "#ecfeff"
      }] : []),
      {
         title: "Total Sales",
         value: salesStats.totalSales || 0,
         icon: <DollarOutlined />,
         gradient: PREMIUM_GRADIENTS.success,
         color: "#10b981",
         bgColor: "#ecfdf5"
      }
   ];

   if (loading) {
      return (
         <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Spin size="large" />
         </div>
      );
   }
   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6">
         <style>{`
            .premium-card {
               background: white;
               border-radius: 24px;
               box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 
                           0 10px 15px -3px rgba(0, 0, 0, 0.05);
               border: 1px solid rgba(99, 102, 241, 0.08);
               transition: all 0.3s ease;
            }
            .premium-card:hover {
               transform: translateY(-5px);
               box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.15);
            }
            .stat-card {
               border-radius: 20px;
               padding: 24px;
               background: white;
               border: 1px solid rgba(0, 0, 0, 0.05);
               box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
               transition: all 0.3s ease;
            }
            .stat-card:hover {
               transform: translateY(-5px);
               box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            .followup-card {
               padding: 28px;
               border-radius: 24px;
               cursor: pointer;
               transition: all 0.3s ease;
               color: white;
            }
            .followup-card:hover {
               transform: translateY(-8px) scale(1.02);
               box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            .gradient-text {
               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
               -webkit-background-clip: text;
               -webkit-text-fill-color: transparent;
               background-clip: text;
            }
         `}</style>

         <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="premium-card p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />

               <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                     {/* <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ background: PREMIUM_GRADIENTS.primary }}
                     >
                        <CrownOutlined className="text-white text-2xl" />
                     </div> */}
                     <div>
                        <h1 className="text-3xl font-bold text-gray-800 m-0">
                           Dashboard <span className="gradient-text">Overview</span>
                        </h1>
                        <p className="text-gray-500 m-0 mt-1">
                           Welcome back! Here's what's happening with your leads today.
                        </p>
                     </div>
                  </div>
                  <div className="hidden md:block text-right">
                     <p className="text-gray-400 text-sm m-0">Today's Date</p>
                     <p className="text-gray-700 font-semibold m-0">
                        {new Date().toLocaleDateString('en-US', {
                           weekday: 'short',
                           month: 'short',
                           day: 'numeric',
                           year: 'numeric'
                        })}
                     </p>
                  </div>
               </div>
            </div>

            {/* Follow-ups Section */}
            <div>
               <div className="flex items-center gap-3 mb-6">
                  <div
                     className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                     style={{ background: PREMIUM_GRADIENTS.warning }}
                  >
                     <CalendarOutlined className="text-white text-lg" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 m-0">
                     Follow-ups Summary
                  </h2>
               </div>

               <Row gutter={[20, 20]}>
                  {followupCards.map((card, index) => (
                     <Col xs={24} sm={8} key={index}>
                        <div
                           className="followup-card"
                           style={{
                              background: card.gradient,
                              boxShadow: `0 15px 30px -5px ${card.iconColor}40`
                           }}
                           onClick={() => navigate(`/followups?type=${card.type}`)}
                        >
                           <div className="flex items-center justify-between">
                              <div>
                                 <p className="text-white/80 font-medium text-sm mb-2 uppercase tracking-wider">
                                    {card.title}
                                 </p>
                                 <p className="text-5xl font-bold text-white m-0">
                                    {card.count}
                                 </p>
                              </div>
                              <div className="text-white/20 text-6xl">
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
               <div className="flex items-center gap-3 mb-6">
                  <div
                     className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                     style={{ background: PREMIUM_GRADIENTS.info }}
                  >
                     <ThunderboltOutlined className="text-white text-lg" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 m-0">
                     Quick Stats
                  </h2>
               </div>

               <Row gutter={[20, 20]}>
                  {statsCards.map((card, index) => (
                     <Col xs={24} sm={12} md={6} key={index}>
                        <div className="stat-card" style={{ background: card.bgColor }}>
                           <div className="flex items-start justify-between mb-4">
                              <div
                                 className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                                 style={{ background: card.gradient }}
                              >
                                 <span className="text-white text-2xl">{card.icon}</span>
                              </div>
                           </div>
                           <p className="text-gray-500 text-sm font-medium mb-1">
                              {card.title}
                           </p>
                           <p className="text-4xl font-bold m-0" style={{ color: card.color }}>
                              {card.value.toLocaleString()}
                           </p>
                        </div>
                     </Col>
                  ))}
               </Row>
            </div>

            {/* Project Performance Section */}
            <div className="premium-card p-8">
               <div className="flex items-center gap-3 mb-6">
                  <div
                     className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                     style={{ background: PREMIUM_GRADIENTS.purple }}
                  >
                     <TrophyOutlined className="text-white text-lg" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 m-0">
                     Project Performance
                  </h2>
               </div>

               {projectStats.length > 0 ? (
                  <>
                     <Row gutter={[16, 16]} className="mb-8">
                        {projectStats.map((project, index) => (
                           <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
                              <div
                                 className="p-5 rounded-2xl h-full bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
                                 style={{ borderLeft: `4px solid ${CHART_COLORS[index % CHART_COLORS.length]}` }}
                              >
                                 <h3 className="text-gray-800 font-semibold text-lg mb-4 truncate">
                                    {project.project_name}
                                 </h3>
                                 <div className="space-y-2">
                                    <div className="flex justify-between">
                                       <span className="text-gray-500 text-sm">Leads</span>
                                       <span className="text-gray-800 font-bold">{project.total_leads}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-500 text-sm">Closed Won</span>
                                       <span className="text-green-600 font-bold">{project.closed_won || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-500 text-sm">Revenue</span>
                                       <span className="text-indigo-600 font-bold">₹{(project.revenue || 0).toLocaleString()}</span>
                                    </div>
                                 </div>
                              </div>
                           </Col>
                        ))}
                     </Row>

                     <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                        <ResponsiveContainer width="100%" height={300}>
                           <BarChart data={projectStats}>
                              <defs>
                                 <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="project_name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                              <Tooltip
                                 contentStyle={{
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                 }}
                              />
                              <Bar dataKey="total_leads" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </>
               ) : (
                  <div className="flex justify-center items-center h-40">
                     <Empty description="No project data available" />
                  </div>
               )}
            </div>

            {/* Charts Section */}
            <Row gutter={[20, 20]}>
               {/* Conversion Rate Chart */}
               <Col xs={24} lg={14}>
                  <div className="premium-card p-8 h-full">
                     <div className="flex items-center gap-3 mb-6">
                        <div
                           className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                           style={{ background: PREMIUM_GRADIENTS.success }}
                        >
                           <PieChartOutlined className="text-white text-lg" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 m-0">
                           Lead Conversion Rate
                        </h2>
                     </div>

                     {conversionChartData.length > 0 ? (
                        <div>
                           <ResponsiveContainer width="100%" height={280}>
                              <PieChart>
                                 <defs>
                                    <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                                       <stop offset="0%" stopColor="#10b981" />
                                       <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                    <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="1">
                                       <stop offset="0%" stopColor="#f87171" />
                                       <stop offset="100%" stopColor="#ef4444" />
                                    </linearGradient>
                                 </defs>
                                 <Pie
                                    data={conversionChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={60}
                                    paddingAngle={5}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                 >
                                    <Cell fill="url(#greenGradient)" />
                                    <Cell fill="url(#redGradient)" />
                                 </Pie>
                                 <Tooltip
                                    contentStyle={{
                                       background: 'white',
                                       border: '1px solid #e5e7eb',
                                       borderRadius: '12px'
                                    }}
                                 />
                                 <Legend />
                              </PieChart>
                           </ResponsiveContainer>

                           <div className="mt-6 p-6 rounded-2xl text-center bg-gradient-to-r from-indigo-50 to-purple-50">
                              <p className="text-gray-500 mb-2">Overall Conversion Rate</p>
                              <p className="text-5xl font-bold gradient-text">{conversionRate}%</p>
                           </div>
                        </div>
                     ) : (
                        <div className="flex justify-center items-center h-64">
                           <Empty description="No data available" />
                        </div>
                     )}
                  </div>
               </Col>

               {/* Revenue Card */}
               <Col xs={24} lg={10}>
                  <div className="premium-card p-8 h-full">
                     <div className="flex items-center gap-3 mb-6">
                        <div
                           className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                           style={{ background: PREMIUM_GRADIENTS.mint }}
                        >
                           <DollarOutlined className="text-white text-lg" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 m-0">
                           Revenue Overview
                        </h2>
                     </div>

                     <div className="flex flex-wrap gap-3 mb-6">
                        <RangePicker
                           onChange={(dates, dateStrings) => setDateRange(dateStrings)}
                           className="flex-1 min-w-48"
                        />
                        <Button
                           type="primary"
                           icon={<FilterOutlined />}
                           onClick={() => fetchRevenue(dateRange[0], dateRange[1])}
                           style={{ background: PREMIUM_GRADIENTS.primary, border: 'none' }}
                        >
                           Apply
                        </Button>
                        <Button icon={<ReloadOutlined />} onClick={() => fetchRevenue()}>
                           Reset
                        </Button>
                     </div>

                     <div
                        className="rounded-2xl p-8 text-center mb-6 relative overflow-hidden"
                        style={{ background: PREMIUM_GRADIENTS.success }}
                     >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <p className="text-white/80 mb-2 relative z-10">Total Revenue</p>
                        <p className="text-5xl font-bold text-white relative z-10">
                           ₹ {revenueData.totalRevenue?.toLocaleString() || 0}
                        </p>
                     </div>

                     <div className="rounded-2xl p-6 text-center bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                        <p className="text-gray-500 text-sm mb-1">This Month</p>
                        <p className="text-3xl font-bold text-indigo-600">
                           ₹ {thisMonthRevenue.toLocaleString()}
                        </p>
                     </div>
                  </div>
               </Col>
            </Row>

            {/* Weekly & Monthly Performance */}
            <Row gutter={[20, 20]}>
               <Col xs={24} md={12}>
                  <div className="premium-card p-8">
                     <div className="flex items-center gap-3 mb-6">
                        <div
                           className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                           style={{ background: PREMIUM_GRADIENTS.success }}
                        >
                           <PieChartOutlined className="text-white text-lg" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 m-0">Weekly Performance</h2>
                     </div>

                     {weeklyLoading ? (
                        <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
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
                                 innerRadius={40}
                                 paddingAngle={5}
                                 label={({ name, value }) => `${name}: ${value}`}
                              >
                                 {weeklyData.map((entry, index) => (
                                    <Cell key={`weekly-cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  </div>
               </Col>

               <Col xs={24} md={12}>
                  <div className="premium-card p-8">
                     <div className="flex items-center gap-3 mb-6">
                        <div
                           className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                           style={{ background: PREMIUM_GRADIENTS.primary }}
                        >
                           <PieChartOutlined className="text-white text-lg" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 m-0">Monthly Performance</h2>
                     </div>

                     {monthlyLoading ? (
                        <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
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
                                 innerRadius={40}
                                 paddingAngle={5}
                                 label={({ name, value }) => `${name}: ${value}`}
                              >
                                 {monthlyData.map((entry, index) => (
                                    <Cell key={`monthly-cell-${index}`} fill={MONTHLY_COLORS[index % MONTHLY_COLORS.length]} />
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
                  </div>
               </Col>
            </Row>

            {/* Monthly Revenue Trend */}
            <div className="premium-card p-8">
               <div className="flex items-center gap-3 mb-6">
                  <div
                     className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                     style={{ background: PREMIUM_GRADIENTS.info }}
                  >
                     <LineChartOutlined className="text-white text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 m-0">Monthly Revenue Trend</h2>
               </div>

               {revenueData.monthlyRevenue?.length > 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                     <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={revenueData.monthlyRevenue}>
                           <defs>
                              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                 <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                           <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                           <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `₹${value / 1000}k`} />
                           <Tooltip formatter={(value) => [`₹ ${value.toLocaleString()}`, "Revenue"]} />
                           <Legend />
                           <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fill="url(#revenueGradient)" name="Revenue" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               ) : (
                  <div className="flex justify-center items-center h-64">
                     <Empty description="No revenue data available" />
                  </div>
               )}
            </div>

            {/* License Card */}
            {user?.role === "admin" && licenseStats && (
               <div className="premium-card overflow-hidden">
                  <div className="p-6" style={{ background: PREMIUM_GRADIENTS.primary }}>
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                           <CrownOutlined className="text-white text-2xl" />
                        </div>
                        <div>
                           <h3 className="text-white font-bold text-2xl m-0">License Overview</h3>
                           <p className="text-white/70 m-0">User & Admin Limits</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-8">
                     <Row gutter={[24, 24]}>
                        <Col xs={24} sm={12}>
                           <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                              <div className="flex items-center justify-between mb-4">
                                 <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                                    style={{ background: PREMIUM_GRADIENTS.info }}
                                 >
                                    <UserOutlined className="text-white text-xl" />
                                 </div>
                                 <span className={`px-4 py-2 rounded-full text-sm font-semibold ${licenseStats.totalUsers >= licenseStats.maxUsers
                                       ? 'bg-red-100 text-red-600'
                                       : 'bg-green-100 text-green-600'
                                    }`}>
                                    {licenseStats.totalUsers >= licenseStats.maxUsers ? 'Limit Reached' : 'Available'}
                                 </span>
                              </div>
                              <p className="text-gray-500 text-sm mb-2">Total Users</p>
                              <p className="text-4xl font-bold text-gray-800 mb-4">
                                 {licenseStats.totalUsers}
                                 <span className="text-xl text-gray-400 font-normal"> / {licenseStats.maxUsers}</span>
                              </p>
                              <Progress
                                 percent={Math.round((licenseStats.totalUsers / licenseStats.maxUsers) * 100)}
                                 strokeColor={{ '0%': '#6366f1', '100%': '#8b5cf6' }}
                                 trailColor="#e0e7ff"
                                 showInfo={false}
                                 strokeWidth={10}
                              />
                              <p className="text-gray-500 text-sm mt-3">
                                 <span className="text-indigo-600 font-semibold">{licenseStats.maxUsers - licenseStats.totalUsers}</span> slots remaining
                              </p>
                           </div>
                        </Col>

                        <Col xs={24} sm={12}>
                           <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                              <div className="flex items-center justify-between mb-4">
                                 <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                                    style={{ background: PREMIUM_GRADIENTS.purple }}
                                 >
                                    <CheckCircleOutlined className="text-white text-xl" />
                                 </div>
                                 <span className={`px-4 py-2 rounded-full text-sm font-semibold ${licenseStats.adminCount >= licenseStats.maxAdmin
                                       ? 'bg-red-100 text-red-600'
                                       : 'bg-green-100 text-green-600'
                                    }`}>
                                    {licenseStats.adminCount >= licenseStats.maxAdmin ? 'Limit Reached' : 'Available'}
                                 </span>
                              </div>
                              <p className="text-gray-500 text-sm mb-2">Admin Users</p>
                              <p className="text-4xl font-bold text-gray-800 mb-4">
                                 {licenseStats.adminCount}
                                 <span className="text-xl text-gray-400 font-normal"> / {licenseStats.maxAdmin}</span>
                              </p>
                              <Progress
                                 percent={Math.round((licenseStats.adminCount / licenseStats.maxAdmin) * 100)}
                                 strokeColor={{ '0%': '#8b5cf6', '100%': '#d946ef' }}
                                 trailColor="#f3e8ff"
                                 showInfo={false}
                                 strokeWidth={10}
                              />
                              <p className="text-gray-500 text-sm mt-3">
                                 <span className="text-purple-600 font-semibold">{licenseStats.maxAdmin - licenseStats.adminCount}</span> slots remaining
                              </p>
                           </div>
                        </Col>
                     </Row>
                  </div>
               </div>
            )}

         </div>
      </div>
   );
};

export default Dashboard;