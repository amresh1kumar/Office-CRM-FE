// import {
//    Table,
//    Button,
//    Modal,
//    Form,
//    Input,
//    Select,
//    message,
//    Space,
//    Popconfirm,
//    Tag
// } from "antd";
// import { useEffect, useState, useContext } from "react";
// import axios from "../../api/axios";
// import { AuthContext } from "../context/AuthContext";

// import {
//    EditOutlined,
//    DeleteOutlined,
// } from "@ant-design/icons";

// const Users = () => {

//    const { user } = useContext(AuthContext);

//    const [users, setUsers] = useState([]);
//    const [open, setOpen] = useState(false);
//    const [editingUser, setEditingUser] = useState(null);
//    const [currentPage, setCurrentPage] = useState(1);
//    const [form] = Form.useForm();

//    const fetchUsers = () => {
//       axios.get("/users")
//          .then(res => setUsers(res.data));
//    };

//    useEffect(() => {
//       fetchUsers();
//    }, []);


//    const handleSubmit = (values) => {

//       if (editingUser) {

//          axios.put(`/users/${editingUser.id}`, values)
//             .then(() => {
//                message.success("User updated");
//                setOpen(false);
//                fetchUsers();
//             })
//             .catch((err) => {
//                // ✅ Backend se aaya error message dikhao
//                message.error(
//                   err.response?.data?.message || "Update failed"
//                );
//             });

//       } else {

//          axios.post("/register", values)
//             .then(() => {
//                message.success("User added");
//                setOpen(false);
//                fetchUsers();
//             })
//             .catch((err) => {
//                message.error(
//                   err.response?.data?.message || "Registration failed"
//                );
//             });
//       }
//    };
//    const handleDelete = (id) => {
//       axios.delete(`/users/${id}`)
//          .then(() => {
//             message.success("User deleted");
//             fetchUsers();
//          });
//    };

//    const handleApprove = (id) => {
//       axios.put(`/users/approve/${id}`)
//          .then(() => {
//             message.success("User approved");
//             fetchUsers();
//          })
//          .catch((err) => {
//             message.error(
//                err.response?.data?.message || "Approval failed"
//             );
//          });
//    };


//    const handleToggleStatus = (id, status) => {

//       axios.put(`/users/status/${id}`, {
//          status: status === "active" ? "disabled" : "active"
//       })
//          .then(() => {
//             message.success("User status updated");
//             fetchUsers();
//          })
//          .catch(() => {
//             message.error("Failed to update status");
//          });

//    };
//    const columns = [
//       {
//          title: "#",
//          key: "index",
//          render: (_, __, index) => (currentPage - 1) * 10 + index + 1
//       },
//       {
//          title: "Name",
//          dataIndex: "name"
//       },
//       {
//          title: "Email",
//          dataIndex: "email"
//       },
//       {
//          title: "Role",
//          dataIndex: "role_name",
//          render: (role) => (
//             <Tag color={role === "admin" ? "red" : "blue"}>
//                {role}
//             </Tag>
//          )
//       },
//       {
//          title: "Approved",
//          dataIndex: "is_approved",
//          render: (value) => (
//             <Tag color={value === 1 ? "green" : "orange"}>
//                {value === 1 ? "Approved" : "Pending"}
//             </Tag>
//          )
//       },
//       // {
//       //    title: "Action",
//       //    render: (_, record) => (
//       //       <Space>
//       //          <Button
//       //             type="text"
//       //             icon={<EditOutlined />}
//       //             onClick={() => {
//       //                setEditingUser(record);
//       //                form.setFieldsValue({
//       //                   name: record.name,
//       //                   email: record.email,
//       //                   role_id: record.role_name === "admin" ? 1 : 2
//       //                });
//       //                setOpen(true);
//       //             }}
//       //          >
//       //          </Button>

//       //          <Popconfirm
//       //             title="Delete user?"
//       //             onConfirm={() => handleDelete(record.id)}
//       //          >
//       //             <Button danger type="text"

//       //                icon={<DeleteOutlined />} />

//       //          </Popconfirm>
//       //       </Space>
//       //    )
//       // }.

//       {
//          title: "Status",
//          render: (_, record) => {

//             if (record.is_approved === 0) {
//                return <Tag color="orange">Pending</Tag>;
//             }

