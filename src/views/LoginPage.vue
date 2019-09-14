<template>
  <div class="background">
    <login-form />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginPage/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    LoginForm,
  },
};
</script>

<style lang="scss" scoped>
.background {
  height: 100vh;
  background-image: url('~@/assets/login-background.png');
}
</style>
