<template>
  <div class="dashboard container mt-4">
    <!-- ✅ عنوان الصفحة -->
    <h2 class="mb-4 fw-bold">لوحة التحكم الرئيسية</h2>

    <!-- ✅ عدادات عامة -->
    <div class="row g-3 mb-4">
      <div
        v-for="item in statItems"
        :key="item.key"
        class="col-md-4 col-lg-3 col-sm-6 mb-4"
      >
        <div class="card stat-card text-center shadow-sm border-0">
          <div
            class="card-body d-flex flex-column justify-content-center align-items-center"
          >
            <div :class="['icon-circle', item.color]">
              <i :class="['fa', item.icon, 'text-white']"></i>
            </div>
            <h6 class="text-muted mt-3">{{ item.label }}</h6>
            <h3 class="fw-bold text-dark">{{ animated[item.key] }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ اختيار العميل -->
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h5 class="mb-0">📊 إحصائيات الزيارات اليومية</h5>
      <select
        v-model="selectedClientId"
        class="form-select w-auto"
        style="min-width: 250px"
      >
        <option value="">📍 جميع العملاء</option>
        <option
          v-for="client in clients"
          :key="client.cl_id"
          :value="client.cl_id"
        >
          {{ client.cl_name }}
        </option>
      </select>
    </div>

    <!-- ✅ الرسم البياني -->
    <div
      class="card shadow-sm p-3"
      style="min-height: 350px; position: relative"
    >
      <canvas id="clientsChart" style="height: 300px"></canvas>

      <div v-if="loadingChart" class="overlay-loader">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import api from "@/axios";

export default {
  name: "DashboardView",
  data() {
    return {
      selectedClientId: "",
      loadingChart: false,
      stats: {
        totalClients: 0,
        activeClients: 0,
        inactiveClients: 0,
        activeSubscriptions: 0,
        trialSubscriptions: 0,
        firstSubscriptions: 0,
        renewSubscriptions: 0,
        totalSubscribeRequests: 0,
        newSubscribeRequests: 0,
        clients: [],
        chartInstance: null,
        visitsPerDay: {
          days: [],
          counts: [],
        },
      },
      animated: {
        totalClients: 0,
        activeClients: 0,
        inactiveClients: 0,
        activeSubscriptions: 0,
        trialSubscriptions: 0,
        firstSubscriptions: 0,
        renewSubscriptions: 0,
        totalSubscribeRequests: 0,
        newSubscribeRequests: 0,
      },
      statItems: [
        {
          key: "totalClients",
          label: "عدد العملاء",
          color: "bg-blue",
          icon: "fa-users",
        },
        {
          key: "activeClients",
          label: "العملاء الفعّالين",
          color: "bg-green",
          icon: "fa-user-check",
        },
        {
          key: "inactiveClients",
          label: "العملاء غير الفعّالين",
          color: "bg-purple",
          icon: "fa-user-slash",
        },
        {
          key: "activeSubscriptions",
          label: "الاشتراكات الفعّالة",
          color: "bg-orange",
          icon: "fa-clipboard-check",
        },
        {
          key: "trialSubscriptions",
          label: "الاشتراكات التجريبية",
          color: "bg-gray",
          icon: "fa-rocket",
        },
        {
          key: "firstSubscriptions",
          label: "أول اشتراك",
          color: "bg-darkblue",
          icon: "fa-star",
        },
        {
          key: "renewSubscriptions",
          label: "اشتراكات التجديد",
          color: "bg-red",
          icon: "fa-redo",
        },
        {
          key: "totalSubscribeRequests",
          label: "عدد طلبات الاشتراك",
          color: "bg-dark",
          icon: "fa-file-alt",
        },
        {
          key: "newSubscribeRequests",
          label: "طلبات جديدة",
          color: "bg-danger",
          icon: "fa-bell",
        },
      ],
    };
  },
  mounted() {
    this.fetchClients();
    this.fetchStats(); // ← تُنفذ مرة واحدة فقط عند تحميل الصفحة
  },
  watch: {
    selectedClientId(newId) {
      this.fetchChartOnly(newId);
    },
  },
  methods: {
    async fetchClients() {
      try {
        const res = await api.get("/admin/clients");
        this.clients = res.data;
      } catch (err) {
        console.error("خطأ في جلب العملاء:", err);
      }
    },

    async fetchStats() {
      this.loadingChart = true;
      try {
        const res = await api.get("/admin/dashboard"); // بدون clientId
        const data = res.data;
        this.stats = data;
        this.animateStats();

        await this.fetchChartOnly(); // ← استدعاء داخلي لجلب الرسم البياني العام
      } catch (err) {
        console.error("Dashboard error:", err.message || err);
      }
      this.loadingChart = false;
    },

    async fetchChartOnly(clientId = "") {
      this.loadingChart = true;
      try {
        const res = await api.get("/admin/visits", {
          params: clientId ? { clientId } : {},
        });

        const chartData = res.data || {};

        if (
          Array.isArray(chartData.days) &&
          Array.isArray(chartData.counts) &&
          chartData.days.length === chartData.counts.length
        ) {
          this.renderChart(chartData);
        } else {
          if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
          }
          console.warn("⚠️ البيانات غير صالحة للرسم البياني");
        }
      } catch (err) {
        console.error("خطأ في الرسم البياني:", err.message || err);
      }
      this.loadingChart = false;
    },
    renderChart(dayData) {
      const ctx = document.getElementById("clientsChart").getContext("2d");
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      this.chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: dayData.days,
          datasets: [
            {
              label: "عدد الزيارات",
              data: dayData.counts,
              borderColor: "#2f80ed",
              backgroundColor: "rgba(47, 128, 237, 0.2)",
              tension: 0.3,
              fill: true,
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
        },
      });
    },

    animateStats() {
      const duration = 1000;
      const frameRate = 30;
      const steps = duration / frameRate;

      for (const key in this.stats) {
        if (typeof this.stats[key] === "number") {
          const target = this.stats[key];
          let current = 0;
          const increment = target / steps;
          const interval = setInterval(() => {
            current += increment;
            this.animated[key] = Math.floor(current);
            if (current >= target) {
              this.animated[key] = target;
              clearInterval(interval);
            }
          }, frameRate);
        }
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 30px;
  background: #f4f6f8;
  min-height: 100vh;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: #fff;
  border-radius: 16px;
  min-height: 140px;
  transition: 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-blue {
  background-color: #2f80ed;
}
.bg-green {
  background-color: #27ae60;
}
.bg-purple {
  background-color: #9b51e0;
}
.bg-orange {
  background-color: #f2994a;
}
.bg-gray {
  background-color: #7f8c8d;
}
.bg-red {
  background-color: #eb5757;
}
.bg-darkblue {
  background-color: #34495e;
}
.bg-dark {
  background-color: #2c3e50;
}
.bg-danger {
  background-color: #e74c3c;
}

.content h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.content p {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #111;
}

.charts-area {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
}

.charts-area canvas {
  width: 100% !important;
  height: 280px !important; /* ✅ تصغير المخطط */
}

.overlay-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
</style>
