// Define Node creator function
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

// Map saved lang value to HTML src image name
function toLang(lang) {
    switch (lang) {
        case 'esp':
            return 'spanish.png';
            break;
        case 'eng':
            return 'english.png';
            break;
        case 'lat':
            return 'latino.png';
            break;
        default:
            return null;
            break;
    }
}

// Create sorted links section
function createSortedLinksSection(type) {
    // Get links container
    var linksContainer = document.getElementById(type);

    // Create sortedHosts container
    var sortedHostsContainer = document.createElement("div");
    sortedHostsContainer.id = "pls-sorted-hosts-container-" + type;
    sortedHostsContainer.classList.add("pls-sorted-hosts-container");

    // Create and insert title + tooltip
    var titleWrap = document.createElement("div");      // Create wrapper for title + tooltip
    titleWrap.id = "pls-title-wrap-" + type;
    titleWrap.classList.add("pls-title-wrap");

    var h = document.createElement("H4");               // Create HTML elements
    var p = document.createElement("p");
    var tooltip = document.createElement("span");

    h.id = 'pls-title-sorted-links-' + type;                    // Assign some IDs
    h.classList.add("pls-title-sorted-links");
    p.id = 'pls-title-info-tooltip-' + type;
    p.classList.add("pls-title-info-tooltip");
    tooltip.id = "pls-title-info-tooltip-text-" + type;
    tooltip.classList.add("pls-title-info-tooltip-text");

    titleWrap.appendChild(h);                           // Title + tooltip inside wrapper
    titleWrap.appendChild(p);

    var t = document.createTextNode("Sorted Hosts");    // Create inside-text nodes
    var infoTooltip = document.createTextNode("");
    var tooltipText = document.createTextNode("Plusdede Link Sort Extension");

    tooltip.appendChild(tooltipText);                   // Insert text into hidden span
    p.appendChild(infoTooltip);                         // Insert tooltip text into tooltip
    p.appendChild(tooltip);                             // Insert hidden span into tooltip
    h.appendChild(t);                                   // Insert Title text into title
    sortedHostsContainer.appendChild(titleWrap);

    // Create cotainer for links
    var sortedLinksContainer = document.createElement("div");   // Where links will be
    sortedLinksContainer.id = "pls-sorted-links-container-" + type;
    sortedLinksContainer.classList.add("pls-sorted-links-container");
    sortedHostsContainer.appendChild(sortedLinksContainer);

    // Insert before first (default) title
    var st = linksContainer.getElementsByTagName('h4')  // Get titles
    linksContainer.insertBefore(sortedHostsContainer, st[0]);
}

// Type must be 'online' or 'download' (Online/Download link list IDs)
function sortLinks(type) {
    // Retrieve selected quality, lang and subs.
    chrome.storage.local.get(['quality', 'lang', 'subs'], function (items) {
        linkQuality = items.quality;
        linkLang = items.lang;
        linkSubs = items.subs;

        // Get sorted links container
        var linksContainer = document.getElementById(type);
        var links = linksContainer.getElementsByClassName('aporte');
        links = Array.from(links);  // Convert HTMLCollection to JS Array

        // Check for no links
        if (links.length == 0) {
            return;
        }

        // Sort by quality
        if (linkQuality != 'any') {
            for (var i = 0; i < links.length; i += 1) {
                if (!links[i].className.includes(linkQuality)) {
                    // Remove from array
                    links.splice(i, 1);
                    i -= 1; // Counter-update index
                }
            }
        }

        // Sort by Lang and sub
        for (var i = 0; i < links.length; i += 1) {
            // Get flags
            var langSubsFlags = links[i].getElementsByClassName('language')[0].getElementsByTagName('img');

            // Check lang
            if (linkLang != 'any') {
                if (!langSubsFlags[0].src.includes(toLang(linkLang))) {
                    links.splice(i, 1);
                    i -= 1; // Counter-update index (we just altered the array length)
                    continue;   // Link removed, don't care about subs
                }
            }

            // Check subs
            if (linkSubs != 'any') {
                // Remove if no subs but some sub selected OR sub selected but not matching lang
                if ((langSubsFlags.length == 1 && linkSubs != 'none') ||
                    (langSubsFlags.length > 1 && !langSubsFlags[1].src.includes(toLang(linkSubs)))) {
                    links.splice(i, 1);
                    i -= 1; // Counter-update index (we just altered the array length)
                }
            }
        }

        // Insert links
        var sortedLinksContainer = document.getElementById("pls-sorted-links-container-" + type);
        if (links.length > 0) {
            for (var i = 0; i < links.length; i += 1) {
                sortedLinksContainer.appendChild(createElementFromHTML(links[i].outerHTML));
            }
        } else {
            let noLinksWarn = createElementFromHTML('<p> No links matching criteria </p>');
            noLinksWarn.className = "alert alert-warning";  // Classes from Plusdede's css
            sortedLinksContainer.appendChild(noLinksWarn);
        }
    });
}

function checkLinks() {
    // Check if sorting active
    chrome.storage.local.get(['active'], function (items) {
        if (items.active == undefined || items.active) {
            var popupaportes = document.getElementsByClassName('popup-aportes');
            // Check if links loaded
            if (popupaportes.length != 0) {
                // Check if already sorted
                if (document.getElementById('pls-title-sorted-links-online') == null) { // Could test for either online or download
                    // Sort links
                    createSortedLinksSection('online');
                    createSortedLinksSection('download');
                    sortLinks('online');
                    sortLinks('download');
                }
            }
        }
    });
}

// Start checkLinks loop
setInterval(checkLinks, 1000);

// Updates listener
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        sendResponse({ ok: true });
    });