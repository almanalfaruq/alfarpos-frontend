import Vue from 'vue';
import Vuex from 'vuex';

const jwt = require('jsonwebtoken');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem('token'),
  },
  getters: {
    token: state => state.token,
    userLoggedIn: state => {
      if (state.token === null) return null;
      return jwt.decode(state.token);
    },
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {},
});
