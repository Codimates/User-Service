require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app = express();

// Database connection
mongoose
  .connect(process.env.REACT_APP_MONGO_URL)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Database not connected', err));

//middleware
app.use(express.json({ limit: '3mb' }));
app.use(cookieParser()); 
app.use(express.urlencoded({ limit: '3mb', extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/', require('./routes/userRouter'));


const PORT = 4001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});