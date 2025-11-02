const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
var cookieParser = require('cookie-parser');
const logger = require('morgan');
dotenv.config();

const {
  generatePossibleSiteLisa,
} = require('./controllers/a-eye');

const service_controller = require('./controllers/services');
const {
  newChatSession,
  continueChatSession,
} = require('./controllers/streaming-responses')

const app = express();

const port = 8080

const db = require('./db');

db.init_db().then(() => {
	//db.get_all_service_ids().then(console.log);

	// Add test data
	if (false) {
	db.add_service("trash", "pick up trash", ["https://google.com/", "https://trash.com/"]);
	db.add_service("microplastics", "yummy", ["https://microplastics.rit.edu/", "https://website.com/", "https://localhost/"]);
	}
});

require("./lib/parse-site").parse_site("https://mcwa.org/wp-content/uploads/2021/10/MCWA-Brochure-2022.pdf").then(console.log);

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/setup', generatePossibleSiteLisa);
app.post('/ai/create-session', newChatSession);
app.post('/ai/chat-with-gemini', continueChatSession);

app.get('/services', service_controller.get_all);
app.get('/services/:id', service_controller.get);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let error = new Error('Not found')
  error.status = 404
  next(error)
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(err.message)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
