"use strict";
module.exports = function(db){
    return function(req, res){
        db.query(
            "SELECT * FROM joined_responses ORDER BY id DESC",
            function(err, result){
                res.status(200).json(result.rows);
            }
        );
    };
};