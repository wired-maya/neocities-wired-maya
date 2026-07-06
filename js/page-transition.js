import { storage } from "./storage-utils.js";

export class PageTransitionSettings {
    static ENABLED = "transitionEnabled";
    static ANIM_JITTER_DIFF = "transitionAnimJitterDiff";

    constructor(
        enabled,
        animJitterDiff
    ) {
        this.enabled = enabled;
        this.animJitterDiff = animJitterDiff;
    }

    static getCSSPropName(key) {
        switch (key) {
            case(this.ANIM_JITTER_DIFF): return "--crt-anim-jitter-diff-page-load";
        }
    }
}

function pageTransitionInitDefaultSettings() {
    storage.setItem("transitionEnabled", "true"); // true, false
    storage.setItem("transitionAnimJitterDiff", "75"); // Any CSS size

    storage.setItem("__is_transition_init__", "true");
}

export function pageTransitionFetchSettings() {
    if (!storage) return; // Returns null if storage fails
    if (storage.getItem("__is_transition_init__") !== "true") pageTransitionInitDefaultSettings();

    return new PageTransitionSettings(
        storage.getItem("transitionEnabled"),
        storage.getItem("transitionAnimJitterDiff"),
    )
}

export function pageTransitionSetStorageItem(key, val) {
    storage.setItem(key, val);

    let root = document.querySelector(":root");

    switch (key) {
        case PageTransitionSettings.ANIM_JITTER_DIFF:
            
            if (key === PageTransitionSettings.ANIM_JITTER_DIFF) {
                val += "px";
            }
            root.style.setProperty(PageTransitionSettings.getCSSPropName(key), val);
            break;
        case PageTransitionSettings.ENABLED:
            root.style.setProperty(PageTransitionSettings.getCSSPropName(PageTransitionSettings.ANIM_JITTER_DIFF), "0px");
            break;
    }
}

// Applies settings to HTML, does not init settings if they are not initialized
function applyTransitionStyle(settings) {
    let root = document.querySelector(":root");

    // Set CSS properties
    root.style.setProperty(
        "--crt-anim-jitter-diff-page-load",
        settings.animJitterDiff + "px"
    );
}

export function pageTransitionApplySettings() {
    let settings = pageTransitionFetchSettings();

    applyTransitionStyle(settings);

    if (settings.enabled === "false") {
        let root = document.querySelector(":root");
        root.style.setProperty(PageTransitionSettings.getCSSPropName(PageTransitionSettings.ANIM_JITTER_DIFF), "0px");
    }
}

window.pageTransitionSetDefault = function() {
    storage.setItem("__is_transition_init__", "false");
    pageTransitionApplySettings();
}

// Finally, apply everything
pageTransitionApplySettings();