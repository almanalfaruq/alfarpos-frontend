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
      <span>Detail Barang</span>
      <v-row>
        <v-col md="6">
          <v-text-field label="Barcode" v-model="code"></v-text-field>
        </v-col>
        <v-col md="6">
          <v-text-field label="Nama Barang" v-model="name"></v-text-field>
        </v-col>
        <v-col md="4">
          <v-combobox
            v-model="selectedCategory"
            :items="categories"
            item-text="name"
            item-value="id"
            label="Kategori"
            clearable
            placeholder="Kategori"
            solo
            dense
            height="45px"
          ></v-combobox>
        </v-col>
        <v-col md="2">
          <v-combobox
            v-model="selectedUnit"
            :items="units"
            item-text="code"
            item-value="id"
            label="Satuan"
            clearable
            placeholder="Satuan"
            solo
            dense
            height="45px"
          ></v-combobox>
        </v-col>
        <v-col md="4">
          <v-text-field label="Keterangan Satuan" v-model="unitName"></v-text-field>
        </v-col>
        <v-col md="2">
          <v-text-field label="Stok di toko" type="number" v-model="stock"></v-text-field>
        </v-col>
      </v-row>
      <v-divider inset></v-divider>
      <span class="subtitle">Harga Barang</span>
      <v-row style="margin: 5px -12px 15px">
        <v-col md="3">
          <v-text-field
            label="Harga Beli"
            prefix="Rp "
            type="number"
            v-model="buyPrice"
          ></v-text-field>
          <v-text-field
            label="Harga Jual"
            prefix="Rp "
            type="number"
            v-model="sellPrice"
          ></v-text-field>
          <v-checkbox v-model="isOpenPrice" label="Harga sering berubah?"></v-checkbox>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col md="8">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">Harga Spesial</span>
            </template>
            <span>Harga spesial untuk pembelian per-paket/jumlah minimal</span>
          </v-tooltip>
          <v-row v-for="(specialPrice, index) in specialPrices" :key="index">
            <v-col sm="4">
              <v-select
                :items="specialPriceOptions"
                item-text="label"
                item-value="value"
                label="Pilih tipe harga"
                v-model="specialPrices[index].priceOption"
              ></v-select>
            </v-col>
            <v-col sm="3">
              <v-text-field
                label="Harga Jual"
                prefix="Rp "
                type="number"
                v-model="specialPrices[index].sellPrice"
              ></v-text-field>
            </v-col>
            <v-col sm="2">
              <v-text-field
                label="Jumlah Minimal"
                type="number"
                v-model="specialPrices[index].quantityMultiplier"
              ></v-text-field>
            </v-col>
            <v-col sm="3" align-self="center">
              <div class="d-flex justify-space-around align-center">
                <v-btn
                  dark
                  small
                  color="#3C7E8C"
                  @click="addNewSpecialPrice"
                  :disabled="isBtnAddNewSpecialPriceDisabled(index)"
                >
                  <v-icon dark> mdi-plus </v-icon>
                </v-btn>
                <v-btn
                  dark
                  small
                  color="#EF5350"
                  @click="deleteSpecialPrice(specialPrice)"
                  v-if="specialPrices.length > 1"
                >
                  <v-icon dark> mdi-delete </v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider inset></v-divider>
      <span class="subtitle">Produk Berkaitan</span>
      <v-row style="margin: 5px -12px 15px; max-width: 100%; overflow-x: auto; overflow-y: hidden">
        <v-col
          v-for="(relatedProduct, index) in relatedProducts"
          :key="relatedProduct.id"
          md="3"
          align-self="center"
          justify="center"
        >
          <v-card
            v-if="relatedProduct.id === -1"
            height="150px"
            style="display: flex; align-items: center; justify-content: center"
            color="#EEEEEE"
            outlined
            @click="openDialogRelatedProduct(-1, null)"
          >
            <div class="d-flex flex-column justify-space-around align-center" style="height: 85%">
              <v-btn fab color="#E0E0E0" disabled>
                <v-icon dark> mdi-plus </v-icon>
              </v-btn>
              <span>Tambah produk</span>
            </div>
          </v-card>
          <v-card
            v-else
            height="150px"
            outlined
            @click="openDialogRelatedProduct(index, relatedProduct)"
          >
            <v-card-title
              style="height: 25px; padding: 0; margin: 0"
              class="title font-weight-regular justify-space-between"
            >
              <v-spacer></v-spacer>
              <v-btn icon @click.stop="deleteRelatedProduct(relatedProduct)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-title>
            <div class="d-flex flex-column justify-space-around align-center" style="height: 85%">
              <span class="related-product-text">{{ relatedProduct.name }}</span>
              <span class="related-product-text">{{ relatedProduct.unit.name }}</span>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="500">
      <dialog-related-product
        @close-dialog="closeDialogRelatedProduct"
        @add-related-product="addRelatedProduct"
        @edit-related-product="editRelatedProduct"
        :isEdit="isEditRelatedProduct"
        :product="selectedRelatedProduct"
        :editIndex="selectedRelatedIndex"
      ></dialog-related-product>
    </v-dialog>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn text @click="closeDialog"> Batal </v-btn>
      <v-spacer></v-spacer>
      <template v-if="isEdit">
        <v-btn color="error" @click="confirmDeleteProduct"> Hapus Produk </v-btn>
        <v-btn color="primary" @click="saveProduct"> Simpan </v-btn>
      </template>
      <v-btn v-else color="primary" @click="addProduct"> Tambah Produk </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import config from '@/config';
