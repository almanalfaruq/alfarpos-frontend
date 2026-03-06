<template>
  <v-card class="mt-4" elevation="2">
    <v-card-title class="d-flex align-center flex-wrap">
      <span class="text-h6 font-weight-bold mr-4">Statistik Toko</span>
      <v-spacer></v-spacer>
      <div class="d-flex flex-wrap align-center gap-2 date-inputs" style="gap: 10px">
        <v-menu
          v-model="startDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="formattedStartDate"
              label="Dari Tanggal"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="props"
              density="compact"
              hide-details
              class="date-input"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="startDate"
            @update:model-value="startDateMenu = false; fetchStats()"
            no-title
            scrollable
          ></v-date-picker>
        </v-menu>

        <v-menu
          v-model="endDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="formattedEndDate"
              label="Sampai Tanggal"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="props"
              density="compact"
              hide-details
              class="date-input"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="endDate"
            @update:model-value="endDateMenu = false; fetchStats()"
            no-title
            scrollable
            :min="startDate"
          ></v-date-picker>
        </v-menu>
      </div>
    </v-card-title>
    
    <v-card-text>
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="error" class="d-flex justify-center align-center text-error" style="height: 400px">
        {{ error }}
      </div>
      <div v-else class="chart-container" style="overflow-x: auto; width: 100%;">
        <div style="height: 400px; min-width: 600px; position: relative;">
          <LineChart :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import moment from 'moment'
import axios from 'axios'
import config from '@/config'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'ShopStatsChart',
  components: {
    LineChart: Line
  },
  data() {
    return {
      startDate: new Date(moment().subtract(7, 'days').format('YYYY-MM-DD')),
      endDate: new Date(),
      startDateMenu: false,
      endDateMenu: false,
      loading: false,
      error: null,
      stats: [],
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(value);
              }
            }
          }
        }
      }
    }
  },
  computed: {
    formattedStartDate() {
      return moment(this.startDate).format('DD/MM/YYYY')
    },
    formattedEndDate() {
      return moment(this.endDate).format('DD/MM/YYYY')
    }
  },
  mounted() {
    this.fetchStats()
  },
  methods: {
    async fetchStats() {
      if (!this.startDate || !this.endDate) return
      
      this.loading = true
      this.error = null
      
      try {
        const token = sessionStorage.getItem('token')
        const start = moment(this.startDate).format('YYYY-MM-DD')
        const end = moment(this.endDate).format('YYYY-MM-DD')
        
        const response = await axios.get(`${config.apiURL}/v2/stats/sales`, {
          params: {
            start_date: start,
            end_date: end
          },
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.data && response.data.data) {
          this.stats = response.data.data
          this.processChartData()
        } else {
          this.stats = []
          this.processChartData()
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
        this.error = 'Gagal memuat data statistik'
      } finally {
        this.loading = false
      }
    },
    processChartData() {
      // Sort stats by date just in case
      const sortedStats = [...this.stats].sort((a, b) => new Date(a.date) - new Date(b.date))
      
      const labels = sortedStats.map(stat => moment(stat.date).format('DD MMM'))
      
      const grossProfit = sortedStats.map(stat => stat.gross_profit)
      const netProfit = sortedStats.map(stat => stat.net_profit)
      const moneyIn = sortedStats.map(stat => stat.money_in)
      const moneyOut = sortedStats.map(stat => stat.money_out)
      
      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Keuntungan Kotor',
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            data: grossProfit,
            tension: 0.3
          },
          {
            label: 'Keuntungan Bersih',
            backgroundColor: '#2196F3',
            borderColor: '#2196F3',
            data: netProfit,
            tension: 0.3
          },
          {
            label: 'Uang Masuk',
            backgroundColor: '#FFC107',
            borderColor: '#FFC107',
            data: moneyIn,
            tension: 0.3,
            hidden: true // Hidden by default to avoid clutter
          },
          {
            label: 'Uang Keluar',
            backgroundColor: '#F44336',
            borderColor: '#F44336',
            data: moneyOut,
            tension: 0.3,
            hidden: true // Hidden by default
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.date-input {
  min-width: 200px;
}
@media (max-width: 600px) {
  .date-inputs {
    width: 100%;
    margin-top: 10px;
    flex-direction: column;
    align-items: stretch !important;
  }
  .date-input {
    min-width: unset;
    width: 100%;
  }
}
</style>