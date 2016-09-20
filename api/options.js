"use strict";
module.exports = function(db){
    return function(req, res, next){
        db.query("SELECT id, name, description FROM options",
            function(err, result){
                if(err){ next(500); }
                else {
                    res.status(200).json({
                        "status": "ok",
                        "options": result.rows
                    });
                }
            }
        );
    };
};