<template>
  <v-card flat class="side-menu">
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent color="#3C7E8C">
      <v-list-item class="menu-avatar">
        <v-list-item-avatar>
          <v-img src="~@/assets/avatar.png"></v-img>
        </v-list-item-avatar>

        <v-list-item-title class="title-white">Toko Alfar</v-list-item-title>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon color="white">mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link class="menu-icon">
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
        { title: 'Dashboard', icon: 'mdi-home-city' },
        { title: 'Reports', icon: 'fa-book' },
        { title: 'Product', icon: 'fa-truck-moving' },
        { title: 'Stock', icon: 'fa-warehouse' },
        { title: 'Admin Panel', icon: 'fa-users-cog' },
      ],
      mini: true,
    };
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
  padding: 20px 35px;
  .text-white {
    color: white;
    font-family: 'Muli', sans-serif !important;
  }
}
</style>