const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error');

app.use(express.json())
// Route Inports

const products = require('./routes/productRoute')
const user = require('./routes/userRoute');

app.use('/api/v1',products);
app.use('/api/v1',user);

//Middleware for Error Handling
app.use(errorMiddleware);

module.exports  = app;