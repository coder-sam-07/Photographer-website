const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
const port = 3000;
const secretKey = "your_secret_key"; // Use a strong key in production

// Middleware
// app.use(cors());
app.use(cors({ origin: "*" }));

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

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });

// ✅ Forgot Password Route
app.post("/forgot-password", (req, res) => {
    console.log("Forgot Password API Hit! Request Body:", req.body);  // ✅ Debug Log
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    
    const token = crypto.randomBytes(20).toString("hex");
    const expirationTime = Date.now() + 3600000; // 1 hour expiry

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err || results.length === 0) {
            console.log("Email not found:", email);  // ✅ Debug Log
            return res.status(400).json({ message: "Email not found" });
        }

        const updateQuery = "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?";
        db.query(updateQuery, [token, expirationTime, email], (err) => {
            if (err) {
                console.log("Error updating token:", err);
                return res.status(500).json({ message: "Error updating token" });
            }

            console.log("Reset link sent to:", email);
            sendResetEmail(email, token);
            res.json({ message: "Password reset link sent to your email" });
        });
    });
});

// ✅ Reset Password Route
app.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;

    const query = "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?";
    db.query(query, [token, Date.now()], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updateQuery = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?";

        db.query(updateQuery, [hashedPassword, token], (err) => {
            if (err) return res.status(500).json({ success: false, message: "Error updating password" });

            res.json({ success: true, message: "Password reset successful!" });
        });
    });
});

// ✅ Function to Send Email via EmailJS
// const nodemailer = require("nodemailer");

function sendResetEmail(email, token) {
    const resetLink = `http://127.0.0.1:5500/reset-password.html?token=${token}`;

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",  // If you're using Gmail
        auth: {
            user: "sameershedge77100@gmail.com",  // Your Gmail address
            pass: "thkd lfxd pzga ellf"  // Your Gmail App Password (not your regular password)
        }
    });

    // Email options
    const mailOptions = {
        from: "Your Name <your_email@gmail.com>",
        to: email,
        subject: "Password Reset Request",
        text: `Click the following link to reset your password: ${resetLink}`,
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
}

// function sendResetEmail(email, token) {
//     const resetLink = `http://127.0.0.1:5500/reset-password.html?token=${token}`;

//     var templateParams = {
//         to_email: email,
//         reset_link: resetLink
//     };

//     emailjs.send("service_wzp23z1", "template_ej859im", templateParams, "ONwAQ7QktSh2tVIiY")
//         .then(response => console.log("Email sent:", response))
//         .catch(error => console.error("Error sending email:", error));
// }

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

