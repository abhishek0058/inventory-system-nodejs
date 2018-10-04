var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.post("/login", function (req, res, next) {
  const {
    username,
    password
  } = req.body;
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

router.get("/brands", (req, res) => {
  pool.query(`select * from brand;`, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/model/:id", (req, res) => {
  const {
    id
  } = req.params;
  pool.query(`select * from model where brandid = ?;`, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/color/:id", (req, res) => {
  const {
    id
  } = req.params;
  pool.query(`SELECT distinct color FROM feedstock where modelid = ?;`, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/store/:id/:color", (req, res) => {
  const {
    id,
    color
  } = req.params;
  pool.query(`select * from feedstock where modelid = ? and color = ? and storeid != 0;`, [id, color], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/storeAllButMe/:id", (req, res) => {
  const {
    id
  } = req.params;
  const query = `select id, name from store where id != ?;select imeino from feedstock where storeid = ? order by imeino;`;
  pool.query(query, [id, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([[],[]]);
    } else {
      res.status(200).json(result);
    }
  })
})

router.get("/stock/:storeid/:modelid/:color", (req, res) => {
  const {
    storeid,
    modelid,
    color
  } = req.params;
  const queries = `select count(id) as stock from feedstock where modelid = ? and storeid = ? and color = ?;select * from feedstock where modelid = ? and storeid = ?;select * from store where id = ?;`
  pool.query(queries, [modelid, storeid, color, modelid, storeid, storeid], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/fetchStores/:mobileid", (req, res) => {
  const {
    mobileid
  } = req.params;
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
  const {
    mobileid,
    storeid
  } = req.params;
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

router.post("/update", (req, res) => {
  const {
    imeino,
    receiverid,
    senderid
  } = req.body;
  const query = `update feedstock set storeid = ?, storename = (select name from store where id = ?) where imeino = ? and storeid = ?`;
  pool.query(
    query,
    [receiverid, receiverid, imeino, senderid],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json(false);
      } else if (result.affectedRows == 0) {
        res.json(false);
      } else {
        const transferQuery = `insert into transfers (senderid, receiverid, imeino, date) values (?,?,?,now())`;
        pool.query(transferQuery, [senderid, receiverid, imeino], (err) => {
          if (err) {
            console.log(err);
            res.json(false);
          } else {
            res.json(true);
          }
        });
      }
    }
  );
});

router.post("/sold", (req, res) => {
  const {
    imeino,
    receiverid,
    senderid
  } = req.body;
  const query = `update feedstock set storeid = 0, storename = 'Sold' where imeino = ? and storeid = ?;`;
  pool.query(
    query,
    [imeino, senderid],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json(false);
      } else if (result.affectedRows == 0) {
        res.json("not found");
      } else {
        const transferQuery = `insert into sold (storeid, imeino, date) values (?,?, CURRENT_DATE())`;
        pool.query(transferQuery, [senderid, imeino], (err) => {
          if (err) {
            console.log(err);
            res.json(false);
          } else {
            res.json("sold");
          }
        });
      }
    }
  );
});

module.exports = router;