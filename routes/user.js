var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.post("/login", function(req, res, next) {
  const { username, password } = req.body;
  pool.query(
    `select * from store where username = ? and password = ?`,
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    }
  );
});

router.get("/allCompaniesAndMobiles", (req, res) => {
  pool.query(`select * from company;select * from mobile;`, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/fetchStores/:mobileid", (req, res) => {
  const { mobileid } = req.params;
  const query = `select s.*, st.name as storename, st.mobile as mobilenumber from stock s, store st where s.mobileid = ? and s.storeid = st.id`;
  pool.query(query, [mobileid], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/fetchStock/:mobileid/:storeid", (req, res) => {
  const { mobileid, storeid } = req.params;
  pool.query(
    `select stock from stock where mobileid = ? and storeid = ?`,
    [mobileid, storeid],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json(0);
      } else if (result.length > 0) {
        res.status(200).json(result[0].stock);
      } else {
        res.status(200).json(0);
      }
    }
  );
});

router.post("/updateQuantity", (req, res) => {
  const { mobileid, quantity, storeid } = req.body;
  pool.query(
    `update stock set stock = stock + ? where storeid = ? and mobileid = ?`,
    [quantity, storeid, mobileid],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json(false);
      } else if(result.affectedRows == 0){
        res.json(false);
      }
      else {
        res.json(true);
      }
    }
  );
});

module.exports = router;
