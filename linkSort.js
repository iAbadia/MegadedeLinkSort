// Define Node creator function
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

// Get online links
var online = document.getElementById('online');
var onlineLinks = online.getElementsByTagName('a');

// Insert new section at the beginning
var st = online.getElementsByTagName('h4')
var h = document.createElement("H4");
var t = document.createTextNode("Sorted Hosts");
h.appendChild(t);
online.insertBefore(h, st[0]);

// Sort and keep HD quality online (class: quality-2)
var onlineSortArray = []
for (var i = 0; i < onlineLinks.length; i += 1) {
    if (onlineLinks[i].className.includes('quality-2')) {
        onlineSortArray.push(createElementFromHTML(onlineLinks[i].outerHTML));
    }
}

// Insert links
for (var i = 0; i < onlineSortArray.length; i += 1) {
    online.insertBefore(onlineSortArray[i], st[1]);
}