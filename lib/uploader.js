/*
This code holds a class which uploads some given data to a database.
*/

// Imports.
const PG = require("pg");

// Local imports.
const Finaliser = require("./finaliser.js");

// Local constants.
const Client = PG.Client;
const millisecondsInASecond = 1000;

// The class in question.
class Uploader
{
  constructor()
  {
    this.finaliser = new Finaliser();
  }

  // Performs an "insert" query.
  insert(req, res, tableName)
  {
    var query = constructInsertQuery(tableName, req.body);
    var params = extractParams(req.body);
    var that = this;
    var properties;

    this.runQuery(req, res, query, params, tableName);
  }

  // Performs an "update" query.
  update(req, res, tableName)
  {
    var keyHeading = Object.keys(req.body)[0];
    var keyValue = Object.values(req.body)[0];
    var query, params;

    delete req.body[keyHeading];
    delete req.body.update;
    query = constructUpdateQuery(tableName, req.body, keyHeading);
    params = extractParamsForUpdate(req.body, keyValue);

    this.runQuery(req, res, query, params, tableName);
  }

  // Performs an "insert" query on a given log.
  appendToLog(req, res, tableName, idKey, idValue, redirect)
  {
    var date = new Date();
    var timeStamp = date.getTime()/millisecondsInASecond;
    var entry = req.body.entry;
    var queryString = "INSERT INTO "+tableName+" "+
                        "("+idKey+", timeStamp, entry) "+
                      "VALUES ($1, $2, $3);";
    var params = [idValue, timeStamp, entry];
    var that = this;
    var errorFlag = false;
    var properties;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true
    });

    client.connect();
    client.query(queryString, params, (err, result) => {
      if(err)
      {
        errorFlag = true;
        properties = { title: "Upload Unsuccessful", success: false,
                       error: err };
      }
      client.end();

      if(errorFlag)
      {
        that.finaliser.protoRender(req, res, "aftersql", properties);
      }
      res.redirect(redirect);
    });
  }

  // Run the query.
  runQuery(req, res, query, params, tableName)
  {
    var that = this;
    var properties;
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true
    });

    client.connect();
    client.query(queryString, params, (err, result) => {
      if(err)
      {
        errorFlag = true;
        properties = { title: "Upload Unsuccessful", success: false,
                       error: err };
      }
      client.end();

      if(errorFlag)
      {
        that.finaliser.protoRender(req, res, "aftersql", properties);
      }
      res.redirect(redirect);
    });
  }
}

// Ronseal.
function constructInsertQuery(tableName, data)
{
  var result = "INSERT INTO "+tableName+" (";
  var n = Object.keys(data).length;
  var qs = "";

  for(var i = 0; i < n; i++)
  {
    if(i === n-1)
    {
      result = result+Object.keys(data)[i];
      qs = qs+"?";
    }
    else
    {
      result = result+Object.keys(data)[i]+", ";
      qs = qs+"?, ";
    }
  }
  result = result+") VALUES ("+qs+");";

  return result;
}

// Ronseal.
function constructUpdateQuery(tableName, data, masterKey)
{
  var result = "UPDATE "+tableName+" SET ";
  var oldKeys = Object.keys(data);
  var keys = [];
  var values = Object.values(data);

  // Purge blank fields.
  for(var i = 0; i < values.length; i++)
  {
    if(values[i] === null || values[i] === "") continue;
    else keys.push(oldKeys[i]);
  }

  for(var i = 0; i < keys.length; i++)
  {
    result = result+keys[i]+" = ?";
    if(i === keys.length-1) result = result+" ";
    else result = result+", ";
  }

  result = result+"WHERE "+masterKey+" = ?;";

  return result;
}

// Ronseal.
function extractParams(data)
{
  var result = Object.values(data);

  for(var i = 0; i < result.length; i++)
  {
    if(result[i] === "") result[i] = null;
  }

  return result;
}

// Like the previous function, but for an "UPDATE" query.
function extractParamsForUpdate(data, keyValue)
{
  var candidates = Object.values(data);
  var result = [];

  for(var i = 0; i < candidates.length; i++)
  {
    if((candidates[i] === null) || candidates[i] === "") continue;
    else result.push(candidates[i]);
  }
  result.push(keyValue);

  return result;
}

// Exports.
module.exports = Uploader;