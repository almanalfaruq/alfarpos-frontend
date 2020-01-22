<template>
  <div>
    <v-toolbar flat class="header-cashier" color="#3C7E8C">
      <div class="flex-grow-1"></div>
      <v-toolbar-title class="text-cashier">
        <h4>Toko Alfar</h4>
        <p>{{ address }}</p>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-menu offset-y>
        <template v-if="$vuetify.breakpoint.smAndUp" v-slot:activator="{ on }">
          <v-btn icon>
            <v-avatar v-on="on" class="avatar-icon">
              <img src="~@/assets/avatar.png" alt="Fiha" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
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
      items: [{ title: 'Halaman Kasir' }, { title: 'Keluar' }],
    };
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
</style>
