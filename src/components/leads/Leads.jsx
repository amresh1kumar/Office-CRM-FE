// import { useEffect, useState, useContext, useRef, useMemo } from "react";
// import {
//    Table,
//    Button,
//    Tag,
//    Modal,
//    Form,
//    Input,
//    Select,
//    message,
//    Card,
//    Upload,
//    Space,
//    Tooltip,
//    Popconfirm,
//    Row,
//    Col
// } from "antd";
// import {
//    PlusOutlined,
//    EditOutlined,
//    DeleteOutlined,
//    UploadOutlined,
//    DownloadOutlined,
//    EyeOutlined,
//    FilterOutlined,
//    FileExcelOutlined,
// } from "@ant-design/icons";
// import axios from "../../api/axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Leads = () => {
//    const navigate = useNavigate();
//    const { user } = useContext(AuthContext);
//    const [leads, setLeads] = useState([]);
//    const [open, setOpen] = useState(false);
//    const [editingLead, setEditingLead] = useState(null);
//    const [statusFilter, setStatusFilter] = useState(null);
//    const [total, setTotal] = useState(0);
//    const [currentPage, setCurrentPage] = useState(1);
//    const [usersList, setUsersList] = useState([]);
//    const [loading, setLoading] = useState(false);
//    const [convertOpen, setConvertOpen] = useState(false);
//    const [convertLead, setConvertLead] = useState(null);
//    const [searchText, setSearchText] = useState("");
//    const [searchInput, setSearchInput] = useState("");
//    const [projects, setProjects] = useState([]);
//    const [projectFilter, setProjectFilter] = useState(null);
//    const [projectModelOpen, setProjectModalOpen] = useState(false);
//    const [projectLoading, setProjectLoading] = useState(false);
//    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//    const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
//    const [bulkAssignUser, setBulkAssignUser] = useState(null)
//    const [assignmentFilter, setAssignmentFilter] = useState(null);
//    const [projectForm] = Form.useForm();
//    const [form] = Form.useForm();
//    const [convertForm] = Form.useForm();

//    const requestIdRef = useRef(0);
//    const isMountedRef = useRef(true);

//    const statusOptions = [
//       "New",
//       "Contacted",
//       "Qualified",
//       "Proposal Sent",
//       "Closed Won",
//       "Closed Lost"
//    ];

//    const statusColors = useMemo(() => ({
//       "New": "blue",
//       "Contacted": "orange",
//       "Qualified": "purple",
//       "Proposal Sent": "cyan",
//       "Closed Won": "green",
//       "Closed Lost": "red"
//    }), []);

//    const columns = [

//       {
//          title: "#",
//          key: "index",
//          width: 50,
//          align: "center",
//          render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
//       },
//       {
//          title: "Name",
//          dataIndex: "name",
//          key: "name",
//          render: (name) => <span className="font-medium">{name}</span>
//       },
//       {
//          title: "Phone",
//          dataIndex: "phone",
//          key: "phone",
//       },
//       {
//          title: "Status",
//          dataIndex: "status",
//          key: "status",
//          render: (status) => (
//             <Tag color={statusColors[status]}>{status}</Tag>
//          )
//       },
//       // {
//       //    title: "Project",
//       //    dataIndex: "project_name",
//       //    key: "project_name",
//       //    render: (value) => value || <span className="text-gray-400">Unassigned</span>
//       // },

//       {
//          title: "Project",
//          dataIndex: "project_name",
//          key: "project_name",
//          render: (value) =>
//             value
//                ? <Tag color="green">{value}</Tag>
//                : <Tag color="orange">Unassigned</Tag>
//       },
//       {
//          title: "Assigned To",
//          dataIndex: "assigned_user",
//          key: "assigned_user",
//          render: (value) =>
//             value
//                ? <Tag color="green">{value}</Tag>
//                : <Tag color="orange">Unassigned</Tag>
//       },
//       {
//          title: "Created By",
//          dataIndex: "created_by_name",
//          key: "created_by_name",
//       },
//       {
//          title: "Follow Up",
//          key: "followup",
//          align: "center",
//          width: 100,
//          render: (_, record) => (
//             <Tooltip title="View Details">
//                <Button
//                   type="link"
//                   icon={<EyeOutlined />}
//                   onClick={() => navigate(`/leads/${record.id}`)}
//                />
//             </Tooltip>
//          )
//       },
//       {
//          title: "Action",
//          key: "action",
//          fixed:"right",
//          width: 180,
//          align: "center",
//          render: (_, record) => {
//             const canEdit = user?.role === "admin" || record.assigned_to === user?.id;

//             return (
//                <Space>
//                   {record.status === "Closed Won" && (
//                      record.is_converted ? (
//                         <Button disabled type="default" size="small">
//                            Converted
//                         </Button>
//                      ) : (
//                         <Button
//                            type="primary"
//                            size="small"
//                            onClick={() => handleOpenConvertModal(record)}
//                         >
//                            Convert
//                         </Button>
//                      )
//                   )}

//                   {(user?.role === "admin" || (record.assigned_to === user?.id && record.status !== "Closed Won")) && (
//                      <Tooltip title="Edit">
//                         <Button
//                            type="text"
//                            icon={<EditOutlined />}
//                            className="text-blue-500 hover:text-blue-600"
//                            onClick={() => handleOpenEditModal(record)}
//                         />
//                      </Tooltip>
//                   )}

//                   {/* {canEdit && (
//                      <Tooltip title="Edit">
//                         <Button
//                            type="text"
//                            icon={<EditOutlined />}
//                            className="text-blue-500 hover:text-blue-600"
//                            onClick={() => handleOpenEditModal(record)}
//                         />
//                      </Tooltip>
//                   )} */}

//                   {user?.role === "admin" && (
//                      <Popconfirm
//                         title="Delete Lead"
//                         description="Are you sure you want to delete this lead?"
//                         onConfirm={() => handleDelete(record.id)}
//                         okText="Yes"
//                         cancelText="No"
//                         okButtonProps={{ danger: true }}
//                      >
//                         <Tooltip title="Delete">
//                            <Button
//                               type="text"
//                               danger
//                               icon={<DeleteOutlined />}
//                            />
//                         </Tooltip>
//                      </Popconfirm>
//                   )}
//                </Space>
//             );
//          }
//       }
//    ];
//    const hasActiveFilters = statusFilter || projectFilter || searchText || assignmentFilter;

