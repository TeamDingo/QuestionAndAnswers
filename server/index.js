const app = require('./routes')
const PORT = 3000;
const newrelic = require('newrelic');

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
