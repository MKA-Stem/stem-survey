"use strict";

let assert = require("assert");

module.exports = function(db){
    return function(req, res, next){

        [
            req.body.choice,
            req.body.firstname,
            req.body.lastname,
        ]
        .forEach(val => assert.ok(val));


        db.query(
            "INSERT INTO responses(choice, firstname, lastname, email) VALUES ($1, $2, $3, $4)",
            [req.body.choice, req.body.firstname, req.body.lastname, req.body.email],
            function(err){
                // Handle constraint violations
                if(err && err.constraint){ return next(400); }
                else if (err) {return next(500); }
                
                // Respond nicely
                res.status(200).json({
                    status:"ok"
                });
            }
        );

    };
};