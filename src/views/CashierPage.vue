<template>
  <div class="background">
    <header-nav />
    <v-container class="order-detail">
      <h4 class="font-weight-bold">{{ now }}</h4>
    </v-container>
    <table-cashier
      @update-total="updateTotal"
      @open-finish-dialog="openDialog"
      @update-is-focus-on-input="updateIsFocusOnInput"
      ref="tableCashier"
    />
    <div class="bottom-bar">
      <div class="text-total">
        <p class="text-sm-left">Total</p>
        <h1 class="text-xl-left">{{ totalPrice }}</h1>
      </div>
      <div class="text-right btn-buy">
        <v-btn color="teal darken-1" :disabled="total === 0" @click.stop="openDialog">Bayar</v-btn>
      </div>
    </div>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <template v-if="indexDialog === 0">
          <v-card-title class="headline">Uang yang diterima</v-card-title>
          <v-col cols="12" sm="12" md="12">
            <v-text-field
              label="Solo"
              placeholder="Rp 50.000"
              v-model="amountPaid"
              autofocus
              solo
              flat
              outlined
              :rules="[rules.number, rules.isSufficent]"
              type="number"
              @keydown.enter="openDialogChange"
              @keydown.esc.prevent="dialog = false"
            ></v-text-field>
          </v-col>
          <v-card-actions>
            <div class="flex-grow-1"></div>

            <v-btn color="green darken-1" text @click="openDialogChange" :disabled="isANumber">Bayar</v-btn>
          </v-card-actions>
        </template>
        <template v-else>
          <v-card-title class="headline text-center">Kembalian</v-card-title>
          <h2 class="text-center">{{ cashChange }}</h2>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="green darken-1" text @click="dialog = false">Tutup</v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import HeaderNav from '@/components/CashierPage/HeaderNav.vue';
import TableCashier from '@/components/CashierPage/TableCashier.vue';

const moment = require('moment');

export default {
  name: 'CashierPage',
  components: {
    HeaderNav,
    TableCashier,
  },
  data() {
    return {
      total: 0,
      dialog: false,
      indexDialog: 0,
      amountPaid: '',
      isFocusOnInput: true,
      rules: {
        number: value => !Number.isNaN(Number(value)) || 'Harus berupa angka',
        isSufficent: value => value >= this.total || 'Uang belum cukup',
      },
    };
  },
  watch: {
    dialog(value) {
      if (!value && this.indexDialog !== 0) {
        this.indexDialog = 0;
        this.total = 0;
        this.amountPaid = '';
        this.clearAllProduct();
      } else if (!value && this.indexDialog === 0) {
        this.focusInputTable();
      }
    },
  },
  computed: {
    isANumber() {
      if (this.amountPaid === '') return true;
      return Number.isNaN(Number(this.amountPaid));
    },
    cashChange() {
      const change = this.amountPaid - this.total;
      return this.formatPrice(change);
    },
    totalPrice() {
      return this.formatPrice(this.total);
    },
    now() {
      return moment()
        .locale('id')
        .format('dddd, Do MMMM YYYY');
    },
  },
  methods: {
    openDialog() {
      if (this.total === 0) return;
      this.dialog = true;
      this.isFocusOnInput = false;
    },
    openDialogChange() {
      if (!this.isANumber) this.indexDialog += 1;
    },
    updateTotal(total) {
      this.total = total;
    },
    formatPrice(number) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    },
    clearAllProduct() {
      this.$refs.tableCashier.clearAllProduct();
    },
    updateIsFocusOnInput(isFocus) {
      this.isFocusOnInput = isFocus;
    },
    focusInputTable() {
      if (this.isFocusOnInput) return;
      this.$nextTick(() => {
        this.$refs.tableCashier.focusInput();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.background {
  height: 100vh;
  background-image: url('~@/assets/cashier-background.png');
  background-color: #fff;
  background-size: cover;
}
.order-detail {
  padding: 20px 35px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 100%;
}

.header {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  .date-cashier {
    margin-right: 40px;
    font-family: 'Muli', sans-serif !important;
  }
  .field-custumer {
    margin-left: 25px;
    margin-top: 10px;
    font-family: 'Muli', sans-serif !important;
  }
}

.bottom-bar {
  position: absolute;
  bottom: 20px;
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.text-total {
  margin-left: 35px;
  background-color: transparent !important;
  margin-top: -20px;
  font-family: 'Muli', sans-serif !important;
}

.background::v-deep p {
  margin-bottom: 0px;
}

.btn-buy {
  margin-right: 35px;
  color: #fff;
}

.background::v-deep .v-btn {
  color: #fff;
}
.method {
  color: grey;
}

.filter {
  color: green;
}
</style>
