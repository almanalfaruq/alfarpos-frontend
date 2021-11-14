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
    <v-menu v-model="dateMenu" :close-on-content-click="false" max-width="290">
      <template v-slot:activator="{ on, attrs }" style="flex: unset">
        <v-text-field
          :value="now"
          label="Pilih tanggal"
          readonly
          v-bind="attrs"
          v-on="on"
          class="date"
          full-width
          color="#3c7e8c"
        ></v-text-field>
      </template>
      <v-date-picker v-model="selectedDate" @change="onSelectDate" :max="maxDate"></v-date-picker>
    </v-menu>
    <v-container>
      <v-row>
        <v-col v-for="item in items" :key="item.title">
          <v-card
            v-if="item.action"
            @click.stop="openDialogTransaction(item.action)"
            class="mx-auto"
            width="320"
            max-width="340"
          >
            <v-card-text>
              <div>{{ item.title }}</div>
              <p class="display-1 text--primary">{{ item.value }}</p>
              <div class="text--secondary" v-if="item.description">
                {{ item.description }}
              </div>
            </v-card-text>
          </v-card>
          <v-card v-else class="mx-auto" width="320" max-width="340">
            <v-card-text>
              <div>{{ item.title }}</div>
              <p class="display-1 text--primary">{{ item.value }}</p>
              <div class="text--secondary" v-if="item.description">
                {{ item.description }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog scrollable v-model="dialogTransaction" max-width="600">
      <dialog-transaction @close-dialog="closeDialog" :type="type" :date="selectedDate" />
    </v-dialog>
  </div>
</template>

<script>
import config from '@/config';

import DialogTransaction from './HomeDashboard/DialogTransaction.vue';

const moment = require('moment');

export default {
  name: 'HomeDashboard',
  components: { DialogTransaction },
  data() {
    return {
      dialogTransaction: false,
      type: 0,
      items: [
        { title: 'Keuntungan Kotor', value: 'Rp 0,00' },
        {
          title: 'Keuntungan Bersih',
          value: 'Rp 0,00',
          description:
            'Dijumlahkan dari harga beli. Apabila harga beli kosong, maka tidak dijumlahkan.',
        },
        { title: 'Jumlah Transaksi', value: '0 transaksi' },
        { title: 'Rata-rata penjualan per transaksi', value: 'Rp 0,00' },
        { title: 'Uang Masuk', value: 'Rp 0,00', action: 'money-in' },
        { title: 'Uang Keluar', value: 'Rp 0,00', action: 'money-out' },
      ],
      selectedDate: null,
      dateMenu: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.userLoggedIn.user;
    },
    now() {
      let date = moment();
      if (this.selectedDate) {
        date = moment(this.selectedDate)
          .locale('id')
          .format('dddd, Do MMMM YYYY');
      } else {
        date = moment()
          .locale('id')
          .format('dddd, Do MMMM YYYY');
      }
      return date;
    },
    maxDate() {
      return moment().format('YYYY-MM-DD');
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.selectedDate = this.maxDate;
      this.getShopStats();
    });
  },
  methods: {
    getShopStats() {
      const url = config.apiURL.concat('/stats');
      const axiosOptions = {
        headers: { Authorization: `Bearer ${this.$store.getters.token}` },
        params: {
          date: this.selectedDate,
        },
      };
      this.$http
        .get(url, axiosOptions)
        .then(resp => {
          const { data } = resp;
          if (data.code === 200) {
            const obj = data.data;
            this.$set(this.items[0], 'value', this.formatPrice(obj.gross_profit));
            this.$set(this.items[1], 'value', this.formatPrice(obj.net_profit));
            this.$set(this.items[2], 'value', `${obj.order_count} transaksi`);
            this.$set(this.items[3], 'value', this.formatPrice(obj.sell_average));
            this.$set(this.items[4], 'value', this.formatPrice(obj.money_in));
            this.$set(this.items[5], 'value', this.formatPrice(obj.money_out));
          }
        })
        .catch(err => {
          const { data } = err.response;
          if (data.code === 404) {
            console.log('Data tidak ditemukan');
          } else {
            console.log('Server error');
          }
        });
    },
    onSelectDate() {
      this.dateMenu = false;
      this.getShopStats();
    },
    openDialogTransaction(action) {
      switch (action) {
        case 'money-in':
          this.type = 1;
          break;
        default:
          this.type = -1;
          break;
      }
      this.dialogTransaction = true;
    },
    closeDialog() {
      this.type = 0;
      this.dialogTransaction = false;
    },
  },
};
</script>


<style lang="scss" scoped>
.wording-dasboard {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  font-family: 'Muli', sans-serif !important;
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
  &::v-deep .v-input {
    flex: unset;
  }
}

.date >>> input {
  color: #3c7e8c;
}

.card-detail {
  margin: 10px 0;
}

@media screen and (max-width: 800px) {
  .wording-dasboard {
    width: 85%;
  }
  .body-image {
    display: none;
  }
  .container {
    overflow-y: scroll;
  }
}
</style>
