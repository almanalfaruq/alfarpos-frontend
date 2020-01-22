<template>
  <v-data-table
    :headers="headers"
    :items="products"
    sort-by="index"
    :items-per-page="-1"
    class="table-item"
    hide-default-footer
  >
    <template v-slot:item.index="props">
      {{ products.indexOf(props.item) + 1 }}
    </template>
    <template v-slot:item.code="props">
      <v-autocomplete
        v-if="products.indexOf(props.item) === products.length - 1"
        v-model="props.item.code"
        :items="itemsForSearch"
        :search-input.sync="searchCode"
        color="white"
        hide-no-data
        item-text="code"
        item-value="code"
        single-line
        placeholder="Kode Barang"
        :append-icon="null"
        autofocus
        @change="addItem($event, products.indexOf(props.item))"
      ></v-autocomplete>
      <template v-else>
        {{ props.item.code }}
      </template>
    </template>
    <template v-slot:item.name="props">
      <v-autocomplete
        v-if="products.indexOf(props.item) === products.length - 1"
        v-model="props.item.name"
        :items="itemsForSearch"
        :search-input.sync="search"
        color="white"
        hide-no-data
        item-text="name"
        item-value="name"
        single-line
        placeholder="Nama Produk"
        :append-icon="null"
        @change="addItem($event, products.indexOf(props.item))"
      />
      <span v-else>
        {{ props.item.name }}
      </span>
    </template>
    <template v-slot:item.amount="props">
      <v-edit-dialog :return-value.sync="props.item.amount" @save="saveAmount(props.item)">
        <div>{{ props.item.amount }}</div>
        <template v-slot:input>
          <div class="mt-4 title">Update Iron</div>
        </template>
        <template v-slot:input>
          <v-text-field
            v-model="props.item.amount"
            label="Edit"
            single-line
            autofocus
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small @click="deleteItem(item)" v-if="products.indexOf(item) !== products.length - 1"
        >fa-trash</v-icon
      >
    </template>
  </v-data-table>
</template>

<script>
import _ from 'lodash';
import Config from '@/config';

const axios = require('axios');

export default {
  name: 'TableCashier',
  data() {
    return {
      searchCode: null,
      search: null,
      headers: [
        {
          text: 'No',
          width: 50,
          align: 'left',
          sortable: false,
          value: 'index',
        },
        {
          text: 'Kode Barang',
          width: 200,
          align: 'left',
          sortable: false,
          value: 'code',
        },
        { text: 'Nama Produk', value: 'name' },
        { text: 'Harga', value: 'sell_price' },
        { text: 'Jumlah', value: 'amount' },
        { text: 'Total', value: 'total' },
        { text: 'Action', value: 'action' },
      ],
      pagination: {
        itemsPerPage: -1,
      },
      itemsForSearch: [],
      products: [
        {
          code: null,
          name: null,
          sell_price: null,
          amount: null,
          total: null,
        },
      ],
    };
  },
  created() {
    this.debounced = _.debounce(this.searchProduct, 500);
  },
  computed: {
    total() {
      return this.products.reduce((total, currentValue) => total + currentValue.total, 0);
    },
  },
  watch: {
    products: {
      handler() {
        this.$emit('update-total', this.total);
      },
      deep: true,
      immediate: true,
    },
    search: {
      handler(value) {
        if (value !== null || value !== '') {
          this.debounced();
        }
      },
    },
  },
  methods: {
    searchProduct() {
      if (this.search !== null) {
        axios
          .get(Config.apiUrl.concat('/api/products?query=').concat(this.search))
          .then(response => {
            const { data } = response;
            this.itemsForSearch = data.data;
          });
      }
    },
    deleteItem(item) {
      /* eslint-disable */
      const index = this.products.indexOf(item);
      const isConfirmed = window.confirm('Yakin barangnya mau dihapus?');
      isConfirmed && this.products.splice(index, 1);
      /* eslint-enable */
    },
    addItem(event, index) {
      const product = event.match(/^\d/)
        ? this.itemsForSearch.find(item => item.code === event)
        : this.itemsForSearch.find(item => item.name === event);
      product.amount = 1;
      product.total = product.sell_price;
      this.$set(this.products, index, product);
      this.products.push({
        code: null,
        name: null,
        sell_price: null,
        amount: null,
        total: null,
      });
      setTimeout(() => {
        this.search = null;
      }, 0);
    },
    saveProductName(item) {
      const index = this.products.indexOf(item);
      this.$set(this.products, index, {
        code: index,
        name: this.products[index].name,
        sell_price: 9000,
        amount: 1,
        total: 9000,
      });
    },
    saveAmount(item) {
      const index = this.products.indexOf(item);
      this.$set(this.products, index, {
        code: index,
        name: this.products[index].name,
        sell_price: this.products[index].sell_price,
        amount: this.products[index].amount,
        total: this.products[index].sell_price * this.products[index].amount,
      });
    },
    clearAllProduct() {
      this.products = [];
      this.products.push({
        code: null,
        name: null,
        sell_price: null,
        amount: null,
        total: null,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.table-item {
  margin: 35px;
  border: 1px solid #505050;
  border-radius: 10px;
  background-color: transparent !important;
  font-family: 'Muli', sans-serif !important;
  max-height: 70vh;
  overflow-y: auto;
}

.table-item::v-deep th[role='columnheader'] {
  font-size: 14px;
  background-color: #d3d3d3;
  &:first-of-type {
    border-top-left-radius: 10px;
  }
  &:last-of-type {
    border-top-right-radius: 10px;
  }
}

.table-item::v-deep td {
  font-size: 13px;
}
</style>
