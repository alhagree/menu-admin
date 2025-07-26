// AdminTopbar.vue
<template>
  <nav class="admin-navbar">
    <span class="welcome-text">👋 أهلاً بك في لوحة التحكم</span>
    <button class="logout-btn" @click="logout">
      <i class="bi bi-box-arrow-right"></i> تسجيل الخروج
    </button>
  </nav>
</template>

<script>
export default {
  name: "AdminTopbar",
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.admin-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 60px;
  background-color: #fff;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 0.9rem;
  border-radius: 4px;
  transition: 0.2s ease;
}

.logout-btn:hover {
  background-color: #c82333;
}
</style>
