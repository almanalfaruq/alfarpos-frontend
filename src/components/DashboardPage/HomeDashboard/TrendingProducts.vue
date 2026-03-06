<template>
  <v-card class="mt-4" elevation="2">
    <v-card-title class="d-flex align-center flex-wrap">
      <span class="text-h6 font-weight-bold mr-4">Produk Terlaris</span>
      <v-spacer class="d-none d-sm-flex"></v-spacer>
      <v-select
        v-model="period"
        :items="periods"
        label="Periode"
        item-title="text"
        item-value="value"
        density="compact"
        hide-details
        class="period-select"
        @update:model-value="fetchTrendingProducts"
      ></v-select>
    </v-card-title>
    
    <v-card-text>
      <div v-if="products.length > 0" class="trending-list-container">
        <v-list class="trending-list">
          <v-list-item
            v-for="(item, index) in products"
            :key="item.product.id"
            :value="item"
            class="mb-2"
          >
          <template v-slot:prepend>
            <div class="text-h6 mr-4 text-grey">{{ index + 1 }}</div>
            <v-avatar size="48" rounded="0" class="mr-2">
              <v-img 
                v-if="item.product.image_url" 
                :src="item.product.image_url" 
                cover
                bg-color="grey-lighten-2"
              ></v-img>
              <v-icon v-else icon="mdi-package-variant-closed" size="large"></v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold">
            {{ item.product.name }}
          </v-list-item-title>
          
          <v-list-item-subtitle>
            Terjual: {{ item.total_sold }} {{ item.product.unit ? item.product.unit.name : 'pcs' }}
          </v-list-item-subtitle>
          
          <template v-slot:append>
            <div class="text-right ml-4">
              <div class="text-subtitle-2 font-weight-bold text-success">
                {{ formatCurrency(item.total_revenue) }}
              </div>
              <div class="text-caption text-grey">Pendapatan</div>
            </div>
          </template>
          </v-list-item>
        </v-list>
      </div>
      
      <div v-else-if="loading" class="text-center py-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      
      <div v-else class="text-center py-4 text-grey">
        Tidak ada data produk terlaris untuk periode ini
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import config from '@/config';
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'TrendingProducts',
  data() {
    return {
      products: [],
      loading: false,
      period: 'month',
    };
  },
  computed: {
    periods() {
      const now = moment();
      return [
        { 
          text: `Minggu Ini (${now.clone().startOf('isoWeek').format('DD MMM')} - ${now.clone().endOf('isoWeek').format('DD MMM')})`, 
          value: 'week' 
        },
        { 
          text: `Bulan Ini (${now.clone().startOf('month').format('DD MMM')} - ${now.clone().endOf('month').format('DD MMM')})`, 
          value: 'month' 
        },
        { 
          text: `Tahun Ini (${now.clone().startOf('year').format('DD MMM YYYY')} - ${now.clone().endOf('year').format('DD MMM YYYY')})`, 
          value: 'year' 
        },
      ];
    }
  },
  mounted() {
    this.fetchTrendingProducts();
  },
  methods: {
    async fetchTrendingProducts() {
      this.loading = true;
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${config.apiURL}/v2/stats/products/trending`, {
          params: { period: this.period },
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data && response.data.data) {
          this.products = response.data.data;
        } else {
          this.products = [];
        }
      } catch (error) {
        console.error('Error fetching trending products:', error);
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    formatCurrency(value) {
      if (!value && value !== 0) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
};
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid #eee;
}
.v-list-item:last-child {
  border-bottom: none;
}
.period-select {
  min-width: 300px;
}
@media (max-width: 600px) {
  .period-select {
    width: 100%;
    min-width: unset;
    margin-top: 10px;
  }
  .trending-list-container {
    overflow-x: auto;
  }
  .trending-list {
    min-width: 500px;
  }
}
</style>