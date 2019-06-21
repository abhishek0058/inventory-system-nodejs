const express = require('express');
const router = express.Router();
const pool = require('./pool');

router.get('/', (req, res) => {
    res.render('loggedInUsers/manage.ejs');
});


router.get('/all', (req, res) => {
    const query = `select id, (select name from store where id = l.userid) as name from loggedInUsers l`;
    pool.query(query, (err, result) => {
        if(err) {
            return res.json({ err: err, data: null });
        }
        return res.json({ data: result});
    });
});

router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = `delete from loggedInUsers where id = ?`;
    pool.query(query, id, (err, result) => {
        if(err) {
            return res.json({ err, status: false });
        }
        return res.json({ status: true });
    });
});

module.exports = router;