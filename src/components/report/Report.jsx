// import { Card, Row, Col, Button, message, Table } from "antd";
// import { useState } from "react";
// import axios from "../../api/axios";
// import dayjs from "dayjs";

// const Reports = () => {

//    const [data, setData] = useState(null);
//    const [type, setType] = useState("weekly");
//    const [summary, setSummary] = useState(null);
//    const [rows, setRows] = useState([]);


//    // const fetchReport = (reportType) => {
//    //    setType(reportType);

//    //    axios.get(`/reports?type=${reportType}`)
//    //       .then(res => setData(res.data))
//    //       .catch(() => message.error("Failed to load report"));
//    // };

//    const fetchReport = (reportType) => {

//       setType(reportType);

//       axios.get(`/reports?type=${reportType}`)
//          .then(res => {
//             setSummary(res.data.summary);
//             setRows(res.data.rows);
//          })
//          .catch(() => message.error("Failed to load report"));
//    };


//    const handleExport = async () => {

//       try {
//          const response = await axios.get(
//             `/reports/export?type=${type}`,
//             { responseType: "blob" }
//          );

//          const url = window.URL.createObjectURL(new Blob([response.data]));
//          const link = document.createElement("a");
//          link.href = url;
//          link.setAttribute("download", `${type}-report.xlsx`);
//          document.body.appendChild(link);
//          link.click();
//          link.remove();

//       } catch {
//          message.error("Export failed");
//       }
//    };

//    const columns = [
//       {
//          title: "Lead Name",
//          dataIndex: "lead_name",
//       },
//       {
//          title: "Status",
//          dataIndex: "status",
//       },
//       {
//          title: "Sale Amount",
//          dataIndex: "sale_amount",
//          render: val => val ? `₹ ${val}` : "-"
//       },
//       {
//          title: "Closing Date",
//          dataIndex: "closing_date",
//          render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-"
//       }
//    ];


//    const tableData = data ? [
//       { key: 1, metric: "Total Leads", value: data.totalLeads },
//       { key: 2, metric: "Converted Leads", value: data.convertedLeads },
//       { key: 3, metric: "Revenue", value: `₹ ${data.totalRevenue}` },
//       { key: 4, metric: "Conversion Rate", value: `${data.conversionRate} %` },
//    ] : [];



//    return (
//       <div>

//          <h2 className="text-xl font-semibold">Sell Converted Report</h2>
//          <br/>
//          <div className="mb-4 flex gap-2">
//             <Button onClick={() => fetchReport("weekly")}>
//                Weekly Report
//             </Button>

//             <Button type="primary" onClick={() => fetchReport("monthly")}>
//                Monthly Report
//             </Button>

//             <Button danger onClick={handleExport}>
//                Export Excel
//             </Button>
//          </div>
//          {summary && (
//             <Row gutter={16} className="mb-4">
//                <Col span={6}>
//                   <Card size="small" title="Total Leads">
//                      {summary.totalLeads}
//                   </Card>
//                </Col>

//                <Col span={6}>
//                   <Card size="small" title="Converted Leads">
//                      {summary.convertedLeads}
//                   </Card>
//                </Col>

//                <Col span={6}>
//                   <Card  size="small" title="Revenue">
//                      ₹ {summary.totalRevenue}
//                   </Card>
//                </Col>

//                {/* <Col span={6}>
//                   <Card title="Conversion Rate">
//                      {summary.conversionRate} %
//                   </Card>
//                </Col> */}

//             </Row>
//          )}

//          <Card title={`${type?.toUpperCase()} Detailed Report`}>
//             <Table
//                size="small"

//                columns={columns}
//                dataSource={rows}
//                rowKey="id"
//             />
//          </Card>



//       </div>
//    );
// };

// export default Reports;

import { Card, Row, Col, Button, message, Table, Tag } from "antd";
import { useState } from "react";
import axios from "../../api/axios";
import dayjs from "dayjs";
import {
   FileExcelOutlined,
   CalendarOutlined,
   DollarOutlined,
   TrophyOutlined,
   BarChartOutlined,
   DownloadOutlined
} from "@ant-design/icons";

