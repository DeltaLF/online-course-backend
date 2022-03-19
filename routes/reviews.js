const express = require("express");
const catchAsync = require("./../utils/catchAsync");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const { createReview } = require("../controllers/review");

router.route("/").post(isLoggedIn, catchAsync(createReview));

module.exports = router;
