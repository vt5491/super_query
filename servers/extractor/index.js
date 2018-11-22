var mysql = require('mysql')
var db = 'super_query'
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : process.env.SUPER_QUERY_DB_USER,
  password : process.env.SUPER_QUERY_DB_PASS,
  database : 'super_query'
});

connection.connect()

console.log(`connected to db; gh=${process.env.GH}`);
// connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//   if (err) throw err
//
//   console.log('The solution is: ', rows[0].solution)
// })
connection.query(`SELECT * FROM ${db}.text_corpus where text like "%be%"`, function (err, rows, fields) {
  if (err) throw err

  // console.log('The solution is: ', rows[0].solution)
  for (var i=0; i< rows.length; i++) {
    console.log(`${rows[i].text}, title=${rows[i].title}`)
  }
})

connection.end()
