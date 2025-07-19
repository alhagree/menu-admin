<template>
  <div class="visits-log-page">
    <h2>سجل الزوار</h2>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>اسم العميل</th>
          <th>IP</th>
          <th>المتصفح</th>
          <th>الوقت</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(visit, index) in visits" :key="visit.vs_id">
          <td>{{ index + 1 }}</td>
          <td>{{ visit.client_name }}</td>
          <td>{{ visit.vs_ip_address }}</td>
          <td>{{ visit.vs_user_agent }}</td>
          <td>{{ formatDateTime(visit.vs_visit_time) }}</td>
        </tr>
        <tr v-if="visits.length === 0">
          <td colspan="5" class="no-data">لا توجد زيارات لعرضها</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  name: "VisitsLogView",
  data() {
    return {
      visits: [],
    };
  },
  mounted() {
    this.fetchVisits();
  },
  methods: {
    async fetchVisits() {
      try {
        const res = await api.get("/admin/visits");
        this.visits = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error("فشل في تحميل الزيارات:", err);
      }
    },
    formatDateTime(datetime) {
      return new Date(datetime).toLocaleString("ar-EG");
    },
  },
};
</script>

<style scoped>
.visits-log-page {
  padding: 30px;
  background: #f9f9f9;
}
table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
}
th,
td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #eee;
}
th {
  background-color: #f1f1f1;
}
.no-data {
  padding: 20px;
  color: #999;
}
</style>
