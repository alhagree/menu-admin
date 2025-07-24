<template>
  <div class="sidebar">
    <h5 class="mb-4">لوحة التحكم</h5>
    <ul class="nav flex-column">
      <li class="nav-item mb-2" v-for="link in links" :key="link.name">
        <router-link :to="link.to" class="nav-link text-white">
          <i :class="link.icon"></i> {{ link.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AdminSidebar",
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
        { name: "مراقبة النظام", to: "/monitoring", icon: "bi bi-gear" },
      ],
    };
  },
};
</script>

<style scoped>
.sidebar {
  background-color: #212529; /* bg-dark */
  color: white;
  padding: 20px;
  width: 220px;
  height: 100vh;
}

.nav-link {
  color: white;
  font-weight: 500;
}

.nav-link:hover,
.router-link-exact-active {
  color: #0d6efd;
}
</style>
