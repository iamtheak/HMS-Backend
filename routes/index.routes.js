const router = require("express").Router();


const loginRoute = require('./login.route')
const signUpRoute = require('./signup.route');
const roomRoutes = require('./room.route');
const dashboardRoute = require('./dashboard.route');


router.use(loginRoute)
router.use(signUpRoute)
router.use(roomRoutes)
router.use(dashboardRoute)


module.exports = router;