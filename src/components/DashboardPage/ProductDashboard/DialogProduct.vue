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
          :key="index"
          md="3"
          align-self="center"
          justify="center"
        >
          <v-card
            v-if="relatedProduct.id === null"
            height="150px"
            style="display: flex; align-items: center; justify-content: center"
            color="#EEEEEE"
            outlined
            @click="test"
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
            style="display: flex; align-items: center; justify-content: center"
            outlined
            @click="test"
          >
            <div class="d-flex flex-column justify-space-around align-center" style="height: 85%">
              <span>{{ relatedProduct.name }}</span>
              <span>{{ relatedProduct.unit.name }}</span>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn text @click="closeDialog"> Batal </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary"> Simpan </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import config from '@/config';

export default {
  name: 'DialogProduct',
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
      relatedProducts: [
        {
          id: null,
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
      this.unitName = val.name;
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
      this.$emit('close-dialog');
    },
    parseEditData() {
      if (this.product === null) {
        this.clearAllInput();
        return;
      }
      this.code = this.product.code;
      this.name = this.product.name;
      this.selectedCategory = this.product.category;
      this.selectedUnit = this.product.unit;
      this.unitName = this.product.unit.name;
      this.stock = this.product.quantity;
      this.buyPrice = this.product.buyPrice;
      this.sellPrice = this.product.sellPrice;
      if (this.product.productPrices.length > 0) {
        this.specialPrices = this.product.productPrices;
      }
    },
    clearAllInput() {
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
      this.relatedProducts = [
        {
          id: null,
          name: null,
          unit: {
            id: null,
            name: null,
          },
        },
      ];
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
            console.log(`Produk ${this.search} tidak ditemukan`);
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