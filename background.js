chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "newupdate.html"}, function (tab) {
        console.log("New tab launched with http://yoursite.com/");
    });
});