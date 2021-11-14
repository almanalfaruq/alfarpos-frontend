export default {
  methods: {
    getMoneyFromResponse(resp) {
      return {
        id: resp.id,
        amount: resp.amount,
        note: resp.note,
        createdAt: resp.created_at,
      };
    },
  },
};
