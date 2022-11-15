const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name"],
    minLength: [4, "Name should be at least 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
});

userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    next();
  }

  this.password = await bcrypt.hash(this.password,10);
  
})

module.exports = mongoose.model("User", userSchema);
