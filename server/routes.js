const express = require('express');
const cors = require('cors');
const db = require('../db');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Retrieves all questions for a product
app.get('/qa/:productId', async (req, res) => {
  try {
    const questions = await db.getQuestions(req.params.productId);
    res.send(questions.rows);
  } catch (err) {
    console.log(err.stack);
    res.status(404).send();
  }
});

// Retrieves all answers for a question
app.get('/qa/:questionId/answers', async (req, res) => {
  try {
    const answers = await db.getAnswers(req.params.questionId);
    res.send(answers.rows);
  } catch (err) {
    console.log(err.stack);
    res.status(404).send();
  }
});

// Write a question
app.post('/qa/:productId', async (req, res) => {
  try {
    const newQuestion = await db.writeQuestion(
      req.params.productId,
      req.body.body,
      req.body.name,
      req.body.email
    );
    res.send(newQuestion.rows[0]);
  } catch (err) {
    console.log(err.stack);
    res.status(400).send();
  }
});

// Write an answer
app.post('/qa/:questionId/answers', async (req, res) => {
  try {
    const newAnswerData = await db.writeAnswer(
      req.params.questionId,
      req.body.body,
      req.body.name,
      req.body.email,
      req.body.photos
    );
    res.send(newAnswerData);
  } catch (err) {
    console.log(err.stack);
    res.status(400).send();
  }
});

// Increment question helpfulness
app.put('/qa/question/:questionId/helpful', async (req, res) => {
  try {
    const updatedQuestion = await db.markQuestionHelpful(req.params.questionId);
    res.send(updatedQuestion.rows[0]);
  } catch (err) {
    console.log(err.stack);
    res.status(400).send();
  }
});

// Report a question
app.put('/qa/question/:questionId/report', async (req, res) => {
  try {
    const reportedQuestion = await db.reportQuestion(req.params.questionId);
    res.send(reportedQuestion.rows[0]);
  } catch (err) {
    console.log(err.stack);
    res.status(400).send();
  }
});

// Increment answer helpfulness
app.put('/qa/answer/:answerId/helpful', async (req, res) => {
  try {
    const updatedAnswer = await db.markAnswerHelpful(req.params.answerId);
    res.send(updatedAnswer.rows[0]);
  } catch (err) {
    console.log(err.stack);
    res.status(400).send();
  }
});

// Report an answer
app.put('/qa/answer/:answerId/report', async (req, res) => {
  try {
    const reportedAnswer = await db.reportAnswer(req.params.answerId);
    res.send(reportedAnswer.rows[0]);
  } catch (err) {
    console.log(err.stack);
    res.status(400).send();
  }
});

module.exports = app;