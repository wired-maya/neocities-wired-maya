import { crtOverlayFetchSettings, crtOverlaySetStorageItem, CrtOverlaySettings } from "./crt-overlay.js"
import { pageTransitionFetchSettings, pageTransitionSetStorageItem, PageTransitionSettings } from "./page-transition.js"

//===== CRT OVERLAY =====//

function crtOverlayCheckUpdateField(doStorageItem) {
    let checkbox = document.getElementById("crtOverlayCheck");
    let fieldset = document.getElementById("crtOverlayFieldset");
    let legend = document.getElementById("crtOverlayLegend");

    fieldset.disabled = !checkbox.checked;

    legend.classList.toggle("legend-enabled", checkbox.checked);

    if (doStorageItem) {
        let string;

        if (checkbox.checked) string = "true";
        else string = "false";

        crtOverlaySetStorageItem(CrtOverlaySettings.ENABLED, string)
    }
}

// Populate settings page with the values in storage
function crtOverlayPopulateSettings() {
    let enabledCheckbox = document.getElementById("crtOverlayCheck");
    let focusSelect = document.getElementById("crtOverlayFocusSelect");
    let jitterNum = document.getElementById("crtOverlayJitter");
    let flickerNum = document.getElementById("crtOverlayFlicker");
    let preBlurNum = document.getElementById("crtOverlayPreBlur");
    let postBrightNum = document.getElementById("crtOverlayPostBright");

    let settings = crtOverlayFetchSettings();

    // Apply settings!
    enabledCheckbox.checked = settings.enabled == "true";
    focusSelect.value = settings.focusType;
    jitterNum.value = settings.animJitterDiff;
    preBlurNum.value = settings.preBlur;
    postBrightNum.value = settings.postBrightness;

    // Update flicker intensity, since colour is not an option (at least for now)
    // just get the max alpha
    let flickerHex = settings.flickerColour.substring(7);
    flickerNum.value = parseInt(flickerHex, 16);

    // Update visual properties based on settings
    crtOverlayCheckUpdateField(false);
}

// Expose to global scope
window.crtOverlayCheckUpdateField = function () { crtOverlayCheckUpdateField(true); }
window.crtOverlayUpdateField = function(key, val) {
    // Slider only updates alpha
    if (key == CrtOverlaySettings.FLICKER_COLOUR) val = "#121010" + parseInt(val).toString(16);
    crtOverlaySetStorageItem(key, val);
}

crtOverlayPopulateSettings();

//===== PAGE TRANSITIONS =====//

function pageTransitionCheckUpdateField(doStorageItem) {
    let checkbox = document.getElementById("pageTransitionCheck");
    let fieldset = document.getElementById("pageTransitionFieldset");
    let legend = document.getElementById("pageTransitionLegend");

    fieldset.disabled = !checkbox.checked;

    legend.classList.toggle("legend-enabled", checkbox.checked);

    if (doStorageItem) {
        let string;

        if (checkbox.checked) string = "true";
        else string = "false";

        pageTransitionSetStorageItem(PageTransitionSettings.ENABLED, string)
    }
}

function pageTransitionPopulateSettings() {
    let enabledCheckbox = document.getElementById("pageTransitionCheck");
    let jitterNum = document.getElementById("pageTransitionJitter");

    let settings = pageTransitionFetchSettings();

    // Apply settings!
    enabledCheckbox.checked = settings.enabled == "true";
    jitterNum.value = settings.animJitterDiff;

    // Update visual properties based on settings
    pageTransitionCheckUpdateField(false);
}

window.pageTransitionCheckUpdateField = function () { pageTransitionCheckUpdateField(true); }
window.pageTransitionUpdateField = function(key, val) {
    pageTransitionSetStorageItem(key, val);
}

pageTransitionPopulateSettings();