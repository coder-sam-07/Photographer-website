document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("bookingModal");
    const bookButtons = document.querySelectorAll(".book-btn");
    const closeButton = document.querySelector(".close-btn");

    bookButtons.forEach(button => {
        button.addEventListener("click", function () {
            modal.style.display = "flex";
        });
    });

    closeButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
