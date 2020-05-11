<template>
  <v-data-table
    :headers="headers"
    :items="products"
    sort-by="index"
    :items-per-page="-1"
    class="table-item"
    hide-default-footer
    height="60vh"
    fixed-header
    ref="tableCashier"
  >
    <template v-slot:item="props">
      <tr
        tabindex="0"
        @keydown.up.prevent="moveUp"
        @keydown.down.prevent="moveDown"
        @keydown.esc.prevent="focusInput"
        @keydown.f8.prevent="openEditAmountDialog"
        @keydown.delete="deleteItem(props.item)"
        @keydown.+.prevent="openFinishDialog"
      >
        <td class="text-left">{{ props.index + 1 }}</td>
        <td class="text-left">
          <v-text-field
            v-if="products.indexOf(props.item) === products.length - 1 && !isSearchActivated"
            v-model="productCode"
            autofocus
            :error="isInputError"
            :error-messages="inputError"
            placeholder="Kode Barcode"
            @keydown.enter="addProductByCode(props.index)"
            @keydown.f2.prevent="activateSearchByCode"
            @keydown.f3.prevent="activateSearchByName"
            ref="inputProduct"
          ></v-text-field>
          <template
            v-else-if="products.indexOf(props.item) === products.length - 1 && isSearchActivated"
          >
            <v-autocomplete
              v-if="isSearchByCode"
              v-model="props.item.itemCode"
              :items="itemsForSearch"
              :search-input.sync="search"
              hide-no-data
              item-text="itemCode"
              item-value="itemCode"
              single-line
              placeholder="Cari Kode Barang"
              :loading="isSearchLoading"
              :error="isInputError"
              :error-messages="inputError"
              autofocus
              @click="addProductBySearch($event, 'code', props.index)"
              @change="addProductBySearch($event, 'code', props.index)"
              @keydown.esc.prevent="turnOffSearch"
              @keydown.f2.prevent="activateSearchByCode"
              @keydown.f3.prevent="activateSearchByName"
            ></v-autocomplete>
            <v-autocomplete
              v-else
              v-model="props.item.productName"
              :items="itemsForSearch"
              :search-input.sync="search"
              hide-no-data
              item-text="productName"
              item-value="productName"
              single-line
              placeholder="Cari Nama Barang"
              :loading="isSearchLoading"
              :error="isInputError"
              :error-messages="inputError"
              autofocus
              @click="addProductBySearch($event, 'name', props.index)"
              @change="addProductBySearch($event, 'name', props.index)"
              @keydown.esc.prevent="turnOffSearch"
              @keydown.f2.prevent="activateSearchByCode"
              @keydown.f3.prevent="activateSearchByName"
            ></v-autocomplete>
          </template>
          <template v-else>{{ props.item.itemCode }}</template>
        </td>
        <td class="text-left">{{ props.item.productName }}</td>
        <td class="text-center">{{ props.item.price }}</td>
        <td class="text-center">
          <v-edit-dialog
            :return-value.sync="props.item.amount"
            @save="saveAmount(props.item)"
            :id="`edit-dialog-${props.index}`"
          >
            <div>{{ props.item.amount }}</div>
            <template v-slot:input>
              <div class="mt-4 title">Update Iron</div>
            </template>
            <template v-slot:input>
              <v-text-field v-model="props.item.amount" label="Edit" single-line autofocus></v-text-field>
            </template>
          </v-edit-dialog>
        </td>
        <td class="text-center">{{ props.item.total }}</td>
        <td class="text-center">
          <v-icon
            v-if="props.index != products.length - 1"
            small
            @click="deleteItem(props.item)"
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
      headers: [
        {
          text: 'No',
          align: 'left',
          sortable: false,
          value: 'index',
          width: '50px',
        },
        {
          text: 'Kode Barang',
          align: 'left',
          sortable: false,
          value: 'itemCode',
          width: '150px',
        },
        {
          text: 'Nama Produk',
          sortable: false,
          align: 'left',
          value: 'productName',
        },
        { text: 'Harga', sortable: false, align: 'center', value: 'price' },
        { text: 'Jumlah', sortable: false, align: 'center', value: 'amount' },
        { text: 'Total', sortable: false, align: 'center', value: 'total' },
        { text: 'Hapus', sortable: false, align: 'center', value: 'action', width: '80px' },
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
  },
  methods: {
    deleteItem(item) {
      /* eslint-disable */
      if (this.focusedIndex === this.products.length - 1 || this.search !== null) return;
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
      this.$set(this.products[index], 'amount', product.amount + amount);
      this.$set(this.products[index], 'total', product.price * product.amount);
      this.$set(this.products, this.products.length - 1, {
        itemCode: null,
        productName: null,
        price: null,
        amount: null,
        total: null,
      });
      this.clearAllInput();
    },
    addNewProduct(index, product) {
      this.$set(this.products, index, product);
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
      const indexExistingProduct = this.products.findIndex(
        item => item.itemCode === product.itemCode,
      );
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
    saveAmount(item) {
      const index = this.products.indexOf(item);
      this.$set(this.products, index, {
        itemCode: this.products[index].itemCode,
        productName: this.products[index].productName,
        price: this.products[index].price,
        amount: this.products[index].amount,
        total: this.products[index].price * this.products[index].amount,
      });
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
            this.itemsForSearch = data.data.map(item => {
              return {
                itemCode: item.code,
                productName: item.name,
                price: item.sell_price,
                amount: 1,
                total: item.sell_price,
              };
            });
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
      const selectedRow = this.$refs.tableCashier.$el.children[0].children[0].children[2].rows[
        this.focusedIndex
      ];
      selectedRow.focus();
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
      this.$refs.inputProduct.focus();
      this.focusedIndex = this.products.length - 1;
    },
    openEditAmountDialog() {
      document.getElementById(`edit-dialog-${this.focusedIndex}`).previousElementSibling.click();
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

.table-item::v-deep th[role='columnheader'] {
  font-size: 12px;
  background-color: #dddddd !important;
  &:first-of-type {
    border-top-left-radius: 10px;
  }
  &:last-of-type {
    border-top-right-radius: 10px;
  }
}

.table-item::v-deep td,
div {
  font-size: 12px;
}
</style>
