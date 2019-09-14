<template>
  <div>
    <v-toolbar color="teal darken-1" class="header-cashier">
      <div class="flex-grow-1"></div>
      <v-toolbar-title class="text-cashier">
        <h4>Toko Alfar</h4>
        <p>
          Alamat : Depan pasar, Desa RT.7/RW.1, Dusun I, Ketaon, Kec.
          Banyudono, Kabupaten Boyolali, Jawa Tengah 57373
        </p>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-btn icon>
          <v-icon color="white">fa-user</v-icon>
        </v-btn>
        <span class="name-user">Fiha Febiala</span>
      </template>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: 'HeaderNav',
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
  }
  p {
    font-size: 12px;
    color: #ffffff;
  }
}
.name-user {
  color: #ffffff;
}
</style>
