document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("bookingModal");
    const bookButtons = document.querySelectorAll(".book-btn");
    const closeButtons = document.querySelectorAll(".close-btn");

    bookButtons.forEach(button => {
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

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
