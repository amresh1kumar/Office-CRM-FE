// import { useEffect, useState } from "react";
// import {
//    Table,
//    Button,
//    Modal,
//    Form,
//    Input,
//    message,
//    Popconfirm,
//    Card,
//    Row,
//    Col,
//    Space,
//    Typography,
//    Tag,
//    Tooltip,
//    Statistic,
//    Divider,
//    Badge
// } from "antd";
// import {
//    EditOutlined,
//    DeleteOutlined,
//    PlusOutlined,
//    ProjectOutlined,
//    TeamOutlined,
//    SearchOutlined,
//    ExclamationCircleOutlined
// } from "@ant-design/icons";
// import axios from "../../api/axios";

// const { Title, Text } = Typography;

// const Projects = () => {
//    const [projects, setProjects] = useState([]);
//    const [loading, setLoading] = useState(false);
//    const [open, setOpen] = useState(false);
//    const [editingProject, setEditingProject] = useState(null);
//    const [searchText, setSearchText] = useState("");
//    const [submitLoading, setSubmitLoading] = useState(false);
//    const [form] = Form.useForm();

//    const fetchProjects = async () => {
//       setLoading(true);
//       try {
//          const res = await axios.get("/projects");
//          setProjects(res.data);
//       } catch (err) {
//          message.error("Failed to fetch projects");
//       } finally {
//          setLoading(false);
//       }
//    };

//    useEffect(() => {
//       fetchProjects();
//    }, []);

//    const handleSubmit = async (values) => {
//       setSubmitLoading(true);
//       try {
//          if (editingProject) {
//             await axios.put(`/projects/${editingProject.id}`, values);
//             message.success("Project updated successfully!");
//          } else {
//             await axios.post("/projects", values);
//             message.success("Project created successfully!");
//          }
//          handleCloseModal();
//          fetchProjects();
//       } catch (err) {
//          message.error("Operation failed");
//       } finally {
//          setSubmitLoading(false);
//       }
//    };

//    const handleDelete = async (id) => {
//       try {
//          await axios.delete(`/projects/${id}`);
//          message.success("Project deleted");
//          fetchProjects();
//       } catch {
//          message.error("Delete failed");
//       }
//    };

//    const handleCloseModal = () => {
//       setOpen(false);
//       setEditingProject(null);
//       form.resetFields();
//    };

//    const handleEdit = (record) => {
//       setEditingProject(record);
//       form.setFieldsValue(record);
//       setOpen(true);
//    };

//    // Filter projects
//    const filteredProjects = projects.filter((project) =>
//       project.name?.toLowerCase().includes(searchText.toLowerCase())
//    );

//    // Calculate stats
//    // const totalLeads = projects.reduce((acc, p) => acc + (p.lead_count || 0), 0);
//    const activeProjects = projects.filter((p) => p.lead_count > 0).length;

//    const columns = [
//       {
//          title: "S.No",
//          width: 70,
//          render: (_, __, index) => (
//             <Text type="secondary">{index + 1}</Text>
//          )
//       },
//       {
//          title: "Project Name",
//          dataIndex: "name",
//          sorter: (a, b) => a.name.localeCompare(b.name),
//          render: (name) => (
//             <Space>
//                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
//                   <ProjectOutlined className="text-white" />
//                </div>
//                <Text strong>{name}</Text>
//             </Space>
//          )
//       },
//       {
//          title: "Total Leads",
//          dataIndex: "lead_count",
//          sorter: (a, b) => (a.lead_count || 0) - (b.lead_count || 0),
//          render: (count) => {
//             let color = "default";
//             if (count >= 20) color = "green";
//             else if (count >= 10) color = "blue";
//             else if (count >= 5) color = "orange";

//             return (
//                <Tag color={color} className="px-3 py-1">
//                   <TeamOutlined className="mr-1" />
//                   {count || 0} Leads
//                </Tag>
//             );
//          }
//       },
//       {
//          title: "Status",
//          render: (_, record) => (
//             <Badge
//                status={record.lead_count > 0 ? "success" : "default"}
//                text={record.lead_count > 0 ? "Active" : "Inactive"}
//             />
//          )
//       },
//       {
//          title: "Actions",
//          width: 120,
//          render: (_, record) => (
//             <Space>
//                <Tooltip title="Edit">
//                   <Button
//                      type="primary"
//                      ghost
//                      icon={<EditOutlined />}
//                      size="small"
//                      onClick={() => handleEdit(record)}
//                   />
//                </Tooltip>

