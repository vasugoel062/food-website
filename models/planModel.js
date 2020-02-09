const mongoose = require("mongoose");
// Database link
//const config = require("../configs/config");
// database connection
mongoose
  .connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(conn => {
    console.log("Plan DB connected");
    // console.log(conn);
  });

// structure => Plan
const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Name of the plan"],
    unique: true
  },
  rating: {
    type: Number,
    default: 5
  },
  averageRating: {
    type: Number,
    default: 5
  },
  description: {
    type: String,
    default: "Good Plan"
  },
  prefrence: {
    type: String,
    enum: ["Vegan", "Vegetarian", "Non-Veg", "Eggiterian"]
  },
  price: {
    type: Number,
    min: 40
  },
  duration: {
    type: Number,
    default: 30
  },
  cover:{
    type:"String",
    required:true
  },
  pictures:{
    type:[String],
    required:true
  }
});
// model
const planModel = mongoose.model("planModel", planSchema);
module.exports = planModel;
