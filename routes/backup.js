
const router = require('express').Router();
var schedule = require('node-schedule');
var exec = require('child_process').exec;

const shellScript = `mysqldump -u root -p${process.env.DB_PASSWORD} ${process.env.DB_PROJECT} > db_backup.sql`;

var j = schedule.scheduleJob({ second: 0 }, function(){
    var child = exec(shellScript);
});


// router.get('/get-back-up', (req, res) => {
//     if (req.session.adminId) {
//         res.render('admin/home', req.session);
//     } else {
//         res.json({ error: true, message: "Please log-in" });
//     }
// });


module.exports = router;