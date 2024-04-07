const router = require("express").Router();


const loginRoute = require('./login.route')
const signUpRoute = require('./signup.route');
const roomRoutes = require('./room.route');


router.use(loginRoute)
router.use(signUpRoute)
router.use(roomRoutes)


module.exports = router;