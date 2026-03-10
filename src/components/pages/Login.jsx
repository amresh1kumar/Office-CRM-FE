// import { useContext, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import axios from "../../api/axios";
// import { Form, Input, Button, message, Checkbox } from "antd";
// import logo from './ChatGPT Image Feb 22, 2026, 03_32_09 PM.png'

// const Login = () => {
//    const { login } = useContext(AuthContext);
//    const navigate = useNavigate();
//    const [isRegister, setIsRegister] = useState(false);

//    const onFinish = async (values) => {
//       try {
//          if (isRegister) {
//             await axios.post("/register", values);
//             message.success("Registration submitted.Wait for admin approval.");
//             setIsRegister(false);
//          } else {
//             const res = await axios.post("/login", values);
//             login(res.data);
//             message.success("Login successful");
//             navigate("/dashboard");
//          }
//       } catch (error) {
//          message.error(error.response?.data?.message || "Something went wrong");
//       }
//    };

//    return (
//       <div className="h-screen flex bg-gradient-to-r from-blue-50 to-gray-100">

//          {/* LEFT BRAND PANEL */}
//          <div className="hidden md:block w-1/2 relative overflow-hidden">

//             <svg
//                className="absolute left-0 top-0 h-full w-full"
//                viewBox="0 0 550 800"
//                preserveAspectRatio="none"
//             >
//                <path
//                   d="M0,0 
//                   L450,0 
//                   C350,200 550,350 450,600 
//                   C400,720 250,800 0,800 
//                   Z"
//                   fill="url(#brandGradient)"
//                />
//                <defs>
//                   <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="1">
//                      <stop offset="0%" stopColor="#1e3a8a" />
//                      <stop offset="100%" stopColor="#0f172a" />
//                   </linearGradient>
//                </defs>
//             </svg>

//             <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-100">

//                <h1 className="text-5xl font-bold mb-4 tracking-wide">
//                   Mahesh Ventures
//                </h1>

//                <p className="text-lg opacity-90 mb-2">
//                   Smart CRM Dashboard
//                </p>

//                <p className="text-sm opacity-70 max-w-xs">
//                   Manage leads, customers and sales with a powerful and modern CRM platform.
//                </p>
//             </div>
//          </div>

//          {/* RIGHT FORM PANEL */}
//          <div className="flex w-full md:w-1/2 items-center justify-center">
//             <div className="w-full max-w-md px-10 py-10 bg-white rounded-2xl shadow-2xl ">

//                {/* LARGE LOGO */}
//                <div className="flex justify-center mb-0">
//                   <img
//                      src={logo}
//                      alt="Mahesh Ventures"
//                      className="w-44 h-44 object-contain drop-shadow-2xl"
//                   />
//                </div>

//                {/* <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
//                   {isRegister ? "Create Account" : "Welcome Back"}
//                </h2> */}
//                <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
//                   {isRegister ? "Sign Up to C.R.M" : "Sign In to C.R.M"}
//                </h2>

//                <Form layout="vertical" onFinish={onFinish}>

//                   {isRegister && (
//                      <Form.Item
//                         name="name"
//                         rules={[{ required: true, message: "Enter your name" }]}
//                      >
//                         <Input size="large" placeholder="Full Name" />
//                      </Form.Item>
//                   )}

//                   <Form.Item
//                      name="email"
//                      rules={[{ required: true, message: "Enter your email" }]}
//                   >
//                      <Input size="large" placeholder="Email Address" />
//                   </Form.Item>

//                   <Form.Item
//                      name="password"
//                      rules={[{ required: true, message: "Enter your password" }]}
//                   >
//                      <Input.Password size="large" placeholder="Password" />
//                   </Form.Item>

//                   {!isRegister && (
//                      <div className="flex justify-between items-center mb-4">
//                         <Checkbox className="text-sm">
//                            Remember me
//                         </Checkbox>

//                         <span
//                            className="text-blue-900 cursor-pointer text-sm"
//                            onClick={() => navigate("/forgot-password")}
//                         >
//                            Forgot Password?
//                         </span>
//                      </div>
//                   )}

//                   <Button
//                      htmlType="submit"
//                      block
//                      size="large"
//                      className="!bg-blue-900 hover:!bg-blue-800 !text-white !border-none rounded-full"
//                   >
//                      {isRegister ? "SIGN UP" : "LOG IN"}
//                   </Button>
//                </Form>

