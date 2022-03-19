const jwtSign = require("./../config/jwt_config");
const { UserModel } = require("../models");
const {
  registerValidation,
  loginValidation,
} = require("./../validation/userValodation");

module.exports.userRegister = async (req, res) => {
  console.log("reigster a new user");
  const { username, password, email } = req.body;
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const duplicatedUser = await UserModel.findOne({
    $or: [{ email }, { username }],
  });
  if (duplicatedUser) {
    const duplicatedPart = duplicatedUser.email === email ? "Email" : "User";
    return res
      .status(400)
      .send(`${duplicatedPart} has already been registered`);
  }
  const newUser = new UserModel({
    email: email,
    username: username,
    password: password,
  });
  await newUser.save();

  return res.status(201).send({
    jwtToken: jwtSign(newUser),
  });
};

module.exports.userLogin = async (req, res) => {
  // login res should be consistent with register
  console.log("some one is trying to log in");
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { password, email } = req.body;
  const user = await UserModel.findOne({ email: email });
  console.log("find user reuslt", user);
  if (user) {
    user.comparePassowrd(password, (err, isMatch) => {
      if (err) {
        res.status(400).send("error in comparing password");
      } else {
        if (isMatch) {
          return res.status(201).send({
            jwtToken: jwtSign(user),
          });
        } else {
          return res.status(401).send("wrong password");
        }
      }
    });
  } else {
    return res.status(401).send("wrong email address");
  }
};
