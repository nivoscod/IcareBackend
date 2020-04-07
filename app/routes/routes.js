module.exports = (app, connection) => {
    app.get('/doctors/:docId', function(req, response) {
        const docId = req.params.docId;
        connection.query('SELECT * FROM doctors WHERE id=?;',docId, (err, results) =>{
          if (err) throw err;
          response.header("Access-Control-Allow-Origin", "*");
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

    app.get('/medicalFields', function(req, response) {
      connection.query('SELECT distinct(field) FROM doctors;', (err, results) =>{
        if (err) throw err;
        response.header("Access-Control-Allow-Origin", "*");
        response.send(results)
      });
  });

    app.get('/doctorsNames', function(req, response) {
      connection.query('SELECT name FROM doctors;', (err, results) =>{
        if (err) throw err;
        response.header("Access-Control-Allow-Origin", "*");
        response.send(results)
      });
});

    app.get('/filterdocs', function(req, response) {
      const doc = req.query.doc;
      const field = req.query.field;
      const area = req.query.area;
      connection.query('SELECT * FROM doctors where name LIKE ? AND field LIKE ? AND location LIKE ?', ['%' + doc + '%', '%' + field + '%', '%' + area + '%'], (err, results) =>{
      if (err) throw err;
      response.header("Access-Control-Allow-Origin", "*");
      response.send(results)
  })});

    app.post('/attendappointment', (req, res) => {
      let docId = req.body.docId
      let patId = req.body.patId
      let patFname = req.body.patFname
      let patLname = req.body.patLname
      let patTel = req.body.patTel
      let patEmail = req.body.patEmail
      let patCity = req.body.patCity
      let patWeight = req.body.patWeight
      let patHeight = req.body.patHeight
      let patMedicalHistory = req.body.patMedicalHistory
      let patSmoker = req.body.patSmoker
      let appointment = req.body.appointment

      connection.query('INSERT INTO appointments (doc_id, pat_id, pat_fname, pat_lname, pat_tel, pat_email, pat_city, pat_weight, pat_height, pat_medicalhistory, pat_smoker) VALUES (?,?,?,?,?,?,?,?,?,?,?)',  
      [docId, patId, patFname, patLname, patTel, patEmail, patCity, patWeight, patHeight, patMedicalHistory, patSmoker], (err, results) => {
        if (err) {
           throw err;
        }
        else {
          app_id = String(results.insertId)
          connection.query('UPDATE available_dates SET app_id=?,is_available="false" WHERE year=? AND month=? AND day=? AND hour=?',  
          [app_id, appointment.year, appointment.month, appointment.day, appointment.hour], (err, results) => {
            if (err) {
              throw err; 
            }
            else {
              res.send(app_id)
            }})}
      })})
}