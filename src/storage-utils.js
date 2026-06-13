// Tests if a given storage system is available, based on Mozilla's example
// Takes string with contents "localStorage" or "sessionStorage"
// Returns true if storage of the given type is available, otherwise false
function isStorageAvailable(type) {
    let storage;

    try {
        storage = window[type];

        // Due to non-standard browser implementations, you need to actually try to use the storage
        const test = "__storage_test__";
        storage.setItem(test, test);
        storage.removeItem(test);

        return true;
    } catch (e) {
        return e instanceof DOMException && // Continue checks if this is the right type of exception
            e.name === "QuotaExceededError" && // Continue to check whether the error is legitimate
            storage && // Return false if there is no storage available
            storage.length !== 0; // If quota is actually exceeded, this would return 0
    }
}

// Returns localStorage if available, otherwise sessionStore, or null if neither are available
export function getStorageObject() {
    if (isStorageAvailable("localStorage")) return window.localStorage;
    if (isStorageAvailable("sessionStorage")) return window.sessionStorage;

    return null;
}