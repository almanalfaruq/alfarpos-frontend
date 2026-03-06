<template>
  <div class="wording-dasboard">
    <div class="header">
      <div class="body-text">
        <h1 class="text-sm-left">Hai {{ user.full_name }},</h1>
        <h4 class="text-sm-left">Yuk, Lihat laporan keuangan tokomu hari ini</h4>
      </div>
      <div class="body-image">
        <img src="@/assets/girl_on_desk.png" class="img-girl" />
      </div>
    </div>
    <v-menu v-model="dateMenu" :close-on-content-click="false" max-width="290">
        <template v-slot:activator="{ props }">
          <v-text-field
            :model-value="now"
            label="Pilih tanggal"
            readonly
            v-bind="props"
            class="date"
            full-width
            color="#3c7e8c"
          ></v-text-field>
        </template>
        <v-date-picker v-model="selectedDate" @update:model-value="onSelectDate" :max="maxDate"></v-date-picker>
      </v-menu>
    <v-container>
      <v-row>
        <v-col v-for="item in items" :key="item.title" cols="12" sm="6" md="4">
          <v-card
            :ripple="!!item.action"
            @click="item.action ? openDialogTransaction(item.action) : undefined"
            class="mx-auto fill-height"
            elevation="2"
          >
            <v-card-text class="d-flex flex-column h-100">
              <div class="text-subtitle-1 font-weight-bold mb-2">{{ item.title }}</div>
              <div class="text-h5 font-weight-bold text-primary mb-2">{{ item.value }}</div>
              <div class="text-caption text-medium-emphasis mt-auto" v-if="item.description">
                {{ item.description }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <shop-stats-chart />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <trending-products />
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
import TrendingProducts from './HomeDashboard/TrendingProducts.vue';
import ShopStatsChart from './HomeDashboard/ShopStatsChart.vue';

import moment from 'moment';

export default {
  name: 'HomeDashboard',
  components: { DialogTransaction, TrendingProducts, ShopStatsChart },
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
      return new Date();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.selectedDate = new Date();
      this.getShopStats();
    });
  },
  methods: {
    getShopStats() {
      const url = config.apiURL.concat('/stats');
      const axiosOptions = {
        headers: { Authorization: `Bearer ${this.$store.getters.token}` },
        params: {
          date: moment(this.selectedDate).format('YYYY-MM-DD'),
        },
      };
      this.$http
        .get(url, axiosOptions)
        .then(resp => {
          const { data } = resp;
          if (data.code === 200) {
            const obj = data.data;
            this.items[0].value = this.formatPrice(obj.gross_profit);
            this.items[1].value = this.formatPrice(obj.net_profit);
            this.items[2].value = `${obj.order_count} transaksi`;
            this.items[3].value = this.formatPrice(obj.sell_average);
            this.items[4].value = this.formatPrice(obj.money_in);
            this.items[5].value = this.formatPrice(obj.money_out);
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
    flex-wrap: wrap;
    .body-text {
      margin-left: 5vw;
      font-family: 'Muli', sans-serif !important;
      flex: 1;
      min-width: 300px;
    }
    .body-image {
      justify-self: end;
      .img-girl {
        width: 100%;
        max-width: 400px;
        height: auto;
      }
    }
  }
}

.date {
  width: 290px;
  max-width: 100%;
}

.date :deep(input) {
  color: #3c7e8c;
}

.card-detail {
  margin: 10px 0;
}

@media screen and (max-width: 800px) {
  .wording-dasboard {
    width: 100%;
    padding: 10px;
  }
  .body-image {
    display: none;
  }
}
</style>
