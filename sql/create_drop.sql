-- Run me on the database for the HarvestHub app using:
--   heroku pg:psql --app harvesthub < create_drop.sql

-- Remember that PostgreSQL will changes the names of columns, tables, etc
-- to all lower case unless quotation marks are used.

DROP TABLE IF EXISTS Grower;
CREATE TABLE Grower
(
  code VARCHAR(999) PRIMARY KEY,
  fullName VARCHAR(999)
);

-- BoxEyeComponents stuff.
DROP TABLE IF EXISTS BoxEyeComponents.BoxEyeRigLog;
DROP TABLE IF EXISTS BoxEyeComponents.ArduinoReaderLog;
DROP TABLE IF EXISTS BoxEyeComponents.AntennaLog;
DROP TABLE IF EXISTS BoxEyeComponents.BoxEyeRig;
DROP TABLE IF EXISTS BoxEyeComponents.ArduinoReader;
DROP TABLE IF EXISTS BoxEyeComponents.Antenna;

CREATE TABLE BoxEyeComponents.Antenna
(
  code VARCHAR(999) PRIMARY KEY,
  model VARCHAR(999),
  remarks VARCHAR(999)
);

CREATE TABLE BoxEyeComponents.ArduinoReader
(
  code VARCHAR(999) PRIMARY KEY,
  usbSerialNo VARCHAR(999),
  arduinoModel VARCHAR(999),
  readerModel VARCHAR(999),
  remarks VARCHAR(999)
);

CREATE TABLE BoxEyeComponents.BoxEyeRig
(
  code VARCHAR(999) PRIMARY KEY,
  arduinoReaderA VARCHAR(999)
    REFERENCES BoxEyeComponents.ArduinoReader(code),
  arduinoReaderB VARCHAR(999)
    REFERENCES BoxEyeComponents.ArduinoReader(code),
  antennaDexter VARCHAR(999) REFERENCES BoxEyeComponents.Antenna(code),
  antennaSinister VARCHAR(999) REFERENCES BoxEyeComponents.Antenna(code),
  remarks VARCHAR(999)
);

CREATE TABLE BoxEyeComponents.AntennaLog
(
  id INTEGER PRIMARY KEY,
  antenna VARCHAR(999) REFERENCES BoxEyeComponents.Antenna(code),
  epochTime INTEGER,
  remarks VARCHAR(999)
);

CREATE TABLE BoxEyeComponents.ArduinoReaderLog
(
  id INTEGER PRIMARY KEY,
  arduinoReader VARCHAR(999)
    REFERENCES BoxEyeComponents.ArduinoReader(code),
  epochTime INTEGER,
  remarks VARCHAR(999)
);

CREATE TABLE BoxEyeComponents.BoxEyeRigLog
(
  id INTEGER PRIMARY KEY,
  boxEyeRig VARCHAR(999) REFERENCES BoxEyeComponents.BoxEyeRig(code),
  epochTime INTEGER,
  remarks VARCHAR(999)
);
