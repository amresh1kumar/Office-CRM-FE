// import { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import {
//    Table,
//    Tag,
//    Card,
//    Input,
//    Button,
//    Modal,
//    Form,
//    DatePicker,
//    message,
//    Popconfirm,
//    Space
// } from "antd";
// import {
//    EditOutlined,
//    DeleteOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import axios from "../../api/axios";

// const FollowupsPage = () => {

//    const navigate = useNavigate();
//    const today = dayjs().startOf("day");

//    const [searchParams] = useSearchParams();
//    const type = searchParams.get("type");

//    const [followups, setFollowups] = useState([]);
//    const [searchText, setSearchText] = useState("");
//    const [open, setOpen] = useState(false);
//    const [editing, setEditing] = useState(null);
//    const [form] = Form.useForm();

//    // ---------------- Fetch Followups ----------------
//    const fetchFollowups = () => {
//       axios.get("/followups-all")
//          .then(res => setFollowups(res.data))
//          .catch(err => console.log(err));
//    };

//    useEffect(() => {
//       fetchFollowups();
//    }, []);

//    // ---------------- Delete ----------------
//    const handleDelete = (id) => {
//       axios.delete(`/followups/${id}`)
//          .then(() => {
//             message.success("Follow-up deleted");
//             fetchFollowups();
//          });
//    };

//    // ---------------- Filter Logic ----------------
//    const filtered = followups.filter(item => {

//       const date = dayjs(item.next_followup_date);

//       // Date filter
//       if (type === "overdue" && !date.isBefore(today, "day"))
//          return false;

//       if (type === "today" && !date.isSame(today, "day"))
//          return false;

//       if (type === "upcoming" && !date.isAfter(today, "day"))
//          return false;

//       // Search filter
//       const searchLower = searchText.toLowerCase();

//       if (
//          item.lead_name?.toLowerCase().includes(searchLower) ||
//          item.phone?.toString().includes(searchLower) ||
//          item.note?.toLowerCase().includes(searchLower)
//       ) {
//          return true;
//       }

//       return false;
//    });

//    // ---------------- Table Columns ----------------
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
//          render: (status) => (
//             <Tag color={status === "Done" ? "green" : "orange"}>
//                {status}
//             </Tag>
//          )
//       },
//       {
//          title: "Note",
//          dataIndex: "note"
//       },
//       {
//          title: "Next Follow-up",
//          dataIndex: "next_followup_date",
//          render: (date) =>
//             date ? dayjs(date).format("DD MMM YYYY") : "-"
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
//             <Space>
//                <Button
//                   type="text"
//                   icon={<EditOutlined />}
//                   onClick={() => {
//                      setEditing(record);
//                      form.setFieldsValue({
//                         lead_id: record.lead_id,
//                         note: record.note,
//                         next_followup_date: dayjs(record.next_followup_date),
//                         status: record.status
//                      });
//                      setOpen(true);
//                   }}
//                />

//                <Popconfirm
//                   title="Delete this follow-up?"
//                   onConfirm={() => handleDelete(record.id)}
//                >
//                   <Button
//                      type="text"
//                      danger
//                      icon={<DeleteOutlined />}
//                   />
//                </Popconfirm>
//             </Space>
//          )
//       }
//    ];

//    return (
//       <Card title="Follow-ups">

//          {/* Search + Add */}
//          <div style={{
//             marginBottom: 16,
//             display: "flex",
//             justifyContent: "space-between"
//          }}>
//             <Input.Search
//                placeholder="Search by Lead, Phone, Note"
//                allowClear
//                style={{ width: 300 }}
//                onChange={(e) => setSearchText(e.target.value)}
//             />

//             {/* <Button
//                type="primary"
//                icon={<PlusOutlined />}
//                onClick={() => {
//                   setEditing(null);
//                   form.resetFields();
//                   setOpen(true);
//                }}
//             >
//                Add Follow-up
//             </Button> */}
//          </div>

