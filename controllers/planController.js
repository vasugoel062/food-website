// const plans = require("../data/plans");
const planModel = require("../models/planModel");

module.exports.checkInput = function(req, res, next) {
  // console.log(req.body);
  if (Object.keys(req.body).length == 0) {
    return res.json({
      data: "Please enter data in post request"
    });
  }
  next();
};
module.exports.deletePlan = async function(req, res) {
  const { id } = req.params;
  const deletedPlan = await planModel.findByIdAndDelete(id);
  res.json({
    deletedPlan
  });
};
module.exports.getPlan = async function(req, res) {
  const { id } = req.params;
  const Plan = await planModel.findById(id);
  res.json({
    Plan
  });
};
// Aliasing
module.exports.queryAdder = function(req, res, next) {
  req.query = {
    price: { gte: "40" },
    sort: "-ratingAverage",
    limit: "5"
  };
  next();
};
module.exports.getAllPlans = async function(req, res) {
  // data save
  const oQuery = { ...req.query };
  console.log(req.query);
  // console.log(oQuery);
  // console.log(typeof oQuery);
  // filtering
  // gt
  // exclude special terms=> sort filter page limit
  var exarr = ["sort", "select", "page", "limit"];
  for (var i = 0; i < exarr.length; i++) {
    delete req.query[exarr[i]];
  }
  var str = JSON.stringify(req.query);
  // console.log(str);
  // regular expressions

  str = str.replace(/gt|gte|lt|lte/g, function(match) {
    return "$" + match;
  });
  // console.log(str);
  const data = JSON.parse(str);
  // "price -averageRating"
  // query build
  // let plans = planModel.find(data).select();
  // query build
  let plans = planModel.find(data);
  if (oQuery.sort) {
    // console.log(oQuery.sort);
    // var sortString = oQuery.sort.split("%");
    // console.log(sortString);
    var sortString = oQuery.sort.split("%").join(" ");
    plans.sort(sortString);
    // console.log(sortString);
  }
  if (oQuery.select) {
    var selectString = oQuery.select.split("%").join(" ");
    // plans.sort(selectString);
    plans.select(selectString);
  }
  //
  const page = Number(oQuery.page) || 1;
  const limit = Number(oQuery.limit) || 2;
  const toSkip = (page - 1) * limit;
  plans = plans.skip(toSkip).limit(limit);
  // execute
  const finalAnswer = await plans;
  res.json({
    finalAnswer
    // data: "reached get all plans"
  });
};
module.exports.updatePlan = async function (req, res) {
  const { id } = req.params;
  const values = req.body;
  //console.log(req.files);
  const cover = req.files.cover[0].filename;
  const pictures=[];
  for(var i=0;i<req.files.pictures.length;i++){
    pictures.push(req.files.pictures[i].filename);
  }
  req.body.cover = cover;
  req.body.pictures = pictures;
  //console.log(req.files.pictures[0]);
  //console.log(req.files);
  const updatedPlan = await planModel.findByIdAndUpdate(id, values, {
    new: true
  });
  res.json({
    success:"Plan updated",
    updatedPlan
  });
};
module.exports.createPlan = async function(req, res) {
  // create plan planModel=> cloud db
  try {
    const plan = req.body;
    const newPlan = await planModel.create(plan);
    res.json({
      newPlan
    });

    // res.json({ err });
  } catch (err) {
    res.json({ err });
  }
};