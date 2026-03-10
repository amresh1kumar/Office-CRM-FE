// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { Table, Tag, Card } from "antd";
// import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
// import { Button, Modal, Form, Input, DatePicker, Select, message, Popconfirm } from "antd";
// import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// import axios from "../../api/axios";

// const FollowupsPage = () => {


//    const [searchText, setSearchText] = useState("");
//    const navigate = useNavigate();
//    const today = dayjs().startOf("day");
//    const [searchParams] = useSearchParams();
//    const type = searchParams.get("type");
//    const [followups, setFollowups] = useState([]);
//    const [open, setOpen] = useState(false);
//    const [editing, setEditing] = useState(null);
//    const [form] = Form.useForm();



//    const columns = [
//       {
//          title: "Lead",
//          dataIndex: "lead_name",
//          render: (text, record) => (
//             <span
//                style={{ color: "#1677ff", cursor: "pointer" }}
//                onClick={() => navigate(`/leads/${record.lead_id}`)}
//             >
//                {text}
//             </span>
//          )
//       },
//       {
//          title: "Phone",
//          dataIndex: "phone"
//       },
//       {
//          title: "Status",
//          dataIndex: "status",
//          render: (status) => <Tag>{status}</Tag>
//       },
//       {
//          title: "Note",
//          dataIndex: "note"
//       },
//       {
//          title: "Next Follow-up",
//          dataIndex: "next_followup_date",
//          render: (date) => dayjs(date).format("DD MMM YYYY")
//       },
//       {
//          title: "Created By",
//          dataIndex: "created_by_name"
//       },
//       {
//          title: "Priority",
//          render: (_, record) => {
//             const date = dayjs(record.next_followup_date);

//             if (date.isBefore(today, "day"))
//                return <Tag color="red">Overdue</Tag>;

//             if (date.isSame(today, "day"))
//                return <Tag color="orange">Today</Tag>;

//             return <Tag color="green">Upcoming</Tag>;
//          }
//       },
//       {
//          title: "Action",
//          render: (_, record) => (
//             <>
//                <Button
//                   type="text"
//                   icon={<EditOutlined />}
//                   onClick={() => {
//                      setEditing(record);
//                      form.setFieldsValue({
//                         note: record.note,
//                         next_followup_date: dayjs(record.next_followup_date),
//                         status: record.status
//                      });
//                      setOpen(true);
//                   }}
//                />

//                <Popconfirm
//                   title="Delete Follow-up?"
//                   onConfirm={() => handleDelete(record.id)}
//                >
//                   <Button
//                      type="text"
//                      danger
//                      icon={<DeleteOutlined />}
//                   />
//                </Popconfirm>
//             </>
//          )
//       }

//    ];


//    useEffect(() => {
//       axios.get("/followups-all")
//          .then(res => setFollowups(res.data))
//          .catch(err => console.log(err));
//    }, []);

//    const handleDelete = (id) => {
//       axios.delete(`/followups/${id}`)
//          .then(() => {
//             message.success("Deleted successfully");
//             fetchFollowups();
//          });
//    };



//    // const filtered = followups.filter(item => {

//    //    const date = dayjs(item.next_followup_date);

//    //    if (type === "overdue")
//    //       return date.isBefore(today, "day");

//    //    if (type === "today")
//    //       return date.isSame(today, "day");

//    //    if (type === "upcoming")
//    //       return date.isAfter(today, "day");

//    //    return true;
//    // });


//    const filtered = followups.filter(item => {

//       const date = dayjs(item.next_followup_date);

//       // 🔹 Date filter (Overdue / Today / Upcoming)
//       if (type === "overdue" && !date.isBefore(today, "day"))
//          return false;

//       if (type === "today" && !date.isSame(today, "day"))
//          return false;

//       if (type === "upcoming" && !date.isAfter(today, "day"))
//          return false;

//       // 🔹 Search filter
//       const searchLower = searchText.toLowerCase();

//       if (
//          item.lead_name.toLowerCase().includes(searchLower) ||
//          item.phone.includes(searchLower) ||
//          item.note.toLowerCase().includes(searchLower)
//       ) {
//          return true;
//       }

//       return false;
//    });

