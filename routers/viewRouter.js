const viewRouter = require("express").Router();
const { getHomePage ,getPlansPage,getLoginPage,getSignupPage,userPage,getUpdateUserPage,getPlansDetailsPage} = require("../controllers/viewController");
const{ protectRoute,isUserVerified,logout} = require("../controllers/authController");
viewRouter.use(isUserVerified);
viewRouter.route("").get(getHomePage);
viewRouter.route("/plans").get(protectRoute,getPlansPage);
viewRouter.route("/plans/:id").get(getPlansDetailsPage);
viewRouter.route("/login").get(getLoginPage);
viewRouter.route("/logout").get(logout);
viewRouter.route("/signup").get(getSignupPage);
viewRouter.route("/me").get(protectRoute,userPage);
viewRouter.route("/updateUser").get(protectRoute, getUpdateUserPage);


module.exports = viewRouter;
