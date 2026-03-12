// import { useContext, useState, useEffect } from "react";
// import { Table, Card,  message, Form, Button, Modal,  DatePicker, InputNumber } from "antd";
// import { AuthContext } from "../context/AuthContext";
// import dayjs from "dayjs";
// import axios from "../../api/axios";
// import {
//    EditOutlined,
// } from "@ant-design/icons";

// const Sales = () => {

//    const [sales, setSales] = useState([]);
//    const [totalRevenue, setTotalRevenue] = useState(0);
//    const [editOpen, setEditOpen] = useState(false);
//    const [editingSale, setEditingSale] = useState(null);
//    const { user } = useContext(AuthContext);
//    const [form] = Form.useForm();


//    const fetchSales = () => {
//       axios.get("/sales")
//          .then(res => {
//             setSales(res.data);

//             // Calculate total revenue
//             const total = res.data.reduce((sum, item) => {
//                return sum + Number(item.sale_amount);
//             }, 0);

//             setTotalRevenue(total);
//          })
//          .catch(() => {
//             message.error("Failed to load sales");
//          });
//    };

//    useEffect(() => {
//       fetchSales();
//    }, []);


//    const columns = [
//       {
//          title: "Lead Name",
//          dataIndex: "lead_name",
//       },
//       {
//          title: "Assigned To",
//          dataIndex: "assigned_to_name",
//          render: (name) => name || "Unassigned"
//       },
//       {
//          title: "Sale Amount",
//          dataIndex: "sale_amount",
//          render: (amount) => `₹ ${amount}`
//       },
//       {
//          title: "Closing Date",
//          dataIndex: "closing_date",
//          render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-"
//       },
//       {
//          title: "Deal Converted By",
//          dataIndex: "created_by_name",
//       },

//       ...(user?.role === "admin" ? [{
//          title: "Action",
//          key: "action",
//          render: (_, record) => (
//             <Button
//                type="text"
//                icon={<EditOutlined />}
//                onClick={() => {
//                   setEditingSale(record);
//                   form.setFieldsValue({
//                      sale_amount: record.sale_amount,
//                      closing_date: dayjs(record.closing_date)
//                   });
//                   setEditOpen(true);
//                }}
//             />
//          )
//       }] : [])

//    ];

//    return (
//       <div className="p-6">

//          {/* Revenue Summary Card */}
//          {/* <Row gutter={16} className="mb-6">
//             <Col span={8}>
//                <Card>
//                   <Statistic
//                      title="Total Revenue"
//                      value={totalRevenue}
//                      precision={2}
//                      prefix={<DollarOutlined />}
//                   />
//                </Card>
//             </Col>
//          </Row> */}

//          {/* Sales Table */}
//          <Card title="Sales List">
//             <Table
//                size="small"

//                dataSource={sales}
//                columns={columns}
//                rowKey="id"
//                pagination={{ pageSize: 5 }}
//             />
//          </Card>


//          <Modal
//             title="Edit Sale"
//             open={editOpen}
//             onCancel={() => setEditOpen(false)}
//             footer={null}
//          >
//             <Form
//                layout="vertical"
//                form={form}
//                onFinish={(values) => {

//                   axios.put(`/sales/${editingSale.id}`, {
//                      sale_amount: values.sale_amount,
//                      closing_date: values.closing_date.format("YYYY-MM-DD")
//                   })
//                      .then(() => {
//                         message.success("Sale updated successfully");
//                         setEditOpen(false);
//                         fetchSales();
//                      })
//                      .catch(err => {
//                         message.error(err.response?.data?.message || "Update failed");
//                      });
//                }}
//             >

//                <Form.Item
//                   name="sale_amount"
//                   label="Sale Amount"
//                   rules={[
//                      { required: true, message: "Enter sale amount" }
//                   ]}
//                >
//                   {/* <InputNumber
//                      style={{ width: "100%" }}
//                      min={1}
//                      precision={2}
//                   /> */}
//                   <InputNumber
//                      style={{ width: "100%" }}
//                      min={1}
//                      precision={2}
//                      formatter={(value) =>
//                         `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                      }
//                      parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
//                   />

//                </Form.Item>


//                <Form.Item
//                   name="closing_date"
//                   label="Closing Date"
//                   rules={[{ required: true }]}
//                >
//                   <DatePicker style={{ width: "100%" }} />
//                </Form.Item>

//                <Button type="primary" htmlType="submit" block>
//                   Update Sale
//                </Button>

//             </Form>
//          </Modal>


//       </div>
//    );
// };

// export default Sales;

import { useContext, useState, useEffect } from "react";
import { Table, message, Form, Button, Modal, DatePicker, InputNumber, Tag, Input } from "antd";
import { AuthContext } from "../context/AuthContext";
import dayjs from "dayjs";
import axios from "../../api/axios";
import {
   EditOutlined,
   TrophyOutlined,
   UserOutlined,
   SearchOutlined
} from "@ant-design/icons";

