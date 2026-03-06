<template>
  <div>
    <v-toolbar color="teal darken-1" class="header-cashier">
      <div class="flex-grow-1"></div>
      <v-toolbar-title class="text-cashier">
        <h4>Toko Alfar</h4>
        <p>{{ address }}</p>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-menu offset-y>
        <template v-if="$vuetify.display.smAndUp" v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar class="avatar-icon">
              <img src="@/assets/avatar.png" alt="Fiha" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" :title="item.title" @click="gotoRoute(item.route)" link>
          </v-list-item>
        </v-list>
      </v-menu>
      <span class="name-user">Fiha Febiala</span>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: 'HeaderNav',
  data() {
    return {
      user: 'Fiha Febiala',
      address:
        'Alamat : Depan pasar, Desa RT.7/RW.1, Dusun I, Ketaon, Kec.Banyudono, Kabupaten Boyolali, Jawa Tengah 57373',
      items: [
        { title: 'Dashboard Keuangan', route: '/dashboard' },
        { title: 'Keluar', route: '/logout' },
      ],
    };
  },
  methods: {
    gotoRoute(route) {
      if (route === '/logout') {
        sessionStorage.removeItem('token');
        this.$store.commit('setToken', null);
        this.$router.push('/');
        return;
      }
      if (route) {
        this.$router.push(route);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-cashier {
  text-align: center;
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
</style>