//             return (
//                <Tag color={record.status === "active" ? "green" : "red"}>
//                   {record.status === "active" ? "Active" : "Disabled"}
//                </Tag>
//             );
//          }
//       },
//       {
//          title: "Action",
//          render: (_, record) => (
//             <Space>

//                {record.is_approved === 0 && (
//                   <Popconfirm
//                      title="Approve this user?"
//                      description="User will be able to login after approval."
//                      onConfirm={() => handleApprove(record.id)}
//                      okText="Approve"
//                      cancelText="Cancel"
//                   >
//                      <Button type="primary" size="small">
//                         Approve
//                      </Button>
//                   </Popconfirm>
//                )}

//                {record.is_approved === 1 && (
//                   <Popconfirm
//                      title={
//                         record.status === "active"
//                            ? "Disable this user?"
//                            : "Enable this user?"
//                      }
//                      onConfirm={() =>
//                         handleToggleStatus(record.id, record.status)
//                      }
//                   >
//                      <Button
//                         danger={record.status === "active"}
//                         type="primary"
//                         size="small"
//                      >
//                         {record.status === "active"
//                            ? "Disable"
//                            : "Enable"}
//                      </Button>
//                   </Popconfirm>
//                )}
//                <Button
//                   type="text"
//                   icon={<EditOutlined />}
//                   onClick={() => {
//                      setEditingUser(record);
//                      form.setFieldsValue({
//                         name: record.name,
//                         email: record.email,
//                         role_id: record.role_name === "admin" ? 1 : 2
//                      });
//                      setOpen(true);
//                   }}
//                />

//                <Popconfirm
//                   title="Delete user?"
//                   onConfirm={() => handleDelete(record.id)}
//                >
//                   <Button
//                      danger
//                      type="text"
//                      icon={<DeleteOutlined />}
//                   />
//                </Popconfirm>

//             </Space>
//          )
//       }
//    ];

//    return (
//       <div>

//          <div className="flex justify-between mb-4">
//             <h2 className="text-xl font-semibold">Users List</h2>

//             {user?.role === "admin" && (
//                <Button
//                   type="primary"
//                   onClick={() => {
//                      setEditingUser(null);
//                      form.resetFields();
//                      setOpen(true);
//                   }}
//                >
//                   Add User
//                </Button>
//             )}
//          </div>

//          <Table
//             size="small"
//             dataSource={users}
//             columns={columns}
//             rowKey="id"
//             pagination={{
//                current: currentPage,
//                onChange: (page) => setCurrentPage(page)
//             }}
//          />

//          <Modal
//             title={editingUser ? "Edit User" : "Add User"}
//             open={open}
//             onCancel={() => setOpen(false)}
//             footer={null}
//          >
//             <Form layout="vertical" form={form} onFinish={handleSubmit}>

//                <Form.Item
//                   name="name"
//                   label="Name"
//                   rules={[{ required: true }]}
//                >
//                   <Input />
//                </Form.Item>

//                <Form.Item
//                   name="email"
//                   label="Email"
//                   rules={[{ required: true }]}
//                >
//                   <Input />
//                </Form.Item>

//                {!editingUser && (
//                   <Form.Item
//                      name="password"
//                      label="Password"
//                      rules={[{ required: true }]}
//                   >
//                      <Input.Password />
//                   </Form.Item>
//                )}

//                <Form.Item
//                   name="role_id"
//                   label="Role"
//                   rules={[{ required: true }]}
//                >
//                   <Select>
//                      <Select.Option value={1}>Admin</Select.Option>
//                      <Select.Option value={2}>Staff</Select.Option>
//                   </Select>
//                </Form.Item>

//                <Button type="primary" htmlType="submit" block>
//                   {editingUser ? "Update" : "Create"}
//                </Button>

//             </Form>
//          </Modal>

//       </div>
//    );
// };

// export default Users;


import {
   Table,
   Button,
   Modal,
   Form,
   Input,
   Select,
   message,
   Space,
   Popconfirm,
   Tag,
   Avatar,
   Tooltip
} from "antd";
import { useEffect, useState, useContext } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../context/AuthContext";

import {
   EditOutlined,
   DeleteOutlined,
   PlusOutlined,
   UserOutlined,
   MailOutlined,
   CheckCircleOutlined,
   ClockCircleOutlined,
   StopOutlined,
   LockOutlined,
   SearchOutlined
} from "@ant-design/icons";

