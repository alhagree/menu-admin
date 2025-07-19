<template>
  <div class="add-subscription-page">
    <h2>{{ isEdit ? "تعديل اشتراك" : "إضافة اشتراك" }}</h2>

    <form @submit.prevent="handleSubmit">
      <!-- اختيار العميل -->
      <div class="form-group">
        <label>اسم العميل</label>
        <select v-model="subscription.su_client_id" required>
          <option disabled value="">-- اختر العميل --</option>
          <option
            v-for="client in clients"
            :key="client.cl_id"
            :value="client.cl_id"
          >
            {{ client.cl_name }}
          </option>
        </select>
      </div>

      <!-- تاريخ البداية -->
      <div class="form-group">
        <label>تاريخ البداية</label>
        <input
          type="date"
          v-model="subscription.su_start_date"
          @change="updateEndDate"
          required
        />
      </div>

      <!-- مدة الاشتراك -->
      <div class="form-group">
        <label>مدة الاشتراك</label>
        <select v-model="subscriptionDuration" @change="updateEndDate" required>
          <option disabled value="">-- اختر المدة --</option>
          <option value="1">شهر</option>
          <option value="2">شهرين</option>
          <option value="6">6 أشهر</option>
          <option value="12">سنة</option>
          <option value="trial">تجريبي (7 أيام)</option>
        </select>
      </div>

      <!-- تاريخ الانتهاء -->
      <div class="form-group">
        <label>تاريخ الانتهاء</label>
        <input type="date" v-model="subscription.su_end_date" required />
      </div>

      <!-- الحالة -->
      <div class="form-group">
        <label>الحالة</label>
        <select v-model="subscription.su_status" required>
          <option value="active">فعال</option>
          <option value="inactive">غير فعال</option>
        </select>
      </div>

      <!-- رسالة الخطأ -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <button type="submit">
        {{ isEdit ? "حفظ التعديلات" : "إضافة الاشتراك" }}
      </button>
    </form>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  name: "AddSubscriptionView",
  data() {
    const today = new Date().toISOString().split("T")[0];
    return {
      subscription: {
        su_client_id: "",
        su_start_date: today,
        su_end_date: "",
        su_status: "active",
        su_type: "",
        su_duration: null,
      },
      subscriptionDuration: "",
      clients: [],
      isEdit: false,
      errorMessage: "",
    };
  },
  mounted() {
    this.fetchClients();
    const id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.fetchSubscription(id);
    }
  },
  methods: {
    updateEndDate() {
      if (!this.subscriptionDuration) return;
      const start = new Date(this.subscription.su_start_date);
      let end = new Date(start);

      if (this.subscriptionDuration === "trial") {
        end.setDate(end.getDate() + 7);
        this.subscription.su_type = "trial";
        this.subscription.su_duration = null;
      } else {
        const duration = parseInt(this.subscriptionDuration);
        end.setMonth(end.getMonth() + duration);
        this.subscription.su_type = "";
        this.subscription.su_duration = duration;
      }

      this.subscription.su_end_date = end.toISOString().split("T")[0];
    },

    async fetchClients() {
      try {
        const res = await api.get("/admin/clients");
        this.clients = res.data.filter((c) => c.cl_is_active === 1);
      } catch (err) {
        console.error("فشل تحميل العملاء:", err);

        // ✅ التعامل مع انتهاء الجلسة يدويًا
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("⛔ انتهت الجلسة. الرجاء تسجيل الدخول.");
          localStorage.removeItem("token");
          this.$router.push("/");
          return;
        }
      }
    },

    async fetchSubscription(id) {
      try {
        const res = await api.get(`/admin/subscriptions/${id}`);
        this.subscription = res.data;
        const start = new Date(res.data.su_start_date);
        const end = new Date(res.data.su_end_date);
        const diffDays = (end - start) / (1000 * 60 * 60 * 24);
        this.subscriptionDuration =
          diffDays === 7 ? "trial" : Math.round(diffDays / 30);
      } catch (err) {
        console.error("فشل تحميل الاشتراك:", err);
      }
    },

    async handleSubmit() {
      const id = this.$route.params.id;
      const url = this.isEdit
        ? `/admin/subscriptions/${id}`
        : `/admin/subscriptions`;

      try {
        if (this.isEdit) {
          await api.put(url, this.subscription);
        } else {
          await api.post(url, this.subscription);
        }
        this.$router.push("/subscriptions");
      } catch (err) {
        const message = err?.response?.data?.message || "فشل في حفظ الاشتراك";
        this.errorMessage = message;
      }
    },
  },
};
</script>

<style scoped>
.add-subscription-page {
  width: 100%;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
  .add-subscription-page {
    max-width: 800px;
    margin: auto;
  }
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  display: block;
  width: 100%;
  padding: 12px;
  background: #2f80ed;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #2562b3;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
}
</style>
