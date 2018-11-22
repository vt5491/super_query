var mysql = require('mysql')
const fs = require('fs');
// const args = require('minimist')(process.argv.slice(2))
const args = require('yargs').argv;

var db = 'super_query'
// var corpusTbl = `${db}.text_corpus_dev`
var corpusTbl = `${db}.text_corpus`
// var bookTitle = "The God Equation"
var bookTitle = args.title
var series = args.series
var volume = args.volume
var limit = args.limit
// var help = args.help

if (args.vthelp) {
  console.log(`Example Call:`);
  console.log(`node insert_text.js --title="the_god_game" --series="gs" --volume=1 --limit=250`);
  console.log(`--limit: optional`);
}

if (!bookTitle) {
  console.log(`please specify a --title="book title" parm`);
  process.exit(1);
}
if (!series) {
  console.log(`please specify a --series="ts|gs" parm`);
  process.exit(1);
}
if (!volume) {
  console.log(`please specify a --volume=n parm`);
  process.exit(1);
}

let bookName = `${series}${volume}-${bookTitle}.txt`
let shortTitle = `${series}-${volume}`

var con= mysql.createConnection({
  host     : 'localhost',
  user     : process.env.SUPER_QUERY_DB_USER,
  password : process.env.SUPER_QUERY_DB_PASS,
  database : 'super_query'
});

// fs.readFile("../../dev_artifacts/gs_books/gs6-the_god_equation.txt", "utf8", function(err, data){
let fn = `../../dev_artifacts/text_books/${bookName}`
console.log(`now reading file ${fn}`);
fs.readFile(fn, "utf8", function(err, data){
    if(err) throw err;

    // var resultArray = //do operation on data that generates say resultArray;
    con.connect()

    // res.send(resultArray);
    // clear out any prior records
    var delSql = `DELETE FROM ${corpusTbl} WHERE short_title="${shortTitle}" AND volume="${volume}"`
    con.query(delSql, function (err, result) {
      if (err) throw err;
      console.log(`records for title=${shortTitle}, volume=${volume} deleted`);

      // let lines = data.split("\n")
      let lines = data.split("\r\n")
      console.log(`lines.length=${lines.length}`)

      let lineStop = args.limit || lines.length;

      for( let i=0; i< lineStop; i++) {
        let text = lines[i]
        text.replace(/[\n\r]/g, '')
        // console.log(`text=${text}, length=${text.length}`);
        var insertSql =
        `INSERT INTO ${corpusTbl} (text, line_num, series, short_title, volume)
        VALUES ("${text}", ${i}, "${series}", "${shortTitle}", "${volume}")`;
        con.query(insertSql, function (err, result) {
          if (err) {
            console.log(`err: i=${i}, text=${text}`);
            throw err;
          }
          // console.log("1 record inserted");
        });
      }
      console.log(`inserted ${lineStop} records into ${corpusTbl}`);
      con.end()
    });
});
