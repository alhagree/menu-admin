<template>
  <nav class="navbar navbar-light bg-light px-4">
    <span class="navbar-brand">أهلاً بك 👋</span>
    <button class="btn btn-outline-danger btn-sm" @click="logout">
      تسجيل الخروج
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
