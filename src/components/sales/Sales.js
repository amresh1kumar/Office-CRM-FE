import { useContext, useState, useEffect } from "react";
import { Table, Card, Statistic, Row, Col, message, Form, Button, Modal, Input, DatePicker, InputNumber } from "antd";
import { AuthContext } from "../context/AuthContext";
import { DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "../../api/axios";
import {
   EditOutlined,
   DeleteOutlined,
   PlusOutlined
} from "@ant-design/icons";



const Sales = () => {

   const [sales, setSales] = useState([]);
   const [totalRevenue, setTotalRevenue] = useState(0);
   const [editOpen, setEditOpen] = useState(false);
   const [editingSale, setEditingSale] = useState(null);
   const { user } = useContext(AuthContext);
   const [form] = Form.useForm();


   const fetchSales = () => {
      axios.get("/sales")
         .then(res => {
            setSales(res.data);

            // Calculate total revenue
            const total = res.data.reduce((sum, item) => {
               return sum + Number(item.sale_amount);
            }, 0);

            setTotalRevenue(total);
         })
         .catch(() => {
            message.error("Failed to load sales");
         });
   };

   useEffect(() => {
      fetchSales();
   }, []);


   const columns = [
      {
         title: "Lead Name",
         dataIndex: "lead_name",
      },
      {
         title: "Assigned To",
         dataIndex: "assigned_to_name",
         render: (name) => name || "Unassigned"
      },
      {
         title: "Sale Amount",
         dataIndex: "sale_amount",
         render: (amount) => `₹ ${amount}`
      },
      {
         title: "Closing Date",
         dataIndex: "closing_date",
         render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "-"
      },
      {
         title: "Deal Converted By",
         dataIndex: "created_by_name",
      },

      ...(user?.role === "admin" ? [{
         title: "Action",
         key: "action",
         render: (_, record) => (
            <Button
               type="text"
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
      <div className="p-6">

         {/* Revenue Summary Card */}
         {/* <Row gutter={16} className="mb-6">
            <Col span={8}>
               <Card>
                  <Statistic
                     title="Total Revenue"
                     value={totalRevenue}
                     precision={2}
                     prefix={<DollarOutlined />}
                  />
               </Card>
            </Col>
         </Row> */}

         {/* Sales Table */}
         <Card title="Sales List">
            <Table
               size="small"

               dataSource={sales}
               columns={columns}
               rowKey="id"
               pagination={{ pageSize: 5 }}
            />
         </Card>


         <Modal
            title="Edit Sale"
            open={editOpen}
            onCancel={() => setEditOpen(false)}
            footer={null}
         >
            <Form
               layout="vertical"
               form={form}
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
                  rules={[
                     { required: true, message: "Enter sale amount" }
                  ]}
               >
                  {/* <InputNumber
                     style={{ width: "100%" }}
                     min={1}
                     precision={2}
                  /> */}
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
                  rules={[{ required: true }]}
               >
                  <DatePicker style={{ width: "100%" }} />
               </Form.Item>

               <Button type="primary" htmlType="submit" block>
                  Update Sale
               </Button>

            </Form>
         </Modal>


      </div>
   );
};

export default Sales;
