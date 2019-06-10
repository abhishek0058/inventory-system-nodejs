
const router = require('express').Router();
var schedule = require('node-schedule');
var exec = require('child_process').exec;


var j = schedule.scheduleJob({ minute: 0, hour: 0 }, function(){
    var child = exec('mysqldump -u root -p inventory > dumpfilename.sql');
});


// router.get('/get-back-up', (req, res) => {
//     if (req.session.adminId) {
//         res.render('admin/home', req.session);
//     } else {
//         res.json({ error: true, message: "Please log-in" });
//     }
// });


module.exports = router;