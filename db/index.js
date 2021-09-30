const { Pool } = require('pg');
const pool = new Pool({
  user: 'benkern',
  database: 'qna'
});

pool
  .connect()
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Error connecting to database'));

const getQuestions = async productId => {
  try {
    const questions = await pool.query(
      'SELECT * FROM questions WHERE product_id = $1',
      [productId]
    );
    return questions.rows;
  } catch (err) {
    return err.stack;
  }
};

const getAnswers = async questionId => {
  try {
    const answers = await pool.query(
      'SELECT * FROM answers WHERE question_id = $1',
      [questionId]
    );
    return answers.rows;
  } catch (err) {
    return err.stack;
  }
};

const writeQuestion = async (productId, body, name, email) => {
  try {
    const newQuestion = await pool.query(
      'INSERT INTO questions (product_id, body, asker_name, asker_email) VALUES ($1, $2, $3, $4) RETURNING *',
      [productId, body, name, email]
    );
    return newQuestion.rows[0];
  } catch (err) {
    return err.stack;
  }
};

const writeAnswer = async (questionId, body, name, email, photos) => {
  try {
    const newAnswer = await pool.query(
      'INSERT INTO answers (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4) RETURNING *',
      [questionId, body, name, email]
    );
    const newPhotos = [];
    if (photos) {
      for (const photo of photos) {
        const newPhoto= await pool.query(
          'INSERT INTO photos (answer_id, url) VALUES ($1, $2) RETURNING *',
          [newAnswer.rows[0].id, photo]
        );
        newPhotos.push(newPhoto.rows[0]);
      }
    }
    return { answer: newAnswer.rows[0], photos: newPhotos };
  } catch (err) {
    return err.stack;
  }
};

module.exports = {
  getQuestions,
  getAnswers,
  writeQuestion,
  writeAnswer
};
