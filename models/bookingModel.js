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
    console.log("Booking DB connected");
    // console.log(conn);
  });
  const bookedPlanSchema= mongoose.Schema({
      planId:{
          type: String,
          require:true
      },
      name: {
        type: String,
        required: [true, "Please enter Name of the plan"],
        unique: true
      },
      currentPrice:{
        type: Number,
        min: 40
      },
      bookedOn:{
          type:String,
          default:Date.now()
      }
  })
  const BookingSchema = new mongoose.Schema({
      userId:{
          type: String,
          required:true,
      },
      bookedPlan: {
          type: [bookedPlanSchema],//embedding the model
          required:true
      }
  });
  const BookingModel = mongoose.model("bookingModel", BookingSchema);
module.exports = BookingModel;