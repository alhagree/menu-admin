// AdminLayout.vue
<template>
  <div class="admin-layout">
    <!-- ✅ الشريط الجانبي -->
    <AdminSidebar :isOpen="sidebarOpen" />

    <div class="admin-main">
      <!-- ✅ التوب بار -->
      <AdminTopbar />

      <!-- ✅ زر إظهار السايدبار في الموبايل -->
      <button
        class="toggle-sidebar-btn d-lg-none"
        @click="sidebarOpen = !sidebarOpen"
      >
        ☰
      </button>

      <!-- ✅ المحتوى -->
      <router-view />
    </div>
  </div>
</template>

<script>
import AdminSidebar from "./AdminSidebar.vue";
import AdminTopbar from "./AdminTopbar.vue";

export default {
  name: "AdminLayout",
  components: { AdminSidebar, AdminTopbar },
  data() {
    return {
      sidebarOpen: true,
    };
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-main {
  flex: 1;
  background: #f9f9f9;
  overflow-y: auto;
  margin-top: 60px; /* يعوض التوب بار الثابت */
  padding: 20px;
  padding-right: 220px;
}

/* ✅ زر إظهار الشريط الجانبي في الموبايل */
.toggle-sidebar-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  background: #0d6efd;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 1.2rem;
  z-index: 1100;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* ✅ إلغاء هوامش الـ sidebar في الموبايل */
@media (max-width: 960px) {
  .admin-main {
    padding-right: 0;
  }
}
</style>