//    const rowSelection = {
//       selectedRowKeys,
//       onChange: (keys) => {
//          setSelectedRowKeys(keys);
//       },
//       fixed: "left",
//       getCheckboxProps: (record) => ({
//          disabled: !!record.assigned_to
//       })
//    };

//    useEffect(() => {
//       isMountedRef.current = true;
//       return () => {
//          isMountedRef.current = false;
//       };
//    }, []);

//    const fetchLeads = async (page = 1) => {
//       const requestId = ++requestIdRef.current;

//       setLoading(true);

//       try {
//          let url = `/leads?page=${page}&limit=10`;

//          if (statusFilter) {
//             url += `&status=${encodeURIComponent(statusFilter)}`;
//          }

//          if (projectFilter) {
//             url += `&project_id=${projectFilter}`;
//          }

//          if (searchText) {
//             url += `&search=${encodeURIComponent(searchText)}`;
//          }


//          if (assignmentFilter === "unassigned") {
//             url += `&assigned=unassigned`;
//          }



//          const res = await axios.get(url);

//          // ✅ Only update if this is still the latest request AND component is mounted
//          if (requestId === requestIdRef.current && isMountedRef.current) {
//             setLeads(res.data.data);
//             setTotal(res.data.total);
//             setCurrentPage(page);
//          }
//       } catch (err) {
//          if (requestId === requestIdRef.current && isMountedRef.current) {
//             console.error(err);
//             message.error("Failed to fetch leads");
//          }
//       } finally {
//          if (requestId === requestIdRef.current && isMountedRef.current) {
//             setLoading(false);
//          }
//       }
//    };

//    useEffect(() => {
//       fetchLeads(1);
//    }, [statusFilter, projectFilter, searchText, assignmentFilter]);

//    const fetchProjects = async () => {
//       try {
//          const res = await axios.get("/projects");
//          if (isMountedRef.current) {
//             setProjects(res.data);
//          }
//       } catch (err) {
//          console.error("Failed to fetch projects:", err);
//       }
//    };

//    useEffect(() => {

//       fetchProjects();
//    }, []);

//    useEffect(() => {
//       if (user?.role !== "admin") return;

//       const fetchUsers = async () => {
//          try {
//             const res = await axios.get("/users");
//             if (isMountedRef.current) {
//                setUsersList(res.data);
//             }
//          } catch (err) {
//             console.error("Failed to fetch users:", err);
//          }
//       };
//       fetchUsers();
//    }, [user?.role]);

//    const handleSubmit = async (values) => {
//       setLoading(true);

//       try {
//          if (editingLead) {
//             await axios.put(`/leads/${editingLead.id}`, values);
//             message.success("Lead Updated Successfully");
//             handleCloseModal();
//             fetchLeads(currentPage);
//             fetchProjects();
//          } else {
//             await axios.post("/leads", values);
//             message.success("Lead Added Successfully");
//             handleCloseModal();
//             fetchLeads(1);
//             fetchProjects();
//          }
//       } catch (err) {
//          console.error(err);
//          message.error(editingLead ? "Failed to update lead" : "Failed to add lead");
//       } finally {
//          setLoading(false);
//       }
//    };

//    const handleDelete = async (id) => {
//       setLoading(true);
//       try {
//          await axios.delete(`/leads/${id}`);
//          message.success("Lead Deleted Successfully");
//          if (leads.length === 1 && currentPage > 1) {
//             fetchLeads(currentPage - 1);
//          } else {
//             fetchLeads(currentPage);
//             fetchProjects();
//          }
//       } catch (err) {
//          console.error(err);
//          message.error("Failed to delete lead");
//       } finally {
//          setLoading(false);
//       }
//    };

//    const handleImport = (file) => {
//       const formData = new FormData();
//       formData.append("file", file);

//       setLoading(true);
//       axios.post("/leads/import", formData)
//          .then(res => {
//             const s = res.data.summary;
//             message.success(
//                `Import Done! Inserted: ${s.inserted}, Updated: ${s.updated}, Skipped: ${s.skipped}`
//             );
//             fetchLeads(1);
//             fetchProjects();
//          })
//          .catch(err => {
//             message.error("Import failed");
//             console.error(err);
//          })
//          .finally(() => setLoading(false));

//       return false;
//    };

//    const handleExport = async () => {
//       try {
//          setLoading(true);
//          const response = await axios.get("/leads/export", {
//             responseType: "blob"
//          });

//          const url = window.URL.createObjectURL(new Blob([response.data]));
//          const link = document.createElement("a");
//          link.href = url;
//          link.setAttribute("download", "Leads.xlsx");
//          document.body.appendChild(link);
//          link.click();
//          link.remove();
//          window.URL.revokeObjectURL(url);

//          message.success("Export successful");
//       } catch (error) {
//          message.error("Export failed");
//          console.error(error);
//       } finally {
//          setLoading(false);
//       }
//    };

//    const handleConvert = async (values) => {
//       if (!convertLead) return;

//       setLoading(true);
//       try {
//          await axios.post(`/leads/${convertLead.id}/convert`, values);
//          message.success("Converted successfully");
//          handleCloseConvertModal();
//          fetchLeads(currentPage);
//       } catch (err) {
//          console.error(err);
//          message.error("Conversion failed");
//       } finally {
//          setLoading(false);
//       }
//    };

//    const handleCloseModal = () => {
//       setOpen(false);
//       setEditingLead(null);
//       form.resetFields();
//    };

//    const handleCloseConvertModal = () => {
//       setConvertOpen(false);
//       setConvertLead(null);
//       convertForm.resetFields();
//    };

//    const handleOpenEditModal = (record) => {
//       setEditingLead(record);
//       setOpen(true);
//       setTimeout(() => {
//          form.setFieldsValue(record);
//       }, 0);
//    };

//    const handleOpenAddModal = () => {
//       setEditingLead(null);
//       form.resetFields();
//       setOpen(true);
//    };