//                <Popconfirm
//                   title="Delete Project"
//                   description="Are you sure you want to delete this project?"
//                   icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
//                   onConfirm={() => handleDelete(record.id)}
//                   okText="Delete"
//                   okButtonProps={{ danger: true }}
//                   cancelText="Cancel"
//                >
//                   <Tooltip title="Delete">
//                      <Button
//                         danger
//                         icon={<DeleteOutlined />}
//                         size="small"
//                      />
//                   </Tooltip>
//                </Popconfirm>
//             </Space>
//          )
//       }
//    ];

//    return (
//       <div className="p-6 bg-gray-50 min-h-screen">
//          {/* Page Header */}
//          <div className="mb-3">
//             <Title level={4} className="!mb-1">
//                Projects
//             </Title>
//             <Text type="secondary">
//                Manage and organize all your projects
//             </Text>
//          </div>

//          {/* Stats Cards */}
//          <Row gutter={[16, 16]} className="mb-4">
//             <Col xs={24} sm={8}>
//                <Card size="small" bordered={false} className="shadow-sm">
//                   <Statistic
//                      title={<Text type="secondary">Total Projects</Text>}
//                      value={projects.length}
//                      prefix={<ProjectOutlined className="text-blue-500" />}
//                   />
//                </Card>
//             </Col>
//             {/* <Col xs={24} sm={8}>
//                <Card  size="small" bordered={false} className="shadow-sm">
//                   <Statistic
//                      title={<Text type="secondary">Total Leads</Text>}
//                      value={totalLeads}
//                      prefix={<TeamOutlined className="text-green-500" />}
//                   />
//                </Card>
//             </Col> */}
//             <Col  xs={24} sm={8}>
//                <Card size="small" bordered={false} className="shadow-sm">
//                   <Statistic
//                      title={<Text type="secondary">Active Projects</Text>}
//                      value={activeProjects}
//                      suffix={`/ ${projects.length}`}
//                      valueStyle={{ color: "#52c41a" }}
//                   />
//                </Card>
//             </Col>
//          </Row>

//          {/* Main Table Card */}
//          <Card 
//             bordered={false}
//             className="shadow-sm"
//             title={
//                <Space>
//                   <ProjectOutlined />
//                   <span>All Projects</span>
//                   <Tag color="blue">{filteredProjects.length}</Tag>
//                </Space>
//             }
//             extra={
//                <Space>
//                   <Input
//                      placeholder="Search projects..."
//                      prefix={<SearchOutlined className="text-gray-400" />}
//                      value={searchText}
//                      onChange={(e) => setSearchText(e.target.value)}
//                      allowClear
//                      style={{ width: 220 }}
//                   />
//                   {/* <Tooltip title="Refresh">
//                      <Button
//                         icon={<ReloadOutlined />}
//                         onClick={fetchProjects}
//                         loading={loading}
//                      />
//                   </Tooltip> */}
//                   <Button
//                      type="primary"
//                      icon={<PlusOutlined />}
//                      onClick={() => setOpen(true)}
//                   >
//                      Add Project
//                   </Button>
//                </Space>
//             }
//          >
//             <Table
//                size="small"

//                dataSource={filteredProjects}
//                columns={columns}
//                rowKey="id"
//                loading={loading}
//                pagination={{
//                   pageSize: 10,
//                   showSizeChanger: true,
//                   showQuickJumper: true,
//                   showTotal: (total, range) =>
//                      `${range[0]}-${range[1]} of ${total} projects`
//                }}
//                locale={{
//                   emptyText: (
//                      <div className="py-8 text-center">
//                         <ProjectOutlined className="text-4xl text-gray-300 mb-3" />
//                         <p className="text-gray-500">No projects found</p>
//                         <Button
//                            type="primary"
//                            icon={<PlusOutlined />}
//                            onClick={() => setOpen(true)}
//                            className="mt-3"
//                         >
//                            Create First Project
//                         </Button>
//                      </div>
//                   )
//                }}
//             />
//          </Card>

