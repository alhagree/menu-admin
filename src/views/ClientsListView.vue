// ClientsListView.vue
<template>
  <div class="clients-page">
    <div class="header">
      <h2>إدارة العملاء</h2>
      <button class="add-btn" @click="$router.push('/clients/add')">
        ➕ إضافة عميل
      </button>
    </div>

    <!-- فلاتر -->
    <div class="filters">
      <input v-model="searchQuery" placeholder="🔍 ابحث عن اسم العميل" />
      <select v-model="statusFilter">
        <option value="">جميع الحالات</option>
        <option value="1">نشط</option>
        <option value="0">معطل</option>
      </select>
      <select v-model.number="rowsPerPage">
        <option :value="5">5 أسطر</option>
        <option :value="10">10 أسطر</option>
        <option :value="20">20 سطر</option>
      </select>
    </div>

    <!-- الجدول -->
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>الاسم التجاري</th>
          <th>اسم العميل</th>
          <th>الإيميل</th>
          <th>الهاتف</th>
          <th>تاريخ الإضافة</th>
          <th>الحالة</th>
          <th>إجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(client, index) in paginatedClients"
          :key="client.cl_id"
          :class="{ inactiveRow: client.cl_is_active === 0 }"
        >
          <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
          <td>{{ client.cl_name }}</td>
          <td>{{ client.cl_fullname }}</td>
          <td>{{ client.cl_email }}</td>
          <td>{{ client.cl_phone }}</td>
          <td>{{ formatDate(client.cl_created_at) }}</td>
          <td>
            <span :class="client.cl_is_active ? 'active' : 'inactive'">
              {{ client.cl_is_active ? "نشط" : "معطل" }}
            </span>
          </td>
          <td class="actions">
            <button @click="editClient(client.cl_id)">✏️</button>
            <button @click="toggleStatus(client.cl_id, client.cl_is_active)">
              {{ client.cl_is_active ? "تعطيل" : "تفعيل" }}
            </button>
            <button @click="deleteClient(client.cl_id)">🗑️</button>
          </td>
        </tr>
        <tr v-if="paginatedClients.length === 0">
          <td colspan="7" class="no-data">لا توجد نتائج لعرضها</td>
        </tr>
      </tbody>
    </table>

    <!-- التصفح -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">⏮</button>
      <span>صفحة {{ currentPage }} من {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">
        ⏭
      </button>
    </div>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  name: "ClientsListView",
  data() {
    return {
      clients: [],
      searchQuery: "",
      statusFilter: "",
      currentPage: 1,
      rowsPerPage: 10,
    };
  },
  computed: {
    filteredClients() {
      if (!Array.isArray(this.clients)) return [];
      return this.clients
        .filter((client) =>
          `${client.cl_name} ${client.cl_fullname}`
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        )
        .filter((client) =>
          this.statusFilter === ""
            ? true
            : client.cl_is_active === Number(this.statusFilter)
        );
    },
    paginatedClients() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      return this.filteredClients.slice(start, start + this.rowsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredClients.length / this.rowsPerPage) || 1;
    },
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    async fetchClients() {
      try {
        const res = await api.get("/admin/clients");
        // تحقق من الصيغة: هل هي Array أم فيها رسالة انتهاء جلسة
        if (!Array.isArray(res.data)) {
          const msg = res.data?.message?.toLowerCase?.() || "";

          if (msg.includes("session") || msg.includes("unauthorized")) {
            alert("⛔ انتهت الجلسة. سيتم تسجيل الخروج.");
            localStorage.removeItem("token");
            this.$router.push("/");
            return;
          }

          console.log("🟡 التوكن من الواجهة:", localStorage.getItem("token"));

          console.warn("⚠️ استجابة غير صالحة:", res.data);
          throw new Error("الاستجابة غير صالحة");
        }

        this.clients = res.data;
      } catch (err) {
        console.error("❌ خطأ أثناء تحميل العملاء:", err.message);
        this.clients = [];
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("ar-EG");
    },
    editClient(id) {
      this.$router.push(`/clients/edit/${id}`);
    },
    async toggleStatus(id, isActive) {
      const endpoint = isActive ? "disable" : "enable";
      try {
        await api.put(`/admin/clients/${endpoint}/${id}`);
        this.fetchClients();
      } catch (err) {
        console.error("فشل في تغيير حالة العميل:", err);
      }
    },
    async deleteClient(id) {
      if (confirm("هل أنت متأكد من حذف العميل؟")) {
        try {
          await api.delete(`/admin/clients/${id}`);
          this.fetchClients();
        } catch (err) {
          console.error("فشل الحذف:", err);
        }
      }
    },
  },
};
</script>

<style scoped>
.clients-page {
  padding: 30px;
  background: #f9f9f9;
  min-height: 100vh;
  overflow-x: auto;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.add-btn {
  padding: 8px 16px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
.add-btn:hover {
  background-color: #27ae60;
}
.filters {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}
.filters input,
.filters select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 200px;
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
  border-bottom: 1px solid #eee;
  text-align: center;
}
th {
  background-color: #f1f1f1;
}
.actions button {
  margin: 0 3px;
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
}
.actions button:hover {
  opacity: 0.9;
}
.active {
  color: green;
  font-weight: bold;
}
.inactive {
  color: red;
  font-weight: bold;
}
.inactiveRow {
  background-color: #ffe5e5;
}
.no-data {
  text-align: center;
  padding: 20px;
  color: #999;
  font-weight: bold;
}
.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}
.pagination button {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background-color: #2980b9;
  color: white;
  cursor: pointer;
}
.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
