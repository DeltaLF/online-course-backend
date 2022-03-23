const { ReviewModel, CourseModel } = require("../models");
const jwt = require("jsonwebtoken");

module.exports.createReview = async (req, res) => {
  const { content, rating, courseId } = req.body.formValues;
  const token = req.headers["authorization"];
  const decoded = jwt.decode(token.split(" ")[1]);

  const course = await CourseModel.findOne({
    _id: courseId,
  }).populate("reviews");
  if (!course)
    return res.status(400).send({
      success: false,
      message: "fail to create new comment, please log in!",
      error: "unable to find course",
    });
  const newReview = new ReviewModel({
    content,
    rating,
    reviewer: decoded.username,
  });
  course.reviews.push(newReview._id);
  await course.save();
  newReview
    .save()
    .then((result) => {
      res.status(201).send({ success: true, message: "new course created" });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "fail to create new comment, please log in",
        error: err,
      });
    });
};
