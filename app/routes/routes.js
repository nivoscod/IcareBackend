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

};