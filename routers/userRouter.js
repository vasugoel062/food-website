const userRouter = require("express").Router();
const multer = require ("multer");
var path=require("path")
var storage = multer.diskStorage({
  filename: function(req,file,cb){
    //console.log(file);
    cb(null, file.fieldname + '-' + Date.now()+".jpeg")
  },destination:function(req,file,cb){
    cb(null,'public');
  }
})
const fileFilter = function(req,file,cb){
  try{
  if(file.mimetype.startsWith("image")){
    cb(null,true)
  }else{
    cb(new Error("Wrong File Format"));
  }}
  catch(err){
    console.log(err);
  }
}
var upload = multer({
  storage: storage,fileFilter
})
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  protectRoute
} = require("../controllers/authController");
const { getUser, updateUser,getAllUsers} = require("../controllers/userController");
userRouter.route("/signup").post(signup);
userRouter.route("").get(getAllUsers);
userRouter.route("/login").post(login);
userRouter.route("/getUser").get(getUser);
userRouter.route("/forgetPassword").patch(forgetPassword);
userRouter.route("/resetPassword").patch(resetPassword);
userRouter.route("/updateUser/:id")
.post(protectRoute, upload.single("photo"),updateUser);
// userRouter.route("/updatePassword").patch(updatePassword);
module.exports = userRouter;
