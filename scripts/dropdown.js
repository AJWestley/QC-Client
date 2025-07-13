document.addEventListener("click", function (event) {
    // Close all dropdowns first
    document.querySelectorAll(".dropdown").forEach(dropdown => {
        // If the click is outside the dropdown, close it
        if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("show");
        }
    });

    // If the clicked element is a dropdown button, toggle only that one
    if (event.target.closest(".dropdown > button")) {
        const clickedDropdown = event.target.closest(".dropdown");
        clickedDropdown.classList.toggle("show");
    }
});