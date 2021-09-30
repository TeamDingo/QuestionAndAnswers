DROP DATABASE IF EXISTS qna;
CREATE DATABASE qna;
\c qna;

DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS photos;

CREATE TABLE questions (
  id INT NOT NULL PRIMARY KEY,
  product_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  epoch BIGINT,
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60) NOT NULL,
  reported BOOLEAN,
  helpful INT,
  date_written TIMESTAMP NULL DEFAULT NULL
);

CREATE TABLE answers (
  id INT NOT NULL PRIMARY KEY,
  question_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  epoch BIGINT,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  reported BOOLEAN,
  helpful INT,
  date_written TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY(question_id)
    REFERENCES questions(id),
);

CREATE TABLE photos (
  id INT NOT NULL PRIMARY KEY,
  answer_id INT NOT NULL,
  url VARCHAR(300),
  FOREIGN KEY(answer_id)
    REFERENCES answers(id)
);

