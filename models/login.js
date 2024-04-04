const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *           default: jsmith@gmail.com
 *         password:
 *           type: string
 *           description: User's password
 *           default: Ajahdfjhgd@123
 */

const userSchema = new Schema({
    
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50
    },
    password: {
      type: String,
      required: true,
      maxlength: 255
    }
  },
  {collection:"Users"}
  );
  
  // create and export User model based on the schema
  const Login = mongoose.model('Login', userSchema);
  module.exports = Login;