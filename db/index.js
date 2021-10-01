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
      'SELECT a.answer_id, a.question_id, a.body,a.answerer_name, a.helpfulness, a.date, ARRAY_AGG (p.url) photos FROM answers a INNER JOIN photos p ON a.answer_id = p.answer_id WHERE question_id = $1 GROUP BY a.answer_id',
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
        const newPhoto = await pool.query(
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

const markQuestionHelpful = async (questionId) => {
  try {
    const updatedQuestion = await pool.query('UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1 RETURNING *', [questionId]);
    return updatedQuestion.rows[0];
  } catch (err) {
    return err.stack;
  }
}

const reportQuestion = async (questionId) => {
  try {
    const reportedQuestion = await pool.query('UPDATE questions SET reported = NOT reported WHERE question_id = $1 RETURNING *', [questionId]);
    return reportedQuestion.rows[0];
  } catch (err) {
    return err.stack;
  }
}

const markAnswerHelpful = async (answerId) => {
  try {
    const updatedAnswer = await pool.query('UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = $1 RETURNING *', [answerId]);
    return updatedAnswer.rows[0];
  } catch (err) {
    return err.stack;
  }
}

const reportAnswer = async (answerId) => {
  try {
    const reportedAnswer = await pool.query('UPDATE answers SET reported = NOT reported WHERE answer_id = $1 RETURNING *', [answerId]);
    return reportedAnswer.rows[0];
  } catch (err) {
    return err.stack;
  }
}

module.exports = {
  getQuestions,
  getAnswers,
  writeQuestion,
  writeAnswer,
  markQuestionHelpful,
  reportQuestion,
  markAnswerHelpful,
  reportAnswer
};
