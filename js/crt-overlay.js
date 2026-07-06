import { storage } from "./storage-utils.js";

// Data class
export class CrtOverlaySettings {
    static ENABLED = "crtEnabled";
    static FOCUS_TYPE = "crtFocusType";
    static ANIM_JITTER_DIFF = "crtAnimJitterDiff";
    static FLICKER_COLOUR = "crtFlickerColour";
    static PRE_BLUR = "crtPreBlur";
    static POST_BRIGHTNESS = "crtPostBrightness";

    constructor(
        enabled,
        focusType,

        animJitterDiff,
        flickerColour,
        preBlur,
        postBrightness
    ) {
        this.enabled = enabled;
        this.focusType = focusType;

        this.animJitterDiff = animJitterDiff;
        this.flickerColour = flickerColour;
        this.preBlur = preBlur;
        this.postBrightness = postBrightness;
    }

    static getCSSPropName(key) {
        switch (key) {
            case(this.ANIM_JITTER_DIFF): return "--crt-anim-jitter-diff";
            case(this.FLICKER_COLOUR): return "--crt-flicker-colour";
            case(this.PRE_BLUR): return "--crt-pre-blur";
            case(this.POST_BRIGHTNESS): return "--crt-post-brightness";
        }
    }
}

// Simulating an enum of available focus types, string matches css class
export class CrtOverlayFocusType {
    static TRIAD_MASK = "crt-triad-mask";
    static SLOT_MASK = "crt-slot-mask";
    static APERTURE_GRILLE = "crt-aperture-grille";
}

function crtOverlayInitDefaultSettings() {
    storage.setItem("crtEnabled", "true"); // true, false
    storage.setItem("crtFocusType", CrtOverlayFocusType.TRIAD_MASK);

    storage.setItem("crtAnimJitterDiff", "0"); // Any CSS size
    storage.setItem("crtFlickerColour", "#12101000"); // Hex colour with alpha
    storage.setItem("crtPreBlur", "1"); // Any CSS size
    storage.setItem("crtPostBrightness", "2.5"); // float

    storage.setItem("__is_crt_init__", "true");
}

export function crtOverlayFetchSettings() {
    if (!storage) return; // Returns null if storage fails
    if (storage.getItem("__is_crt_init__") !== "true") crtOverlayInitDefaultSettings();

    return new CrtOverlaySettings(
        storage.getItem("crtEnabled"),
        storage.getItem("crtFocusType"),

        storage.getItem("crtAnimJitterDiff"),
        storage.getItem("crtFlickerColour"),
        storage.getItem("crtPreBlur"),
        storage.getItem("crtPostBrightness")
    )
}

export function crtOverlaySetStorageItem(key, val) {
    storage.setItem(key, val);

    switch (key) {
        case CrtOverlaySettings.ANIM_JITTER_DIFF:
        case CrtOverlaySettings.FLICKER_COLOUR:
        case CrtOverlaySettings.PRE_BLUR:
        case CrtOverlaySettings.POST_BRIGHTNESS:
            let root = document.querySelector(":root");
            if (key === CrtOverlaySettings.ANIM_JITTER_DIFF || key === CrtOverlaySettings.PRE_BLUR) {
                val += "px";
            }
            root.style.setProperty(CrtOverlaySettings.getCSSPropName(key), val);
            break;
        case CrtOverlaySettings.ENABLED:
            let settings = crtOverlayFetchSettings();
            if (val === "true") {
                applyJitter();
                appendCrtOverlay(settings.focusType);
            } else removeCrtOverlay();
            break;
        case CrtOverlaySettings.FOCUS_TYPE:
            updateFocusType(val);
            break;
    }
}

function updateFocusType(type) {
    let filter = document.getElementById("crtFilter");

    if (filter) {
        filter.className = "screen-filter";
        filter.classList.add(type);
    }
}

// Create and append overlays as divs, takes string for CRT filter class name
function appendCrtOverlay(crtFocusType) {
    // Create divs to be appended
    let divCrtPreBlur = document.createElement("div");
    let divCrtFilter = document.createElement("div");
    let divCrtPostBrightness = document.createElement("div");
    let divCrtFlicker = document.createElement("div");

    // Apply appropriate classes
    divCrtPreBlur.classList.add("screen-filter", "crt-pre-blur");
    divCrtFilter.classList.add("screen-filter", crtFocusType);
    divCrtPostBrightness.classList.add("screen-filter", "crt-post-brightness");
    divCrtFlicker.classList.add("screen-filter", "crt-flicker");

    // IDs of course
    divCrtPreBlur.id = "crtPreBlur";
    divCrtFilter.id = "crtFilter";
    divCrtPostBrightness.id = "crtPostBrightness";
    divCrtFlicker.id = "crtFlicker";

    // Finally, append all children to bottom of body
    document.body.append(divCrtPreBlur, divCrtFilter, divCrtPostBrightness, divCrtFlicker);
}

function removeCrtOverlay(removeJitter) {
    let divCrtPreBlur = document.getElementById("crtPreBlur");
    let divCrtFilter = document.getElementById("crtFilter");
    let divCrtPostBrightness = document.getElementById("crtPostBrightness");
    let divCrtFlicker = document.getElementById("crtFlicker");

    if (divCrtPreBlur) divCrtPreBlur.remove();
    if (divCrtFilter) divCrtFilter.remove();
    if (divCrtPostBrightness) divCrtPostBrightness.remove();
    if (divCrtFlicker) divCrtFlicker.remove();

    if (removeJitter) removeJitter();
}

// Applies Jitter to any <div> with the id "content"
// If content is not present, move all children of <body> into a new content div
// All future appended nodes must be put into the content <div>
// TODO: Consider just making it default to put in a div
function applyJitter() {
    let content = document.getElementById("content");

    if (!content) {
        content = document.createElement("div");
        content.id = "content";

        // Loop over each child and reparent them
        while (true) {
            let child = document.body.firstChild;

            if (!child) break;

            content.appendChild(child);
        }
        
        document.body.appendChild(content);
    }

    content.classList.add("crt-interlacing-jitter");
}

function removeJitter() {
    let content = document.getElementById("content");

    if (content) {
        while (true) {
            let child = content.firstChild;

            if (!child) break;

            document.body.appendChild(child);
        }

        content.remove();
    }
}

// Applies settings to HTML, does not init settings if they are not initialized
function applyCrtStyle(settings) {
    let root = document.querySelector(":root");

    // Set CSS properties
    root.style.setProperty(
        "--crt-anim-jitter-diff",
        settings.animJitterDiff + "px"
    );
    root.style.setProperty(
        "--crt-flicker-colour",
        settings.flickerColour
    );
    root.style.setProperty(
        "--crt-pre-blur",
        settings.preBlur + "px"
    );
    root.style.setProperty(
        "--crt-post-brightness",
        settings.postBrightness
    );
}

// Sets style properties to CSS and appends filters
export function crtOverlayApplySettings() {
    let settings = crtOverlayFetchSettings();

    applyCrtStyle(settings);

    if (settings.enabled === "true") {
        applyJitter();
        removeCrtOverlay(false); // Just in case
        appendCrtOverlay(settings.focusType);
    }
}

window.crtOverlaySetDefault = function() {
    storage.setItem("__is_crt_init__", "false");
    crtOverlayApplySettings();
}

// Finally, apply everything
crtOverlayApplySettings();