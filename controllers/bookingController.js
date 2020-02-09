const planModel = require("../models/planModel");
const userModel = require("../models/userModel");
const bookingModel = require("../models/bookingModel");
const SK = process.env.SK;
const stripe = require('stripe')(SK);
module.exports.createCheckoutSession=async function(req,res){
    const id = req.params.id;
    const plan = await planModel.findById(id);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          name: plan.name,
          description: plan.description,
          amount: plan.price*100,
          currency: 'inr',
          quantity: 1,
        }],
        success_url: `${req.protocol}://${req.get("host")}/me`,
        cancel_url: `${req.protocol}://${req.get("host")}/login`,
      });
      res.json({
          session
      })
    }
    module.exports.createNewBooking = async function(req,res){
      const planId = req.body.planId;
      const userId = req.body.userId;
      const user = await userModel.findById(userId);
      const plan = await planModel.findById(planId);
      if(user.userBookedPlansId==undefined){
        const order = {
          userId: userId,
          bookedPlan:[
            {
              planId: planId,
              name: plan.name,
              currentPrice: plan.price
            }
          ]
        }
        const newOrder = await bookingModel.create(order);
        user.userBookedPlansId = newOrder["_id"];
        await user.save({validateBeforeSave: false});
        return res.json({
          newOrder,
          success:"New Plan Added"
        })
      }else{
        const order = {
          bookedPlan:[
            {
              planId: planId,
              name: plan.name,
              currentPrice: plan.price
            }
          ]
        }
      }
      const booking = await userModel.findById(user.userBookedPlansId);
      booking.bookedPlan.push(order);
      const newbooking = await bookingModel.findByIdAndUpdate(booking["_id"],booking,{new:true});
      return res.json({
        newbooking,
        success:"New Plan Added"
      });
    }
