const jwt = require('jsonwebtoken');
const pool = require('./pool.js');

module.exports = {
    verify: (req, res, next) => {
        try {
            const token = req.headers.auth;
            console.log("token -> ", token);
            jwt.verify(token, process.env.JWT_KEY, function (err, payload) {
            console.log('payload', payload);
            if (payload) {
                const getToken = `select * from loggedInUsers where userid = ? and token = ?`;
                pool.query(getToken, [payload.userId, token], (err, result) => {
                    if(err) {
                        return res.json({ error: "Please login again", status: 401 });                
                    }
                    else if(result.length > 0) {
                        next();
                    }
                    else {
                        return res.json({ error: "Please login again", status: 401 });
                    }
                });
            } else {
                return res.json({ error: "Please login again", status: 401 });
            }
        })
        } catch(err) {
            console.log("err", err);
            return res.json({ error: "Internal error occurred", status: 401 });
        }
    },
    createToken: (userId) => {
        return new Promise((resolve, reject) => {
            try {
                jwt.sign({ userId }, process.env.JWT_KEY, (err, token) => {
                    if(err) {
                        reject(err);
                    }
                    resolve(token);
                });
            } catch(error) {
                console.log("createToken -> ", error);
                return reject(null)
            }
        });

    }
}