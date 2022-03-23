const express = require("express");
const router = express.Router();
const { userRegister, userLogin } = require("../controllers/auth");
const catchAsync = require("./../utils/catchAsync");
const { isLoggedIn } = require("../middleware");

router.get("/testapi", isLoggedIn, (req, res) => {
  const msgObj = {
    message: "api work",
  };
  return res.json(msgObj);
});

router.post("/register", catchAsync(userRegister));
router.post("/login", catchAsync(userLogin));
module.exports = router;
