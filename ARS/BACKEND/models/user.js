const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 35,
    },
    password: {
      type: String,
      required: true,
      minlength: 10,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => {
          `${props.value} is not a valid email address`;
        },
      },
    },
    role:{
      type:String,
      enum :["reviewee" , "reviewer" , "admin"],
      default: "reviewee",
    }
  },
  { timestamps: true }
);
const User = mongoose.model("users", userSchema);
module.exports = User;
