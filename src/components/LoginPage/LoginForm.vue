<template>
  <div class="login-form">
    <h4 class="title">Masuk ke Akunmu</h4>
    <v-text-field
      v-model="username"
      ref="inputUsername"
      label="Username"
      class="input-text"
      :error="isLoginError"
      :error-messages="loginErrorMessage"
      :rules="[rules.required]"
      @keypress.enter="login"
    />
    <v-text-field
      v-model="password"
      ref="inputPassword"
      :append-icon="showPassword ? 'fa-eye' : 'fa-eye-slash'"
      :rules="[rules.required, rules.min]"
      :type="showPassword ? 'text' : 'password'"
      :error="isLoginError"
      :error-messages="loginErrorMessage"
      name="input-10-1"
      label="Password"
      hint="At least 8 characters"
      counter
      @click:append="showPassword = !showPassword"
      @keypress.enter="login"
      class="input-text"
    />
    <v-btn color="teal darken-1" min-width="350" dark @click="login">Masuk</v-btn>
  </div>
</template>

<script>
import config from '@/config';

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      isLoginError: false,
      loginErrorMessage: null,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 6 || 'Min 6 characters',
      },
    };
  },
  methods: {
    login() {
      this.isLoginError = false;
      this.loginErrorMessage = null;
      if (this.username === '' || this.username === null) {
        this.$refs.inputUsername.focus();
        return;
      }
      if (this.password === '' || this.password === null) {
        this.$refs.inputPassword.focus();
        return;
      }
      const url = config.apiURL.concat('/users/login');
      this.$http
        .post(url, {
          username: this.username,
          password: this.password,
        })
        .then(resp => {
          const { data } = resp;
          if (data.code === 200) {
            sessionStorage.setItem('token', data.data.token);
            this.$store.commit('setToken', data.data.token);
            this.$router.push('/dashboard');
          }
        })
        .catch(err => {
          const { data } = err.response;
          if (data.code === 401) {
            this.isLoginError = true;
            this.loginErrorMessage = 'Username atau Password salah';
          } else {
            this.isLoginError = true;
            this.loginErrorMessage = 'Server error';
          }
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
