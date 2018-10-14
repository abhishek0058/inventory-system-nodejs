const json2xls = require('json2xls');
const express = require('express');
const router = express.Router();
const pool = require('./pool');

router.use(json2xls.middleware);

router.get('/', (req, res) => {
    res.render('dailyreport/index');
});

router.get('/transfer/:date', (req, res) => {
    const {
        date
    } = req.params;
    const query = `select t.id, t.person, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.senderid ) as sender, (select name from store where id = t.receiverid ) as receiver, t.date from transfers t where t.date = ?`;
    pool.query(query, [date], (err, result) => {
        if (err) {
            console.log(err);
            res.send('Error Occurred');
        } else {
            res.xls(`${(new Date()).toLocaleDateString()} - transfer report.xlsx`, result);
        }
    })
});

router.get('/sold/:date', (req, res) => {
    const {
        date
    } = req.params;
    const query = `select t.id, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from sold t where t.date = ?`;
    pool.query(query, [date], (err, result) => {
        if (err) {
            console.log(err);
            res.send('Error Occurred');
        } else {
            res.xls(`${(new Date()).toLocaleDateString()} - Sold report.xlsx`, result);
        }
    })
});

module.exports = router;