const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'stock'

router.get('*', (req, res, next) => {
    if (req.session.adminId)
        next()
    else
        res.redirect('/admin')
})

router.get('/', (req, res) => {
    res.render('stock/new');
})

router.get('/storeAndIMEINumbers', (req, res) => {
    const queries = `select * from store;SELECT imeino FROM feedstock where storeid = 0 and storename = "Not distributed";`
    pool.query(queries, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json([]);
        } else {
            res.status(200).json(result);
        }
    })
});

router.post('/distribute', (req, res) => {
    const { imeino, storeid } = req.body;
    const query = `update feedstock set storeid = ?, storename = (select name from store where id = ?) where imeino = ?`;
    pool.query(query, [storeid, storeid, imeino], (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).json("false");
        } else {
            res.status(200).json("true");
        }
    })
});

router.post('/bulk', (req, res) => {
    const { store, total } = req.body;

    if(req.body.store == "0") {
        res.send(`You didn't select a store.\nPlease try again`)
    } else {
        let imeiNumbers = [];
        const query = `update feedstock set storeid = ${store}, storename = (select name from store where id = ${store}) where imeino in (?)`;
        for(let i=0; i<parseInt(total); i++) {
            imeiNumbers[i] = [req.body[`imeino${i+1}`]];
        }
        pool.query(query, [imeiNumbers], (err, result) => {
            if(err) {
                console.log(err);
                res.send(`An Error Occurred`);
            } else {
                const responseString = `<h3 style="color: green; margin: 30px">
                    Distribution Successful
                    <a href="/stock"><span style="padding: 20px">Click Here</span></a>
                </h3>`
                res.send(`<h3 style="color: green">Distribution Successful</h3>`);
            }
        })
    }
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