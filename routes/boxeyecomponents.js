/*
Returns a gently enhanced version of a table from the BoxEyeComponents
schema.
*/

// Imports.
const express = require("express");

// Local imports.
const Scraper = require("../lib/scraper.js");
const Uploader = require("../lib/uploader.js");
const Finaliser = require("../lib/finaliser.js");

// Constants.
const router = express.Router();
const scraper = new Scraper();
const uploader = new Uploader();
const finaliser = new Finaliser();

// Return the section index.
router.get("/", function(req, res, next){
  finaliser.protoRender(req, res, "boxeyecomponents",
                        { title: "BoxEye Components" });
});

// Return a list of all rig logs.
router.get("/boxeyeriglog", function(req, res, next){
  scraper.fetchAllBoxEyeRigLog(req, res);
});

// Return the page for a rig log.
router.get("/boxeyeriglog/:id", function(req, res, next){
  scraper.fetchBoxEyeRigLog(req, res);
});

// Return a list of all Arduino-reader logs.
router.get("/arduinoreaderlog", function(req, res, next){
  scraper.fetchAllArduinoReaderLog(req, res);
});

// Return the page for an Arduino-reader log.
router.get("/arduinoreaderlog/:id", function(req, res, next){
  scraper.fetchArduinoReaderLog(req, res);
});

// Return a list of all rig logs.
router.get("/antennalog", function(req, res, next){
  scraper.fetchAllAntennaLog(req, res);
});

// Return the page for an antenna log.
router.get("/antennalog/:id", function(req, res, next){
  scraper.fetchAntennaLog(req, res);
});

// Return the page for all rigs.
router.get("/boxeyerig", function(req, res, next){
  scraper.fetchBoxEyeRig(req, res);
});

// Return the page for all Arduino readers.
router.get("/arduinoreader", function(req, res, next){
  scraper.fetchArduinoReader(req, res);
});

// Return the page for all antennae.
router.get("/antenna", function(req, res, next){
  scraper.fetchAntenna(req, res);
});

// Return the page for uploading to the BoxEye rig table.
router.get("/upload2/boxeyerig", function(req, res, next){
  var theColumns = [{ name: "code", type: "text" },
                    { name: "arduinoReaderA", type: "text" },
                    { name: "arduinoReaderB", type: "text" },
                    { name: "antennaDexter", type: "text" },
                    { name: "antennaSinister", type: "text" },
                    { name: "remarks", type: "text" }];
  var action = "/boxeyecomponents/insert2/boxeyerig";

  properties = { title: "Upload to BoxEyeRig", columns: theColumns,
                 formAction: action };
  finaliser.protoRender(req, res, "upload2table", properties);
});

// Return the page for uploading to the Arduino-reader table.
router.get("/upload2/arduinoreader", function(req, res, next){
  var theColumns = [{ name: "code", type: "text" },
                    { name: "usbSerialNo", type: "text" },
                    { name: "arduinoModel", type: "text" },
                    { name: "readerModel", type: "text" },
                    { name: "remarks", type: "text" }];
  var action = "/boxeyecomponents/insert2/arduinoreader";

  properties = { title: "Upload to ArduinoReader", columns: theColumns,
                 formAction: action };
  finaliser.protoRender(req, res, "upload2table", properties);
});

// Return the page for uploading to the antenna table.
router.get("/upload2/antenna", function(req, res, next){
  var theColumns = [{ name: "code", type: "text" },
                    { name: "model", type: "text" },
                    { name: "remarks", type: "text" }];
  var action = "/boxeyecomponents/insert2/antenna";

  properties = { title: "Upload to Antenna", columns: theColumns,
                 formAction: action };
  finaliser.protoRender(req, res, "upload2table", properties);
});

// Execute an upload to the BoxEye rig table.
router.post("/insert2/boxeyerig", function(req, res, next){
  passToUploader(req, res, "BoxEyeComponents.BoxEyeRig");
});

// Execute an upload to the Arduino-reader table.
router.post("/insert2/arduinoreader", function(req, res, next){
  passToUploader(req, res, "BoxEyeComponents.ArduinoReader");
});

// Execute an upload to the antenna table.
router.post("/insert2/antenna", function(req, res, next){
  passToUploader(req, res, "BoxEyeComponents.Antenna");
});

// Add an entry to a BoxEye rig's log.
router.post("/append2log/boxeyerig/:id", function(req, res, next){
  appendToLog(req, res, "BoxEyeRig");
});

// Add an entry to an Arduino-reader's log.
router.post("/append2log/arduinoreader/:id", function(req, res, next){
  appendToLog(req, res, "ArduinoReader");
});

// Add an entry to an antenna's log.
router.post("/append2log/antenna/:id", function(req, res, next){
  appendToLog(req, res, "Antenna");
});

// Pass control on to the Uploader object.
function passToUploader(req, res, tableName)
{
  if(req.body.hasOwnProperty("update"))
  {
    uploader.update(req, res, tableName);
  }
  else uploader.insert(req, res, tableName);
}

// Ronseal.
function appendToLog(req, res, tableName, idValue)
{
  var logName = tableName+"Log";
  var logNameWithSchema = "BoxEyeComponents."+logName;
  var idKey = tableName;
  var idValue = req.params.id;
  var redirect = "/boxeyecomponents/"+logName+"/"+idValue;

  uploader.appendToLog(req, res, logNameWithSchema, idKey,
                       idValue, redirect);
}

module.exports = router;
