require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Database connection
mongoose
  .connect(process.env.REACT_APP_MONGO_URL)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Database not connected', err));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes



const PORT = 4001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});