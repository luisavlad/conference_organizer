const express = require('express');
const conferenceRoutes = require('../routes/conference');
const articleRoutes = require('../routes/article');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/conferences', conferenceRoutes);
app.use('/api', articleRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Conference Organizer API' });
});

module.exports = app;
