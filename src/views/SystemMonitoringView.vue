<template>
  <div class="container mt-4">
    <h3 class="mb-4 text-center">📊 مراقبة النظام</h3>

    <!-- ✅ ImageKit Usage -->
    <div class="card mb-4 shadow-sm p-3">
      <h5 class="mb-3">📦 استخدام ImageKit</h5>
      <div v-if="imagekit">
        <p>
          المساحة المستخدمة:
          <strong
            >{{ (imagekit.usedStorage / 1024 / 1024).toFixed(2) }} MB</strong
          >
        </p>
        <p>
          عدد الملفات: <strong>{{ imagekit.fileCount }}</strong>
        </p>
      </div>
      <div v-else>جارِ التحميل...</div>
    </div>

    <!-- ✅ Vercel Projects -->
    <div class="card mb-4 shadow-sm p-3">
      <h5 class="mb-3">🚀 مشاريع Vercel</h5>
      <div class="row">
        <div
          class="col-md-6 mb-3"
          v-for="(label, key) in vercelLabels"
          :key="key"
        >
          <div class="border rounded p-2 bg-light">
            <h6>{{ label }}</h6>
            <div v-if="vercel[key]">
              <p>آخر نشر: {{ formatDate(vercel[key][0]?.createdAt) }}</p>
              <p>عدد النشرات: {{ vercel[key].length }}</p>
            </div>
            <div v-else>جارِ التحميل...</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Railway Projects -->
    <div class="card mb-4 shadow-sm p-3">
      <h5 class="mb-3">🛠️ خدمات Railway</h5>
      <div class="row">
        <div class="col-md-6" v-for="(label, key) in railwayLabels" :key="key">
          <div class="border rounded p-2 bg-light">
            <h6>{{ label }}</h6>
            <div v-if="railway[key]">
              <p>اسم المشروع: {{ railway[key].name }}</p>
              <p>عدد الخدمات: {{ railway[key].services?.length }}</p>
            </div>
            <div v-else>جارِ التحميل...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  name: "SystemMonitoringView",
  data() {
    return {
      imagekit: null,
      vercel: {
        tiklamu: null,
        client: null,
        agent: null,
        admin: null,
      },
      railway: {
        api: null,
        db: null,
      },
      vercelLabels: {
        tiklamu: "موقع TIKLAMU",
        client: "واجهة الزبون",
        agent: "لوحة العميل",
        admin: "لوحة الإدارة",
      },
      railwayLabels: {
        api: "خدمة الـ API",
        db: "قاعدة البيانات",
      },
    };
  },
  created() {
    this.loadImageKit();
    this.loadVercel();
    this.loadRailway();
  },
  methods: {
    async loadImageKit() {
      const res = await api.get("/admin/imagekit/usage");
      this.imagekit = res.data;
    },
    async loadVercel() {
      for (const key in this.vercel) {
        const res = await api.get(`/admin/imagekit/vercel/${key}`);
        this.vercel[key] = res.data.deployments || res.data || [];
      }
    },
    async loadRailway() {
      for (const key in this.railway) {
        const res = await api.get(`/admin/imagekit/railway/${key}`);
        this.railway[key] = res.data || {};
      }
    },
    formatDate(timestamp) {
      if (!timestamp) return "—";
      const date = new Date(timestamp);
      return date.toLocaleString("ar-EG");
    },
  },
};
</script>

<style scoped>
h5 {
  font-weight: bold;
}
</style>
