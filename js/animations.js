function initAnimationLinks() {
    document.querySelectorAll("a").forEach((element) => {
        element.addEventListener("mouseenter", () => {
            element.classList.add("animate-width-scrub");
        });

        element.addEventListener("animationend", () => {
            element.classList.remove("animate-width-scrub");
            console.log("test");
        })
    });

}

initAnimationLinks();