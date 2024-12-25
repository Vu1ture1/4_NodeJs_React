module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        name:{
            type: String,
            required: true,
            minlength: [3, 'Имя медикамента должно содержать минимум 3 символа']
        },
        description: String,
        instruction: String,
        price:{
            type: Number,
            required: true
        },
        med_png: String,
        department: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'department' 
        }
      },
      { timestamps: true }
    );
  
    // Переопределяем метод toJSON
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Med = mongoose.model("med", schema);
    return Med;
  };
  