const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    requrie: true,
  },
  rate: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
