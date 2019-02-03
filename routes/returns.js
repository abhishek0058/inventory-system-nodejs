const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'returns'


router.get('*', (req, res, next) => {
    if (req.session.adminId)
        next()
    else
        res.redirect('/admin')
})

router.get('/', (req, res) => {
    res.render('returns/all');
});

router.get('/all', (req, res) => {
    const query = `select t.id, t.reason, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from returns t order by date desc`;
    pool.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json([]);
        } else {
            res.status(200).json(result);
        }
    })
});

router.get('/searchByDate/:date1/:date2', (req, res) => {
    const {
        date1,
        date2
    } = req.params;
    const query = `select t.id, t.reason, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from returns t where date between ? and ?  order by date desc`;
    pool.query(query, [date1, date2], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json([]);
        } else {
            res.status(200).json(result);
        }
    })
});

router.get('/store/:id', (req, res) => {
    const {
        id
    } = req.params;
    const query = `select t.id, t.reason, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from returns t where storeid = ?  order by date desc`;
    var sql = pool.query(query, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json([]);
        } else {
            res.status(200).json(result);
        }
    })
    console.log(sql);

});


router.get('/onDate/:date', (req, res) => {
    const {
        date
    } = req.params;
    const query = `select t.id, t.reason, t.storeid, t.imeino, (select modelno from model where id = (select modelid from feedstock where imeino = t.imeino)) as modelno, (select name from store where id = t.storeid ) as store, t.date from returns t where t.date = ?`;
    var sql = pool.query(query, [date], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json([]);
        } else {
            res.status(200).json(result);
        }
    })
    console.log(sql);

});

module.exports = router;