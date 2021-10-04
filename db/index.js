const { Pool } = require('pg');
const dbConfig = require('../config.js');
const pool = new Pool(dbConfig);

pool
  .connect()
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Error connecting to database'));

const getQuestions = productId => {
  return pool.query(
    'SELECT * FROM questions WHERE product_id = $1 AND reported = false',
    [productId]
  );
};

const getAnswers = questionId => {
  return pool.query(
    'SELECT a.answer_id, a.question_id, a.body,a.answerer_name, a.helpfulness, a.date, ARRAY_AGG (p.url) photos FROM answers a LEFT OUTER JOIN photos p ON a.answer_id = p.answer_id WHERE question_id = $1 AND reported = false GROUP BY a.answer_id',
    [questionId]
  );
};

const writeQuestion = (productId, body, name, email) => {
  return pool.query(
    'INSERT INTO questions (product_id, question_body, asker_name, asker_email) VALUES ($1, $2, $3, $4) RETURNING *',
    [productId, body, name, email]
  );
};

const writeAnswer = async (questionId, body, name, email, photos) => {
  const newAnswer = await pool.query(
    'INSERT INTO answers (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4) RETURNING *',
    [questionId, body, name, email]
  );
  const newPhotos = [];
  if (photos) {
    for (const photo of photos) {
      const newPhoto = await pool.query(
        'INSERT INTO photos (answer_id, url) VALUES ($1, $2) RETURNING *',
        [newAnswer.rows[0].answer_id, photo]
      );
      newPhotos.push(newPhoto.rows[0]);
    }
  }
  return { ...newAnswer.rows[0], photos: newPhotos };
};

const markQuestionHelpful = questionId => {
  return pool.query(
    'UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1 RETURNING *',
    [questionId]
  );
};

const reportQuestion = questionId => {
  return pool.query(
    'UPDATE questions SET reported = NOT reported WHERE question_id = $1 RETURNING *',
    [questionId]
  );
};

const markAnswerHelpful = answerId => {
  return pool.query(
    'UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = $1 RETURNING *',
    [answerId]
  );
};

const reportAnswer = answerId => {
  return pool.query(
    'UPDATE answers SET reported = NOT reported WHERE answer_id = $1 RETURNING *',
    [answerId]
  );
};

module.exports = {
  pool,
  getQuestions,
  getAnswers,
  writeQuestion,
  writeAnswer,
  markQuestionHelpful,
  reportQuestion,
  markAnswerHelpful,
  reportAnswer
};
