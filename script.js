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


