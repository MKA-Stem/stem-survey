"use strict";
let assert      = require("assert");
let bodyParser  = require("body-parser");
let compression = require("compression");
let express     = require("express");
let httpStatus  = require("http-status-codes");
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
app.use(bodyParser.json());

// Connect to postgres
let urlConfig = pgcs.parse(process.env.DATABASE_URL);
let dbConfig = util._extend(urlConfig, {
    max: 20,
    idleTimeoutMillis: 10000,
    ssl: true
});

let db = new pg.Pool(dbConfig);

// Serve static resources
app.use(express.static(__dirname + "/static"));

// Serve API
app.post("/api/respond", require("./api/responder")(db));
app.get("/api/options", require("./api/options")(db));

// Handle errors
app.use(function(err, req, res, next){ // eslint-disable-line no-unused-vars
    if(err instanceof assert.AssertionError){
        res.status(400).json({
            status:"err",
            msg:"Request did not validate."
        });
    } else {
        let errStatus = err.status || parseInt(err) || 500;
        res.status(errStatus);
        res.json({
            status:"err",
            msg: httpStatus.getStatusText(errStatus)
        });
    }
});

// Listen on PORT
console.log("Listening on http://localhost:"+process.env.PORT);
app.listen(process.env.PORT);