const Reports = () => {
   const [data, setData] = useState(null);
   const [type, setType] = useState("weekly");
   const [summary, setSummary] = useState(null);
   const [rows, setRows] = useState([]);
   const [loading, setLoading] = useState(false);

   const fetchReport = (reportType) => {
      setType(reportType);
      setLoading(true);
      
      axios.get(`/reports?type=${reportType}`)
         .then(res => {
            setSummary(res.data.summary);
            setRows(res.data.rows);
         })
         .catch(() => message.error("Failed to load report"))
         .finally(() => setLoading(false));
   };

   const handleExport = async () => {
      try {
         const response = await axios.get(
            `/reports/export?type=${type}`,
            { responseType: "blob" }
         );

         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", `${type}-report.xlsx`);
         document.body.appendChild(link);
         link.click();
         link.remove();
         message.success("Export successful");
      } catch {
         message.error("Export failed");
      }
   };

   const columns = [
      {
         title: "#",
         width: 50,
         align: "center",
         render: (_, __, index) => (
            <span className="text-xs text-gray-400">{index + 1}</span>
         )
      },
      {
         title: "Lead Name",
         dataIndex: "lead_name",
         render: (name) => <span className="font-medium text-gray-800">{name}</span>
      },
      {
         title: "Status",
         dataIndex: "status",
         render: (status) => {
            const color = status === "Closed Won" ? "green" : 
                         status === "Closed Lost" ? "red" : "blue";
            return <Tag color={color}>{status}</Tag>;
         }
      },
      {
         title: "Sale Amount",
         dataIndex: "sale_amount",
         render: val => val ? (
            <span className="font-semibold text-green-600">
               ₹ {Number(val).toLocaleString('en-IN')}
            </span>
         ) : <span className="text-gray-400">-</span>
      },
      {
         title: "Closing Date",
         dataIndex: "closing_date",
         render: (date) => (
            <span className="text-gray-600 text-sm">
               {date ? dayjs(date).format("DD MMM YYYY") : "-"}
            </span>
         )
      }
   ];

   return (
      <div className="bg-gray-50 min-h-screen">
         <style>{`
            .reports-card {
               background: #fff;
               border-radius: 10px;
               box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
               border: 1px solid #f3f4f6;
            }
            .reports-table .ant-table-thead > tr > th {
               background: #f9fafb;
               font-size: 12px;
               font-weight: 600;
               padding: 10px 16px;
            }
            .reports-table .ant-table-tbody > tr > td {
               padding: 10px 16px;
               font-size: 13px;
            }
            .reports-table .ant-table-tbody > tr:hover > td {
               background: #f9fafb;
            }
            .stat-card {
               border-radius: 10px;
               transition: all 0.3s;
            }
            .stat-card:hover {
               transform: translateY(-2px);
               box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }
         `}</style>

         {/* Header */}
         <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-xl font-semibold text-gray-800 m-0">Reports</h1>
                  <span className="text-gray-400 text-sm">Sales conversion reports</span>
               </div>
               <div className="flex gap-2">
                  <Button
                     type={type === "weekly" ? "primary" : "default"}
                     icon={<CalendarOutlined />}
                     onClick={() => fetchReport("weekly")}
                  >
                     Weekly
                  </Button>
                  <Button
                     type={type === "monthly" ? "primary" : "default"}
                     icon={<CalendarOutlined />}
                     onClick={() => fetchReport("monthly")}
                  >
                     Monthly
                  </Button>
                  <Button
                     icon={<DownloadOutlined />}
                     onClick={handleExport}
                     disabled={!summary}
                  >
                     Export Excel
                  </Button>
               </div>
            </div>
         </div>

         <div className="p-6">
            {/* Stats Cards */}
            {summary && (
               <Row gutter={[16, 16]} className="mb-4">
                  <Col xs={24} sm={8}>
                     <div className="reports-card stat-card p-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <div className="text-xs text-gray-500 mb-1">Total Leads</div>
                              <div className="text-2xl font-bold text-gray-800">
                                 {summary.totalLeads}
                              </div>
                           </div>
                           <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <BarChartOutlined className="text-blue-500 text-lg" />
                           </div>
                        </div>
                     </div>
                  </Col>

                  <Col xs={24} sm={8}>
                     <div className="reports-card stat-card p-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <div className="text-xs text-gray-500 mb-1">Converted</div>
                              <div className="text-2xl font-bold text-gray-800">
                                 {summary.convertedLeads}
                              </div>
                           </div>
                           <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <TrophyOutlined className="text-green-500 text-lg" />
                           </div>
                        </div>
                     </div>
                  </Col>

                  <Col xs={24} sm={8}>
                     <div className="reports-card stat-card p-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
                              <div className="text-2xl font-bold text-green-600">
                                 ₹ {Number(summary.totalRevenue).toLocaleString('en-IN')}
                              </div>
                           </div>
                           <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <DollarOutlined className="text-green-500 text-lg" />
                           </div>
                        </div>
                     </div>
                  </Col>
               </Row>
            )}

            {/* Table Card */}
            <div className="reports-card reports-table">
               <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                     <FileExcelOutlined className="text-gray-600" />
                     <span className="font-medium text-gray-700">
                        {type === "weekly" ? "Weekly" : "Monthly"} Report Details
                     </span>
                     <Tag>{rows.length}</Tag>
                  </div>
               </div>

               <Table
                  size="small"
                  columns={columns}
                  dataSource={rows}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                     pageSize: 10,
                     showTotal: (total, range) => (
                        <span className="text-sm text-gray-500">
                           Showing <b>{range[0]}-{range[1]}</b> of <b>{total}</b> records
                        </span>
                     ),
                     size: "small"
                  }}
               />
            </div>
         </div>
      </div>
   );
};

export default Reports;