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
   Tag
} from "antd";
import { useEffect, useState, useContext } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../context/AuthContext";

import {
   EditOutlined,
   DeleteOutlined,
} from "@ant-design/icons";

const Users = () => {

   const { user } = useContext(AuthContext);

   const [users, setUsers] = useState([]);
   const [open, setOpen] = useState(false);
   const [editingUser, setEditingUser] = useState(null);
   const [currentPage, setCurrentPage] = useState(1);
   const [form] = Form.useForm();

   const fetchUsers = () => {
      axios.get("/users")
         .then(res => setUsers(res.data));
   };

   useEffect(() => {
      fetchUsers();
   }, []);


   const handleSubmit = (values) => {

      if (editingUser) {

         axios.put(`/users/${editingUser.id}`, values)
            .then(() => {
               message.success("User updated");
               setOpen(false);
               fetchUsers();
            })
            .catch((err) => {
               // ✅ Backend se aaya error message dikhao
               message.error(
                  err.response?.data?.message || "Update failed"
               );
            });

      } else {

         axios.post("/register", values)
            .then(() => {
               message.success("User added");
               setOpen(false);
               fetchUsers();
            })
            .catch((err) => {
               message.error(
                  err.response?.data?.message || "Registration failed"
               );
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
            message.error(
               err.response?.data?.message || "Approval failed"
            );
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
         render: (_, __, index) => (currentPage - 1) * 10 + index + 1
      },
      {
         title: "Name",
         dataIndex: "name"
      },
      {
         title: "Email",
         dataIndex: "email"
      },
      {
         title: "Role",
         dataIndex: "role_name",
         render: (role) => (
            <Tag color={role === "admin" ? "red" : "blue"}>
               {role}
            </Tag>
         )
      },
      {
         title: "Approved",
         dataIndex: "is_approved",
         render: (value) => (
            <Tag color={value === 1 ? "green" : "orange"}>
               {value === 1 ? "Approved" : "Pending"}
            </Tag>
         )
      },
      // {
      //    title: "Action",
      //    render: (_, record) => (
      //       <Space>
      //          <Button
      //             type="text"
      //             icon={<EditOutlined />}
      //             onClick={() => {
      //                setEditingUser(record);
      //                form.setFieldsValue({
      //                   name: record.name,
      //                   email: record.email,
      //                   role_id: record.role_name === "admin" ? 1 : 2
      //                });
      //                setOpen(true);
      //             }}
      //          >
      //          </Button>

      //          <Popconfirm
      //             title="Delete user?"
      //             onConfirm={() => handleDelete(record.id)}
      //          >
      //             <Button danger type="text"

      //                icon={<DeleteOutlined />} />

      //          </Popconfirm>
      //       </Space>
      //    )
      // }.

      {
         title: "Status",
         render: (_, record) => {

            if (record.is_approved === 0) {
               return <Tag color="orange">Pending</Tag>;
            }

            return (
               <Tag color={record.status === "active" ? "green" : "red"}>
                  {record.status === "active" ? "Active" : "Disabled"}
               </Tag>
            );
         }
      },
      {
         title: "Action",
         render: (_, record) => (
            <Space>

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
                     onConfirm={() =>
                        handleToggleStatus(record.id, record.status)
                     }
                  >
                     <Button
                        danger={record.status === "active"}
                        type="primary"
                        size="small"
                     >
                        {record.status === "active"
                           ? "Disable"
                           : "Enable"}
                     </Button>
                  </Popconfirm>
               )}
               <Button
                  type="text"
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

               <Popconfirm
                  title="Delete user?"
                  onConfirm={() => handleDelete(record.id)}
               >
                  <Button
                     danger
                     type="text"
                     icon={<DeleteOutlined />}
                  />
               </Popconfirm>

            </Space>
         )
      }
   ];

   return (
      <div>

         <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Users List</h2>

            {user?.role === "admin" && (
               <Button
                  type="primary"
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

         <Table
            size="small"
            dataSource={users}
            columns={columns}
            rowKey="id"
            pagination={{
               current: currentPage,
               onChange: (page) => setCurrentPage(page)
            }}
         />

         <Modal
            title={editingUser ? "Edit User" : "Add User"}
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
         >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>

               <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true }]}
               >
                  <Input />
               </Form.Item>

               <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true }]}
               >
                  <Input />
               </Form.Item>

               {!editingUser && (
                  <Form.Item
                     name="password"
                     label="Password"
                     rules={[{ required: true }]}
                  >
                     <Input.Password />
                  </Form.Item>
               )}

               <Form.Item
                  name="role_id"
                  label="Role"
                  rules={[{ required: true }]}
               >
                  <Select>
                     <Select.Option value={1}>Admin</Select.Option>
                     <Select.Option value={2}>Staff</Select.Option>
                  </Select>
               </Form.Item>

               <Button type="primary" htmlType="submit" block>
                  {editingUser ? "Update" : "Create"}
               </Button>

            </Form>
         </Modal>

      </div>
   );
};

export default Users;
