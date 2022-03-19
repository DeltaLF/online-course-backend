const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ShopItemSchema = mongoose.Schema({
  quantity: { type: Number, minimum: 0 },
  price: { type: Number, minimum: 0 },
});

const UserSchema = mongoose.Schema({
  shoppingcart: [ShopItemSchema],
  username: {
    type: String,
    unique: true,
    minLength: 3,
  },
  email: {
    type: String,
    unique: true,
    minLength: 3,
  },
  password: {
    type: String,
    require: true,
    minLength: 3,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.New) {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
  }
  return next();
});
UserSchema.methods.comparePassowrd = async function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    return cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
