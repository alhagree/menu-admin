<template>
  <div class="container my-4">
    <h2 class="mb-4 text-center">🛠️ مراقبة النظام</h2>

    <!-- 🔹 Vercel Usage -->
    <div class="mb-5">
      <h4 class="mb-3">📦 استهلاك Vercel</h4>
      <div class="row">
        <div
          v-for="(usage, name) in vercelUsage"
          :key="name"
          class="col-md-6 mb-4"
        >
          <div class="card shadow-sm p-3 h-100">
            <h5 class="fw-bold text-primary text-capitalize">{{ name }}</h5>
            <p><strong>عدد مرات الطلب:</strong> {{ usage.requestCount }}</p>
            <p>
              <strong>حجم الترافيك:</strong> {{ formatBytes(usage.bandwidth) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 Railway Usage -->
    <div>
      <h4 class="mb-3">🚆 استهلاك Railway</h4>
      <div class="row">
        <div
          v-for="(data, name) in railwayUsage"
          :key="name"
          class="col-md-6 mb-4"
        >
          <div class="card shadow-sm p-3 h-100">
            <h5 class="fw-bold text-success text-capitalize">{{ name }}</h5>
            <p>
              <strong>اسم المشروع:</strong> {{ data.project?.name || "---" }}
            </p>
            <p><strong>المعرف:</strong> {{ data.project?.id || "---" }}</p>
            <p>
              <strong>الحالة:</strong>
              {{ data.project?.isUp ? "✅ يعمل" : "❌ متوقف" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/axios"; // أو المسار المناسب لك

export default {
  name: "SystemMonitoringView",
  data() {
    return {
      vercelProjects: ["tiklamu", "client", "agent", "admin"],
      railwayProjects: ["railway_api", "railway_db"],
      vercelUsage: {},
      railwayUsage: {},
    };
  },
  methods: {
    async fetchVercelUsage() {
      for (const name of this.vercelProjects) {
        try {
          const { data } = await api.get(`/api/admin/imagekit/vercel/${name}`);
          const stats = this.extractVercelStats(data);
          this.$set(this.vercelUsage, name, stats);
        } catch (err) {
          console.error(`Vercel (${name}) ❌`, err);
        }
      }
    },
    extractVercelStats(data) {
      let totalRequests = 0;
      let totalBytes = 0;
      if (Array.isArray(data)) {
        for (const d of data) {
          totalRequests += d.meta?.requestCount || 0;
          totalBytes += d.meta?.readyStateSize || 0;
        }
      }
      return {
        requestCount: totalRequests,
        bandwidth: totalBytes,
      };
    },
    async fetchRailwayUsage() {
      for (const name of this.railwayProjects) {
        try {
          const { data } = await api.get(`/api/admin/imagekit/railway/${name}`);
          this.$set(this.railwayUsage, name, data);
        } catch (err) {
          console.error(`Railway (${name}) ❌`, err);
        }
      }
    },
    formatBytes(bytes) {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },
  },
  mounted() {
    this.fetchVercelUsage();
    this.fetchRailwayUsage();
  },
};
</script>

<style scoped>
.card {
  border-right: 4px solid #ddd;
}
</style>
