DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS photos;

CREATE TABLE questions (
  id INT NOT NULL PRIMARY KEY,
  product_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date_written BIGINT
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60) NOT NULL,
  reported BOOLEAN,
  helpful INT
);

CREATE TABLE answers (
  id INT NOT NULL PRIMARY KEY,
  CONSTRAINT question_id
    FOREIGN KEY(id)
      REFERENCES questions(id),
  body VARCHAR(1000) NOT NULL,
  date_written BIGINT,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  reported BOOLEAN,
  helpful INT
);

CREATE TABLE photos (
  id INT NOT NULL PRIMARY KEY,
  CONSTRAINT answer_id
    FOREIGN KEY(id)
      REFERENCES answers(id),
  url VARCHAR(300)
);

