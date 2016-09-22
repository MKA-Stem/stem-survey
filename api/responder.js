"use strict";

let assert = require("assert");

module.exports = function(db, io){
    return function(req, res, next){

        [
            req.body.choice,
            req.body.firstname,
            req.body.lastname,
            req.body.yog
        ]
        .forEach(val => assert.ok(val));


        db.query(
            "INSERT INTO responses(choice, firstname, lastname, email, yog) VALUES ($1, $2, $3, $4, $5)",
            [req.body.choice, req.body.firstname, req.body.lastname, req.body.email, req.body.yog],
            function(err){
                // Handle constraint violations
                if(err && err.constraint){ return next(400); }
                else if (err) {return next(500); }
                
                // Respond nicely
                res.status(200).json({
                    status:"ok"
                });

                // Notify of change
                io.emit("response", {
                    choice: req.body.choice,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    yog: req.body.yog
                });
            }
        );

    };
};