const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '..', 'public')));

const users = [];

// Register endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.json({ success: false, message: 'All fields are required.' });
    }

    // Check if the user already exists
    const userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
        return res.json({ success: false, message: 'User already exists.' });
    }

    // Add new user
    users.push(req.body);
    res.json({ success: true });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: 'Invalid username or password.' });
    }
});

// Logout endpoint
app.post('/logout', (req, res) => {
    res.json({ success: true });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
