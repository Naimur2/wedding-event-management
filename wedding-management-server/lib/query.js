const dbconfig = require('../config/dbconfig');

const lib = {};

lib.query = (query, callback) => {
    const db = dbconfig.connect();
    db.query(query, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

module.exports = lib;
