// Define Node creator function
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

// Type must be 'online' or 'download'
function sortLinks(type) {
    // Retrieve selected quality
    chrome.storage.local.get(['quality'], function (items) {
        linkQuality = items.quality;

        // Get links
        var linksContainer = document.getElementById(type);
        var links = linksContainer.getElementsByTagName('a');

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

        // Sort and keep HD quality online (class: quality-2)
        var linkSortArray = []
        for (var i = 0; i < links.length; i += 1) {
            if (links[i].className.includes(linkQuality)) {
                linkSortArray.push(createElementFromHTML(links[i].outerHTML));
            }
        }

        // Insert links
        for (var i = 0; i < linkSortArray.length; i += 1) {
            linksContainer.insertBefore(linkSortArray[i], st[1]);
        }
    });
}

function checkLinks() {
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
    setTimeout(checkLinks, 1000);
}

// Set Timeout function to check if links are displayed
setTimeout(checkLinks, 1000);