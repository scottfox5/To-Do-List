var express = require("express");
var router = express.Router();

var pg = require("pg");

var config = { database: "to_do_list_db" };

var pool = new pg.Pool(config);

router.get("/", function(req, res) {

  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {
      client.query("SELECT * FROM tasks", function(err, result) {
        done();
        if (err) {
          console.log("Error querying DB", err);
          res.sendStatus(500);
        } else {
          console.log("Got info from DB", result.rows);
          res.send(result.rows);
        }
      });
    }
  });
});

router.post("/", function(req, res) {
  console.log('pet', req.body);
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {
      client.query(
        "INSERT INTO tasks (task) VALUES ($1) RETURNING *;",
        [req.body.task],
        function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            console.log("Got info from DB", result.rows);
            res.send(result.rows);
          }
        }
      );
    }
  });
});

router.put('/:id', function(req, res){
  console.log('updating task', req.body);
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('UPDATE tasks SET task=$2 WHERE id = $1 RETURNING *',
                   [req.params.id, req.body.task],
                   function(err, result){
                     done();
                     if (err) {
                       console.log('Error updating task', err);
                       res.sendStatus(500);
                     } else {
                       res.send(result.rows);
                     }
                   });
    }
  });
})

router.delete('/:id', function(req, res){
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('DELETE FROM tasks WHERE id = $1',
                   [req.params.id],
                   function(err, result){
                     done();
                     if (err) {
                       console.log('Error deleting task', err);
                       res.sendStatus(500);
                     } else {
                       res.sendStatus(204);
                     }
                   });
    }
  });
});

module.exports = router;
