<template>
  <v-data-table
    :headers="headers"
    :items="products"
    :sort-by="[{ key: 'index', order: 'asc' }]"
    :items-per-page="-1"
    class="table-item"
    height="60vh"
    fixed-header
    ref="tableCashier"
  >
    <template v-slot:bottom></template>
    <template v-slot:item="{ item, index }">
      <tr
        tabindex="0"
        @keydown.up.prevent="moveUp"
        @keydown.down.prevent="moveDown"
        @keydown.esc.prevent="focusInput"
        @keydown.f8.prevent="openEditAmountDialog(index)"
        @keydown.delete="deleteItem($event, item.raw)"
        @keydown.+.prevent="openFinishDialog"
        :ref="(el) => setRowRef(el, index)"
      >
        <td class="text-left">{{ index + 1 }}</td>
        <td class="text-left">
          <v-text-field
            v-if="index === products.length - 1 && !isSearchActivated"
            v-model="productCode"
            autofocus
            :error="isInputError"
            :error-messages="inputError"
            placeholder="Kode Barcode"
            @keydown.enter="addProductByCode(index)"
            @keydown.f2.prevent="activateSearchByCode"
            @keydown.f3.prevent="activateSearchByName"
            ref="inputProduct"
          ></v-text-field>
          <template
            v-else-if="index === products.length - 1 && isSearchActivated"
          >
            <v-autocomplete
              v-if="isSearchByCode"
              v-model="item.raw.itemCode"
              :items="itemsForSearch"
              v-model:search-input="search"
              hide-no-data
              item-title="itemCode"
              item-value="itemCode"
              single-line
              placeholder="Cari Kode Barang"
              :loading="isSearchLoading"
              :error="isInputError"
              :error-messages="inputError"
              autofocus
              @click="addProductBySearch($event, 'code', index)"
              @update:model-value="(val) => addProductBySearch(val, 'code', index)"
              @keydown.esc.prevent="turnOffSearch"
              @keydown.f2.prevent="activateSearchByCode"
              @keydown.f3.prevent="activateSearchByName"
            ></v-autocomplete>
            <v-autocomplete
              v-else
              v-model="item.raw.productName"
              :items="itemsForSearch"
              v-model:search-input="search"
              hide-no-data
              item-title="productName"
              item-value="productName"
              single-line
              placeholder="Cari Nama Barang"
              :loading="isSearchLoading"
              :error="isInputError"
              :error-messages="inputError"
              autofocus
              @click="addProductBySearch($event, 'name', index)"
              @update:model-value="(val) => addProductBySearch(val, 'name', index)"
              @keydown.esc.prevent="turnOffSearch"
              @keydown.f2.prevent="activateSearchByCode"
              @keydown.f3.prevent="activateSearchByName"
            ></v-autocomplete>
          </template>
          <template v-else>{{ item.raw.itemCode }}</template>
        </td>
        <td class="text-left">{{ item.raw.productName }}</td>
        <td class="text-center">{{ item.raw.price }}</td>
        <td class="text-center" @click="editingIndex = index">
          <v-text-field
            v-if="editingIndex === index"
            v-model="item.raw.amount"
            autofocus
            single-line
            hide-details
            density="compact"
            @blur="editingIndex = -1"
            @keydown.enter="saveAmount(item.raw, index); editingIndex = -1"
          ></v-text-field>
          <span v-else>{{ item.raw.amount }}</span>
        </td>
        <td class="text-center">{{ item.raw.total }}</td>
        <td class="text-center">
          <v-icon
            v-if="index != products.length - 1"
            size="small"
            @click="deleteItem($event, item.raw)"
          >fa-trash</v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import config from '@/config';

