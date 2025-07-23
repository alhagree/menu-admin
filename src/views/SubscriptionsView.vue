<template>
  <div class="subscriptions-page">
    <div class="header">
      <h2>إدارة الاشتراكات</h2>
      <button class="btn-add" @click="$router.push('/subscriptions/add')">
        ➕ إضافة اشتراك
      </button>
    </div>

    <!-- 🔍 الفلاتر -->
    <div class="filters">
      <input
        v-model="searchQuery"
        placeholder="🔍 ابحث عن اسم العميل"
        type="text"
      />
      <select v-model="filterStatus">
        <option value="all">جميع الحالات</option>
        <option value="valid">سارية</option>
        <option value="expired">منتهية</option>
      </select>
      <select v-model.number="rowsPerPage">
        <option :value="5">5 أسطر</option>
        <option :value="10">10 أسطر</option>
        <option :value="20">20 سطر</option>
      </select>
    </div>
    <!-- 🔍 الفلاتر -->

    <!-- الجدول -->
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>العميل</th>
          <th>الهاتف</th>
          <th>الحالة</th>
          <th>نوع الاشتراك</th>
          <th>باقة الاشتراك</th>
          <th>المدة</th>
          <th>تاريخ البداية</th>
          <th>تاريخ الانتهاء</th>
          <th>الصلاحية</th>
          <th>إجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(sub, index) in paginatedData"
          :key="sub.su_id"
          :class="{ expired: isExpired(sub.su_end_date) }"
        >
          <td>{{ startIndex + index + 1 }}</td>
          <td>{{ sub.cl_name }}</td>
          <td>{{ sub.cl_phone }}</td>
          <td>
            <span :class="sub.su_status === 'active' ? 'active' : 'inactive'">
              {{ sub.su_status === "active" ? "فعال" : "غير فعال" }}
            </span>
          </td>
          <td>
            {{
              sub.su_type === "first"
                ? "أول اشتراك"
                : sub.su_type === "trial"
                ? "تجريبي"
                : "تجديد"
            }}
          </td>
          <td>{{ sub.la_name || "—" }}</td>
          <td>
            <span v-if="sub.su_type === 'trial'">تجريبي (7 أيام)</span>
            <span v-else>
              {{ sub.su_duration }}
              {{ sub.su_duration == 1 ? "شهر" : "أشهر" }}
            </span>
          </td>
          <td>{{ formatDate(sub.su_start_date) }}</td>
          <td>{{ formatDate(sub.su_end_date) }}</td>
          <td>
            <span :class="isExpired(sub.su_end_date) ? 'inactive' : 'active'">
              {{ isExpired(sub.su_end_date) ? "منتهية" : "سارية" }}
            </span>
          </td>
          <td class="actions">
            <button @click="editSubscription(sub.su_id)">✏️</button>
            <button class="btn-danger" @click="deleteSubscription(sub.su_id)">
              🗑️
            </button>
            <button @click="showUserInfo(sub.su_client_id)">👁️</button>
          </td>
        </tr>
        <tr v-if="paginatedData.length === 0">
          <td colspan="10" class="no-data">لا توجد نتائج لعرضها</td>
        </tr>
      </tbody>
    </table>

    <!-- 📄 صفحات -->
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
import api from "@/axios"; // استيراد Axios المخصص

export default {
  name: "SubscriptionsView",
  data() {
    return {
      subscriptions: [],
      currentPage: 1,
      rowsPerPage: 10,
      filterStatus: "all",
      searchQuery: "",
    };
  },
  computed: {
    filteredSubscriptions() {
      const now = new Date();
      return Array.isArray(this.subscriptions)
        ? this.subscriptions.filter((sub) => {
            const matchesStatus =
              this.filterStatus === "all"
                ? true
                : this.filterStatus === "expired"
                ? new Date(sub.su_end_date) < now
                : new Date(sub.su_end_date) >= now;

            const matchesSearch = sub.cl_name
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase());

            return matchesStatus && matchesSearch;
          })
        : [];
    },
    totalPages() {
      return Math.ceil(this.filteredSubscriptions.length / this.rowsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.rowsPerPage;
    },
    paginatedData() {
      return this.filteredSubscriptions.slice(
        this.startIndex,
        this.startIndex + this.rowsPerPage
      );
    },
  },
  mounted() {
    this.fetchSubscriptions();
  },
  methods: {
    async fetchSubscriptions() {
      try {
        const res = await api.get("/admin/subscriptions");
        const data = res.data;
        this.subscriptions = Array.isArray(data)
          ? data
          : Array.isArray(data.subscriptions)
          ? data.subscriptions
          : [];
      } catch (err) {
        console.error("فشل في جلب الاشتراكات:", err);
      }
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("ar-EG");
    },
    isExpired(endDateStr) {
      return new Date(endDateStr) < new Date();
    },
    editSubscription(id) {
      this.$router.push(`/subscriptions/edit/${id}`);
    },
    async deleteSubscription(id) {
      if (confirm("هل أنت متأكد من حذف الاشتراك؟")) {
        try {
          await api.delete(`/admin/subscriptions/${id}`);
          this.fetchSubscriptions();
        } catch (err) {
          console.error("فشل الحذف:", err);
        }
      }
    },
    async showUserInfo(clientId) {
      try {
        const res = await api.get(`/admin/users/by-client/${clientId}`);
        const user = res.data;
        alert(
          `🔐 اسم المستخدم: ${user.us_username}\n🔑 كلمة المرور: ${user.us_password}\n🔗 الرابط: ${user.us_link_code}`
        );
      } catch {
        alert("❌ لا توجد بيانات دخول لهذا العميل.");
      }
    },
  },
};
</script>

<style scoped>
.subscriptions-page {
  padding: 30px;
  background: #f9f9f9;
  min-height: 100vh;
  overflow-x: auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.btn-add {
  background-color: #27ae60;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
.filters {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  overflow-x: auto;
}
.filters input,
.filters select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1;
  max-width: 250px;
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
.btn-danger {
  background-color: #e74c3c !important;
}
.active {
  color: green;
  font-weight: bold;
}
.inactive {
  color: red;
  font-weight: bold;
}
.expired {
  background-color: #fff0f0;
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
