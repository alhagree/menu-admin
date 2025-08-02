<template>
  <div class="dashboard">
    <!-- البطاقات العلوية -->
    <div class="stats-grid">
      <div v-for="item in statItems" :key="item.key" class="stat-card">
        <div :class="['icon', item.color]">
          <i :class="['fa', item.icon]"></i>
        </div>
        <div class="content">
          <h4>{{ item.label }}</h4>
          <p>{{ animated[item.key] }}</p>
        </div>
      </div>
    </div>

    <div class="mb-4 d-flex justify-content-end">
      <select
        v-model="selectedClientId"
        class="form-select w-auto"
        @change="fetchChartOnly"
      >
        <option value="">📊 كل العملاء</option>
        <option
          v-for="client in clients"
          :key="client.cl_id"
          :value="client.cl_id"
        >
          {{ client.cl_name }}
        </option>
      </select>
    </div>

    <!-- الرسم البياني -->
    <div class="charts-area mt-5">
      <h5 class="text-center mb-3">عدد زيارات المنيو خلال الأسبوع</h5>
      <div v-if="loadingChart" class="text-center my-3">
        جاري تحميل البيانات...
      </div>
      <canvas id="clientsChart"></canvas>
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
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.bg-blue {
  background: #2f80ed;
}
.bg-green {
  background: #27ae60;
}
.bg-purple {
  background: #9b51e0;
}
.bg-orange {
  background: #f2994a;
}
.bg-gray {
  background: #7f8c8d;
}
.bg-darkblue {
  background: #34495e;
}
.bg-red {
  background: #e74c3c;
}

.bg-teal {
  background: #1abc9c;
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
</style>
