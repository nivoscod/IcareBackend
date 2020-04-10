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
        connection.query('SELECT d.*, IFNULL(app.counter,0) as counter \
        FROM doctors as d\
        LEFT JOIN ( \
        SELECT ad.doctor_id, COUNT(ad.is_available) as counter \
        FROM available_dates as ad \
        WHERE ad.is_available= "true" \
        GROUP BY ad.doctor_id) \
        app ON d.id = app.doctor_id', (err, res) => {
          if (err) return res.status(400).send({
            message: 'This is an error!'})
          else response.send(res)
        })})

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
      connection.query('SELECT d.*, IFNULL(app.counter,0) as counter \
      FROM doctors as d \
       LEFT JOIN ( \
      SELECT ad.doctor_id, COUNT(ad.is_available) as counter \
      FROM available_dates as ad \
      WHERE ad.is_available= "true" \
      GROUP BY ad.doctor_id) app ON d.id = app.doctor_id \
      where d.name LIKE ? AND d.field LIKE ? AND location LIKE ?', ['%' + doc + '%', '%' + field + '%', '%' + area + '%'], (err, results) =>{
        if (err) throw err;
        response.header("Access-Control-Allow-Origin", "*");
        response.send(results)
  })});

    app.post('/attendappointment', (req, res) => {
      let docId = req.body.docId !== '' ? req.body.docId : null
      let patId = req.body.patId !== '' ? req.body.patId : null
      let patFname = req.body.patFname !== '' ? req.body.patFname : null
      let patLname = req.body.patLname !== '' ? req.body.patLname : null
      let patTel = req.body.patTel !== '' ? req.body.patTel : null
      let patEmail = req.body.patEmail !== '' ? req.body.patEmail : null
      let patCity = req.body.patCity !== '' ? req.body.patCity : null
      let patWeight = req.body.patWeight !== '' ? req.body.patWeight : null
      let patHeight = req.body.patHeight !== '' ? req.body.patHeight : null
      let patMedicalHistory = req.body.patMedicalHistory !== '' ? req.body.patMedicalHistory : null
      let patSmoker = req.body.patSmoker !== '' ? req.body.patSmoker : null
      let appointment = req.body.appointment !== '' ? req.body.appointment : null

      connection.query('INSERT INTO appointments (doc_id, pat_id, pat_fname, pat_lname, pat_tel, pat_email, pat_city, pat_weight, pat_height, pat_medicalhistory, pat_smoker) VALUES (?,?,?,?,?,?,?,?,?,?,?)',  
      [docId, patId, patFname, patLname, patTel, patEmail, patCity, patWeight, patHeight, patMedicalHistory, patSmoker], (err, results) => {
        if (err) {
          return res.status(400).send({
            message: 'This is an error!'
         });
        }
        else {
          app_id = String(results.insertId)
          connection.query('UPDATE available_dates SET app_id=?,is_available="false" WHERE year=? AND month=? AND day=? AND hour=? AND doctor_id=?',  
          [app_id, appointment.year, appointment.month, appointment.day, appointment.hour, docId], (err, results) => {
            if (err) {
              return res.status(400).send({
                message: 'This is an error!'
             }); 
            }
            else {
              res.send(app_id)
            }})}
      })})
}