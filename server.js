const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;
const secretKey = "your_secret_key"; // Use a strong key in production

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",  // Change if you have a password
    database: "user_db"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// 🔹 Register Route
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(query, [email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Email already exists or error occurred" });
        }
        res.json({ success: true, message: "Registration successful! You can now log in." });
    });
});

// 🔹 Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: "1h" });

        res.json({ success: true, message: "Login successful!", token });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
