const { execSync } = require('child_process');

const dependencies = [
  'express',
  'swagger-jsdoc',
  'swagger-ui-express',
  'mongoose',
  'morgan',
  'body-parser',
  'dotenv',
  'cors'
];

dependencies.forEach(dependency => {
  try {
    // Check if the dependency is installed
    execSync("npm list ${dependency}");
    console.log("${dependency} is already installed.");
  } catch (error) {
    // If not installed, install the dependency
    console.log("Installing ${dependency}...");
    execSync("npm install ${dependency}");
    console.log("${dependency} installed successfully.");
  }
});

console.log('All dependencies installed.');