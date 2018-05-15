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

// Type must be 'online' or 'download' (Online/Download link list IDs)
function sortLinks(type) {
    // Retrieve selected quality, lang and subs.
    chrome.storage.local.get(['quality', 'lang', 'subs'], function (items) {
        linkQuality = items.quality;
        linkLang = items.lang;
        linkSubs = items.subs;

        // Get links
        var linksContainer = document.getElementById(type);
        var links = linksContainer.getElementsByClassName('aporte');
        links = Array.from(links);  // Convert HTMLCollection to JS Array

        // Check for no links
        if (links.length == 0) {
            return;
        }

        // Insert new section at the beginning
        var st = linksContainer.getElementsByTagName('h4')
        var h = document.createElement("H4");
        h.id = 'sorted-links';
        var t = document.createTextNode("Sorted Hosts");
        h.appendChild(t);
        linksContainer.insertBefore(h, st[0]);

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
        console.log(links);
        for (var i = 0; i < links.length; i += 1) {
            // Get flags
            console.log(links[i].getElementsByClassName('language'));
            console.log(i);
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
        if (links.length > 0) {
            for (var i = 0; i < links.length; i += 1) {
                linksContainer.insertBefore(createElementFromHTML(links[i].outerHTML), st[1]);
            }
        } else {
            linksContainer.insertBefore(createElementFromHTML('<p> No links matching criteria </p>'), st[1]);
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
                if (document.getElementById('sorted-links') == null) {
                    // Sort links
                    sortLinks('online');
                    sortLinks('download');
                }
            }
        }
    });
}

// Start checkLinks loop
setInterval(checkLinks, 1000);