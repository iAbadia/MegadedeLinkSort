// Notify update to content-script
var notifyUpdate;   // Will be assigned to one of the vendor-specific functions
// Chrome-specific notify function
function notifyUpdateChrome(msg) {
    chrome.tabs.query({ url: "https://www.megadede.com/*" }, function (tabs) {
        if (tabs.length > 0) {
            for (let i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, { action: msg });
            }
        }
    });
}
// Firefox specific notify function
function notifyUpdateFirefox(msg) {
    browser.tabs.query({ currentWindow: true }).then(function (tabs) {
        if (tabs.length > 0) {
            for (let i = 0; i < tabs.length; i++) {
                browser.tabs.sendMessage(tabs[i].id, { action: msg }).catch(function (err) { return undefined; });
            }
        }
    });
}

// Update active
function changeActive() {
    chrome.storage.local.get('globalConfig', function (it) {
        // By default set active
        it.globalConfig.active = it.globalConfig.active == undefined ? true : !it.globalConfig.active;

        chrome.storage.local.set({ 'globalConfig': it.globalConfig }, function (items) {
            // Change switch state
            document.getElementById('myonoffswitch').checked = it.globalConfig.active;
            // Update buttons
            resetButtonsStyle();
            // Notify content script to update list (only when disabling)
            // When enabling the content script will kick in in less than 1sec
            if (!it.globalConfig.active) {    // If (previously) active (meaning now disabled)
                notifyUpdate("disable");
            }
        });
    });
}

// Update Sync state
function changeSync() {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
        // Get peli/serie name
        var url = tabs[0].url;
        var urlSplit = url.split("/");
        var urlType = urlSplit[urlSplit.length - 2];
        var urlName = urlSplit[urlSplit.length - 1];
        // Get sync JSON
        chrome.storage.local.get('sync', function (items) {
            console.log(items.sync);
            var syncJson = items.sync == undefined ? { 'serie': {}, 'peli': {} } : items.sync;
            // Create serie/peli obj if undefined
            if (syncJson[urlType][urlName] == undefined) { syncJson[urlType][urlName] = {}; }
            // New value for sync
            var newVal = !(syncJson[urlType][urlName].enable == undefined || syncJson[urlType][urlName].enable);
            syncJson[urlType][urlName].enable = newVal;
            // If no set config, set global (Callback Hell...)
            if (syncJson[urlType][urlName].config == undefined) {
                syncJson[urlType][urlName].config = {};
                chrome.storage.local.get('globalConfig', function (it) {
                    syncJson[urlType][urlName].config.active = it.globalConfig.active;
                    syncJson[urlType][urlName].config.quality = it.globalConfig.quality;
                    syncJson[urlType][urlName].config.lang = it.globalConfig.lang;
                    syncJson[urlType][urlName].config.subs = it.globalConfig.subs;
                    // Save new JSON
                    chrome.storage.local.set({ 'sync': syncJson }, function (items) {
                        // Update buttons
                        resetButtonsStyle();
                        // Notify content script to update list (only when disabling)
                        // When enabling the content script will kick in in less than 1sec
                        notifyUpdate("sync");
                    });
                });
            } else {
                // Save new JSON
                chrome.storage.local.set({ 'sync': syncJson }, function (items) {
                    // Update buttons
                    resetButtonsStyle();
                    // Notify content script to update list (only when disabling)
                    // When enabling the content script will kick in in less than 1sec
                    notifyUpdate("sync");
                });
            }
        });
    });
}

// Update quality
function changeQuality(quality) {
    chrome.storage.local.get('globalConfig', function (it) {
        it.globalConfig.quality = quality;
        chrome.storage.local.set({ 'globalConfig': it.globalConfig }, function (items) {
            // Update buttons
            resetButtonsStyle();
            // Notify content script to update list
            notifyUpdate("quality");
        });
    });
};

// Update language
function changeLang(lang) {
    chrome.storage.local.get('globalConfig', function (it) {
        it.globalConfig.lang = lang;
        chrome.storage.local.set({ 'globalConfig': it.globalConfig }, function (items) {
            // Update buttons
            resetButtonsStyle();
            // Notify content script to update list
            notifyUpdate("language");
        });
    });
};

// Update subs
function changeSubs(subs) {
    chrome.storage.local.get('globalConfig', function (it) {
        it.globalConfig.subs = subs;
        chrome.storage.local.set({ 'globalConfig': it.globalConfig }, function (items) {
            // Update buttons
            resetButtonsStyle();
            // Notify content script to update list
            notifyUpdate("subtitles");
        });
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
    chrome.storage.local.get('globalConfig', function (it) {
        // First time it wont exist
        if (it.globalConfig == undefined) { it.globalConfig = {}; }

        // If its not defined, changeActive will set it to true
        if (it.globalConfig.active == undefined) {
            changeActive();
            it.globalConfig.active = true;
        }

        // Set state
        document.getElementById('myonoffswitch').checked = it.globalConfig.active;

        // Set transition once initial value assigned
        // Little hack: Wait 250ms, enough for HTML to load. This way we avoid switches visually updating on every load.
        setTimeout(function () { document.getElementById('myonoffswitch-label').classList.add('onoffswitch-label-anim'); }, 250);

        // Retrieve quality and set button style
        switch (it.globalConfig.quality) {
            case 'any':
                document.getElementById('qua-any-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            case 'quality-0':
                document.getElementById('qua-low-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            case 'quality-1':
                document.getElementById('qua-high-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            case 'quality-2':
                document.getElementById('qua-hd-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            default:
                break;
        }

        // Retrieve lang and set button style
        switch (it.globalConfig.lang) {
            case 'any':
                document.getElementById('lang-any-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            case 'esp':
                document.getElementById('lang-esp-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            case 'eng':
                document.getElementById('lang-eng-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            case 'lat':
                document.getElementById('lang-lat-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            default:
                break;
        }

        // Retrieve subs and set button style
        switch (it.globalConfig.subs) {
            case 'any':
                document.getElementById('subs-any-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            case 'esp':
                document.getElementById('subs-esp-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            case 'eng':
                document.getElementById('subs-eng-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            case 'none':
                document.getElementById('subs-none-button').classList.add(it.globalConfig.active ? "button-selected" : "button-selected-unactive");
                break;
            default:
                break;
        }
    });
}

// Initial config
document.addEventListener('DOMContentLoaded', function () {
    // Button configuration
    chrome.storage.local.get('globalConfig', function (items) {
        if (items.globalConfig == undefined) {
            // Initialise values
            chrome.storage.local.set({ 'globalConfig': {'active': true, 'quality': 'any', 'lang': 'any', 'subs': 'any'} }, function (items) {
                initButtons();
            });
        } else {
            initButtons();
        }
    });

    // Set click listeners
    document.getElementById('myonoffswitch').addEventListener("click", function () { changeActive() });
    document.getElementById('sync-obj').onload = function() {   // Wait for Object to load svg to set the click listener
        document.getElementById('sync-obj').contentDocument.getElementById('sync-svg').addEventListener("click", function () { changeSync() });
    }

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

    // Set notify callback function (vendor specific)
    let isChrome = navigator.userAgent.indexOf("Chrome") != -1;
    let isFirefox = navigator.userAgent.indexOf("Firefox") != -1;

    if (isChrome) {
        notifyUpdate = notifyUpdateChrome;
    } else if (isFirefox) {
        notifyUpdate = notifyUpdateFirefox;
    } else {
        console.error("SOMETHING IS VERY WRONG...");
    }
});