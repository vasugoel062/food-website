const express = require("express");
const bodyParser = require("body-parser");//stripe needs data in form of stream
const cookieParser = require("cookie-parser");
const bookingController = require("./controllers/bookingController")
const app = express();
// const users = require("./data/users");
const planRouter = require("./routers/planRouter");
const userRouter = require("./routers/userRouter");
const viewRouter = require("./routers/viewRouter");
const bookingRouter= require("./routers/bookingRouter");
app.use(cors());
app.use(bodyParser.raw({type: 'application/json'}));
app.post("/Webhooks-checkout",bookingController.createBooking);
// converts buffer to json
app.use(express.json());
// => static files
app.use(express.static("public"));
app.use("/plans",express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
// pug => render
app.set("view engine", "pug");
app.set("views", "views");

app.post("/api/login", function(req, res) {
  console.log(req.body);
  res.json({ data: "User verfied" });
});
app.use("/", viewRouter);

app.use("/api/plans", planRouter);
app.use("/api/users", userRouter);
app.use("/api/bookings",bookingRouter);

// app.get("/plans",);
// createPlans
// plans/1
// plans/2
// app.patch("/plans/:id", );
// createPlan
// app.post("/plans");

// user
//app.get("/users");
const port=process.env.PORT||3000
app.listen(port, () => {
  console.log("Server is listening at port 3000");
});