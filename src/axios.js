import axios from "axios";
import router from "./router"; // عدل المسار حسب مشروعك

const api = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ أضف التوكن تلقائيًا إن وجد
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // تأكد من وجود Bearer
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ التعامل مع انتهاء الجلسة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ([401, 403].includes(status)) {
      // نحاول استخراج نوع المستخدم من التوكن
      const token = localStorage.getItem("token");
      let userType = "";

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userType = payload?.type;
        } catch (e) {
          // فشل قراءة نوع المستخدم
        }
      }

      alert("⛔ انتهت الجلسة، يرجى تسجيل الدخول مجددًا.");
      localStorage.removeItem("token");

      if (userType === "client") {
        router.push("/client-login");
      } else {
        router.push("/"); // افتراضيًا إلى تسجيل دخول الإدارة
      }
    }

    return Promise.reject(error);
  }
);

export default api;
