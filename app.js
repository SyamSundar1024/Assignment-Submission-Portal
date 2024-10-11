const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
connectDB();
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/admins', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server running on port $PORT');
});