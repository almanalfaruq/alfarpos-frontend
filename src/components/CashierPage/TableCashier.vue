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
    <template v-slot:item.item_code="props">
      <v-autocomplete
        v-if="products.indexOf(props.item) === products.length - 1"
        v-model="props.item.item_code"
        :items="itemsForSearch"
        :search-input.sync="searchCode"
        color="white"
        hide-no-data
        item-text="item_code"
        item-value="item_code"
        single-line
        placeholder="Kode Barang"
        autofocus
        @change="addItem($event, products.indexOf(props.item))"
      ></v-autocomplete>
      <template v-else>
        {{ props.item.item_code }}
      </template>
    </template>
    <template v-slot:item.product_name="props">
      <v-edit-dialog
        :return-value.sync="props.item.product_name"
        @save="saveProductName(props.item)"
      >
        {{ props.item.product_name }}
        <template v-slot:input>
          <!-- <v-text-field v-model="props.item.product_name" label="Edit" single-line></v-text-field> -->
          <v-autocomplete
            v-model="props.item.product_name"
            :items="itemsForSearch"
            :search-input.sync="search"
            color="white"
            hide-no-data
            item-text="product_name"
            item-value="product_name"
            single-line
            placeholder="Nama Produk"
            autofocus
          ></v-autocomplete>
        </template>
      </v-edit-dialog>
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
      <v-icon small @click="deleteItem(item)">fa-trash</v-icon>
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: 'TableCashier',
  data() {
    return {
      searchCode: null,
      search: null,
      headers: [
        {
          text: 'No',
          align: 'left',
          sortable: false,
          value: 'index',
        },
        {
          text: 'Kode Barang',
          align: 'left',
          sortable: false,
          value: 'item_code',
        },
        { text: 'Nama Produk', value: 'product_name' },
        { text: 'Harga', value: 'price' },
        { text: 'Jumlah', value: 'amount' },
        { text: 'Total', value: 'total' },
        { text: 'Action', value: 'action' },
      ],
      pagination: {
        itemsPerPage: -1,
      },
      itemsForSearch: [
        {
          item_code: '001',
          product_name: 'Panadol',
          price: 6000,
          amount: 1,
          total: 6000,
        },
        {
          item_code: '002',
          product_name: 'Rinso Cair Rose',
          price: 13500,
          amount: 1,
          total: 13500,
        },
        {
          item_code: '003',
          product_name: 'Lays 400gr',
          price: 16700,
          amount: 1,
          total: 13500,
        },
        {
          item_code: '004',
          product_name: 'Telor Ayam',
          price: 5600,
          amount: 1,
          total: 5600,
        },
        {
          item_code: '005',
          product_name: 'Del M-saus Spagetti',
          price: 14400,
          amount: 1,
          total: 14400,
        },
        {
          item_code: '006',
          product_name: 'Sosis Sapi Curah',
          price: 6300,
          amount: 1,
          total: 6300,
        },
        {
          item_code: '007',
          product_name: 'Chitato',
          price: 9800,
          amount: 1,
          total: 9800,
        },
        {
          item_code: '008',
          product_name: 'Beras Merah 1kg',
          price: 16000,
          amount: 1,
          total: 16000,
        },
        {
          item_code: '009',
          product_name: 'Terong 400gr',
          price: 9000,
          amount: 1,
          total: 9000,
        },
        {
          item_code: '010',
          product_name: 'Bawang Merah 500gr',
          price: 8000,
          amount: 1,
          total: 8000,
        },
      ],
      products: [
        {
          item_code: null,
          product_name: null,
          price: null,
          amount: null,
          total: null,
        },
      ],
    };
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
  },
  methods: {
    deleteItem(item) {
      /* eslint-disable */
      const index = this.products.indexOf(item);
      const isConfirmed = window.confirm('Are you sure you want to delete this item?');
      isConfirmed && this.products.splice(index, 1);
      /* eslint-enable */
    },
    addItem(event, index) {
      const product = this.itemsForSearch.find(item => item.item_code === event);
      this.$set(this.products, index, product);
      this.products.push({
        item_code: null,
        product_name: null,
        price: null,
        amount: null,
        total: null,
      });
      this.search = null;
    },
    saveProductName(item) {
      const index = this.products.indexOf(item);
      this.$set(this.products, index, {
        item_code: index,
        product_name: this.products[index].product_name,
        price: 9000,
        amount: 1,
        total: 9000,
      });
      this.search = null;
    },
    saveAmount(item) {
      const index = this.products.indexOf(item);
      this.$set(this.products, index, {
        item_code: index,
        product_name: this.products[index].product_name,
        price: this.products[index].price,
        amount: this.products[index].amount,
        total: this.products[index].price * this.products[index].amount,
      });
    },
    clearAllProduct() {
      this.products = [];
      this.products.push({
        item_code: null,
        product_name: null,
        price: null,
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
