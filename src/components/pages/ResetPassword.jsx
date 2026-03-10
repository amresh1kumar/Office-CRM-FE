import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import axios from "../../api/axios";

const ResetPassword = () => {

   const { token } = useParams();
   const navigate = useNavigate();

   const onFinish = (values) => {

      axios.post(`/reset-password/${token}`, values)
         .then(() => {
            message.success("Password reset successful");
            navigate("/");
         })
         .catch(() => message.error("Invalid or expired link"));
   };

   return (
      <div style={{ maxWidth: 400, margin: "auto", marginTop: 80 }}>

         <h2>Reset Password</h2>

         <Form onFinish={onFinish} layout="vertical">

            <Form.Item
               name="password"
               label="New Password"
               rules={[{ required: true }]}
            >
               <Input.Password />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
               Reset Password
            </Button>

         </Form>

      </div>
   );
};

export default ResetPassword;
