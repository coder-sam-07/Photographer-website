document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("bookingModal");
    const successModal = document.getElementById("successMessage");
    const closeButtons = document.querySelectorAll(".close-btn");
    const form = document.querySelector("#bookingModal form");

    document.querySelectorAll(".book-btn").forEach(button => {
        button.addEventListener("click", function () {
            modal.style.display = "flex";
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            modal.style.display = "none";
            successModal.style.display = "none";
        });
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const selectedService = document.querySelector('input[name="service"]:checked');

        if (!selectedService) {
            alert("Please select a service before submitting!");
            return;
        }

        const data = {
            name: formData.get("name"),
            contact: formData.get("contact"),
            email: formData.get("email"),
            event_name: formData.get("event_name"),
            event_venue: formData.get("event_venue"),
            service: selectedService.value,
            special_request: formData.get("special_request"),
        };

        // Send email using EmailJS
        emailjs.send("service_zqu8pc8", "template_njizbxw", data)
        .then(response => {
            console.log("Email sent successfully", response);
            modal.style.display = "none";
            successModal.style.display = "flex";
            form.reset();
        })
        .catch(error => console.error("Error sending email:", error));
    });
});

function closeSuccessMessage() {
    document.getElementById("successMessage").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve stored user details
    const userDetails = document.getElementById("userDetails");
    if (userDetails) {
        let username = localStorage.getItem("username") || "Admin"; // Replace with actual login data
        userDetails.innerText = username;
    } else {
        console.warn("userDetails element not found.");
    }

    // Profile Dropdown Toggle
    const profileIcon = document.getElementById("profileIcon");
    const profileDropdown = document.getElementById("profileDropdown");

    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener("click", function (event) {
            event.stopPropagation();
            profileDropdown.classList.toggle("active");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function (event) {
            if (!profileIcon.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.classList.remove("active");
            }
        });
    } else {
        console.error("Profile icon or dropdown not found!");
    }

    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("username"); // Clear stored user data
            window.location.href = "index.html"; // Redirect to login page
        });
    } else {
        console.error("Logout button not found!");
    }
});

// app.get("/", (req, res) => {
//     res.send("Server is running...");
// });

// const express = require("express");
// const mysql = require("mysql");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");

// const app = express();
// const port = 3000;  // ✅ Port Defined
// // const cors = require("cors");
// app.use(cors({ origin: "http://127.0.0.1:5500/forgot-password.html" }));  // ✅ Allow frontend to call API
// // app.use(cors());
// app.use(express.json());
// // Check if server is running
// app.get("/", (req, res) => {
//     res.send("Server is running...");
// });

// // MySQL Database Connection
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "user_db"
// });

// db.connect(err => {
//     if (err) console.error("Database connection failed:", err);
//     else console.log("Connected to MySQL database");
// });

// app.get("/", (req, res) => {
//     res.send("Server is running...");
// });

// // ✅ Forgot Password Route
// app.post("/forgot-password", (req, res) => {
//     console.log("Forgot Password API Hit! Request Body:", req.body);  // ✅ Debug Log
//     const { email } = req.body;
//     if (!email) {
//         return res.status(400).json({ message: "Email is required" });
//     }
    
//     const token = crypto.randomBytes(20).toString("hex");
//     const expirationTime = Date.now() + 3600000; // 1 hour expiry

//     const query = "SELECT * FROM users WHERE email = ?";
//     db.query(query, [email], (err, results) => {
//         if (err || results.length === 0) {
//             console.log("Email not found:", email);  // ✅ Debug Log
//             return res.status(400).json({ message: "Email not found" });
//         }

//         const updateQuery = "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?";
//         db.query(updateQuery, [token, expirationTime, email], (err) => {
//             if (err) {
//                 console.log("Error updating token:", err);
//                 return res.status(500).json({ message: "Error updating token" });
//             }

//             console.log("Reset link sent to:", email);
//             sendResetEmail(email, token);
//             res.json({ message: "Password reset link sent to your email" });
//         });
//     });
// });

// // ✅ Reset Password Route
// app.post("/reset-password", async (req, res) => {
//     const { token, password } = req.body;

//     const query = "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?";
//     db.query(query, [token, Date.now()], async (err, results) => {
//         if (err || results.length === 0) {
//             return res.status(400).json({ success: false, message: "Invalid or expired token" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const updateQuery = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?";

//         db.query(updateQuery, [hashedPassword, token], (err) => {
//             if (err) return res.status(500).json({ success: false, message: "Error updating password" });

//             res.json({ success: true, message: "Password reset successful!" });
//         });
//     });
// });

// // ✅ Function to Send Email via EmailJS
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

// // Start Server
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });

// Handle Admin modal popup
const adminLink = document.querySelector('#profileDropdown a[href="#"]');
const adminModal = document.getElementById('adminModal');
const closeAdminModal = document.getElementById('closeAdminModal');

adminLink.addEventListener('click', (e) => {
  e.preventDefault();
  adminModal.style.display = 'block';
});

closeAdminModal.addEventListener('click', () => {
  adminModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target == adminModal) {
    adminModal.style.display = 'none';
  }
});
