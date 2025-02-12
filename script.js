document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("bookingModal");
    const successModal = document.getElementById("successMessage");
    const closeButton = document.querySelector(".close-btn");
    const form = document.getElementById("bookingForm");

    document.querySelectorAll(".book-btn").forEach(button => {
        button.addEventListener("click", function () {
            modal.style.display = "flex";
        });
    });

    closeButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(form);

        fetch("send_email.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            modal.style.display = "none";
            successModal.style.display = "flex";
            form.reset();
        })
        .catch(error => console.error("Error:", error));
    });
});

function closeSuccessMessage() {
    document.getElementById("successMessage").style.display = "none";
}
