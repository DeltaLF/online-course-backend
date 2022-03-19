const express = require("express");
const catchAsync = require("./../utils/catchAsync");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const {
  fetchCourse,
  fetchCourses,
  createCourse,
  subscribeCourse,
  unsubscribeCourse,
  editCourse,
} = require("../controllers/course");

router
  .route("/")
  .get(catchAsync(fetchCourses))
  .post(isLoggedIn, catchAsync(createCourse));

router
  .route("/:courseId/subscribe")
  .post(isLoggedIn, catchAsync(subscribeCourse))
  .delete(isLoggedIn, catchAsync(unsubscribeCourse));

router.put("/:courseId/edit", isLoggedIn, editCourse);

router.get("/:courseId", fetchCourse);

module.exports = router;
