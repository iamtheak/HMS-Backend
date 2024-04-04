const router = require("express").Router();


const loginRoute = require('./login.route')
const signUpRoute = require('./signup.route');


router.use(loginRoute)
router.use(signUpRoute)


module.exports = router;