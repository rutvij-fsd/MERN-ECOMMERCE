const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this-is-sample-public_id",
      url: "imageUrl",
    },
  });

  sendToken(user, 201, res);
});

//Login a user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if the user has entered email and password
  if (!email || !password) {
    return next(new ErrorHandler("Please enter your email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invaild Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invaild Email or Password", 401));
  }

  sendToken(user, 200, res);
});
