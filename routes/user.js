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

router.get("/categories", (req, res) => {
  const allCategories = `select * from categories`;
  pool.query(allCategories, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  })
});

router.get("/brands", (req, res) => {
  const brandsWithStock = `select * from brand where id in (select distinct brandid from feedstock where storeid != 0);`;
  pool.query(brandsWithStock, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/model/:id/:storeid", (req, res) => {
  const { id, storeid } = req.params;
  const query = `select m.id, m.brandid, m.name, m.modelno, (select count(id) from feedstock where modelid = m.id and storeid != 0) as count from model m where m.brandid = ?;`
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/color/:modelid/:storeid", (req, res) => {
  const { modelid, storeid } = req.params;
  // (select count(id) from feedstock where modelid = f.modelid and storeid != 0 and storeid != f.storeid and color = f.color) as count 
  const query = `SELECT f.color, count(id) as count FROM feedstock f where f.modelid = ? and f.storeid != 0 group by f.color;`
  pool.query(query, [modelid], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    }
  );
});

router.get("/store/:id/:color", (req, res) => {
  const { id, color }  = req.params;
  pool.query(`select * from feedstock where modelid = ? and color = ? and storeid != 0;`,
    [id, color],
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

router.get("/store/:modelid/:color/:storeid", (req, res) => {
  const { modelid, color, storeid }  = req.params;
  // (select count(id) from feedstock where modelid = f.modelid and storeid != 0 and storeid != ? and color = f.color) as count,
  const query = `SELECT f.color, count(id) as count, (select name from store where id = f.storeid) as storename, f.storeid, f.modelid
    FROM feedstock f where f.modelid = ? and  f.color = ? and f.storeid != 0 group by f.storeid;`
  pool.query(query, [modelid, color], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json([]);
      } else {
        res.status(200).json(result);
      }
    }
  );
});

// router.get("/demand-all/:storeid", (req, res) => {
//   const { storeid } = req.params;
//   const query = `select * from demand d where d.storeid`
// })
router.get("/storeAllButMe/:id", (req, res) => {
  const { id } = req.params;
  const query = `select id, name from store where id != ?;select imeino from feedstock where storeid = ? order by imeino;`;
  pool.query(query, [id, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([ [], [] ]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/storeAllButMeBarCode/:id", (req, res) => {
  const {
    id
  } = req.params;
  const query = `select id, name from store where id != ?;`;
  pool.query(query, [id, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/stock/:storeid/:modelid/:color", (req, res) => {
  const {
    storeid,
    modelid,
    color
  } = req.params;
  const queries = `select count(id) as stock from feedstock where modelid = ? and storeid = ? and color = ?;select * from feedstock where modelid = ? and storeid = ?;select * from store where id = ?;`;
  pool.query(
    queries,
    [modelid, storeid, color, modelid, storeid, storeid],
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
  const { imeino, receiverid, senderid, person } = req.body;
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
        const transferQuery = `insert into transfers (senderid, receiverid, imeino, date, person) values (?,?,?,now(),?)`;
        pool.query(
          transferQuery,
          [senderid, receiverid, imeino, person],
          err => {
            if (err) {
              console.log(err);
              res.json(false);
            } else {
              res.json(true);
            }
          }
        );
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
  pool.query(query, [imeino, senderid], (err, result) => {
    if (err) {
      console.log(err);
      res.json(false);
    } else if (result.affectedRows == 0) {
      res.json("not found");
    } else {
      const transferQuery = `insert into sold (storeid, imeino, date) values (?,?, CURRENT_DATE())`;
      pool.query(transferQuery, [senderid, imeino], err => {
        if (err) {
          console.log(err);
          res.json(false);
        } else {
          res.json("sold");
        }
      });
    }
  });
});

router.get("/dailyReportSold/:storeid", (req, res) => {
  const { storeid } = req.params;
  const query = `select s.*, (select modelno from model where id = (select modelid from feedstock where imeino = s.imeino)) as modelno from sold s where storeid = ? and date = CURDATE()`;
  pool.query(query, [storeid], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json([]);
    } else {
      res.status(200).json(result);
    }
  });
});

router.post("/productReturn", (req, res) => {
  console.log(req.body);
  const {
    imeino,
    storeid,
    reason
  } = req.body;

  const auth = `select imeino from sold where imeino = ? and storeid = ? and status = 'fresh'`;

  pool.query(auth, [imeino, storeid], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(false);
    } else if (result.length == 0) {
      res.status(200).json("not found");
    } else if (result.length > 0) {
      const bigQuery = `
        update feedstock set selled = 'false', storeid = ?, storename = (select name from store where id = ?) where imeino = ?;
        insert into returns(storeid, imeino, date, reason) values (?, ?, now(), ?);
        update sold set status = 'history' where imeino = ? and storeid = ?`;
      pool.query(bigQuery, [storeid, storeid, imeino, storeid, imeino, reason, imeino, storeid], (err, result) => {
        if (err) {
          console.log(err);
          res.json(false);
        } else {
          res.json("true");
        }
      });
    }
  });

})

router.post("/demand", (req, res) => {
  try {
    const { qty, note, current_store_id, receiver_store_id, modelid, color } = req.body;
    const query = `insert into demand 
        (original_qty, current_qty, note, senderid, receiverid, modelid, color, created_date, updated_date) 
        values(?, ?, ?, ?, ?, ?, ?, CURDATE(),CURDATE());`
    console.log('ree', req.body);
    pool.query(query, [qty, qty, note, current_store_id, receiver_store_id, modelid, color], (err, result) => {
      if(err) {
        console.log('/user/demand', err);
        res.json({ result: false, message: 'Internal server error' })
      }
      else {
        res.json({ result: true });
      }
    });
  } catch(e) {
    console.log(e);
    res.json({ result: false, message: 'Internal Error Occurred' });
  }
})
module.exports = router;