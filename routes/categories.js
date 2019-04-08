const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'categories';

router.get('*', (req, res, next) => {
    if (req.session.adminId)
        next()
    else
        res.redirect('/admin')
})

router.get('/', (req, res) => {
    res.render(`${table}/new`);
})

router.post('/create', (req, res) => {
    pool.query(`insert into ${table} set ?`, req.body, (err, result) => {
        if (err) throw err;
        else {
            all(res)
        }
    })
})

function all(res) {
    pool.query(`select * from ${table}`, (err, result) => {
        if (err) throw err;
        else {
            res.render(`${table}/all`, {
                data: result
            })
        };
    })
}

router.get('/all', (req, res) => {
    all(res);
})


router.get('/allJSON', (req, res) => {
    pool.query(`select * from ${table}`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(200).json([])
        }
        else {
            res.json(result)
        }
    })
});

router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const queryCheckBrandAssociation = `select * from brand where categoryid = ${id}`;
    pool.query(queryCheckBrandAssociation, (err, brands) => {
        if(err) {
            return res.send("Internal error occurred");
        }
        else if(brands.length) {
            return res.send(`<h3>
                You have ${brands.length} brand associated to this category. Please change their category first.
                <a href="/brand/all">change</a>
            </h3>`);
        }
        else if(brands.length == 0) {
            pool.query(`delete from ${table} where id = ?`, id, (err, result) => {
                if (err) throw err;
                else {
                    all(res)
                }
            });
        }
    });
});

module.exports = router;