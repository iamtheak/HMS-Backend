const express = require('express');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

// database
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database Connected!!!"))

mongoose.connection.on('error', err => {
    console.log(`Database Connection Error: ${err.message}`)
})

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'HostelStays Api Services',
        version: '1.0.0',
        description: 'API for a hostel manangement system "HostelStays"',
      },
    },
    apis: ['./routes/*.js', './models/*.js'], // Path to the files containing your route definitions
  };
  
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// import routes
const signupRoutes = require('./routes/signup.route');

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());

// route handling
app.use('/signup', signupRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`A Node JS API is listening on port: ${port}`);
});