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

DROP TABLE IF EXISTS BoxEyeRig;
CREATE TABLE BoxEyeRig
(
  code VARCHAR(999) PRIMARY KEY,
  arduinoReaderA VARCHAR(999) REFERENCES ArduinoReader(code),
  arduinoReaderB VARCHAR(999) REFERENCES ArduinoReader(code),
  antennaDexter VARCHAR(999) REFERENCES Antenna(code),
  antennaSinister VARCHAR(999) REFERENCES Antenna(code),
  remarks VARCHAR(999)
);

DROP TABLE IF EXISTS ArduinoReader;
CREATE TABLE ArduinoReader
(
  code VARCHAR(999) PRIMARY KEY,
  usbSerialNo VARCHAR(999),
  arduinoModel VARCHAR(999),
  readerModel VARCHAR(999),
  remarks VARCHAR(999)
);

DROP TABLE IF EXISTS Antenna;
CREATE TABLE Antenna
(
  code VARCHAR(999) PRIMARY KEY,
  model VARCHAR(999),
  remarks VARCHAR(999)
);

DROP TABLE IF EXISTS BoxEyeRigLog;
CREATE TABLE BoxEyeRigLog
(
  id INTEGER PRIMARY KEY,
  boxEyeRig VARCHAR(999) REFERENCES BoxEyeRig(code),
  epochTime INTEGER,
  remarks VARCHAR(999)
);

DROP TABLE IF EXISTS ArduinoReaderLog;
CREATE TABLE ArduinoReaderLog
(
  id INTEGER PRIMARY KEY,
  arduinoReader VARCHAR(999) REFERENCES ArduinoReader(code),
  epochTime INTEGER,
  remarks VARCHAR(999)
);

DROP TABLE IF EXISTS AntennaLog;
CREATE TABLE AntennaLog
(
  id INTEGER PRIMARY KEY,
  antenna VARCHAR(999) REFERENCES Antenna(code),
  epochTime INTEGER,
  remarks VARCHAR(999)
);
