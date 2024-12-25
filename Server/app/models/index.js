const dbConfig = require("D:\\NodeJsMongodbProject\\Server\\config\\db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.med = require("./med.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);
db.department = require("./department.model.js")(mongoose);
db.order = require("./order.model.js")(mongoose);
db.cart = require("./cart.model.js")(mongoose);
db.cart_item = require("./cart_item.model.js")(mongoose);

module.exports = db;