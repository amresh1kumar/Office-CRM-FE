import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
   Card,
   Tag,
   Form,
   Input,
   Button,
   DatePicker,
   Table,
   message,
   Row,
   Col,
   Timeline,
   Spin
} from "antd";
import {
   UserOutlined,
   CheckCircleOutlined,
   SyncOutlined,
   ClockCircleOutlined,
   EditOutlined
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import dayjs from "dayjs";

const LeadDetails = () => {

   const { id } = useParams();

   const [lead, setLead] = useState(null);
   const [followups, setFollowups] = useState([]);
   const [activities, setActivities] = useState([]);

   const [loading, setLoading] = useState(false);
   const [tableLoading, setTableLoading] = useState(false);
   const [timelineLoading, setTimelineLoading] = useState(true);

   const [form] = Form.useForm();


   const getTimelineIcon = (action) => {

      if (action.includes("Created"))
         return <UserOutlined style={{ color: "#1890ff" }} />;

      if (action.includes("Assigned"))
         return <SyncOutlined style={{ color: "#722ed1" }} />;

      if (action.includes("Follow-up"))
         return <ClockCircleOutlined style={{ color: "#fa8c16" }} />;

      if (action.includes("Converted"))
         return <CheckCircleOutlined style={{ color: "#52c41a" }} />;

      if (action.includes("Updated"))
         return <EditOutlined style={{ color: "#13c2c2" }} />;

      return <UserOutlined />;
   };

   const statusColors = {
      "New": "blue",
      "Contacted": "orange",
      "Qualified": "purple",
      "Proposal Sent": "cyan",
      "Closed Won": "green",
      "Closed Lost": "red"
   };

   // ---------------- FETCH LEAD ----------------
   const fetchLead = () => {
      axios.get(`/leads/${id}`)
         .then(res => setLead(res.data))
         .catch(err => console.log(err));
   };

   // ---------------- FETCH FOLLOWUPS ----------------
   const fetchFollowups = () => {
      setTableLoading(true);

      axios.get(`/followups/${id}`)
         .then(res => setFollowups(res.data))
         .catch(err => console.log(err))
         .finally(() => setTableLoading(false));
   };

   // ---------------- FETCH ACTIVITIES ----------------
   const fetchActivities = () => {
      setTimelineLoading(true);

      axios.get(`/leads/${id}/activities`)
         .then(res => setActivities(res.data))
         .catch(err => console.log(err))
         .finally(() => setTimelineLoading(false));
   };

   useEffect(() => {
      fetchLead();
      fetchFollowups();
      fetchActivities();
   }, [id]);

   // ---------------- ADD FOLLOWUP ----------------
   const handleAddFollowup = (values) => {

      setLoading(true);

      axios.post("/followups", {
         lead_id: id,
         note: values.note,
         next_followup_date: values.next_followup_date.format("YYYY-MM-DD")
      })
         .then(() => {
            form.resetFields();
            fetchFollowups();
            fetchActivities(); // refresh timeline
            message.success("Follow-up added successfully!");
         })
         .catch(() => {
            message.error("Failed to add follow-up");
         })
         .finally(() => {
            setLoading(false);
         });
   };

   // ---------------- LEAD TABLE COLUMNS ----------------
   const leadColumns = [
      {
         title: "Name",
         dataIndex: "name",
      },
      {
         title: "Email",
         dataIndex: "email",
      },
      {
         title: "Phone",
         dataIndex: "phone",
      },
      {
         title: "Source",
         dataIndex: "source",
      },
      {
         title: "Status",
         dataIndex: "status",
         render: (status) => (
            <Tag color={statusColors[status]}>
               {status}
            </Tag>
         ),
      },
   ];

   // ---------------- FOLLOWUP TABLE COLUMNS ----------------
   const followupColumns = [
      {
         title: "#",
         key: "index",
         width: 50,
         align: "center",
         render: (_, __, index) => index + 1,
      },
      {
         title: "Created By",
         dataIndex: "created_by_name",
         width: 140,
      },
      {
         title: "Note",
         dataIndex: "note",
         render: (note) => (
            <div className="whitespace-pre-wrap break-words">
               {note}
            </div>
         ),
      },
      {
         title: "Next Follow-up",
         dataIndex: "next_followup_date",
         width: 200,
         render: (date) => {

            const today = dayjs().startOf("day");
            const followupDate = dayjs(date);

            let tag = null;

            if (followupDate.isBefore(today)) {
               tag = <Tag color="red">Overdue</Tag>;
            } else if (followupDate.isSame(today, "day")) {
               tag = <Tag color="orange">Today</Tag>;
            } else {
               tag = <Tag color="green">Upcoming</Tag>;
            }

            return (
               <div className="flex items-center gap-2">
                  <span>{followupDate.format("DD MMM YYYY")}</span>
                  {tag}
               </div>
            );
         },
      },
      {
         title: "Created At",
         dataIndex: "created_at",
         width: 150,
         render: (date) =>
            dayjs(date).format("DD MMM YYYY HH:mm"),
      },
   ];

   // ---------------- ROW COLOR ----------------
   const getRowClassName = (record) => {
      const today = dayjs().startOf("day");
      const followupDate = dayjs(record.next_followup_date);

      if (followupDate.isBefore(today))
         return "bg-red-50 hover:bg-red-100";

      if (followupDate.isSame(today, "day"))
         return "bg-yellow-50 hover:bg-yellow-100";

      return "";
   };

   if (!lead)
      return (
         <div className="flex justify-center items-center h-60">
            <Spin size="large" />
         </div>
      );

   return (
      <div className="space-y-4">

         {/* ---------------- LEAD INFORMATION ---------------- */}
         <Card title="Lead Information">
            <Table
               dataSource={[lead]}
               columns={leadColumns}
               rowKey="id"
               pagination={false}
               size="middle"
               scroll={{ x: 600 }}
            />
         </Card>

         {/* ---------------- ADD FOLLOW-UP ---------------- */}
         <Card title="Add Follow-up">
            <Form
               form={form}
               onFinish={handleAddFollowup}
               layout="vertical"
            >
               <Row gutter={16} align="bottom">

                  <Col xs={24} md={14}>
                     <Form.Item
                        name="note"
                        label="Note"
                        rules={[
                           { required: true, message: "Please enter note" }
                        ]}
                     >
                        <Input.TextArea
                           rows={2}
                           placeholder="Enter follow-up note..."
                        />
                     </Form.Item>
                  </Col>

                  <Col xs={24} md={5}>
                     <Form.Item
                        name="next_followup_date"
                        label="Next Follow-up Date"
                        rules={[
                           { required: true, message: "Please select date" }
                        ]}
                     >
                        <DatePicker className="w-full" />
                     </Form.Item>
                  </Col>

                  <Col xs={24} md={5}>
                     <Form.Item>
                        <Button
                           type="primary"
                           htmlType="submit"
                           loading={loading}
                           icon={<PlusOutlined />}
                           className="w-full"
                        >
                           Add Follow-up
                        </Button>
                     </Form.Item>
                  </Col>

               </Row>
            </Form>
         </Card>

         {/* ---------------- FOLLOW-UP HISTORY ---------------- */}
         <Card title="Follow-up History">
            <Table
               dataSource={followups}
               columns={followupColumns}
               rowKey="id"
               loading={tableLoading}
               rowClassName={getRowClassName}
               pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) =>
                     `Total ${total} follow-ups`
               }}
               size="middle"
               scroll={{ x: 700 }}
            />
         </Card>

         {/* ---------------- ACTIVITY TIMELINE ---------------- */}
         <Card title="Activity Timeline">
            {timelineLoading ? (
               <div className="py-6 text-center">
                  <Spin />
               </div>
            ) : activities.length === 0 ? (
               <div className="py-6 text-center text-gray-500">
                  No activity yet
               </div>
            ) : (
               <Timeline mode="left">

                  {activities.map(item => (

                     <Timeline.Item
                        key={item.id}
                        dot={getTimelineIcon(item.action)}
                     >

                        <div className="font-semibold text-gray-800">
                           {item.action}
                        </div>

                        <div className="text-sm text-gray-500">
                           {item.user_name || "System"} •{" "}
                           {dayjs(item.created_at).format("DD MMM YYYY HH:mm")}
                        </div>

                     </Timeline.Item>

                  ))}

               </Timeline>
            )}
         </Card>
      </div>
   );
};

export default LeadDetails;