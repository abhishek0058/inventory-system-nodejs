const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'feedstock'
router.get('/IMEI', (req, res) => {
    res.render('search/IMEI');
})
router.get('/searchJSON', (req, res) => {
    pool.query(`select * from ${table}`, (err, result) => {
        if (err) throw err;
        else {
            res.json(result)
        };
    })
})

module.exports = router;