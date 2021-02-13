export default {
  created() {
    this.transferSessionStorage();
  },
  methods: {
    transferSessionStorage() {
      if (!sessionStorage.length) {
        // Ask other tabs for session storage
        localStorage.setItem('getSessionStorage', Date.now());
      }
      window.addEventListener('storage', event => {
        if (event.key === 'getSessionStorage') {
          // Some tab asked for the sessionStorage -> send it

          localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
          localStorage.removeItem('sessionStorage');
        } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
          // sessionStorage is empty -> fill it

          const data = JSON.parse(event.newValue);

          Object.keys(data).forEach(key => {
            sessionStorage.setItem(key, data[key]);
          });
        }
      });
    },
  },
};