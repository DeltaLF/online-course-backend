const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    min: 0,
    default: 0,
  },
  category: {
    type: String,
    enum: ["Design", "Software", "Bussiness", "Photography", "Music", "Others"],
    default: "other",
    require: true,
  },
  content: {
    type: String,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

// CourseSchema.index({ "$**": "text" }); // applying filterType first is more efficiently

module.exports = mongoose.model("Course", CourseSchema);
