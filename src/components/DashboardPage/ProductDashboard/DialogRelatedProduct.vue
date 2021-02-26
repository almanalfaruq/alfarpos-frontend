<template>
  <v-card>
    <v-card-title class="title font-weight-regular justify-space-between">
      <span>{{ currentTitle }}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-container>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="selected"
            :items="products"
            :loading="isLoading"
            :search-input.sync="search"
            return-object
            no-data-text="Produk tidak ditemukan"
            clearable
            hide-details
            hide-selected
            item-text="name"
            item-value="id"
            label="Cari produk..."
            filled
          >
            <template v-slot:item="{ item }">
              <v-list-item-avatar
                color="indigo"
                class="headline font-weight-light white--text justify-center"
              >
                {{ item.name.charAt(0) }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.unitAndPrice"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn text @click="closeDialog"> Batal </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="saveRelatedProduct" :disabled="selected === null">
        Simpan
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import config from '@/config';
import ProductMixin from '@/mixins/product';

export default {
  name: 'DialogRelatedProduct',
  mixins: [ProductMixin],
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    product: {
      type: Object,
      default: () => null,
    },
    editIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      selected: null,
      search: null,
      products: [],
      isLoading: false,
    };
  },
  created() {
    this.debounceSearch = this.$_.debounce(this.getProducts, 300);
  },
  computed: {
    currentTitle() {
      if (this.isEdit) return 'Edit Produk Berkaitan';
      return 'Tambah Produk Berkaitan';
    },
  },
  watch: {
    search(val) {
      if (val !== '' || val !== null) {
        this.debounceSearch();
      }
    },
    product: {
      handler() {
        this.parseEditData();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    closeDialog() {
      this.clearAllInput();
      this.$emit('close-dialog');
    },
    clearAllInput() {
      this.selected = null;
      this.search = null;
      this.products = [];
      this.isLoading = false;
    },
    parseEditData() {
      if (this.product === null) {
        this.clearAllInput();
        return;
      }
      this.getExistingData();
    },
    getExistingData() {
      this.products.push(this.$_.cloneDeep(this.product));
      this.selected = this.$_.cloneDeep(this.product);
    },
    getProducts() {
      if (this.search === '' || this.search === null) {
        this.products = [];
        return;
      }
      this.isLoading = true;
      const url = config.apiURL.concat(`/products?query=${this.search}&limit=5&page=1`);
      this.$http
        .get(url)
        .then(resp => {
          const { data } = resp;
          if (data.code === 200) {
            const { products } = data.data;
            this.products = products.map(item => this.getProductFromResponse(item));
          }
          this.isLoading = false;
        })
        .catch(err => {
          const { data } = err.response;
          if (data.code === 404) {
            console.log(`Produk ${this.search} tidak ditemukan`);
          } else {
            console.log('Server error');
          }
          this.isLoading = false;
        });
    },
    saveRelatedProduct() {
      if (this.isEdit) {
        this.$emit('edit-related-product', this.editIndex, this.selected);
      } else {
        this.$emit('add-related-product', this.selected);
      }
      this.closeDialog();
    },
  },
};
</script>
<style lang="scss">
</style>