//    return (
//       <Card title="Follow-ups">
//          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>

//             <Input.Search
//                placeholder="Search by Lead, Phone, Note"
//                allowClear
//                style={{ width: 300 }}
//                onChange={(e) => setSearchText(e.target.value)}
//             />

//          </div>


//          <Table
//             dataSource={filtered}
//             columns={columns}
//             rowKey="id"
//             scroll={{ x: 400 }}
//             pagination={{ pageSize: 6 }}
//          />


//          <Modal
//             title={editing ? "Edit Follow-up" : "Add Follow-up"}
//             open={open}
//             onCancel={() => setOpen(false)}
//             footer={null}
//          >
//             <Form
//                layout="vertical"
//                form={form}
//                onFinish={(values) => {

//                   const payload = {
//                      ...values,
//                      next_followup_date: values.next_followup_date.format("YYYY-MM-DD")
//                   };

//                   if (editing) {
//                      axios.put(`/followups/${editing.id}`, payload)
//                         .then(() => {
//                            message.success("Updated successfully");
//                            setOpen(false);
//                            fetchFollowups();
//                         });
//                   } else {
//                      axios.post("/followups", payload)
//                         .then(() => {
//                            message.success("Added successfully");
//                            setOpen(false);
//                            fetchFollowups();
//                         });
//                   }
//                }}
//             >

//                <Form.Item name="lead_id" label="Lead ID" rules={[{ required: true }]}>
//                   <Input />
//                </Form.Item>

//                <Form.Item name="note" label="Note" rules={[{ required: true }]}>
//                   <Input.TextArea rows={3} />
//                </Form.Item>

//                <Form.Item name="next_followup_date" label="Next Follow-up" rules={[{ required: true }]}>
//                   <DatePicker style={{ width: "100%" }} />
//                </Form.Item>

//                <Form.Item name="status" label="Status">
//                   <Select>
//                      <Select.Option value="Pending">Pending</Select.Option>
//                      <Select.Option value="Done">Done</Select.Option>
//                   </Select>
//                </Form.Item>

//                <Button type="primary" htmlType="submit" block>
//                   {editing ? "Update" : "Add"}
//                </Button>

//             </Form>
//          </Modal>
//       </Card>
//    );
// };

// export default FollowupsPage;


