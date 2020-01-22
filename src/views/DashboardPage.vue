<template>
  <div>
    <header-dashboard />
    <div class="sidebar-content">
      <side-bar />
      <home-dashboard />
    </div>
  </div>
</template>

<script>
import HeaderDashboard from '@/components/DashboardPage/HeaderDashboard.vue';
import SideBar from '@/components/DashboardPage/SideBar.vue';
import HomeDashboard from '@/components/DashboardPage/HomeDashboard.vue';

export default {
  name: 'DashboardPage',
  components: {
    HeaderDashboard,
    SideBar,
    HomeDashboard,
  },
};
</script>

<style lang="scss" scoped>
.sidebar-content {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
}
</style>
