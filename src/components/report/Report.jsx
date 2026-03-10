import { Card, Row, Col, Button, message, Table } from "antd";
import { useState } from "react";
import axios from "../../api/axios";
import dayjs from "dayjs";

const Reports = () => {

   const [data, setData] = useState(null);
   const [type, setType] = useState("weekly");
   const [summary, setSummary] = useState(null);
   const [rows, setRows] = useState([]);


   // const fetchReport = (reportType) => {
   //    setType(reportType);

   //    axios.get(`/reports?type=${reportType}`)
   //       .then(res => setData(res.data))
   //       .catch(() => message.error("Failed to load report"));
   // };

   const fetchReport = (reportType) => {

      setType(reportType);

      axios.get(`/reports?type=${reportType}`)
         .then(res => {
            setSummary(res.data.summary);
            setRows(res.data.rows);
         })
         .catch(() => message.error("Failed to load report"));
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

      } catch {
         message.error("Export failed");
      }
   };

   const columns = [
      {
         title: "Lead Name",
         dataIndex: "lead_name",
      },
      {
         title: "Status",
         dataIndex: "status",
      },
      {
         title: "Sale Amount",
         dataIndex: "sale_amount",
         render: val => val ? `₹ ${val}` : "-"
      },
      {
         title: "Closing Date",
         dataIndex: "closing_date",
         render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-"
      }
   ];


   const tableData = data ? [
      { key: 1, metric: "Total Leads", value: data.totalLeads },
      { key: 2, metric: "Converted Leads", value: data.convertedLeads },
      { key: 3, metric: "Revenue", value: `₹ ${data.totalRevenue}` },
      { key: 4, metric: "Conversion Rate", value: `${data.conversionRate} %` },
   ] : [];



   return (
      <div>

         <h2 className="text-xl font-semibold">Sell Converted Report</h2>
         <br/>
         <div className="mb-4 flex gap-2">
            <Button onClick={() => fetchReport("weekly")}>
               Weekly Report
            </Button>

            <Button type="primary" onClick={() => fetchReport("monthly")}>
               Monthly Report
            </Button>

            <Button danger onClick={handleExport}>
               Export Excel
            </Button>
         </div>
         {summary && (
            <Row gutter={16} className="mb-4">
               <Col span={6}>
                  <Card size="small" title="Total Leads">
                     {summary.totalLeads}
                  </Card>
               </Col>

               <Col span={6}>
                  <Card size="small" title="Converted Leads">
                     {summary.convertedLeads}
                  </Card>
               </Col>

               <Col span={6}>
                  <Card  size="small" title="Revenue">
                     ₹ {summary.totalRevenue}
                  </Card>
               </Col>

               {/* <Col span={6}>
                  <Card title="Conversion Rate">
                     {summary.conversionRate} %
                  </Card>
               </Col> */}

            </Row>
         )}

         <Card title={`${type?.toUpperCase()} Detailed Report`}>
            <Table
               size="small"

               columns={columns}
               dataSource={rows}
               rowKey="id"
            />
         </Card>



      </div>
   );
};

export default Reports;