//          {/* Table */}
//          <Table
//             size="small"
//             dataSource={filtered}
//             columns={columns}
//             rowKey="id"
//             pagination={{ pageSize: 6 }}
//             scroll={{ x: 600 }}
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
//                      next_followup_date:
//                         values.next_followup_date.format("YYYY-MM-DD")
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

//                {/* <Form.Item
//                   name="lead_id"
//                   label="Lead ID"
//                   rules={[{ required: true }]}
//                >
//                   <Input />
//                </Form.Item> */}

//                <Form.Item
//                   name="note"
//                   label="Note"
//                   rules={[{ required: true }]}
//                >
//                   <Input.TextArea rows={3} />
//                </Form.Item>

//                <Form.Item
//                   name="next_followup_date"
//                   label="Next Follow-up"
//                   rules={[{ required: true }]}
//                >
//                   <DatePicker style={{ width: "100%" }} />
//                </Form.Item>

//                {/* <Form.Item name="status" label="Status">
//                   <Select>
//                      <Select.Option value="Pending">
//                         Pending
//                      </Select.Option>
//                      <Select.Option value="Done">
//                         Done
//                      </Select.Option>
//                   </Select>
//                </Form.Item> */}

//                <Button type="primary" htmlType="submit" block>
//                   {editing ? "Update Follow-up" : "Add Follow-up"}
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
   Input,
   Button,
   Modal,
   Form,
   DatePicker,
   message,
   Popconfirm,
   Space,
   Row,
   Col,
   Tooltip,
   Avatar
} from "antd";
import {
   EditOutlined,
   DeleteOutlined,
   CalendarOutlined,
   ClockCircleOutlined,
   WarningOutlined,
   PhoneOutlined,
   UserOutlined,
   SearchOutlined,
   CheckCircleOutlined,
   ExclamationCircleOutlined
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
   const [loading, setLoading] = useState(false);
   const [form] = Form.useForm();

   const fetchFollowups = () => {
      setLoading(true);
      axios.get("/followups-all")
         .then(res => setFollowups(res.data))
         .catch(err => console.log(err))
         .finally(() => setLoading(false));
   };

   useEffect(() => {
      fetchFollowups();
   }, []);

   const handleDelete = (id) => {
      axios.delete(`/followups/${id}`)
         .then(() => {
            message.success("Follow-up deleted");
            fetchFollowups();
         });
   };

   const filtered = followups.filter(item => {
      const date = dayjs(item.next_followup_date);

      if (type === "overdue" && !date.isBefore(today, "day")) return false;
      if (type === "today" && !date.isSame(today, "day")) return false;
      if (type === "upcoming" && !date.isAfter(today, "day")) return false;

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

   // Calculate stats
   const overdueCount = followups.filter(f => dayjs(f.next_followup_date).isBefore(today, "day")).length;
   const todayCount = followups.filter(f => dayjs(f.next_followup_date).isSame(today, "day")).length;
   const upcomingCount = followups.filter(f => dayjs(f.next_followup_date).isAfter(today, "day")).length;

   const getPriorityConfig = (date) => {
      const followupDate = dayjs(date);
      if (followupDate.isBefore(today, "day")) {
         return { color: "red", text: "Overdue", icon: <WarningOutlined /> };
      }
      if (followupDate.isSame(today, "day")) {
         return { color: "orange", text: "Today", icon: <ClockCircleOutlined /> };
      }
      return { color: "green", text: "Upcoming", icon: <CalendarOutlined /> };
   };

   const columns = [
      {
         title: <span className="text-xs font-medium text-gray-500">#</span>,
         width: 50,
         align: "center",
         render: (_, __, index) => (
            <span className="text-xs text-gray-400">{index + 1}</span>
         )
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Lead</span>,
         dataIndex: "lead_name",
         render: (text, record) => (
            <div
               className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
               onClick={() => navigate(`/leads/${record.lead_id}`)}
            >
               <Avatar size={28} style={{ backgroundColor: '#6366f1', fontSize: '12px' }}>
                  {text?.charAt(0)?.toUpperCase()}
               </Avatar>
               <div>
                  <span className="font-medium text-sm text-gray-800">{text}</span>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                     <PhoneOutlined style={{ fontSize: '10px' }} />
                     {record.phone || 'No phone'}
                  </div>
               </div>
            </div>
         )
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Status</span>,
         dataIndex: "status",
         width: 100,
         render: (status) => (
            <Tag
               color={status === "Done" ? "green" : "orange"}
               style={{ margin: 0, fontSize: '11px' }}
               icon={status === "Done" ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            >
               {status}
            </Tag>
         )
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Note</span>,
         dataIndex: "note",
         ellipsis: true,
         render: (note) => (
            <Tooltip title={note}>
               <span className="text-sm text-gray-600">{note || '-'}</span>
            </Tooltip>
         )
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Follow-up Date</span>,
         dataIndex: "next_followup_date",
         width: 120,
         render: (date) => {
            const config = getPriorityConfig(date);
            return (
               <div className="flex items-center gap-1">
                  <span style={{ color: config.color, fontSize: '12px' }}>
                     {config.icon}
                  </span>
                  <span className="text-sm text-gray-700">
                     {date ? dayjs(date).format("DD MMM YYYY") : "-"}
                  </span>
               </div>
            );
         }
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Priority</span>,
         width: 100,
         render: (_, record) => {
            const config = getPriorityConfig(record.next_followup_date);
            return (
               <Tag
                  color={config.color}
                  style={{ margin: 0, fontSize: '11px' }}
                  icon={config.icon}
               >
                  {config.text}
               </Tag>
            );
         }
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Created By</span>,
         dataIndex: "created_by_name",
         width: 120,
         render: (name) => (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
               <UserOutlined style={{ fontSize: '11px' }} />
               {name}
            </div>
         )
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Actions</span>,
         width: 100,
         align: "center",
         render: (_, record) => (
            <Space size="small">
               <Tooltip title="Edit">
                  <Button
                     type="text"
                     size="small"
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
               </Tooltip>

               <Popconfirm
                  title="Delete this follow-up?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
               >
                  <Tooltip title="Delete">
                     <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                     />
                  </Tooltip>
               </Popconfirm>
            </Space>
         )
      }
   ];

   return (
      <div className="bg-gray-50 min-h-screen">
         <style>{`
            .followups-card {
               background: #fff;
               border-radius: 10px;
               box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
               border: 1px solid #f3f4f6;
            }
            .followups-table .ant-table-thead > tr > th {
               background: #f9fafb;
               font-size: 12px;
               padding: 10px 16px;
            }
            .followups-table .ant-table-tbody > tr > td {
               padding: 10px 16px;
               font-size: 13px;
            }
            .followups-table .ant-table-tbody > tr:hover > td {
               background: #f9fafb;
            }
            .stat-card {
               border-radius: 10px;
               transition: all 0.3s;
               cursor: pointer;
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
                  <h1 className="text-xl font-semibold text-gray-800 m-0">Follow-ups</h1>
                  <span className="text-gray-400 text-sm">
                     {type ? `Showing ${type} follow-ups` : 'All follow-ups'} • {filtered.length} total
                  </span>
               </div>
            </div>
         </div>

         <div className="p-6">
            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="mb-4">
               <Col xs={24} sm={8}>
                  <div
                     className={`followups-card p-4 stat-card ${type === 'overdue' ? 'border-red-200 bg-red-50' : ''}`}
                     onClick={() => navigate('/followups?type=overdue')}
                  >
                     <div className="flex items-center justify-between">
                        <div>
                           <div className="flex items-center gap-2 text-red-600 mb-2">
                              <WarningOutlined />
                              <span className="text-sm font-medium">Overdue</span>
                           </div>
                           <div className="text-2xl font-bold text-gray-800">{overdueCount}</div>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                           <ExclamationCircleOutlined className="text-red-500 text-lg" />
                        </div>
                     </div>
                  </div>
               </Col>

               <Col xs={24} sm={8}>
                  <div
                     className={`followups-card p-4 stat-card ${type === 'today' ? 'border-orange-200 bg-orange-50' : ''}`}
                     onClick={() => navigate('/followups?type=today')}
                  >
                     <div className="flex items-center justify-between">
                        <div>
                           <div className="flex items-center gap-2 text-orange-600 mb-2">
                              <ClockCircleOutlined />
                              <span className="text-sm font-medium">Today</span>
                           </div>
                           <div className="text-2xl font-bold text-gray-800">{todayCount}</div>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                           <CalendarOutlined className="text-orange-500 text-lg" />
                        </div>
                     </div>
                  </div>
               </Col>

               <Col xs={24} sm={8}>
                  <div
                     className={`followups-card p-4 stat-card ${type === 'upcoming' ? 'border-green-200 bg-green-50' : ''}`}
                     onClick={() => navigate('/followups?type=upcoming')}
                  >
                     <div className="flex items-center justify-between">
                        <div>
                           <div className="flex items-center gap-2 text-green-600 mb-2">
                              <CalendarOutlined />
                              <span className="text-sm font-medium">Upcoming</span>
                           </div>
                           <div className="text-2xl font-bold text-gray-800">{upcomingCount}</div>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                           <CheckCircleOutlined className="text-green-500 text-lg" />
                        </div>
                     </div>
                  </div>
               </Col>
            </Row>

            {/* Table Card */}
            <div className="followups-card">
               <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-gray-600" />
                        <span className="font-medium text-gray-700">Follow-ups List</span>
                        <Tag>{filtered.length}</Tag>
                     </div>
                     <Input.Search
                        placeholder="Search lead, phone, note..."
                        allowClear
                        style={{ width: 250 }}
                        onChange={(e) => setSearchText(e.target.value)}
                        prefix={<SearchOutlined className="text-gray-400" />}
                     />
                  </div>
               </div>

               <div className="followups-table">
                  <Table
                     size="small"
                     dataSource={filtered}
                     columns={columns}
                     rowKey="id"
                     loading={loading}
                     pagination={{
                        pageSize: 10,
                        showTotal: (total, range) => (
                           <span className="text-sm text-gray-500">
                              Showing <b>{range[0]}-{range[1]}</b> of <b>{total}</b> follow-ups
                           </span>
                        ),
                        size: "small"
                     }}
                     scroll={{ x: 900 }}
                  />
               </div>
            </div>
         </div>

         {/* Edit Modal */}
         <Modal
            title={editing ? "Edit Follow-up" : "Add Follow-up"}
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={400}
            destroyOnClose
         >
            <Form
               layout="vertical"
               form={form}
               className="mt-4"
               onFinish={(values) => {
                  const payload = {
                     ...values,
                     next_followup_date: values.next_followup_date.format("YYYY-MM-DD")
                  };

                  if (editing) {
                     axios.put(`/followups/${editing.id}`, payload)
                        .then(() => {
                           message.success("Follow-up updated");
                           setOpen(false);
                           fetchFollowups();
                        });
                  } else {
                     axios.post("/followups", payload)
                        .then(() => {
                           message.success("Follow-up added");
                           setOpen(false);
                           fetchFollowups();
                        });
                  }
               }}
            >
               <Form.Item
                  name="note"
                  label="Note"
                  rules={[{ required: true, message: "Please enter note" }]}
               >
                  <Input.TextArea rows={3} placeholder="Enter note" />
               </Form.Item>

               <Form.Item
                  name="next_followup_date"
                  label="Next Follow-up Date"
                  rules={[{ required: true, message: "Please select date" }]}
               >
                  <DatePicker style={{ width: "100%" }} />
               </Form.Item>

               <div className="flex justify-end gap-2">
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                     {editing ? "Update" : "Add"}
                  </Button>
               </div>
            </Form>
         </Modal>
      </div>
   );
};

export default FollowupsPage;