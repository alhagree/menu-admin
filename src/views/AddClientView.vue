<template>
  <div class="add-client-page">
    <h2>{{ isEdit ? "تعديل عميل" : "إضافة عميل" }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>الاسم</label>
        <input type="text" v-model="client.cl_name" required />
      </div>

      <div class="form-group">
        <label>الإيميل</label>
        <input type="email" v-model="client.cl_email" />
      </div>

      <div class="form-group">
        <label>الهاتف</label>
        <input type="text" v-model="client.cl_phone" />
      </div>

      <button type="submit">
        {{ isEdit ? "حفظ التعديلات" : "إضافة" }}
      </button>
    </form>
  </div>
</template>

<script>
import api from "@/axios";

export default {
  name: "AddClientView",
  data() {
    return {
      client: {
        cl_name: "",
        cl_email: "",
        cl_phone: "",
      },
      isEdit: false,
    };
  },
  mounted() {
    const id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.fetchClient(id);
    }
  },
  methods: {
    async fetchClient(id) {
      try {
        const res = await api.get(`/admin/clients/${id}`);
        this.client = res.data;
      } catch (err) {
        alert("❌ فشل في جلب بيانات العميل");
        console.error(err);
      }
    },
    async handleSubmit() {
      const id = this.$route.params.id;
      const url = this.isEdit ? `/admin/clients/${id}` : `/admin/clients`;

      try {
        if (this.isEdit) {
          await api.put(url, this.client);
        } else {
          await api.post(url, this.client);
        }
        this.$router.push("/clients");
      } catch (err) {
        alert("❌ لم تتم العملية: " + err.message);
      }
    },
  },
};
</script>
