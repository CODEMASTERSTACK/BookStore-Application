const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');

const app = express();

// connect to mongodb
// TODO: move this to a separate file later
mongoose.connect('mongodb://localhost:27017/bookdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => {
    console.log('Oops! Error connecting to MongoDB:', err);
});

// middleware for parsing json
app.use(express.json());

// swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// routes
app.use('/api/users', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));

// TODO: add error handling - not sure how to do this yet
// TODO: add more routes - maybe for reviews later?

// start server
const PORT = 5000; // hardcoded for now
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
    console.log('Try accessing http://localhost:' + PORT);
});