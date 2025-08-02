<template>
  <div class="container mt-4">
    <h3 class="mb-4">📬 طلبات الاشتراك الجديدة</h3>

    <!-- ✅ شريط البحث -->
    <div class="row mb-3">
      <div class="col-md-6">
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="ابحث عن اسم أو رقم أو مشروع..."
        />
      </div>
      <div class="col-md-4">
        <select v-model="statusFilter" class="form-select">
          <option value="">كل الحالات</option>
          <option value="1">جديد</option>
          <option value="2">تم</option>
          <option value="3">مرفوض</option>
        </select>
      </div>
    </div>

    <!-- ✅ الجدول -->
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
        <tr
          v-for="(req, index) in paginatedRequests"
          :key="req.sr_id"
          :class="{
            'table-success': req.sr_status == 2,
            'table-danger': req.sr_status == 3,
            'table-warning': req.sr_status == 1,
          }"
        >
          <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
          <td>{{ req.sr_full_name }}</td>
          <td>{{ req.sr_phone }}</td>
          <td>{{ req.sr_project_name }}</td>
          <td>{{ req.sr_plan }}</td>
          <td>{{ req.sr_notes || "-" }}</td>
          <td>{{ formatDate(req.sr_created_at) }}</td>
          <td class="text-center align-middle">
            <select
              v-model="req.sr_status"
              class="form-select form-select-sm text-white fw-bold"
              :class="{
                'bg-warning': req.sr_status == 1,
                'bg-success': req.sr_status == 2,
                'bg-danger': req.sr_status == 3,
              }"
              @change="updateStatus(req.sr_id, req.sr_status)"
            >
              <option value="1">جديد</option>
              <option value="2">تم</option>
              <option value="3">مرفوض</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <nav v-if="totalPages > 1" class="mt-3">
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
          @click="currentPage--"
        >
          <a class="page-link">السابق</a>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
        >
          <a class="page-link">{{ page }}</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
          @click="currentPage++"
        >
          <a class="page-link">التالي</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  name: "NewSubscribe",
  inject: ["showToast"],
  data() {
    return {
      requests: [],
      search: "",
      statusFilter: "",
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    paginatedRequests() {
      const filtered = this.filteredRequests;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
    },
    filteredRequests() {
      return this.requests.filter((req) => {
        const matchSearch =
          req.sr_full_name.includes(this.search) ||
          req.sr_phone.includes(this.search) ||
          req.sr_project_name.includes(this.search);
        const matchStatus = this.statusFilter
          ? req.sr_status == this.statusFilter
          : true;
        return matchSearch && matchStatus;
      });
    },
  },
  methods: {
    async fetchRequests() {
      const res = await api.get("/admin/subscribe-requests");
      this.requests = res.data;
    },
    async updateStatus(id, status) {
      try {
        await api.put(`/admin/subscribe-requests/${id}`, { status });
        this.showToast("✅ تم تحديث الحالة بنجاح", "success");
      } catch (err) {
        this.showToast("❌ حدث خطأ أثناء تحديث الحالة ", "error");
        console.error(err);
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString("ar-EG");
    },
  },
  mounted() {
    this.fetchRequests();
  },
};
</script>
