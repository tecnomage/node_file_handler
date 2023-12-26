/**
 * @fileoverview This file contains the main server code for handling file endpoints.
 * @module index
 */

"use strict";

const express = require("express");
const { setupEndpoints } = require("./controllers/files.js");
const { fileEndPoints } = require("./controllers/db/index.js");

// Create the express app
const app = express();
app.use(express.json());
/**
 * Sets up the endpoints for handling file operations.
 * @function
 * @name setupEndpoints
 * @memberof module:index
 * @param {Object} app - The express app object.
 * @returns {void}
 */
setupEndpoints(app);
fileEndPoints(app);

/**
 * Handles the 404 error.
 * @function
 * @name fourOhFourHandler
 * @memberof module:index
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.use(function fourOhFourHandler(req, res) {
  res.status(404).send();
});

/**
 * Handles the 500 error.
 * @function
 * @name fiveHundredHandler
 * @memberof module:index
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
app.use(function fiveHundredHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send();
});

/**
 * Starts the server on the specified port.
 * @function
 * @name startServer
 * @memberof module:index
 * @param {number} port - The port number to listen on.
 * @returns {void}
 */
function startServer(port) {
  app.listen(port, function (err) {
    if (err) {npm
      return console.error(err);
    }

    console.log(`Started at http://localhost:${port}`);
  });
}

startServer(1234);
