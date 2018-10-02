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

router.get('/', (req, res) => {
    res.render('model/new');
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
})


// router.get('/details/:id', (req, res) => {
//     const {
//         id
//     } = req.params;
//     var queries = `select s.*, st.name as storename, st.address from stock s, store st where s.modelid = ? and st.id = s.storeid;`
//         + `select m.*, (select name from company where company.id = m.companyid) as company from model m where m.id = ?`
//     pool.query(queries, [id, id], (err, result) => {
//         if (err) throw err;
//         else {
//             res.render('model/details', {
//                 data: result[0],
//                 ...result[1][0]
//             })
//         }
//     })
// })

router.get('/edit/:id', (req, res) => {
    const {
        id
    } = req.params;
    pool.query(`select id, name, brandid, modelno, (select name from brand where brand.id = ${table}.brandid) as brand from ${table} where id = ?`, id, (err, result) => {
        if (err) throw err;
        else {
            res.render('model/edit', { ...result[0]
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