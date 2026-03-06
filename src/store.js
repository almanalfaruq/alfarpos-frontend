import { jwtDecode } from 'jwt-decode';
import { createStore } from 'vuex';

export default createStore({
  state: {
    token: sessionStorage.getItem('token'),
  },
  getters: {
    token: state => state.token,
    userLoggedIn: state => {
      if (state.token === null) return null;
      try {
        return jwtDecode(state.token);
      } catch (error) {
        return null;
      }
    },
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {},
});
