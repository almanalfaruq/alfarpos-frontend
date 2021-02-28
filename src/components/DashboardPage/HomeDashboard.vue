<template>
  <div class="wording-dasboard">
    <div class="header">
      <div class="body-text">
        <h1 class="text-sm-left">Hai {{ user.full_name }},</h1>
        <h4 class="text-sm-left">Yuk, Lihat laporan keuangan tokomu hari ini</h4>
      </div>
      <div class="body-image">
        <img src="~@/assets/girl_on_desk.png" class="img-girl" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeDashboard',
  computed: {
    user() {
      return this.$store.getters.userLoggedIn.user;
    },
  },
};
</script>


<style lang="scss" scoped>
.wording-dasboard {
  display: flex;
  flex-direction: column;
  width: 100%;
  .header {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    .body-text {
      margin-left: 5vw;
      font-family: 'Muli', sans-serif !important;
    }
    .body-image {
      justify-self: end;
      .img-girl {
        width: 500px;
      }
    }
  }
}
</style>