//    const handleOpenConvertModal = (record) => {
//       setConvertLead(record);
//       setConvertOpen(true);
//       setTimeout(() => {
//          convertForm.resetFields();
//       }, 0);
//    };

//    const handleSearch = (value) => {
//       const trimmedValue = value.trim();
//       setSearchText(trimmedValue);
//       setSearchInput(trimmedValue);
//    };

//    const handleSearchInputChange = (e) => {
//       const value = e.target.value;
//       setSearchInput(value);

//       if (!value) {
//          setSearchText("");
//       }
//    };

//    const handleStatusFilterChange = (value) => {
//       setStatusFilter(value || null);
//    };

//    const handleProjectFilterChange = (value) => {
//       setProjectFilter(value || null);
//    };

//    const handleRefresh = () => {
//       fetchLeads(currentPage);
//    };

//    const handlePageChange = (page) => {
//       fetchLeads(page);
//    };


//    const handleBulkAssign = async () => {

//       if (!bulkAssignUser) {
//          message.warning("Please select user");
//          return;
//       }

//       try {
//          setLoading(true);

//          const res = await axios.post("/leads/bulk-assign", {
//             leadIds: selectedRowKeys,
//             assigned_to: bulkAssignUser
//          });

//          message.success(
//             `${res.data.updated} assigned, ${res.data.skipped} already assigned`
//          );

//          setBulkAssignOpen(false);
//          setSelectedRowKeys([]);
//          setBulkAssignUser(null);

//          fetchLeads(currentPage);

//       } catch (err) {
//          console.error(err);
//          message.error("Bulk assignment failed");
//       } finally {
//          setLoading(false);
//       }
//    };


//    const handleCreateProject = (async (values) => {

//       try {

//          setProjectLoading(true);
//          await axios.post("/projects", { name: values.name });
//          message.success("Project created successfully");
//          setProjectModalOpen(false)
//          projectForm.resetFields();
//          fetchProjects();
//       } catch (error) {
//          message.error(error.response?.data?.message || "Project already exists");
//       } finally {
//          setProjectLoading(false);
//       }
//    });

//    const handleClearFilters = () => {
//       setStatusFilter(null);
//       setProjectFilter(null);
//       setSearchText("");
//       setSearchInput("");
//       setAssignmentFilter(null);
//    };

//    return (
//       <div className="space-y-1">
//          {/* Header Section */}
//          <Card  className="shadow-sm ">
//             <Row gutter={[16, 16]} align="middle" justify="space-between">
//                <Col xs={24} sm={24} md={6}>
//                   <h2 className="text-2xl font-bold text-gray-800 m-0">
//                      Leads Management
//                   </h2>
//                   <p className="text-gray-500 text-sm m-0">
//                      Total {total} leads found
//                   </p>
//                </Col>
//             </Row>
//             <br />

//             <Row gutter={[16, 16]} align="middle" justify="space-between">
//                <Col xs={24} sm={12} md={7}>
//                   <Input.Search
//                      placeholder="Search by name, phone"
//                      allowClear
//                      value={searchInput}
//                      onSearch={handleSearch}
//                      onChange={handleSearchInputChange}
//                      enterButton
//                   />
//                </Col>

//                <Col xs={24} sm={12} md={7}>
//                   <Select
//                      placeholder="Filter by Status"
//                      className="w-full"
//                      allowClear
//                      value={statusFilter}
//                      suffixIcon={<FilterOutlined />}
//                      onChange={handleStatusFilterChange}
//                   >
//                      {statusOptions.map(status => (
//                         <Select.Option key={status} value={status}>
//                            <Tag color={statusColors[status]} className="mr-2">
//                               {status}
//                            </Tag>
//                         </Select.Option>
//                      ))}
//                   </Select>
//                </Col>

//                <Col xs={24} sm={12} md={7}>
//                   <Select
//                      placeholder="Filter by Project"
//                      allowClear
//                      className="w-full"
//                      value={projectFilter}
//                      onChange={handleProjectFilterChange}
//                   >
//                      {projects.map(project => (
//                         <Select.Option key={project.id} value={project.id}>
//                            {project.name} ({project.lead_count})
//                         </Select.Option>
//                      ))}
//                   </Select>
//                </Col>

//                <Col xs={24} sm={12} md={24}>
//                   <div className="flex flex-wrap gap-5 justify-start">
//                      {user?.role === "admin" && (
//                         <Upload
//                            accept=".xlsx,.xls"
//                            showUploadList={false}
//                            beforeUpload={handleImport}
//                            disabled={loading}
//                         >
//                            <Button
//                               icon={<UploadOutlined />}
//                               className="flex items-center"
//                               disabled={loading}
//                            >
//                               <FileExcelOutlined className="ml-1 text-green-600" />
//                               Import
//                            </Button>
//                         </Upload>
//                      )}

//                      {(user?.role === "admin" || user?.role === "staff") && (
//                         <Button
//                            icon={<DownloadOutlined />}
//                            onClick={handleExport}
//                            className="flex items-center"
//                            loading={loading}
//                         >
//                            <FileExcelOutlined className="ml-1 text-green-600" />
//                            Export
//                         </Button>
//                      )}

//                      {user?.role === "admin" && (
//                         <Button
//                            type="primary"
//                            icon={<PlusOutlined />}
//                            onClick={handleOpenAddModal}
//                         >
//                            Add Lead
//                         </Button>
//                      )}

//                      {/* {user?.role === "admin" && (
//                         <Button icon={<PlusOutlined />}
//                            onClick={() => setProjectModalOpen(true)}
//                         >
//                            Add Project
//                         </Button>
//                      )} */}

//                      {user?.role === "admin" && selectedRowKeys.length > 0 && (
//                         <Button type="primary" onClick={() => { setBulkAssignOpen(true) }}>
//                            Assign Selected ({selectedRowKeys.length})
//                         </Button>
//                      )}
//                      {user?.role === "admin" &&(
//                         <Button type={assignmentFilter === "unassigned" ? "primary" : "default"} onClick={() => setAssignmentFilter(assignmentFilter === "unassigned" ? null : "unassigned")}>
//                            Unassigned Only
//                         </Button>
//                      )}
//                      {hasActiveFilters && (
//                         <Button onClick={handleClearFilters}>
//                            Clear Filters
//                         </Button>
//                      )}

