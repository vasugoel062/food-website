const planModel = require("../models/planModel");
const userModel = require("../models/userModel");
const bookingModel = require("../models/bookingModel");
const SK = process.env.SK;
const stripe = require('stripe')(SK);
const END_POINT_SECRET= process.env.EPK;
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
    module.exports.createNewBooking = async function(userEmail,planName){
      const user = await userModel.findOne(userEmail);
      const plan = await planModel.findOne(planName);
      const planId = req.body.planId;
      const userId = req.body.userId;
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
    module.exports.createBooking = async function (req,res){
      const sig = request.headers['stripe-signature'];
      let event;
      const endpointSecret = END_POINT_SECRET;
      try{
        event = stripe.webhooks.constructEvent(req.body,sig,endpointSecret);
        if(event.type=="payment_intent.succeeded"){
          const userEmail = event.data.object.customer_email;
          const planName = event.data.object.line_items[0].name;
          await this.createNewBooking(userEmail,planName);
          response.json({received:true});
        }
      }catch(err){
        response.status(400).send(`Webhook Error: ${err.message}`);
      }
    }
