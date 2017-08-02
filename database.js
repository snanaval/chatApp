var cassDb = require("cassandra-driver");
var Deferred = require("promised-io/promise").Deferred;

var db = new cassDb.Client({ contactPoints: ['127.0.0.1'], keyspace: 'chatapp' });

function createUser(data) {
    var deferred = new Deferred();
    var searchQ = "SELECT user_id from users where user_id=?";
    db.execute(searchQ, [data.userid], function (err, results) {
        if (err) {
            console.log(err);

            return;
        }
        else {

            if (results.rows.length > 0 && results.rows[0].user_id == data.userid) {
                deferred.resolve("User Id " + data.userid + " already exists. Try another one.");
            } else {
                var query = "INSERT INTO users (first_name, last_name, user_id, created_time, password) VALUES (?, ?, ?, ?, ?)";
                db.execute(query, [data.fname, data.lname, data.userid, Date.now(), data.password], function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        deferred.resolve("Hi " + data.fname + " your account is created with the id " + data.userid);
                    };
                });

            }

        }
    })

    return deferred.promise;

}

module.exports = {
    createUser: createUser
}

