// AdminSidebar.vue
<template>
  <div :class="['admin-sidebar', { 'sidebar-hidden': !isOpen }]">
    <h5 class="sidebar-title">لوحة التحكم</h5>
    <ul class="nav flex-column">
      <li class="nav-item" v-for="link in links" :key="link.name">
        <router-link
          :to="link.to"
          class="nav-link"
          active-class="active-link"
          :exact="link.to === '/'"
        >
          <i :class="link.icon" class="me-2"></i> {{ link.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AdminSidebar",
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      links: [
        { name: "الرئيسية", to: "/", icon: "bi bi-house-door" },
        { name: "العملاء", to: "/clients", icon: "bi bi-people" },
        { name: "إضافة عميل", to: "/clients/add", icon: "bi bi-person-plus" },
        {
          name: "الاشتراكات",
          to: "/subscriptions",
          icon: "bi bi-clock-history",
        },
        { name: "سجل الزوار", to: "/visits", icon: "bi bi-eye" },
        { name: "الإعدادات", to: "/settings", icon: "bi bi-gear" },
        { name: "مراقبة النظام", to: "/monitoring", icon: "bi bi-display" },
      ],
    };
  },
};
</script>

<style scoped>
.admin-sidebar {
  background-color: #343a40;
  color: white;
  padding: 20px;
  width: 220px;
  height: 100vh;
  position: fixed;
  right: 0;
  bottom: 50px; /* قبل الـ Footer */
  overflow-y: auto;
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
}

/* إخفاء في الموبايل */
.sidebar-hidden {
  transform: translateX(100%);
}

/* عنوان القائمة */
.sidebar-title {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #ffffffcc;
  font-weight: bold;
}

/* الروابط */
.nav-link {
  color: #ffffffcc;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 5px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: #0d6efd;
  color: white !important;
}

.active-link {
  background-color: #0d6efd;
  color: white !important;
}
</style>
