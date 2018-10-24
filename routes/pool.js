var mysql = require('mysql')

const pool = mysql.createPool({
    host: '206.189.143.137',
    user: 'root',
    password: '123',
    database: 'inventory',
    multipleStatements: true,
    connectionLimit: 100
})

module.exports = pool; 