// Update quality
function changeQuality(quality) {
    chrome.storage.local.set({ 'quality': quality }, function (items) {
        // Update selected button
        resetButtonsStyle();
    });
};

// Update language
function changeLang(language) {
    chrome.storage.local.set({ 'lang': language }, function (items) {
        // Update selected button
        resetButtonsStyle();
    });
};

// Update subs
function changeSubs(subs) {
    chrome.storage.local.set({ 'subs': subs }, function (items) {
        // Update selected button
        resetButtonsStyle();
    });
};

// Reset buttons style and set selected
function resetButtonsStyle() {
    document.getElementById('qua-any-button').className = "button";
    document.getElementById('qua-low-button').className = "button";
    document.getElementById('qua-high-button').className = "button";
    document.getElementById('qua-hd-button').className = "button";

    document.getElementById('lang-any-button').className = "button";
    document.getElementById('lang-esp-button').className = "button";
    document.getElementById('lang-eng-button').className = "button";
    document.getElementById('lang-lat-button').className = "button";

    document.getElementById('subs-any-button').className = "button";
    document.getElementById('subs-esp-button').className = "button";
    document.getElementById('subs-eng-button').className = "button";
    document.getElementById('subs-none-button').className = "button";

    initButtons();
}

// Initialisation
function initButtons() {
    // Retrieve quality and set button style
    chrome.storage.local.get(['quality'], function (items) {
        switch (items.quality) {
            case 'any':
                document.getElementById('qua-any-button').classList.add("button-selected");
                break;
            case 'quality-0':
                document.getElementById('qua-low-button').classList.add("button-selected");
                break;
            case 'quality-1':
                document.getElementById('qua-high-button').classList.add("button-selected");
                break;
            case 'quality-2':
                document.getElementById('qua-hd-button').classList.add("button-selected");
                break;
            default:
                break;
        }
    });

    // Retrieve lang and set button style
    chrome.storage.local.get(['lang'], function (items) {
        switch (items.lang) {
            case 'any':
                document.getElementById('lang-any-button').classList.add("button-selected");
                break;
            case 'esp':
                document.getElementById('lang-esp-button').classList.add("button-selected");
                break;
            case 'eng':
                document.getElementById('lang-eng-button').classList.add("button-selected");
                break;
            case 'lat':
                document.getElementById('lang-lat-button').classList.add("button-selected");
                break;
            default:
                break;
        }
    });

    // Retrieve subs and set button style
    chrome.storage.local.get(['subs'], function (items) {
        switch (items.subs) {
            case 'any':
                document.getElementById('subs-any-button').classList.add("button-selected");
                break;
            case 'esp':
                document.getElementById('subs-esp-button').classList.add("button-selected");
                break;
            case 'eng':
                document.getElementById('subs-eng-button').classList.add("button-selected");
                break;
            case 'none':
                document.getElementById('subs-none-button').classList.add("button-selected");
                break;
            default:
                break;
        }
    });
}

// Set onclik listeners
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('qua-any-button').addEventListener("click", function () { changeQuality("any") });
    document.getElementById('qua-low-button').addEventListener("click", function () { changeQuality("quality-0") });
    document.getElementById('qua-high-button').addEventListener("click", function () { changeQuality("quality-1") });
    document.getElementById('qua-hd-button').addEventListener("click", function () { changeQuality("quality-2") });

    document.getElementById('lang-any-button').addEventListener("click", function () { changeLang("any") });
    document.getElementById('lang-esp-button').addEventListener("click", function () { changeLang("esp") });
    document.getElementById('lang-eng-button').addEventListener("click", function () { changeLang("eng") });
    document.getElementById('lang-lat-button').addEventListener("click", function () { changeLang("lat") });

    document.getElementById('subs-any-button').addEventListener("click", function () { changeSubs("any") });
    document.getElementById('subs-esp-button').addEventListener("click", function () { changeSubs("esp") });
    document.getElementById('subs-eng-button').addEventListener("click", function () { changeSubs("eng") });
    document.getElementById('subs-none-button').addEventListener("click", function () { changeSubs("none") });

    initButtons();
});