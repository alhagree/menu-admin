<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <AdminTopbar />
      <!-- ✅ شريط علوي جديد -->
      <router-view />
    </main>
  </div>
</template>

<script>
import AdminSidebar from "./AdminSidebar.vue";
import AdminTopbar from "./AdminTopbar.vue"; // ✅ استدعاء المكون

export default {
  name: "AdminLayout",
  components: {
    AdminSidebar,
    AdminTopbar, // ✅ تسجيله ضمن components
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.admin-main {
  flex: 1;
  background: #f9f9f9;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

nav.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
