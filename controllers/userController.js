const userModel = require("../models/userModel");
module.exports.getAllUsers = async function(req,res){
  const users = await userModel.find();
  res.json({
      "users" :users
  })
};

module.exports.getUser = async function(req, res) {
  const { id } = req.body;
  const user = await userModel.findById(id);
  res.json({ user });
};
module.exports.updateUser = async function(req, res) {
  const id = req.params.id;
  console.log(id);
  console.log(req.body);
  const photo = req.file.filename;
  req.body.photo = photo;
  const user = await userModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true
  });
  //console.log(user);

  res.redirect("/me");
  // const id = user.id;
};
