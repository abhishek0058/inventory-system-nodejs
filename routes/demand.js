const express = require('express');
const router = express.Router();
const pool = require('./pool');

const table = 'demand';


router.get('*', (req, res, next) => {
    if (req.session.adminId)
        next()
    else
        res.redirect('/admin')
});

router.get('/', (req, res) => {
    res.render('demand/panel');
});

router.get('/all/:storeid', (req, res) => {
    const { storeid } = req.params;
    const query = `select d.*, 
        (select name from store where id = d.senderid) as senderstore,
        (select name from store where id = d.receiverid) as receiverstore,
        (select name from model where id = d.modelid) as modelname
         from demand d where d.receiverid = ? and d.current_qty > 0`;
    pool.query(query, storeid, (err, result) => {
        if(err) {
            console.log('err', err);
            res.json([]);
        }
        else {
            res.json(result);
        }
    })
});

router.post('/bulk-supply', (req, res) => {
    try {
        const errorIMEINO = [], successIMEINO = [];
        const { receiverid, senderid, demand_record_id, totalrows } = req.body;
        console.log("here", req.body);
        let bigQuery = ""
        for(let i=0; i<parseInt(totalrows); i++) {
            const imeino = req.body[`imeino${i+1}`];
            bigQuery += `update feedstock set storeid = ${receiverid}, storename = (select name from store where id = ${receiverid}) where imeino = ${imeino} and storeid = ${senderid};`;
        }

        pool.query(bigQuery, (err, result) => {
            if(err) {
                console.log(err);
                res.send("error occurred");
            }
            else {
                for(let i=0; i<result.length; i++) {
                    const imeino = req.body[`imeino${i+1}`];
                    const person = req.body[`person${i+1}`];
                    if (result[i].affectedRows == 0) {
                        errorIMEINO.push(imeino)
                        console.log('not found', i, imeino);
                    }
                    else {
                        successIMEINO.push(imeino);
                        const transferQuery = `insert into transfers (senderid, receiverid, imeino, date, person) values (?,?,?,CURDATE(),?);`;
                        const updateDemandRecords = `update demand set current_qty = current_qty - 1 where current_qty > 0 and id = ?`;
                        pool.query(transferQuery + updateDemandRecords, [senderid, receiverid, imeino, person, demand_record_id], (err, result) => {
                            if(err) {
                                console.log(err);
                            }
                        })
                    }
                }
                let response = "<table border=1><tbody>"
                for(let j=0; j<errorIMEINO.length; j++) {
                    response += "<tr><td>"+errorIMEINO[j]+"</td><td style='color: red;'>Error</td></tr>"
                }
                for(let j=0; j<successIMEINO.length; j++) {
                    response += "<tr><td>"+successIMEINO[j]+"</td><td style='color: green;'>Success</td></tr>"
                }
                response += "</tbody></table>"
                response = "<a href='/demand' style='padding: 20px;'>Go to Demands panel</a><br>" + response;
                console.log('response', response);
                res.send(response);
            }
        })
    }
    catch(e) {
        console.log(e);
        res.send('error occurred');
    }
});



module.exports = router;