const mongoose = require("mongoose");
const validator = require("validator");
// Database link
//const config = require("../configs/config");
// nodejs inbuilt module
const crypto=require("crypto");
// database connection
mongoose
  .connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(conn => {
    console.log("User  DB connected");
    // console.log(conn);
  });

// structure => Plan
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    minlength: 8,
    required:true
  },
  confirmPassword: {
    type: String,
    minlength: 8,
    validate: function() {
      return this.password == this.confirmPassword;
    }
    ,required:true
  },
  email: {
    type: String,
    unique: true,
    validate: validator.isEmail
  },
  role: {
    type: String,
    enum: ["admin", "restaurant Owner", "user"],
    default: "user"
  },
  phone: {
    type: Number
  },
  photo: {
    type: String,
    default: "default.jpg"
  },
  token:String,
  userBookedPlansId:{
    type: String
  }
});

userSchema.pre("save", function() {
  // encrypt => password
  // confirm => remove from db
  this.confirmPassword = undefined;
  // this.token=undefined;
});

userSchema.method("generateToken",function(){
  // DB
  const token=crypto.randomBytes(32).toString("hex");
  this.token=token;
  
  // email
  // console.log(this);
  return token;
})
//model
const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