//          {/* Add/Edit Modal */}
//          <Modal
//             title={
//                <Space>
//                   <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
//                      <ProjectOutlined className="text-white" />
//                   </div>
//                   <span>{editingProject ? "Edit Project" : "Add New Project"}</span>
//                </Space>
//             }
//             open={open}
//             onCancel={handleCloseModal}
//             footer={null}
//             destroyOnClose
//             centered
//          >
//             <Divider />

//             <Form
//                form={form}
//                layout="vertical"
//                onFinish={handleSubmit}
//                requiredMark="optional"
//             >
//                <Form.Item
//                   name="name"
//                   label="Project Name"
//                   rules={[
//                      { required: true, message: "Please enter project name" },
//                      { min: 3, message: "Name must be at least 3 characters" }
//                   ]}
//                >
//                   <Input
//                      placeholder="Enter project name"
//                      size="large"
//                      prefix={<ProjectOutlined className="text-gray-400" />}
//                   />
//                </Form.Item>

//                <Form.Item className="mb-0 mt-6">
//                   <Space className="w-full justify-end">
//                      <Button onClick={handleCloseModal}>
//                         Cancel
//                      </Button>
//                      <Button
//                         type="primary"
//                         htmlType="submit"
//                         loading={submitLoading}
//                         icon={editingProject ? <EditOutlined /> : <PlusOutlined />}
//                      >
//                         {editingProject ? "Update Project" : "Create Project"}
//                      </Button>
//                   </Space>
//                </Form.Item>
//             </Form>
//          </Modal>
//       </div>
//    );
// };

// export default Projects;

import { useEffect, useState } from "react";
import {
   Table,
   Button,
   Modal,
   Form,
   Input,
   message,
   Popconfirm,
   Card,
   Row,
   Col,
   Space,
   Tag,
   Tooltip
} from "antd";
import {
   EditOutlined,
   DeleteOutlined,
   PlusOutlined,
   ProjectOutlined,
   TeamOutlined,
   SearchOutlined
} from "@ant-design/icons";
import axios from "../../api/axios";

