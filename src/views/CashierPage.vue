<template>
  <div class="background">
    <header-nav />
  </div>
</template>

<script>
import HeaderNav from '@/components/CashierPage/HeaderNav.vue';

export default {
  name: 'CashierPage',
  components: {
    HeaderNav,
  },
};
</script>

<style lang="scss" scoped>
.background {
  height: 100vh;
  background-image: url('~@/assets/cashier-background.png');
}
</style>
