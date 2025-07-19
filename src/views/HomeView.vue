<template>
  <div class="dashboard">
    <!-- البطاقات العلوية -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="icon bg-blue"></div>
        <div class="content">
          <h4>عدد الأقسام</h4>
          <p>{{ stats.sections }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon bg-green"></div>
        <div class="content">
          <h4>عدد الأصناف</h4>
          <p>{{ stats.items }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon bg-purple"></div>
        <div class="content">
          <h4>زوار اليوم</h4>
          <p>{{ stats.visitors }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon bg-orange"></div>
        <div class="content">
          <h4>حالة الاشتراك</h4>
          <p>{{ stats.subscriptionStatus }}</p>
        </div>
      </div>
    </div>

    <!-- مساحة مخصصة للمخططات والوردجتات لاحقاً -->
    <div class="charts-area">
      <p>الرسم البياني والإعدادات تأتي هنا</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardView",
  data() {
    return {
      stats: {
        sections: 0,
        items: 0,
        visitors: 0,
        subscriptionStatus: "---",
      },
    };
  },
  mounted() {
    // عملية جلب البيانات تنفذ لاحقاً
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: #f9f9f9;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.stat-card {
  background: white;
  border-radius: 12px;
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 15px;
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
.content h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}
.content p {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  color: #111;
}
.charts-area {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  color: #888;
}
</style>
