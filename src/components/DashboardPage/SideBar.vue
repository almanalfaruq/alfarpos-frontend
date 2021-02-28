<template>
  <v-card flat class="side-menu">
    <v-navigation-drawer permanent expand-on-hover color="#3C7E8C">
      <v-list nav dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="gotoRoute(item.route)"
          link
          class="menu-icon"
        >
          <v-list-item-icon>
            <v-icon color="white">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-white">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: 'Dashboard', icon: 'mdi-home-city', route: '/dashboard' },
        { title: 'Laporan', icon: 'fa-book' },
        { title: 'Produk', icon: 'fa-truck-moving', route: '/dashboard/product' },
        { title: 'Stok', icon: 'fa-warehouse' },
        { title: 'Admin Panel', icon: 'fa-users-cog' },
      ],
      mini: true,
    };
  },
  methods: {
    gotoRoute(route) {
      if (route === null || route === '') return;
      this.$router.push(route);
    },
  },
};
</script>


<style lang="scss" scoped>
.side-menu {
  border-radius: 0px;
}
.menu-avatar {
  padding: 20px 35px;
  .title-white {
    color: white;
    font-family: 'Muli', sans-serif !important;
  }
}
.menu-icon {
  padding: 20px 35px 20px 8px;
  .text-white {
    color: white;
    font-family: 'Muli', sans-serif !important;
  }
}
</style>