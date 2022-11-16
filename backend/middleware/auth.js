const catchAsyncError = require('./catchAsyncError');
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next)=>{
    const {token} = req.cookie;
    
    if(!token){
        return next(new ErrorHandler("Please Login to access this resource",401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decodedData.id);

    next();
});