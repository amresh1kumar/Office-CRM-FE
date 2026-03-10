import { useEffect, useState, useContext, useRef, useMemo } from "react";
import {
   Table,
   Button,
   Tag,
   Modal,
   Form,
   Input,
   Select,
   message,
   Card,
   Upload,
   Space,
   Tooltip,
   Popconfirm,
   Row,
   Col
} from "antd";
import {
   PlusOutlined,
   EditOutlined,
   DeleteOutlined,
   UploadOutlined,
   DownloadOutlined,
   EyeOutlined,
   FilterOutlined,
   FileExcelOutlined,
   ReloadOutlined
} from "@ant-design/icons";
import axios from "../../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Leads = () => {
   const navigate = useNavigate();
   const { user } = useContext(AuthContext);
   const [leads, setLeads] = useState([]);
   const [open, setOpen] = useState(false);
   const [editingLead, setEditingLead] = useState(null);
   const [statusFilter, setStatusFilter] = useState(null);
   const [total, setTotal] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
   const [usersList, setUsersList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [convertOpen, setConvertOpen] = useState(false);
   const [convertLead, setConvertLead] = useState(null);
   const [searchText, setSearchText] = useState("");
   const [searchInput, setSearchInput] = useState("");
   const [projects, setProjects] = useState([]);
   const [projectFilter, setProjectFilter] = useState(null);
   const [projectModelOpen, setProjectModalOpen] = useState(false);
   const [projectLoading, setProjectLoading] = useState(false);
   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
   const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
   const [bulkAssignUser, setBulkAssignUser] = useState(null)
   const [assignmentFilter, setAssignmentFilter] = useState(null);
   const [projectForm] = Form.useForm();
   const [form] = Form.useForm();
   const [convertForm] = Form.useForm();

   const requestIdRef = useRef(0);
   const isMountedRef = useRef(true);

   const statusOptions = [
      "New",
      "Contacted",
      "Qualified",
      "Proposal Sent",
      "Closed Won",
      "Closed Lost"
   ];

   const statusColors = useMemo(() => ({
      "New": "blue",
      "Contacted": "orange",
      "Qualified": "purple",
      "Proposal Sent": "cyan",
      "Closed Won": "green",
      "Closed Lost": "red"
   }), []);

   const columns = [

      {
         title: "#",
         key: "index",
         width: 50,
         align: "center",
         render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
      },
      {
         title: "Name",
         dataIndex: "name",
         key: "name",
         render: (name) => <span className="font-medium">{name}</span>
      },
      {
         title: "Phone",
         dataIndex: "phone",
         key: "phone",
      },
      {
         title: "Status",
         dataIndex: "status",
         key: "status",
         render: (status) => (
            <Tag color={statusColors[status]}>{status}</Tag>
         )
      },
      // {
      //    title: "Project",
      //    dataIndex: "project_name",
      //    key: "project_name",
      //    render: (value) => value || <span className="text-gray-400">Unassigned</span>
      // },

      {
         title: "Project",
         dataIndex: "project_name",
         key: "project_name",
         render: (value) =>
            value
               ? <Tag color="green">{value}</Tag>
               : <Tag color="orange">Unassigned</Tag>
      },
      {
         title: "Assigned To",
         dataIndex: "assigned_user",
         key: "assigned_user",
         render: (value) =>
            value
               ? <Tag color="green">{value}</Tag>
               : <Tag color="orange">Unassigned</Tag>
      },
      {
         title: "Created By",
         dataIndex: "created_by_name",
         key: "created_by_name",
      },
      {
         title: "Follow Up",
         key: "followup",
         align: "center",
         width: 100,
         render: (_, record) => (
            <Tooltip title="View Details">
               <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/leads/${record.id}`)}
               />
            </Tooltip>
         )
      },
      {
         title: "Action",
         key: "action",
         fixed:"right",
         width: 180,
         align: "center",
         render: (_, record) => {
            const canEdit = user?.role === "admin" || record.assigned_to === user?.id;

            return (
               <Space>
                  {record.status === "Closed Won" && (
                     record.is_converted ? (
                        <Button disabled type="default" size="small">
                           Converted
                        </Button>
                     ) : (
                        <Button
                           type="primary"
                           size="small"
                           onClick={() => handleOpenConvertModal(record)}
                        >
                           Convert
                        </Button>
                     )
                  )}

                  {(user?.role === "admin" || (record.assigned_to === user?.id && record.status !== "Closed Won")) && (
                     <Tooltip title="Edit">
                        <Button
                           type="text"
                           icon={<EditOutlined />}
                           className="text-blue-500 hover:text-blue-600"
                           onClick={() => handleOpenEditModal(record)}
                        />
                     </Tooltip>
                  )}

                  {/* {canEdit && (
                     <Tooltip title="Edit">
                        <Button
                           type="text"
                           icon={<EditOutlined />}
                           className="text-blue-500 hover:text-blue-600"
                           onClick={() => handleOpenEditModal(record)}
                        />
                     </Tooltip>
                  )} */}

                  {user?.role === "admin" && (
                     <Popconfirm
                        title="Delete Lead"
                        description="Are you sure you want to delete this lead?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                     >
                        <Tooltip title="Delete">
                           <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                           />
                        </Tooltip>
                     </Popconfirm>
                  )}
               </Space>
            );
         }
      }
   ];
   const hasActiveFilters = statusFilter || projectFilter || searchText || assignmentFilter;

   const rowSelection = {
      selectedRowKeys,
      onChange: (keys) => {
         setSelectedRowKeys(keys);
      },
      fixed: "left",
      getCheckboxProps: (record) => ({
         disabled: !!record.assigned_to
      })
   };

   useEffect(() => {
      isMountedRef.current = true;
      return () => {
         isMountedRef.current = false;
      };
   }, []);

   const fetchLeads = async (page = 1) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);

      try {
         let url = `/leads?page=${page}&limit=10`;

         if (statusFilter) {
            url += `&status=${encodeURIComponent(statusFilter)}`;
         }

         if (projectFilter) {
            url += `&project_id=${projectFilter}`;
         }

         if (searchText) {
            url += `&search=${encodeURIComponent(searchText)}`;
         }


         if (assignmentFilter === "unassigned") {
            url += `&assigned=unassigned`;
         }



         const res = await axios.get(url);

         // ✅ Only update if this is still the latest request AND component is mounted
         if (requestId === requestIdRef.current && isMountedRef.current) {
            setLeads(res.data.data);
            setTotal(res.data.total);
            setCurrentPage(page);
         }
      } catch (err) {
         if (requestId === requestIdRef.current && isMountedRef.current) {
            console.error(err);
            message.error("Failed to fetch leads");
         }
      } finally {
         if (requestId === requestIdRef.current && isMountedRef.current) {
            setLoading(false);
         }
      }
   };

   useEffect(() => {
      fetchLeads(1);
   }, [statusFilter, projectFilter, searchText, assignmentFilter]);

   const fetchProjects = async () => {
      try {
         const res = await axios.get("/projects");
         if (isMountedRef.current) {
            setProjects(res.data);
         }
      } catch (err) {
         console.error("Failed to fetch projects:", err);
      }
   };

   useEffect(() => {

      fetchProjects();
   }, []);

   useEffect(() => {
      if (user?.role !== "admin") return;

      const fetchUsers = async () => {
         try {
            const res = await axios.get("/users");
            if (isMountedRef.current) {
               setUsersList(res.data);
            }
         } catch (err) {
            console.error("Failed to fetch users:", err);
         }
      };
      fetchUsers();
   }, [user?.role]);

   const handleSubmit = async (values) => {
      setLoading(true);

      try {
         if (editingLead) {
            await axios.put(`/leads/${editingLead.id}`, values);
            message.success("Lead Updated Successfully");
            handleCloseModal();
            fetchLeads(currentPage);
            fetchProjects();
         } else {
            await axios.post("/leads", values);
            message.success("Lead Added Successfully");
            handleCloseModal();
            fetchLeads(1);
            fetchProjects();
         }
      } catch (err) {
         console.error(err);
         message.error(editingLead ? "Failed to update lead" : "Failed to add lead");
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id) => {
      setLoading(true);
      try {
         await axios.delete(`/leads/${id}`);
         message.success("Lead Deleted Successfully");
         if (leads.length === 1 && currentPage > 1) {
            fetchLeads(currentPage - 1);
         } else {
            fetchLeads(currentPage);
            fetchProjects();
         }
      } catch (err) {
         console.error(err);
         message.error("Failed to delete lead");
      } finally {
         setLoading(false);
      }
   };

   const handleImport = (file) => {
      const formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      axios.post("/leads/import", formData)
         .then(res => {
            const s = res.data.summary;
            message.success(
               `Import Done! Inserted: ${s.inserted}, Updated: ${s.updated}, Skipped: ${s.skipped}`
            );
            fetchLeads(1);
            fetchProjects();
         })
         .catch(err => {
            message.error("Import failed");
            console.error(err);
         })
         .finally(() => setLoading(false));

      return false;
   };

   const handleExport = async () => {
      try {
         setLoading(true);
         const response = await axios.get("/leads/export", {
            responseType: "blob"
         });

         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", "Leads.xlsx");
         document.body.appendChild(link);
         link.click();
         link.remove();
         window.URL.revokeObjectURL(url);

         message.success("Export successful");
      } catch (error) {
         message.error("Export failed");
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   const handleConvert = async (values) => {
      if (!convertLead) return;

      setLoading(true);
      try {
         await axios.post(`/leads/${convertLead.id}/convert`, values);
         message.success("Converted successfully");
         handleCloseConvertModal();
         fetchLeads(currentPage);
      } catch (err) {
         console.error(err);
         message.error("Conversion failed");
      } finally {
         setLoading(false);
      }
   };

   const handleCloseModal = () => {
      setOpen(false);
      setEditingLead(null);
      form.resetFields();
   };

   const handleCloseConvertModal = () => {
      setConvertOpen(false);
      setConvertLead(null);
      convertForm.resetFields();
   };

   const handleOpenEditModal = (record) => {
      setEditingLead(record);
      setOpen(true);
      setTimeout(() => {
         form.setFieldsValue(record);
      }, 0);
   };

   const handleOpenAddModal = () => {
      setEditingLead(null);
      form.resetFields();
      setOpen(true);
   };

   const handleOpenConvertModal = (record) => {
      setConvertLead(record);
      setConvertOpen(true);
      setTimeout(() => {
         convertForm.resetFields();
      }, 0);
   };

   const handleSearch = (value) => {
      const trimmedValue = value.trim();
      setSearchText(trimmedValue);
      setSearchInput(trimmedValue);
   };

   const handleSearchInputChange = (e) => {
      const value = e.target.value;
      setSearchInput(value);

      if (!value) {
         setSearchText("");
      }
   };

   const handleStatusFilterChange = (value) => {
      setStatusFilter(value || null);
   };

   const handleProjectFilterChange = (value) => {
      setProjectFilter(value || null);
   };

   const handleRefresh = () => {
      fetchLeads(currentPage);
   };

   const handlePageChange = (page) => {
      fetchLeads(page);
   };


   const handleBulkAssign = async () => {

      if (!bulkAssignUser) {
         message.warning("Please select user");
         return;
      }

      try {
         setLoading(true);

         const res = await axios.post("/leads/bulk-assign", {
            leadIds: selectedRowKeys,
            assigned_to: bulkAssignUser
         });

         message.success(
            `${res.data.updated} assigned, ${res.data.skipped} already assigned`
         );

         setBulkAssignOpen(false);
         setSelectedRowKeys([]);
         setBulkAssignUser(null);

         fetchLeads(currentPage);

      } catch (err) {
         console.error(err);
         message.error("Bulk assignment failed");
      } finally {
         setLoading(false);
      }
   };


   const handleCreateProject = (async (values) => {

      try {

         setProjectLoading(true);
         await axios.post("/projects", { name: values.name });
         message.success("Project created successfully");
         setProjectModalOpen(false)
         projectForm.resetFields();
         fetchProjects();
      } catch (error) {
         message.error(error.response?.data?.message || "Project already exists");
      } finally {
         setProjectLoading(false);
      }
   });

   const handleClearFilters = () => {
      setStatusFilter(null);
      setProjectFilter(null);
      setSearchText("");
      setSearchInput("");
      setAssignmentFilter(null);
   };

   return (
      <div className="space-y-1">
         {/* Header Section */}
         <Card  className="shadow-sm ">
            <Row gutter={[16, 16]} align="middle" justify="space-between">
               <Col xs={24} sm={24} md={6}>
                  <h2 className="text-2xl font-bold text-gray-800 m-0">
                     Leads Management
                  </h2>
                  <p className="text-gray-500 text-sm m-0">
                     Total {total} leads found
                  </p>
               </Col>
            </Row>
            <br />

            <Row gutter={[16, 16]} align="middle" justify="space-between">
               <Col xs={24} sm={12} md={7}>
                  <Input.Search
                     placeholder="Search by name, phone"
                     allowClear
                     value={searchInput}
                     onSearch={handleSearch}
                     onChange={handleSearchInputChange}
                     enterButton
                  />
               </Col>

               <Col xs={24} sm={12} md={7}>
                  <Select
                     placeholder="Filter by Status"
                     className="w-full"
                     allowClear
                     value={statusFilter}
                     suffixIcon={<FilterOutlined />}
                     onChange={handleStatusFilterChange}
                  >
                     {statusOptions.map(status => (
                        <Select.Option key={status} value={status}>
                           <Tag color={statusColors[status]} className="mr-2">
                              {status}
                           </Tag>
                        </Select.Option>
                     ))}
                  </Select>
               </Col>

               <Col xs={24} sm={12} md={7}>
                  <Select
                     placeholder="Filter by Project"
                     allowClear
                     className="w-full"
                     value={projectFilter}
                     onChange={handleProjectFilterChange}
                  >
                     {projects.map(project => (
                        <Select.Option key={project.id} value={project.id}>
                           {project.name} ({project.lead_count})
                        </Select.Option>
                     ))}
                  </Select>
               </Col>

               <Col xs={24} sm={12} md={24}>
                  <div className="flex flex-wrap gap-5 justify-start">
                     {user?.role === "admin" && (
                        <Upload
                           accept=".xlsx,.xls"
                           showUploadList={false}
                           beforeUpload={handleImport}
                           disabled={loading}
                        >
                           <Button
                              icon={<UploadOutlined />}
                              className="flex items-center"
                              disabled={loading}
                           >
                              <FileExcelOutlined className="ml-1 text-green-600" />
                              Import
                           </Button>
                        </Upload>
                     )}

                     {(user?.role === "admin" || user?.role === "staff") && (
                        <Button
                           icon={<DownloadOutlined />}
                           onClick={handleExport}
                           className="flex items-center"
                           loading={loading}
                        >
                           <FileExcelOutlined className="ml-1 text-green-600" />
                           Export
                        </Button>
                     )}

                     {user?.role === "admin" && (
                        <Button
                           type="primary"
                           icon={<PlusOutlined />}
                           onClick={handleOpenAddModal}
                        >
                           Add Lead
                        </Button>
                     )}

                     {/* {user?.role === "admin" && (
                        <Button icon={<PlusOutlined />}
                           onClick={() => setProjectModalOpen(true)}
                        >
                           Add Project
                        </Button>
                     )} */}

                     {user?.role === "admin" && selectedRowKeys.length > 0 && (
                        <Button type="primary" onClick={() => { setBulkAssignOpen(true) }}>
                           Assign Selected ({selectedRowKeys.length})
                        </Button>
                     )}
                     {user?.role === "admin" &&(
                        <Button type={assignmentFilter === "unassigned" ? "primary" : "default"} onClick={() => setAssignmentFilter(assignmentFilter === "unassigned" ? null : "unassigned")}>
                           Unassigned Only
                        </Button>
                     )}
                     {hasActiveFilters && (
                        <Button onClick={handleClearFilters}>
                           Clear Filters
                        </Button>
                     )}

                  </div>
               </Col>
            </Row>
         </Card>

         <Card className="shadow-sm">
            <Table
               size="small"
               rowSelection={user?.role === "admin" ? rowSelection : null}
               dataSource={leads}
               columns={columns}
               rowKey="id"
               loading={loading}
               scroll={{ x: 1200 }}
               pagination={{
                  current: currentPage,
                  pageSize: 10,
                  total: total,
                  showSizeChanger: false,
                  showTotal: (total, range) =>
                     `${range[0]}-${range[1]} of ${total} leads`,
                  onChange: handlePageChange
               }}
            />
         </Card>

         <Modal
            title={
               <div className="flex items-center gap-2">
                  {editingLead ? <EditOutlined /> : <PlusOutlined />}
                  <span>{editingLead ? "Edit Lead" : "Add New Lead"}</span>
               </div>
            }
            open={open}
            onCancel={handleCloseModal}
            footer={null}
            width={500}
            destroyOnClose
         >
            <Form
               layout="vertical"
               form={form}
               onFinish={handleSubmit}
               className="mt-4"
               initialValues={{ status: "New" }}
            >

               {/* ================= ADMIN FIELDS ================= */}
               {user?.role === "admin" && (
                  <>
                     {/* NAME */}
                     <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: "Please enter name" }]}
                     >
                        <Input placeholder="Enter lead name" />
                     </Form.Item>

                     {/* PHONE + EMAIL */}
                     <Row gutter={16}>
                        <Col span={12}>
                           <Form.Item
                              name="phone"
                              label="Phone"
                              rules={[
                                 {
                                    pattern: /^[0-9]{10,15}$/,
                                    message: "Enter valid phone number"
                                 }
                              ]}
                           >
                              <Input placeholder="Enter phone number" />
                           </Form.Item>
                        </Col>
                     </Row>


                     {/* PROJECT */}
                     {editingLead && (
                        <Form.Item name="project_id" label="Assign Project">
                           <Select placeholder="Select Project" allowClear>
                              {projects.map(project => (
                                 <Select.Option key={project.id} value={project.id}>
                                    {project.name}
                                 </Select.Option>
                              ))}
                           </Select>
                        </Form.Item>
                     )}

                     {/* ASSIGN TO */}
                     <Form.Item name="assigned_to" label="Assign To">
                        <Select placeholder="Select user" allowClear>
                           {usersList.map(u => (
                              <Select.Option key={u.id} value={u.id}>
                                 {u.name}
                              </Select.Option>
                           ))}
                        </Select>
                     </Form.Item>
                  </>
               )}

               {/* ================= STATUS (BOTH ROLES) ================= */}
               <Form.Item name="status" label="Status">
                  <Select>
                     {statusOptions.map(status => (
                        <Select.Option key={status} value={status}>
                           <Tag color={statusColors[status]}>
                              {status}
                           </Tag>
                        </Select.Option>
                     ))}
                  </Select>
               </Form.Item>

               {/* ================= BUTTONS ================= */}
               <Form.Item className="mb-0 mt-6">
                  <div className="flex gap-2 justify-end">
                     <Button onClick={handleCloseModal}>
                        Cancel
                     </Button>

                     <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                     >
                        {editingLead ? "Update Lead" : "Add Lead"}
                     </Button>
                  </div>
               </Form.Item>

            </Form>
         </Modal>


         {/* Convert to Sale Modal */}
         <Modal
            title="Convert to Sale"
            open={convertOpen}
            onCancel={handleCloseConvertModal}
            footer={null}
            destroyOnClose
         >
            <Form
               layout="vertical"
               form={convertForm}
               onFinish={handleConvert}
            >
               <Form.Item
                  name="sale_amount"
                  label="Sale Amount"
                  rules={[
                     { required: true, message: "Please enter sale amount" },
                     {
                        validator: (_, value) => {
                           if (value && value <= 0) {
                              return Promise.reject("Amount must be greater than 0");
                           }
                           return Promise.resolve();
                        }
                     }
                  ]}
               >
                  <Input type="number" placeholder="Enter sale amount" min={1} />
               </Form.Item>

               <Form.Item
                  name="closing_date"
                  label="Closing Date"
                  rules={[{ required: true, message: "Please select closing date" }]}
               >
                  <Input type="date" />
               </Form.Item>

               <Form.Item className="mb-0">
                  <div className="flex gap-2 justify-end">
                     <Button onClick={handleCloseConvertModal}>
                        Cancel
                     </Button>
                     <Button type="primary" htmlType="submit" loading={loading}>
                        Confirm Conversion
                     </Button>
                  </div>
               </Form.Item>
            </Form>
         </Modal>

         {/* add project model */}
         <Modal
            title="Add New Project"
            open={projectModelOpen}
            onCancel={() => {
               setProjectModalOpen(false);
               projectForm.resetFields();
            }}
            footer={null}
         >

            <Form form={projectForm} layout="vertical" onFinish={handleCreateProject}>
               <Form.Item
                  name="name"
                  label="Project Name"
                  rules={[{ required: true, message: "Please enter the project name" }]}
               >
                  <Input placeholder="Enter project name" />

               </Form.Item>

               <Form.Item className="mb-0">
                  <div className="flex justify-end gap-2">
                     <Button onClick={() => setProjectModalOpen(false)}>
                        Cancel
                     </Button>

                     <Button type="primary" htmlType="submit" loading={projectLoading}>
                        Create Project
                     </Button>

                  </div>

               </Form.Item>

            </Form>

         </Modal>

         {/* {assign multiple leads} */}
         <Modal
            title="Bulk Assign Leads"
            open={bulkAssignOpen}
            onCancel={() => {
               setBulkAssignOpen(false);
               setBulkAssignUser(null);
            }}
            onOk={handleBulkAssign}
            okText="Assign"
         >
            <Select
               placeholder="Select user"
               className="w-full"
               value={bulkAssignUser}
               onChange={(value) => setBulkAssignUser(value)}
            >
               {usersList.map(user => (
                  <Select.Option key={user.id} value={user.id}>
                     {user.name}
                  </Select.Option>
               ))}
            </Select>
         </Modal>
      </div>
   );
};

export default Leads;