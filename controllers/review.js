const { ReviewModel, CourseModel } = require("../models");
const jwt = require("jsonwebtoken");

module.exports.createReview = async (req, res) => {
  console.log("createReview:", req.body);
  const { formValues } = req.body;
  const token = req.headers["authorization"];
  const decoded = jwt.decode(token.split(" ")[1]);
  const newReview = new ReviewModel(formValues);
  console.log(decoded);
  console.log(newReview);
  //   newReview
  //     .save()
  //     .then((result) => {
  //       res.status(201).send({ success: true, message: "new course created" });
  //     })
  //     .catch((err) => {
  //       res.status(400).send({
  //         success: false,
  //         message: "fail to create new course",
  //         error: err,
  //       });
  //     });
};
