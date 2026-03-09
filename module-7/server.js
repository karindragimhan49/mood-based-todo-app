const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/blogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blogs.html'));
});

app.get('/blog/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'singleBlog.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adminDashboard.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
