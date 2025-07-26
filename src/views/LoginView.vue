<!-- views/AdminLoginView.vue -->
<template>
  <div class="container mt-5 text-center" style="max-width: 500px">
    <!-- الشعار -->
    <img
      :src="logoUrl + '?v=' + cacheBuster"
      alt="Tiklamu Logo"
      class="mb-4"
      style="max-height: 200px"
    />

    <!-- عنوان النظام -->
    <h2 class="mb-2">نظام ادارة منيو الكتروني</h2>
    <h4 class="mb-4 text-muted">تسجيل دخول الإدارة</h4>

    <!-- نموذج تسجيل الدخول -->
    <div class="card p-4 shadow-sm">
      <div class="form-group mb-3 text-start">
        <label>اسم المستخدم</label>
        <input type="text" class="form-control" v-model="username" />
      </div>

      <div class="form-group mb-3 text-start">
        <label>كلمة المرور</label>
        <input type="password" class="form-control" v-model="password" />
      </div>

      <button class="btn btn-primary w-100" @click="login" :disabled="loading">
        تسجيل الدخول
      </button>
    </div>

    <!-- ⚠️ رسالة الخطأ -->
    <div v-if="errorMessage" class="centered-container mt-3">
      <p class="error-message" :style="{ color: errorColor }">
        {{ errorMessage }}
      </p>
      <img class="failed-image" :src="errorImage" alt="خطأ" />
    </div>
  </div>
</template>

<script>
import api from "../axios";

export default {
  name: "AdminLoginView",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      errorType: null,
      loading: false,
      logoUrl:
        "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/logo.png",
      cacheBuster: Date.now(), // لتحديث الشعار دائمًا
      failedImageUrl:
        "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/failed.png",
      errorImages: {
        invalid_credentials:
          "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/failed.png",
        admin_inactive:
          "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/inactive.png",
        unknown_error:
          "https://ik.imagekit.io/idbeilkk4/menu_project/defulat_image/expired.png",
      },
      errorColors: {
        invalid_credentials: "#6c757d",
        admin_inactive: "#FF971E",
        unknown_error: "#dc3545",
      },
    };
  },
  computed: {
    errorImage() {
      return this.errorImages[this.errorType] || this.failedImageUrl;
    },
    errorColor() {
      return this.errorColors[this.errorType] || "#dc3545";
    },
  },
  methods: {
    async login() {
      this.errorMessage = "";
      this.errorType = null;
      this.loading = true;

      try {
        const response = await api.post("/admin/login", {
          username: this.username,
          password: this.password,
        });

        localStorage.setItem("token", response.data.token);
        this.$router.push("/");
      } catch (err) {
        this.errorMessage = err.response?.data?.message || "فشل تسجيل الدخول";
        this.errorType = err.response?.data?.error_code || "unknown_error";
        console.error("❌ Admin Login Error:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
