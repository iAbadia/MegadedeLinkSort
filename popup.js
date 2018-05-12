// Update storage
function changeQuality(quality) {
    chrome.storage.local.set({ 'quality': quality }, function (items) {
        // Update selected button
        resetButtonsStyle();
    });
};

// Reset buttons style and set selected
function resetButtonsStyle() {
    document.getElementById('low-button').className = "button";
    document.getElementById('high-button').className = "button";
    document.getElementById('hd-button').className = "button";

    initButtons();
}

// Initialisation
function initButtons() {
    // Retrieve quality and set button style
    chrome.storage.local.get(['quality'], function (items) {
        if (items.quality == 'quality-0') {
            document.getElementById('low-button').classList.add("button-selected");
        } else if (items.quality == 'quality-1') {
            document.getElementById('high-button').classList.add("button-selected");
        } else if (items.quality == 'quality-2') {
            document.getElementById('hd-button').classList.add("button-selected");
        }
    });
}

// Set onclik listeners
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('low-button').addEventListener("click", function () { changeQuality("quality-0") });
    document.getElementById('high-button').addEventListener("click", function () { changeQuality("quality-1") });
    document.getElementById('hd-button').addEventListener("click", function () { changeQuality("quality-2") });

    initButtons();
});