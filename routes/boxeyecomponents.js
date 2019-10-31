/*
Returns a gently enhanced version of a table from the BoxEyeComponents
schema.
*/

// Imports.
const express = require("express");

// Local imports.
const Scraper = require("../lib/scraper.js");
const Finaliser = require("../lib/finaliser.js");

// Constants.
const router = express.Router();
const scraper = new Scraper();
const finaliser = new Finaliser();

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
  scraper.fetchBoxEyeAntennaLog(req, res);
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
                    { name: "arduinoDexter", type: "text" },
                    { name: "antennaSinister", type: "text" },
                    { name: "remarks", type: "text" }];
  var action = "/boxeyecomponents/insert2/boxeyerig";

  properties = { title: "Upload to BoxEyeRig", columns: theColumns,
                 formAction: action };
  finaliser.protoRender(req, res, "upload2table", properties);
});

module.exports = router;
