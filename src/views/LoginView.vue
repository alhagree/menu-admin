<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <h3 class="text-center mb-4">تسجيل الدخول</h3>
        <div class="card p-4">
          <div class="mb-3">
            <label>اسم المستخدم</label>
            <input v-model="username" class="form-control" type="text" />
          </div>
          <div class="mb-3">
            <label>كلمة المرور</label>
            <input v-model="password" class="form-control" type="password" />
          </div>
          <button
            @click="login"
            class="btn btn-primary w-100"
            :disabled="loading"
          >
            دخول
          </button>
          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../axios"; // ← مسار ملف axios.js المخصص

export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
      loading: false,
    };
  },
  methods: {
    login() {
      this.loading = true;
      api
        .post("/admin/login", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          this.$router.push("/");
        })
        .catch((err) => {
          this.error = err.response?.data?.message || "بيانات الدخول غير صحيحة";
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
