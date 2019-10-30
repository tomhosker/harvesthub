-- Run me on the database for the HarvestHub app using:
--   heroku pg:psql --app harvesthub < dothething.sql

-- Remember that PostgreSQL will changes the names of columns, tables, etc
-- to all lower case unless quotation marks are used.

INSERT INTO BoxEyeComponents.BoxEyeRig (code, arduinoReaderA,
  arduinoReaderB, antennaDexter, antennaSinister, remarks)
VALUES ('house-1', NULL, NULL, NULL, NULL, NULL);

INSERT INTO BoxEyeComponents.BoxEyeRigLog (id, boxEyeRig, epochTime,
                                           remarks)
VALUES (1, 'house-1', 1572368871, 'Something something dark side.');
