import axios from "axios";

const instance = axios.create({
   baseURL: process.env.REACT_APP_API_URL
});

instance.interceptors.request.use((config) => {
   const token = localStorage.getItem("token");

   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }

   return config;
});

// 🔥 Auto logout on 401/403
// instance.interceptors.response.use(
//    (response) => response,
//    (error) => {
//       if (error.response?.status === 401 || error.response?.status === 403) {
//          localStorage.removeItem("token");
//          localStorage.removeItem("user");
//          window.location.href = "/";
//       }
//       return Promise.reject(error);
//    }
// );

export default instance;