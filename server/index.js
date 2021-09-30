const express = require('express');
const db = require('../db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Retrieves all questions for a product
app.get('/qa/:productId', async (req, res) => {
  const questionsArray = await db.getQuestions(req.params.productId);
  res.send(questionsArray);
});

// Retrieves all answers for a question
app.get('/qa/:questionId/answers', async (req, res) => {
  const answersArray = await db.getAnswers(req.params.questionId);
  res.send(answersArray);
});

// Write a question
app.post('/qa/:productId', async (req, res) => {
  const newQuestionData = await db.writeQuestion(req.params.productId, req.body.body, req.body.name, req.body.email);
  res.send(newQuestionData);
});

// Write an answer
app.post('/qa/:questionId/answers', async (req, res) => {
  const newAnswerData = await db.writeAnswer(req.params.questionId, req.body.body, req.body.name, req.body.email, req.body.photos);
  res.send(newAnswerData);
});

app.put('/qa/question/:questionId/helpful', (req, res) => {

});

app.put('/qa/question/:questionId/report', (req, res) => {

});

app.put('/qa/answer/:answerId/helpful', (req, res) => {

});

app.put('/qa/answer/:answerId/report', (req, res) => {

});


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});