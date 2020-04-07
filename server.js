const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser')

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.use(bodyParser.json())

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

