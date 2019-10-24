-- Run me on the database for the HarvestHub app using:
--   heroku pg:psql --app harvesthub < create_drop.sql

-- Remember that PostgreSQL will changes the names of columns, tables, etc
-- to all lower case unless quotation marks are used.

INSERT INTO Grower (code, fullName)
VALUES ('bhive', 'B-hive Innovations Limited'),
       ('notbhive', 'Not B-hive Innovations Limited');
