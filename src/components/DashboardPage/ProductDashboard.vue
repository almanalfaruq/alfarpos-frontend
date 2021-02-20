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
    };
  },
  created() {
    this.debounceSearch = this.$_.debounce(this.getProducts, 300);
  },
  mounted() {
    this.getProducts();
  },
  watch: {
    search() {
      this.debounceSearch();
    },
  },
  methods: {
    getProducts() {
      this.loading = true;
      let url = config.apiURL.concat(`/products`);
      if (this.search !== null && this.search !== '') {
        url = url.concat(`?query=${this.search}`);
      }
      this.$http
        .get(url)
        .then(resp => {
          const { data } = resp;
          if (data.code === 200) {
            this.products = data.data.map(item => this.getProductFromResponse(item));
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