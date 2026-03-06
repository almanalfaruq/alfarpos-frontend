<template>
  <v-layout>
    <header-dashboard />
    <side-bar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-layout>
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
/* No custom layout styles needed with Vuetify 3 Layout System */
</style>
