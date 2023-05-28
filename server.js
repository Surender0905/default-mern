const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

///third party middleware
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;

///imports custom module
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');

///middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(logger);
app.use(express.json()); //process JSON
app.use('/', express.static(path.join(__dirname, 'public'))); //expictly public path

///routes

app.use('/', require('./routes/root'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 not found' });
  } else {
    res.type('txt').send('404 not found');
  }
});

///error handlers
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});