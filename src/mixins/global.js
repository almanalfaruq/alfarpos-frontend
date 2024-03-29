const moment = require('moment');

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
    formatPrice(price) {
      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(price);
    },
    formatDateFromResponse(date) {
      return moment(date, 'YYYY-MM-DD[T]HH:mm:ss.SSSSSSZZ').format('DD/MM/YYYY HH:mm:ss');
    },
  },
};
