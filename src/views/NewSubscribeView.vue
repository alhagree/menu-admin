<!-- admin-dashboard/src/views/NewSubscribeView.vue -->
<template>
  <div class="container mt-4">
    <h3 class="mb-4">📬 طلبات الاشتراك الجديدة</h3>

    <table class="table table-hover">
      <thead class="table-light">
        <tr>
          <th>#</th>
          <th>الاسم الكامل</th>
          <th>رقم الهاتف</th>
          <th>اسم المشروع</th>
          <th>الخطة</th>
          <th>ملاحظات</th>
          <th>تاريخ الإرسال</th>
          <th>الحالة</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(req, index) in requests" :key="req.sr_id">
          <td>{{ index + 1 }}</td>
          <td>{{ req.sr_full_name }}</td>
          <td>{{ req.sr_phone }}</td>
          <td>{{ req.sr_project_name }}</td>
          <td>{{ req.sr_plan }}</td>
          <td>{{ req.sr_notes || "-" }}</td>
          <td>{{ formatDate(req.sr_created_at) }}</td>
          <td>{{ getStatusText(req.sr_status) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  name: "NewSubscribe",
  data() {
    return {
      requests: [],
    };
  },
  methods: {
    async fetchRequests() {
      const res = await api.get("/admin/subscribe-requests");
      this.requests = res.data;
    },
    async updateStatus(id, status) {
      await api.put(`/admin/subscribe-requests/${id}`, { status });
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString("ar-EG");
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return "جديد";
        case 2:
          return "تم";
        case 3:
          return "مرفوض";
        default:
          return "غير معروف";
      }
    },
  },
  mounted() {
    this.fetchRequests();
  },
};
</script>
