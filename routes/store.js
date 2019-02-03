const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'store'

router.get('*', (req, res, next) => {
    if(req.session.adminId)
        next()
    else
    res.redirect('/admin')
})

router.get('/', (req, res) => {
    res.render('store/new');
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
            res.render('store/all', {
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
        else {
            res.json(result)
        };
    })
})


router.get('/details/:id', (req, res) => {
    const {
        id
    } = req.params;
    const queries = `select m.name, m.modelno, m.color, c.name as company, s.* from stock s, store st, mobile m, company c where s.storeid = ? and s.storeid = st.id and  m.id = s.mobileid and m.companyid = c.id;`
        +   `select * from store where id = ?`
    pool.query(queries, [id, id], (err, result) => {
        if (err) throw err;
        else {
            res.render('store/details', {
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
            res.render('store/edit', { ...result[0]
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