const Users = () => {
   const { user } = useContext(AuthContext);

   const [users, setUsers] = useState([]);
   const [open, setOpen] = useState(false);
   const [editingUser, setEditingUser] = useState(null);
   const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [searchText, setSearchText] = useState("");
   const [form] = Form.useForm();

   const fetchUsers = () => {
      setLoading(true);
      axios.get("/users")
         .then(res => setUsers(res.data))
         .finally(() => setLoading(false));
   };

   useEffect(() => {
      fetchUsers();
   }, []);

   // Filter users based on search
   const filteredUsers = users.filter(u => {
      const searchLower = searchText.toLowerCase();
      return (
         u.name?.toLowerCase().includes(searchLower) ||
         u.email?.toLowerCase().includes(searchLower) ||
         u.role_name?.toLowerCase().includes(searchLower)
      );
   });

   const handleSubmit = (values) => {
      if (editingUser) {
         axios.put(`/users/${editingUser.id}`, values)
            .then(() => {
               message.success("User updated");
               setOpen(false);
               fetchUsers();
            })
            .catch((err) => {
               message.error(err.response?.data?.message || "Update failed");
            });
      } else {
         axios.post("/register", values)
            .then(() => {
               message.success("User added");
               setOpen(false);
               fetchUsers();
            })
            .catch((err) => {
               message.error(err.response?.data?.message || "Registration failed");
            });
      }
   };

   const handleDelete = (id) => {
      axios.delete(`/users/${id}`)
         .then(() => {
            message.success("User deleted");
            fetchUsers();
         });
   };

   const handleApprove = (id) => {
      axios.put(`/users/approve/${id}`)
         .then(() => {
            message.success("User approved");
            fetchUsers();
         })
         .catch((err) => {
            message.error(err.response?.data?.message || "Approval failed");
         });
   };

   const handleToggleStatus = (id, status) => {
      axios.put(`/users/status/${id}`, {
         status: status === "active" ? "disabled" : "active"
      })
         .then(() => {
            message.success("User status updated");
            fetchUsers();
         })
         .catch(() => {
            message.error("Failed to update status");
         });
   };

   const columns = [
      {
         title: "#",
         key: "index",
         width: 50,
         align: "center",
         render: (_, __, index) => (
            <span className="text-xs text-gray-400">
               {(currentPage - 1) * 10 + index + 1}
            </span>
         )
      },
      {
         title: "User",
         dataIndex: "name",
         render: (name, record) => (
            <div className="flex items-center gap-2">
               <Avatar
                  size={32}
                  style={{ backgroundColor: '#6366f1', fontSize: '14px' }}
               >
                  {name?.charAt(0)?.toUpperCase()}
               </Avatar>
               <div>
                  <div className="font-medium text-gray-800">{name}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                     <MailOutlined style={{ fontSize: '10px' }} />
                     {record.email}
                  </div>
               </div>
            </div>
         )
      },
      {
         title: "Role",
         dataIndex: "role_name",
         width: 100,
         render: (role) => (
            <Tag color={role === "admin" ? "red" : "blue"}>
               {role?.toUpperCase()}
            </Tag>
         )
      },
      {
         title: "Approval",
         dataIndex: "is_approved",
         width: 100,
         render: (value) => (
            <Tag
               color={value === 1 ? "green" : "orange"}
               icon={value === 1 ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            >
               {value === 1 ? "Approved" : "Pending"}
            </Tag>
         )
      },
      {
         title: "Status",
         width: 100,
         render: (_, record) => {
            if (record.is_approved === 0) {
               return <Tag color="orange">Pending</Tag>;
            }
            return (
               <Tag
                  color={record.status === "active" ? "green" : "red"}
                  icon={record.status === "active" ? <CheckCircleOutlined /> : <StopOutlined />}
               >
                  {record.status === "active" ? "Active" : "Disabled"}
               </Tag>
            );
         }
      },
      {
         title: "Actions",
         width: 200,
         align: "center",
         render: (_, record) => (
            <Space size="small">
               {record.is_approved === 0 && (
                  <Popconfirm
                     title="Approve this user?"
                     description="User will be able to login after approval."
                     onConfirm={() => handleApprove(record.id)}
                     okText="Approve"
                     cancelText="Cancel"
                  >
                     <Button type="primary" size="small">
                        Approve
                     </Button>
                  </Popconfirm>
               )}

               {record.is_approved === 1 && (
                  <Popconfirm
                     title={
                        record.status === "active"
                           ? "Disable this user?"
                           : "Enable this user?"
                     }
                     onConfirm={() => handleToggleStatus(record.id, record.status)}
                  >
                     <Button
                        danger={record.status === "active"}
                        type="primary"
                        size="small"
                     >
                        {record.status === "active" ? "Disable" : "Enable"}
                     </Button>
                  </Popconfirm>
               )}

               <Tooltip title="Edit">
                  <Button
                     type="text"
                     size="small"
                     icon={<EditOutlined />}
                     onClick={() => {
                        setEditingUser(record);
                        form.setFieldsValue({
                           name: record.name,
                           email: record.email,
                           role_id: record.role_name === "admin" ? 1 : 2
                        });
                        setOpen(true);
                     }}
                  />
               </Tooltip>

               <Popconfirm
                  title="Delete user?"
                  description="This action cannot be undone."
                  onConfirm={() => handleDelete(record.id)}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  cancelText="Cancel"
               >
                  <Tooltip title="Delete">
                     <Button
                        danger
                        type="text"
                        size="small"
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
            .users-card {
               background: #fff;
               border-radius: 10px;
               box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
               border: 1px solid #f3f4f6;
            }
            .users-table .ant-table-thead > tr > th {
               background: #f9fafb;
               font-size: 12px;
               font-weight: 600;
               padding: 10px 16px;
            }
            .users-table .ant-table-tbody > tr > td {
               padding: 10px 16px;
               font-size: 13px;
            }
            .users-table .ant-table-tbody > tr:hover > td {
               background: #f9fafb;
            }
         `}</style>

         {/* Header */}
         <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-xl font-semibold text-gray-800 m-0">Users Management</h1>
                  <span className="text-gray-400 text-sm">{filteredUsers.length} users</span>
               </div>
               {user?.role === "admin" && (
                  <Button
                     type="primary"
                     icon={<PlusOutlined />}
                     onClick={() => {
                        setEditingUser(null);
                        form.resetFields();
                        setOpen(true);
                     }}
                  >
                     Add User
                  </Button>
               )}
            </div>
         </div>

         <div className="p-6">
            {/* Table Card */}
            <div className="users-card users-table">
               <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <UserOutlined className="text-gray-600" />
                        <span className="font-medium text-gray-700">All Users</span>
                     </div>
                     <Input.Search
                        placeholder="Search by name, email, role..."
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
                  dataSource={filteredUsers}
                  columns={columns}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                     current: currentPage,
                     onChange: (page) => setCurrentPage(page),
                     pageSize: 10,
                     showTotal: (total, range) => (
                        <span className="text-sm text-gray-500">
                           Showing <b>{range[0]}-{range[1]}</b> of <b>{total}</b> users
                        </span>
                     ),
                     size: "small"
                  }}
               />
            </div>
         </div>

         {/* Add/Edit Modal */}
         <Modal
            title={editingUser ? "Edit User" : "Add User"}
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={400}
         >
            <Form
               layout="vertical"
               form={form}
               onFinish={handleSubmit}
               className="mt-4"
            >
               <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: "Please enter name" }]}
               >
                  <Input placeholder="Enter name" prefix={<UserOutlined className="text-gray-400" />} />
               </Form.Item>

               <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                     { required: true, message: "Please enter email" },
                     { type: "email", message: "Please enter valid email" }
                  ]}
               >
                  <Input placeholder="Enter email" prefix={<MailOutlined className="text-gray-400" />} />
               </Form.Item>

               {!editingUser && (
                  <Form.Item
                     name="password"
                     label="Password"
                     rules={[
                        { required: true, message: "Please enter password" },
                        { min: 6, message: "Password must be at least 6 characters" }
                     ]}
                  >
                     <Input.Password placeholder="Enter password" prefix={<LockOutlined className="text-gray-400" />} />
                  </Form.Item>
               )}

               <Form.Item
                  name="role_id"
                  label="Role"
                  rules={[{ required: true, message: "Please select role" }]}
               >
                  <Select placeholder="Select role">
                     <Select.Option value={1}>Admin</Select.Option>
                     <Select.Option value={2}>Staff</Select.Option>
                  </Select>
               </Form.Item>

               <div className="flex justify-end gap-2 mt-6">
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                     {editingUser ? "Update" : "Create"}
                  </Button>
               </div>
            </Form>
         </Modal>
      </div>
   );
};

export default Users;