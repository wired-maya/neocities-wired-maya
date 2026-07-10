// Call from onclick using `this` as the argument
function copyCode(button) {
    button.textContent = "Copied?!";

    let parent = button.parentNode;
    let content = parent.getElementsByClassName("code-content");
    let text = content[0].textContent;

    navigator.clipboard.writeText(text).then(
        () => { console.log(`Successfully copied to clipboard:\n${text}`) },
        () => { console.log("Cannot copy to clipboard!") },
    );
}

window.copyCode = function(button) { copyCode(button) }