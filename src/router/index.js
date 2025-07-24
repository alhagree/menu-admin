import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import AdminLayout from "../components/AdminLayout.vue";
import DashboardView from "../views/DashboardView.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: DashboardView,
      },
      {
        path: "clients",
        name: "Clients",
        component: () => import("../views/ClientsListView.vue"),
      },
      {
        path: "clients/add",
        name: "AddClient",
        component: () => import("../views/AddClientView.vue"),
      },
      {
        path: "clients/edit/:id",
        name: "EditClient",
        component: () => import("../views/AddClientView.vue"),
      },
      {
        path: "subscriptions",
        name: "Subscriptions",
        component: () => import("../views/SubscriptionsView.vue"),
      },
      {
        path: "subscriptions/add",
        name: "AddSubscription",
        component: () => import("../views/AddSubscriptionView.vue"),
      },
      {
        path: "subscriptions/edit/:id",
        name: "EditSubscription",
        component: () => import("../views/AddSubscriptionView.vue"),
      },
      {
        path: "visits",
        name: "Visits",
        component: () => import("../views/VisitsLogView.vue"),
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("../views/SettingsView.vue"),
      },
      {
        path: "monitoring",
        name: "SystemMonitoring",
        component: () => import("../views/SystemMonitoringView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
