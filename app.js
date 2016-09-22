"use strict";
let RateLimit   = require("express-rate-limit");
let assert      = require("assert");
let bodyParser  = require("body-parser");
let compression = require("compression");
let express     = require("express");
let httpStatus  = require("http-status-codes");
let morgan      = require("morgan");
let pg          = require("pg");
let pgcs        = require("pg-connection-string");
let socketIO    = require("socket.io");
let util        = require("util");
let http        = require("http");

let app = express();
let server = http.createServer(app);

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

// Connect socket.io
let io = socketIO(server);

// Serve static resources
app.use(express.static(__dirname + "/static"));

// Rate limit the API
app.use("/api/", new RateLimit({
    windowMs:60*1000, // 1 minute
    max: 60, // max 60 requests/min
    delayMs: 0
}));

// Serve API
app.post("/api/respond", require("./api/responder")(db, io));
app.get("/api/options", require("./api/options")(db));
app.get("/api/responses", require("./api/responses")(db));

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
server.listen(process.env.PORT);