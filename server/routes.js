const express = require('express');
const cors = require('cors');
const db = require('../db');
const redis = require('redis');

const app = express();
const client = redis.createClient();

client.on('connect', () => {
  console.log('Connected to cache');
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Retrieves all questions for a product
app.get('/qa/:productId', async (req, res) => {
  try {
    client.get(`questions:${req.params.productId}`, async (err, data) => {
      if (err) {
        console.log(err);
      }

      if (data) {
        console.log('questions retrieved from cache');
        res.send(JSON.parse(data));
      } else {
        console.log('questions retrieved from db');
        const questions = await db.getQuestions(req.params.productId);
        client.set(
          `questions:${req.params.productId}`,
          JSON.stringify(questions.rows),
          'EX',
          86400
        );
        res.send(questions.rows);
      }
    });
  } catch (err) {
    console.log('error getting questions');
    res.status(404).send();
  }
});

// Retrieves all answers for a question
app.get('/qa/:questionId/answers', async (req, res) => {
  try {
    client.get(`answers:${req.params.questionId}`, async (err, data) => {
      if (err) {
        console.log(err);
      }

      if (data) {
        console.log('answers retrieved from cache');
        res.send(JSON.parse(data));
      } else {
        console.log('answers retrieved from db');
        const answers = await db.getAnswers(req.params.questionId);
        client.set(
          `answers:${req.params.questionId}`,
          JSON.stringify(answers.rows),
          'EX',
          86400
        );
        res.send(answers.rows);
      }
    });
  } catch (err) {
    console.log('error getting answers');
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
    client.get(`questions:${req.params.productId}`, (err, data) => {
      if (data) {
        const oldQuestions = JSON.parse(data);
        const updatedQuestions = [...oldQuestions, newQuestion.rows[0]];
        client.set(
          `questions:${req.params.productId}`,
          JSON.stringify(updatedQuestions),
          'EX',
          86400
        );
      }
    });
    res.send(newQuestion.rows[0]);
  } catch (err) {
    console.log('error posting question');
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
    client.get(`answers:${req.params.questionId}`, (err, data) => {
      if (data) {
        const oldAnswers = JSON.parse(data);
        const updatedAnswers = [...oldAnswers, newAnswerData];
        client.set(
          `answers:${req.params.questionId}`,
          JSON.stringify(updatedAnswers),
          'EX',
          86400
        );
      }
    });
    res.send(newAnswerData);
  } catch (err) {
    console.log('error posting answer');
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
