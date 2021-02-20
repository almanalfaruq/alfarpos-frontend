<template>
  <div>
    <header-dashboard />
    <div class="sidebar-content">
      <side-bar />
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderDashboard from '@/components/DashboardPage/HeaderDashboard.vue';
import SideBar from '@/components/DashboardPage/SideBar.vue';

export default {
  name: 'DashboardPage',
  components: {
    HeaderDashboard,
    SideBar,
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
