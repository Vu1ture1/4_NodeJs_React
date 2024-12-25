module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        med: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'med' 
        },
        count: Number
      },
      { timestamps: true }
    );
  
    // Переопределяем метод toJSON
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Cart_item = mongoose.model("cart_item", schema);
    return Cart_item;
  };
  