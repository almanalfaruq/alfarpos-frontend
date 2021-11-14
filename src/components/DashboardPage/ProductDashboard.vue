<template>
  <v-container>
    <v-row>
      <v-col md="4">
        <v-combobox
          v-model="select"
          :items="items"
          label="Pilih Kategori"
          clearable
          multiple
          outlined
          small-chips
          placeholder="Pilih Kategori"
          solo
          dense
          height="45px"
        ></v-combobox>
      </v-col>
      <v-col md="4" class="ml-auto">
        <v-text-field
          label="Cari barang..."
          v-model="search"
          solo
          clearable
          height="45px"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table
          :headers="headers"
          :items="products"
          :options.sync="options"
          fixed-header
          :loading="loading"
          loading-text="Memuat data... Mohon menunggu"
          hide-default-footer
        >
          <template v-slot:item="props">
            <tr>
              <td class="text-left">
                {{ options.page * options.itemsPerPage - options.itemsPerPage + props.index + 1 }}
              </td>
              <td class="text-left">{{ props.item.code }}</td>
              <td class="text-left">{{ props.item.name }}</td>
              <td class="text-center">{{ props.item.sellPrice }}</td>
              <td class="text-center">{{ props.item.unit.name }}</td>
              <td class="text-center">{{ props.item.quantity }}</td>
              <td class="text-center">
                <v-btn icon color="#3C7E8C" @click="openDialogEdit(props.item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-dialog v-model="dialog" max-width="1000">
          <dialog-product
            @close-dialog="closeDialog"
            :isEdit="isEdit"
            :product="selectedProduct"
          ></dialog-product>
        </v-dialog>
        <v-container>
          <v-row justify="center">
            <v-btn outlined :disabled="!hasPrev" @click="page -= 1">
              <v-icon> mdi-menu-left </v-icon>
            </v-btn>
            <v-btn outlined :disabled="!hasNext" @click="page += 1">
              <v-icon> mdi-menu-right </v-icon>
            </v-btn>
          </v-row>
        </v-container>
        <v-btn class="mx-2 floating" fab dark small color="#3C7E8C" @click.stop="dialog = true">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import config from '@/config';
import ProductMixin from '@/mixins/product';

import DialogProduct from './ProductDashboard/DialogProduct.vue';

export default {
  name: 'ProductDashboard',
  components: { DialogProduct },
  mixins: [ProductMixin],
  data() {
    return {
      dialog: false,
      isEdit: false,
      options: {},
      page: 1,
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
        { text: 'Harga Jual', sortable: false, align: 'center', value: 'price' },
        { text: 'Satuan', sortable: false, align: 'center', value: 'unit' },
        { text: 'Stok Toko', sortable: false, align: 'center', value: 'stock' },
        { text: 'Aksi', sortable: false, align: 'center', value: 'action', width: '80px' },
      ],
      products: [],
      selectedProduct: null,
      select: [],
      items: ['Programming', 'Design', 'Vue', 'Vuetify'],
      search: '',
      loading: true,
      hasNext: false,
      initSearch: false,
    };
  },
  computed: {
    pageLength() {
      if (this.hasNext) {
        return 2;
      }
      if (this.page > 1) {
        return 2;
      }
      return 1;
    },
    hasPrev() {
      if (this.page > 1) {
        return true;
      }
      return false;
    },
  },
  created() {
    this.debounceSearch = this.$_.debounce(this.getProducts, 500);
  },
  mounted() {
    this.getProducts();
  },
  watch: {
    search() {
      if (this.search !== null && this.search !== '') this.initSearch = true;
      this.debounceSearch();
    },
    page() {
      if (this.initSearch) {
        return;
      }
      this.$set(this.options, 'page', this.page);
      this.getProducts();
    },
  },
  methods: {
    getProducts() {
      this.loading = true;
      let url = config.apiURL.concat(`/products?limit=10&page=${this.page}`);
      if (this.search !== null && this.search !== '') {
        if (this.page !== 1 && this.initSearch) this.page = 1;
        this.initSearch = false;
        this.$set(this.options, 'page', this.page);
        url = config.apiURL
          .concat(`/products`)
          .concat(`?query=${this.search}&limit=10&page=${this.page}`);
      }
      this.$http
        .get(url)
        .then(resp => {
          const { data } = resp;
          if (data.code === 200) {
            const { products } = data.data;
            this.products = products.map(item => this.getProductFromResponse(item));
            this.hasNext = data.data.has_next;
          }
          this.loading = false;
        })
        .catch(err => {
          const { data } = err.response;
          if (data.code === 404) {
            console.log(`Produk ${this.search} tidak ditemukan`);
          } else {
            console.log('Server error');
          }
          this.loading = false;
        });
    },
    openDialogEdit(product) {
      this.dialog = true;
      this.isEdit = true;
      this.selectedProduct = product;
    },
    closeDialog() {
      this.dialog = false;
      this.isEdit = false;
      this.selectedProduct = null;
      this.getProducts();
    },
  },
};
</script>
<style lang="scss" scoped>
.mx-2 {
  position: fixed;
  bottom: 20px;
}
</style>