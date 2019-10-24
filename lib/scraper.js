/*
This code holds a class which scrapes the required data from a database.
*/

// Imports.
const PG = require("pg");

// Local imports.
const Finaliser = require("./finaliser.js");

// Local constants.
const Client = PG.Client;

// The class in question.
class Scraper
{
  constructor()
  {
    this.finaliser = new Finaliser();
  }

  fetchAsIs(req, res)
  {
    var tableName = req.params.id;

    this.checkTableName(req, res, tableName);
  }

  // Fetches a list of table names, and checks the table name in question
  // against it.
  checkTableName(req, res, tableName)
  {
    var that = this;
    var queryString = "SELECT table_name "+
                      "FROM information_schema.tables "+
                      "WHERE ((table_schema = 'public') AND "+
                             "(table_type = 'BASE TABLE'));";
    var extract;
    var tableNames = [];
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();
    client.query(queryString, (err, result) => {
      if(err) throw err;

      extract = result.rows;
      for(var i = 0; i < extract.length; i++)
      {
        tableNames.push(extract[i].table_name);
      }

      if(tableNames.indexOf(tableName.toLowerCase()) === -1)
      {
        res.send("Bad table name: "+tableName);
      }
      else that.fetchAsIsPart2(req, res, tableName);
    });
  }

  // Fetches a table from the database as is.
  fetchAsIsPart2(req, res, tableName)
  {
    var that = this;
    var queryString = "SELECT * FROM "+tableName+";";
    var extract, data;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();
    client.query(queryString, (err, result) => {
      if(err) throw err;

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

// Exports.
module.exports = Scraper;
