/*
This code holds a class which scrapes the required data from a database.
*/

// Local imports.
const Finaliser = require("./finaliser.js");

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
    var data, columns, rows;
    var tableName = req.params.id;
    var that = this;
    var queryString = "SELECT * FROM "+tableName+";";

//    if(isHaram(tableName)) res.send("Alpha-numeric characters only.");

    client.connect();
    client.query(queryString, (err, extract) => {
      if(err) throw err;

      client.end();

      console.log(extract);
      that.finaliser.protoRender(req, res, "asis",
                                 { title: tableName });
    });

/*
    db.all(query, function(err, extract){
      if(err || extract.length === 0) throw err;
      columns = Object.keys(extract[0]);
      rows = dictToRows(extract);
      db.close();

      that.finaliser.protoRender(req, res, "asis",
                                 { title: tableName, data: data });
    });
*/
  }
};

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
