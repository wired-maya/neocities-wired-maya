import { fetchCrtOverlaySettings, setStorageItem, CrtOverlaySettings } from "./crt-overlay.js"

function overlayCheckUpdateField(doStorageItem) {
    let checkbox = document.getElementById("crtOverlayCheck");
    let fieldset = document.getElementById("crtOverlayFieldset");
    let legend = document.getElementById("crtOverlayLegend");

    fieldset.disabled = !checkbox.checked;

    legend.classList.toggle("legend-enabled", checkbox.checked);

    if (doStorageItem) {
        let string;

        if (checkbox.checked) string = "true";
        else string = "false";

        setStorageItem(CrtOverlaySettings.ENABLED, string)
    }
}

// Populate settings page with the values in storage
function overlayPopulateSettings() {
    let enabledCheckbox = document.getElementById("crtOverlayCheck");
    let focusSelect = document.getElementById("crtOverlayFocusSelect");
    let jitterNum = document.getElementById("crtOverlayJitter");
    let flickerNum = document.getElementById("crtOverlayFlicker");
    let preBlurNum = document.getElementById("crtOverlayPreBlur");
    let postBrightNum = document.getElementById("crtOverlayPostBright");

    let settings = fetchCrtOverlaySettings();

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
    overlayCheckUpdateField(false);
}

// Expose to global scope
window.overlayCheckUpdateField = function () { overlayCheckUpdateField(true); }
window.overlayUpdateField = function(key, val) {
    // Slider only updates alpha
    if (key == CrtOverlaySettings.FLICKER_COLOUR) val = "#121010" + parseInt(val).toString(16);
    setStorageItem(key, val);
}

overlayPopulateSettings();