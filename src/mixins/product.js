export default {
  methods: {
    getProductFromResponse(resp) {
      return {
        id: resp.id,
        createdAt: resp.created_at,
        updatedAt: resp.updated_at,
        deletedAt: resp.deleted_at,
        code: resp.code.String,
        name: resp.name,
        buyPrice: resp.buy_price.Int64,
        sellPrice: resp.sell_price.Int64,
        quantity: resp.quantity.Int64,
        category: {
          id: resp.category.id,
          createdAt: resp.category.created_at,
          updatedAt: resp.category.updated_at,
          deletedAt: resp.category.deleted_at,
          name: resp.category.name,
        },
        unit: {
          id: resp.unit.id,
          createdAt: resp.unit.created_at,
          updatedAt: resp.unit.updated_at,
          deletedAt: resp.unit.deleted_at,
          name: resp.unit.name,
          code: resp.unit.code,
          totalPcs: resp.unit.total_pcs,
        },
        imageUrl: resp.image_url,
        discount: resp.discount.Float64,
        relatedProductIDs: resp.related_products,
        productPrices: resp.product_prices.map(data => ({
          id: data.id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          deletedAt: data.deleted_at,
          productID: data.product_id,
          priceOption: data.price_per_packet.Int64 !== 0 ? 1 : 2,
          sellPrice:
            data.price_per_packet.Int64 !== 0
              ? data.price_per_packet.Int64
              : data.price_per_unit.Int64,
          quantityMultiplier: data.quantity_multiplier,
          pricePerPacket: data.price_per_packet.Int64,
          pricePerUnit: data.price_per_unit.Int64,
        })),
        unitAndPrice: `${resp.unit.name} | Rp${resp.sell_price.Int64}`,
        isOpenPrice: resp.is_open_price,
      };
    },
    parseToProductJSONRequest(product) {
      return {
        id: product.id,
        code: {
          String: product.code,
          Valid: product.code !== '',
        },
        name: product.name,
        buy_price: {
          Int64: Number(product.buyPrice),
          Valid: product.buyPrice >= 0,
        },
        sell_price: {
          Int64: Number(product.sellPrice),
          Valid: product.sellPrice >= 0,
        },
        quantity: {
          Int64: Number(product.stock),
          Valid: product.stock >= 0,
        },
        category_id: product.selectedCategory.id,
        unit_id: product.selectedUnit.id,
        image_url: '', // will be filled later if any
        discount: {
          Float64: Number(product.discount),
          Valid: product.discount >= 0,
        },
        related_products: product.relatedProductIDs,
        product_prices:
          product.specialPrices[0].priceOption === null &&
          product.specialPrices[0].quantityMultiplier === null &&
          product.specialPrices[0].sellPrice === null
            ? []
            : product.specialPrices.map(data => ({
                id: data.id,
                quantity_multiplier: Number(data.quantityMultiplier),
                price_per_unit: {
                  Int64: data.priceOption === 2 ? Number(data.sellPrice) : 0,
                  Valid: data.priceOption === 2 && data.sellPrice > 0,
                },
                price_per_packet: {
                  Int64: data.priceOption === 1 ? Number(data.sellPrice) : 0,
                  Valid: data.priceOption === 1 && data.sellPrice > 0,
                },
              })),
        is_open_price: product.isOpenPrice,
      };
    },
  },
};
