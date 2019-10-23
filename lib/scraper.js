/*
This code holds a class which scrapes the required data from a database.
*/

// Local imports.
const Finaliser = require("./finaliser.js");
const { Client } = require("pg");

// The class in question.
class Scraper
{
  constructor()
  {
    this.finaliser = new Finaliser();
  }

  // Fetches a table from the database as is.
  fetchAsIs(req, res)
  {
    var tableName = req.params.id;
    var that = this;
    var queryString = "SELECT * FROM "+tableName+";";
    var extract, data;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    if(isHaram(tableName)) res.send("Alpha-numeric characters only.");

    client.connect();
    client.query(queryString, (err, result) => {
      if(err) throw err;
      client.end();

      extract = result.rows;
      data = objectifyExtract(extract);

      that.finaliser.protoRender(req, res, "asis",
                                 { title: tableName,  data: data });
    });
  }
};

// Turn an extract from the database into a useful object.
function objectifyExtract(extract)
{
  var columns, rows;
  var result = {};

  columns = Object.keys(extract[0]);
  rows = dictToRows(extract);

  result.columns = columns;
  result.rows = rows;

  return result;
}

// Extract the rows from a list of dictionaries.
function dictToRows(list)
{
  var result = [];
  var row = [];

  for(var i = 0; i < list.length; i++)
  {
    row = Object.values(list[i]);
    result.push(row);
  }

  return result;
}

// Finds any forbidden characters in a table name.
function isHaram(tableName)
{
  var c;

  if(tableName === "") return true;

  for(var i = 0; i < tableName.length; i++)
  {
    c = tableName[i];

    if(((c < '0') || (c > '9')) &&
       ((c < 'a') || (c > 'z')) &&
       ((c < 'A') || (c > 'Z')))
    {
      return true;
    }
  }

  return false;
}

// Exports.
module.exports = Scraper;
