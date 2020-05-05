const express = require("express")
const router = express.Router();

const { getUserById } = require("../controllers/user")
const { isSignedIn, isAuthenticated } = require("../controllers/auth")
const { getToken, processPayment } = require("../controllers/payment")

router.param("userId", getUserById)

//BUG: Should have better handling for user being signed In
//was not working with isSigned and isAuthenticated
//giving unexpected error
//while likethis it give user not in DB of not signed in
router.get("/payment/gettoken/:userId", getToken)

router.post("/payment/braintree/:userId", isSignedIn, isAuthenticated, processPayment)

module.exports = router