//                   </div>
//                </Col>
//             </Row>
//          </Card>

//          <Card className="shadow-sm">
//             <Table
//                size="small"
//                rowSelection={user?.role === "admin" ? rowSelection : null}
//                dataSource={leads}
//                columns={columns}
//                rowKey="id"
//                loading={loading}
//                scroll={{ x: 1200 }}
//                pagination={{
//                   current: currentPage,
//                   pageSize: 10,
//                   total: total,
//                   showSizeChanger: false,
//                   showTotal: (total, range) =>
//                      `${range[0]}-${range[1]} of ${total} leads`,
//                   onChange: handlePageChange
//                }}
//             />
//          </Card>

//          <Modal
//             title={
//                <div className="flex items-center gap-2">
//                   {editingLead ? <EditOutlined /> : <PlusOutlined />}
//                   <span>{editingLead ? "Edit Lead" : "Add New Lead"}</span>
//                </div>
//             }
//             open={open}
//             onCancel={handleCloseModal}
//             footer={null}
//             width={500}
//             destroyOnClose
//          >
//             <Form
//                layout="vertical"
//                form={form}
//                onFinish={handleSubmit}
//                className="mt-4"
//                initialValues={{ status: "New" }}
//             >

//                {/* ================= ADMIN FIELDS ================= */}
//                {user?.role === "admin" && (
//                   <>
//                      {/* NAME */}
//                      <Form.Item
//                         name="name"
//                         label="Name"
//                         rules={[{ required: true, message: "Please enter name" }]}
//                      >
//                         <Input placeholder="Enter lead name" />
//                      </Form.Item>

//                      {/* PHONE + EMAIL */}
//                      <Row gutter={16}>
//                         <Col span={12}>
//                            <Form.Item
//                               name="phone"
//                               label="Phone"
//                               rules={[
//                                  {
//                                     pattern: /^[0-9]{10,15}$/,
//                                     message: "Enter valid phone number"
//                                  }
//                               ]}
//                            >
//                               <Input placeholder="Enter phone number" />
//                            </Form.Item>
//                         </Col>
//                      </Row>


//                      {/* PROJECT */}
//                      {editingLead && (
//                         <Form.Item name="project_id" label="Assign Project">
//                            <Select placeholder="Select Project" allowClear>
//                               {projects.map(project => (
//                                  <Select.Option key={project.id} value={project.id}>
//                                     {project.name}
//                                  </Select.Option>
//                               ))}
//                            </Select>
//                         </Form.Item>
//                      )}

//                      {/* ASSIGN TO */}
//                      <Form.Item name="assigned_to" label="Assign To">
//                         <Select placeholder="Select user" allowClear>
//                            {usersList.map(u => (
//                               <Select.Option key={u.id} value={u.id}>
//                                  {u.name}
//                               </Select.Option>
//                            ))}
//                         </Select>
//                      </Form.Item>
//                   </>
//                )}

//                {/* ================= STATUS (BOTH ROLES) ================= */}
//                <Form.Item name="status" label="Status">
//                   <Select>
//                      {statusOptions.map(status => (
//                         <Select.Option key={status} value={status}>
//                            <Tag color={statusColors[status]}>
//                               {status}
//                            </Tag>
//                         </Select.Option>
//                      ))}
//                   </Select>
//                </Form.Item>

//                {/* ================= BUTTONS ================= */}
//                <Form.Item className="mb-0 mt-6">
//                   <div className="flex gap-2 justify-end">
//                      <Button onClick={handleCloseModal}>
//                         Cancel
//                      </Button>

//                      <Button
//                         type="primary"
//                         htmlType="submit"
//                         loading={loading}
//                      >
//                         {editingLead ? "Update Lead" : "Add Lead"}
//                      </Button>
//                   </div>
//                </Form.Item>

//             </Form>
//          </Modal>


//          {/* Convert to Sale Modal */}
//          <Modal
//             title="Convert to Sale"
//             open={convertOpen}
//             onCancel={handleCloseConvertModal}
//             footer={null}
//             destroyOnClose
//          >
//             <Form
//                layout="vertical"
//                form={convertForm}
//                onFinish={handleConvert}
//             >
//                <Form.Item
//                   name="sale_amount"
//                   label="Sale Amount"
//                   rules={[
//                      { required: true, message: "Please enter sale amount" },
//                      {
//                         validator: (_, value) => {
//                            if (value && value <= 0) {
//                               return Promise.reject("Amount must be greater than 0");
//                            }
//                            return Promise.resolve();
//                         }
//                      }
//                   ]}
//                >
//                   <Input type="number" placeholder="Enter sale amount" min={1} />
//                </Form.Item>

//                <Form.Item
//                   name="closing_date"
//                   label="Closing Date"
//                   rules={[{ required: true, message: "Please select closing date" }]}
//                >
//                   <Input type="date" />
//                </Form.Item>

//                <Form.Item className="mb-0">
//                   <div className="flex gap-2 justify-end">
//                      <Button onClick={handleCloseConvertModal}>
//                         Cancel
//                      </Button>
//                      <Button type="primary" htmlType="submit" loading={loading}>
//                         Confirm Conversion
//                      </Button>
//                   </div>
//                </Form.Item>
//             </Form>
//          </Modal>

//          {/* add project model */}
//          <Modal
//             title="Add New Project"
//             open={projectModelOpen}
//             onCancel={() => {
//                setProjectModalOpen(false);
//                projectForm.resetFields();
//             }}
//             footer={null}
//          >

//             <Form form={projectForm} layout="vertical" onFinish={handleCreateProject}>
//                <Form.Item
//                   name="name"
//                   label="Project Name"
//                   rules={[{ required: true, message: "Please enter the project name" }]}
//                >
//                   <Input placeholder="Enter project name" />

//                </Form.Item>

//                <Form.Item className="mb-0">
//                   <div className="flex justify-end gap-2">
//                      <Button onClick={() => setProjectModalOpen(false)}>
//                         Cancel
//                      </Button>

//                      <Button type="primary" htmlType="submit" loading={projectLoading}>
//                         Create Project
//                      </Button>

