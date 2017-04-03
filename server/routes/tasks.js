var express = require("express");
var router = express.Router();
var pg = require("pg");
// var config = { database: "to_do_list_db" };
var config = process.env.DATABASE_URL || { database: "to_do_list_db" }
var pool = new pg.Pool(config);

router.get("/", function(req, res) {
  // trying to connect SQL database for heroku deployment
  // pg.defaults.ssl = true;
  // pg.connect(config, function(err, client) {
  //   if (err) throw err;
  //   console.log('Connected to postgres! Getting schemas...');
  //
  //   client.query("SELECT * FROM tasks ORDER BY complete ASC")
  //     .on('row', function(row) {
  //       console.log('Row:', JSON.stringify(row));
  //     });
  // });

  pg.defaults.ssl = true;
  pg.connect(config, function(err, client, done) {
    if (err) throw err;
    console.log('Connected to postgres! Getting schemas...');

    // client.query("SELECT * FROM tasks ORDER BY complete ASC")
    //   .on('row', function(row) {
    //     console.log('Row:', JSON.stringify(row));
    //   });
          client.query("SELECT * FROM tasks ORDER BY complete ASC", function(err, result) {
            done();
            if (err) {
              console.log("Error querying DB", err);
              res.sendStatus(500);
            } else {
              console.log("Got info from DB", result.rows);
              res.send(result.rows);
            }
          });
  });

  // pool.connect(function(err, client, done) {
  //   pg.defaults.ssl = true;
  //   if (err) {
  //     console.log("Error connecting to DB", err);
  //     res.sendStatus(500);
  //     done();
  //   } else {
  //     console.log('Connected to postgres! Getting schemas...');
  //     client.query("SELECT * FROM tasks ORDER BY complete ASC", function(err, result) {
  //       done();
  //       if (err) {
  //         console.log("Error querying DB", err);
  //         res.sendStatus(500);
  //       } else {
  //         console.log("Got info from DB", result.rows);
  //         res.send(result.rows);
  //       }
  //     });
  //   }
  // });
});

router.post("/", function(req, res) {

  req.body.complete = false; // setting complete to false when task is added
  req.body.updated = new Date(); // setting date/time when task is added
  req.body.list_id = 1; // setting list id, TODO add ability to have multiple lists with different ids
  console.log('Adding Task:', req.body);

  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {
      client.query(
        "INSERT INTO tasks (task, notes, complete, updated, list_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [req.body.task, req.body.notes, req.body.complete, req.body.updated, req.body.list_id],
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
  if (req.body.complete == null){ // correcting problem of task complete changing to null when unchecked
    req.body.complete = false;
  }
  req.body.updated = new Date(); // updating date/time when task is updated
  console.log('Updating Task:', req.body);
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('UPDATE tasks SET task=$2, notes=$3, complete=$4, updated=$5 WHERE id = $1 RETURNING *',
                   [req.params.id, req.body.task, req.body.notes, req.body.complete, req.body.updated],
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
