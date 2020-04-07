const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 8080;

const app = express();


const connection = mysql.createConnection({
  host: "localhost",
  port: "3307",
  user: "icare",
  password: "Niv151297",
  database: "icare"
})

require('./app/routes/routes')(app,connection)


app.listen(PORT, "0.0.0.0", () => {
  console.log(`APP runnig on port ${PORT}`)
})

