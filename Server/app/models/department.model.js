module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        all_sold_num: Number,
        type_of_medicine:{
            type: String,
            required: true,
            minlength: [3, 'Имя отдела должно содержать минимум 3 символа']
        },
        description: String
      },
      { timestamps: true }
    );
  
    // Переопределяем метод toJSON
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Department = mongoose.model("department", schema);
    return Department;
  };
  