import { getStorageObject } from "./storage-utils.js"

const storage = getStorageObject();

function initCrtDefaultSettings() {
    storage.setItem("crtEnabled", "true"); // true, false
    storage.setItem("crtFilterType", "crt-dot-mask"); // crt-dot-mask, crt-shadow-mask

    storage.setItem("crtAnimJitterDiff", "1px"); // Any CSS size
    storage.setItem("crtFlickerColour", "#12101033"); // Hex colour with alpha
    storage.setItem("crtPreBlur", "1.5px"); // Any CSS size
    storage.setItem("crtPostBrightness", "1.5"); // float

    storage.setItem("__is_crt_init__", "true");
}

// Create and append overlays as divs, takes string for CRT filter class name
function appendCrtOverlay(crtFilterType) {
    // Create divs to be appended
    let divCrtPreBlur = document.createElement("div");
    let divCrtFilter = document.createElement("div");
    let divCrtPostBrightness = document.createElement("div");
    let divCrtFlicker = document.createElement("div");

    // Apply appropriate classes
    divCrtPreBlur.classList.add("screen-filter", "crt-pre-blur");
    divCrtFilter.classList.add("screen-filter", crtFilterType);
    divCrtPostBrightness.classList.add("screen-filter", "crt-post-brightness");
    divCrtFlicker.classList.add("screen-filter", "crt-flicker");

    // Finally, append all children to bottom of body
    document.body.append(divCrtPreBlur, divCrtFilter, divCrtPostBrightness, divCrtFlicker);
}

// Applies Jitter to any <div> with the id "content"
// If content is not present, move all children of <body> into a new content div
// All future appended nodes must be put into the content <div>
function applyJitter() {
    let content = document.getElementById("content");

    if (!content) {
        content = document.createElement("div");
        content.id = "content";

        // Loop over each child and reparent them
        while (true) {
            let child = document.body.firstChild;

            if (!child) break;

            console.log(child);
            content.appendChild(child);
        }

        document.body.appendChild(content);
    }

    content.classList.add("crt-interlacing-jitter");
}

// Applies settings to HTML, does not init settings if they are not initialized
function applyCrtStyle(storageObj) {
    let root = document.querySelector(":root");

    // Set CSS properties
    root.style.setProperty(
        "--crt-anim-jitter-diff",
        storageObj.getItem("crtAnimJitterDiff")
    );
    root.style.setProperty(
        "--crt-flicker-colour",
        storageObj.getItem("crtFlickerColour")
    );
    root.style.setProperty(
        "--crt-pre-blur",
        storageObj.getItem("crtPreBlur")
    );
    root.style.setProperty(
        "--crt-post-brightness",
        storageObj.getItem("crtPostBrightness")
    );
}

// Sets style properties to CSS and appends filters
function applyCrtSettings() {
    if (!storage) return; // Does nothing if storage fails
    if (storage.getItem("__is_crt_init__") !== "true") initCrtDefaultSettings();

    applyCrtStyle(storage);

    if (storage.getItem("crtEnabled") === "true") {
        let filterType = storage.getItem("crtFilterType");

        applyJitter();
        appendCrtOverlay(filterType);
    }
}

// Finally, apply everything
applyCrtSettings();