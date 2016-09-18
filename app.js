"use strict";
let assert      = require("assert");
let compression = require("compression");
let express     = require("express");
let morgan      = require("morgan");
let pg          = require("pg");
let pgcs        = require("pg-connection-string");
let util        = require("util");

let app = express();

// Make sure vital env vars exist
[
    "NODE_ENV",
    "PORT",
    "DATABASE_URL"
]
.forEach(function(name){
    assert.ok(process.env[name], name + " is not set in env.");
});

// Middleware
app.use(compression());
app.use(morgan(
    process.env.NODE_ENV &&
    process.env.NODE_ENV.indexOf("dev") != -1
    ? "dev" : "combined"
));

// Serve static resources
app.use(express.static(__dirname + "/static"));

// Connect to postgres
let urlConfig = pgcs.parse(process.env.DATABASE_URL);
let dbConfig = util._extend(urlConfig, {
    max: 20,
    idleTimeoutMillis: 10000
});

global.db = new pg.Pool(dbConfig);


// Listen on PORT
console.log("Listening on http://localhost:8080");
app.listen(process.env.PORT);