import ProductMixin from '@/mixins/product';

import DialogRelatedProduct from './DialogRelatedProduct.vue';

export default {
  name: 'DialogProduct',
  mixins: [ProductMixin],
  components: { DialogRelatedProduct },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    product: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      dialog: false,
      isEditRelatedProduct: false,
      selectedRelatedProduct: null,
      selectedRelatedIndex: -1,
      categories: [],
      units: [],
      specialPriceOptions: [
        {
          label: 'Harga per-paket',
          value: 1,
        },
        {
          label: 'Harga per-jumlah beli',
          value: 2,
        },
      ],
      id: null,
      code: null,
      name: null,
      selectedCategory: null,
      selectedUnit: null,
      unitName: null,
      stock: null,
      buyPrice: null,
      sellPrice: null,
      isOpenPrice: false,
      specialPrices: [
        {
          priceOption: null,
          sellPrice: null,
          quantityMultiplier: null,
        },
      ],
      relatedProductIDs: [],
      relatedProducts: [
        {
          id: -1,
          name: null,
          unit: {
            id: null,
            name: null,
          },
        },
      ],
    };
  },
  mounted() {
    this.getCategories();
    this.getUnits();
  },
  computed: {
    currentTitle() {
      if (this.isEdit) return 'Edit Produk';
      return 'Tambah Produk';
    },
  },
  watch: {
    selectedUnit(val) {
      if (val !== null) {
        this.unitName = val.name;
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
    closeDialogRelatedProduct() {
      this.dialog = false;
      this.isEditRelatedProduct = false;
      this.selectedRelatedProduct = null;
    },
    closeDialog() {
      this.clearAllInput();
      this.$emit('close-dialog');
    },
    parseEditData() {
      if (this.product === null) {
        this.clearAllInput();
        return;
      }
      this.getExistingData();
    },
    clearAllInput() {
      this.id = null;
      this.code = null;
      this.name = null;
      this.selectedCategory = null;
      this.selectedUnit = null;
      this.unitName = null;
      this.stock = null;
      this.buyPrice = null;
      this.sellPrice = null;
      this.isOpenPrice = false;
      this.specialPrices = [
        {
          priceOption: null,
          sellPrice: null,
          quantityMultiplier: null,
        },
      ];
      this.relatedProductIDs = [];
      this.relatedProducts = [
        {
          id: -1,
          name: null,
          unit: {
            id: null,
            name: null,
          },
        },
      ];
    },
    getExistingData() {
      const product = this.$_.cloneDeep(this.product);
      this.id = product.id;
      this.code = product.code;
      this.name = product.name;
      this.selectedCategory = product.category;
      this.selectedUnit = product.unit;
      this.unitName = product.unit.name;
      this.stock = product.quantity;
      this.buyPrice = product.buyPrice;
      this.sellPrice = product.sellPrice;
      this.relatedProductIDs = product.relatedProductIDs;
      this.isOpenPrice = product.isOpenPrice;
      if (this.product.productPrices.length > 0) {
        this.specialPrices = product.productPrices;
      }
      if (this.relatedProductIDs !== null && this.relatedProductIDs.length > 0) {
        const url = config.apiURL.concat(`/products/ids/`).concat(this.relatedProductIDs.join(','));
        this.$http
          .get(url)
          .then(resp => {
            const { data } = resp;
            if (data.code === 200) {
              this.relatedProducts = data.data.map(item => this.getProductFromResponse(item));
              this.addEmptyRelatedProduct();
            }
          })
          .catch(err => {
            console.log(err);
            const { data } = err.response;
            if (data.code === 404) {
              console.log(`Produk tidak ditemukan`);
            } else {
              console.log('Server error');
            }
          });
      }
    },
    getCategories() {
      const url = config.apiURL.concat(`/categories`);
      this.$http
        .get(url)
        .then(resp => {
          const { data } = resp;
          this.categories = data.data.map(item => ({
            id: item.id,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            deletedAt: item.deleted_at,
            name: item.name,
          }));
        })
        .catch(err => {
          const { data } = err.response;
          if (data.code === 404) {
            console.log(`Produk tidak ditemukan`);
          } else {
            console.log('Server error');
          }
          this.loading = false;
        });
    },
    getUnits() {
      const url = config.apiURL.concat(`/units`);
      this.$http
        .get(url)
        .then(resp => {
          const { data } = resp;
          this.units = data.data.map(item => ({
            id: item.id,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            deletedAt: item.deleted_at,
            code: item.code,
            name: item.name,
          }));
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
    addNewSpecialPrice(index, productPrice) {
      this.$set(this.specialPrices, index, productPrice);
      this.specialPrices.push({
        priceOption: null,
        sellPrice: null,
        quantityMultiplier: null,
      });
    },
    addEmptyRelatedProduct() {
      this.relatedProducts.push({
        id: -1,
        name: null,
        unit: {
          id: null,
          name: null,
        },
      });
    },
    deleteSpecialPrice(item) {
      const index = this.specialPrices.indexOf(item);
      this.specialPrices.splice(index, 1);
    },
    isBtnAddNewSpecialPriceDisabled(index) {
      const lastIndex = this.specialPrices.length - 1;
      const isAllNull =
        this.specialPrices[lastIndex].priceOption === null ||
        this.specialPrices[lastIndex].sellPrice === null ||
        this.specialPrices[lastIndex].quantityMultiplier === null;
      if (this.specialPrices.length > 1) {
        return index !== lastIndex;
      }
      return isAllNull;
    },
    openDialogRelatedProduct(index, product) {
      this.selectedRelatedIndex = index;
      this.selectedRelatedProduct = product;
      if (this.selectedRelatedProduct !== null) {
        this.isEditRelatedProduct = true;
      }
      this.dialog = true;
    },
    addRelatedProduct(product) {
      const index = this.relatedProducts.length - 1;
      this.$set(this.relatedProducts, index, product);
      this.relatedProducts.push({
        id: -1,
        name: null,
        unit: {
          id: null,
          name: null,
        },
      });
      this.relatedProductIDs.push(product.id);
    },
    editRelatedProduct(index, product) {
      this.$set(this.relatedProducts, index, product);
      this.$set(this.relatedProductIDs, index, product.id);
    },
    deleteRelatedProduct(product) {
      this.$swal({
        title: 'Anda yakin menghapus produk berkaitan ini?',
        text: `Hapus ${product.name} dari produk berkaitan`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus saja!',
        cancelButtonText: 'Batal',
      }).then(result => {
        if (result.isConfirmed) {
          let index = this.relatedProducts.indexOf(product);
          this.relatedProducts.splice(index, 1);
          index = this.relatedProductIDs.indexOf(product.id);
          this.relatedProductIDs.splice(index, 1);
        }
      });
    },
    addProduct() {
      const cloneData = this.$_.cloneDeep(this.$data);
      const parsedProduct = this.parseToProductJSONRequest(cloneData);
      const url = config.apiURL.concat(`/products`);
      const axiosConfig = {
        headers: { Authorization: `Bearer ${this.$store.getters.token}` },
      };
      const req = this.$http.post(url, parsedProduct, axiosConfig);
      req
        .then(resp => {
          const { data } = resp;
          console.log(data);
          if (data.code === 201) {
            this.$swal('Produk berhasil dibuat!', 'Oke!', 'success');
            this.closeDialog();
          }
        })
        .catch(err => {
          console.log(err.response);
          const { data } = err.response;
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          });
        });
    },
    saveProduct() {
      const cloneData = this.$_.cloneDeep(this.$data);
      const parsedProduct = this.parseToProductJSONRequest(cloneData);
      const url = config.apiURL.concat(`/products`);
      const axiosConfig = {
        headers: { Authorization: `Bearer ${this.$store.getters.token}` },
      };
      const req = this.$http.put(url.concat(`/${parsedProduct.id}`), parsedProduct, axiosConfig);
      req
        .then(resp => {
          const { data } = resp;
          console.log(data);
          if (data.code === 200) {
            this.$swal('Produk berhasil diubah!', 'Oke!', 'success');
            this.closeDialog();
          }
        })
        .catch(err => {
          console.log(err.response);
          const { data } = err.response;
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          });
        });
    },
    confirmDeleteProduct() {
      const cloneData = this.$_.cloneDeep(this.$data);
      const parsedProduct = this.parseToProductJSONRequest(cloneData);
      this.$swal({
        title: 'Anda yakin menghapus produk ini?',
        text: `Hapus ${parsedProduct.name} dari daftar produk`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus saja!',
        cancelButtonText: 'Batal',
      }).then(result => {
        if (result.isConfirmed) {
          this.deleteProduct();
        }
      });
    },
    deleteProduct() {
      const cloneData = this.$_.cloneDeep(this.$data);
      const parsedProduct = this.parseToProductJSONRequest(cloneData);
      const url = config.apiURL.concat(`/products`);
      const axiosConfig = {
        headers: { Authorization: `Bearer ${this.$store.getters.token}` },
      };
      const req = this.$http.delete(url.concat(`/${parsedProduct.id}`), axiosConfig);
      req
        .then(resp => {
          const { data } = resp;
          console.log(data);
          if (data.code === 200) {
            this.$swal('Produk berhasil dihapus!', 'Oke!', 'success');
            this.closeDialog();
          }
        })
        .catch(err => {
          console.log(err.response);
          const { data } = err.response;
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          });
        });
    },
    test() {
      console.log('test');
    },
  },
};
</script>

<style lang="scss" scoped>
.subtitle {
  display: inline-block;
  margin-top: 20px;
}
.related-product-text {
  text-align: center;
}
.container {
  max-width: 90%;
  max-height: 500px;
  overflow: auto;
}
@media (min-width: 960px) {
  .container {
    max-width: 900px;
  }
}
</style>