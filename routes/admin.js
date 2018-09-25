const express = require('express');
const router = express.Router();
const pool = require('./pool');

const tableName = 'admin'

router.get('/home', (req, res) => {
    if (req.session.adminId) {
        res.render('admin/home', req.session)
    } else {
        res.render('admin/login', {
            msg: "Please Login"
        })
    }
})

router.get('/', (req, res) => {
    if (req.session.adminId) {
        res.redirect('/admin/home')
    } else {
        res.render('admin/login', {
            msg: "Please Login"
        })
    }
})

router.post('/checkLogin', (req, res) => {
    const {
        id,
        password
    } = req.body;
    pool.query(`select * from admin where id = ? and password = ?`, [id, password], (err, result) => {
        if (err) throw err;
        else if (result.length) {
            req.session.adminId = result[0].id;
            req.session.adminName = result[0].name;
            res.redirect('/admin/home')
        } else {
            console.log(result)
            res.render('admin/login', {
                msg: "Wrong Credentials"
            })
        }
    })
})


router.get('/logout', (req, res) => {
    req.session.adminId = null;
    res.redirect('/admin')
})

module.exports = router;