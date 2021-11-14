<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text style="height: 300px">
      <div v-if="monies.length == 0" class="empty-div">
        <h3>Data Kosong</h3>
      </div>
      <v-list-item v-for="item in monies" :key="item.createdAt" three-line>
        <v-list-item-content>
          <v-list-item-title>{{ item.note }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ item.amount }}
          </v-list-item-subtitle>
          <v-list-item-subtitle> {{ item.createdAt }} </v-list-item-subtitle>
          <v-divider inset></v-divider>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="blue darken-1" text @click="closeDialog"> Tutup </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="getMonies"> Refresh </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import config from '@/config';
import MoneyMixin from '@/mixins/money';

export default {
  name: 'DialogTransaction',
  mixins: [MoneyMixin],
  props: {
    type: {
      type: Number,
      default: -1,
    },
    date: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      monies: [],
    };
  },
  computed: {
    title() {
      return this.type === -1 ? 'Uang Keluar' : 'Uang Masuk';
    },
  },
  mounted() {
    this.getMonies();
  },
  watch: {
    type() {
      this.getMonies();
    },
    date() {
      this.getMonies();
    },
  },
  methods: {
    getMonies() {
      const url = config.apiURL.concat(`/money/filters`);
      const params = {
        types: [this.type],
        start_date: this.date,
        end_date: this.date,
      };
      const axiosOptions = {
        headers: { Authorization: `Bearer ${this.$store.getters.token}` },
      };
      this.$http
        .post(url, params, axiosOptions)
        .then(resp => {
          const { data } = resp;
          if (data.code === 200) {
            const monies = data.data.map(item => this.getMoneyFromResponse(item));
            this.monies = monies.map(item => ({
              note: item.note,
              amount: this.formatPrice(item.amount),
              createdAt: this.formatDateFromResponse(item.createdAt),
            }));
          }
        })
        .catch(err => {
          const { data } = err.response;
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          });
        });
    },
    closeDialog() {
      this.$emit('close-dialog');
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>