const jwt = require('jsonwebtoken');
const express = require('express');
 const bcrypt = require('bcrypt');


const router = express.Router();

// 1. USER LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await req.db.get("SELECT * FROM users WHERE username = ?", [username]);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }  
        
        const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ 
        token, 
        username: user.username 
    });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
});


router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); 
        await req.db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword]
        );
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
