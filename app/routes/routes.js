module.exports = (app, connection) => {
    app.get('/doctors/:docId', function(req, response) {
        const docId = req.params.docId;
        connection.query('SELECT * FROM doctors WHERE id=?;',docId, (err, results) =>{
          if (err) throw err;
          response.send(results)
        });
    });

    app.get('/doctors', function(req, response) {
        connection.query('SELECT * FROM doctors;', (err, results) =>{
          if (err) throw err;
          response.header("Access-Control-Allow-Origin", "*");
          response.send(results)
        });
    });


    app.get('/availability/:docId', function(req, response) {
      const docId = req.params.docId;
      connection.query('SELECT distinct(year) FROM available_dates WHERE doctor_id=? AND is_available="true";',docId, (err, results) =>{
        if (err) throw err;
        response.header("Access-Control-Allow-Origin", "*");
        response.send(results)
      });
  });

  app.get('/availability/:docId/:year', function(req, response) {
    const docId = req.params.docId;
    const year = req.params.year;
    connection.query('SELECT distinct(month) FROM available_dates WHERE doctor_id=? AND year=? AND is_available="true";',[docId, year], (err, results) =>{
      if (err) throw err;
      response.header("Access-Control-Allow-Origin", "*");
      response.send(results)
    });
});

  app.get('/availability/:docId/:year/:month', function(req, response) {
    const docId = req.params.docId;
    const year = req.params.year;
    const month = req.params.month;
    connection.query('SELECT distinct(day) FROM available_dates WHERE doctor_id=? AND year=? AND month=? AND is_available="true";',[docId, year, month], (err, results) =>{
      if (err) throw err;
      response.header("Access-Control-Allow-Origin", "*");
      response.send(results)
    });
  });

  app.get('/availability/:docId/:year/:month/:day', function(req, response) {
    const docId = req.params.docId;
    const year = req.params.year;
    const month = req.params.month;
    const day = req.params.day;
    connection.query('SELECT hour FROM available_dates WHERE doctor_id=? AND year=? AND month=? AND day=? AND is_available="true";',[docId, year, month, day], (err, results) =>{
      if (err) throw err;
      response.header("Access-Control-Allow-Origin", "*");
      response.send(results)
    });
  });

}