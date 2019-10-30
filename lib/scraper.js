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

  // Fetch ALL the BoxEye rig logs.
  fetchAllBoxEyeRigLog(req, res)
  {
    var that = this;
    var title = "All BoxEye Rig Logs";
    var queryString = "SELECT * FROM BoxEyeComponents.BoxEyeRigLog;";
    var extract, linkified, dated, data;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();
    client.query(queryString, (err, result) => {
      if(err) throw err;

      extract = result.rows;
      client.end();

      linkified = linkifyExtract(extract, "boxeyerig",
                                 "/boxeyecomponents/boxeyerig/");
      dated = addISODates(linkified);
      data = objectifyExtract(dated);

      if(extract.length === 0) linkified = null;

      that.finaliser.protoRender(req, res, "tabular",
                                 { title: title,  data: linkified });
    });
  }

  // Fetch the logs for a given BoxEye rig.
  fetchBoxEyeRigLog(req, res)
  {
    var that = this;
    var code = req.params.id;
    var title = "Logs for <a href=\"/boxeyecomponents/boxeyerig\">"+
                "Box Eye Rig with code = "+code+"</a>";
    var queryString = "SELECT * FROM BoxEyeComponents.BoxEyeRigLog "+
                      "WHERE boxEyeRig = $1;";
    var extract, dated;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();
    client.query(queryString, [code], (err, result) => {
      if(err) throw err;

      extract = result.rows;
      client.end();

      dated = addISODates(extract);
      data = objectifyExtract(dated);

      if(extract.length === 0) dated = null;

      that.finaliser.protoRender(req, res, "tabular",
                                 { title: title,  data: dated });
    });
  }

  // Fetch ALL the Arduino-reader logs.
  fetchAllArduinoReaderLog(req, res)
  {
    var that = this;
    var title = "All Arduino-Reader Logs";
    var queryString = "SELECT * FROM BoxEyeComponents.ArduinoReaderLog;";
    var extract, linkified;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();
    client.query(queryString, (err, result) => {
      if(err) throw err;

      extract = result.rows;
      client.end();

      linkified = linkifyExtract(extract, "arduinoreader",
                                 "/boxeyecomponents/arduinoreader/");
      dated = addISODates(linkified);
      data = objectifyExtract(dated);

      if(extract.length === 0) linkified = null;

      that.finaliser.protoRender(req, res, "tabular",
                                 { title: title,  data: linkified });
    });
  }

  // Fetch the logs for a given Arduino-reader.
  fetchBoxArduinoReaderLog(req, res)
  {
    var that = this;
    var code = req.params.id;
    var title = "Logs for <a href=\"/boxeyecomponents/arduinoreader\">"+
                "Arduino-Reader with code = "+code+"</a>";
    var queryString = "SELECT * FROM BoxEyeComponents.ArduinoReader "+
                      "WHERE arduinoReader = $1;";
    var extract, dated;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();
    client.query(queryString, [code], (err, result) => {
      if(err) throw err;

      extract = result.rows;
      client.end();

      dated = addISODates(extract);
      data = objectifyExtract(dated);

      if(extract.length === 0) dated = null;

      that.finaliser.protoRender(req, res, "tabular",
                                 { title: title,  data: dated });
    });
  }

  // Fetch ALL the antenna logs.
  fetchAllAntennaLog(req, res)
  {
    var that = this;
    var title = "All Antenna Logs";
    var queryString = "SELECT * FROM BoxEyeComponents.AntennaLog;";
    var extract, linkified;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();
    client.query(queryString, (err, result) => {
      if(err) throw err;

      extract = result.rows;
      client.end();

      linkified = linkifyExtract(extract, "antenna",
                                 "/boxeyecomponents/antenna/");
      dated = addISODates(linkified);
      data = objectifyExtract(dated);

      if(extract.length === 0) linkified = null;

      that.finaliser.protoRender(req, res, "tabular",
                                 { title: title,  data: linkified });
    });
  }

  // Fetch the logs for a given antenna.
  fetchBoxAntennaLog(req, res)
  {
    var that = this;
    var code = req.params.id;
    var title = "Logs for <a href=\"/boxeyecomponents/antenna\">"+
                "Antenna with code = "+code+"</a>";
    var queryString = "SELECT * FROM BoxEyeComponents.Antenna "+
                      "WHERE antenna = $1;";
    var extract, dated;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();
    client.query(queryString, [code], (err, result) => {
      if(err) throw err;

      extract = result.rows;
      client.end();

      dated = addISODates(extract);
      data = objectifyExtract(dated);

      if(extract.length === 0) dated = null;

      that.finaliser.protoRender(req, res, "tabular",
                                 { title: title,  data: dated });
    });
  }

  // Fetches a list of table names, and checks the table name in question
  // against it.
  checkTableName(req, res, tableName)
  {
    var that = this;
    var queryString = "SELECT table_schema, table_name "+
                      "FROM information_schema.tables "+
                      "WHERE table_type = 'BASE TABLE';";
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
      client.end();

      if(checkTableName(tableName, extract) === false)
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
      client.end();

      if((extract === null) || (extract.length === 0)) data = null;
      else data = objectifyExtract(extract);

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

// Checks the validity of a given table name.
function checkTableName(tableName, extract)
{
  var nameToBeChecked;

  for(var i = 0; i < extract.length; i++)
  {
    if(extract[i].table_schema === "public")
    {
      if(tableName.toLowerCase() === extract[i].table_name) return true;
    }

    nameToBeChecked = extract[i].table_schema+"."+extract[i].table_name;

    if(tableName.toLowerCase() === nameToBeChecked) return true;
  }

  return false;
}

// Adds links to foreign keys.
function linkifyExtract(extract, linkField, linkStem)
{
  var row;

  for(var i = 0; i < extract.length; i++)
  {
    row = extract[i];
    row[linkField] = "<a href=\""+linkStem+row[linkField]+"\">"+
                     row[linkField]+"</a>";
  }

  return extract;
}

// Replaces epoch times with ISO formated date strings.
function addISODates(extract)
{
  var reee;

  for(var i = 0; i < extract.length; i++)
  {
    reee = new Date(extract[i].epochTime);
console.log(reee);
    extract[i].isoDate = reee.toISOString();
  }

  return extract;
}

// Exports.
module.exports = Scraper;
