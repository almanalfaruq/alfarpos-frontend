<template>
  <v-data-table
    :headers="headers"
    :items="products"
    sort-by="item_code"
    :items-per-page="-1"
    class="table-item"
    hide-default-footer
  >
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
      headers: [
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
      products: [
        {
          item_code: '001',
          product_name: 'Panadol',
          price: 6000,
          amount: 1,
          total: 6000,
          action: '1%',
        },
        {
          item_code: '002',
          product_name: 'Rinso Cair Rose',
          price: 13500,
          amount: 1,
          total: 13500,
          action: '1%',
        },
        {
          item_code: '003',
          product_name: 'Lays 400gr',
          price: 16700,
          amount: 1,
          total: 13500,
          action: '7%',
        },
        {
          item_code: '004',
          product_name: 'Telor Ayam',
          price: 5600,
          amount: 1,
          total: 5600,
          action: '8%',
        },
        {
          item_code: '005',
          product_name: 'Del M-saus Spagetti',
          price: 14400,
          amount: 1,
          total: 14400,
          action: '16%',
        },
        {
          item_code: '006',
          product_name: 'Sosis Sapi Curah',
          price: 6300,
          amount: 1,
          total: 6300,
          action: '0%',
        },
        {
          item_code: '007',
          product_name: 'Chitato',
          price: 9800,
          amount: 1,
          total: 9800,
          action: '2%',
        },
        {
          item_code: '008',
          product_name: 'Beras Merah 1kg',
          price: 16000,
          amount: 1,
          total: 16000,
          action: '45%',
        },
        {
          item_code: '009',
          product_name: 'Terong 400gr',
          price: 9000,
          amount: 1,
          total: 9000,
          action: '22%',
        },
        {
          item_code: '010',
          product_name: 'Bawang Merah 500gr',
          price: 8000,
          amount: 1,
          total: 8000,
          action: '6%',
        },
        {
          item_code: '011',
          product_name: 'Bawang Merah 500gr',
          price: 8000,
          amount: 1,
          total: 8000,
          action: '6%',
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
