const pool = require('./pool');

module.exports = {
    executeQuery: async (query, params) => {
        try {
            return new Promise((resolve, reject) => {
                pool.query(query, params, (err, result) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                })
            })
        } catch(err) {
            console.log("err -> ", err);
            reject(err);
        }
    }
}