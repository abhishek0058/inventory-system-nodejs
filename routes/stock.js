const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'stock'

router.get('*', (req, res, next) => {
    if (req.session.adminId)
        next()
    else
        req.redirect('/admin')
})

router.get('/', (req, res) => {
    res.render('stock/new');
})

router.post('/update', (req, res) => {
    const {
        mobileid,
        stock,
        storeid
    } = req.body;
    pool.query(`select id from ${table} where mobileid = ? and storeid = ?`, [mobileid, storeid], (err, result) => {
        if (err) {
            console.log(err);
            res.send('Server faced an error');
        } else if (result.length > 0) {
            pool.query(`update ${table} set stock = stock + ? where mobileid = ? and storeid = ?`, [stock, mobileid, storeid], (err, result) => {
                if (err) {
                    console.log(err);
                    res.send('Server faced an error');
                } else {
                    res.send('Done')
                }
            })
        } else {
            pool.query(`insert into stock set ?`, req.body, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send('Server faced an error');
                } else {
                    res.send('Done')
                }
            })
        }
    })
})

module.exports = router;