var mysql = require('mysql')

const pool = mysql.createPool({
    host: '142.93.211.148',
    user: 'root',
    password: 'Abhishek@0058',
    database: 'inventory',
    multipleStatements: true,
    connectionLimit: 100
})

module.exports = pool; 