//                   </div>

//                </Form.Item>

//             </Form>

//          </Modal>

//          {/* {assign multiple leads} */}
//          <Modal
//             title="Bulk Assign Leads"
//             open={bulkAssignOpen}
//             onCancel={() => {
//                setBulkAssignOpen(false);
//                setBulkAssignUser(null);
//             }}
//             onOk={handleBulkAssign}
//             okText="Assign"
//          >
//             <Select
//                placeholder="Select user"
//                className="w-full"
//                value={bulkAssignUser}
//                onChange={(value) => setBulkAssignUser(value)}
//             >
//                {usersList.map(user => (
//                   <Select.Option key={user.id} value={user.id}>
//                      {user.name}
//                   </Select.Option>
//                ))}
//             </Select>
//          </Modal>
//       </div>
//    );
// };

// export default Leads;

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
   Upload,
   Space,
   Tooltip,
   Popconfirm,
   Row,
   Col,
   Badge,
   Dropdown,
   Divider,
   Avatar
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
   UserOutlined,
   TeamOutlined,
   SearchOutlined,
   ReloadOutlined,
   ClearOutlined,
   MoreOutlined,
   PhoneOutlined,
   CalendarOutlined,
   CheckCircleOutlined,
   ProjectOutlined,
   DollarOutlined
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
   const [bulkAssignUser, setBulkAssignUser] = useState(null);
   const [assignmentFilter, setAssignmentFilter] = useState(null);
   const [projectForm] = Form.useForm();
   const [form] = Form.useForm();
   const [convertForm] = Form.useForm();

   const requestIdRef = useRef(0);
   const isMountedRef = useRef(true);

   const statusOptions = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed Won", "Closed Lost"];

   const statusConfig = {
      "New": { color: "#1890ff", bg: "#e6f7ff", border: "#91d5ff" },
      "Contacted": { color: "#fa8c16", bg: "#fff7e6", border: "#ffd591" },
      "Qualified": { color: "#722ed1", bg: "#f9f0ff", border: "#d3adf7" },
      "Proposal Sent": { color: "#13c2c2", bg: "#e6fffb", border: "#87e8de" },
      "Closed Won": { color: "#52c41a", bg: "#f6ffed", border: "#b7eb8f" },
      "Closed Lost": { color: "#f5222d", bg: "#fff1f0", border: "#ffa39e" }
   };

   const columns = [
      {
         title: <span className="text-xs font-medium text-gray-500">#</span>,
         key: "index",
         width: 45,
         align: "center",
         render: (_, __, index) => (
            <span className="text-xs text-gray-400">
               {(currentPage - 1) * 10 + index + 1}
            </span>
         ),
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Lead Name</span>,
         dataIndex: "name",
         key: "name",
         render: (name) => (
            <div className="flex items-center gap-2">
               <Avatar size={28} style={{ backgroundColor: '#6366f1', fontSize: '12px' }}>
                  {name?.charAt(0)?.toUpperCase()}
               </Avatar>
               <span className="font-medium text-gray-800 text-sm">{name}</span>
            </div>
         )
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Phone</span>,
         dataIndex: "phone",
         key: "phone",
         render: (phone) => (
            <div className="flex items-center gap-1 text-gray-600 text-sm">
               <PhoneOutlined style={{ fontSize: '11px' }} />
               {phone || '-'}
            </div>
         )
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Status</span>,
         dataIndex: "status",
         key: "status",
         render: (status) => (
            <div 
               className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
               style={{ 
                  backgroundColor: statusConfig[status].bg,
                  color: statusConfig[status].color,
                  border: `1px solid ${statusConfig[status].border}`
               }}
            >
               {status}
            </div>
         )
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Project</span>,
         dataIndex: "project_name",
         key: "project_name",
         render: (value) => value ? (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs">
               <ProjectOutlined style={{ fontSize: '10px' }} />
               {value}
            </div>
         ) : (
            <span className="text-xs text-gray-400">Not assigned</span>
         )
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Assigned To</span>,
         dataIndex: "assigned_user",
         key: "assigned_user",
         render: (value) => value ? (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs">
               <UserOutlined style={{ fontSize: '10px' }} />
               {value}
            </div>
         ) : (
            <span className="text-xs text-gray-400">Not assigned</span>
         )
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Created By</span>,
         dataIndex: "created_by_name",
         key: "created_by_name",
         render: (value) => <span className="text-gray-500 text-xs">{value}</span>
      },
      {
         title: <span className="text-xs font-medium text-gray-600">Actions</span>,
         key: "action",
         fixed: "right",
         width: 120,
         align: "center",
         render: (_, record) => {
            const isConverted = record.status === "Closed Won" && record.is_converted;
            const canConvert = record.status === "Closed Won" && !record.is_converted;
            const canEdit = user?.role === "admin" || (record.assigned_to === user?.id && record.status !== "Closed Won");
            const canDelete = user?.role === "admin";

            if (isConverted) {
               return (
                  <div className="flex items-center justify-center gap-2">
                     <Tag color="success" style={{ margin: 0 }}>
                        <CheckCircleOutlined /> Converted
                     </Tag>
                     <Tooltip title="View Details">
                        <Button 
                           type="text" 
                           size="small"
                           icon={<EyeOutlined />} 
                           onClick={() => navigate(`/leads/${record.id}`)}
                        />
                     </Tooltip>
                  </div>
               );
            }

            const menuItems = [
               {
                  key: 'view',
                  label: 'View Details',
                  icon: <EyeOutlined />,
                  onClick: () => navigate(`/leads/${record.id}`)
               },
               ...(canConvert ? [{
                  key: 'convert',
                  label: 'Convert to Sale',
                  icon: <DollarOutlined />,
                  onClick: () => handleOpenConvertModal(record),
                  className: 'text-green-600'
               }] : []),
               ...(canEdit ? [{
                  key: 'edit',
                  label: 'Edit',
                  icon: <EditOutlined />,
                  onClick: () => handleOpenEditModal(record)
               }] : []),
               ...(canDelete ? [{
                  type: 'divider'
               }, {
                  key: 'delete',
                  label: 'Delete',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => {
                     Modal.confirm({
                        title: 'Delete Lead?',
                        content: 'This action cannot be undone.',
                        okText: 'Delete',
                        okType: 'danger',
                        onOk: () => handleDelete(record.id)
                     });
                  }
               }] : [])
            ];

            return (
               <Space size="small">
                  {canConvert && (
                     <Button 
                        type="primary" 
                        size="small" 
                        onClick={() => handleOpenConvertModal(record)}
                        style={{ fontSize: '11px' }}
                     >
                        Convert
                     </Button>
                  )}
                  <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                     <Button type="text" size="small" icon={<MoreOutlined />} />
                  </Dropdown>
               </Space>
            );
         }
      }
   ];

   const hasActiveFilters = statusFilter || projectFilter || searchText || assignmentFilter;

   const rowSelection = {
      selectedRowKeys,
      onChange: (keys) => setSelectedRowKeys(keys),
      fixed: "left",
      getCheckboxProps: (record) => ({ disabled: !!record.assigned_to })
   };

   useEffect(() => {
      isMountedRef.current = true;
      return () => { isMountedRef.current = false; };
   }, []);

   const fetchLeads = async (page = 1) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);

      try {
         let url = `/leads?page=${page}&limit=10`;
         if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
         if (projectFilter) url += `&project_id=${projectFilter}`;
         if (searchText) url += `&search=${encodeURIComponent(searchText)}`;
         if (assignmentFilter === "unassigned") url += `&assigned=unassigned`;

         const res = await axios.get(url);

         if (requestId === requestIdRef.current && isMountedRef.current) {
            setLeads(res.data.data);
            setTotal(res.data.total);
            setCurrentPage(page);
         }
      } catch (err) {
         if (requestId === requestIdRef.current && isMountedRef.current) {
            message.error("Failed to fetch leads");
         }
      } finally {
         if (requestId === requestIdRef.current && isMountedRef.current) {
            setLoading(false);
         }
      }
   };

   useEffect(() => { fetchLeads(1); }, [statusFilter, projectFilter, searchText, assignmentFilter]);

   const fetchProjects = async () => {
      try {
         const res = await axios.get("/projects");
         if (isMountedRef.current) setProjects(res.data);
      } catch (err) {
         console.error(err);
      }
   };

   useEffect(() => { fetchProjects(); }, []);

   useEffect(() => {
      if (user?.role !== "admin") return;
      axios.get("/users").then(res => {
         if (isMountedRef.current) setUsersList(res.data);
      }).catch(console.error);
   }, [user?.role]);

   const handleSubmit = async (values) => {
      setLoading(true);
      try {
         if (editingLead) {
            await axios.put(`/leads/${editingLead.id}`, values);
            message.success("Lead updated successfully");
         } else {
            await axios.post("/leads", values);
            message.success("Lead added successfully");
         }
         handleCloseModal();
         fetchLeads(editingLead ? currentPage : 1);
         fetchProjects();
      } catch (err) {
         message.error(editingLead ? "Update failed" : "Add failed");
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id) => {
      setLoading(true);
      try {
         await axios.delete(`/leads/${id}`);
         message.success("Lead deleted successfully");
         fetchLeads(leads.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage);
         fetchProjects();
      } catch (err) {
         message.error("Delete failed");
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
            message.success(`Import successful! Inserted: ${s.inserted}, Updated: ${s.updated}, Skipped: ${s.skipped}`);
            fetchLeads(1);
            fetchProjects();
         })
         .catch(() => message.error("Import failed"))
         .finally(() => setLoading(false));
      return false;
   };

   const handleExport = async () => {
      try {
         setLoading(true);
         const response = await axios.get("/leads/export", { responseType: "blob" });
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", "Leads.xlsx");
         document.body.appendChild(link);
         link.click();
         link.remove();
         message.success("Export successful");
      } catch (error) {
         message.error("Export failed");
      } finally {
         setLoading(false);
      }
   };

   const handleConvert = async (values) => {
      if (!convertLead) return;
      setLoading(true);
      try {
         await axios.post(`/leads/${convertLead.id}/convert`, values);
         message.success("Lead converted successfully");
         handleCloseConvertModal();
         fetchLeads(currentPage);
      } catch (err) {
         message.error("Conversion failed");
      } finally {
         setLoading(false);
      }
   };

   const handleCloseModal = () => { setOpen(false); setEditingLead(null); form.resetFields(); };
   const handleCloseConvertModal = () => { setConvertOpen(false); setConvertLead(null); convertForm.resetFields(); };
   const handleOpenEditModal = (record) => { setEditingLead(record); setOpen(true); setTimeout(() => form.setFieldsValue(record), 0); };
   const handleOpenAddModal = () => { setEditingLead(null); form.resetFields(); setOpen(true); };
   const handleOpenConvertModal = (record) => { setConvertLead(record); setConvertOpen(true); };

   const handleSearch = (value) => { setSearchText(value.trim()); setSearchInput(value.trim()); };
   const handleSearchInputChange = (e) => { setSearchInput(e.target.value); if (!e.target.value) setSearchText(""); };

   const handleBulkAssign = async () => {
      if (!bulkAssignUser) { message.warning("Please select a user"); return; }
      try {
         setLoading(true);
         const res = await axios.post("/leads/bulk-assign", { leadIds: selectedRowKeys, assigned_to: bulkAssignUser });
         message.success(`Successfully assigned ${res.data.updated} leads`);
         setBulkAssignOpen(false);
         setSelectedRowKeys([]);
         setBulkAssignUser(null);
         fetchLeads(currentPage);
      } catch (err) {
         message.error("Assignment failed");
      } finally {
         setLoading(false);
      }
   };

   const handleCreateProject = async (values) => {
      try {
         setProjectLoading(true);
         await axios.post("/projects", { name: values.name });
         message.success("Project created successfully");
         setProjectModalOpen(false);
         projectForm.resetFields();
         fetchProjects();
      } catch (error) {
         message.error(error.response?.data?.message || "Failed to create project");
      } finally {
         setProjectLoading(false);
      }
   };

   const handleClearFilters = () => {
      setStatusFilter(null);
      setProjectFilter(null);
      setSearchText("");
      setSearchInput("");
      setAssignmentFilter(null);
   };

   return (
      <div className="bg-gray-50 min-h-screen">
         <style>{`
            .custom-card {
               background: #fff;
               border-radius: 10px;
               box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 3px 1px rgba(0,0,0,0.04);
               border: 1px solid #f3f4f6;
            }
            .custom-table .ant-table-thead > tr > th {
               background: #f9fafb;
               border-bottom: 1px solid #e5e7eb;
               font-weight: 500;
               padding: 10px 16px;
            }
            .custom-table .ant-table-tbody > tr > td {
               padding: 12px 16px;
               border-bottom: 1px solid #f3f4f6;
            }
            .custom-table .ant-table-tbody > tr:hover > td {
               background: #f9fafb;
            }
            .custom-table .ant-pagination {
               margin: 16px;
            }
            .action-btn {
               border-radius: 6px;
               font-size: 13px;
               height: 32px;
               display: inline-flex;
               align-items: center;
               gap: 6px;
               font-weight: 500;
               transition: all 0.2s;
            }
            .action-btn:hover {
               transform: translateY(-1px);
               box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .filter-select .ant-select-selector {
               border-radius: 6px !important;
               border: 1px solid #e5e7eb !important;
            }
            .filter-select.ant-select-focused .ant-select-selector {
               border-color: #6366f1 !important;
               box-shadow: 0 0 0 2px rgba(99,102,241,0.1) !important;
            }
            .search-input .ant-input-affix-wrapper {
               border-radius: 6px;
               border: 1px solid #e5e7eb;
            }
            .search-input .ant-input-affix-wrapper:hover,
            .search-input .ant-input-affix-wrapper:focus {
               border-color: #6366f1;
            }
            .modal-form .ant-form-item {
               margin-bottom: 16px;
            }
            .modal-form .ant-input,
            .modal-form .ant-select-selector {
               border-radius: 6px;
            }
            .stats-badge {
               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
               color: white;
               padding: 2px 8px;
               border-radius: 10px;
               font-size: 11px;
               font-weight: 600;
            }
         `}</style>

         {/* Header Section */}
         <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-semibold text-gray-900 m-0">Leads Management</h1>
                  <p className="text-sm text-gray-500 mt-1">
                     Manage and track all your leads efficiently
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                     <div className="text-xs text-gray-500">Total Leads</div>
                     <div className="text-2xl font-bold text-gray-900">{total}</div>
                  </div>
                  {selectedRowKeys.length > 0 && (
                     <div className="text-right mr-4 px-4 py-2 bg-indigo-50 rounded-lg">
                        <div className="text-xs text-indigo-600">Selected</div>
                        <div className="text-xl font-bold text-indigo-600">{selectedRowKeys.length}</div>
                     </div>
                  )}
               </div>
            </div>
         </div>

         <div className="p-6">
            {/* Filters & Actions */}
            <div className="custom-card p-4 mb-4">
               <div className="flex flex-col gap-3">
                  {/* Search & Filters Row */}
                  <Row gutter={[12, 12]} align="middle">
                     <Col xs={24} sm={12} md={6}>
                        <div className="search-input">
                           <Input.Search
                              placeholder="Search leads..."
                              allowClear
                              value={searchInput}
                              onSearch={handleSearch}
                              onChange={handleSearchInputChange}
                              prefix={<SearchOutlined className="text-gray-400" />}
                           />
                        </div>
                     </Col>
                     <Col xs={24} sm={12} md={5}>
                        <Select
                           placeholder="All Status"
                           className="w-full filter-select"
                           allowClear
                           value={statusFilter}
                           onChange={(v) => setStatusFilter(v || null)}
                        >
                           {statusOptions.map(status => (
                              <Select.Option key={status} value={status}>
                                 <div className="flex items-center gap-2">
                                    <div 
                                       className="w-2 h-2 rounded-full" 
                                       style={{ backgroundColor: statusConfig[status].color }}
                                    />
                                    {status}
                                 </div>
                              </Select.Option>
                           ))}
                        </Select>
                     </Col>
                     <Col xs={24} sm={12} md={5}>
                        <Select
                           placeholder="All Projects"
                           allowClear
                           className="w-full filter-select"
                           value={projectFilter}
                           onChange={(v) => setProjectFilter(v || null)}
                        >
                           {projects.map(p => (
                              <Select.Option key={p.id} value={p.id}>
                                 <div className="flex items-center justify-between w-full">
                                    <span>{p.name}</span>
                                    <span className="stats-badge">{p.lead_count}</span>
                                 </div>
                              </Select.Option>
                           ))}
                        </Select>
                     </Col>
                     <Col xs={24} sm={12} md={8}>
                        <Space wrap>
                           {user?.role === "admin" && (
                              <>
                                 <Button
                                    className={`action-btn ${assignmentFilter === "unassigned" ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
                                    onClick={() => setAssignmentFilter(assignmentFilter === "unassigned" ? null : "unassigned")}
                                 >
                                    <UserOutlined style={{ fontSize: '12px' }} />
                                    Unassigned
                                 </Button>
                                 {selectedRowKeys.length > 0 && (
                                    <Button 
                                       type="primary" 
                                       className="action-btn"
                                       onClick={() => setBulkAssignOpen(true)}
                                    >
                                       <TeamOutlined />
                                       Assign ({selectedRowKeys.length})
                                    </Button>
                                 )}
                              </>
                           )}
                           {hasActiveFilters && (
                              <Button 
                                 className="action-btn"
                                 onClick={handleClearFilters}
                              >
                                 <ClearOutlined />
                                 Clear
                              </Button>
                           )}
                           <Button 
                              className="action-btn"
                              onClick={() => fetchLeads(currentPage)}
                           >
                              <ReloadOutlined />
                           </Button>
                        </Space>
                     </Col>
                  </Row>

                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                     <div className="flex gap-2">
                        {user?.role === "admin" && (
                           <>
                              <Upload 
                                 accept=".xlsx,.xls" 
                                 showUploadList={false} 
                                 beforeUpload={handleImport} 
                                 disabled={loading}
                              >
                                 <Button 
                                    icon={<UploadOutlined />} 
                                    className="action-btn"
                                    style={{ color: '#059669' }}
                                 >
                                    Import Excel
                                 </Button>
                              </Upload>
                           </>
                        )}
                        {(user?.role === "admin" || user?.role === "staff") && (
                           <Button 
                              icon={<DownloadOutlined />} 
                              onClick={handleExport} 
                              loading={loading} 
                              className="action-btn"
                              style={{ color: '#2563eb' }}
                           >
                              Export Excel
                           </Button>
                        )}
                     </div>
                     {user?.role === "admin" && (
                        <Button 
                           type="primary" 
                           icon={<PlusOutlined />} 
                           onClick={handleOpenAddModal} 
                           className="action-btn"
                        >
                           Add New Lead
                        </Button>
                     )}
                  </div>
               </div>
            </div>

            {/* Table */}
            <div className="custom-card custom-table">
               <Table
                  size="small"
                  rowSelection={user?.role === "admin" ? rowSelection : null}
                  dataSource={leads}
                  columns={columns}
                  rowKey="id"
                  loading={loading}
                  scroll={{ x: 1100 }}
                  pagination={{
                     current: currentPage,
                     pageSize: 10,
                     total,
                     showSizeChanger: false,
                     showTotal: (t, range) => (
                        <span className="text-sm text-gray-500">
                           Showing <b>{range[0]}-{range[1]}</b> of <b>{t}</b> leads
                        </span>
                     ),
                     onChange: (page) => fetchLeads(page),
                     size: "default"
                  }}
               />
            </div>
         </div>

         {/* Add/Edit Modal */}
         <Modal
            title={
               <div className="flex items-center gap-2 text-lg font-semibold">
                  {editingLead ? <EditOutlined /> : <PlusOutlined />}
                  {editingLead ? "Edit Lead" : "Add New Lead"}
               </div>
            }
            open={open}
            onCancel={handleCloseModal}
            footer={null}
            width={450}
            destroyOnClose
         >
            <Form 
               layout="vertical" 
               form={form} 
               onFinish={handleSubmit} 
               initialValues={{ status: "New" }}
               className="modal-form mt-4"
            >
               {user?.role === "admin" && (
                  <>
                     <Form.Item 
                        name="name" 
                        label="Lead Name" 
                        rules={[{ required: true, message: "Name is required" }]}
                     >
                        <Input placeholder="Enter lead name" />
                     </Form.Item>
                     <Form.Item 
                        name="phone" 
                        label="Phone Number" 
                        rules={[{ pattern: /^[0-9]{10,15}$/, message: "Invalid phone number" }]}
                     >
                        <Input placeholder="Enter phone number" />
                     </Form.Item>
                     {editingLead && (
                        <Form.Item name="project_id" label="Project">
                           <Select placeholder="Select project" allowClear>
                              {projects.map(p => (
                                 <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                              ))}
                           </Select>
                        </Form.Item>
                     )}
                     <Form.Item name="assigned_to" label="Assign To">
                        <Select placeholder="Select user" allowClear>
                           {usersList.map(u => (
                              <Select.Option key={u.id} value={u.id}>{u.name}</Select.Option>
                           ))}
                        </Select>
                     </Form.Item>
                  </>
               )}
               <Form.Item name="status" label="Status">
                  <Select>
                     {statusOptions.map(s => (
                        <Select.Option key={s} value={s}>
                           <div className="flex items-center gap-2">
                              <div 
                                 className="w-2 h-2 rounded-full" 
                                 style={{ backgroundColor: statusConfig[s].color }}
                              />
                              {s}
                           </div>
                        </Select.Option>
                     ))}
                  </Select>
               </Form.Item>
               <div className="flex justify-end gap-2 mt-6">
                  <Button onClick={handleCloseModal}>Cancel</Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                     {editingLead ? "Update" : "Create"}
                  </Button>
               </div>
            </Form>
         </Modal>

         {/* Convert Modal */}
         <Modal 
            title={
               <div className="flex items-center gap-2 text-lg font-semibold">
                  <DollarOutlined />
                  Convert to Sale
               </div>
            }
            open={convertOpen} 
            onCancel={handleCloseConvertModal} 
            footer={null} 
            destroyOnClose
         >
            <Form 
               layout="vertical" 
               form={convertForm} 
               onFinish={handleConvert}
               className="modal-form mt-4"
            >
               <Form.Item 
                  name="sale_amount" 
                  label="Sale Amount" 
                  rules={[{ required: true, message: "Amount is required" }]}
               >
                  <Input type="number" placeholder="Enter amount" min={1} prefix="₹" />
               </Form.Item>
               <Form.Item 
                  name="closing_date" 
                  label="Closing Date" 
                  rules={[{ required: true, message: "Date is required" }]}
               >
                  <Input type="date" />
               </Form.Item>
               <div className="flex justify-end gap-2 mt-6">
                  <Button onClick={handleCloseConvertModal}>Cancel</Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                     Convert
                  </Button>
               </div>
            </Form>
         </Modal>

         {/* Bulk Assign Modal */}
         <Modal
            title={
               <div className="flex items-center gap-2 text-lg font-semibold">
                  <TeamOutlined />
                  Bulk Assign Leads
               </div>
            }
            open={bulkAssignOpen}
            onCancel={() => { setBulkAssignOpen(false); setBulkAssignUser(null); }}
            onOk={handleBulkAssign}
            okText="Assign"
         >
            <div className="py-4">
               <p className="text-gray-600 mb-4">
                  Assign <b>{selectedRowKeys.length} leads</b> to:
               </p>
               <Select
                  placeholder="Select user"
                  className="w-full"
                  size="large"
                  value={bulkAssignUser}
                  onChange={setBulkAssignUser}
               >
                  {usersList.map(u => (
                     <Select.Option key={u.id} value={u.id}>
                        <div className="flex items-center gap-2">
                           <Avatar size="small" style={{ backgroundColor: '#6366f1' }}>
                              {u.name?.charAt(0)?.toUpperCase()}
                           </Avatar>
                           {u.name}
                        </div>
                     </Select.Option>
                  ))}
               </Select>
            </div>
         </Modal>
      </div>
   );
};

export default Leads;