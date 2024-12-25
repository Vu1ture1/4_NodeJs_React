module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        cart_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cart_item' }]
      },
      { timestamps: true }
    );
  
    // Переопределяем метод toJSON
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Cart = mongoose.model("cart", schema);
    return Cart;
  };
  