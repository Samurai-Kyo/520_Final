CREATE DATABASE IF NOT EXISTS `storage`;
USE `storage`;
CREATE TABLE IF NOT EXISTS 'credentials' (
  'username' VARCHAR(255) NOT NULL,
  'password' VARCHAR(255) NOT NULL,
  'isAdmin' BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY ('username')
) DEFAULT CHARSET=utf8; 

INSERT INTO 'credentials' ('username', 'password', 'isAdmin') VALUES ('admin', 'admin', TRUE);

CREATE TABLE IF NOT EXISTS 'summarizations' (
    'id' INT NOT NULL AUTO_INCREMENT,
    'username' VARCHAR(255) NOT NULL,
    'inputCode' TEXT NOT NULL,
    'content' TEXT NOT NULL, -- JSON object, containing the summaraztions, their ratings, and whether they were picked.
    'date' DATE NOT NULL,
    PRIMARY KEY ('id'),
    FOREIGN KEY ('username') REFERENCES 'credentials'('username')
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS 'firstTimeSetup' (
    'id' INT NOT NULL AUTO_INCREMENT,
    'isSetup' BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY ('id')
) DEFAULT CHARSET=utf8;

INSERT INTO 'firstTimeSetup' ('isSetup') VALUES (FALSE);