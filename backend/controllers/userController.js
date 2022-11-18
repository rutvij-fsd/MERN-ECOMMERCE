const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

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

//Logout User
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //Get Reset Password Token
  const resetToken = user.getResetPasswordToken();
  //Save user
  await user.save({ validateBeforeSave: false });
  //Url for resetPassword
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password reset link is: \n\n
  ${resetPasswordUrl}\n\n 
  if you have not requested reset password then, please ignore this email.`;

  try {
    await sendEmail({
      email:user.email,
      subject: `Ecommerce Password Recovery`,
      message
    });
    res.status(200).json({
      success: true,
      message: `Password Reset link is sent to ${user.email} successfully`, 
    });
  } catch (error) {
    user.resetPasswordToken =undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({validateBeforeSave: false});

    return next(new ErrorHandler(error.message,500));
    
  }
});
