const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'feedstock';


router.get('*', (req, res, next) => {
    if (req.session.adminId)
        next()
    else
        req.redirect('/admin')
})

router.get('/', (req, res) => {
    res.render(`${table}/new`);
})

router.post('/bulk', (req, res) => {
    const { totalrows, modelid, brandid } = req.body;
    let data = [];
    
    for(let i=1; i<=parseInt(totalrows); i++) {
        data[i-1] = [modelid, brandid, req.body[`imeino${i}`], req.body[`price${i}`], req.body[`color${i}`]];
    }

    const query = `insert into feedstock(modelid, brandid, imeino, price, color) values ?`
    pool.query(query, [data], (err, result) => {
        if(err) {
            console.log(err);
            res.send(`<h3 style="color: red">Error Occurred</h3>`);
        } else {
            res.send(`<h3 style="color: green">Successfully submitted</h3>`)
        }
    });
})

router.post('/create', (req, res) => {
    pool.query(`insert into ${table} set ?`, req.body, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json(false);
        } else {
            res.status(200).json(true);
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
        if (err) throw err;
        else res.json(result)
    })
})

router.get('/all/:modelid', (req, res) => {
    const {
        modelid
    } = req.params;
    const query = `select * from feedstock where modelid = ?`;
    pool.query(query, [modelid], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json([]);
        } else {
            res.status(200).json(result);
        }
    })
})

router.get('/details/:id', (req, res) => {
    const {
        id
    } = req.params;
    const queries = `select s.*, st.address, st.name as storename, m.name, m.modelno, m.color from stock s, store st, mobile m where s.storeid = st.id and s.mobileid = m.id and s.mobileid in (select id from mobile where companyid = ?);` +
        `select name from company where id = ?;`
    pool.query(queries, [id, id], (err, result) => {
        if (err) throw err;
        else {
            res.render(`${table}/details`, {
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
    pool.query(`select *, (select name from brand where brand.id = t.brandid) as brandname, (select name from model where model.id = t.modelid) as modelname from ${table} t where id = ?`, id, (err, result) => {
        if (err) throw err;
        else {
            res.render(`${table}/edit`, { ...result[0]
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