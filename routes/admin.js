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

router.post('/checkLogin', (req, res) => {
    const {
        id,
        password
    } = req.body;
    console.log(req.body)
    var sql = pool.query(`select * from admin where username = ? and password = ?`, [id, password], (err, result) => {
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
    console.log(sql)
})


router.get('/logout', (req, res) => {
    req.session.adminId = null;
    res.redirect('/admin')
});

router.get('/', (req, res) => {
    if (req.session.adminId) {
        res.redirect('/admin/home')
    } else {
        res.render('admin/login', {
            msg: "Please Login"
        })
    }
});

router.get('/change-password', (req, res) => {
    res.render('admin/changePassword');
})

router.post('/change-password', (req, res) => {
    try {
        const { confirm_password, password, current_password } = req.body;
        if(confirm_password != password) {
            return res.send("Password and confirm password is not same")
        }
        pool.query(`select * from admin where password = ?`, current_password, (err, result) => {
            if(err) {
                console.log("err", err);
                res.send('Internal error occurred');
            }
            else if(result.length == 1) {
                const data = { password };
                const query = `update admin set ?`;
                pool.query(query, data, (err, result) => {
                    if(err) {
                        console.log("err", err);
                        res.send('There is some problem completing your request.');
                    }
                    else {
                        res.send("<h2>Successfully changed</h2>");
                    }
                });
            }
            else {
                res.send("Current password is incorrect");
            }
        })
    } catch (error) {
        console.log("error", error);
        res.send('There is some problem completing your request.');
    }
});

module.exports = router;