"use strict";
let express      = require("express");
let compression  = require("compression");
let morgan = require("morgan");

let app = express();

// Middleware
app.use(compression());
app.use(morgan(
    process.env.NODE_ENV &&
    process.env.NODE_ENV.indexOf("dev") != -1
    ? "dev" : "combined"
));

// Serve static resources
app.use(express.static(__dirname + "/static"));


// Listen on PORT
console.log("Listening on http://localhost:8080");
app.listen(process.env.PORT || 8080);