import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import axios from "../../api/axios";

const ForgotPassword = () => {

   const [resetLink, setResetLink] = useState("");

   const onFinish = (values) => {

      axios.post("/forgot-password", values)
         .then(res => {

            const link = `${window.location.origin}/reset-password/${res.data.token}`;
            setResetLink(link);

            message.success("Reset link generated");
         })
         .catch(() => message.error("User not found"));
   };

   return (
      <div style={{ maxWidth: 400, margin: "auto", marginTop: 80 }}>

         <h2>Forgot Password</h2>

         <Form onFinish={onFinish} layout="vertical">

            <Form.Item
               name="email"
               label="Email"
               rules={[{ required: true }]}
            >
               <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
               Generate Reset Link
            </Button>

         </Form>

         {resetLink && (
            <div style={{ marginTop: 20 }}>
               <p>Copy this link:</p>
               <Input value={resetLink} readOnly />
            </div>
         )}

      </div>
   );
};

export default ForgotPassword;
