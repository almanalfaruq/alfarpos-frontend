<template>
  <div class="login-form">
    <h4 class="title">Masuk ke Akunmu</h4>
    <v-text-field v-model="username" label="Email" class="input-text" />
    <v-text-field
      v-model="password"
      :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
      :rules="[rules.required, rules.min]"
      :type="showPassword ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      hint="At least 8 characters"
      counter
      @click:append="showPassword = !showPassword"
      class="input-text"
    />
    <v-btn color="teal darken-1" min-width="350" dark @click="login">Masuk</v-btn>
  </div>
</template>

<script>
import Config from '@/config';

const axios = require('axios');

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 6 || 'Min 6 characters',
      },
    };
  },
  methods: {
    login() {
      axios
        .post(Config.apiUrl.concat('/api/users/login'), {
          username: this.username,
          password: this.password,
        })
        .then(response => {
          const { data } = response;
          localStorage.setItem('token', data.data);
          window.location = 'http://localhost:8080/cashier';
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  width: 50vw;
  background: #fafafa;
  position: absolute;
  right: 0;
  height: 100vh;
  align-items: center;
  justify-content: center;
  font-family: 'Muli', sans-serif !important;
  .title {
    color: #707070;
    font-family: 'Muli', sans-serif !important;
  }
  .input-text {
    margin: 15px;
    max-height: 60px;
    min-width: 350px;
    justify-self: center;
  }
}
</style>