import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
   Table,
   Tag,
   Card,
   Input,
   Button,
   Modal,
   Form,
   DatePicker,
   Select,
   message,
   Popconfirm,
   Space
} from "antd";
import {
   EditOutlined,
   DeleteOutlined,
   PlusOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "../../api/axios";

const FollowupsPage = () => {

   const navigate = useNavigate();
   const today = dayjs().startOf("day");

   const [searchParams] = useSearchParams();
   const type = searchParams.get("type");

   const [followups, setFollowups] = useState([]);
   const [searchText, setSearchText] = useState("");
   const [open, setOpen] = useState(false);
   const [editing, setEditing] = useState(null);
   const [form] = Form.useForm();

   // ---------------- Fetch Followups ----------------
   const fetchFollowups = () => {
      axios.get("/followups-all")
         .then(res => setFollowups(res.data))
         .catch(err => console.log(err));
   };

   useEffect(() => {
      fetchFollowups();
   }, []);

   // ---------------- Delete ----------------
   const handleDelete = (id) => {
      axios.delete(`/followups/${id}`)
         .then(() => {
            message.success("Follow-up deleted");
            fetchFollowups();
         });
   };

   // ---------------- Filter Logic ----------------
   const filtered = followups.filter(item => {

      const date = dayjs(item.next_followup_date);

      // Date filter
      if (type === "overdue" && !date.isBefore(today, "day"))
         return false;

      if (type === "today" && !date.isSame(today, "day"))
         return false;

      if (type === "upcoming" && !date.isAfter(today, "day"))
         return false;

      // Search filter
      const searchLower = searchText.toLowerCase();

      if (
         item.lead_name?.toLowerCase().includes(searchLower) ||
         item.phone?.toString().includes(searchLower) ||
         item.note?.toLowerCase().includes(searchLower)
      ) {
         return true;
      }

      return false;
   });

   // ---------------- Table Columns ----------------
   const columns = [
      {
         title: "Lead",
         dataIndex: "lead_name",
         render: (text, record) => (
            <span
               style={{ color: "#1677ff", cursor: "pointer" }}
               onClick={() => navigate(`/leads/${record.lead_id}`)}
            >
               {text}
            </span>
         )
      },
      {
         title: "Phone",
         dataIndex: "phone"
      },
      {
         title: "Status",
         dataIndex: "status",
         render: (status) => (
            <Tag color={status === "Done" ? "green" : "orange"}>
               {status}
            </Tag>
         )
      },
      {
         title: "Note",
         dataIndex: "note"
      },
      {
         title: "Next Follow-up",
         dataIndex: "next_followup_date",
         render: (date) =>
            date ? dayjs(date).format("DD MMM YYYY") : "-"
      },
      {
         title: "Created By",
         dataIndex: "created_by_name"
      },
      {
         title: "Priority",
         render: (_, record) => {
            const date = dayjs(record.next_followup_date);

            if (date.isBefore(today, "day"))
               return <Tag color="red">Overdue</Tag>;

            if (date.isSame(today, "day"))
               return <Tag color="orange">Today</Tag>;

            return <Tag color="green">Upcoming</Tag>;
         }
      },
      {
         title: "Action",
         render: (_, record) => (
            <Space>
               <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                     setEditing(record);
                     form.setFieldsValue({
                        lead_id: record.lead_id,
                        note: record.note,
                        next_followup_date: dayjs(record.next_followup_date),
                        status: record.status
                     });
                     setOpen(true);
                  }}
               />

               <Popconfirm
                  title="Delete this follow-up?"
                  onConfirm={() => handleDelete(record.id)}
               >
                  <Button
                     type="text"
                     danger
                     icon={<DeleteOutlined />}
                  />
               </Popconfirm>
            </Space>
         )
      }
   ];

   return (
      <Card title="Follow-ups">

         {/* Search + Add */}
         <div style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between"
         }}>
            <Input.Search
               placeholder="Search by Lead, Phone, Note"
               allowClear
               style={{ width: 300 }}
               onChange={(e) => setSearchText(e.target.value)}
            />

            {/* <Button
               type="primary"
               icon={<PlusOutlined />}
               onClick={() => {
                  setEditing(null);
                  form.resetFields();
                  setOpen(true);
               }}
            >
               Add Follow-up
            </Button> */}
         </div>

         {/* Table */}
         <Table
            size="small"
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            scroll={{ x: 600 }}
         />

         <Modal
            title={editing ? "Edit Follow-up" : "Add Follow-up"}
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
         >
            <Form
               layout="vertical"
               form={form}
               onFinish={(values) => {

                  const payload = {
                     ...values,
                     next_followup_date:
                        values.next_followup_date.format("YYYY-MM-DD")
                  };

                  if (editing) {
                     axios.put(`/followups/${editing.id}`, payload)
                        .then(() => {
                           message.success("Updated successfully");
                           setOpen(false);
                           fetchFollowups();
                        });
                  } else {
                     axios.post("/followups", payload)
                        .then(() => {
                           message.success("Added successfully");
                           setOpen(false);
                           fetchFollowups();
                        });
                  }
               }}
            >

               {/* <Form.Item
                  name="lead_id"
                  label="Lead ID"
                  rules={[{ required: true }]}
               >
                  <Input />
               </Form.Item> */}

               <Form.Item
                  name="note"
                  label="Note"
                  rules={[{ required: true }]}
               >
                  <Input.TextArea rows={3} />
               </Form.Item>

               <Form.Item
                  name="next_followup_date"
                  label="Next Follow-up"
                  rules={[{ required: true }]}
               >
                  <DatePicker style={{ width: "100%" }} />
               </Form.Item>

               {/* <Form.Item name="status" label="Status">
                  <Select>
                     <Select.Option value="Pending">
                        Pending
                     </Select.Option>
                     <Select.Option value="Done">
                        Done
                     </Select.Option>
                  </Select>
               </Form.Item> */}

               <Button type="primary" htmlType="submit" block>
                  {editing ? "Update Follow-up" : "Add Follow-up"}
               </Button>

            </Form>
         </Modal>

      </Card>
   );
};

export default FollowupsPage;