const Projects = () => {
   const [projects, setProjects] = useState([]);
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const [editingProject, setEditingProject] = useState(null);
   const [searchText, setSearchText] = useState("");
   const [submitLoading, setSubmitLoading] = useState(false);
   const [form] = Form.useForm();

   const fetchProjects = async () => {
      setLoading(true);
      try {
         const res = await axios.get("/projects");
         setProjects(res.data);
      } catch (err) {
         message.error("Failed to fetch projects");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchProjects();
   }, []);

   const handleSubmit = async (values) => {
      setSubmitLoading(true);
      try {
         if (editingProject) {
            await axios.put(`/projects/${editingProject.id}`, values);
            message.success("Project updated successfully");
         } else {
            await axios.post("/projects", values);
            message.success("Project created successfully");
         }
         handleCloseModal();
         fetchProjects();
      } catch (err) {
         message.error("Operation failed");
      } finally {
         setSubmitLoading(false);
      }
   };

   const handleDelete = async (id) => {
      try {
         await axios.delete(`/projects/${id}`);
         message.success("Project deleted");
         fetchProjects();
      } catch {
         message.error("Delete failed");
      }
   };

   const handleCloseModal = () => {
      setOpen(false);
      setEditingProject(null);
      form.resetFields();
   };

   const handleEdit = (record) => {
      setEditingProject(record);
      form.setFieldsValue(record);
      setOpen(true);
   };

   const filteredProjects = projects.filter((project) =>
      project.name?.toLowerCase().includes(searchText.toLowerCase())
   );

   const activeProjects = projects.filter((p) => p.lead_count > 0).length;

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
         title: "Project Name",
         dataIndex: "name",
         render: (name) => (
            <Space>
               <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <ProjectOutlined className="text-white text-sm" />
               </div>
               <span className="font-medium text-gray-800">{name}</span>
            </Space>
         )
      },
      {
         title: "Total Leads",
         dataIndex: "lead_count",
         render: (count) => (
            <Tag color={count > 0 ? "blue" : "default"}>
               {count || 0} leads
            </Tag>
         )
      },
      {
         title: "Status",
         render: (_, record) => (
            <Tag color={record.lead_count > 0 ? "green" : "default"}>
               {record.lead_count > 0 ? "Active" : "Inactive"}
            </Tag>
         )
      },
      {
         title: "Actions",
         width: 120,
         align: "center",
         render: (_, record) => (
            <Space size="small">
               <Tooltip title="Edit">
                  <Button
                     type="text"
                     size="small"
                     icon={<EditOutlined />}
                     onClick={() => handleEdit(record)}
                  />
               </Tooltip>

               <Popconfirm
                  title="Delete Project?"
                  description="Are you sure?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
               >
                  <Tooltip title="Delete">
                     <Button
                        type="text"
                        danger
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
            .projects-card {
               background: #fff;
               border-radius: 10px;
               box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
               border: 1px solid #f3f4f6;
            }
            .projects-table .ant-table-thead > tr > th {
               background: #f9fafb;
               font-size: 12px;
               padding: 10px 16px;
            }
            .projects-table .ant-table-tbody > tr > td {
               padding: 10px 16px;
               font-size: 13px;
            }
            .projects-table .ant-table-tbody > tr:hover > td {
               background: #f9fafb;
            }
         `}</style>

         {/* Header */}
         <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-xl font-semibold text-gray-800 m-0">Projects</h1>
                  <span className="text-gray-400 text-sm">{projects.length} total</span>
               </div>
               <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setOpen(true)}
               >
                  Add Project
               </Button>
            </div>
         </div>

         <div className="p-6">
            {/* Stats */}
            <Row gutter={[16, 16]} className="mb-4">
               <Col xs={24} sm={8}>
                  <div className="projects-card p-4">
                     <div className="flex items-center gap-3">
                        <ProjectOutlined className="text-indigo-500 text-xl" />
                        <div>
                           <div className="text-2xl font-bold text-gray-800">{projects.length}</div>
                           <div className="text-xs text-gray-500">Total Projects</div>
                        </div>
                     </div>
                  </div>
               </Col>
               <Col xs={24} sm={8}>
                  <div className="projects-card p-4">
                     <div className="flex items-center gap-3">
                        <TeamOutlined className="text-green-500 text-xl" />
                        <div>
                           <div className="text-2xl font-bold text-gray-800">{activeProjects}</div>
                           <div className="text-xs text-gray-500">Active Projects</div>
                        </div>
                     </div>
                  </div>
               </Col>
            </Row>

            {/* Table Card */}
            <div className="projects-card projects-table">
               <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <ProjectOutlined className="text-gray-600" />
                        <span className="font-medium text-gray-700">All Projects</span>
                        <Tag>{filteredProjects.length}</Tag>
                     </div>
                     <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        style={{ width: 200 }}
                     />
                  </div>
               </div>

               <Table
                  size="small"
                  dataSource={filteredProjects}
                  columns={columns}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                     pageSize: 10,
                     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                     size: "small"
                  }}
                  locale={{
                     emptyText: (
                        <div className="py-8 text-center">
                           <ProjectOutlined className="text-4xl text-gray-300 mb-3" />
                           <p className="text-gray-500">No projects found</p>
                           <Button
                              type="primary"
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => setOpen(true)}
                              className="mt-3"
                           >
                              Create First Project
                           </Button>
                        </div>
                     )
                  }}
               />
            </div>
         </div>

         {/* Add/Edit Modal */}
         <Modal
            title={editingProject ? "Edit Project" : "Add New Project"}
            open={open}
            onCancel={handleCloseModal}
            footer={null}
            width={400}
            destroyOnClose
         >
            <Form
               form={form}
               layout="vertical"
               onFinish={handleSubmit}
               className="mt-4"
            >
               <Form.Item
                  name="name"
                  label="Project Name"
                  rules={[
                     { required: true, message: "Please enter project name" },
                     { min: 3, message: "Minimum 3 characters" }
                  ]}
               >
                  <Input placeholder="Enter project name" />
               </Form.Item>

               <div className="flex justify-end gap-2">
                  <Button onClick={handleCloseModal}>Cancel</Button>
                  <Button type="primary" htmlType="submit" loading={submitLoading}>
                     {editingProject ? "Update" : "Create"}
                  </Button>
               </div>
            </Form>
         </Modal>
      </div>
   );
};

export default Projects;