export default {
  name: 'TableCashier',
  data() {
    return {
      isSearchActivated: false,
      isSearchByCode: false,
      isSearchLoading: false,
      search: null,
      isInputError: false,
      inputError: null,
      focusedIndex: -1,
      productCode: '',
      editingIndex: -1,
      rowRefs: [],
      headers: [
        {
          title: 'No',
          align: 'left',
          sortable: false,
          key: 'index',
          width: '50px',
        },
        {
          title: 'Kode Barang',
          align: 'left',
          sortable: false,
          key: 'itemCode',
          width: '150px',
        },
        {
          title: 'Nama Produk',
          sortable: false,
          align: 'left',
          key: 'productName',
        },
        { title: 'Harga', sortable: false, align: 'center', key: 'price' },
        { title: 'Jumlah', sortable: false, align: 'center', key: 'amount' },
        { title: 'Total', sortable: false, align: 'center', key: 'total' },
        { title: 'Hapus', sortable: false, align: 'center', key: 'action', width: '80px' },
      ],
      pagination: {
        itemsPerPage: -1,
      },
      itemsForSearch: [],
      products: [
        {
          itemCode: null,
          productName: null,
          price: null,
          amount: null,
          total: null,
        },
      ],
    };
  },
  created() {
    this.debounceSearch = this.$_.debounce(this.searchProduct, 300);
  },
  beforeUpdate() {
    this.rowRefs = [];
  },
  computed: {
    total() {
      return this.products.reduce((total, currentValue) => total + currentValue.total, 0);
    },
  },
  watch: {
    productCode() {
      this.isInputError = false;
      this.inputError = null;
    },
    search(val) {
      this.isInputError = false;
      this.inputError = null;
      if (val !== '' || val !== null) {
        this.isSearchLoading = true;
        this.debounceSearch();
      } else {
        this.isSearchLoading = false;
      }
    },
    products: {
      handler() {
        this.focusedIndex = this.products.length - 1;
        this.$emit('update-total', this.total);
      },
      deep: true,
      immediate: true,
    },
    total() {
      this.$nextTick(() => {
        this.focusInput();
      });
    },
  },
  methods: {
    setRowRef(el, index) {
      if (el) this.rowRefs[index] = el;
    },
    deleteItem(event, item) {
      /* eslint-disable */
      if (
        (event instanceof KeyboardEvent && this.focusedIndex === this.products.length - 1) ||
        this.search !== null
      )
        return;
      const index = this.products.indexOf(item);
      const isConfirmed = window.confirm('Apakah anda yakin untuk menghapus produk ini?');
      isConfirmed && this.products.splice(index, 1);
      /* eslint-enable */
    },
    addProductByCode(index) {
      let productCode = '';
      let amount = 1;
      const splitProductCode = this.productCode.split('*');
      /* eslint-disable */
      if (splitProductCode.length > 1) {
        amount = Number(splitProductCode[0]);
        productCode = splitProductCode[1];
      } else {
        productCode = this.productCode;
      }
      /* eslint-enable */
      const url = config.apiURL.concat(`/products/code/${productCode}`);
      this.$http
        .get(url)
        .then(resp => {
          const { data } = resp;
          if (data.code === 200) {
            const product = {
              itemCode: data.data.code,
              productName: data.data.name,
              price: data.data.sell_price,
              amount,
              total: amount * data.data.sell_price,
              sell_price: data.data.sell_price, // Needed for saveAmount calculation
            };
            this.addProduct(index, product, amount);
          } else {
            this.isInputError = true;
            this.inputError = `Produk ${productCode} tidak ditemukan`;
          }
        })
        .catch(err => {
          const { data } = err.response;
          this.isInputError = true;
          if (data.code === 404) {
            this.inputError = `Produk ${productCode} tidak ditemukan`;
          } else {
            this.inputError = 'Server error';
          }
        });
    },
    addProductBySearch(event, type, index) {
      let product;
      switch (type) {
        case 'name':
          product = this.itemsForSearch.find(item => item.productName === event);
          break;
        case 'code':
          product = this.itemsForSearch.find(item => item.itemCode === event);
          break;
        default:
          break;
      }

      this.addProduct(index, product, 1);
    },
    addExistingProduct(index, itemCode, amount) {
      const product = this.products.find(item => item.itemCode === itemCode);
      this.products[index].amount = product.amount + amount;
      this.products[index].total = product.price * this.products[index].amount;
      this.products[this.products.length - 1] = {
        itemCode: null,
        productName: null,
        price: null,
        amount: null,
        total: null,
      };
      this.clearAllInput();
    },
    addNewProduct(index, product) {
      this.products[index] = product;
      this.products.push({
        itemCode: null,
        productName: null,
        price: null,
        amount: null,
        total: null,
      });
      this.clearAllInput();
    },
    addProduct(index, product, amount) {
      // If product is exist, then add the quantity
      const indexExistingProduct = this.products
        .slice(0, this.products.length - 1)
        .findIndex(item => item.itemCode === product.itemCode);
      if (indexExistingProduct >= 0) {
        this.addExistingProduct(indexExistingProduct, product.itemCode, amount);
        return;
      }

      this.addNewProduct(index, product);
    },
    clearAllInput() {
      this.productCode = '';
      this.search = null;
      this.itemsForSearch = [];
      this.turnOffSearch();
    },
    saveAmount(item, index) {
      // Ensure index is valid, although item is passed
      const idx = index !== undefined ? index : this.products.indexOf(item);
      if (idx === -1) return;
      
      this.products[idx].amount = parseInt(item.amount); // Ensure it's a number
      this.products[idx].total = this.products[idx].price * this.products[idx].amount;
    },
    clearAllProduct() {
      this.productCode = '';
      this.search = null;
      this.itemsForSearch = [];
      this.products = [];
      this.products.push({
        itemCode: null,
        productName: null,
        price: null,
        amount: null,
        total: null,
      });
    },
    searchProduct() {
      if (this.search === null || this.search === '') {
        this.isSearchLoading = false;
        this.isInputError = false;
        this.inputError = null;
        return;
      }
      let url = config.apiURL.concat('/products');
      if (this.isSearchByCode) {
        url = url.concat(`?searchBy=code&query=${this.search}`);
      } else {
        url = url.concat(`?searchBy=name&query=${this.search}`);
      }
      this.$http
        .get(url)
        .then(resp => {
          const { data } = resp;
          this.isSearchLoading = false;
          if (data.code === 200) {
            this.itemsForSearch = data.data.map(item => ({
              itemCode: item.code,
              productName: item.name,
              price: item.sell_price,
              amount: 1,
              total: item.sell_price,
              sell_price: item.sell_price, // Preserve this
            }));
          } else {
            this.isInputError = true;
            this.inputError = `Produk ${this.search} tidak ditemukan`;
          }
        })
        .catch(err => {
          const { data } = err.response;
          this.isSearchLoading = false;
          this.isInputError = true;
          if (data.code === 404) {
            this.inputError = `Produk ${this.search} tidak ditemukan`;
          } else {
            this.inputError = 'Server error';
          }
        });
    },
    focusRow() {
      if (this.focusedIndex === this.products.length - 1) return;
      const selectedRow = this.rowRefs[this.focusedIndex];
      if (selectedRow) selectedRow.focus();
      this.$emit('update-is-focus-on-input', false);
    },
    moveUp() {
      if (this.focusedIndex === this.products.length - 1 && this.search !== null) return;
      if (this.focusedIndex > 0) {
        this.focusedIndex -= 1;
        this.focusRow();
      }
    },
    moveDown() {
      if (this.focusedIndex === this.products.length - 1 && this.search !== null) return;
      if (this.focusedIndex < this.products.length - 2) {
        this.focusedIndex += 1;
        this.focusRow();
      } else {
        this.focusInput();
      }
    },
    focusInput() {
      this.$emit('update-is-focus-on-input', true);
      if (this.$refs.inputProduct) {
        this.$refs.inputProduct.focus();
      }
      this.focusedIndex = this.products.length - 1;
    },
    openEditAmountDialog(index) {
      if (this.focusedIndex === this.products.length - 1) return;
      this.editingIndex = index;
    },
    openFinishDialog() {
      this.$emit('open-finish-dialog');
    },
    activateSearchByCode() {
      this.isSearchActivated = true;
      this.isSearchByCode = true;
    },
    activateSearchByName() {
      this.isSearchActivated = true;
      this.isSearchByCode = false;
    },
    turnOffSearch() {
      this.isSearchActivated = false;
      this.isSearchByCode = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-item {
  margin: 10px 35px;
  border: 1px solid #505050;
  border-radius: 10px;
  background-color: transparent !important;
  font-family: 'Muli', sans-serif !important;
  // max-height: 60vh;
  // overflow-y: auto;
}

.table-item :deep(th[role='columnheader']) {
  font-size: 12px;
  background-color: #dddddd !important;
  &:first-of-type {
    border-top-left-radius: 10px;
  }
  &:last-of-type {
    border-top-right-radius: 10px;
  }
}

.table-item :deep(td),
div {
  font-size: 12px;
}
</style>
