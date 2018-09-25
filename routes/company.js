const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'company'


router.get('*', (req, res, next) => {
    if (req.session.adminId)
        next()
    else
        req.redirect('/admin')
})

router.get('/', (req, res) => {
    res.render('company/new');
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
            res.render('company/all', {
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
        if (err) throw err;
        else res.json(result)
    })
})


router.get('/details/:id', (req, res) => {
    const {
        id
    } = req.params;
    const queries = `select s.*, st.address, st.name as storename, m.name, m.modelno, m.color from stock s, store st, mobile m where s.storeid = st.id and s.mobileid = m.id and s.mobileid in (select id from mobile where companyid = ?);` 
        +   `select name from company where id = ?;`
    pool.query(queries, [id, id], (err, result) => {
        if (err) throw err;
        else {
            res.render('company/details', {
                data: result[0],
                ...result[1][0]
            })
        }
    })
})

router.get('/edit/:id', (req, res) => {
    const {
        id
    } = req.params;
    pool.query(`select * from ${table} where id = ?`, id, (err, result) => {
        if (err) throw err;
        else {
            res.render('company/edit', { ...result[0]
            })
        }
    })
})


router.post('/update', (req, res) => {
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if (err) throw err;
        else {
            all(res)
        }
    })
})


router.get('/delete/:id', (req, res) => {
    const {
        id
    } = req.params;
    pool.query(`delete from ${table} where id = ?`, id, (err, result) => {
        if (err) throw err;
        else {
            all(res)
        }
    })
})

module.exports = router;