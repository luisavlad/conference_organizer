const express = require('express');
const conferenceRoutes = require('../routes/conferenceRoutes');
const articleRoutes = require('../routes/articleRoutes');
const userRoutes = require('../routes/userRoutes');
const reviewRoutes = require('../routes/reviewRoutes');
const commentRoutes = require('../routes/commentRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/conferences', conferenceRoutes);
app.use('/api', articleRoutes);
app.use('/api', reviewRoutes);
app.use('/api', commentRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Conference Organizer API' });
});

module.exports = app;
