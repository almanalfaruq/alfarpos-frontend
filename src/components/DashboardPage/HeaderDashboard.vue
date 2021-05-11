<template>
  <div>
    <v-toolbar flat class="header-cashier" color="#3C7E8C">
      <div class="flex-grow-1"></div>
      <v-toolbar-title class="text-cashier">
        <h4>{{ name }}</h4>
        <p class="address">{{ address }}</p>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon>
            <v-avatar v-on="on" class="avatar-icon">
              <img src="~@/assets/avatar.png" alt="avatar" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="item in items" @click="gotoRoute(item.route)" :key="item.title">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <span class="name-user">{{ user.full_name }}</span>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: 'HeaderNav',
  data() {
    return {
      name: 'Toko Alfar',
      address:
        'Alamat : Depan pasar, Desa RT.7/RW.1, Dusun I, Ketaon, Kec.Banyudono, Kabupaten Boyolali, Jawa Tengah 57373',
      items: [{ title: 'Keluar', route: '/logout' }],
    };
  },
  computed: {
    user() {
      return this.$store.getters.userLoggedIn.user;
    },
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
.header-cashier {
  text-align: center;
  border-bottom: 1px solid #ffffff;
}
.text-cashier {
  h4 {
    font-size: 16px;
    color: #ffffff;
    margin-top: 10px;
    font-family: 'Muli', sans-serif !important;
  }
  p {
    font-size: 12px;
    color: #ffffff;
    font-family: 'Muli', sans-serif !important;
  }
}
.name-user {
  color: #ffffff;
  font-size: 12px;
  font-family: 'Muli', sans-serif !important;
}
.avatar-icon {
  margin-left: -15px;
}

@media screen and (max-width: 800px) {
  .name-user {
    display: none;
  }
  .address {
    display: none;
  }
}
</style>
