// AdminSidebar.vue
<template>
  <div :class="['admin-sidebar', { 'sidebar-hidden': !isOpen }]">
    <h5 class="sidebar-title">لوحة التحكم</h5>
    <ul class="custom-sidebar-list">
      <li class="nav-item" v-for="link in links" :key="link.name">
        <router-link
          :to="link.to"
          class="nav-link"
          exact-active-class="active-link"
        >
          <i :class="link.icon" class="icon-right"></i>
          <span class="link-text">{{ link.name }}</span>
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
        {
          name: "طلبات الاشتراك",
          to: "/new-subscribe",
          icon: "bi-person-lines-fill",
        },
      ],
    };
  },
};
</script>

<style scoped>
.admin-sidebar {
  background-color: #343a40;
  color: white;
  padding: 5px 10px 10px 10px; /* تقليل البادينغ العلوي */
  width: 220px;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 50px;
  overflow-y: auto;
  transition: transform 0.3s ease-in-out;
  z-index: 1002;
}

/* إخفاء في الموبايل */
.sidebar-hidden {
  transform: translateX(100%);
}

/* عنوان القائمة */
.sidebar-title {
  font-size: 1rem;
  margin-bottom: 10px; /* أقل */
  margin-top: 5px;
  color: #ffffffcc;
  font-weight: bold;
}

/* الروابط */
.nav-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 12px;
  text-decoration: none;
  color: #ffffffcc;
  border-radius: 5px;
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: #0d6efd;
  color: white !important;
}

.icon-right {
  margin-left: 10px; /* يضيف فراغ بين الأيقونة والنص */
  font-size: 1.2rem;
}

.link-text {
  flex: 1;
  text-align: center;
}

.active-link {
  background-color: #0d6efd;
  color: #fff !important;
  font-weight: bold;
  box-shadow: 0 0 5px rgba(13, 110, 253, 0.6);
}

/* حل مشكلة الفراغ فوق القائمة */
.nav.flex-column {
  margin-top: 0 !important;
}

.custom-sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.custom-sidebar-list .nav-item {
  margin-bottom: 4px; /* مسافة صغيرة بين العناصر */
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  color: #ffffffcc;
  border-radius: 5px;
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: #0d6efd;
  color: white !important;
}

.active-link {
  background-color: #0d6efd;
  color: white !important;
  font-weight: bold;
}
</style>
