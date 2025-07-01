require("dotenv").config();
const User = require("../models/user");
const register = async (req, res, next) => {
  try {
    const exist = await User.exists({ email: req.body.email });
    if (exist) {
      return res.status(400).json({
        EM: "Email already exists",
        ER: 0,
      });
    }
    const response = await User.create(req.body);
    return res.status(201).json({
      response,
      EM: "User registered successfully",
      ER: 0,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
    register,
}