//                <div className="text-center mt-6 text-sm">
//                   {isRegister ? (
//                      <>
//                         Already have an account?{" "}
//                         <span
//                            className="text-blue-900 cursor-pointer font-medium"
//                            onClick={() => setIsRegister(false)}
//                         >
//                            Sign In
//                         </span>
//                      </>
//                   ) : (
//                      <>
//                         Don’t have an account?{" "}
//                         <span
//                            className="text-blue-900 cursor-pointer font-medium"
//                            onClick={() => setIsRegister(true)}
//                         >
//                            Sign Up
//                         </span>
//                      </>
//                   )}
//                </div>

//             </div>
//          </div>
//       </div>
//    );
// };

// export default Login;

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { Form, Input, Button, message, Checkbox } from "antd";
import logo from "./image.png";
import crmBg from "./crm.png";

const Login = () => {
   const { login } = useContext(AuthContext);
   const navigate = useNavigate();
   const [isRegister, setIsRegister] = useState(false);

   const onFinish = async (values) => {
      try {
         if (isRegister) {
            await axios.post("/register", values);
            message.success("Registration submitted.Wait for admin approval.");
            setIsRegister(false);
         } else {
            const res = await axios.post("/login", values);
            login(res.data);
            message.success("Login successful");
            navigate("/dashboard");
         }
      } catch (error) {
         message.error(error.response?.data?.message || "Something went wrong");
      }
   };

   return (
      <div className="h-screen flex bg-gradient-to-r from-blue-50 to-gray-100">

         {/* LEFT IMAGE PANEL */}
         <div
            className="hidden md:flex w-1/2 relative items-center justify-center bg-cover bg-center"
            style={{
               backgroundImage: `url(${crmBg})`,
               clipPath:
                  "polygon(0 0, 85% 0, 100% 25%, 90% 60%, 100% 100%, 0 100%)"
            }}
         >

            {/* overlay */}
            <div className="absolute inset-0 bg-blue-900/40"></div>

            <div className="relative text-white text-center px-10">
               <h1 className="text-5xl font-bold mb-4 tracking-wide">
                  SP Advertising
               </h1>

               <p className="text-lg opacity-90 mb-2">
                  Smart CRM Dashboard
               </p>

               <p className="text-sm opacity-80 max-w-xs mx-auto">
                  Manage leads, customers and sales with a powerful and modern CRM platform.
               </p>
            </div>
         </div>

         {/* RIGHT FORM PANEL */}
         <div className="flex w-full md:w-1/2 items-center justify-center">
            <div className="w-full max-w-md px-10 py-10 bg-white rounded-2xl shadow-2xl">

               {/* LOGO */}
               <div className="flex justify-center">
                  <img
                     src={logo}
                     alt="Mahesh Ventures"
                     className="w-40 h-40 object-contain drop-shadow-xl"
                  />
               </div>

               <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
                  {isRegister ? "Sign Up to C.R.M" : "Sign In to C.R.M"}
               </h2>

               <Form layout="vertical" onFinish={onFinish}>

                  {isRegister && (
                     <Form.Item
                        name="name"
                        rules={[{ required: true, message: "Enter your name" }]}
                     >
                        <Input size="large" placeholder="Full Name" />
                     </Form.Item>
                  )}

                  <Form.Item
                     name="email"
                     rules={[{ required: true, message: "Enter your email" }]}
                  >
                     <Input size="large" placeholder="Email Address" />
                  </Form.Item>

                  <Form.Item
                     name="password"
                     rules={[{ required: true, message: "Enter your password" }]}
                  >
                     <Input.Password size="large" placeholder="Password" />
                  </Form.Item>

                  {!isRegister && (
                     <div className="flex justify-between items-center mb-4">
                        <Checkbox className="text-sm">
                           Remember me
                        </Checkbox>

                        <span
                           className="text-blue-900 cursor-pointer text-sm"
                           onClick={() => navigate("/forgot-password")}
                        >
                           Forgot Password?
                        </span>
                     </div>
                  )}

                  <Button
                     htmlType="submit"
                     block
                     size="large"
                     className="!bg-blue-900 hover:!bg-blue-800 !text-white !border-none rounded-full"
                  >
                     {isRegister ? "SIGN UP" : "LOG IN"}
                  </Button>
               </Form>

               <div className="text-center mt-6 text-sm">
                  {isRegister ? (
                     <>
                        Already have an account?{" "}
                        <span
                           className="text-blue-900 cursor-pointer font-medium"
                           onClick={() => setIsRegister(false)}
                        >
                           Sign In
                        </span>
                     </>
                  ) : (
                     <>
                        Don’t have an account?{" "}
                        <span
                           className="text-blue-900 cursor-pointer font-medium"
                           onClick={() => setIsRegister(true)}
                        >
                           Sign Up
                        </span>
                     </>
                  )}
               </div>

            </div>
         </div>

      </div>
   );
};

export default Login;