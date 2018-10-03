const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'model'


router.get('*', (req, res, next) => {
    if (req.session.adminId)
        next()
    else
        req.redirect('/admin')
})

function all(res) {
    pool.query(`select id, name, modelno, (select name from brand where brand.id = ${table}.brandid) as brand from ${table}`, (err, result) => {
        if (err) throw err;
        else {
            res.render('model/all', {
                data: result
            })
        };
    })
}

router.get('/all', (req, res) => {
    all(res);
})

router.get('/allJSON', (req, res) => {
    pool.query(`select id, name, modelno, brandid, (select name from brand where brand.id = ${table}.brandid) as brandname from ${table}`, (err, result) => {
        if (err) throw err;
        else res.json(result)
    })
});

module.exports = router;