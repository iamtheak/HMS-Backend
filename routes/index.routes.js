const router = require("express").Router();


const loginRoute = require('./login.route')
const signUpRoute = require('./signup.route');
const dashboardRoute = require('./dashboard.route');
const roomRoutes = require('./room.route');
const staffRoutes = require('./staff.route');
const feedbackRoutes = require('./feedback.routes');
const billingRoute = require('./billing.route');
const maintenanceRoute = require('./maintenance.route');
const allocateRoom = require('./allocateRoom.routes');
const resetPassword = require('./resetPassword.route');


router.use(loginRoute)
router.use(signUpRoute)
router.use(dashboardRoute)
router.use(roomRoutes)
router.use(staffRoutes)
router.use(feedbackRoutes)
router.use(billingRoute);
router.use(maintenanceRoute);
router.use(allocateRoom);
router.use(resetPassword);


module.exports = router;