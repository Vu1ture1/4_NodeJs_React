module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        meds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'med' }],
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user' 
        },
        total: Number
      },
      { timestamps: true }
    );
  
    // Переопределяем метод toJSON
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Order = mongoose.model("order", schema);
    return Order;
  };
  