const Sales = () => {
   const [sales, setSales] = useState([]);
   const [totalRevenue, setTotalRevenue] = useState(0);
   const [editOpen, setEditOpen] = useState(false);
   const [editingSale, setEditingSale] = useState(null);
   const [loading, setLoading] = useState(false);
   const [searchText, setSearchText] = useState("");
   const { user } = useContext(AuthContext);
   const [form] = Form.useForm();

   const fetchSales = () => {
      setLoading(true);
      axios.get("/sales")
         .then(res => {
            setSales(res.data);
            const total = res.data.reduce((sum, item) => sum + Number(item.sale_amount), 0);
            setTotalRevenue(total);
         })
         .catch(() => message.error("Failed to load sales"))
         .finally(() => setLoading(false));
   };

   useEffect(() => {
      fetchSales();
   }, []);

   // Filter sales based on search
   const filteredSales = sales.filter(sale => {
      const searchLower = searchText.toLowerCase();
      return (
         sale.lead_name?.toLowerCase().includes(searchLower) ||
         sale.assigned_to_name?.toLowerCase().includes(searchLower) ||
         sale.created_by_name?.toLowerCase().includes(searchLower) ||
         sale.sale_amount?.toString().includes(searchLower)
      );
   });

   // Calculate filtered revenue
   const filteredRevenue = filteredSales.reduce((sum, item) => sum + Number(item.sale_amount), 0);

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
         render: (name) => (
            <span className="font-medium text-gray-800">{name}</span>
         )
      },
      {
         title: "Assigned To",
         dataIndex: "assigned_to_name",
         render: (name) => name ? (
            <Tag color="blue">{name}</Tag>
         ) : (
            <span className="text-gray-400 text-xs">Unassigned</span>
         )
      },
      {
         title: "Sale Amount",
         dataIndex: "sale_amount",
         render: (amount) => (
            <span className="font-semibold text-green-600">
               ₹ {Number(amount).toLocaleString('en-IN')}
            </span>
         )
      },
      {
         title: "Closing Date",
         dataIndex: "closing_date",
         render: (date) => (
            <span className="text-gray-600 text-sm">
               {date ? dayjs(date).format("DD MMM YYYY") : "-"}
            </span>
         )
      },
      {
         title: "Converted By",
         dataIndex: "created_by_name",
         render: (name) => (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
               <UserOutlined style={{ fontSize: '11px' }} />
               {name}
            </div>
         )
      },
      ...(user?.role === "admin" ? [{
         title: "Action",
         key: "action",
         align: "center",
         width: 80,
         render: (_, record) => (
            <Button
               type="text"
               size="small"
               icon={<EditOutlined />}
               onClick={() => {
                  setEditingSale(record);
                  form.setFieldsValue({
                     sale_amount: record.sale_amount,
                     closing_date: dayjs(record.closing_date)
                  });
                  setEditOpen(true);
               }}
            />
         )
      }] : [])
   ];

   return (
      <div className="bg-gray-50 min-h-screen">
         <style>{`
            .sales-card {
               background: #fff;
               border-radius: 10px;
               box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
               border: 1px solid #f3f4f6;
            }
            .sales-table .ant-table-thead > tr > th {
               background: #f9fafb;
               font-size: 12px;
               font-weight: 600;
               padding: 10px 16px;
            }
            .sales-table .ant-table-tbody > tr > td {
               padding: 10px 16px;
               font-size: 13px;
            }
            .sales-table .ant-table-tbody > tr:hover > td {
               background: #f9fafb;
            }
         `}</style>

         {/* Header */}
         <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-xl font-semibold text-gray-800 m-0">Sales</h1>
                  <span className="text-gray-400 text-sm">{filteredSales.length} total sales</span>
               </div>
               <div className="text-right">
                  <div className="text-xs text-gray-500">
                     {searchText ? 'Filtered' : 'Total'} Revenue
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                     ₹ {(searchText ? filteredRevenue : totalRevenue).toLocaleString('en-IN')}
                  </div>
               </div>
            </div>
         </div>

         <div className="p-6">
            {/* Table Card */}
            <div className="sales-card sales-table">
               <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <TrophyOutlined className="text-green-600" />
                        <span className="font-medium text-gray-700">Sales List</span>
                        <Tag>{filteredSales.length}</Tag>
                     </div>
                     <Input.Search
                        placeholder="Search by lead, user, amount..."
                        allowClear
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        prefix={<SearchOutlined className="text-gray-400" />}
                     />
                  </div>
               </div>

               <Table
                  size="small"
                  dataSource={filteredSales}
                  columns={columns}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                     pageSize: 10,
                     showTotal: (total, range) => (
                        <span className="text-sm text-gray-500">
                           Showing <b>{range[0]}-{range[1]}</b> of <b>{total}</b> sales
                        </span>
                     ),
                     size: "small"
                  }}
               />
            </div>
         </div>

         {/* Edit Modal */}
         <Modal
            title="Edit Sale"
            open={editOpen}
            onCancel={() => setEditOpen(false)}
            footer={null}
            width={400}
         >
            <Form
               layout="vertical"
               form={form}
               className="mt-4"
               onFinish={(values) => {
                  axios.put(`/sales/${editingSale.id}`, {
                     sale_amount: values.sale_amount,
                     closing_date: values.closing_date.format("YYYY-MM-DD")
                  })
                     .then(() => {
                        message.success("Sale updated successfully");
                        setEditOpen(false);
                        fetchSales();
                     })
                     .catch(err => {
                        message.error(err.response?.data?.message || "Update failed");
                     });
               }}
            >
               <Form.Item
                  name="sale_amount"
                  label="Sale Amount"
                  rules={[{ required: true, message: "Enter sale amount" }]}
               >
                  <InputNumber
                     style={{ width: "100%" }}
                     min={1}
                     precision={2}
                     formatter={(value) =>
                        `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                     }
                     parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
                  />
               </Form.Item>

               <Form.Item
                  name="closing_date"
                  label="Closing Date"
                  rules={[{ required: true, message: "Select closing date" }]}
               >
                  <DatePicker style={{ width: "100%" }} />
               </Form.Item>

               <div className="flex justify-end gap-2 mt-6">
                  <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                     Update
                  </Button>
               </div>
            </Form>
         </Modal>
      </div>
   );
};

export default Sales;